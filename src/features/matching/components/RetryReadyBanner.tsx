"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMyMatching, useRetryMatching } from "@/features/matching/api/useMatchingApi";
import { regionToLocal, themeToLocalId, preferredGenderToLocal } from "@/features/matching/api/enumMap";
import { ApiError } from "@/lib/api/client";

export default function RetryReadyBanner() {
  const router = useRouter();
  const matchingId = useMatchingDraftStore((state) => state.matchingId);
  const setRegions = useMatchingDraftStore((state) => state.setRegions);
  const setAgeRange = useMatchingDraftStore((state) => state.setAgeRange);
  const setPreferredGender = useMatchingDraftStore((state) => state.setPreferredGender);
  const setAvailableDates = useMatchingDraftStore((state) => state.setAvailableDates);
  const setThemeIds = useMatchingDraftStore((state) => state.setThemeIds);
  const { data } = useMyMatching();
  const retryMatching = useRetryMatching(matchingId ?? "");

  const handleRetry = () => {
    if (!matchingId) return;
    retryMatching.mutate();
  };

  const handleEditCondition = () => {
    if (!data) return;
    setRegions(data.regions.map(regionToLocal));
    setAgeRange([data.ageMin, data.ageMax]);
    setPreferredGender(preferredGenderToLocal(data.preferredGender));
    setAvailableDates(data.availableDates);
    setThemeIds(data.themes.map(themeToLocalId));
    router.push("/matching/condition");
  };

  return (
    <div className="mx-6 flex flex-col items-center gap-3 rounded-3xl border border-line bg-cream-card p-6 text-center">
      <p className="text-base font-semibold text-ink">아직 딱 맞는 상대를 찾지 못했어요</p>
      <p className="text-sm text-muted">조건을 조금 바꿔보거나, 같은 조건으로 다시 찾아볼 수 있어요.</p>

      {retryMatching.isError ? (
        <p className="text-sm text-red-500">
          {retryMatching.error instanceof ApiError ? retryMatching.error.message : "재탐색에 실패했어요."}
        </p>
      ) : null}

      <div className="mt-2 flex w-full gap-3">
        <Button variant="secondary" className="flex-1" onClick={handleEditCondition} disabled={!data}>
          조건 수정하기
        </Button>
        <Button
          className="flex-1"
          onClick={handleRetry}
          disabled={retryMatching.isPending || !matchingId}
        >
          {retryMatching.isPending ? "재탐색 중..." : "이대로 재탐색"}
        </Button>
      </div>
    </div>
  );
}
