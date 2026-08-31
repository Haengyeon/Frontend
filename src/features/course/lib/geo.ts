type Ring = [number, number][];
type PolygonCoordinates = Ring[];
type MultiPolygonCoordinates = PolygonCoordinates[];

export type ProvinceFeature = {
  type: "Feature";
  properties: { code: string; name: string; name_eng: string; base_year: string };
  geometry:
    | { type: "Polygon"; coordinates: PolygonCoordinates }
    | { type: "MultiPolygon"; coordinates: MultiPolygonCoordinates };
};

export type ProvinceFeatureCollection = {
  type: "FeatureCollection";
  features: ProvinceFeature[];
};

type Projected = { x: number; y: number };

function forEachCoordinate(feature: ProvinceFeature, visit: (lon: number, lat: number) => void) {
  const polygons =
    feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const [lon, lat] of ring) {
        visit(lon, lat);
      }
    }
  }
}

export function createProjection(features: ProvinceFeature[], width: number) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const feature of features) {
    forEachCoordinate(feature, (lon, lat) => {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    });
  }

  const centerLat = (minLat + maxLat) / 2;
  const latCorrection = Math.cos((centerLat * Math.PI) / 180);

  // Equirectangular projection: longitude is compressed by cos(latitude) so
  // shapes keep roughly correct proportions instead of stretching east-west.
  const planeMinX = minLon * latCorrection;
  const planeMaxX = maxLon * latCorrection;
  const planeWidth = planeMaxX - planeMinX;
  const planeHeight = maxLat - minLat;

  const scale = width / planeWidth;
  const height = planeHeight * scale;

  function project(lon: number, lat: number): Projected {
    return {
      x: (lon * latCorrection - planeMinX) * scale,
      y: (maxLat - lat) * scale,
    };
  }

  return { project, width, height };
}

export function featureToPath(
  feature: ProvinceFeature,
  project: (lon: number, lat: number) => Projected,
) {
  const polygons =
    feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;

  return polygons
    .map((polygon) =>
      polygon
        .map((ring) => {
          const points = ring.map(([lon, lat]) => {
            const { x, y } = project(lon, lat);
            return `${x.toFixed(2)},${y.toFixed(2)}`;
          });
          return `M${points.join("L")}Z`;
        })
        .join(""),
    )
    .join("");
}

// Area-weighted centroid of a single ring (shoelace formula), in projected
// screen space. Falls back to a simple point average for degenerate rings
// (near-zero area) so it never divides by ~0.
function ringCentroid(points: Projected[]) {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < points.length; i++) {
    const { x: x0, y: y0 } = points[i];
    const { x: x1, y: y1 } = points[(i + 1) % points.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  area /= 2;

  if (Math.abs(area) < 1e-9) {
    const n = points.length || 1;
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { area: 0, x: sum.x / n, y: sum.y / n };
  }

  return { area: Math.abs(area), x: cx / (6 * area), y: cy / (6 * area) };
}

// Picks the largest ring (by area) across all polygons — e.g. the mainland
// rather than a small outlying island — and returns its true geometric
// centroid, so labels land inside the shape instead of a bounding-box
// midpoint that can fall outside irregular or multi-part regions.
export function featureCentroid(
  feature: ProvinceFeature,
  project: (lon: number, lat: number) => Projected,
) {
  const polygons =
    feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;

  let best: { area: number; x: number; y: number } | null = null;

  for (const polygon of polygons) {
    const outerRing = polygon[0];
    if (!outerRing || outerRing.length < 3) continue;
    const projected = outerRing.map(([lon, lat]) => project(lon, lat));
    const candidate = ringCentroid(projected);
    if (!best || candidate.area > best.area) best = candidate;
  }

  return best ?? { area: 0, x: 0, y: 0 };
}
