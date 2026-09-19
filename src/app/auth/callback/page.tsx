"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";
import { consumePostLoginRedirect } from "@/lib/postLoginRedirect";

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
        // 결제 승인처럼 로그인 세션이 도중에 끊겨 다시 로그인해야 했던 경우, 하던 일을
        // 이어갈 수 있게 원래 있던 화면으로 돌려보낸다. 프로필이 없으면(온보딩 전) 그
        // 화면으로 못 돌아가니 기존처럼 가입부터 시키고 저장된 경로는 버린다.
        const savedRedirect = consumePostLoginRedirect();
        router.replace(hasProfile ? (savedRedirect ?? "/home") : "/signup");
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
