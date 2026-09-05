"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import { useCourseDetail, useSubmitCourseReview } from "@/features/course/api/useCourseApi";
import { ApiError } from "@/lib/api/client";

type ReviewFormProps = {
  courseId: string;
};

export default function ReviewForm({ courseId }: ReviewFormProps) {
  const router = useRouter();
  const { data: detail, isLoading, isError, error } = useCourseDetail(courseId);
  const submitReview = useSubmitCourseReview(courseId);
  const [partnerReview, setPartnerReview] = useState("");
  const [courseReview, setCourseReview] = useState("");
  const [spotReviews, setSpotReviews] = useState<Record<string, string>>({});

  const canSubmit = partnerReview.trim().length > 0 && !submitReview.isPending;

  const handleSubmit = () => {
    submitReview.mutate(
      {
        partnerReview: partnerReview.trim(),
        courseReview: courseReview.trim() || undefined,
        spotReviews: detail?.viewType === "FULL"
          ? detail.spots
              .map((spot) => ({ spotId: spot.id, content: (spotReviews[spot.id] ?? "").trim() }))
              .filter((review) => review.content.length > 0)
          : undefined,
      },
      {
        onSuccess: () => router.push(`/course/${courseId}`),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="후기 작성" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="후기 작성" />
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-muted">
          {error instanceof ApiError ? error.message : "코스 정보를 불러오지 못했어요."}
        </div>
      </div>
    );
  }

  if (!detail || detail.viewType !== "FULL") {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="후기 작성" />
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-muted">
          여행 당일부터 후기를 남길 수 있어요.
        </div>
      </div>
    );
  }

  const regionLabel = `${detail.regionLabel} ${detail.sigunguNames.join("·")}`.trim();

  return (
    <div className="flex flex-1 flex-col">
      <Header title="후기 작성" />
      <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-forest-light">
            {detail.thumbnailUrl ? (
              <Image src={detail.thumbnailUrl} alt={detail.title} fill className="object-cover" />
            ) : null}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{detail.title}</p>
            <span className="flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} strokeWidth={1.5} />
              {regionLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">
            {detail.partner.nickname}님과의 여행은 어떠셨나요?
          </span>
          <textarea
            value={partnerReview}
            onChange={(e) => setPartnerReview(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="상대방에 대한 솔직한 후기를 남겨주세요. 상대방에게 전달돼요."
            className="resize-none rounded-2xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">코스는 어떠셨나요? (선택)</span>
          <textarea
            value={courseReview}
            onChange={(e) => setCourseReview(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="코스에 대한 한줄평을 남겨주세요. 나만 볼 수 있어요."
            className="resize-none rounded-2xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-ink">방문한 장소 후기 (선택)</span>
          {detail.spots.map((spot) => (
            <div key={spot.id} className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">{spot.name}</span>
              <textarea
                value={spotReviews[spot.id] ?? ""}
                onChange={(e) =>
                  setSpotReviews((prev) => ({ ...prev, [spot.id]: e.target.value }))
                }
                rows={2}
                maxLength={300}
                placeholder="이 장소는 어땠나요? 다른 사람에게 공개돼요."
                className="resize-none rounded-2xl border border-line bg-cream-card p-3 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
              />
            </div>
          ))}
        </div>

        {submitReview.isError ? (
          <p className="text-center text-sm text-red-500">
            {submitReview.error instanceof ApiError
              ? submitReview.error.message
              : "후기 등록에 실패했어요."}
          </p>
        ) : null}

        <Button className="mt-auto w-full" disabled={!canSubmit} onClick={handleSubmit}>
          {submitReview.isPending ? "등록 중..." : "후기 등록하기"}
        </Button>
      </div>
    </div>
  );
}
