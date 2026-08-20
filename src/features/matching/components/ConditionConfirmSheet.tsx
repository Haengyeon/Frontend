"use client";

import { MapPin, Users, Heart, CalendarDays, Clover } from "lucide-react";
import Button from "@/components/ui/Button";
import BottomSheet from "@/components/ui/BottomSheet";
import InfoRow from "@/features/matching/components/InfoRow";
import {
  formatAgeRange,
  formatDateLabel,
  getGenderLabel,
  getThemeLabels,
} from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

type ConditionConfirmSheetProps = {
  open: boolean;
  onEdit: () => void;
  onConfirm: () => void;
};

export default function ConditionConfirmSheet({ open, onEdit, onConfirm }: ConditionConfirmSheetProps) {
  const { regions, ageRange, preferredGender, availableDates, themeIds } =
    useMatchingDraftStore();

  const rows = [
    { icon: MapPin, label: "여행 지역", value: regions.join(", ") || "미선택" },
    { icon: Users, label: "나이 범위", value: formatAgeRange(ageRange) },
    { icon: Heart, label: "선호 성별", value: getGenderLabel(preferredGender) },
    {
      icon: CalendarDays,
      label: "매칭 가능 날짜",
      value: availableDates.length ? availableDates.map(formatDateLabel).join(", ") : "미선택",
    },
    { icon: Clover, label: "선택한 테마", value: getThemeLabels(themeIds) || "미선택" },
  ];

  return (
    <BottomSheet open={open} onClose={onEdit} labelledBy="condition-confirm-heading">
      <h2
        id="condition-confirm-heading"
        className="mb-4 text-center text-base font-semibold text-ink"
      >
        선택하신 매칭 조건을
        <br />
        확인해주세요
      </h2>

      <div className="flex flex-col gap-4 rounded-2xl border border-line p-5">
        {rows.map((row) => (
          <InfoRow key={row.label} {...row} />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        선택하신 조건은 매칭 전까지 수정이 가능해요. 매칭이 시작되면 변경할 수 없어요.
      </p>

      <div className="mt-4 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onEdit}>
          수정하기
        </Button>
        <Button className="flex-[2]" onClick={onConfirm}>
          매칭 시작하기
        </Button>
      </div>
    </BottomSheet>
  );
}
