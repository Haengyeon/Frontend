import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // placehold.co가 더미 프로필 사진을 svg로 내려줄 때가 있어서 허용해야 한다.
    // 백엔드가 넘겨주는 시드/공공 이미지 URL만 쓰므로 위험한 사용자 입력이 아니다.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        // 백엔드 시드 데이터(개발용 더미 유저)의 프로필 사진이 이 호스트를 사용한다.
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // 매칭 상대 더미 프로필 사진
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        // 한국관광공사 코스/장소 이미지. 백엔드가 http/https를 섞어서 준다.
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
      },
      {
        protocol: "https",
        hostname: "tong.visitkorea.or.kr",
      },
      {
        // 인증샷을 GCS에 저장하고 서명 URL로 내려준다(백엔드 d19b652, 2026-09).
        // /uploads 정적 서빙은 완전히 없어졌다 — 로컬·배포 환경 모두 이 호스트로 온다.
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
