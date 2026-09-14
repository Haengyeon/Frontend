"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  MOCK_MATCHING_STAGES,
  MOCK_COURSE_STAGES,
  DevMockStageScreen,
  type MockStageKey,
} from "./mockStagePreviews";

export default function MatchingStageJumper() {
  const [selected, setSelected] = useState<MockStageKey | null>(null);

  return (
    <>
      <div className="fixed left-4 top-1/2 z-[100] flex w-56 -translate-y-1/2 flex-col gap-1.5 rounded-2xl bg-black/80 p-3 text-white shadow-lg backdrop-blur-sm">
        <span className="px-1 text-[11px] font-semibold text-white/60">
          매칭 단계 테스트 (mock)
        </span>
        {MOCK_MATCHING_STAGES.map((stage) => (
          <button
            key={stage.key}
            type="button"
            onClick={() => setSelected(stage.key)}
            className="rounded-lg px-3 py-1.5 text-left text-xs hover:bg-white/10"
          >
            {stage.label}
          </button>
        ))}

        <span className="mt-2 px-1 text-[11px] font-semibold text-white/60">코스 테스트 (mock)</span>
        {MOCK_COURSE_STAGES.map((stage) => (
          <button
            key={stage.key}
            type="button"
            onClick={() => setSelected(stage.key)}
            className="rounded-lg px-3 py-1.5 text-left text-xs hover:bg-white/10"
          >
            {stage.label}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[150] flex justify-center bg-black/40">
          <div className="relative flex h-full w-full max-w-md flex-col bg-cream shadow-xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="미리보기 닫기"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={16} strokeWidth={2} />
            </button>
            <DevMockStageScreen stageKey={selected} />
          </div>
        </div>
      ) : null}
    </>
  );
}
