"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Heart, CalendarDays } from "lucide-react";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import RemovableTag from "@/components/ui/RemovableTag";
import GenderPreferenceSelect from "@/features/matching/components/GenderPreferenceSelect";
import RegionSelectModal from "@/features/matching/components/RegionSelectModal";
import MatchingDateCalendar from "@/features/matching/components/MatchingDateCalendar";
import SectionLabel from "@/features/matching/components/SectionLabel";
import {
  CURRENT_YEAR,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR,
  formatDateLabel,
} from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function ConditionStepOne() {
  const router = useRouter();
  const {
    regions,
    toggleRegion,
    ageRange,
    setAgeRange,
    preferredGender,
    setPreferredGender,
    availableDates,
    setAvailableDates,
  } = useMatchingDraftStore();
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // ageRange = [젊은 나이, 나이 든 나이] → 출생연도로는 [나이 든 쪽 연도(작음), 젊은 쪽 연도(큼)]
  const birthYearRange: [number, number] = [
    CURRENT_YEAR - ageRange[1],
    CURRENT_YEAR - ageRange[0],
  ];

  const handleBirthYearRangeChange = ([low, high]: [number, number]) => {
    setAgeRange([CURRENT_YEAR - high, CURRENT_YEAR - low]);
  };

  const formatAgeFromBirthYear = (year: number) => {
    const age = CURRENT_YEAR - year;
    return year <= MIN_BIRTH_YEAR ? `${age}세+` : `${age}세`;
  };

  const toggleDate = (value: string) => {
    setAvailableDates(
      availableDates.includes(value)
        ? availableDates.filter((date) => date !== value)
        : [...availableDates, value],
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-4">
      <div className="flex flex-col gap-2">
        <SectionLabel icon={MapPin}>여행 지역</SectionLabel>
        <button
          type="button"
          onClick={() => setIsRegionModalOpen(true)}
          className="flex h-12 items-center justify-between rounded-xl border border-line bg-cream-card px-4 text-left text-sm text-ink"
        >
          <span className={regions.length ? "text-ink" : "text-muted"}>
            {regions.length ? `${regions.length}개 지역 선택됨` : "지역을 선택하세요"}
          </span>
          <span className="text-muted">›</span>
        </button>

        {regions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <RemovableTag key={region} label={region} onRemove={() => toggleRegion(region)} />
            ))}
          </div>
        ) : null}

        <RegionSelectModal
          open={isRegionModalOpen}
          selected={regions}
          onToggle={toggleRegion}
          onClose={() => setIsRegionModalOpen(false)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel icon={Users}>상대방 출생연도</SectionLabel>
        <Slider
          min={MIN_BIRTH_YEAR}
          max={MAX_BIRTH_YEAR}
          value={birthYearRange}
          onChange={handleBirthYearRangeChange}
          unit="년생"
          openEndedMin
          reverse
          extraLabel={formatAgeFromBirthYear}
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel icon={Heart}>선호 성별</SectionLabel>
        <GenderPreferenceSelect value={preferredGender} onChange={setPreferredGender} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel icon={CalendarDays}>여행 가능 날짜</SectionLabel>
        <MatchingDateCalendar selectedDates={availableDates} onToggle={toggleDate} />

        {availableDates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {[...availableDates].sort().map((date) => (
              <RemovableTag
                key={date}
                label={formatDateLabel(date)}
                onRemove={() => toggleDate(date)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-auto">
        <Button
          className="w-full"
          disabled={regions.length === 0 || availableDates.length === 0}
          onClick={() => router.push("/matching/theme")}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
