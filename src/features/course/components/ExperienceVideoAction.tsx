"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useFinishExperienceCourse } from "@/features/course/api/useCourseApi";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { ApiError } from "@/lib/api/client";

type ExperienceVideoActionProps = {
  courseId: string;
  /** 이미 체험을 끝낸 코스(status === "COMPLETED")면 "종료" 대신 "다시 보기"로 문구를 바꾼다. */
  isCompleted?: boolean;
};

// 체험 코스는 실제 AI가 사진으로 영상을 만드는 게 아니라, 미리 만들어둔 샘플 영상을
// 즉시 돌려받는다(POST .../experience/finish). 그래서 CourseMemoryVideo와 달리 자동
// 폴링이 아니라 버튼을 눌러야 하고, "이건 예시다"라는 설명을 항상 같이 보여준다.
export default function ExperienceVideoAction({ courseId, isCompleted = false }: ExperienceVideoActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setStatus = useMatchingDraftStore((state) => state.setStatus);
  const finish = useFinishExperienceCourse(courseId);

  const handleClick = () => {
    setIsOpen(true);
    if (!finish.data) {
      // 체험은 영상을 만드는 순간을 "여행이 끝났다"로 본다 — 실제 코스처럼 완료 시각을
      // 따로 폴링할 방법이 없어서(체험엔 자동 완료 API가 없음), 여기서 바로 홈의
      // "여행이 완료되었어요 · 다시 매칭하기" 카드로 넘어가게 한다.
      finish.mutate(undefined, { onSuccess: () => setStatus("completed") });
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-light">
          <Film size={18} strokeWidth={1.5} className="text-forest" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            {isCompleted ? "추억 영상 보기" : "체험 종료하고 추억영상 보기"}
          </p>
          <p className="text-xs text-muted">
            {isCompleted
              ? "체험을 마치고 만든 예시 영상을 다시 볼 수 있어요."
              : "미리 준비된 예시 영상으로 체험을 마무리해요."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white"
      >
        {isCompleted ? "추억 영상 보기" : "체험 종료하기"}
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="text-base font-semibold text-ink">
          실제 여행에서는 이런 추억영상이 만들어져요
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          두 사람이 함께 남긴 사진으로 그날의 기록을 영상으로 정리해 드려요. 지금 보시는 영상은
          첨부한 사진이 아니라 미리 준비된 예시예요 — 실제 매칭에서는 직접 남긴 사진과 글로
          만들어져요.
        </p>
        <div className="mt-4">
          {finish.isPending ? (
            <p className="py-8 text-center text-sm text-muted">영상을 불러오는 중...</p>
          ) : finish.isError ? (
            <p className="py-8 text-center text-sm text-red-500">
              {finish.error instanceof ApiError ? finish.error.message : "영상을 불러오지 못했어요."}
            </p>
          ) : finish.data ? (
            <video
              controls
              autoPlay
              poster={finish.data.sampleVideo.thumbnailUrl}
              src={finish.data.sampleVideo.videoUrl}
              className="w-full rounded-2xl bg-black"
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
