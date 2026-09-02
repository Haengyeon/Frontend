"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

type PhotoUploadBoxProps = {
  label: string;
  icon: LucideIcon;
};

export default function PhotoUploadBox({ label, icon: Icon }: PhotoUploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <label className="flex aspect-square flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-cream-card focus-within:ring-2 focus-within:ring-forest focus-within:ring-offset-2 focus-within:ring-offset-cream">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={label} className="h-full w-full rounded-2xl object-cover" />
      ) : (
        <>
          <Icon size={28} strokeWidth={1.5} className="text-muted" />
          <span className="text-xs text-muted">{label}</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
    </label>
  );
}
