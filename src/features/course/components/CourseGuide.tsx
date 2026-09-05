"use client";

import { useRouter } from "next/navigation";
import { MapPinOff, MapPin, Clover, Clock, Shirt, Lock, type LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import CourseSpotsPanel from "@/features/course/components/CourseSpotsPanel";
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
  notice: string;
  regionLabel: string;
  themeLabel: string;
  details?: { estimatedTime: string; dressTip: string };
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
      <span className="flex items-center gap-1.5 text-xs text-muted">
        <Lock size={13} strokeWidth={1.5} />
        {notice}
      </span>
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
  const router = useRouter();
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

  if (isDetailLoading || !detail) return null;

  const regionLabel = `${detail.regionLabel} ${detail.sigunguNames.join("·")}`.trim();

  if (detail.viewType === "LOCKED") {
    return (
      <CoursePreview
        notice={`코스 세부 일정은 만나기 하루 전(D-1)부터 확인할 수 있어요 · 현재 D-${detail.dday}`}
        regionLabel={regionLabel}
        themeLabel={detail.themeLabel}
      />
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

  const canWriteReview = detail.dday <= 0 && !detail.review.myPartnerReview;

  return (
    <div className="flex flex-col gap-5">
      <CourseSpotsPanel courseId={detail.id} spots={detail.spots} />
      {canWriteReview ? (
        <Button className="w-full" onClick={() => router.push(`/course/${detail.id}/review`)}>
          후기 작성하기
        </Button>
      ) : null}
    </div>
  );
}
