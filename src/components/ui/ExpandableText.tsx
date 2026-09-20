"use client";

import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  className?: string;
};

// 짧은 설명까지 "더보기"가 뜨면 어색해서, 3줄(대략 한 줄 28자 기준)을 넘을 만한
// 길이일 때만 접어서 보여준다 — 화면 자체가 길게 스크롤되는 대신 이 안에서만 펼쳐진다.
const CLAMP_THRESHOLD = 28 * 3;

export default function ExpandableText({ text, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > CLAMP_THRESHOLD;

  return (
    <div className="flex flex-col items-start gap-1">
      <p className={`${className ?? ""} ${!isExpanded && isLong ? "line-clamp-3" : ""}`}>{text}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-xs font-medium text-forest"
        >
          {isExpanded ? "접기" : "더보기"}
        </button>
      ) : null}
    </div>
  );
}
