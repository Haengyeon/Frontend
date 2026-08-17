"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function NoMatchBanner() {
  const router = useRouter();

  return (
    <div className="relative mx-6 overflow-hidden rounded-3xl bg-forest-light p-6">
      <div className="absolute -right-6 -top-10 h-28 w-28 rounded-full bg-forest/10" />
      <div className="absolute -bottom-8 right-10 h-16 w-16 rounded-full bg-forest/10" />

      <div className="relative flex flex-col gap-3">
        <span className="text-xs font-medium text-forest">행연 · 여행 동행</span>
        <h2 className="text-xl font-semibold leading-snug text-ink">
          새로운 곳에서
          <br />
          새로운 인연을 만나볼까요?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          관광지를 함께 걸으며 취향이 맞는 동행을 찾아보세요.
          <br />
          친구도, 연인도 될 수 있는 특별한 여정이 시작됩니다.
        </p>
        <Button className="mt-2 px-6" onClick={() => router.push("/matching/condition")}>
          매칭 시작하기
        </Button>
      </div>
    </div>
  );
}
