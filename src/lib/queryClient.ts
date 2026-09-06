import { QueryClient } from "@tanstack/react-query";

// authStore가 세션 전환 시 이 인스턴스를 직접 clear()해서 이전 계정의 캐시가
// 새로 로그인한 계정 화면에 잠깐이라도 보이지 않게 한다.
export const queryClient = new QueryClient();
