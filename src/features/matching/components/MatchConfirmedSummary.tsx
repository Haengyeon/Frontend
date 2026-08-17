"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MatchConfirmedBadge from "@/features/matching/components/MatchConfirmedBadge";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

function getDDay(availableDates: string[]) {
  if (availableDates.length === 0) return 7;
  const earliest = [...availableDates].sort()[0];
  const target = new Date(`${earliest}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function MatchConfirmedSummary() {
  const router = useRouter();
  const { regions, availableDates } = useMatchingDraftStore();
  const dDay = getDDay(availableDates);
  const location = regions[0] ?? "여행지 미정";

  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <MatchConfirmedBadge />
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold text-ink">매칭이 확정되었어요!</p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">
            D-{dDay}
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
        <Button className="flex-1" onClick={() => router.push("/course/current")}>
          코스 보기
        </Button>
      </div>
    </div>
  );
}
