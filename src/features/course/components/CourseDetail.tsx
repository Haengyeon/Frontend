"use client";

import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import CourseSpotsPanel from "@/features/course/components/CourseSpotsPanel";
import { useCourseDetail } from "@/features/course/api/useCourseApi";
import { ApiError } from "@/lib/api/client";

type CourseDetailProps = {
  courseId: string;
};

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const router = useRouter();
  const { data: detail, isLoading, error } = useCourseDetail(courseId);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="코스 상세" />
      </div>
    );
  }

  if (error) {
    const message =
      error instanceof ApiError && error.statusCode === 404
        ? "코스를 찾을 수 없어요"
        : error instanceof ApiError
          ? error.message
          : "코스를 불러오지 못했어요";

    return (
      <div className="flex flex-1 flex-col">
        <Header title="코스 상세" />
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-muted">{message}</div>
      </div>
    );
  }

  if (!detail || detail.viewType !== "FULL") {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="코스 상세" />
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-muted">
          코스 세부 일정은 여행 하루 전부터 확인할 수 있어요.
        </div>
      </div>
    );
  }

  const canWriteReview = detail.dday <= 0 && !detail.review.myPartnerReview;
  const regionLabel = `${detail.regionLabel} ${detail.sigunguNames.join("·")}`.trim();

  return (
    <div className="flex flex-1 flex-col">
      <Header title={detail.title} />
      <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-forest-light p-5">
          <h2 className="text-lg font-semibold text-ink">{detail.title}</h2>
          <span className="flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} strokeWidth={1.5} />
            {regionLabel}
          </span>
          <p className="text-sm leading-relaxed text-ink/80">{detail.description}</p>
        </div>

        <CourseSpotsPanel courseId={detail.id} spots={detail.spots} />

        {canWriteReview ? (
          <Button className="mt-auto w-full" onClick={() => router.push(`/course/${detail.id}/review`)}>
            후기 작성하기
          </Button>
        ) : null}
      </div>
    </div>
  );
}
