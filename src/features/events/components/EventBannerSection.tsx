"use client";

import { useState, type UIEvent } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { MOCK_FESTIVAL_EVENTS } from "@/features/events/mocks";

export default function EventBannerSection() {
  const events = MOCK_FESTIVAL_EVENTS;
  const [activeIndex, setActiveIndex] = useState(0);

  if (events.length === 0) return null;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = 12;
    const step = card.clientWidth + gap;
    if (step === 0) return;
    const index = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(index, 0), events.length - 1));
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
        <HorizontalScroller onScroll={handleScroll} className="snap-x snap-mandatory gap-3 px-6 pb-1">
          {events.map((event) => (
            <div key={event.id} className="flex w-44 shrink-0 snap-start flex-col gap-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest-light">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              <p className="line-clamp-1 text-sm font-semibold text-ink">{event.title}</p>
              <p className="text-xs text-muted">{event.period}</p>
            </div>
          ))}
        </HorizontalScroller>
      </div>

      {events.length > 1 ? (
        <div className="flex items-center justify-center gap-1.5">
          {events.map((event, index) => (
            <span
              key={event.id}
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
