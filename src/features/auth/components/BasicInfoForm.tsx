"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import JobCategoryModal from "@/features/auth/components/JobCategoryModal";
import type { Gender } from "@/features/auth/types";

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: "male", label: "남성", icon: "♂" },
  { value: "female", label: "여성", icon: "♀" },
  { value: "other", label: "기타", icon: "⚧" },
];

export default function BasicInfoForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [jobCategory, setJobCategory] = useState("");
  const [isJobCategoryPrivate, setIsJobCategoryPrivate] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8">
      <h1 className="text-lg font-semibold text-ink">기본 정보</h1>

      <Input label="이름" placeholder="이름을 입력해주세요" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        label="나이"
        type="number"
        placeholder="나이를 입력해주세요"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

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
        <Button onClick={() => router.push("/profile-setup/photos")}>다음</Button>
      </div>
    </div>
  );
}
