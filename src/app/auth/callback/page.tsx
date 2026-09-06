"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";

export default function Page() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 카카오 로그인 성공 시 백엔드가 refresh 쿠키만 심어주고 이 페이지로 돌려보낸다.
    // 액세스 토큰은 이 refresh 호출로 처음 발급받는다.
    refreshToken()
      .then(({ accessToken, hasProfile }) => {
        setSession(accessToken, hasProfile);
        router.replace(hasProfile ? "/home" : "/signup");
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "로그인에 실패했어요.");
      });
  }, [router, setSession]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm text-muted">{error ?? "로그인 처리 중이에요..."}</p>
    </div>
  );
}
