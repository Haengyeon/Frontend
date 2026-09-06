"use client";

import { Check } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMatchAttempt } from "@/features/matching/api/useMatchingApi";

type MatchConfirmedBadgeProps = {
  showCheck?: boolean;
};

export default function MatchConfirmedBadge({ showCheck = false }: MatchConfirmedBadgeProps) {
  const matchAttemptId = useMatchingDraftStore((state) => state.matchAttemptId);
  const { data } = useMatchAttempt(matchAttemptId);
  const partner = data?.partner;

  return (
    <div className="relative mx-auto flex h-28 w-48 items-center justify-center">
      <Avatar alt="나" size={96} className="absolute left-0 border-4 border-cream" />
      <Avatar
        src={partner?.fullBodyImageUrl}
        alt={partner?.name ?? "매칭 상대"}
        size={96}
        className="absolute right-0 border-4 border-cream"
      />
      {showCheck ? (
        <span className="absolute bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white ring-4 ring-cream">
          <Check size={16} strokeWidth={2.5} />
        </span>
      ) : null}
    </div>
  );
}
