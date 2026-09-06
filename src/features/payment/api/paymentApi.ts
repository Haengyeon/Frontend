import { apiRequest } from "@/lib/api/client";
import type {
  ReadyPaymentRequest,
  PaymentReadyResponse,
  ApprovePaymentRequest,
  PaymentApproveResponse,
  PaymentCancelResponse,
} from "./types";

export function readyPayment(payload: ReadyPaymentRequest) {
  return apiRequest<PaymentReadyResponse>("/payments/ready", { method: "POST", body: payload });
}

export function approvePayment(payload: ApprovePaymentRequest) {
  return apiRequest<PaymentApproveResponse>("/payments/approve", { method: "POST", body: payload });
}

export function cancelPayment(paymentId: string) {
  return apiRequest<PaymentCancelResponse>(`/payments/${paymentId}/cancel`, { method: "POST" });
}
