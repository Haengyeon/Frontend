"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

type ImageCropSheetProps = {
  file: File;
  /** 가로/세로 비율. 1이면 정사각형, 1보다 작으면 세로로 긴 사진 */
  aspectRatio: number;
  guideLabel: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
};

const FRAME_WIDTH = 260;
const OUTPUT_LONG_SIDE = 900;

type Offset = { x: number; y: number };

export default function ImageCropSheet({
  file,
  aspectRatio,
  guideLabel,
  onConfirm,
  onCancel,
}: ImageCropSheetProps) {
  const frameHeight = FRAME_WIDTH / aspectRatio;
  const imgRef = useRef<HTMLImageElement>(null);
  // 이 컴포넌트는 file 하나당 한 번씩만 마운트된다(부모가 null↔file로 조건부 렌더) —
  // props가 바뀌는 동안 다시 만들 필요가 없어 최초 렌더에서 한 번만 만든다.
  const [imageUrl] = useState(() => URL.createObjectURL(file));
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; startOffset: Offset } | null>(null);

  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  // 프레임을 항상 꽉 채우는 최소 배율(cover) 위에 사용자가 고른 배율(zoom)을 곱한다.
  const baseScale = naturalSize ? Math.max(FRAME_WIDTH / naturalSize.w, frameHeight / naturalSize.h) : 1;
  const displayScale = baseScale * zoom;

  // 어떤 배율에서든 프레임 안에 빈 공간이 보이지 않게, 그 배율 기준으로 위치를 되짚어 가둔다.
  const clampAt = (raw: Offset, scale: number): Offset => {
    if (!naturalSize) return raw;
    const w = naturalSize.w * scale;
    const h = naturalSize.h * scale;
    const minX = Math.min(0, FRAME_WIDTH - w);
    const minY = Math.min(0, frameHeight - h);
    return { x: Math.min(0, Math.max(minX, raw.x)), y: Math.min(0, Math.max(minY, raw.y)) };
  };

  const clampedOffset = clampAt(offset, displayScale);
  const displayW = naturalSize ? naturalSize.w * displayScale : 0;
  const displayH = naturalSize ? naturalSize.h * displayScale : 0;

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffset: clampedOffset };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(
      clampAt(
        { x: dragRef.current.startOffset.x + dx, y: dragRef.current.startOffset.y + dy },
        displayScale,
      ),
    );
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleZoomChange = (nextZoom: number) => {
    setZoom(nextZoom);
    setOffset((prev) => clampAt(prev, baseScale * nextZoom));
  };

  const handleConfirm = () => {
    if (!naturalSize || !imgRef.current) return;
    const outW = aspectRatio >= 1 ? OUTPUT_LONG_SIDE : Math.round(OUTPUT_LONG_SIDE * aspectRatio);
    const outH = aspectRatio >= 1 ? Math.round(OUTPUT_LONG_SIDE / aspectRatio) : OUTPUT_LONG_SIDE;
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 화면에 보이는 프레임 영역을 원본 이미지 좌표로 되짚어서 그 부분만 그린다.
    const sx = -clampedOffset.x / displayScale;
    const sy = -clampedOffset.y / displayScale;
    const sw = FRAME_WIDTH / displayScale;
    const sh = frameHeight / displayScale;
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, outW, outH);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onConfirm(new File([blob], file.name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 px-6">
      <p className="text-sm text-white">{guideLabel} 가이드에 맞춰 위치와 크기를 조정해주세요</p>

      <div
        className="relative touch-none overflow-hidden rounded-2xl bg-black"
        style={{ width: FRAME_WIDTH, height: frameHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="크롭 대상"
          draggable={false}
          onLoad={(e) =>
            setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
          }
          className="absolute select-none"
          style={{
            width: displayW || undefined,
            height: displayH || undefined,
            left: clampedOffset.x,
            top: clampedOffset.y,
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-white/80" />
      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => handleZoomChange(Number(e.target.value))}
        style={{ width: FRAME_WIDTH }}
        aria-label="확대/축소"
      />

      <div className="flex w-full gap-3" style={{ maxWidth: FRAME_WIDTH }}>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-white/40 py-2.5 text-sm text-white"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!naturalSize}
          className="flex-1 rounded-full bg-forest py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          완료
        </button>
      </div>
    </div>
  );
}
