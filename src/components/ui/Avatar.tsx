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
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User size={size * 0.45} strokeWidth={1.5} className="text-forest/50" />
        </div>
      )}
    </div>
  );
}
