"use client";

import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent, type WheelEvent } from "react";
import type { LucideIcon } from "lucide-react";

type PhotoUploadBoxProps = {
  label: string;
  icon: LucideIcon;
  onFileSelect: (file: File) => void;
  /** 마이페이지 수정처럼 서버에 이미 저장된 사진이 있을 때 초기 미리보기로 쓴다 */
  initialPreviewUrl?: string | null;
  /** 가로/세로 비율. 1이면 정사각형(얼굴사진), 1보다 작으면 세로로 긴 사진(전신샷) */
  aspectRatio?: number;
};

type Offset = { x: number; y: number };
type Size = { w: number; h: number };

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const OUTPUT_LONG_SIDE = 900;
const WHEEL_ZOOM_STEP = 0.08;
const WHEEL_COMMIT_DELAY_MS = 400;

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function PhotoUploadBox({
  label,
  icon: Icon,
  onFileSelect,
  initialPreviewUrl,
  aspectRatio = 1,
}: PhotoUploadBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialPreviewUrl ?? null);
  const [boxSize, setBoxSize] = useState<Size>({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState<Size | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  // 새로 고른 파일에만 손가락/휠로 위치·크기를 조정할 수 있다 — 마이페이지에서 아직
  // 안 바꾼 기존 사진(원격 URL)은 캔버스로 다시 그리면 CORS 때문에 잘릴 수 있어서
  // 그대로만 보여주고, 실제로 새로 고른 사진(blob)일 때만 편집 가능하게 한다.
  const isEditable = Boolean(file) && imageUrl?.startsWith("blob:");

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStart = useRef<{ x: number; y: number; offset: Offset } | null>(null);
  const pinchStart = useRef<{ distance: number; zoom: number; local: { x: number; y: number }; offset: Offset } | null>(
    null,
  );
  const wheelCommitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedForFile = useRef<File | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      if (wheelCommitTimer.current) clearTimeout(wheelCommitTimer.current);
    };
  }, []);

  // 박스가 flex-1이라 실제 픽셀 크기를 CSS만으로 알 수 없어서 관찰해서 읽는다.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setBoxSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseScale =
    naturalSize && boxSize.w > 0 ? Math.max(boxSize.w / naturalSize.w, boxSize.h / naturalSize.h) : 1;
  const displayScale = baseScale * zoom;
  const displayW = naturalSize ? naturalSize.w * displayScale : 0;
  const displayH = naturalSize ? naturalSize.h * displayScale : 0;

  const clampAt = (raw: Offset, scale: number): Offset => {
    if (!naturalSize) return raw;
    const w = naturalSize.w * scale;
    const h = naturalSize.h * scale;
    const minX = Math.min(0, boxSize.w - w);
    const minY = Math.min(0, boxSize.h - h);
    return { x: Math.min(0, Math.max(minX, raw.x)), y: Math.min(0, Math.max(minY, raw.y)) };
  };

  const clampedOffset = clampAt(offset, displayScale);

  const commitCrop = (offsetToUse: Offset, scaleToUse: number) => {
    if (!naturalSize || !imgRef.current || !file || boxSize.w === 0) return;
    const outW = aspectRatio >= 1 ? OUTPUT_LONG_SIDE : Math.round(OUTPUT_LONG_SIDE * aspectRatio);
    const outH = aspectRatio >= 1 ? Math.round(OUTPUT_LONG_SIDE / aspectRatio) : OUTPUT_LONG_SIDE;
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = -offsetToUse.x / scaleToUse;
    const sy = -offsetToUse.y / scaleToUse;
    const sw = boxSize.w / scaleToUse;
    const sh = boxSize.h / scaleToUse;
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, outW, outH);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onFileSelect(new File([blob], file.name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  };

  // 사진을 처음 고르면 중앙 정렬된 기본 위치로 한 번 잘라서 바로 올려둔다 —
  // 손가락으로 아무것도 조정하지 않아도 가운데를 기준으로 채운 사진이 들어간다.
  useEffect(() => {
    if (!isEditable || !naturalSize || boxSize.w === 0) return;
    if (initializedForFile.current === file) return;
    initializedForFile.current = file;
    const centered = clampAt(
      { x: (boxSize.w - naturalSize.w * baseScale) / 2, y: (boxSize.h - naturalSize.h * baseScale) / 2 },
      baseScale,
    );
    setOffset(centered);
    commitCrop(centered, baseScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditable, naturalSize, boxSize.w, boxSize.h]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!nextFile) return;
    // 이전 사진에 걸려있던 휠 확대 디바운스가 새 사진에 잘못 적용되지 않게 취소한다.
    if (wheelCommitTimer.current) clearTimeout(wheelCommitTimer.current);
    setFile(nextFile);
    setNaturalSize(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setImageUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(nextFile);
    });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isEditable || !naturalSize) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, offset: clampedOffset };
      pinchStart.current = null;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const rect = containerRef.current?.getBoundingClientRect();
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      pinchStart.current = {
        distance: distance(a, b),
        zoom,
        local: rect ? { x: mid.x - rect.left, y: mid.y - rect.top } : mid,
        offset: clampedOffset,
      };
      dragStart.current = null;
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isEditable || !naturalSize || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const ratio = distance(a, b) / pinchStart.current.distance;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStart.current.zoom * ratio));
      const oldScale = baseScale * pinchStart.current.zoom;
      const newScale = baseScale * newZoom;
      // 두 손가락 사이 중심 아래 있던 사진 위치가 확대/축소 후에도 같은 자리에 남게 한다.
      const imagePoint = {
        x: (pinchStart.current.local.x - pinchStart.current.offset.x) / oldScale,
        y: (pinchStart.current.local.y - pinchStart.current.offset.y) / oldScale,
      };
      const nextOffset = clampAt(
        {
          x: pinchStart.current.local.x - imagePoint.x * newScale,
          y: pinchStart.current.local.y - imagePoint.y * newScale,
        },
        newScale,
      );
      setZoom(newZoom);
      setOffset(nextOffset);
    } else if (pointers.current.size === 1 && dragStart.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset(clampAt({ x: dragStart.current.offset.x + dx, y: dragStart.current.offset.y + dy }, displayScale));
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isEditable) return;
    pointers.current.delete(e.pointerId);

    if (pointers.current.size === 0) {
      dragStart.current = null;
      pinchStart.current = null;
      commitCrop(clampedOffset, displayScale);
    } else if (pointers.current.size === 1) {
      const [remaining] = [...pointers.current.values()];
      dragStart.current = { x: remaining.x, y: remaining.y, offset: clampedOffset };
      pinchStart.current = null;
    }
  };

  // 데스크톱에서는 손가락 대신 마우스 휠로 확대/축소한다(드래그는 포인터 이벤트로 이미 된다).
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!isEditable || !naturalSize) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const local = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const oldScale = displayScale;
    const imagePoint = { x: (local.x - clampedOffset.x) / oldScale, y: (local.y - clampedOffset.y) / oldScale };
    const newZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, zoom * (e.deltaY < 0 ? 1 + WHEEL_ZOOM_STEP : 1 - WHEEL_ZOOM_STEP)),
    );
    const newScale = baseScale * newZoom;
    const nextOffset = clampAt(
      { x: local.x - imagePoint.x * newScale, y: local.y - imagePoint.y * newScale },
      newScale,
    );
    setZoom(newZoom);
    setOffset(nextOffset);

    if (wheelCommitTimer.current) clearTimeout(wheelCommitTimer.current);
    wheelCommitTimer.current = setTimeout(() => commitCrop(nextOffset, newScale), WHEEL_COMMIT_DELAY_MS);
  };

  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <div
        ref={containerRef}
        className="relative w-full touch-none overflow-hidden rounded-2xl border border-dashed border-line bg-cream-card"
        style={{ aspectRatio }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {imageUrl ? (
          isEditable ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imageUrl}
              alt={label}
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
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
          )
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 focus-within:ring-2 focus-within:ring-forest focus-within:ring-offset-2 focus-within:ring-offset-cream">
            <Icon size={28} strokeWidth={1.5} className="text-muted" />
            <span className="text-xs text-muted">{label}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleInputChange} />
          </label>
        )}
      </div>

      {imageUrl ? (
        <label className="cursor-pointer self-center text-xs text-forest underline underline-offset-2">
          사진 바꾸기
          <input type="file" accept="image/*" className="sr-only" onChange={handleInputChange} />
        </label>
      ) : null}
    </div>
  );
}
