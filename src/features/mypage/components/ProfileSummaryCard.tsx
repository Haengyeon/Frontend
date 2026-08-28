import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { MOCK_MY_PROFILE } from "@/features/auth/mocks";
import { MOCK_POINTS } from "@/features/mypage/mocks";

export default function ProfileSummaryCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
      <Avatar src={MOCK_MY_PROFILE.photos[0]} alt={MOCK_MY_PROFILE.basicInfo.name} size={52} />
      <div className="flex-1">
        <p className="text-base font-semibold text-ink">{MOCK_MY_PROFILE.basicInfo.name}님</p>
        <Link href="/mypage/points" className="flex items-center gap-1 text-xs text-muted">
          <Sparkles size={13} strokeWidth={1.5} className="text-forest" />
          누적 포인트 {MOCK_POINTS.toLocaleString()}P
          <ChevronRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
