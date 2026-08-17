import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-forest-light px-2.5 py-1 text-xs text-forest">
      {children}
    </span>
  );
}
