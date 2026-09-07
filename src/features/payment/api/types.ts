// public/img/API명세_결제채팅.md + 실서버(/api-json) 기준.
export type PaymentStatus = "READY" | "APPROVED" | "CANCELLED" | "FAILED" | "REFUNDED";

export type ReadyPaymentRequest = {
  matchAttemptId: string;
};

export type PaymentReadyResponse = {
  paymentId: string;
  tid: string;
  nextRedirectPcUrl: string;
  nextRedirectMobileUrl: string;
  nextRedirectAppUrl: string;
};

export type ApprovePaymentRequest = {
  paymentId: string;
  pgToken: string;
};

export type PaymentApproveResponse = {
  paymentId: string;
  status: PaymentStatus;
  matchAttemptId: string;
  matchConfirmed: boolean;
};

export type PaymentCancelResponse = {
  paymentId: string;
  status: PaymentStatus;
};
