import type { ReactNode } from "react";

type HorizontalScrollerProps = {
  children: ReactNode;
  className?: string;
};

// 카드 자체가 양 끝에서 옅어지도록 스크롤 컨테이너에 마스크를 씌운다 (별도 그림자 오버레이 없음).
const EDGE_FADE_MASK =
  "linear-gradient(to right, rgba(0,0,0,0.55), black 20px, black calc(100% - 20px), rgba(0,0,0,0.55))";

export default function HorizontalScroller({ children, className = "" }: HorizontalScrollerProps) {
  return (
    <div
      className={`flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      style={{ WebkitMaskImage: EDGE_FADE_MASK, maskImage: EDGE_FADE_MASK }}
    >
      {children}
    </div>
  );
}
