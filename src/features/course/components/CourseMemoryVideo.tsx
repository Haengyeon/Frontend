"use client";

import { Film, TriangleAlert } from "lucide-react";
import { useCourseVideo } from "@/features/course/api/useCourseApi";

type CourseMemoryVideoProps = {
  courseId: string;
  /** 코스 상세 응답의 video 필드가 null이 아닌지 — null이면 아직 만들 인증샷조차 없다는
   * 뜻이라 조회 자체를 건너뛴다(존재하지 않는 영상을 매번 404로 확인하지 않기 위함). */
  hasVideoRecord: boolean;
};

// 추억 영상은 사용자가 요청하는 기능이 아니다. 여행을 마친 코스에 인증샷이 한 장이라도
// 있으면 백엔드 스케줄러가 매분 자동으로 만들기 시작한다(약 30초 분량, AI가 사진을
// 골라 장면을 구성). 그래서 여기엔 "만들기" 버튼이 없고 진행 상태만 보여준다.
export default function CourseMemoryVideo({ courseId, hasVideoRecord }: CourseMemoryVideoProps) {
  const { data, isLoading } = useCourseVideo(courseId, { enabled: hasVideoRecord });

  if (!hasVideoRecord || isLoading || !data) return null;

  if (data.status === "PENDING" || data.status === "PROCESSING") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-light">
          <Film size={18} strokeWidth={1.5} className="text-forest" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">추억 영상을 만들고 있어요</p>
          <p className="text-xs text-muted">인증샷으로 짧은 영상을 준비하고 있어요. 완성되면 여기에 떠요.</p>
        </div>
      </div>
    );
  }

  if (data.status === "FAILED") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <TriangleAlert size={18} strokeWidth={1.5} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">추억 영상 제작에 실패했어요</p>
          {data.errorMessage ? (
            <p className="text-xs text-muted">{data.errorMessage}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (data.status === "COMPLETED" && data.videoUrl) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">추억 영상</span>
        <video
          controls
          poster={data.thumbnailUrl ?? undefined}
          src={data.videoUrl}
          className="w-full rounded-2xl bg-black"
        />
      </div>
    );
  }

  return null;
}
