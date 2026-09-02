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
      <div className="flex w-full items-center gap-3">
        <span className="h-px flex-1 bg-forest/20" />
        <p className="shrink-0 text-lg font-semibold text-forest">새로운 인연이 매칭되었어요!</p>
        <span className="h-px flex-1 bg-forest/20" />
      </div>

      <Avatar src={profile.photoUrl} alt={profile.name} size={104} />

      <p className="text-sm text-forest/70">
        {profile.age}세 · {profile.job}
      </p>

      <div className="flex flex-wrap justify-center gap-1.5">
        {profile.interestTags.map((tag) => (
          <Badge key={tag} className="bg-pink-50 text-forest">
            #{tag}
          </Badge>
        ))}
      </div>

      <Button
        className="mt-2 px-6"
        onClick={() =>
          router.push(`/matching/${MOCK_MATCHING_ID}/attempts/${profile.attemptId}`)
        }
      >
        프로필 보러가기
      </Button>
    </div>
  );
}
