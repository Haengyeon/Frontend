"use client";

import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import { calculateDday } from "@/features/chat/lib/dday";
import type { ChatRoom } from "@/features/chat/api/types";

type ChatRoomHeaderProps = {
  room: ChatRoom;
};

export default function ChatRoomHeader({ room }: ChatRoomHeaderProps) {
  const router = useRouter();
  const dday = calculateDday(room.travelDate);

  return (
    <Header>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={room.partner.profileImageUrl} alt={room.partner.name} size={32} />
          <div>
            <p className="text-sm font-medium text-ink">{room.partner.name}</p>
            <p className="text-xs text-muted">{dday === 0 ? "D-Day" : `D${dday > 0 ? "-" : "+"}${Math.abs(dday)}`}</p>
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
