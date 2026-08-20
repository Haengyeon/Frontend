import Image from "next/image";
import {
  Check,
  Leaf,
  Landmark,
  MoonStar,
  Camera,
  Store,
  Zap,
  Footprints,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { MATCHING_THEMES, MAX_THEMES } from "@/features/matching/mocks";

const THEME_ICONS: Record<string, LucideIcon> = {
  nature: Leaf,
  history: Landmark,
  night: MoonStar,
  photo: Camera,
  local: Store,
  activity: Zap,
  walk: Footprints,
  art: Palette,
};

type ThemeGridProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export default function ThemeGrid({ selectedIds, onToggle }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MATCHING_THEMES.map((theme) => {
        const Icon = THEME_ICONS[theme.id];
        const isSelected = selectedIds.includes(theme.id);
        const isDisabled = !isSelected && selectedIds.length >= MAX_THEMES;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onToggle(theme.id)}
            disabled={isDisabled}
            aria-pressed={isSelected}
            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-forest-light to-forest/50 disabled:opacity-40 ${
              isSelected ? "ring-2 ring-forest ring-offset-2 ring-offset-cream" : ""
            }`}
          >
            {theme.imageUrl ? (
              <>
                <Image
                  src={theme.imageUrl}
                  alt={theme.label}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </>
            ) : null}
            {isSelected ? (
              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-white">
                <Check size={14} strokeWidth={2.5} />
              </span>
            ) : null}
            <span className="relative flex flex-col items-center gap-1.5 px-2 text-center text-white [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.35))]">
              <Icon size={26} strokeWidth={1.5} />
              <span className="text-sm font-semibold">{theme.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
