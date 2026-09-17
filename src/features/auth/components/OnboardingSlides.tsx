"use client";

import { useRef, useState, type KeyboardEvent, type UIEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Users, MapPinned, MessageCircle } from "lucide-react";

// 실제 화면에 쓰는 색/컴포넌트 스타일을 그대로 가져와 축소한 목업.
// 온보딩에서부터 "이게 실제로 앱에서 보게 될 화면"이라는 신뢰를 주기 위함.
function MatchMockup() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
      <div className="flex -space-x-3">
        <div className="h-14 w-14 rounded-full border-4 border-cream-card bg-forest-light" />
        <div className="h-14 w-14 rounded-full border-4 border-cream-card bg-forest/30" />
      </div>
      <p className="text-sm font-semibold text-ink">매칭이 확정되었어요!</p>
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">D-1</span>
        <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">전북 남원시</span>
      </div>
      <div className="mt-1 flex w-full gap-2">
        <div className="flex-1 rounded-full border border-line py-2 text-xs text-ink">채팅하기</div>
        <div className="flex-1 rounded-full bg-forest py-2 text-xs font-medium text-white">코스 보기</div>
      </div>
    </div>
  );
}

function CourseMockup() {
  const spots = ["경복궁", "인사동", "북촌 한옥마을", "삼청동 카페거리"];
  return (
    <div className="flex h-full flex-col gap-2.5 p-5">
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-forest-light px-2.5 py-1 text-[11px] font-medium text-forest">서울 종로구</span>
        <span className="rounded-full bg-forest-light px-2.5 py-1 text-[11px] font-medium text-forest">역사 문화</span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {spots.map((spot, i) => (
          <div key={spot} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white">
              {i + 1}
            </span>
            <span className="text-xs text-ink">{spot}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full w-1/2 rounded-full bg-forest" />
      </div>
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <div className="h-7 w-7 shrink-0 rounded-full bg-forest-light" />
        <p className="text-xs font-medium text-ink">유하린</p>
        <span className="ml-auto rounded-full bg-forest-light px-2 py-0.5 text-[10px] font-medium text-forest">D-1</span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 p-3">
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] text-ink shadow-sm">
          내일 몇 시에 만날까요?
        </div>
        <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-forest px-3 py-2 text-[11px] text-white">
          오전 10시 경복궁역 어때요?
        </div>
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] text-ink shadow-sm">
          좋아요! 기대돼요 🙂
        </div>
      </div>
    </div>
  );
}

const SLIDES: {
  badge: string;
  badgeIcon: typeof Users;
  title: string;
  description: string;
  mockup: ReactNode;
}[] = [
  {
    badge: "실시간 매칭 진행중",
    badgeIcon: Users,
    title: "취향이 맞는 여행 동행\n지금 만나보세요",
    description: "지역·날짜·테마가 맞는 상대와 자동으로 매칭돼요.",
    mockup: <MatchMockup />,
  },
  {
    badge: "AI 코스 자동 생성",
    badgeIcon: MapPinned,
    title: "동선까지 최적화된\n둘만의 여행 코스",
    description: "매칭이 확정되면 취향에 맞는 코스가 바로 만들어져요.",
    mockup: <CourseMockup />,
  },
  {
    badge: "여행 전날 채팅 오픈",
    badgeIcon: MessageCircle,
    title: "설레는 만남을\n채팅으로 미리 준비해요",
    description: "매칭이 확정되면 여행 전날부터 채팅방이 열려요.",
    mockup: <ChatMockup />,
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

  const goToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.min(Math.max(index, 0), SLIDES.length - 1);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
    onIndexChange?.(clamped, clamped === SLIDES.length - 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToIndex(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToIndex(activeIndex - 1);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
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

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-label={`온보딩 슬라이드 ${activeIndex + 1}/${SLIDES.length}`}
        className="flex w-full flex-1 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.title}
              className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-6 px-4"
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <p className="whitespace-pre-line text-lg font-bold leading-snug text-ink">{slide.title}</p>
                <p className="text-xs text-muted">{slide.description}</p>
              </div>

              {/* 실제 화면 목업 — 활성 슬라이드가 될 때 아래에서 위로 슬라이드되며 나타난다 */}
              <div className="relative h-72 w-full max-w-[220px] overflow-hidden">
                <div
                  className={`absolute inset-x-0 bottom-0 transition-all duration-700 ease-out ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                  }`}
                >
                  <span className="absolute -top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold text-forest shadow-md">
                    <slide.badgeIcon size={12} strokeWidth={2} />
                    {slide.badge}
                  </span>
                  <div className="h-64 overflow-hidden rounded-t-[28px] border border-line bg-cream-card shadow-xl">
                    {slide.mockup}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="이전 슬라이드"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted disabled:opacity-30"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => goToIndex(activeIndex + 1)}
          disabled={activeIndex === SLIDES.length - 1}
          aria-label="다음 슬라이드"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted disabled:opacity-30"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
