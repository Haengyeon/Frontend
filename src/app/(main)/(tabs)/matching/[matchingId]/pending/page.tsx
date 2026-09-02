"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hourglass } from "lucide-react";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

const PARTNER_RESPONSE_DELAY_MS = 4000;

export default function Page() {
  const router = useRouter();
  const { matchDeadlineAt, setStatus } = useMatchingDraftStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("payment_pending");
      router.push("/home");
    }, PARTNER_RESPONSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [setStatus, router]);

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
      {matchDeadlineAt ? (
        <p className="text-sm font-medium text-forest">
          <Countdown deadlineAt={matchDeadlineAt} /> 남음
        </p>
      ) : null}
      <p className="text-xs text-muted">
        12시간 이내에 상대방이 응답하지 않으면 매칭이 자동으로 취소돼요.
      </p>
      <Button variant="secondary" className="mt-4 px-6" onClick={() => router.push("/home")}>
        홈으로 가기
      </Button>
    </div>
  );
}
