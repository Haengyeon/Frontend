"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { REGIONS, MAX_REGION_PREFERENCES } from "@/features/matching/mocks";
import { regionToApi } from "@/features/matching/api/enumMap";
import { getSigunguOptions } from "@/features/matching/lib/sigunguNames";
import type { RegionPreference } from "@/features/matching/types";

type RegionSelectModalProps = {
  open: boolean;
  selected: RegionPreference[];
  onAdd: (pref: RegionPreference) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onClose: () => void;
};

export default function RegionSelectModal({
  open,
  selected,
  onAdd,
  onRemove,
  onMove,
  onClose,
}: RegionSelectModalProps) {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0]);
  const isFull = selected.length >= MAX_REGION_PREFERENCES;
  const sigunguOptions = getSigunguOptions(regionToApi(activeRegion));

  const selectedIndexOf = (sigunguCode: string) =>
    selected.findIndex((item) => item.region === activeRegion && item.sigunguCode === sigunguCode);

  const handleSigunguClick = (sigunguCode: string, sigunguName: string) => {
    const index = selectedIndexOf(sigunguCode);
    if (index >= 0) {
      onRemove(index);
      return;
    }
    if (isFull) return;
    onAdd({ region: activeRegion, sigunguCode, sigunguName });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">여행 지역을 순서대로 선택하세요</p>
        <span className="text-xs text-muted">
          {selected.length}/{MAX_REGION_PREFERENCES}개 선택됨
        </span>
      </div>
      <p className="mb-3 text-xs text-muted">
        고른 순서가 곧 우선순위예요(1순위가 매칭에서 가장 먼저 고려돼요). 순서는 아래 목록에서 화살표로 바꿀 수 있어요.
      </p>

      {selected.length > 0 ? (
        <ul className="mb-3 flex flex-col gap-1.5 border-b border-line pb-3">
          {selected.map((pref, index) => (
            <li
              key={`${pref.region}-${pref.sigunguCode}`}
              className="flex items-center gap-2 rounded-xl bg-cream-card px-3 py-2"
            >
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[11px] font-semibold text-white">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-ink">
                {pref.region} {pref.sigunguName}
              </span>
              <button
                type="button"
                onClick={() => onMove(index, "up")}
                disabled={index === 0}
                aria-label="순위 올리기"
                className="text-muted disabled:opacity-30"
              >
                <ChevronUp size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => onMove(index, "down")}
                disabled={index === selected.length - 1}
                aria-label="순위 내리기"
                className="text-muted disabled:opacity-30"
              >
                <ChevronDown size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label="선택 해제"
                className="text-muted"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setActiveRegion(region)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              activeRegion === region
                ? "bg-forest text-white"
                : "bg-cream-card text-ink"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <ul className="grid max-h-60 grid-cols-3 gap-1.5 overflow-y-auto">
        {sigunguOptions.map(({ code, name }) => {
          const index = selectedIndexOf(code);
          const isSelected = index >= 0;
          const disabled = !isSelected && isFull;
          return (
            <li key={code}>
              <button
                type="button"
                onClick={() => handleSigunguClick(code, name)}
                disabled={disabled}
                aria-pressed={isSelected}
                className={`w-full rounded-lg border px-2 py-2 text-center text-xs disabled:opacity-40 ${
                  isSelected
                    ? "border-forest bg-forest-light font-medium text-forest"
                    : "border-line text-ink"
                }`}
              >
                {isSelected ? `${index + 1}순위 · ` : ""}
                {name}
              </button>
            </li>
          );
        })}
      </ul>

      <Button className="mt-4 w-full" onClick={onClose} disabled={selected.length === 0}>
        완료
      </Button>
    </Modal>
  );
}
