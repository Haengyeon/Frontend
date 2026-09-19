"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, MapPinOff, Route } from "lucide-react";
import type { CourseSpot } from "@/features/course/api/types";
import { loadKakaoMaps } from "@/features/course/lib/kakaoMap";

// globals.css의 --color-forest. 카카오 Polyline은 CSS 변수를 읽지 못한다.
const FOREST = "#3b4b36";
// 가장자리 마커가 잘리지 않게 둘 여백(px)
const BOUNDS_PADDING = 56;
// 마커를 누르면 지도 높이의 위쪽 30% 지점으로 옮긴다 — 하단 시트에 가리지 않게.
const FOCUS_Y_RATIO = 0.3;

type CourseRouteMapProps = {
  spots: CourseSpot[];
  selectedSpotId: string;
  onSelectSpot: (spotId: string) => void;
  onMapClick: () => void;
};

function toLatLng(spot: CourseSpot) {
  return new kakao.maps.LatLng(spot.latitude, spot.longitude);
}

function fitRoute(map: kakao.maps.Map, spots: CourseSpot[]) {
  const bounds = new kakao.maps.LatLngBounds();
  spots.forEach((spot) => bounds.extend(toLatLng(spot)));
  map.setBounds(bounds, BOUNDS_PADDING, BOUNDS_PADDING, BOUNDS_PADDING, BOUNDS_PADDING);
}

function focusSpot(map: kakao.maps.Map, spot: CourseSpot) {
  const projection = map.getProjection();
  const point = projection.containerPointFromCoords(toLatLng(spot));
  // 중심을 마커보다 이만큼 아래로 잡으면 마커가 FOCUS_Y_RATIO 높이에 온다.
  const shiftY = map.getNode().clientHeight * (0.5 - FOCUS_Y_RATIO);
  map.panTo(projection.coordsFromContainerPoint(new kakao.maps.Point(point.x, point.y + shiftY)));
}

export default function CourseRouteMap({
  spots,
  selectedSpotId,
  onSelectSpot,
  onMapClick,
}: CourseRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // 처음 받은 코스로 한 번만 경로 전체를 맞춘다 — 인증샷 업로드로 spots가 다시 와도 보던 화면을 유지한다.
  const initialSpotsRef = useRef(spots);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadKakaoMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const initialSpots = initialSpotsRef.current;
        const instance = new kakao.maps.Map(containerRef.current, {
          center: toLatLng(initialSpots[0]),
          level: 5,
        });
        fitRoute(instance, initialSpots);
        setMap(instance);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 흰 테두리 위에 점선을 겹쳐 어떤 배경 위에서도 동선이 보이게 한다.
  useEffect(() => {
    if (!map) return;
    const path = spots.map(toLatLng);
    const lines = [
      new kakao.maps.Polyline({ map, path, strokeWeight: 8, strokeColor: "#ffffff", strokeOpacity: 0.9 }),
      new kakao.maps.Polyline({
        map,
        path,
        strokeWeight: 4,
        strokeColor: FOREST,
        strokeOpacity: 1,
        strokeStyle: "shortdash",
      }),
    ];
    return () => lines.forEach((line) => line.setMap(null));
  }, [map, spots]);

  useEffect(() => {
    if (!map) return;
    kakao.maps.event.addListener(map, "click", onMapClick);
    return () => kakao.maps.event.removeListener(map, "click", onMapClick);
  }, [map, onMapClick]);

  // 컨테이너 크기가 바뀌면 relayout을 불러야 지도가 어긋나지 않는다(카카오 가이드).
  useEffect(() => {
    if (!map) return;
    const observer = new ResizeObserver(() => map.relayout());
    observer.observe(map.getNode());
    return () => observer.disconnect();
  }, [map]);

  return (
    <div className="relative h-[55svh] min-h-80 overflow-hidden rounded-2xl border border-line bg-forest-light">
      {/* isolate: 카카오 내부 z-index를 이 안에 가둬서 위에 얹는 버튼이 지도 밑으로 깔리지 않게 한다 */}
      <div ref={containerRef} className="isolate h-full w-full" />

      {map
        ? spots.map((spot) => (
            <SpotOverlay
              key={spot.id}
              map={map}
              spot={spot}
              selected={spot.id === selectedSpotId}
              onSelect={() => {
                focusSpot(map, spot);
                onSelectSpot(spot.id);
              }}
            />
          ))
        : null}

      {map ? (
        <button
          type="button"
          onClick={() => fitRoute(map, spots)}
          className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm"
        >
          <Route size={14} strokeWidth={1.5} />
          전체 경로
        </button>
      ) : failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream-card text-center">
          <MapPinOff size={24} strokeWidth={1.5} className="text-muted" />
          <p className="text-sm text-muted">지도를 불러오지 못했어요</p>
        </div>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-forest-light" />
      )}
    </div>
  );
}

type SpotOverlayProps = {
  map: kakao.maps.Map;
  spot: CourseSpot;
  selected: boolean;
  onSelect: () => void;
};

// 마커는 CustomOverlay가 지도에 붙이는 DOM 노드에 portal로 그린다.
function SpotOverlay({ map, spot, selected, onSelect }: SpotOverlayProps) {
  const [node] = useState(() => document.createElement("div"));
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const { latitude, longitude } = spot;

  useEffect(() => {
    const overlay = new kakao.maps.CustomOverlay({
      map,
      position: new kakao.maps.LatLng(latitude, longitude),
      content: node,
      clickable: true,
    });
    overlayRef.current = overlay;
    return () => overlay.setMap(null);
  }, [map, node, latitude, longitude]);

  // 선택된 마커의 이름표가 옆 마커 밑에 깔리지 않게 올린다.
  useEffect(() => {
    overlayRef.current?.setZIndex(selected ? 2 : 1);
  }, [selected]);

  return createPortal(
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${spot.order}번 ${spot.name}`}
      aria-pressed={selected}
      className="relative block"
    >
      <span
        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-forest text-sm font-bold text-white shadow-md transition-transform duration-200 ${
          selected ? "scale-125 ring-4 ring-forest/25" : ""
        }`}
      >
        {spot.order}
        {spot.mission.photoUploaded ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-forest shadow">
            <Check size={10} strokeWidth={3} />
          </span>
        ) : null}
      </span>
      {selected ? (
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink shadow-md">
          {spot.name}
        </span>
      ) : null}
    </button>,
    node,
  );
}
