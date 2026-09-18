"use client";

import { useRouter } from "next/navigation";
import { MessageSquareHeart, MessageSquareText } from "lucide-react";
import Button from "@/components/ui/Button";
import type { CourseReviewState } from "@/features/course/api/types";

type PartnerReviewStatusProps = {
  courseId: string;
  dday: number;
  partnerName: string;
  review: CourseReviewState;
};

// 상대 후기는 상호 공개다 — 내가 써야 상대 것이 보인다(서로 눈치보고 베끼는 걸 막기 위함).
// review.receivedPartnerReview 유무로 이미 공개됐는지, partnerReviewArrived로 상대가
// 먼저 썼는지만 판단해서 4가지 상태(안내/작성 버튼/대기/공개된 후기)로 나눠 보여준다.
export default function PartnerReviewStatus({ courseId, dday, partnerName, review }: PartnerReviewStatusProps) {
  const router = useRouter();
  const { myPartnerReview, partnerReviewArrived, receivedPartnerReview } = review;

  if (receivedPartnerReview) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-forest-light p-4">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-forest">
          <MessageSquareHeart size={16} strokeWidth={1.5} />
          {partnerName}님이 남긴 후기
        </span>
        <p className="text-sm leading-relaxed text-ink/80">{receivedPartnerReview.content}</p>
      </div>
    );
  }

  if (myPartnerReview) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-cream-card p-4 text-sm text-muted">
        <MessageSquareText size={16} strokeWidth={1.5} />
        {partnerName}님의 후기를 기다리고 있어요. 도착하면 바로 볼 수 있어요.
      </div>
    );
  }

  if (dday > 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {partnerReviewArrived ? (
        <p className="text-center text-sm text-forest">
          {partnerName}님이 벌써 후기를 남겼어요! 나도 남기면 확인할 수 있어요
        </p>
      ) : null}
      <Button className="w-full" onClick={() => router.push(`/course/${courseId}/review`)}>
        후기 작성하기
      </Button>
    </div>
  );
}
