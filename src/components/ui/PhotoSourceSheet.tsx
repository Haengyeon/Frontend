"use client";

import { useRef, type ChangeEvent } from "react";
import { Camera, Images } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";

type PhotoSourceSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (file: File) => void;
};

/** 휴대폰에서 "카메라로 촬영" / "앨범에서 선택" 중 고르게 하는 바텀시트.
 * capture 속성이 있는 input과 없는 input을 따로 둬서, 브라우저가 카메라와
 * 사진 라이브러리 중 하나를 바로 열게 한다. */
export default function PhotoSourceSheet({ open, onClose, onSelect }: PhotoSourceSheetProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    onClose();
    if (file) onSelect(file);
  };

  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="photo-source-heading">
      <h2 id="photo-source-heading" className="mb-4 text-center text-base font-semibold text-ink">
        사진을 어떻게 첨부할까요?
      </h2>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 text-sm font-medium text-ink hover:bg-cream-card"
        >
          <Camera size={20} strokeWidth={1.5} className="text-forest" />
          카메라로 촬영
        </button>
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 text-sm font-medium text-ink hover:bg-cream-card"
        >
          <Images size={20} strokeWidth={1.5} className="text-forest" />
          앨범에서 선택
        </button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
    </BottomSheet>
  );
}
