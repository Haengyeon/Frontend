import { create } from "zustand";
import type { Gender, MbtiSelection } from "@/features/auth/types";

type ProfileDraftState = {
  name: string;
  birthDate: string;
  gender: Gender | null;
  jobCategory: string;
  isJobCategoryPrivate: boolean;
  bio: string;
  mbti: Partial<MbtiSelection>;
  interestTags: string[];
  setBasicInfo: (info: {
    name: string;
    birthDate: string;
    gender: Gender;
    jobCategory: string;
    isJobCategoryPrivate: boolean;
  }) => void;
  setBio: (bio: string) => void;
  setMbtiAxis: (axis: keyof MbtiSelection, value: string) => void;
  setInterestTags: (tags: string[]) => void;
  reset: () => void;
};

const INITIAL_STATE = {
  name: "",
  birthDate: "",
  gender: null as Gender | null,
  jobCategory: "",
  isJobCategoryPrivate: false,
  bio: "",
  mbti: {} as Partial<MbtiSelection>,
  interestTags: [] as string[],
};

export const useProfileDraftStore = create<ProfileDraftState>((set) => ({
  ...INITIAL_STATE,
  setBasicInfo: (info) => set(info),
  setBio: (bio) => set({ bio }),
  setMbtiAxis: (axis, value) =>
    set((state) => ({ mbti: { ...state.mbti, [axis]: value } as Partial<MbtiSelection> })),
  setInterestTags: (interestTags) => set({ interestTags }),
  reset: () => set({ ...INITIAL_STATE }),
}));
