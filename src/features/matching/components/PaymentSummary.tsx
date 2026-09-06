"use client";

import { useState } from "react";
import { CalendarDays, Clover } from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Countdown from "@/components/ui/Countdown";
import InfoRow from "@/features/matching/components/InfoRow";
import { formatDateLabel, getThemeLabels } from "@/features/matching/mocks";
import { useMatchAttempt, useMyMatching } from "@/features/matching/api/useMatchingApi";
import { jobCategoryToLocal, themeToLocalId } from "@/features/matching/api/enumMap";
import { useReadyPayment } from "@/features/payment/api/usePaymentApi";
import { pickKakaoPayRedirectUrl } from "@/features/payment/lib/redirect";
import { ApiError } from "@/lib/api/client";

export default function PaymentSummary() {
  // 카카오페이 결제창은 window.location.href로 페이지를 완전히 떠났다가 리다이렉트로 돌아오므로,
  // 로컬(zustand) 상태에 의존하면 그 시점에 값이 비어있을 수 있다 — 항상 서버에서 다시 조회한다.
  const { data: myMatching } = useMyMatching();
  const matchAttemptId = myMatching?.currentAttempt?.id ?? null;
  const paymentDeadlineAt = myMatching?.currentAttempt?.paymentDeadlineAt
    ? new Date(myMatching.currentAttempt.paymentDeadlineAt).getTime()
    : null;
  const { data } = useMatchAttempt(matchAttemptId);
  const partner = data?.partner;
  const isPaymentExpired = paymentDeadlineAt !== null && Date.now() > paymentDeadlineAt;
  const readyPayment = useReadyPayment();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = () => {
    if (isPaymentExpired || !matchAttemptId) return;
    setErrorMessage(null);
    readyPayment.mutate(matchAttemptId, {
      onSuccess: (response) => {
        window.location.href = pickKakaoPayRedirectUrl(response);
      },
      onError: (error) => {
        setErrorMessage(error instanceof ApiError ? error.message : "결제 준비에 실패했어요.");
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        {partner ? (
          <>
            <Avatar src={partner.fullBodyImageUrl} alt={partner.name} size={48} />
            <div>
              <p className="text-sm font-semibold text-ink">{partner.name}</p>
              <p className="text-xs text-muted">
                {partner.age}세{partner.jobCategory ? ` · ${jobCategoryToLocal(partner.jobCategory)}` : ""}
              </p>
            </div>
          </>
        ) : (
          <div className="h-12 w-12 animate-pulse rounded-full bg-forest/10" />
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
        <InfoRow
          icon={CalendarDays}
          label="여행 날짜"
          value={data?.travelDate ? formatDateLabel(data.travelDate) : "미정"}
        />
        <InfoRow
          icon={Clover}
          label="결정된 테마"
          value={data ? getThemeLabels([themeToLocalId(data.theme)]) : "불러오는 중..."}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-ink">결제 금액 (부가세 포함)</span>
          <span className="text-forest">
            {data ? `${data.paymentAmount.toLocaleString()}원` : "불러오는 중..."}
          </span>
        </div>
      </div>

      {errorMessage ? <p className="text-center text-sm text-red-500">{errorMessage}</p> : null}

      <div className="mt-auto flex flex-col items-center gap-2">
        {paymentDeadlineAt ? (
          <p className="text-xs text-muted">
            <Countdown deadlineAt={paymentDeadlineAt} /> 이내에 결제하지 않으면 매칭이 자동으로
            취소돼요.
          </p>
        ) : null}
        <Button
          variant="kakao"
          className="w-full"
          disabled={isPaymentExpired || readyPayment.isPending || !matchAttemptId}
          onClick={handlePay}
        >
          {isPaymentExpired
            ? "결제 시간이 만료됐어요"
            : readyPayment.isPending
              ? "결제창 준비 중..."
              : "카카오페이로 결제하기"}
        </Button>
      </div>
    </div>
  );
}
