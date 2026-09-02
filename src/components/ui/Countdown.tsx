"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  deadlineAt: number;
  className?: string;
};

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function Countdown({ deadlineAt, className = "" }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{formatRemaining(deadlineAt - now)}</span>;
}
