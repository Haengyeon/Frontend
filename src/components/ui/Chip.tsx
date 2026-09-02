type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Chip({ label, selected = false, disabled = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 text-sm disabled:opacity-40 ${
        selected
          ? "border-forest bg-forest-light text-forest"
          : "border-line text-muted"
      }`}
    >
      {label}
    </button>
  );
}
