"use client";

import {
  Palette,
  Coffee,
  UtensilsCrossed,
  BookOpen,
  Dumbbell,
  Laptop,
  ChefHat,
  Sailboat,
  Film,
  Frame,
  Camera,
  PawPrint,
  Music,
  Zap,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { INTEREST_TAGS, MAX_INTEREST_TAGS } from "@/features/auth/mocks";

const TAG_ICONS: Record<string, LucideIcon> = {
  예술: Palette,
  카페: Coffee,
  맛집: UtensilsCrossed,
  독서: BookOpen,
  운동: Dumbbell,
  IT: Laptop,
  요리: ChefHat,
  바다: Sailboat,
  영화: Film,
  전시: Frame,
  사진: Camera,
  동물: PawPrint,
  음악: Music,
  액티비티: Zap,
  역사: Landmark,
};

type InterestTagsProps = {
  selected: string[];
  onToggle: (tag: string) => void;
};

export default function InterestTags({ selected, onToggle }: InterestTagsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">취향 · 관심사</span>
        <span className="text-xs text-muted">
          {selected.length}/{MAX_INTEREST_TAGS}개 선택됨
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {INTEREST_TAGS.map((tag) => {
          const Icon = TAG_ICONS[tag];
          const isSelected = selected.includes(tag);
          const isDisabled = !isSelected && selected.length >= MAX_INTEREST_TAGS;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm disabled:opacity-40 ${
                isSelected ? "border-forest bg-forest-light text-forest" : "border-line text-muted"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
