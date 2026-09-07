import type { PaymentReadyResponse } from "@/features/payment/api/types";

/** 이 앱은 항상 모바일 폭 레이아웃으로 렌더링되지만(반응형 X), User-Agent로 실제 모바일 기기인지 구분해
 * 카카오페이 결제창에 알맞은 URL을 고른다 (PC 브라우저에서 모바일 결제창을 띄우면 깨질 수 있음). */
export function pickKakaoPayRedirectUrl(response: PaymentReadyResponse): string {
  if (typeof navigator === "undefined") return response.nextRedirectPcUrl;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isMobile ? response.nextRedirectMobileUrl : response.nextRedirectPcUrl;
}
