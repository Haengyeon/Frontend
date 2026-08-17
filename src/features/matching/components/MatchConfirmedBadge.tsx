import { Check } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { MOCK_MATCH_PROFILE } from "@/features/matching/mocks";

type MatchConfirmedBadgeProps = {
  showCheck?: boolean;
};

export default function MatchConfirmedBadge({ showCheck = false }: MatchConfirmedBadgeProps) {
  return (
    <div className="relative mx-auto flex h-28 w-48 items-center justify-center">
      <Avatar alt="나" size={96} className="absolute left-0 border-4 border-cream" />
      <Avatar
        src={MOCK_MATCH_PROFILE.photoUrl}
        alt={MOCK_MATCH_PROFILE.name}
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
