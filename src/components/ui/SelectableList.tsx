type SelectableListProps = {
  items: string[];
  isSelected: (item: string) => boolean;
  onSelect: (item: string) => void;
  isDisabled?: (item: string) => boolean;
};

export default function SelectableList({
  items,
  isSelected,
  onSelect,
  isDisabled,
}: SelectableListProps) {
  return (
    <ul className="max-h-80 overflow-y-auto">
      {items.map((item) => {
        const selected = isSelected(item);
        const disabled = isDisabled?.(item) ?? false;
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              disabled={disabled}
              aria-pressed={selected}
              className={`flex w-full items-center justify-between border-b border-line py-3 text-left text-sm disabled:opacity-40 ${
                selected ? "font-medium text-forest" : "text-ink"
              }`}
            >
              {item}
              {selected ? <span>✓</span> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
