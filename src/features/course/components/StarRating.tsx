"use client";

import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

const SCORES = [1, 2, 3, 4, 5];

export default function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="별점">
      {SCORES.map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          role="radio"
          aria-label={`${score}점`}
          aria-checked={value === score}
        >
          <Star
            size={28}
            strokeWidth={1.5}
            className={value >= score ? "text-forest" : "text-line"}
            fill={value >= score ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
