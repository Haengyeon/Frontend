"use client";

import Link from "next/link";
import { Sparkles, ChevronRight, MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useMyProfile } from "@/features/auth/api/useProfileApi";
import { useMyPoints, useStamps } from "@/features/reward/api/useRewardApi";

export default function ProfileSummaryCard() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const { data: points } = useMyPoints();
  const { data: stamps } = useStamps();

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
        <div className="flex items-center gap-3">
          <Link href="/mypage/points" className="flex items-center gap-1 text-xs text-muted">
            <Sparkles size={13} strokeWidth={1.5} className="text-forest" />
            누적 포인트 {(points?.points ?? 0).toLocaleString()}P
            <ChevronRight size={13} strokeWidth={1.5} />
          </Link>
          {stamps ? (
            <span className="flex items-center gap-1 text-xs text-muted">
              <MapPin size={13} strokeWidth={1.5} className="text-forest" />
              스탬프 {stamps.collectedCount}/{stamps.totalCount}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
