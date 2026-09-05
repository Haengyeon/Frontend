"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import provincesGeoJson from "@/features/course/data/skorea-provinces.json";
import municipalitiesGeoJson from "@/features/course/data/skorea-municipalities.json";
import { PROVINCE_CODE_TO_REGION } from "@/features/course/mocks";
import { createProjection, featureCentroid, featureToPath } from "@/features/course/lib/geo";
import type { ProvinceFeatureCollection } from "@/features/course/lib/geo";

const provinces = provincesGeoJson as ProvinceFeatureCollection;
const municipalities = municipalitiesGeoJson as ProvinceFeatureCollection;
const MAP_WIDTH = 400;
const MIN_SCALE = 1;
const MAX_SCALE = 8;
const DISTRICT_LABEL_MIN_SCALE = 2;

// Labels are sized/measured in "on-screen" units (roughly CSS px, since the
// viewBox width tracks the rendered container width) so their legibility
// doesn't grow or shrink with zoom — only the map underneath them does.
const DISTRICT_LABEL_SIZE = 6;
const PROVINCE_LABEL_SIZE = 8;
const CHAR_WIDTH_FACTOR = 0.95;
const LINE_HEIGHT_FACTOR = 1.3;

type RegionColorMapProps = {
  visitedCodes: Set<string>;
};

export default function RegionColorMap({ visitedCodes }: RegionColorMapProps) {
  const { project, width, height } = useMemo(
    () => createProjection(municipalities.features, MAP_WIDTH),
    [],
  );

  // Path/centroid geometry only depends on the projection, not on the current
  // pan/zoom transform — precompute once so dragging doesn't re-run these on
  // every pointer-move frame.
  const districtShapes = useMemo(
    () =>
      municipalities.features.map((feature) => ({
        feature,
        d: featureToPath(feature, project),
        centroid: featureCentroid(feature, project),
      })),
    [project],
  );

  const provinceShapes = useMemo(
    () =>
      provinces.features.map((feature) => ({
        feature,
        d: featureToPath(feature, project),
        centroid: featureCentroid(feature, project),
      })),
    [project],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const dragState = useRef<{ pointerId: number; startX: number; startY: number; origin: { x: number; y: number } } | null>(
    null,
  );

  // Greedily keep the largest districts' labels and drop any candidate whose
  // on-screen footprint would overlap one already accepted — otherwise dense
  // clusters (e.g. Seoul's gu's) render as an unreadable pile of text.
  const visibleDistrictLabels = useMemo(() => {
    if (transform.scale <= DISTRICT_LABEL_MIN_SCALE) return [];

    const ranked = [...districtShapes].sort((a, b) => b.centroid.area - a.centroid.area);
    const accepted: { sx: number; sy: number; halfW: number; halfH: number }[] = [];
    const result: typeof ranked = [];

    for (const candidate of ranked) {
      const sx = candidate.centroid.x * transform.scale;
      const sy = candidate.centroid.y * transform.scale;
      const halfW = (candidate.feature.properties.name.length * DISTRICT_LABEL_SIZE * CHAR_WIDTH_FACTOR) / 2;
      const halfH = (DISTRICT_LABEL_SIZE * LINE_HEIGHT_FACTOR) / 2;

      const overlaps = accepted.some(
        (a) => Math.abs(sx - a.sx) < halfW + a.halfW && Math.abs(sy - a.sy) < halfH + a.halfH,
      );

      if (!overlaps) {
        accepted.push({ sx, sy, halfW, halfH });
        result.push(candidate);
      }
    }

    return result;
  }, [districtShapes, transform.scale]);

  const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

  const zoomBy = (factor: number) => {
    setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale * factor) }));
  };

  const reset = () => setTransform({ scale: 1, x: 0, y: 0 });

  const toSvgDelta = (pixelDx: number, pixelDy: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return { dx: 0, dy: 0 };
    const unitsPerPixel = width / rect.width;
    return { dx: pixelDx * unitsPerPixel, dy: pixelDy * unitsPerPixel };
  };

  const handlePointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (transform.scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin: { x: transform.x, y: transform.y },
    };
  };

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const { dx, dy } = toSvgDelta(e.clientX - drag.startX, e.clientY - drag.startY);
    setTransform((prev) => ({ ...prev, x: drag.origin.x + dx, y: drag.origin.y + dy }));
  };

  const handlePointerUp = (e: PointerEvent<SVGSVGElement>) => {
    if (dragState.current?.pointerId === e.pointerId) dragState.current = null;
  };

  // React attaches onWheel as a passive listener, so preventDefault() there can't
  // stop the page from scrolling underneath the map. Register a native listener
  // with { passive: false } instead so pinch/scroll-to-zoom doesn't scroll the page.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, []);

  const districtLabelOpacity = Math.min(1, transform.scale - DISTRICT_LABEL_MIN_SCALE);
  const provinceLabelOpacity = Math.max(0, 1 - (transform.scale - 1) / 2);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-line">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none"
        style={{ aspectRatio: `${width} / ${height}` }}
        role="img"
        aria-label="방문한 지역 지도"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}>
          {districtShapes.map(({ feature, d }) => {
            const visited = visitedCodes.has(feature.properties.code);

            return (
              <path
                key={feature.properties.code}
                d={d}
                className={visited ? "fill-forest" : "fill-forest-light"}
                stroke="var(--color-cream)"
                strokeWidth={0.4 / transform.scale}
              />
            );
          })}

          {provinceShapes.map(({ feature, d }) => (
            <path
              key={feature.properties.code}
              d={d}
              fill="none"
              stroke="var(--color-cream)"
              strokeWidth={1.5 / transform.scale}
            />
          ))}

          {districtLabelOpacity > 0
            ? visibleDistrictLabels.map(({ feature, centroid }) => {
                const visited = visitedCodes.has(feature.properties.code);

                return (
                  <text
                    key={feature.properties.code}
                    x={centroid.x}
                    y={centroid.y}
                    textAnchor="middle"
                    fontSize={DISTRICT_LABEL_SIZE / transform.scale}
                    opacity={districtLabelOpacity}
                    className={visited ? "fill-white" : "fill-ink/70"}
                  >
                    {feature.properties.name}
                  </text>
                );
              })
            : null}

          {provinceLabelOpacity > 0
            ? provinceShapes.map(({ feature, centroid }) => {
                const regionName = PROVINCE_CODE_TO_REGION[feature.properties.code];

                return (
                  <text
                    key={feature.properties.code}
                    x={centroid.x}
                    y={centroid.y}
                    textAnchor="middle"
                    fontSize={PROVINCE_LABEL_SIZE / transform.scale}
                    fontWeight={600}
                    className="fill-ink"
                    opacity={provinceLabelOpacity}
                  >
                    {regionName ?? feature.properties.name}
                  </text>
                );
              })
            : null}
        </g>
      </svg>

      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 rounded-xl bg-white/90 p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => zoomBy(1.4)}
          aria-label="확대"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink"
        >
          <ZoomIn size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.4)}
          aria-label="축소"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink"
        >
          <ZoomOut size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="초기화"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink"
        >
          <RotateCcw size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
