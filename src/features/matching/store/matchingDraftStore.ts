import { create } from "zustand";
import type { MatchingCondition, MatchingStatus } from "@/features/matching/types";

type MatchingDraftState = MatchingCondition & {
  status: MatchingStatus;
  setStatus: (status: MatchingStatus) => void;
  setRegions: (regions: string[]) => void;
  toggleRegion: (region: string) => void;
  setAgeRange: (ageRange: [number, number]) => void;
  setPreferredGender: (gender: MatchingCondition["preferredGender"]) => void;
  setAvailableDates: (dates: string[]) => void;
  setThemeIds: (themeIds: string[]) => void;
  reset: () => void;
};

const INITIAL_STATE: MatchingCondition & { status: MatchingStatus } = {
  status: "none",
  regions: [],
  ageRange: [20, 35],
  preferredGender: "any",
  availableDates: [],
  themeIds: [],
};

export const useMatchingDraftStore = create<MatchingDraftState>((set, get) => ({
  ...INITIAL_STATE,
  setStatus: (status) => set({ status }),
  setRegions: (regions) => set({ regions }),
  toggleRegion: (region) => {
    const { regions } = get();
    set({
      regions: regions.includes(region)
        ? regions.filter((item) => item !== region)
        : [...regions, region],
    });
  },
  setAgeRange: (ageRange) => set({ ageRange }),
  setPreferredGender: (preferredGender) => set({ preferredGender }),
  setAvailableDates: (availableDates) => set({ availableDates }),
  setThemeIds: (themeIds) => set({ themeIds }),
  reset: () => set({ ...INITIAL_STATE }),
}));
