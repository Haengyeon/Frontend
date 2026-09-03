const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, message: string, error: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.error = error;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** 로그인/토큰 발급처럼 아직 액세스 토큰이 없는 요청에 사용 */
  skipAuth?: boolean;
};

type ApiClientConfig = {
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
};

let config: ApiClientConfig = {
  getAccessToken: () => null,
  onUnauthorized: () => {},
};

/** authStore가 초기화될 때 자기 자신의 토큰 접근자를 등록한다 (순환 import 방지). */
export function configureApiClient(next: ApiClientConfig) {
  config = next;
}

async function parseErrorBody(res: Response) {
  try {
    const data = (await res.json()) as { message?: string; error?: string };
    return { message: data.message ?? res.statusText, error: data.error ?? res.statusText };
  } catch {
    return { message: res.statusText, error: res.statusText };
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, skipAuth = false } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = skipAuth ? null : config.getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    // refresh 토큰이 httpOnly 쿠키로 오가기 때문에 필요
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuth) {
    config.onUnauthorized();
  }

  if (!res.ok) {
    const { message, error } = await parseErrorBody(res);
    throw new ApiError(res.status, message, error);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}
