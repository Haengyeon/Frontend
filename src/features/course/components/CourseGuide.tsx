"use client";

import { MapPinOff, MapPin, Clover, Clock, Shirt, Lock, type LucideIcon } from "lucide-react";
import CourseSpotsPanel from "@/features/course/components/CourseSpotsPanel";
import CourseMemoryVideo from "@/features/course/components/CourseMemoryVideo";
import PartnerReviewStatus from "@/features/course/components/PartnerReviewStatus";
import InfoRow from "@/features/matching/components/InfoRow";
import { useCurrentCourse, useCourseDetail } from "@/features/course/api/useCourseApi";

function GuideNotice({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-cream-card p-8 text-center">
      <Icon size={28} strokeWidth={1.5} className="text-muted" />
      <p className="text-sm font-medium text-ink">{title}</p>
      {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
    </div>
  );
}

// LOCKED(D-2 이전): 지역/테마만 · PREVIEW(D-1): 예상 소요시간·복장 추천까지 · FULL(D-Day): 전체 코스(다른 곳에서 렌더)
function CoursePreview({
  notice,
  regionLabel,
  themeLabel,
  details,
}: {
  notice?: string;
  regionLabel: string;
  themeLabel: string;
  details?: { estimatedTime: string; dressTip: string };
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
      {notice ? (
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Lock size={13} strokeWidth={1.5} />
          {notice}
        </span>
      ) : null}
      <InfoRow icon={MapPin} label="지역" value={regionLabel} />
      <InfoRow icon={Clover} label="테마" value={themeLabel} />
      {details ? (
        <>
          <InfoRow icon={Clock} label="예상 소요 시간" value={details.estimatedTime} />
          <InfoRow icon={Shirt} label="복장 추천" value={details.dressTip} />
        </>
      ) : null}
    </div>
  );
}

export default function CourseGuide() {
  const {
    data: current,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
  } = useCurrentCourse();
  const courseId = current?.course?.id ?? null;
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useCourseDetail(courseId);

  if (isCurrentLoading) return null;

  if (isCurrentError || isDetailError) {
    return <GuideNotice icon={MapPinOff} title="코스 정보를 불러오지 못했어요" subtitle="잠시 후 다시 시도해주세요" />;
  }

  if (current?.generating) {
    return <GuideNotice icon={MapPinOff} title="코스를 만드는 중이에요" subtitle="곧 준비될 거예요" />;
  }

  if (!current?.course) {
    return <GuideNotice icon={MapPinOff} title="진행중인 코스가 없어요" />;
  }

  // 완료된 코스는 후기를 안 쓰면 24시간 동안 GET /courses/current에 계속 잡힌다(홈의
  // "여행 완료" 카드·후기 작성 버튼을 위해서다) — 여기 코스안내 탭에는 그 코스를 그대로
  // 보여주지 않는다. 지난 코스는 스탬프에서 확인하고, 후기는 홈 배너에서 쓰면 된다.
  if (current.course.status === "COMPLETED") {
    return (
      <GuideNotice icon={MapPinOff} title="여행이 완료됐어요" subtitle="다녀온 코스는 스탬프에서 확인할 수 있어요" />
    );
  }

  if (isDetailLoading || !detail) return null;

  const regionLabel = `${detail.regionLabel} ${detail.sigunguNames.join("·")}`.trim();

  if (detail.viewType === "LOCKED") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-base font-semibold text-ink">
          코스 세부 일정은 만나기 하루 전(D-1)부터 확인할 수 있어요
        </p>
        <CoursePreview regionLabel={regionLabel} themeLabel={detail.themeLabel} />
      </div>
    );
  }

  if (detail.viewType === "PREVIEW") {
    return (
      <CoursePreview
        notice="코스 세부 일정은 당일에 공개돼요"
        regionLabel={regionLabel}
        themeLabel={detail.themeLabel}
        details={{ estimatedTime: detail.preview.estimatedTime, dressTip: detail.preview.dressTip }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <CourseSpotsPanel courseId={detail.id} spots={detail.spots} />
      <CourseMemoryVideo courseId={detail.id} hasVideoRecord={detail.video !== null} />
      <PartnerReviewStatus
        courseId={detail.id}
        dday={detail.dday}
        partnerName={detail.partner.name}
        review={detail.review}
      />
    </div>
  );
}
