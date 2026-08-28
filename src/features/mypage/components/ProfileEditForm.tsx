"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import PhotoUploadBox from "@/components/ui/PhotoUploadBox";
import JobCategoryModal from "@/features/auth/components/JobCategoryModal";
import { MOCK_MY_PROFILE, INTEREST_TAGS } from "@/features/auth/mocks";
import type { Gender } from "@/features/auth/types";

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: "male", label: "남성", icon: "♂" },
  { value: "female", label: "여성", icon: "♀" },
  { value: "other", label: "기타", icon: "⚧" },
];

export default function ProfileEditForm() {
  const router = useRouter();
  const { basicInfo, bio, interestTags } = MOCK_MY_PROFILE;

  const [name, setName] = useState(basicInfo.name);
  const [age, setAge] = useState(String(basicInfo.age));
  const [gender, setGender] = useState<Gender>(basicInfo.gender);
  const [jobCategory, setJobCategory] = useState(basicInfo.jobCategory);
  const [isJobCategoryPrivate, setIsJobCategoryPrivate] = useState(
    basicInfo.isJobCategoryPrivate,
  );
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [bioText, setBioText] = useState(bio);
  const [selectedTags, setSelectedTags] = useState<string[]>(interestTags);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex gap-3">
        <PhotoUploadBox label="전신샷 업로드" icon="🧍" />
        <PhotoUploadBox label="얼굴사진 업로드" icon="🙂" />
      </div>

      <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        label="나이"
        type="number"
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
          {jobCategory || "직업군을 선택해주세요"}
          <span className="text-muted">›</span>
        </button>
        <div className="flex justify-end">
          <Toggle
            label="직업 비공개"
            checked={isJobCategoryPrivate}
            onChange={setIsJobCategoryPrivate}
          />
        </div>
      </div>

      <JobCategoryModal
        open={isJobModalOpen}
        selected={jobCategory}
        onSelect={setJobCategory}
        onClose={() => setIsJobModalOpen(false)}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">한 줄 소개</span>
        <textarea
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          rows={3}
          className="resize-none rounded-xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">취향 · 관심사</span>
        <div className="flex flex-wrap gap-2">
          {INTEREST_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>
      </div>

      <Button className="mt-auto w-full" onClick={() => router.push("/mypage")}>
        저장하기
      </Button>
    </div>
  );
}
