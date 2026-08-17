"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type StepNavButtonsProps = {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
};

export default function StepNavButtons({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "다음",
  backLabel = "이전",
}: StepNavButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <Button variant="secondary" className="flex-1" onClick={onBack ?? (() => router.back())}>
        {backLabel}
      </Button>
      <Button className="flex-[2]" disabled={nextDisabled} onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
