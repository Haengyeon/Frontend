"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Check,
  Clover,
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
import StepNavButtons from "@/features/matching/components/StepNavButtons";
import ConditionConfirmSheet from "@/features/matching/components/ConditionConfirmSheet";
import { MATCHING_THEMES } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

const MAX_THEMES = 3;

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

export default function ThemeCardSelector() {
  const router = useRouter();
  const { themeIds, setThemeIds, setStatus } = useMatchingDraftStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const toggleTheme = (id: string) => {
    if (themeIds.includes(id)) {
      setThemeIds(themeIds.filter((themeId) => themeId !== id));
      return;
    }
    if (themeIds.length >= MAX_THEMES) return;
    setThemeIds([...themeIds, id]);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex flex-col gap-1 rounded-2xl bg-forest-light p-4">
        <h2 className="flex items-center gap-1.5 text-base font-semibold text-forest">
          <Clover size={18} strokeWidth={2} />
          어떤 여행을 선호하시나요?
        </h2>
        <p className="text-sm text-forest/70">
          최대 3개까지 테마를 고를 수 있어요 · {themeIds.length}/{MAX_THEMES} 선택됨
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MATCHING_THEMES.map((theme) => {
          const Icon = THEME_ICONS[theme.id];
          const isSelected = themeIds.includes(theme.id);
          const isDisabled = !isSelected && themeIds.length >= MAX_THEMES;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => toggleTheme(theme.id)}
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

      <div className="mt-auto">
        <StepNavButtons
          onBack={() => router.push("/matching/condition")}
          nextLabel="매칭 시작"
          nextDisabled={themeIds.length === 0}
          onNext={() => setIsConfirmOpen(true)}
        />
      </div>

      <ConditionConfirmSheet
        open={isConfirmOpen}
        onEdit={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setStatus("searching");
          router.push("/home");
        }}
      />
    </div>
  );
}
