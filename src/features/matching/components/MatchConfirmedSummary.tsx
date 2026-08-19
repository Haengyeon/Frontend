"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MatchConfirmedBadge from "@/features/matching/components/MatchConfirmedBadge";
import { getDaysUntilTrip } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function MatchConfirmedSummary() {
  const router = useRouter();
  const { regions, availableDates } = useMatchingDraftStore();
  const dDay = getDaysUntilTrip(availableDates);
  const location = regions[0] ?? "여행지 미정";

  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <MatchConfirmedBadge />
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold text-ink">매칭이 확정되었어요!</p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">
            {dDay === null ? "일정 미정" : `D-${dDay}`}
          </span>
          <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">
            {location}
          </span>
        </div>
      </div>
      <div className="flex w-full gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => router.push("/chat")}>
          채팅하기
        </Button>
        <Button className="flex-1" onClick={() => router.push("/course")}>
          코스 보기
        </Button>
      </div>
    </div>
  );
}
