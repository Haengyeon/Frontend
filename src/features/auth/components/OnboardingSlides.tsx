"use client";

import { useRef, useState, type UIEvent } from "react";
import { MapPinned, HeartHandshake, Camera, type LucideIcon } from "lucide-react";

const SLIDES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MapPinned,
    title: "관광지를 함께 걷는\n새로운 인연",
    description: "취향이 맞는 여행 동행을 찾아보세요.",
  },
  {
    icon: HeartHandshake,
    title: "실제 코스로 확정되는\n설레는 만남",
    description: "매칭이 확정되면 둘만의 여행 코스가 생겨요.",
  },
  {
    icon: Camera,
    title: "함께한 순간을\n스탬프로 기록",
    description: "다녀온 지역마다 스탬프가 쌓여요.",
  },
];

type OnboardingSlidesProps = {
  onIndexChange?: (index: number, isLast: boolean) => void;
};

export default function OnboardingSlides({ onIndexChange }: OnboardingSlidesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
    onIndexChange?.(index, index === SLIDES.length - 1);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((slide) => (
          <div key={slide.title} className="flex w-full shrink-0 snap-center justify-center px-2">
            <div className="flex aspect-[4/5] w-full max-w-xs flex-col items-center justify-center gap-6 rounded-3xl bg-forest-light p-8 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-card">
                <slide.icon size={40} strokeWidth={1.5} className="text-forest" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="whitespace-pre-line text-xl font-bold leading-snug text-ink">
                  {slide.title}
                </p>
                <p className="text-sm text-ink/70">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {SLIDES.map((slide, index) => (
          <span
            key={slide.title}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-4 bg-forest" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
