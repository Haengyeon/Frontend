"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import ImageCropSheet from "@/components/ui/ImageCropSheet";

type PhotoUploadBoxProps = {
  label: string;
  icon: LucideIcon;
  onFileSelect: (file: File) => void;
  /** 마이페이지 수정처럼 서버에 이미 저장된 사진이 있을 때 초기 미리보기로 쓴다 */
  initialPreviewUrl?: string | null;
  /** 가로/세로 비율. 1이면 정사각형(얼굴사진), 1보다 작으면 세로로 긴 사진(전신샷) */
  aspectRatio?: number;
};

export default function PhotoUploadBox({
  label,
  icon: Icon,
  onFileSelect,
  initialPreviewUrl,
  aspectRatio = 1,
}: PhotoUploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(initialPreviewUrl ?? null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const guideLabel = aspectRatio === 1 ? "정사각형 사진" : "세로로 긴 사진";

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleCropConfirm = (croppedFile: File) => {
    setPendingFile(null);
    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(croppedFile);
    });
    onFileSelect(croppedFile);
  };

  return (
    <>
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
            e.currentTarget.value = "";
            if (file) setPendingFile(file);
          }}
        />
      </label>

      {pendingFile ? (
        <ImageCropSheet
          file={pendingFile}
          aspectRatio={aspectRatio}
          guideLabel={guideLabel}
          onConfirm={handleCropConfirm}
          onCancel={() => setPendingFile(null)}
        />
      ) : null}
    </>
  );
}
