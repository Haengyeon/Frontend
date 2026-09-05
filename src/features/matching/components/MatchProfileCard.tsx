"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { X, Heart, CalendarHeart, Clover } from "lucide-react";
import { formatDateLabel, getThemeLabels } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMatchAttempt, useRespondToMatchAttempt } from "@/features/matching/api/useMatchingApi";
import { jobCategoryToLocal, hobbyToLocal } from "@/features/matching/api/enumMap";
import { ApiError } from "@/lib/api/client";

export default function MatchProfileCard() {
  const router = useRouter();
  const params = useParams<{ matchingId: string; attemptId: string }>();
  const setStatus = useMatchingDraftStore((state) => state.setStatus);
  const themeIds = useMatchingDraftStore((state) => state.themeIds);
  const { data, isLoading, isError, error, refetch } = useMatchAttempt(params.attemptId);
  const respond = useRespondToMatchAttempt(params.attemptId);

  const partner = data?.partner;

  const handleReject = () => {
    respond.mutate(
      { decision: "REJECTED" },
      {
        onSuccess: () => {
          setStatus("searching");
          router.push("/home");
        },
      },
    );
  };

  const handleAccept = () => {
    respond.mutate(
      { decision: "ACCEPTED" },
      {
        onSuccess: () => {
          setStatus("pending");
          router.push(`/matching/${params.matchingId}/pending`);
        },
      },
    );
  };

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-8 pt-4 text-sm text-muted">
        <p>{error instanceof ApiError ? error.message : "프로필을 불러오지 못했어요."}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-line px-4 py-2 text-xs text-ink"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isLoading || !data || !partner) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 pb-8 pt-4 text-sm text-muted">
        프로필을 불러오는 중이에요...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-forest-light to-forest/50">
        <Image
          src={partner.fullBodyImageUrl}
          alt={`${partner.name} 사진`}
          fill
          sizes="400px"
          className="object-cover"
        />

        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs text-ink">
          최근 접속
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12">
          <p className="text-lg font-semibold text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.4))]">
            {partner.name}{" "}
            <span className="text-sm font-normal text-white/85">
              {partner.age}세
              {partner.jobCategory ? ` · ${jobCategoryToLocal(partner.jobCategory)}` : ""}
              {partner.mbti ? ` · ${partner.mbti}` : ""}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {partner.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="rounded-full bg-white/25 px-2.5 py-1 text-xs text-white backdrop-blur-sm"
              >
                #{hobbyToLocal(hobby)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm leading-relaxed text-ink">{partner.introduce}</p>

      <div className="flex items-center justify-center gap-3 text-sm font-medium text-ink">
        <span className="flex items-center gap-1">
          <CalendarHeart size={14} strokeWidth={1.5} className="text-forest" />
          {data.travelDate ? formatDateLabel(data.travelDate) : "겹치는 날짜 없음"}
        </span>
        <span className="h-3 w-px bg-line" />
        <span className="flex items-center gap-1">
          <Clover size={14} strokeWidth={1.5} className="text-forest" />
          {getThemeLabels(themeIds)}
        </span>
      </div>

      {respond.isError ? (
        <p className="text-center text-sm text-red-500">
          {respond.error instanceof ApiError ? respond.error.message : "응답 처리에 실패했어요."}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={handleReject}
          disabled={respond.isPending}
          className="flex flex-col items-center gap-1.5 text-muted disabled:opacity-50"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream-card">
            <X size={24} strokeWidth={1.5} />
          </span>
          <span className="text-xs">거절</span>
        </button>
        <button
          type="button"
          onClick={handleAccept}
          disabled={respond.isPending}
          className="flex flex-col items-center gap-1.5 text-forest disabled:opacity-50"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">
            <Heart size={24} strokeWidth={1.5} fill="currentColor" />
          </span>
          <span className="text-xs">수락</span>
        </button>
      </div>
    </div>
  );
}
