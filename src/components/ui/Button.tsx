import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-emerald-700 text-white"
      : "bg-transparent text-emerald-700 border border-emerald-700";

  return (
    <button
      className={`h-12 rounded-full px-5 text-sm font-medium ${variantClass} ${className}`}
      {...props}
    />
  );
}
