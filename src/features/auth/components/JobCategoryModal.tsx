"use client";

import Modal from "@/components/ui/Modal";
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
      <ul className="max-h-80 overflow-y-auto">
        {JOB_CATEGORIES.map((category) => (
          <li key={category}>
            <button
              type="button"
              onClick={() => {
                onSelect(category);
                onClose();
              }}
              className={`flex w-full items-center justify-between border-b border-line py-3 text-left text-sm ${
                category === selected ? "font-medium text-forest" : "text-ink"
              }`}
            >
              {category}
              {category === selected ? <span>✓</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
