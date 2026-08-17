"use client";

import { useRouter } from "next/navigation";
import { Hourglass } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-light">
        <Hourglass size={28} strokeWidth={1.5} className="text-forest" />
      </div>
      <p className="text-base font-semibold text-ink">매칭 접수가 완료됐어요!</p>
      <p className="text-sm text-muted">
        상대방의 응답을 기다리고 있어요.
        <br />
        응답이 오면 알림으로 알려드릴게요.
      </p>
      <Button variant="secondary" className="mt-4 px-6" onClick={() => router.push("/home")}>
        홈으로 가기
      </Button>
    </div>
  );
}
