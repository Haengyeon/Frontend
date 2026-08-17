import { Heart } from "lucide-react";

const DOT_COUNT = 8;
const RADIUS = 70;

const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => {
  const angle = (i / DOT_COUNT) * Math.PI * 2;
  return {
    x: Math.cos(angle) * RADIUS,
    y: Math.sin(angle) * RADIUS,
    delay: (i % 4) * 0.2,
  };
});

export default function SearchingLoader() {
  return (
    <div className="mx-6 flex flex-col items-center gap-6 rounded-3xl bg-forest-light px-6 py-12">
      <div className="relative flex h-40 w-40 items-center justify-center">
        {DOTS.map((dot, i) => (
          <span
            key={i}
            className="absolute"
            style={{ transform: `translate(${dot.x}px, ${dot.y}px)` }}
          >
            <span
              className="block h-2 w-2 animate-ping rounded-full bg-forest/50"
              style={{ animationDelay: `${dot.delay}s`, animationDuration: "1.8s" }}
            />
          </span>
        ))}
        <Heart size={36} className="relative text-forest animate-pulse" fill="currentColor" />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-base font-semibold text-forest">당신의 새 인연을 찾고 있어요!</p>
        <p className="text-sm text-forest/70">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
