"use client";

import { useState } from "react";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useRegenerateCourse } from "@/features/course/api/useCourseApi";
import { ApiError } from "@/lib/api/client";

export default function CourseRegenerateDevPanel() {
  const matchAttemptId = useMatchingDraftStore((state) => state.matchAttemptId);
  const [inputValue, setInputValue] = useState("");
  const regenerate = useRegenerateCourse();

  const handleRegenerate = () => {
    const value = inputValue.trim() || matchAttemptId;
    if (!value) return;
    regenerate.mutate(value);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-56 flex-col gap-1.5 rounded-2xl bg-black/80 p-3 text-white shadow-lg backdrop-blur-sm">
      <span className="px-1 text-[11px] font-semibold text-white/60">[개발용] 코스 재생성</span>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={matchAttemptId ?? "matchAttemptId"}
        className="rounded-lg bg-white/10 px-2 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleRegenerate}
        disabled={regenerate.isPending || (!inputValue.trim() && !matchAttemptId)}
        className="rounded-lg bg-white/10 px-3 py-1.5 text-left text-xs hover:bg-white/20 disabled:opacity-40"
      >
        {regenerate.isPending ? "생성 중..." : "코스 재생성"}
      </button>
      {regenerate.isSuccess ? (
        <span className="px-1 text-[10px] text-green-300">생성됨: {regenerate.data.id}</span>
      ) : null}
      {regenerate.isError ? (
        <span className="px-1 text-[10px] text-red-300">
          {regenerate.error instanceof ApiError ? regenerate.error.message : "재생성 실패"}
        </span>
      ) : null}
    </div>
  );
}
