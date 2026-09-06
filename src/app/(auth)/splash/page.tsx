"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { getKakaoLoginUrl } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Page() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasProfile = useAuthStore((state) => state.hasProfile);

  // 이미 로그인돼 있으면(새로고침 등으로 영속화된 세션이 남아있으면) 로그인 화면을
  // 다시 보여줄 필요가 없다. 첫 렌더는 서버와 동일하게 스플래시로 그리고, 마운트 후에만
  // 판단해서 넘겨야 zustand persist 값 때문에 hydration mismatch가 나지 않는다.
  useEffect(() => {
    if (accessToken) router.replace(hasProfile ? "/home" : "/signup");
  }, [accessToken, hasProfile, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-16 px-8">
      <h1 className="text-4xl font-bold tracking-wide text-ink">LOGO</h1>
      <Button
        variant="kakao"
        className="w-full"
        onClick={() => {
          window.location.href = getKakaoLoginUrl();
        }}
      >
        💬 카카오로 시작하기
      </Button>
    </div>
  );
}
