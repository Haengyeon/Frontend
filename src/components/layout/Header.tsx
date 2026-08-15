"use client";

import { useRouter } from "next/navigation";

type HeaderProps = {
  title?: string;
};

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-zinc-200 px-4">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로가기"
        className="text-zinc-500"
      >
        ←
      </button>
      {title ? <h1 className="text-base font-medium">{title}</h1> : null}
    </header>
  );
}
