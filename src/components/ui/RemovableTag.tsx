import { X } from "lucide-react";

type RemovableTagProps = {
  label: string;
  onRemove: () => void;
  size?: "sm" | "md";
};

const SIZE_CLASS: Record<NonNullable<RemovableTagProps["size"]>, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export default function RemovableTag({ label, onRemove, size = "md" }: RemovableTagProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className={`flex items-center gap-1 rounded-full border border-forest bg-forest-light text-forest ${SIZE_CLASS[size]}`}
    >
      {label}
      <X size={size === "sm" ? 12 : 14} strokeWidth={2} />
    </button>
  );
}
