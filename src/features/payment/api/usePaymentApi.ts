"use client";

import { useMutation } from "@tanstack/react-query";
import { readyPayment, cancelPayment } from "./paymentApi";

export function useReadyPayment() {
  return useMutation({
    mutationFn: (matchAttemptId: string) => readyPayment({ matchAttemptId }),
  });
}

// 승인(approve)은 /payments/success 페이지에서 useEffect 안에 직접 호출한다 — useMutation을
// 쓰면 매 렌더 바뀌는 mutate 객체가 effect 의존성에 끼어들어 중복 호출될 위험이 있다.

export function useCancelPayment() {
  return useMutation({
    mutationFn: (paymentId: string) => cancelPayment(paymentId),
  });
}
