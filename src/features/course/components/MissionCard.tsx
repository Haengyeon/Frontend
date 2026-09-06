"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle2 } from "lucide-react";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import type { CourseSpot } from "@/features/course/api/types";
import { useUploadMissionPhoto } from "@/features/course/api/useCourseApi";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";

type MissionCardProps = {
  courseId: string;
  spot: CourseSpot;
};

export default function MissionCard({ courseId, spot }: MissionCardProps) {
  const [comment, setComment] = useState("");
  const upload = useUploadMissionPhoto(courseId);
  const { mission } = spot;

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    upload.mutate(
      { missionId: mission.id, file, comment: comment.trim() || undefined },
      { onSuccess: () => setComment("") },
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-forest-light">
          {spot.imageUrl ? (
            <Image src={spot.imageUrl} alt={spot.name} fill sizes="64px" className="object-cover" />
          ) : null}
        </div>

        <div className="flex-1">
          <p className="text-base font-semibold text-ink">{spot.name}</p>
          <p className="text-sm text-muted">{spot.sigunguName ?? spot.address}</p>
        </div>
      </div>

      {spot.description ? (
        <p className="text-sm leading-relaxed text-ink/80">{spot.description}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Camera size={16} strokeWidth={1.5} />
            사진 미션
          </span>
          <p className="text-xs leading-relaxed text-muted">{mission.description}</p>
          <p className="text-xs text-muted">
            상대방 인증샷 {mission.partnerPhotoUploaded ? "완료" : "대기중"}
          </p>
        </div>

        {mission.photoUploaded ? (
          <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-forest-light px-6 py-4 text-forest">
            <CheckCircle2 size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium">완료!</span>
          </div>
        ) : (
          <label
            aria-disabled={upload.isPending}
            className="flex shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-forest px-6 py-4 text-white focus-within:ring-2 focus-within:ring-forest focus-within:ring-offset-2 focus-within:ring-offset-cream aria-disabled:opacity-50"
          >
            <Camera size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium">
              {upload.isPending ? "업로드 중..." : "사진 촬영하기"}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              disabled={upload.isPending}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.currentTarget.value = "";
                handleFileChange(file);
              }}
            />
          </label>
        )}
      </div>

      {!mission.photoUploaded ? (
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={100}
          placeholder="이 순간을 한 줄로 남겨보세요 (선택)"
          className="rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
        />
      ) : null}

      {upload.isError ? (
        <p className="text-sm text-red-500">
          {upload.error instanceof ApiError ? upload.error.message : "인증샷 업로드에 실패했어요."}
        </p>
      ) : null}

      {mission.photos.length > 0 ? (
        <HorizontalScroller className="gap-2">
          {mission.photos.map((photo) => (
            <div key={photo.id} className="flex w-24 shrink-0 flex-col gap-1">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-forest-light">
                <Image src={resolveAssetUrl(photo.imageUrl)} alt={photo.comment ?? spot.name} fill sizes="96px" className="object-cover" />
              </div>
              <span className="text-[11px] font-medium text-muted">{photo.isMine ? "나" : "상대방"}</span>
              {photo.comment ? (
                <p className="truncate text-[11px] text-ink/70">{photo.comment}</p>
              ) : null}
            </div>
          ))}
        </HorizontalScroller>
      ) : null}
    </div>
  );
}
