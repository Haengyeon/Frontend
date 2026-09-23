"use client";

import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import ExperienceBadge from "@/components/ui/ExperienceBadge";
import { calculateDday } from "@/features/chat/lib/dday";
import type { ChatRoomSummary } from "@/features/chat/api/types";

type ChatRoomHeaderProps = {
  room: ChatRoomSummary;
};

export default function ChatRoomHeader({ room }: ChatRoomHeaderProps) {
  const router = useRouter();
  const dday = calculateDday(room.travelDate);

  return (
    <Header>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={room.partnerProfileImageUrl} alt={room.partnerName} size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-ink">{room.partnerName}</p>
              {room.isExperience ? <ExperienceBadge /> : null}
            </div>
            <p className="text-xs text-muted">{dday === 0 ? "D-Day" : `D${dday > 0 ? "-" : "+"}${Math.abs(dday)}`}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            router.push(
              `/mypage/reports?matchAttemptId=${room.matchAttemptId}&partnerName=${encodeURIComponent(room.partnerName)}`,
            )
          }
          aria-label="신고하기"
          className="text-muted"
        >
          <Flag size={18} strokeWidth={1.5} />
        </button>
      </div>
    </Header>
  );
}
