"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Heart, CalendarDays } from "lucide-react";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import RemovableTag from "@/components/ui/RemovableTag";
import GenderPreferenceSelect from "@/features/matching/components/GenderPreferenceSelect";
import RegionSelectModal from "@/features/matching/components/RegionSelectModal";
import SectionLabel from "@/features/matching/components/SectionLabel";
import { AGE_RANGE_MIN, AGE_RANGE_MAX, getAvailableDateOptions } from "@/features/matching/mocks";
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
  const dateOptions = useMemo(() => getAvailableDateOptions(14), []);

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
        <SectionLabel icon={Users}>나이 범위</SectionLabel>
        <Slider
          min={AGE_RANGE_MIN}
          max={AGE_RANGE_MAX}
          value={ageRange}
          onChange={setAgeRange}
          unit="세"
          openEndedMax
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel icon={Heart}>선호 성별</SectionLabel>
        <GenderPreferenceSelect value={preferredGender} onChange={setPreferredGender} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel icon={CalendarDays}>여행 가능 날짜</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {dateOptions.map((date) => (
            <button
              key={date.value}
              type="button"
              onClick={() => toggleDate(date.value)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                availableDates.includes(date.value)
                  ? "border-forest bg-forest-light text-forest"
                  : "border-line text-muted"
              }`}
            >
              {date.label}
            </button>
          ))}
        </div>
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
