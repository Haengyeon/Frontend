"use client";

import { useState } from "react";
import { devToken } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { DEV_SEED_USERS } from "@/features/auth/mocks";
import { ApiError } from "@/lib/api/client";

export default function DevLoginPanel() {
  const { accessToken, setSession, clearSession } = useAuthStore();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (userId: string) => {
    setLoadingUserId(userId);
    setError(null);
    try {
      const { accessToken: token, hasProfile } = await devToken(userId);
      setSession(token, hasProfile);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "토큰 발급 실패");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 z-[100] flex w-40 -translate-y-1/2 flex-col gap-1.5 rounded-2xl bg-black/80 p-3 text-white shadow-lg backdrop-blur-sm">
      <span className="px-1 text-[11px] font-semibold text-white/60">[개발용] 시드 로그인</span>
      <span className="px-1 text-[10px] text-white/40">
        {accessToken ? "로그인됨" : "로그인 안 됨"}
      </span>
      {DEV_SEED_USERS.map((user) => (
        <button
          key={user.userId}
          type="button"
          onClick={() => handleLogin(user.userId)}
          disabled={loadingUserId !== null}
          className="rounded-lg px-3 py-1.5 text-left text-xs hover:bg-white/10 disabled:opacity-40"
        >
          {loadingUserId === user.userId ? "발급 중..." : `${user.userId}. ${user.name}`}
        </button>
      ))}
      {accessToken ? (
        <button
          type="button"
          onClick={clearSession}
          className="mt-1 rounded-lg px-3 py-1.5 text-left text-xs text-white/60 hover:bg-white/10"
        >
          로그아웃(토큰 삭제)
        </button>
      ) : null}
      {error ? <span className="px-1 text-[10px] text-red-300">{error}</span> : null}
    </div>
  );
}
