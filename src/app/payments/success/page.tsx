"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { approvePayment } from "@/features/payment/api/paymentApi";
import { useCancelPayment } from "@/features/payment/api/usePaymentApi";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { ApiError } from "@/lib/api/client";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const pgToken = searchParams.get("pg_token");
  const cancelPayment = useCancelPayment();
  const setPaidMatchAttemptId = useMatchingDraftStore((state) => state.setPaidMatchAttemptId);
  const [error, setError] = useState<string | null>(null);
  const [matchConfirmed, setMatchConfirmed] = useState<boolean | null>(null);
  const [matchAttemptId, setMatchAttemptId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const approvedRef = useRef(false);

  // pg_token은 1회용이라 두 번 승인 요청을 보내면 두 번째 호출이 실패한다. Strict Mode의
  // 이펙트 재실행이나 리렌더로 같은 토큰이 다시 전송되지 않도록 ref로 막는다.
  // (예전엔 언마운트 시 결과를 무시하는 ignore 플래그도 같이 뒀는데, Strict Mode의
  // 마운트→언마운트→재마운트 사이에 실제 승인 응답이 도착하면 ignore가 이미 true라
  // 성공했는데도 화면이 영영 "확인 중" 에 멈추는 버그가 있었다. ref 하나로 중복 호출만
  // 막으면 충분하다.)
  useEffect(() => {
    if (!paymentId || !pgToken || approvedRef.current) return;
    approvedRef.current = true;
    approvePayment({ paymentId, pgToken })
      .then((data) => {
        setMatchConfirmed(data.matchConfirmed);
        setMatchAttemptId(data.matchAttemptId);
        setPaidMatchAttemptId(data.matchAttemptId);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "결제 승인에 실패했어요.");
      });
  }, [paymentId, pgToken, setPaidMatchAttemptId]);

  if (!paymentId || !pgToken) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-red-500">결제 정보가 올바르지 않아요.</p>
        <Button className="w-full" onClick={() => router.replace("/home")}>
          홈으로
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <Button className="w-full" onClick={() => router.replace("/home")}>
          홈으로
        </Button>
      </div>
    );
  }

  if (matchConfirmed === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm text-muted">결제를 확인하고 있어요...</p>
      </div>
    );
  }

  const handleCancel = () => {
    if (!paymentId) return;
    setCancelError(null);
    cancelPayment.mutate(paymentId, {
      onSuccess: () => {
        if (matchAttemptId) setPaidMatchAttemptId(null);
        router.replace("/home");
      },
      onError: (err) => {
        setCancelError(err instanceof ApiError ? err.message : "결제 취소에 실패했어요.");
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-base font-semibold text-ink">
        {matchConfirmed
          ? "결제가 완료됐어요! 매칭이 확정됐어요 🎉"
          : "결제가 완료됐어요. 상대방의 결제를 기다리고 있어요."}
      </p>

      {cancelError ? <p className="text-sm text-red-500">{cancelError}</p> : null}

      <Button className="w-full" onClick={() => router.replace("/home")}>
        홈으로
      </Button>

      {!matchConfirmed ? (
        <button
          type="button"
          onClick={handleCancel}
          disabled={cancelPayment.isPending}
          className="text-xs text-muted underline underline-offset-2 disabled:opacity-50"
        >
          {cancelPayment.isPending ? "취소 처리 중..." : "결제 취소하기"}
        </button>
      ) : null}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm text-muted">결제를 확인하고 있어요...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
