"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { MOCK_MATCHING_ID, MOCK_MATCH_PROFILE } from "@/features/matching/mocks";

export default function MatchFoundBanner() {
  const router = useRouter();
  const profile = MOCK_MATCH_PROFILE;

  return (
    <div className="mx-6 flex flex-col items-center gap-3 rounded-3xl bg-forest-light p-6 text-center">
      <Avatar src={profile.photoUrl} alt={profile.name} size={64} />

      <p className="text-base font-semibold text-forest">새로운 인연이 매칭되었어요!</p>
      <p className="text-sm text-forest/70">
        {profile.age}세 · {profile.job}
      </p>

      <div className="flex flex-wrap justify-center gap-1.5">
        {profile.interestTags.map((tag) => (
          <Badge key={tag}>#{tag}</Badge>
        ))}
      </div>

      <Button
        className="mt-2 px-6"
        onClick={() =>
          router.push(`/matching/${MOCK_MATCHING_ID}/attempts/${profile.attemptId}`)
        }
      >
        매칭하러 가기
      </Button>
    </div>
  );
}
