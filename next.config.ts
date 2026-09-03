import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 백엔드 시드 데이터(개발용 더미 유저)의 프로필 사진이 이 호스트를 사용한다.
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
