"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import DemoDataNotice from "@/components/ui/DemoDataNotice";

const emptySubscribe = () => () => {};
/** 서버(및 클라이언트 첫 렌더)에서는 false, 마운트된 클라이언트에서는 true. */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// (main) 아래 모든 화면은 로그인이 필요하다. 지금까지는 accessToken이 없어져도
// (예: 어딘가에서 401을 받아 apiRequest가 clearSession()을 부르는 경우) 화면을 강제로
// 옮겨주는 곳이 없어서, 로그인 화면으로 튕기지 않고 그 자리에 계속 남아 있었다 —
// accessToken이 필요한 모든 요청(useMyMatching, useRecommendedSpots 등)이 조용히
// enabled: false로 꺼지면서 "매칭 안 함" 같은 기본값만 보이는, 고장난 것처럼 보이는
// 화면이 됐다. 여기서 accessToken이 사라지는 순간을 감지해 스플래시로 돌려보낸다.
//
// zustand persist는 SSR과의 hydration mismatch를 피하려고 서버·첫 렌더에서는 항상 초기값
// (accessToken: null)을 쓰고, 마운트 후에 localStorage 값으로 다시 렌더한다. 마운트 여부를
// 보지 않고 accessToken만으로 판단하면 실제로는 로그인돼 있는 사람도 새로고침할 때마다
// 스플래시로 잠깐 튕겨나가므로, 클라이언트에 마운트된 뒤에만 판단한다.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !accessToken) router.replace("/splash");
  }, [mounted, accessToken, router]);

  if (!mounted || !accessToken) return null;

  return (
    <>
      {children}
      <DemoDataNotice />
    </>
  );
}
