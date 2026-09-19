/// <reference types="kakao.maps.d.ts" />

export const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? "";

let sdkPromise: Promise<void> | null = null;

// 지도 뷰를 처음 열 때 SDK를 한 번만 넣는다. autoload=false라 kakao.maps.load 콜백 뒤에야 쓸 수 있다.
export function loadKakaoMaps(): Promise<void> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => kakao.maps.load(resolve);
    script.onerror = () => {
      // 실패한 스크립트를 치워둬야 다음에 지도 뷰를 열 때 다시 시도한다.
      script.remove();
      sdkPromise = null;
      reject(new Error("카카오 지도 SDK를 불러오지 못했어요"));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}
