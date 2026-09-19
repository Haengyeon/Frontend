const STORAGE_KEY = "haengyeon-post-login-redirect";

/**
 * 카카오 로그인으로 다시 보내기 전에, 로그인 후 돌아올 경로를 저장해둔다.
 * 세션이 로그인 화면을 거치는 동안(카카오 인증 페이지 등) 살아남아야 하므로
 * zustand 상태가 아니라 localStorage에 직접 남긴다.
 */
export function setPostLoginRedirect(path: string) {
  try {
    localStorage.setItem(STORAGE_KEY, path);
  } catch {
    // 저장 실패해도 로그인 자체는 막지 않는다 — 로그인 후 기본 경로(홈)로 가면 그만이다.
  }
}

/** 저장된 경로를 한 번만 읽고 지운다 — 다음 로그인엔 영향을 주면 안 된다. */
export function consumePostLoginRedirect(): string | null {
  try {
    const path = localStorage.getItem(STORAGE_KEY);
    if (path) localStorage.removeItem(STORAGE_KEY);
    return path;
  } catch {
    return null;
  }
}
