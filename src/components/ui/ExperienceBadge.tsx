import { Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";

type ExperienceBadgeProps = {
  className?: string;
};

/** 체험(더미) 매칭임을 알리는 배지. 실제 매칭 화면에는 절대 렌더링하면 안 된다 —
 * isExperience가 true일 때만 이 컴포넌트를 렌더링해서 실제/체험을 명확히 분리한다. */
export default function ExperienceBadge({ className }: ExperienceBadgeProps) {
  return (
    <Badge className={`inline-flex items-center gap-1 bg-amber-100 text-amber-700 ${className ?? ""}`}>
      <Sparkles size={12} strokeWidth={2} />
      체험 매칭 · 가상 프로필
    </Badge>
  );
}
