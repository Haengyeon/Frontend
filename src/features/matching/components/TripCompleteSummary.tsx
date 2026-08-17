"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MatchConfirmedBadge from "@/features/matching/components/MatchConfirmedBadge";
import { RECOMMENDED_COURSES } from "@/features/course/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function TripCompleteSummary() {
  const router = useRouter();
  const reset = useMatchingDraftStore((state) => state.reset);

  const handleRestart = () => {
    reset();
    router.push("/home");
  };

  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <MatchConfirmedBadge showCheck />
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-semibold text-ink">여행이 완료되었어요!</p>
        <p className="text-sm text-muted">함께한 여행은 어떠셨나요?</p>
      </div>
      <div className="flex w-full gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push(`/course/${RECOMMENDED_COURSES[0].courseId}/review`)}
        >
          후기 작성하기
        </Button>
        <Button className="flex-1" onClick={handleRestart}>
          다시 매칭하기
        </Button>
      </div>
    </div>
  );
}
