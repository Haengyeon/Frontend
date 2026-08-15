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
          ? "border-emerald-700 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 text-zinc-600"
      }`}
    >
      {label}
    </button>
  );
}
