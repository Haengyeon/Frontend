"use client";

import Image from "next/image";
import { MapPin, Home, Clock, Shirt } from "lucide-react";
import Header from "@/components/layout/Header";
import ExpandableText from "@/components/ui/ExpandableText";
import InfoRow from "@/features/matching/components/InfoRow";
import CourseSpotsPanel from "@/features/course/components/CourseSpotsPanel";
import CourseMemoryVideo from "@/features/course/components/CourseMemoryVideo";
import ExperienceVideoAction from "@/features/course/components/ExperienceVideoAction";
import PartnerReviewStatus from "@/features/course/components/PartnerReviewStatus";
import { useCourseDetail } from "@/features/course/api/useCourseApi";
import { ApiError } from "@/lib/api/client";

type CourseDetailProps = {
  courseId: string;
};

export default function CourseDetail({ courseId }: CourseDetailProps) {
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

  if (!detail) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="코스 상세" />
      </div>
    );
  }

  const regionLabel = `${detail.regionLabel} ${detail.sigunguNames.join("·")}`.trim();

  if (detail.viewType === "LOCKED") {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="코스 상세" />
        <div className="flex flex-1 flex-col gap-3 px-6 pb-8 pt-4">
          <div className="flex items-center justify-center px-6 py-10 text-center text-sm text-muted">
            코스 세부 일정은 만나기 하루 전(D-1)부터 확인할 수 있어요.
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
            <InfoRow icon={MapPin} label="지역" value={regionLabel} />
            <InfoRow icon={Home} label="테마" value={detail.themeLabel} />
          </div>
        </div>
      </div>
    );
  }

  if (detail.viewType === "PREVIEW") {
    return (
      <div className="flex flex-1 flex-col">
        <Header title={detail.title} />
        <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
          {detail.thumbnailUrl ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-forest-light">
              <Image src={detail.thumbnailUrl} alt={detail.title} fill sizes="400px" className="object-cover" />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-forest-light p-5">
            <h2 className="text-lg font-semibold text-ink">{detail.title}</h2>
            <span className="flex items-center gap-1 text-sm text-muted">
              <MapPin size={14} strokeWidth={1.5} />
              {regionLabel}
            </span>
            <ExpandableText text={detail.description} className="text-sm leading-relaxed text-ink/80" />
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
            <p className="text-sm font-semibold text-ink">코스 예고 정보</p>
            <InfoRow
              icon={Home}
              label="실내/실외"
              value={detail.preview.isIndoor ? "실내 위주" : "실외 위주"}
            />
            <InfoRow icon={Clock} label="예상 소요 시간" value={detail.preview.estimatedTime} />
            <InfoRow icon={Shirt} label="복장 팁" value={detail.preview.dressTip} />
          </div>

          <p className="text-center text-xs text-muted">
            장소별 상세 정보와 지도는 만나는 당일(D-Day)에 공개돼요.
          </p>
        </div>
      </div>
    );
  }

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
          <ExpandableText text={detail.description} className="text-sm leading-relaxed text-ink/80" />
        </div>

        <CourseSpotsPanel courseId={detail.id} spots={detail.spots} isExperience={detail.isExperience} />
        {detail.isExperience ? (
          <ExperienceVideoAction courseId={detail.id} isCompleted={detail.status === "COMPLETED"} />
        ) : (
          <CourseMemoryVideo courseId={detail.id} hasVideoRecord={detail.video !== null} />
        )}

        <div className="mt-auto">
          <PartnerReviewStatus
            courseId={detail.id}
            dday={detail.dday}
            partnerName={detail.partner.name}
            review={detail.review}
          />
        </div>
      </div>
    </div>
  );
}
