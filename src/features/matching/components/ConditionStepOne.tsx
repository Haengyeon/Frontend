"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Heart, CalendarDays, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import RemovableTag from "@/components/ui/RemovableTag";
import Toggle from "@/components/ui/Toggle";
import GenderPreferenceSelect from "@/features/matching/components/GenderPreferenceSelect";
import RegionSelectModal from "@/features/matching/components/RegionSelectModal";
import MatchingDateCalendar from "@/features/matching/components/MatchingDateCalendar";
import SectionLabel from "@/features/matching/components/SectionLabel";
import {
  CURRENT_YEAR,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR,
  formatDateLabel,
  toDateValue,
} from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function ConditionStepOne() {
  const router = useRouter();
  const {
    regionPreferences,
    addRegionPreference,
    removeRegionPreference,
    moveRegionPreference,
    ageRange,
    setAgeRange,
    preferredGender,
    setPreferredGender,
    availableDates,
    setAvailableDates,
    isExperience,
    setIsExperience,
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

  const handleExperienceChange = (next: boolean) => {
    setIsExperience(next);
    if (next) return;

    // 체험 매칭에서 넣어둔 오늘 날짜는 실제 매칭 캘린더(내일부터 선택 가능)로는 지울 수
    // 없어서, 토글을 끌 때 직접 걷어낸다 — 안 그러면 오늘 날짜가 실제 매칭 요청에 섞여 간다.
    const today = toDateValue(new Date());
    setAvailableDates(availableDates.filter((date) => date !== today));
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-cream-card p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Sparkles size={16} strokeWidth={1.5} className="text-forest" />
            체험 매칭으로 시작
          </span>
          <Toggle checked={isExperience} onChange={handleExperienceChange} />
        </div>
        <p className="text-xs leading-relaxed text-muted">
          실제 상대 없이 가상 프로필과 바로 매칭돼서 결제·코스·채팅까지 미리 체험해볼 수 있어요.
          여행 날짜는 오늘로 고정돼요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel icon={MapPin}>여행 지역</SectionLabel>
        <button
          type="button"
          onClick={() => setIsRegionModalOpen(true)}
          className="flex h-12 items-center justify-between rounded-xl border border-line bg-cream-card px-4 text-left text-sm text-ink"
        >
          <span className={regionPreferences.length ? "text-ink" : "text-muted"}>
            {regionPreferences.length ? `${regionPreferences.length}개 지역 선택됨` : "지역을 선택하세요"}
          </span>
          <span className="text-muted">›</span>
        </button>

        {regionPreferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {regionPreferences.map((pref, index) => (
              <RemovableTag
                key={`${pref.region}-${pref.sigunguCode}`}
                label={`${index + 1}순위 · ${pref.region} ${pref.sigunguName}`}
                onRemove={() => removeRegionPreference(index)}
              />
            ))}
          </div>
        ) : null}

        <RegionSelectModal
          open={isRegionModalOpen}
          selected={regionPreferences}
          onAdd={addRegionPreference}
          onRemove={removeRegionPreference}
          onMove={moveRegionPreference}
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

      {!isExperience ? (
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
      ) : null}

      <div className="mt-auto">
        <Button
          className="w-full"
          disabled={regionPreferences.length === 0 || (!isExperience && availableDates.length === 0)}
          onClick={() => router.push("/matching/theme")}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
