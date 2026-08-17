"use client";

import { useRouter } from "next/navigation";
import { MOCK_MATCHING_ID, MOCK_MATCH_PROFILE } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import type { MatchingStatus } from "@/features/matching/types";

const STAGES: { label: string; status: MatchingStatus; href: string }[] = [
  { label: "노매칭", status: "none", href: "/home" },
  { label: "탐색중", status: "searching", href: "/home" },
  { label: "매칭 발견", status: "found", href: "/home" },
  {
    label: "상대 프로필",
    status: "found",
    href: `/matching/${MOCK_MATCHING_ID}/attempts/${MOCK_MATCH_PROFILE.attemptId}`,
  },
  { label: "결제", status: "payment_pending", href: `/matching/${MOCK_MATCHING_ID}/payment` },
  { label: "확정", status: "confirmed", href: "/home" },
  { label: "완료", status: "completed", href: "/home" },
];

export default function MatchingStageJumper() {
  const router = useRouter();
  const setStatus = useMatchingDraftStore((state) => state.setStatus);

  return (
    <div className="fixed left-4 top-1/2 z-[100] flex -translate-y-1/2 flex-col gap-1.5 rounded-2xl bg-black/80 p-3 text-white shadow-lg backdrop-blur-sm">
      <span className="px-1 text-[11px] font-semibold text-white/60">매칭 단계 테스트</span>
      {STAGES.map((stage) => (
        <button
          key={stage.label}
          type="button"
          onClick={() => {
            setStatus(stage.status);
            router.push(stage.href);
          }}
          className="rounded-lg px-3 py-1.5 text-left text-xs hover:bg-white/10"
        >
          {stage.label}
        </button>
      ))}
    </div>
  );
}
