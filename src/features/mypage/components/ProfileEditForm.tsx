"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PersonStanding, Smile } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import PhotoUploadBox from "@/components/ui/PhotoUploadBox";
import JobCategoryModal from "@/features/auth/components/JobCategoryModal";
import InterestTags from "@/features/auth/components/InterestTags";
import MbtiSelector from "@/features/auth/components/MbtiSelector";
import { useMyProfile, useUpdateProfile } from "@/features/auth/api/useProfileApi";
import { splitMbti, combineMbti, genderToLocal } from "@/features/auth/api/enumMap";
import { jobCategoryToLocal, jobCategoryToApi, hobbyToLocal, hobbyToApi } from "@/features/matching/api/enumMap";
import { MAX_INTEREST_TAGS } from "@/features/auth/mocks";
import type { ProfileResponse } from "@/features/auth/api/types";
import type { MbtiSelection } from "@/features/auth/types";
import { ApiError } from "@/lib/api/client";

const GENDER_LABELS: Record<"male" | "female" | "other", string> = {
  male: "남성",
  female: "여성",
  other: "기타",
};

export default function ProfileEditForm() {
  const { data: profile, isLoading, error } = useMyProfile();

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        {error instanceof ApiError ? error.message : "프로필을 불러오지 못했어요."}
      </div>
    );
  }

  if (isLoading || !profile) {
    return <div className="flex flex-1 items-center justify-center text-sm text-muted">불러오는 중...</div>;
  }

  // key로 프로필 로드가 끝난 뒤 한 번만 로컬 편집 상태를 초기화한다 (useEffect로 동기화하지 않음).
  return <ProfileEditFields key={profile.id} profile={profile} />;
}

function ProfileEditFields({ profile }: { profile: ProfileResponse }) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const [jobCategory, setJobCategory] = useState(() => jobCategoryToLocal(profile.jobCategory));
  const [isJobCategoryPrivate, setIsJobCategoryPrivate] = useState(profile.jobPrivate);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [bio, setBio] = useState(profile.introduce);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => profile.hobbies.map(hobbyToLocal));
  const [mbti, setMbti] = useState<Partial<MbtiSelection>>(() => splitMbti(profile.mbti));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((item) => item !== tag);
      if (prev.length >= MAX_INTEREST_TAGS) return prev;
      return [...prev, tag];
    });
  };

  const canSubmit = bio.trim().length > 0 && selectedTags.length > 0 && !updateProfile.isPending;

  const handleSubmit = () => {
    setErrorMessage(null);
    updateProfile.mutate(
      {
        introduce: bio.trim(),
        jobCategory: jobCategoryToApi(jobCategory),
        jobPrivate: isJobCategoryPrivate,
        hobbies: selectedTags.map(hobbyToApi),
        mbti: combineMbti(mbti),
      },
      {
        onSuccess: () => router.push("/mypage"),
        onError: (error) => {
          setErrorMessage(error instanceof ApiError ? error.message : "프로필 저장에 실패했어요.");
        },
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex gap-3">
        <PhotoUploadBox label="전신샷 업로드" icon={PersonStanding} />
        <PhotoUploadBox label="얼굴사진 업로드" icon={Smile} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">기본 정보</span>
        <p className="text-sm text-muted">
          {profile.name} · 만 {profile.age}세 · {GENDER_LABELS[genderToLocal(profile.gender)]}
        </p>
        <p className="text-xs text-muted">이름·생년월일·성별은 수정할 수 없어요.</p>
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={200}
          className="resize-none rounded-xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
        />
      </div>

      <InterestTags selected={selectedTags} onToggle={toggleTag} />
      <MbtiSelector selection={mbti} onSelect={(axis, value) => setMbti((prev) => ({ ...prev, [axis]: value }))} />

      {errorMessage ? <p className="text-center text-sm text-red-500">{errorMessage}</p> : null}

      <Button className="mt-auto w-full" disabled={!canSubmit} onClick={handleSubmit}>
        {updateProfile.isPending ? "저장 중..." : "저장하기"}
      </Button>
    </div>
  );
}
