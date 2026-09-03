import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureApiClient } from "@/lib/api/client";

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
      setSession: (accessToken, hasProfile) => set({ accessToken, hasProfile }),
      clearSession: () => set({ accessToken: null, hasProfile: null }),
    }),
    { name: "haengyeon-auth" },
  ),
);

// api 클라이언트는 이 스토어를 몰라야 순환 import가 안 생기므로, 여기서 콜백을 등록해준다.
configureApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => useAuthStore.getState().clearSession(),
});
