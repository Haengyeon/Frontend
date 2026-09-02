import { create } from "zustand";
import { MAX_REGIONS } from "@/features/matching/mocks";
import type { MatchingCondition, MatchingStatus } from "@/features/matching/types";

const MATCH_DEADLINE_MS = 12 * 60 * 60 * 1000;
const PAYMENT_DEADLINE_MS = 6 * 60 * 60 * 1000;

type MatchingDraftState = MatchingCondition & {
  status: MatchingStatus;
  matchDeadlineAt: number | null;
  paymentDeadlineAt: number | null;
  setStatus: (status: MatchingStatus) => void;
  setRegions: (regions: string[]) => void;
  toggleRegion: (region: string) => void;
  setAgeRange: (ageRange: [number, number]) => void;
  setPreferredGender: (gender: MatchingCondition["preferredGender"]) => void;
  setAvailableDates: (dates: string[]) => void;
  setThemeIds: (themeIds: string[]) => void;
  reset: () => void;
};

const INITIAL_STATE: MatchingCondition & {
  status: MatchingStatus;
  matchDeadlineAt: number | null;
  paymentDeadlineAt: number | null;
} = {
  status: "none",
  regions: [],
  ageRange: [20, 35],
  preferredGender: "any",
  availableDates: [],
  themeIds: [],
  matchDeadlineAt: null,
  paymentDeadlineAt: null,
};

export const useMatchingDraftStore = create<MatchingDraftState>((set, get) => ({
  ...INITIAL_STATE,
  setStatus: (status) => {
    // 매칭/결제 대기 상태로 들어가는 순간 데드라인을 한 번만 잡아준다 —
    // 실제 흐름이든 테스트 패널로 바로 점프하든 항상 새 카운트다운이 시작된다.
    const { matchDeadlineAt, paymentDeadlineAt } = get();
    set({
      status,
      ...(status === "pending" && matchDeadlineAt === null
        ? { matchDeadlineAt: Date.now() + MATCH_DEADLINE_MS }
        : null),
      ...(status === "payment_pending" && paymentDeadlineAt === null
        ? { paymentDeadlineAt: Date.now() + PAYMENT_DEADLINE_MS }
        : null),
    });
  },
  setRegions: (regions) => set({ regions }),
  toggleRegion: (region) => {
    const { regions } = get();
    if (regions.includes(region)) {
      set({ regions: regions.filter((item) => item !== region) });
      return;
    }
    if (regions.length >= MAX_REGIONS) return;
    set({ regions: [...regions, region] });
  },
  setAgeRange: (ageRange) => set({ ageRange }),
  setPreferredGender: (preferredGender) => set({ preferredGender }),
  setAvailableDates: (availableDates) => set({ availableDates }),
  setThemeIds: (themeIds) => set({ themeIds }),
  reset: () => set({ ...INITIAL_STATE }),
}));
