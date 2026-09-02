"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Heart, CalendarHeart, Clover } from "lucide-react";
import {
  MOCK_MATCHING_ID,
  MOCK_MATCH_PROFILE,
  MOCK_DECIDED_THEME_IDS,
  formatDateLabel,
  getEarliestCommonDate,
  getThemeLabels,
} from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function MatchProfileCard() {
  const router = useRouter();
  const { setStatus, availableDates } = useMatchingDraftStore();
  const profile = MOCK_MATCH_PROFILE;
  const photos = [profile.photoUrl, profile.fullBodyPhotoUrl].filter(Boolean);
  const matchedDate = getEarliestCommonDate(availableDates, profile.availableDates);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const handleReject = () => {
    setStatus("searching");
    router.push("/home");
  };

  const handleAccept = () => {
    setStatus("pending");
    router.push(`/matching/${MOCK_MATCHING_ID}/pending`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-forest-light to-forest/50">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, index) => (
            <div key={photo} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={photo}
                alt={`${profile.name} 사진 ${index + 1}`}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {photos.length > 1 ? (
          <div className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 gap-1.5">
            {photos.map((photo, index) => (
              <span
                key={photo}
                className={`h-1.5 w-1.5 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        ) : null}

        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs text-ink">
          최근 접속
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12">
          <p className="text-lg font-semibold text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.4))]">
            {profile.name}{" "}
            <span className="text-sm font-normal text-white/85">
              {profile.age}세 · {profile.job} · {profile.mbti}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.interestTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/25 px-2.5 py-1 text-xs text-white backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm leading-relaxed text-ink">{profile.bio}</p>

      <div className="flex items-center justify-center gap-3 text-sm font-medium text-ink">
        <span className="flex items-center gap-1">
          <CalendarHeart size={14} strokeWidth={1.5} className="text-forest" />
          {matchedDate ? formatDateLabel(matchedDate) : "겹치는 날짜 없음"}
        </span>
        <span className="h-3 w-px bg-line" />
        <span className="flex items-center gap-1">
          <Clover size={14} strokeWidth={1.5} className="text-forest" />
          {getThemeLabels(MOCK_DECIDED_THEME_IDS)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={handleReject}
          className="flex flex-col items-center gap-1.5 text-muted"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream-card">
            <X size={24} strokeWidth={1.5} />
          </span>
          <span className="text-xs">거절</span>
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="flex flex-col items-center gap-1.5 text-forest"
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
