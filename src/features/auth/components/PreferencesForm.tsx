"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepNavButtons from "@/components/ui/StepNavButtons";
import MbtiSelector from "@/features/auth/components/MbtiSelector";
import InterestTags from "@/features/auth/components/InterestTags";
import { useProfileDraftStore } from "@/features/auth/store/profileDraftStore";
import { useCreateProfile } from "@/features/auth/api/useProfileApi";
import { genderToApi, combineMbti } from "@/features/auth/api/enumMap";
import { jobCategoryToApi, hobbyToApi } from "@/features/matching/api/enumMap";
import {
  PLACEHOLDER_PROFILE_IMAGE_URL,
  PLACEHOLDER_FULL_BODY_IMAGE_URL,
  MAX_INTEREST_TAGS,
} from "@/features/auth/mocks";
import { ApiError } from "@/lib/api/client";

export default function PreferencesForm() {
  const router = useRouter();
  const draft = useProfileDraftStore();
  const createProfile = useCreateProfile();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이전 단계를 건너뛰고 직접 들어온 경우 기본 정보가 비어있으니 처음부터 다시 시작한다.
  // 단, 제출 성공 후 draft.reset()이 같은 조건(name/gender 없음)을 만들기 때문에
  // isSuccess일 때는 이 가드가 /home 이동을 가로채 /signup으로 되돌리지 않도록 건너뛴다.
  useEffect(() => {
    if (createProfile.isSuccess) return;
    if (!draft.name || !draft.gender) router.replace("/signup");
  }, [draft.name, draft.gender, router, createProfile.isSuccess]);

  const toggleInterestTag = (tag: string) => {
    if (draft.interestTags.includes(tag)) {
      draft.setInterestTags(draft.interestTags.filter((item) => item !== tag));
      return;
    }
    if (draft.interestTags.length >= MAX_INTEREST_TAGS) return;
    draft.setInterestTags([...draft.interestTags, tag]);
  };

  const canSubmit = draft.interestTags.length > 0 && !createProfile.isPending;

  const handleSubmit = () => {
    if (!draft.gender) return;
    setErrorMessage(null);
    createProfile.mutate(
      {
        name: draft.name,
        birthDate: draft.birthDate,
        gender: genderToApi(draft.gender),
        mbti: combineMbti(draft.mbti),
        introduce: draft.bio,
        jobCategory: jobCategoryToApi(draft.jobCategory),
        jobPrivate: draft.isJobCategoryPrivate,
        hobbies: draft.interestTags.map(hobbyToApi),
        profileImageUrl: PLACEHOLDER_PROFILE_IMAGE_URL,
        fullBodyImageUrl: PLACEHOLDER_FULL_BODY_IMAGE_URL,
      },
      {
        onSuccess: () => {
          draft.reset();
          router.push("/home");
        },
        onError: (error) => {
          setErrorMessage(error instanceof ApiError ? error.message : "프로필 작성에 실패했어요.");
        },
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 pb-8">
      <InterestTags selected={draft.interestTags} onToggle={toggleInterestTag} />
      <MbtiSelector selection={draft.mbti} onSelect={draft.setMbtiAxis} />

      {errorMessage ? <p className="text-center text-sm text-red-500">{errorMessage}</p> : null}

      <div className="mt-auto">
        <StepNavButtons
          onNext={handleSubmit}
          nextDisabled={!canSubmit}
          nextLabel={createProfile.isPending ? "등록 중..." : "완료"}
        />
      </div>
    </div>
  );
}
