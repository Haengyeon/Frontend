"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import SelectableList from "@/components/ui/SelectableList";
import RemovableTag from "@/components/ui/RemovableTag";
import { REGIONS } from "@/features/matching/mocks";

type RegionSelectModalProps = {
  open: boolean;
  selected: string[];
  onToggle: (region: string) => void;
  onClose: () => void;
};

export default function RegionSelectModal({
  open,
  selected,
  onToggle,
  onClose,
}: RegionSelectModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <p className="mb-3 text-sm font-medium text-ink">여행 지역을 선택하세요</p>

      {selected.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1.5 border-b border-line pb-3">
          {selected.map((region) => (
            <RemovableTag
              key={region}
              label={region}
              onRemove={() => onToggle(region)}
              size="sm"
            />
          ))}
        </div>
      ) : null}

      <SelectableList items={REGIONS} isSelected={(region) => selected.includes(region)} onSelect={onToggle} />

      <Button className="mt-4 w-full" onClick={onClose}>
        완료
      </Button>
    </Modal>
  );
}
