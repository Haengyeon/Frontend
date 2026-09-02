"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toDateValue, AVAILABLE_DATE_RANGE_DAYS } from "@/features/matching/mocks";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type MatchingDateCalendarProps = {
  selectedDates: string[];
  onToggle: (date: string) => void;
};

export default function MatchingDateCalendar({
  selectedDates,
  onToggle,
}: MatchingDateCalendarProps) {
  const { minDate, maxDate } = useMemo(() => {
    const min = new Date();
    min.setHours(0, 0, 0, 0);
    min.setDate(min.getDate() + 1);
    const max = new Date();
    max.setHours(0, 0, 0, 0);
    max.setDate(max.getDate() + AVAILABLE_DATE_RANGE_DAYS);
    return { minDate: min, maxDate: max };
  }, []);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(minDate.getFullYear(), minDate.getMonth(), 1),
  );

  const canGoPrev = viewMonth > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canGoNext = viewMonth < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const weeks = useMemo(() => {
    const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const lastDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) cells.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const result: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [viewMonth]);

  return (
    <div className="rounded-2xl border border-line bg-cream-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
          }
          disabled={!canGoPrev}
          aria-label="이전 달"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink disabled:opacity-30"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <span className="text-sm font-semibold text-ink">
          {viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월
        </span>
        <button
          type="button"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
          }
          disabled={!canGoNext}
          aria-label="다음 달"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink disabled:opacity-30"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-muted">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {weeks.flatMap((week, weekIndex) =>
          week.map((date, dayIndex) => {
            if (!date) return <span key={`${weekIndex}-${dayIndex}`} />;

            const value = toDateValue(date);
            const isSelectable = date >= minDate && date <= maxDate;
            const isSelected = selectedDates.includes(value);

            return (
              <button
                key={value}
                type="button"
                onClick={() => onToggle(value)}
                disabled={!isSelectable}
                aria-pressed={isSelected}
                className={`mx-auto flex aspect-square w-9 items-center justify-center rounded-full text-sm ${
                  isSelected
                    ? "bg-forest text-white"
                    : isSelectable
                      ? "text-ink hover:bg-forest-light"
                      : "text-muted/30"
                }`}
              >
                {date.getDate()}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
