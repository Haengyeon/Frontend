"use client";

import { X } from "lucide-react";
import MissionCard from "@/features/course/components/MissionCard";
import type { CourseSpot } from "@/features/course/api/types";

type MapSpotSheetProps = {
  courseId: string;
  spot: CourseSpot;
  onClose: () => void;
};

// BottomSheet(모달)를 안 쓰는 이유: 열어둔 채 다른 마커를 눌러야 하고,
// 등장 애니메이션이 끝나면 transform이 안 남아야 MissionCard 안 후기 시트(fixed)가 화면 기준으로 뜬다.
export default function MapSpotSheet({ courseId, spot, onClose }: MapSpotSheetProps) {
  return (
    <section
      aria-label={`${spot.order}번 장소 ${spot.name}`}
      className="fixed inset-x-0 bottom-16 z-40 mx-auto w-full max-w-md animate-sheet-up px-3 pb-3 motion-reduce:animate-none"
    >
      <div className="relative max-h-[50svh] overflow-y-auto overscroll-contain rounded-2xl shadow-[0_-8px_24px_rgba(30,30,26,0.14)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cream text-muted"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
        <MissionCard courseId={courseId} spot={spot} />
      </div>
    </section>
  );
}
