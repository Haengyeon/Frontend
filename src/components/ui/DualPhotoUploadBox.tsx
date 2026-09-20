"use client";

import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent, type WheelEvent } from "react";
import { Camera } from "lucide-react";

type DualPhotoUploadBoxProps = {
  onProfileImageSelect: (file: File) => void;
  onFullBodyImageSelect: (file: File) => void;
  /** 마이페이지 수정처럼 서버에 이미 저장된 사진이 있을 때 초기 미리보기로 쓴다 */
  initialProfilePreviewUrl?: string | null;
  initialFullBodyPreviewUrl?: string | null;
};

type Offset = { x: number; y: number };
type Size = { w: number; h: number };
type Rect = { x: number; y: number; w: number; h: number };

// 얼굴사진(정사각형)과 전신샷(세로로 긴 사진)을 사진 한 장에서 동시에 뽑아낸다.
// 세로 틀 안에 정사각형 틀을 겹쳐 보여주고, 사진 한 장을 손가락/휠로 조정하면
// 두 틀 영역을 각각 잘라 두 장의 결과물로 만든다.
const VERTICAL_ASPECT = 3 / 4;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const OUTPUT_LONG_SIDE = 900;
const WHEEL_ZOOM_STEP = 0.08;
const WHEEL_COMMIT_DELAY_MS = 400;

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function DualPhotoUploadBox({
  onProfileImageSelect,
  onFullBodyImageSelect,
  initialProfilePreviewUrl,
  initialFullBodyPreviewUrl,
}: DualPhotoUploadBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [boxSize, setBoxSize] = useState<Size>({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState<Size | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

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

  // 박스가 반응형이라 실제 픽셀 크기를 CSS만으로 알 수 없어서 관찰해서 읽는다.
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

  // 세로 틀(전신샷)을 박스 안에 먼저 배치하고, 그 위쪽에 정사각형 틀(얼굴사진)을 겹쳐 넣는다.
  const verticalGuide: Rect | null =
    boxSize.w > 0 && boxSize.h > 0
      ? (() => {
          const maxW = boxSize.w * 0.82;
          const maxH = boxSize.h * 0.82;
          let w = maxW;
          let h = w / VERTICAL_ASPECT;
          if (h > maxH) {
            h = maxH;
            w = h * VERTICAL_ASPECT;
          }
          return { x: (boxSize.w - w) / 2, y: (boxSize.h - h) / 2, w, h };
        })()
      : null;

  const squareGuide: Rect | null = verticalGuide
    ? (() => {
        const side = verticalGuide.w * 0.62;
        return {
          x: verticalGuide.x + (verticalGuide.w - side) / 2,
          y: verticalGuide.y + verticalGuide.h * 0.14,
          w: side,
          h: side,
        };
      })()
    : null;

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

  const cropRect = (guide: Rect, offsetToUse: Offset, scaleToUse: number, outW: number, outH: number) => {
    if (!imgRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const sx = (guide.x - offsetToUse.x) / scaleToUse;
    const sy = (guide.y - offsetToUse.y) / scaleToUse;
    const sw = guide.w / scaleToUse;
    const sh = guide.h / scaleToUse;
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, outW, outH);
    return canvas;
  };

  const commitCrop = (offsetToUse: Offset, scaleToUse: number) => {
    if (!naturalSize || !file || !verticalGuide || !squareGuide) return;

    cropRect(squareGuide, offsetToUse, scaleToUse, OUTPUT_LONG_SIDE, OUTPUT_LONG_SIDE)?.toBlob(
      (blob) => {
        if (blob) onProfileImageSelect(new File([blob], file.name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );

    const vOutW = Math.round(OUTPUT_LONG_SIDE * VERTICAL_ASPECT);
    cropRect(verticalGuide, offsetToUse, scaleToUse, vOutW, OUTPUT_LONG_SIDE)?.toBlob(
      (blob) => {
        if (blob) onFullBodyImageSelect(new File([blob], file.name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  };

  // 사진을 처음 고르면 중앙 정렬된 기본 위치로 두 크롭을 즉시 한 번 반영해둔다.
  useEffect(() => {
    if (!file || !naturalSize || boxSize.w === 0) return;
    if (initializedForFile.current === file) return;
    initializedForFile.current = file;
    const centered = clampAt(
      { x: (boxSize.w - naturalSize.w * baseScale) / 2, y: (boxSize.h - naturalSize.h * baseScale) / 2 },
      baseScale,
    );
    setOffset(centered);
    commitCrop(centered, baseScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, naturalSize, boxSize.w, boxSize.h]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!nextFile) return;
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
    if (!naturalSize) return;
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
    if (!naturalSize || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const ratio = distance(a, b) / pinchStart.current.distance;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStart.current.zoom * ratio));
      const oldScale = baseScale * pinchStart.current.zoom;
      const newScale = baseScale * newZoom;
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

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!naturalSize) return;
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

  const hasExistingPreview = Boolean(initialProfilePreviewUrl || initialFullBodyPreviewUrl);

  // 아직 새로 안 골랐으면 기존 두 사진을 그대로 보여준다(원격 서명 URL이라 캔버스로 다시 못 그림).
  if (!imageUrl && hasExistingPreview) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="aspect-square flex-1 overflow-hidden rounded-2xl bg-forest-light">
            {initialProfilePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={initialProfilePreviewUrl} alt="얼굴사진" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1 overflow-hidden rounded-2xl bg-forest-light" style={{ aspectRatio: VERTICAL_ASPECT }}>
            {initialFullBodyPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={initialFullBodyPreviewUrl} alt="전신샷" className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>
        <label className="cursor-pointer self-center text-xs text-forest underline underline-offset-2">
          사진 바꾸기 (한 장으로 두 사진 다시 만들기)
          <input type="file" accept="image/*" className="sr-only" onChange={handleInputChange} />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        ref={containerRef}
        className="relative w-full touch-none overflow-hidden rounded-2xl border border-dashed border-line bg-cream-card"
        style={{ aspectRatio: 4 / 5 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt="업로드한 사진"
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
            {verticalGuide ? (
              <div
                className="pointer-events-none absolute rounded-lg ring-2 ring-white/90"
                style={{ left: verticalGuide.x, top: verticalGuide.y, width: verticalGuide.w, height: verticalGuide.h }}
              />
            ) : null}
            {squareGuide ? (
              <div
                className="pointer-events-none absolute rounded-md ring-2 ring-forest"
                style={{ left: squareGuide.x, top: squareGuide.y, width: squareGuide.w, height: squareGuide.h }}
              />
            ) : null}
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 focus-within:ring-2 focus-within:ring-forest focus-within:ring-offset-2 focus-within:ring-offset-cream">
            <Camera size={28} strokeWidth={1.5} className="text-muted" />
            <span className="text-xs text-muted">사진 업로드</span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleInputChange} />
          </label>
        )}
      </div>

      {imageUrl ? (
        <>
          <p className="text-center text-[11px] text-muted">
            초록 네모는 얼굴사진, 흰 테두리는 전신샷으로 각각 쓰여요. 손가락으로 확대·이동해서 맞춰주세요
          </p>
          <label className="cursor-pointer self-center text-xs text-forest underline underline-offset-2">
            다른 사진 선택
            <input type="file" accept="image/*" className="sr-only" onChange={handleInputChange} />
          </label>
        </>
      ) : null}
    </div>
  );
}
