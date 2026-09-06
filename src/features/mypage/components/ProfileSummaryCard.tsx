"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useMyProfile } from "@/features/auth/api/useProfileApi";
import { MOCK_POINTS } from "@/features/mypage/mocks";

export default function ProfileSummaryCard() {
  const { data: profile, isLoading, isError } = useMyProfile();

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
      <Avatar src={profile?.profileImageUrl} alt={profile?.name ?? "내 프로필"} size={52} />
      <div className="flex-1">
        <p className="text-base font-semibold text-ink">
          {profile
            ? `${profile.name}님`
            : isLoading
              ? "불러오는 중..."
              : isError
                ? "프로필을 불러오지 못했어요"
                : "내 프로필"}
        </p>
        <Link href="/mypage/points" className="flex items-center gap-1 text-xs text-muted">
          <Sparkles size={13} strokeWidth={1.5} className="text-forest" />
          누적 포인트 {MOCK_POINTS.toLocaleString()}P
          <ChevronRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
