"use client";

import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  className?: string;
  /** 접었을 때 보여줄 줄 수. 화면이 좁으면(예: 지도 위 바텀시트) 2로 더 짧게 줄인다. */
  lines?: 2 | 3;
};

// 짧은 설명까지 "더보기"가 뜨면 어색해서, 지정한 줄 수(대략 한 줄 28자 기준)를 넘을
// 만한 길이일 때만 접어서 보여준다 — 화면 자체가 길게 스크롤되는 대신 이 안에서만 펼쳐진다.
const CLAMP_CLASS: Record<2 | 3, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
};

export default function ExpandableText({ text, className, lines = 3 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > 28 * lines;

  return (
    <div className="flex flex-col items-start gap-1">
      <p className={`${className ?? ""} ${!isExpanded && isLong ? CLAMP_CLASS[lines] : ""}`}>{text}</p>
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
