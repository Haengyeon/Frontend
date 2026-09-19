import { LayoutGrid, Map as MapIcon } from "lucide-react";

export type CourseView = "card" | "map";

type CourseViewSwitchProps = {
  view: CourseView;
  onChange: (view: CourseView) => void;
};

export default function CourseViewSwitch({ view, onChange }: CourseViewSwitchProps) {
  const isMap = view === "map";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMap}
      aria-label="지도로 보기"
      onClick={() => onChange(isMap ? "card" : "map")}
      className="relative grid h-9 w-[84px] grid-cols-2 place-items-center rounded-full bg-forest-light p-1 transition-transform active:scale-95"
    >
      {/* 살짝 튕기는 이징으로 썸이 좌우로 미끄러진다 */}
      <span
        aria-hidden
        className={`absolute left-1 top-1 h-7 w-[38px] rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isMap ? "translate-x-[38px]" : "translate-x-0"
        }`}
      />
      <LayoutGrid
        size={16}
        strokeWidth={1.8}
        aria-hidden
        className={`relative transition-colors duration-300 ${isMap ? "text-muted" : "text-forest"}`}
      />
      <MapIcon
        size={16}
        strokeWidth={1.8}
        aria-hidden
        className={`relative transition-colors duration-300 ${isMap ? "text-forest" : "text-muted"}`}
      />
    </button>
  );
}
