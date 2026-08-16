"use client";

import { useState } from "react";
import {
  Palette,
  Coffee,
  UtensilsCrossed,
  BookOpen,
  Dumbbell,
  Laptop,
  ChefHat,
  Music,
  Film,
  PenTool,
  Camera,
  Clapperboard,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { INTEREST_TAGS } from "@/features/auth/mocks";

const TAG_ICONS: Record<string, LucideIcon> = {
  예술: Palette,
  카페: Coffee,
  맛집: UtensilsCrossed,
  독서: BookOpen,
  운동: Dumbbell,
  IT: Laptop,
  요리: ChefHat,
  뮤직: Music,
  영화: Film,
  만화: PenTool,
  사진: Camera,
  애니메이션: Clapperboard,
  여행: Plane,
};

export default function InterestTags() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-ink">취향 · 관심사</span>
      <div className="grid grid-cols-3 gap-2">
        {INTEREST_TAGS.map((tag) => {
          const Icon = TAG_ICONS[tag];
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`flex items-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm ${
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
