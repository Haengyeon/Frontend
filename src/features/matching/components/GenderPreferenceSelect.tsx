import { GENDER_OPTIONS } from "@/features/matching/mocks";
import type { MatchingCondition } from "@/features/matching/types";

type GenderPreferenceSelectProps = {
  value: MatchingCondition["preferredGender"];
  onChange: (value: MatchingCondition["preferredGender"]) => void;
};

export default function GenderPreferenceSelect({ value, onChange }: GenderPreferenceSelectProps) {
  return (
    <div className="flex gap-2">
      {GENDER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-3 text-sm ${
            value === option.value ? "border-forest bg-forest-light text-forest" : "border-line text-muted"
          }`}
        >
          <span>{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
