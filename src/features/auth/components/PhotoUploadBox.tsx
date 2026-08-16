"use client";

import { useState } from "react";

type PhotoUploadBoxProps = {
  label: string;
  icon: string;
};

export default function PhotoUploadBox({ label, icon }: PhotoUploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <label className="flex aspect-square flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-cream-card">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={label} className="h-full w-full rounded-2xl object-cover" />
      ) : (
        <>
          <span className="text-2xl text-muted">{icon}</span>
          <span className="text-xs text-muted">{label}</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
    </label>
  );
}
