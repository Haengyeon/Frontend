"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-16 px-8">
      <h1 className="text-4xl font-bold tracking-wide text-ink">LOGO</h1>
      <Button variant="kakao" onClick={() => router.push("/signup")}>
        💬 카카오로 시작하기
      </Button>
    </div>
  );
}
