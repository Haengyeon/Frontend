import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
};

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <Image
      src="/hengyeon_logo_symmetric2.png"
      alt="행연"
      width={size}
      height={size}
      priority
      // Tailwind preflight가 img에 height:auto를 걸어서 next/image의 width/height 속성과
      // 어긋난다는 경고가 뜬다 — 인라인 style로 둘 다 고정해서 실제 크기를 강제한다.
      style={{ width: size, height: size }}
      className={`mx-auto object-contain ${className}`}
    />
  );
}
