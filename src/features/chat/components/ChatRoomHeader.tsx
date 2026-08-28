"use client";

import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import { useDaysUntilTrip } from "@/features/matching/hooks/useDaysUntilTrip";
import type { ChatRoomSummary } from "@/features/chat/types";

type ChatRoomHeaderProps = {
  room: ChatRoomSummary;
};

export default function ChatRoomHeader({ room }: ChatRoomHeaderProps) {
  const router = useRouter();
  const daysUntilTrip = useDaysUntilTrip();

  return (
    <Header>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={room.partnerPhotoUrl} alt={room.partnerName} size={32} />
          <div>
            <p className="text-sm font-medium text-ink">{room.partnerName}</p>
            {!room.isPast && daysUntilTrip !== null ? (
              <p className="text-xs text-muted">D-{daysUntilTrip}</p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/mypage/reports")}
          aria-label="신고하기"
          className="text-muted"
        >
          <Flag size={18} strokeWidth={1.5} />
        </button>
      </div>
    </Header>
  );
}
