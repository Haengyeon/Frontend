"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { approvePayment } from "@/features/payment/api/paymentApi";
import { useCancelPayment } from "@/features/payment/api/usePaymentApi";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { getKakaoLoginUrl, refreshToken } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";
import { setPostLoginRedirect } from "@/lib/postLoginRedirect";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const pgToken = searchParams.get("pg_token");
  const cancelPayment = useCancelPayment();
  const setPaidMatchAttemptId = useMatchingDraftStore((state) => state.setPaidMatchAttemptId);
  const [error, setError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
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

    const handleSuccess = (data: { matchConfirmed: boolean; matchAttemptId: string }) => {
      setMatchConfirmed(data.matchConfirmed);
      setMatchAttemptId(data.matchAttemptId);
      setPaidMatchAttemptId(data.matchAttemptId);
    };

    approvePayment({ paymentId, pgToken })
      .then(handleSuccess)
      .catch(async (err) => {
        // 카카오페이 결제창에 머무는 동안 액세스 토큰이 401을 낸 경우. 액세스 토큰만
        // 유실됐을 뿐(예: 결제창을 별도 웹뷰로 열어 로컬스토리지가 분리되는 환경) 로그인
        // 자체는 아직 유효할 수 있어서, refresh 쿠키로 조용히 재발급을 먼저 시도한다 —
        // 카카오 재로그인은 그것마저 실패했을 때만 요구되는 마지막 수단이어야 한다.
        // (이 시점엔 아직 우리 서버가 pg_token을 카카오페이에 제출하지 않은 상태라 인증에서
        // 막힌 거라, 새 토큰으로 같은 paymentId/pg_token을 다시 보내면 정상 승인된다.)
        if (err instanceof ApiError && err.statusCode === 401) {
          try {
            const refreshed = await refreshToken();
            // 여기선 setSession()을 쓰지 않는다 — 그건 계정 전환용으로 매칭 draft
            // store를 통째로 reset()하는 부작용이 있다. 지금은 같은 사용자의 토큰만
            // 갈아끼우는 거라 accessToken만 조용히 갱신한다(영속화도 그대로 된다).
            useAuthStore.setState({ accessToken: refreshed.accessToken, hasProfile: refreshed.hasProfile });
            const data = await approvePayment({ paymentId, pgToken });
            handleSuccess(data);
          } catch {
            setIsSessionExpired(true);
          }
          return;
        }
        setError(err instanceof ApiError ? err.message : "결제 승인에 실패했어요.");
      });
  }, [paymentId, pgToken, setPaidMatchAttemptId]);

  const handleReLogin = () => {
    if (!paymentId || !pgToken) return;
    const query = new URLSearchParams({ paymentId, pg_token: pgToken });
    setPostLoginRedirect(`/payments/success?${query.toString()}`);
    window.location.href = getKakaoLoginUrl();
  };

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

  if (isSessionExpired) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-ink">
          로그인이 만료됐어요.
          <br />
          다시 로그인하면 결제가 자동으로 이어져요.
        </p>
        <Button variant="kakao" className="w-full" onClick={handleReLogin}>
          다시 로그인하기
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
