"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Countdown from "@/components/ui/Countdown";
import { MOCK_MATCHING_ID, MOCK_MATCH_PROFILE } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function MatchPendingBanner() {
  const router = useRouter();
  const matchDeadlineAt = useMatchingDraftStore((state) => state.matchDeadlineAt);
  const profile = MOCK_MATCH_PROFILE;

  return (
    <div className="mx-6 flex flex-col items-center gap-3 rounded-3xl bg-forest-light p-6 text-center">
      <Avatar src={profile.photoUrl} alt={profile.name} size={64} />

      <p className="text-base font-semibold text-forest">상대방의 응답을 기다리고 있어요</p>
      <p className="text-sm text-forest/70">
        {profile.name}님에게 매칭 요청을 보냈어요. 응답이 오면 알림으로 알려드릴게요.
      </p>
      {matchDeadlineAt ? (
        <p className="text-xs text-forest/60">
          <Countdown deadlineAt={matchDeadlineAt} /> 이내에 상대방이 응답하지 않으면 매칭이
          자동으로 취소돼요.
        </p>
      ) : null}

      <Button
        variant="secondary"
        className="mt-2 px-6"
        onClick={() => router.push(`/matching/${MOCK_MATCHING_ID}/pending`)}
      >
        자세히 보기
      </Button>
    </div>
  );
}
