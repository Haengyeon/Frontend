"use client";

import Modal from "@/components/ui/Modal";
import SelectableList from "@/components/ui/SelectableList";
import { JOB_CATEGORIES } from "@/features/auth/mocks";

type JobCategoryModalProps = {
  open: boolean;
  selected: string;
  onSelect: (category: string) => void;
  onClose: () => void;
};

export default function JobCategoryModal({
  open,
  selected,
  onSelect,
  onClose,
}: JobCategoryModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <p className="mb-3 text-sm font-medium text-ink">직업군을 선택하세요</p>
      <SelectableList
        items={JOB_CATEGORIES}
        isSelected={(category) => category === selected}
        onSelect={(category) => {
          onSelect(category);
          onClose();
        }}
      />
    </Modal>
  );
}
