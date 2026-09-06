"use client";

import Button from "@/components/ui/Button";
import { getKakaoLoginUrl } from "@/features/auth/api/authApi";

export default function Page() {
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
