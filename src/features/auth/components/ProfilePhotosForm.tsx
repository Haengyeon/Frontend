"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DualPhotoUploadBox from "@/components/ui/DualPhotoUploadBox";
import StepNavButtons from "@/components/ui/StepNavButtons";
import { useProfileDraftStore } from "@/features/auth/store/profileDraftStore";

const MAX_BIO_LENGTH = 200;

export default function ProfilePhotosForm() {
  const router = useRouter();
  const setBio = useProfileDraftStore((state) => state.setBio);
  const setProfileImage = useProfileDraftStore((state) => state.setProfileImage);
  const setFullBodyImage = useProfileDraftStore((state) => state.setFullBodyImage);
  const profileImage = useProfileDraftStore((state) => state.profileImage);
  const fullBodyImage = useProfileDraftStore((state) => state.fullBodyImage);
  const [bio, setBioInput] = useState(() => useProfileDraftStore.getState().bio);

  const canSubmit = bio.trim().length > 0 && Boolean(profileImage) && Boolean(fullBodyImage);

  const handleNext = () => {
    if (!canSubmit) return;
    setBio(bio.trim());
    router.push("/profile-setup/preferences");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">프로필 사진</span>
        <p className="text-xs text-muted">사진 한 장을 올리면 얼굴사진과 전신샷을 함께 만들어요</p>
        <DualPhotoUploadBox onProfileImageSelect={setProfileImage} onFullBodyImageSelect={setFullBodyImage} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">한 줄 소개</span>
        <p className="text-xs text-muted">한 줄로 나를 알려주세요</p>
        <textarea
          value={bio}
          onChange={(e) => setBioInput(e.target.value)}
          rows={4}
          maxLength={MAX_BIO_LENGTH}
          className="resize-none rounded-xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
          placeholder="나를 표현하는 한 줄을 적어주세요"
        />
      </div>

      <div className="mt-auto">
        <StepNavButtons onNext={handleNext} nextDisabled={!canSubmit} />
      </div>
    </div>
  );
}
