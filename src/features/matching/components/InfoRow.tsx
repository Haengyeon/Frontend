import type { LucideIcon } from "lucide-react";

type InfoRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export default function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-forest" />
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-sm font-medium text-ink">{value}</span>
      </div>
    </div>
  );
}
