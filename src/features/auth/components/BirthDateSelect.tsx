"use client";

import { useState } from "react";

const currentYear = new Date().getFullYear();
const MIN_BIRTH_YEAR = 1900;
const YEAR_OPTIONS = Array.from({ length: currentYear - MIN_BIRTH_YEAR + 1 }, (_, i) => currentYear - i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number | null, month: number | null): number {
  if (year === null || month === null) return 31;
  return new Date(year, month, 0).getDate();
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function parse(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return {
    year: match ? Number(match[1]) : null,
    month: match ? Number(match[2]) : null,
    day: match ? Number(match[3]) : null,
  };
}

type BirthDateSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function BirthDateSelect({ value, onChange }: BirthDateSelectProps) {
  const initial = parse(value);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);

  const dayOptions = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  const emit = (nextYear: number | null, nextMonth: number | null, nextDay: number | null) => {
    if (nextYear === null || nextMonth === null || nextDay === null) {
      onChange("");
      return;
    }
    onChange(`${nextYear}-${pad(nextMonth)}-${pad(nextDay)}`);
  };

  const handleYearChange = (raw: string) => {
    const nextYear = raw ? Number(raw) : null;
    const clampedDay = day !== null ? Math.min(day, daysInMonth(nextYear, month)) : null;
    setYear(nextYear);
    setDay(clampedDay);
    emit(nextYear, month, clampedDay);
  };

  const handleMonthChange = (raw: string) => {
    const nextMonth = raw ? Number(raw) : null;
    const clampedDay = day !== null ? Math.min(day, daysInMonth(year, nextMonth)) : null;
    setMonth(nextMonth);
    setDay(clampedDay);
    emit(year, nextMonth, clampedDay);
  };

  const handleDayChange = (raw: string) => {
    const nextDay = raw ? Number(raw) : null;
    setDay(nextDay);
    emit(year, month, nextDay);
  };

  const selectClassName =
    "h-12 flex-1 rounded-xl border border-line bg-cream-card px-3 text-sm text-ink focus:border-forest focus:outline-none";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">생년월일</span>
      <div className="flex gap-2">
        <select
          aria-label="출생 연도"
          className={selectClassName}
          value={year ?? ""}
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <option value="">년도</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <select
          aria-label="출생 월"
          className={selectClassName}
          value={month ?? ""}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          <option value="">월</option>
          {MONTH_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
        <select
          aria-label="출생 일"
          className={selectClassName}
          value={day ?? ""}
          onChange={(e) => handleDayChange(e.target.value)}
        >
          <option value="">일</option>
          {dayOptions.map((d) => (
            <option key={d} value={d}>
              {d}일
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
