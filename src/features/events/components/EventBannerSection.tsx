"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { useFestivals } from "@/features/events/api/useEventsApi";
import { formatPeriod } from "@/features/events/lib/formatPeriod";
import FestivalDetailSheet from "@/features/events/components/FestivalDetailSheet";
import FestivalListSheet from "@/features/events/components/FestivalListSheet";
import type { Festival } from "@/features/events/types";

export default function EventBannerSection() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFestivals();
  const events = data?.pages.flatMap((page) => page.items) ?? [];
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);

  if (!isLoading && events.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 px-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">지금 가볼만한 축제 · 행사</span>
        <button
          type="button"
          onClick={() => setIsListOpen(true)}
          className="flex items-center gap-0.5 text-xs text-muted"
        >
          더보기
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      <div className="-mx-6">
        <HorizontalScroller className="items-start gap-3 px-6 pb-2">
          {isLoading
            ? null
            : events.map((event) => (
                <button
                  key={event.contentId}
                  type="button"
                  onClick={() => setSelectedFestival(event)}
                  className="flex w-36 shrink-0 flex-col gap-2 text-left"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-forest-light">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      sizes="144px"
                      // 공공누리 제3유형 포스터라 잘라내지 않고 원본 비율 그대로 보여준다
                      className="object-contain"
                    />
                  </div>
                  <p className="line-clamp-1 text-sm font-semibold text-ink">{event.name}</p>
                  <p className="text-xs text-muted">{formatPeriod(event.startDate, event.endDate)}</p>
                  <p className="text-[10px] text-muted/70">출처: 한국관광공사</p>
                </button>
              ))}
        </HorizontalScroller>
      </div>

      <FestivalDetailSheet festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
      <FestivalListSheet
        open={isListOpen}
        festivals={events}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={() => fetchNextPage()}
        onSelect={(festival) => {
          setIsListOpen(false);
          setSelectedFestival(festival);
        }}
        onClose={() => setIsListOpen(false)}
      />
    </div>
  );
}
