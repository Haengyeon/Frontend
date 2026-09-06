import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureApiClient } from "@/lib/api/client";
import { queryClient } from "@/lib/queryClient";

type AuthState = {
  accessToken: string | null;
  hasProfile: boolean | null;
  setSession: (accessToken: string, hasProfile: boolean) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      hasProfile: null,
      // 계정 전환/로그아웃 시 QueryClient는 그대로 유지되므로, 이전 사용자의 매칭·코스
      // 캐시를 지우지 않으면 새 세션의 화면에 잠깐 이전 계정 데이터가 보일 수 있다.
      setSession: (accessToken, hasProfile) => {
        queryClient.clear();
        set({ accessToken, hasProfile });
      },
      clearSession: () => {
        queryClient.clear();
        set({ accessToken: null, hasProfile: null });
      },
    }),
    { name: "haengyeon-auth" },
  ),
);

// api 클라이언트는 이 스토어를 몰라야 순환 import가 안 생기므로, 여기서 콜백을 등록해준다.
configureApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => useAuthStore.getState().clearSession(),
});
