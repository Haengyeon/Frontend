"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { PAYMENT_HISTORY } from "@/features/mypage/mocks";
import type { PaymentRecord } from "@/features/mypage/types";

export default function PaymentHistoryList() {
  const [payments, setPayments] = useState<PaymentRecord[]>(PAYMENT_HISTORY);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const handleCancel = () => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.paymentId === cancelTargetId ? { ...payment, status: "환불완료" } : payment,
      ),
    );
    setCancelTargetId(null);
  };

  if (payments.length === 0) {
    return <p className="pt-8 text-center text-sm text-muted">결제 내역이 없어요.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {payments.map((payment) => (
        <div
          key={payment.paymentId}
          className="flex flex-col gap-1 rounded-2xl border border-line bg-cream-card p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{payment.courseTitle}</span>
            <span className="rounded-full bg-forest-light px-2.5 py-1 text-xs font-medium text-forest">
              {payment.status}
            </span>
          </div>
          <span className="text-xs text-muted">
            {payment.partnerName}님과의 매칭 · {payment.paidAt}
          </span>
          <span className="mt-1 text-base font-semibold text-ink">
            {payment.amount.toLocaleString()}원
          </span>

          {payment.status === "결제완료" ? (
            <button
              type="button"
              onClick={() => setCancelTargetId(payment.paymentId)}
              className="mt-2 self-start text-xs text-muted underline underline-offset-2"
            >
              결제 취소
            </button>
          ) : null}
        </div>
      ))}

      <Modal open={cancelTargetId !== null} onClose={() => setCancelTargetId(null)}>
        <p className="mb-2 text-sm font-semibold text-ink">결제를 취소할까요?</p>
        <p className="mb-4 text-sm text-muted">
          결제 취소 후에는 매칭 조건을 다시 수정해서 새로 매칭을 시작할 수 있어요.
        </p>
        <Button className="w-full" onClick={handleCancel}>
          결제 취소하기
        </Button>
      </Modal>
    </div>
  );
}
