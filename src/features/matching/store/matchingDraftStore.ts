import { create } from "zustand";
import { MAX_REGIONS } from "@/features/matching/mocks";
import type { MatchingCondition, MatchingStatus } from "@/features/matching/types";

const MATCH_DEADLINE_MS = 12 * 60 * 60 * 1000;
const PAYMENT_DEADLINE_MS = 6 * 60 * 60 * 1000;

type MatchingDraftState = MatchingCondition & {
  status: MatchingStatus;
  matchDeadlineAt: number | null;
  paymentDeadlineAt: number | null;
  /** 서버가 발급한 실제 Matching 리소스 id (수정/재탐색 API 호출에 필요) */
  matchingId: string | null;
  /** 서버가 발급한 현재 MatchAttempt id (상대 프로필 조회에 필요) */
  matchAttemptId: string | null;
  setStatus: (status: MatchingStatus) => void;
  setRegions: (regions: string[]) => void;
  toggleRegion: (region: string) => void;
  setAgeRange: (ageRange: [number, number]) => void;
  setPreferredGender: (gender: MatchingCondition["preferredGender"]) => void;
  setAvailableDates: (dates: string[]) => void;
  setThemeIds: (themeIds: string[]) => void;
  setMatchingId: (matchingId: string | null) => void;
  setMatchAttemptId: (matchAttemptId: string | null) => void;
  reset: () => void;
};

const INITIAL_STATE: MatchingCondition & {
  status: MatchingStatus;
  matchDeadlineAt: number | null;
  paymentDeadlineAt: number | null;
  matchingId: string | null;
  matchAttemptId: string | null;
} = {
  status: "none",
  regions: [],
  ageRange: [20, 35],
  preferredGender: "any",
  availableDates: [],
  themeIds: [],
  matchDeadlineAt: null,
  paymentDeadlineAt: null,
  matchingId: null,
  matchAttemptId: null,
};

export const useMatchingDraftStore = create<MatchingDraftState>((set, get) => ({
  ...INITIAL_STATE,
  setStatus: (status) => {
    // 매칭/결제 대기 상태로 새로 진입할 때마다 데드라인을 다시 잡아준다 —
    // 동일 상태를 반복 설정할 때만(예: 리렌더) 기존 카운트다운을 유지한다.
    const { status: currentStatus } = get();
    set({
      status,
      ...(status === "pending" && currentStatus !== "pending"
        ? { matchDeadlineAt: Date.now() + MATCH_DEADLINE_MS }
        : null),
      ...(status === "payment_pending" && currentStatus !== "payment_pending"
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
  setMatchingId: (matchingId) => set({ matchingId }),
  setMatchAttemptId: (matchAttemptId) => set({ matchAttemptId }),
  reset: () => set({ ...INITIAL_STATE }),
}));
