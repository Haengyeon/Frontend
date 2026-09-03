"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMatchAttempt } from "@/features/matching/api/useMatchingApi";
import { hobbyToLocal, jobCategoryToLocal } from "@/features/matching/api/enumMap";

export default function MatchFoundBanner() {
  const router = useRouter();
  const matchingId = useMatchingDraftStore((state) => state.matchingId);
  const matchAttemptId = useMatchingDraftStore((state) => state.matchAttemptId);
  const { data } = useMatchAttempt(matchAttemptId);
  const partner = data?.partner;

  return (
    <div className="mx-6 flex flex-col items-center gap-3 rounded-3xl bg-forest-light p-6 text-center">
      <div className="flex w-full items-center gap-3">
        <span className="h-px flex-1 bg-forest/20" />
        <p className="shrink-0 text-lg font-semibold text-forest">새로운 인연이 매칭되었어요!</p>
        <span className="h-px flex-1 bg-forest/20" />
      </div>

      {partner ? (
        <>
          <Avatar src={partner.fullBodyImageUrl} alt={partner.name} size={104} />

          <p className="text-sm text-forest/70">
            {partner.age}세{partner.jobCategory ? ` · ${jobCategoryToLocal(partner.jobCategory)}` : ""}
          </p>

          <div className="flex flex-wrap justify-center gap-1.5">
            {partner.hobbies.map((hobby) => (
              <Badge key={hobby} className="bg-pink-50 text-forest">
                #{hobbyToLocal(hobby)}
              </Badge>
            ))}
          </div>
        </>
      ) : (
        <div className="h-[104px] w-[104px] animate-pulse rounded-full bg-forest/10" />
      )}

      <Button
        className="mt-2 px-6"
        disabled={!matchingId || !matchAttemptId}
        onClick={() => router.push(`/matching/${matchingId}/attempts/${matchAttemptId}`)}
      >
        프로필 보러가기
      </Button>
    </div>
  );
}
