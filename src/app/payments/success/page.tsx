"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { approvePayment } from "@/features/payment/api/paymentApi";
import { useCancelPayment } from "@/features/payment/api/usePaymentApi";
import { ApiError } from "@/lib/api/client";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const pgToken = searchParams.get("pg_token");
  const cancelPayment = useCancelPayment();
  const [error, setError] = useState<string | null>(null);
  const [matchConfirmed, setMatchConfirmed] = useState<boolean | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId || !pgToken) return;
    approvePayment({ paymentId, pgToken })
      .then((data) => {
        setMatchConfirmed(data.matchConfirmed);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "결제 승인에 실패했어요.");
      });
  }, [paymentId, pgToken]);

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
      onSuccess: () => router.replace("/home"),
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
