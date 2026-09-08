"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import JobCategoryModal from "@/features/auth/components/JobCategoryModal";
import BirthDateSelect from "@/features/auth/components/BirthDateSelect";
import { calculateAge, MIN_SIGNUP_AGE } from "@/features/auth/lib/age";
import { useProfileDraftStore } from "@/features/auth/store/profileDraftStore";
import type { Gender } from "@/features/auth/types";

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: "male", label: "남성", icon: "♂" },
  { value: "female", label: "여성", icon: "♀" },
  { value: "other", label: "기타", icon: "⚧" },
];

export default function BasicInfoForm() {
  const router = useRouter();
  const setBasicInfo = useProfileDraftStore((state) => state.setBasicInfo);
  const draft = useProfileDraftStore.getState();
  const [name, setName] = useState(draft.name);
  const [birthDate, setBirthDate] = useState(draft.birthDate);
  const [gender, setGender] = useState<Gender | null>(draft.gender);
  const [jobCategory, setJobCategory] = useState(draft.jobCategory);
  const [isJobCategoryPrivate, setIsJobCategoryPrivate] = useState(draft.isJobCategoryPrivate);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const age = birthDate ? calculateAge(birthDate) : null;
  const isBirthDateValid = age !== null && age >= MIN_SIGNUP_AGE;
  const canSubmit = name.trim().length > 0 && isBirthDateValid && gender !== null && jobCategory !== "";

  const handleNext = () => {
    if (!canSubmit || !gender) return;
    setBasicInfo({ name: name.trim(), birthDate, gender, jobCategory, isJobCategoryPrivate });
    router.push("/profile-setup/photos");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8">
      <h1 className="text-lg font-semibold text-ink">기본 정보</h1>

      <Input label="이름" placeholder="이름을 입력해주세요" value={name} onChange={(e) => setName(e.target.value)} />
      <BirthDateSelect value={birthDate} onChange={setBirthDate} />
      {birthDate && !isBirthDateValid ? (
        <p className="-mt-4 text-xs text-red-500">만 {MIN_SIGNUP_AGE}세 이상만 가입할 수 있어요.</p>
      ) : null}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">성별</span>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(option.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-3 text-sm ${
                gender === option.value
                  ? "border-forest bg-forest-light text-forest"
                  : "border-line text-muted"
              }`}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">직업군</span>
        <button
          type="button"
          onClick={() => setIsJobModalOpen(true)}
          className="flex h-12 items-center justify-between rounded-xl border border-line bg-cream-card px-4 text-left text-sm text-ink"
        >
          <span className={jobCategory ? "text-ink" : "text-muted"}>
            {jobCategory || "직업군을 선택해주세요"}
          </span>
          <span className="text-muted">›</span>
        </button>
        <div className="flex justify-end">
          <Toggle label="직업 비공개" checked={isJobCategoryPrivate} onChange={setIsJobCategoryPrivate} />
        </div>
      </div>

      <JobCategoryModal
        open={isJobModalOpen}
        selected={jobCategory}
        onSelect={setJobCategory}
        onClose={() => setIsJobModalOpen(false)}
      />

      <div className="mt-auto">
        <Button className="w-full" disabled={!canSubmit} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
