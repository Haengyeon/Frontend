"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hourglass } from "lucide-react";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMyMatching } from "@/features/matching/api/useMatchingApi";

export default function Page() {
  const router = useRouter();
  const { matchDeadlineAt, setStatus } = useMatchingDraftStore();
  const { data } = useMyMatching();

  // 실제 서버 상태를 폴링해서(useMyMatching이 WAITING_RESPONSE일 땐 4초마다 재조회) 상대방이
  // 진짜로 응답했을 때만 다음 화면으로 넘어간다 — 예전엔 4초짜리 가짜 타이머로 무조건
  // "응답 왔다"고 치고 넘어갔는데, 실제 응답 여부와 무관하게 진행되는 버그였다.
  useEffect(() => {
    if (!data || data.status === "WAITING_RESPONSE") return;

    if (data.status === "PAYMENT_PENDING") {
      setStatus("payment_pending");
    } else if (data.status === "RETRY_READY") {
      setStatus("retry_ready");
    } else {
      return;
    }
    router.push("/home");
  }, [data, setStatus, router]);

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
