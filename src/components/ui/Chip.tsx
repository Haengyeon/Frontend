type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm ${
        selected
          ? "border-forest bg-forest-light text-forest"
          : "border-line text-muted"
      }`}
    >
      {label}
    </button>
  );
}
