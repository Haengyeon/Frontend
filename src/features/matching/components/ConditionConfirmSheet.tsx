"use client";

import { useEffect, useRef } from "react";
import { MapPin, Users, Heart, CalendarDays, Clover } from "lucide-react";
import Button from "@/components/ui/Button";
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function ConditionConfirmSheet({ open, onEdit, onConfirm }: ConditionConfirmSheetProps) {
  const { regions, ageRange, preferredGender, availableDates, themeIds } =
    useMatchingDraftStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onEditRef = useRef(onEdit);

  useEffect(() => {
    onEditRef.current = onEdit;
  }, [onEdit]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEditRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open]);

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
    <div
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onEdit} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="condition-confirm-heading"
        tabIndex={-1}
        className={`relative w-full max-w-md rounded-t-3xl bg-cream-card p-6 pb-8 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
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
      </div>
    </div>
  );
}
