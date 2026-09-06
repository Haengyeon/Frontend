"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { logout, withdrawUser } from "./authApi";

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  return useMutation({
    mutationFn: logout,
    // 서버 호출이 실패해도(네트워크 문제 등) 로컬 세션은 지워서 로그인 화면으로 보낸다.
    onSettled: () => clearSession(),
  });
}

export function useWithdraw() {
  const clearSession = useAuthStore((state) => state.clearSession);
  return useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => clearSession(),
  });
}
