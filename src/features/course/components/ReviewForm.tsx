"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import PhotoUploadBox from "@/components/ui/PhotoUploadBox";
import StarRating from "@/features/course/components/StarRating";
import type { CourseSummary } from "@/features/course/types";

type ReviewFormProps = {
  course: CourseSummary;
};

export default function ReviewForm({ course }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const canSubmit = rating > 0 && content.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-forest-light">
          {course.imageUrl ? (
            <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{course.title}</p>
          <span className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} strokeWidth={1.5} />
            {course.region}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-ink">이번 코스는 어떠셨나요?</span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="코스에 대한 솔직한 후기를 남겨주세요."
        className="resize-none rounded-2xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">사진 첨부 (선택)</span>
        <div className="flex gap-3">
          <PhotoUploadBox label="사진 추가" icon="📷" />
        </div>
      </div>

      <Button
        className="mt-auto w-full"
        disabled={!canSubmit}
        onClick={() => router.push("/course")}
      >
        후기 등록하기
      </Button>
    </div>
  );
}
