"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle2, Clock, MessageSquare, Navigation } from "lucide-react";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import ExpandableText from "@/components/ui/ExpandableText";
import PhotoSourceSheet from "@/components/ui/PhotoSourceSheet";
import SpotReviewsSheet from "@/features/course/components/SpotReviewsSheet";
import { isExperiencePhotoId, type CourseSpot } from "@/features/course/api/types";
import { useUploadMissionPhoto } from "@/features/course/api/useCourseApi";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";

type MissionCardProps = {
  courseId: string;
  spot: CourseSpot;
  /** 체험 코스면 업로드 안내 문구가 달라지고, 상대 사진은 실제가 아니라 예시라는 걸 알려준다. */
  isExperience?: boolean;
};

export default function MissionCard({ courseId, spot, isExperience = false }: MissionCardProps) {
  const [comment, setComment] = useState("");
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isPhotoSourceOpen, setIsPhotoSourceOpen] = useState(false);
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
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-forest-light">
          {spot.imageUrl ? (
            <Image src={spot.imageUrl} alt={spot.name} fill sizes="56px" className="object-cover" />
          ) : null}
        </div>

        <div className="flex-1">
          <p className="text-base font-semibold text-ink">{spot.name}</p>
          <p className="text-sm text-muted">{spot.sigunguName ?? spot.address}</p>
        </div>
      </div>

      {spot.description ? (
        <ExpandableText text={spot.description} lines={2} className="text-sm leading-relaxed text-ink/80" />
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
        {spot.moveMinutesFromPrevious !== null ? (
          <span className="flex items-center gap-1">
            <Navigation size={12} strokeWidth={1.5} />
            이전 장소에서 {spot.moveMinutesFromPrevious}분 이동
          </span>
        ) : null}
        <span className="flex items-center gap-1">
          <Clock size={12} strokeWidth={1.5} />
          여기서 {spot.stayMinutes}분 머물러요
        </span>
        <button
          type="button"
          onClick={() => setIsReviewsOpen(true)}
          className="flex items-center gap-1 underline underline-offset-2"
        >
          <MessageSquare size={12} strokeWidth={1.5} />
          후기 {spot.reviewCount}개{spot.reviewWritten ? " · 내가 남김" : ""}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Camera size={16} strokeWidth={1.5} />
            사진 미션
          </span>
          <p className="text-xs leading-relaxed text-muted">{mission.description}</p>
          {isExperience ? (
            <p className="text-[11px] text-muted/80">
              사진 한 장만 올려 보세요 · 실제 여행에서는 장소마다 두 사람이 함께 사진을 남겨요
            </p>
          ) : (
            <p className="text-[11px] text-muted/80">
              상대방 인증샷 {mission.partnerPhotoUploaded ? "완료" : "대기중"} · 다음날 00시부터 영상 제작
            </p>
          )}
        </div>

        {mission.photoUploaded ? (
          <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-forest-light px-6 py-4 text-forest">
            <CheckCircle2 size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium">완료!</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={upload.isPending}
            onClick={() => setIsPhotoSourceOpen(true)}
            className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-forest px-6 py-4 text-white focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50"
          >
            <Camera size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium">
              {upload.isPending ? "업로드 중..." : "사진 첨부하기"}
            </span>
          </button>
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

      <PhotoSourceSheet
        open={isPhotoSourceOpen}
        onClose={() => setIsPhotoSourceOpen(false)}
        onSelect={handleFileChange}
      />

      {upload.isError ? (
        <p className="text-sm text-red-500">
          {upload.error instanceof ApiError ? upload.error.message : "인증샷 업로드에 실패했어요."}
        </p>
      ) : null}

      {mission.photos.length > 0 ? (
        <HorizontalScroller className="gap-2">
          {mission.photos.map((photo) => (
            <div key={photo.id} className="flex w-24 shrink-0 flex-col gap-1">
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-xl bg-forest-light ${
                  photo.isMine ? "ring-2 ring-forest" : ""
                }`}
              >
                <Image src={resolveAssetUrl(photo.imageUrl)} alt={photo.comment ?? spot.name} fill sizes="96px" className="object-cover" />
              </div>
              <span className="text-[11px] font-medium text-muted">
                {photo.isMine ? "나" : "상대방"}
                {!photo.isMine && isExperiencePhotoId(photo.id) ? " (예시)" : ""}
              </span>
              {photo.comment ? (
                <p className="truncate text-[11px] text-ink/70">{photo.comment}</p>
              ) : null}
            </div>
          ))}
        </HorizontalScroller>
      ) : null}

      {isReviewsOpen ? (
        <SpotReviewsSheet
          contentId={spot.contentId}
          spotName={spot.name}
          address={spot.address}
          category={spot.category}
          description={spot.description}
          onClose={() => setIsReviewsOpen(false)}
        />
      ) : null}
    </div>
  );
}
