import Image from "next/image";
import { User } from "lucide-react";

type AvatarProps = {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, alt, size = 48, className = "" }: AvatarProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-forest-light ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="object-cover"
          // 상대(더미 포함) 프로필 사진은 뉴스/위키 등 임의의 외부 호스트에서 온다 —
          // next.config.ts에 일일이 다 등록할 수 없어서(더미 100명이 전부 다른 도메인을
          // 씀) Next 이미지 최적화 자체를 건너뛴다. unoptimized면 remotePatterns
          // 검증도 같이 건너뛰어서 등록 안 된 호스트여도 깨지지 않는다.
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User size={size * 0.45} strokeWidth={1.5} className="text-forest/50" />
        </div>
      )}
    </div>
  );
}
