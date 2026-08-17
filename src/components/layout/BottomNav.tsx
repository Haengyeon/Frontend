"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageCircle, User } from "lucide-react";

const TABS = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/course", label: "코스", icon: Map },
  { href: "/chat", label: "채팅", icon: MessageCircle },
  { href: "/mypage", label: "마이페이지", icon: User },
] as const;

function isTabActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  // 매칭 플로우는 별도 탭이 없고 홈에서 진입하므로 홈 탭을 활성 상태로 표시한다.
  if (href === "/home" && (pathname === "/matching" || pathname.startsWith("/matching/"))) {
    return true;
  }
  return false;
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 flex h-16 w-full max-w-md -translate-x-1/2 border-t border-line bg-cream-card/60 backdrop-blur-md">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = isTabActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex flex-1 flex-col items-center justify-center ${
              active ? "text-forest" : "text-muted"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
          </Link>
        );
      })}
    </nav>
  );
}
