"use client";

import { useState } from "react";
import MissionStoryPath from "@/features/course/components/MissionStoryPath";
import MissionCard from "@/features/course/components/MissionCard";
import CourseViewSwitch, { type CourseView } from "@/features/course/components/CourseViewSwitch";
import CourseRouteMap from "@/features/course/components/CourseRouteMap";
import MapSpotSheet from "@/features/course/components/MapSpotSheet";
import { KAKAO_MAP_KEY } from "@/features/course/lib/kakaoMap";
import type { CourseSpot } from "@/features/course/api/types";

type CourseSpotsPanelProps = {
  courseId: string;
  spots: CourseSpot[];
  isExperience?: boolean;
};

export default function CourseSpotsPanel({ courseId, spots, isExperience = false }: CourseSpotsPanelProps) {
  const [view, setView] = useState<CourseView>("card");
  // 두 뷰가 같이 쓴다 — 지도에서 고른 장소가 카드 뷰로 돌아가도 선택돼 있다.
  const [selectedSpotId, setSelectedSpotId] = useState(spots[0]?.id ?? "");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? spots[0];

  if (!selectedSpot) return null;

  const changeView = (next: CourseView) => {
    setView(next);
    setIsSheetOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">코스 {spots.length}곳</span>
        {/* 키가 없는 환경(팀원 로컬 등)에서 깨진 지도를 띄우지 않게 스위치를 숨긴다 */}
        {KAKAO_MAP_KEY ? <CourseViewSwitch view={view} onChange={changeView} /> : null}
      </div>

      {view === "card" ? (
        <div key="card" className="flex animate-view-in flex-col gap-5 motion-reduce:animate-none">
          <MissionStoryPath spots={spots} selectedSpotId={selectedSpot.id} onSelect={setSelectedSpotId} />
          {/* 장소를 바꾸면 쓰던 한 줄 코멘트가 다른 장소 사진에 붙지 않게 새로 그린다 */}
          <MissionCard
            key={selectedSpot.id}
            courseId={courseId}
            spot={selectedSpot}
            isExperience={isExperience}
          />
        </div>
      ) : (
        <div key="map" className="animate-view-in motion-reduce:animate-none">
          <CourseRouteMap
            spots={spots}
            selectedSpotId={selectedSpot.id}
            onSelectSpot={(spotId) => {
              setSelectedSpotId(spotId);
              setIsSheetOpen(true);
            }}
            onMapClick={() => setIsSheetOpen(false)}
          />
          {isSheetOpen ? (
            <MapSpotSheet
              key={selectedSpot.id}
              courseId={courseId}
              spot={selectedSpot}
              onClose={() => setIsSheetOpen(false)}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
