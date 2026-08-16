"use client";

import { useState } from "react";
import type { MbtiSelection } from "@/features/auth/types";

type Axis = keyof MbtiSelection;

const AXES: { axis: Axis; options: [string, string] }[] = [
  { axis: "EI", options: ["E", "I"] },
  { axis: "SN", options: ["S", "N"] },
  { axis: "TF", options: ["T", "F"] },
  { axis: "JP", options: ["J", "P"] },
];

const LABELS: Record<string, string> = {
  E: "외향형",
  I: "내향형",
  S: "감각형",
  N: "직관형",
  T: "사고형",
  F: "감정형",
  J: "판단형",
  P: "인식형",
};

export default function MbtiSelector() {
  const [selection, setSelection] = useState<Partial<MbtiSelection>>({});

  const select = (axis: Axis, value: string) =>
    setSelection((prev) => ({ ...prev, [axis]: value }) as Partial<MbtiSelection>);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">MBTI</span>
        <p className="text-xs text-muted">MBTI를 입력해주세요</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[0, 1].map((rowIndex) =>
          AXES.map(({ axis, options }) => {
            const value = options[rowIndex];
            const selected = selection[axis] === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => select(axis, value)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border py-3 ${
                  selected ? "border-forest bg-forest-light" : "border-line"
                }`}
              >
                <span className={`text-sm font-semibold ${selected ? "text-forest" : "text-ink"}`}>
                  {value}
                </span>
                <span className="text-[11px] text-muted">{LABELS[value]}</span>
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
