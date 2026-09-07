"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useMyMatching } from "@/features/matching/api/useMatchingApi";

export default function Page() {
  const router = useRouter();
  // 카카오페이 결제창은 window.location.href로 페이지를 완전히 떠났다가 리다이렉트로 돌아오므로,
  // 로컬(zustand) 상태는 전부 초기화된다 — matchingId는 항상 서버에서 다시 조회해야 한다.
  const { data: matching } = useMyMatching();
  const matchingId = matching?.id ?? null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-base font-semibold text-ink">결제에 실패했어요.</p>
      <p className="text-sm text-muted">결제 수단을 확인하고 다시 시도해주세요.</p>
      <Button
        className="w-full"
        disabled={!matchingId}
        onClick={() => router.replace(`/matching/${matchingId}/payment`)}
      >
        다시 시도하기
      </Button>
      <button
        type="button"
        onClick={() => router.replace("/home")}
        className="text-sm text-muted underline underline-offset-2"
      >
        홈으로
      </button>
    </div>
  );
}
