"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clover } from "lucide-react";
import StepNavButtons from "@/features/matching/components/StepNavButtons";
import ConditionConfirmSheet from "@/features/matching/components/ConditionConfirmSheet";
import ThemeGrid from "@/features/matching/components/ThemeGrid";
import { MAX_THEMES } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

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

      <ThemeGrid selectedIds={themeIds} onToggle={toggleTheme} />

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
