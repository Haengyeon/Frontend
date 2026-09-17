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
// 시군구를 탭했을 때 최소한 이 배율까지는 확대한다(이미 더 확대돼 있으면 그대로 유지).
const DISTRICT_FOCUS_SCALE = 4.5;
// 탭으로 이동할 때만 잠깐 트랜지션을 켠다 — 드래그/핀치 중에는 손가락과 어긋나 보이므로 끔.
const FOCUS_TRANSITION_MS = 300;

// Labels are sized/measured in "on-screen" units (roughly CSS px, since the
// viewBox width tracks the rendered container width) so their legibility
// doesn't grow or shrink with zoom by default — only the map underneath them does.
// District labels are the one exception: they grow a bit as you approach max
// zoom, from DISTRICT_LABEL_SIZE_BASE up to DISTRICT_LABEL_SIZE_MAX.
const DISTRICT_LABEL_SIZE_BASE = 6;
const DISTRICT_LABEL_SIZE_MAX = 11;
const PROVINCE_LABEL_SIZE = 8;
const CHAR_WIDTH_FACTOR = 0.95;
const LINE_HEIGHT_FACTOR = 1.3;

function districtLabelSizeAt(scale: number): number {
  const progress = Math.min(
    1,
    Math.max(0, (scale - DISTRICT_LABEL_MIN_SCALE) / (MAX_SCALE - DISTRICT_LABEL_MIN_SCALE)),
  );
  return DISTRICT_LABEL_SIZE_BASE + (DISTRICT_LABEL_SIZE_MAX - DISTRICT_LABEL_SIZE_BASE) * progress;
}

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
  // 두 손가락으로 동시에 짚고 있는 포인터들. 핀치 확대/축소 판단에 쓴다.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  // 핀치 시작 시점에 두 손가락 사이 거리·배율과, 두 손가락 중점이 지도 위 어느
  // 지점(스케일/이동과 무관한 원본 좌표)을 짚고 있었는지 저장한다 — 손가락을
  // 움직이는 동안 그 지점이 계속 손가락 중점 밑에 붙어있도록 유지한다.
  const pinchAnchor = useRef<{
    localX: number;
    localY: number;
    initialDistance: number;
    initialScale: number;
  } | null>(null);
  // 드래그/핀치로 실제 움직였는지 기록해서, 팬 동작이 끝나는 탭에서 지역 확대가
  // 잘못 걸리지 않게 한다(포인터가 몇 px만 움직여도 브라우저는 click을 계속 낸다).
  const movedRef = useRef(false);
  const [isFocusing, setIsFocusing] = useState(false);

  // Greedily keep the largest districts' labels and drop any candidate whose
  // on-screen footprint would overlap one already accepted — otherwise dense
  // clusters (e.g. Seoul's gu's) render as an unreadable pile of text.
  const districtLabelSize = districtLabelSizeAt(transform.scale);

  const visibleDistrictLabels = useMemo(() => {
    if (transform.scale <= DISTRICT_LABEL_MIN_SCALE) return [];

    const ranked = [...districtShapes].sort((a, b) => b.centroid.area - a.centroid.area);
    const accepted: { sx: number; sy: number; halfW: number; halfH: number }[] = [];
    const result: typeof ranked = [];

    for (const candidate of ranked) {
      const sx = candidate.centroid.x * transform.scale;
      const sy = candidate.centroid.y * transform.scale;
      const halfW = (candidate.feature.properties.name.length * districtLabelSize * CHAR_WIDTH_FACTOR) / 2;
      const halfH = (districtLabelSize * LINE_HEIGHT_FACTOR) / 2;

      const overlaps = accepted.some(
        (a) => Math.abs(sx - a.sx) < halfW + a.halfW && Math.abs(sy - a.sy) < halfH + a.halfH,
      );

      if (!overlaps) {
        accepted.push({ sx, sy, halfW, halfH });
        result.push(candidate);
      }
    }

    return result;
  }, [districtShapes, transform.scale, districtLabelSize]);

  const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

  const zoomBy = (factor: number) => {
    setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale * factor) }));
  };

  const reset = () => setTransform({ scale: 1, x: 0, y: 0 });

  const focusOnDistrict = (centroid: { x: number; y: number }) => {
    const targetScale = clampScale(Math.max(transform.scale, DISTRICT_FOCUS_SCALE));
    setIsFocusing(true);
    setTransform({
      scale: targetScale,
      x: width / 2 - centroid.x * targetScale,
      y: height / 2 - centroid.y * targetScale,
    });
    window.setTimeout(() => setIsFocusing(false), FOCUS_TRANSITION_MS);
  };

  const toSvgDelta = (pixelDx: number, pixelDy: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return { dx: 0, dy: 0 };
    const unitsPerPixel = width / rect.width;
    return { dx: pixelDx * unitsPerPixel, dy: pixelDy * unitsPerPixel };
  };

  // 화면 좌표(clientX/Y)를 <g> 변환 이전의 viewBox 좌표로 바꾼다.
  const toSvgPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return { x: 0, y: 0 };
    const unitsPerPixel = width / rect.width;
    return { x: (clientX - rect.left) * unitsPerPixel, y: (clientY - rect.top) * unitsPerPixel };
  };

  const beginPinch = () => {
    const [p1, p2] = [...pointers.current.values()];
    const distance = Math.max(Math.hypot(p2.x - p1.x, p2.y - p1.y), 1);
    const midSvg = toSvgPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    pinchAnchor.current = {
      localX: (midSvg.x - transform.x) / transform.scale,
      localY: (midSvg.y - transform.y) / transform.scale,
      initialDistance: distance,
      initialScale: transform.scale,
    };
  };

  const handlePointerDown = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) movedRef.current = false;

    if (pointers.current.size === 2) {
      dragState.current = null;
      movedRef.current = true;
      beginPinch();
      return;
    }

    if (pointers.current.size === 1 && transform.scale > 1) {
      dragState.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origin: { x: transform.x, y: transform.y },
      };
    }
  };

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && pinchAnchor.current) {
      const [p1, p2] = [...pointers.current.values()];
      const distance = Math.max(Math.hypot(p2.x - p1.x, p2.y - p1.y), 1);
      const midSvg = toSvgPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      const { localX, localY, initialDistance, initialScale } = pinchAnchor.current;
      const newScale = clampScale(initialScale * (distance / initialDistance));
      setTransform({ scale: newScale, x: midSvg.x - localX * newScale, y: midSvg.y - localY * newScale });
      return;
    }

    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4) movedRef.current = true;
    const { dx, dy } = toSvgDelta(e.clientX - drag.startX, e.clientY - drag.startY);
    setTransform((prev) => ({ ...prev, x: drag.origin.x + dx, y: drag.origin.y + dy }));
  };

  const handlePointerUp = (e: PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size < 2) pinchAnchor.current = null;

    if (pointers.current.size === 1) {
      const [[pointerId, pos]] = pointers.current;
      dragState.current =
        transform.scale > 1
          ? { pointerId, startX: pos.x, startY: pos.y, origin: { x: transform.x, y: transform.y } }
          : null;
    } else if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null;
    }
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
        <g
          className={isFocusing ? "transition-transform ease-out" : undefined}
          style={isFocusing ? { transitionDuration: `${FOCUS_TRANSITION_MS}ms` } : undefined}
          transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}
        >
          {districtShapes.map(({ feature, d, centroid }) => {
            const visited = visitedCodes.has(feature.properties.code);

            return (
              <path
                key={feature.properties.code}
                d={d}
                className={`cursor-pointer ${visited ? "fill-forest" : "fill-forest-light"}`}
                stroke="var(--color-cream)"
                strokeWidth={0.4 / transform.scale}
                onClick={() => {
                  if (movedRef.current) return;
                  focusOnDistrict(centroid);
                }}
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
                    fontSize={districtLabelSize / transform.scale}
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
