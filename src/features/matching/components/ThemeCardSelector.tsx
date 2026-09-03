"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clover } from "lucide-react";
import StepNavButtons from "@/components/ui/StepNavButtons";
import ConditionConfirmSheet from "@/features/matching/components/ConditionConfirmSheet";
import ThemeGrid from "@/features/matching/components/ThemeGrid";
import { MAX_THEMES } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useCreateMatching, useUpdateMatching } from "@/features/matching/api/useMatchingApi";
import {
  regionToApi,
  themeIdToApi,
  preferredGenderToApi,
  matchingStatusToLocal,
} from "@/features/matching/api/enumMap";
import type { MatchingResponse } from "@/features/matching/api/types";
import { ApiError } from "@/lib/api/client";

export default function ThemeCardSelector() {
  const router = useRouter();
  const {
    regions,
    ageRange,
    preferredGender,
    availableDates,
    themeIds,
    setThemeIds,
    setStatus,
    setMatchingId,
    matchingId,
  } = useMatchingDraftStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createMatching = useCreateMatching();
  // retry_ready 상태에서 "조건 수정하기"로 들어오면 matchingId가 이미 있다 —
  // 이 경우엔 새로 만들지 않고 기존 매칭을 PATCH로 고쳐야 한다.
  const updateMatching = useUpdateMatching(matchingId ?? "");
  const isEditing = Boolean(matchingId);
  const isSubmitting = isEditing ? updateMatching.isPending : createMatching.isPending;

  const toggleTheme = (id: string) => {
    if (themeIds.includes(id)) {
      setThemeIds(themeIds.filter((themeId) => themeId !== id));
      return;
    }
    if (themeIds.length >= MAX_THEMES) return;
    setThemeIds([...themeIds, id]);
  };

  const handleConfirm = () => {
    setErrorMessage(null);
    const payload = {
      regions: regions.map(regionToApi),
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      preferredGender: preferredGenderToApi(preferredGender),
      themes: themeIds.map(themeIdToApi),
      availableDates,
    };
    const handlers = {
      onSuccess: (data: MatchingResponse) => {
        setMatchingId(data.id);
        setStatus(matchingStatusToLocal(data.status));
        router.push("/home");
      },
      onError: (error: unknown) => {
        setErrorMessage(
          error instanceof ApiError ? error.message : "매칭 조건 저장에 실패했어요.",
        );
      },
    };

    if (isEditing) {
      updateMatching.mutate(payload, handlers);
    } else {
      createMatching.mutate(payload, handlers);
    }
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

      {errorMessage ? <p className="text-center text-sm text-red-500">{errorMessage}</p> : null}

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
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
