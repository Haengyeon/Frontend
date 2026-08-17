type SelectableListProps = {
  items: string[];
  isSelected: (item: string) => boolean;
  onSelect: (item: string) => void;
};

export default function SelectableList({ items, isSelected, onSelect }: SelectableListProps) {
  return (
    <ul className="max-h-80 overflow-y-auto">
      {items.map((item) => {
        const selected = isSelected(item);
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className={`flex w-full items-center justify-between border-b border-line py-3 text-left text-sm ${
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
