import type { LucideIcon } from "lucide-react";

type SectionLabelProps = {
  icon: LucideIcon;
  children: string;
};

export default function SectionLabel({ icon: Icon, children }: SectionLabelProps) {
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
      <Icon size={16} strokeWidth={1.5} className="text-forest" />
      {children}
    </span>
  );
}
