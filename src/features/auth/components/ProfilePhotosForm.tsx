"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PhotoUploadBox from "@/features/auth/components/PhotoUploadBox";

export default function ProfilePhotosForm() {
  const router = useRouter();
  const [bio, setBio] = useState("");

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">프로필 사진</span>
        <p className="text-xs text-muted">전신샷과 얼굴샷을 등록해주세요</p>
        <div className="flex gap-3">
          <PhotoUploadBox label="전신샷 업로드" icon="🧍" />
          <PhotoUploadBox label="얼굴사진 업로드" icon="🙂" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">한 줄 소개</span>
        <p className="text-xs text-muted">한 줄로 나를 알려주세요</p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="resize-none rounded-xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
          placeholder="나를 표현하는 한 줄을 적어주세요"
        />
      </div>

      <div className="mt-auto">
        <Button className="w-full" onClick={() => router.push("/profile-setup/preferences")}>
          다음
        </Button>
      </div>
    </div>
  );
}
