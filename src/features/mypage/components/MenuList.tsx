import Link from "next/link";
import { User, Receipt, MessageCircleWarning, Megaphone, Settings, ChevronRight } from "lucide-react";

const MENU_ITEMS = [
  { href: "/mypage/profile", label: "프로필 수정", icon: User },
  { href: "/mypage/payments", label: "결제 내역", icon: Receipt },
  { href: "/mypage/reports", label: "신고 및 문의", icon: MessageCircleWarning },
  { href: "/mypage/notices", label: "공지사항", icon: Megaphone },
  { href: "/mypage/settings", label: "환경설정", icon: Settings },
] as const;

export default function MenuList() {
  return (
    <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
      {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3.5">
          <Icon size={18} strokeWidth={1.5} className="text-forest" />
          <span className="flex-1 text-sm text-ink">{label}</span>
          <ChevronRight size={16} strokeWidth={1.5} className="text-muted" />
        </Link>
      ))}
    </div>
  );
}
