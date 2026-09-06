import { apiRequest } from "@/lib/api/client";

export type LoginResponse = {
  accessToken: string;
  hasProfile: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** 브라우저를 이 URL로 이동시키면 카카오 로그인 페이지로 리다이렉트된다. */
export function getKakaoLoginUrl() {
  return `${API_BASE_URL}/auth/kakao`;
}

/** [개발용] 카카오 계정이 없는 시드 계정(userId "1"~"8")으로 토큰 발급 */
export function devToken(userId: string) {
  return apiRequest<LoginResponse>("/auth/dev-token", {
    method: "POST",
    body: { userId },
    skipAuth: true,
  });
}

/** refresh 쿠키로 액세스 토큰 재발급 (카카오 로그인 콜백 직후 / 토큰 만료 시) */
export function refreshToken() {
  return apiRequest<LoginResponse>("/auth/refresh", {
    method: "POST",
    skipAuth: true,
  });
}

export function logout() {
  return apiRequest<{ success: boolean }>("/auth/logout", { method: "POST" });
}

/** 계정을 WITHDRAWN 상태로 바꾸는 soft delete. 지난 매칭·결제 기록은 남는다. */
export function withdrawUser() {
  return apiRequest<{ success: boolean }>("/users/me", { method: "DELETE" });
}
