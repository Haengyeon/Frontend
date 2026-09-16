import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_REGION_PREFERENCES } from "@/features/matching/mocks";
import type { MatchingCondition, MatchingStatus, RegionPreference } from "@/features/matching/types";

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
  /**
   * 내가 결제를 완료한 MatchAttempt의 id — GET /match-attempts/{id}에는 "내가 이미
   * 결제했는지"가 없어서(전체 상태만 PAYMENT_PENDING으로 내려오고 누가 냈는지는 안 알려줌)
   * 결제 승인 성공 시점에 프론트가 직접 기록해둔다. matchAttemptId와 비교해서 "이번 시도에
   * 대해" 냈는지를 판단하므로, 매칭이 취소되고 새 시도가 생겨도 엉뚱하게 남아있지 않는다.
   * localStorage에 저장해서 새로고침에도 유지된다(카카오페이 결제창 왕복은 페이지 전체를
   * 새로 로드하는 방식이라, 저장 안 하면 돌아왔을 때 이 값도 날아간다).
   */
  paidMatchAttemptId: string | null;
  setStatus: (status: MatchingStatus) => void;
  setPaidMatchAttemptId: (matchAttemptId: string | null) => void;
  setRegionPreferences: (regionPreferences: RegionPreference[]) => void;
  /** 새 지역을 우선순위 맨 뒤(가장 낮은 순위)에 추가한다. 이미 있거나 5개 꽉 찼으면 무시. */
  addRegionPreference: (pref: RegionPreference) => void;
  removeRegionPreference: (index: number) => void;
  /** 순위 목록에서 위/아래로 한 칸 옮긴다(완료 전 순위를 직접 조정할 수 있게). */
  moveRegionPreference: (index: number, direction: "up" | "down") => void;
  setAgeRange: (ageRange: [number, number]) => void;
  setPreferredGender: (gender: MatchingCondition["preferredGender"]) => void;
  setAvailableDates: (dates: string[]) => void;
  setThemeIds: (themeIds: string[]) => void;
  setMatchingId: (matchingId: string | null) => void;
  setMatchAttemptId: (matchAttemptId: string | null) => void;
  /** 서버가 내려준 실제 만료 시각으로 카운트다운을 덮어쓴다 (새로고침 시 로컬 추정치 대신 이 값을 신뢰). */
  syncDeadlines: (updates: { matchDeadlineAt?: number | null; paymentDeadlineAt?: number | null }) => void;
  reset: () => void;
};

const INITIAL_STATE: MatchingCondition & {
  status: MatchingStatus;
  matchDeadlineAt: number | null;
  paymentDeadlineAt: number | null;
  matchingId: string | null;
  matchAttemptId: string | null;
  paidMatchAttemptId: string | null;
} = {
  status: "none",
  regionPreferences: [],
  ageRange: [20, 35],
  preferredGender: "any",
  availableDates: [],
  themeIds: [],
  matchDeadlineAt: null,
  paymentDeadlineAt: null,
  matchingId: null,
  matchAttemptId: null,
  paidMatchAttemptId: null,
};

export const useMatchingDraftStore = create<MatchingDraftState>()(
  persist(
    (set, get) => ({
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
      setPaidMatchAttemptId: (matchAttemptId) => set({ paidMatchAttemptId: matchAttemptId }),
      setRegionPreferences: (regionPreferences) => set({ regionPreferences }),
      addRegionPreference: (pref) => {
        const { regionPreferences } = get();
        if (regionPreferences.length >= MAX_REGION_PREFERENCES) return;
        if (
          regionPreferences.some(
            (item) => item.region === pref.region && item.sigunguCode === pref.sigunguCode,
          )
        ) {
          return;
        }
        set({ regionPreferences: [...regionPreferences, pref] });
      },
      removeRegionPreference: (index) => {
        const { regionPreferences } = get();
        set({ regionPreferences: regionPreferences.filter((_, i) => i !== index) });
      },
      moveRegionPreference: (index, direction) => {
        const { regionPreferences } = get();
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= regionPreferences.length) return;
        const next = [...regionPreferences];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        set({ regionPreferences: next });
      },
      setAgeRange: (ageRange) => set({ ageRange }),
      setPreferredGender: (preferredGender) => set({ preferredGender }),
      setAvailableDates: (availableDates) => set({ availableDates }),
      setThemeIds: (themeIds) => set({ themeIds }),
      setMatchingId: (matchingId) => set({ matchingId }),
      setMatchAttemptId: (matchAttemptId) => set({ matchAttemptId }),
      syncDeadlines: (updates) => set(updates),
      reset: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "matching-draft",
      // 이 스토어의 다른 필드(regions, themeIds 등)는 폴링으로 서버와 계속 동기화되는
      // 값이라 굳이 영속시킬 필요가 없다 — 결제 왕복에서만 필요한 이 필드만 저장한다.
      partialize: (state) => ({ paidMatchAttemptId: state.paidMatchAttemptId }),
    },
  ),
);
