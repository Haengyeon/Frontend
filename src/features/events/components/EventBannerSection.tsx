"use client";

import { useState, type UIEvent } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { useFestivals } from "@/features/events/api/useEventsApi";
import { formatPeriod } from "@/features/events/lib/formatPeriod";

export default function EventBannerSection() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFestivals();
  const events = data?.pages.flatMap((page) => page.items) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!isLoading && events.length === 0) return null;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = 12;
    const step = card.clientWidth + gap;
    if (step === 0) return;
    const index = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(index, 0), Math.max(events.length - 1, 0)));
  };

  return (
    <div className="flex flex-col gap-3 px-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">지금 가볼만한 축제 · 행사</span>
        <span className="flex items-center gap-0.5 text-xs text-muted">
          더보기
          <ChevronRight size={14} strokeWidth={1.5} />
        </span>
      </div>

      <div className="-mx-6">
        <HorizontalScroller onScroll={handleScroll} className="snap-x snap-mandatory gap-3 px-6 pb-2">
          {isLoading
            ? null
            : events.map((event) => (
                <div key={event.contentId} className="flex w-44 shrink-0 snap-start flex-col gap-2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest-light">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      sizes="176px"
                      // 공공누리 제3유형 포스터라 잘라내지 않고 원본 비율 그대로 보여준다
                      className="object-contain"
                    />
                  </div>
                  <p className="line-clamp-1 text-sm font-semibold text-ink">{event.name}</p>
                  <p className="text-xs text-muted">{formatPeriod(event.startDate, event.endDate)}</p>
                  <p className="text-[10px] text-muted/70">출처: 한국관광공사</p>
                </div>
              ))}
          {!isLoading && hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="flex w-16 shrink-0 items-center justify-center whitespace-nowrap text-xs text-muted underline disabled:opacity-50"
            >
              {isFetchingNextPage ? "..." : "더 보기"}
            </button>
          ) : null}
        </HorizontalScroller>
      </div>

      {events.length > 1 ? (
        <div className="flex items-center justify-center gap-1.5">
          {events.map((event, index) => (
            <span
              key={event.contentId}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-4 bg-forest" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
