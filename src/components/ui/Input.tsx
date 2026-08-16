import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <input
        className={`h-12 rounded-xl border border-line bg-cream-card px-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}
