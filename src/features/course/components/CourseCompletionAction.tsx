"use client";

import { CheckCircle2 } from "lucide-react";
import { useRequestCourseCompletion } from "@/features/course/api/useCourseApi";
import type { CompletionRequestState } from "@/features/course/api/types";
import { ApiError } from "@/lib/api/client";

type CourseCompletionActionProps = {
  courseId: string;
  completionRequest: CompletionRequestState;
};

// 당일 "여행 완료하기" 버튼. 내가 누르면 상대에게 알림이 가고, 둘 다 누르면 코스가
// 완료된다(추억영상·스탬프·포인트, 다시 매칭 가능) — 완료 자체는 useRequestCourseCompletion의
// 쿼리 무효화로 코스 상세가 다시 조회되면서 자연히 반영된다(별도 성공 화면을 안 둔 이유).
export default function CourseCompletionAction({ courseId, completionRequest }: CourseCompletionActionProps) {
  const request = useRequestCourseCompletion(courseId);
  const { mine, partner, available } = completionRequest;

  if (mine) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-light">
          <CheckCircle2 size={18} strokeWidth={1.5} className="text-forest" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">완료 요청을 보냈어요</p>
          <p className="text-xs text-muted">상대방도 완료 버튼을 누르면 여행이 마무리돼요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-cream-card p-4">
      <p className="text-sm font-medium text-ink">
        {partner
          ? "상대방이 완료 버튼을 눌렀어요! 나도 눌러서 마무리해요."
          : "여행이 끝났다면 버튼을 눌러 완료해보세요"}
      </p>
      {!partner ? (
        <p className="text-xs text-muted">
          서로 완료 버튼을 누르면 올린 사진과 한마디를 바탕으로 AI가 추억 영상을 만들어드려요.
        </p>
      ) : null}
      {!available ? (
        <p className="text-xs text-muted">사진 2장 이상에 한마디를 남겨야 완료할 수 있어요.</p>
      ) : null}

      <button
        type="button"
        onClick={() => request.mutate()}
        disabled={!available || request.isPending}
        className="rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        {request.isPending ? "처리 중..." : "여행 완료하기"}
      </button>

      {request.isError ? (
        <p className="text-xs text-red-500">
          {request.error instanceof ApiError ? request.error.message : "완료 처리에 실패했어요."}
        </p>
      ) : null}
    </div>
  );
}
