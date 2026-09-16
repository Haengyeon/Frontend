"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { formatDateLabel, toDateValue } from "@/features/matching/mocks";
import type { ChatRoomSummary } from "@/features/chat/api/types";

type ChatRoomListItemProps = {
  room: ChatRoomSummary;
};

function getStatusLabel(room: ChatRoomSummary): string {
  // 대화가 있었으면(OPEN/CLOSED) 상태 문구보다 마지막 메시지를 보여주는 게 더 유용하다.
  if (room.lastMessageContent) return room.lastMessageContent;

  switch (room.status) {
    case "LOCKED":
      return `채팅은 ${formatDateLabel(toDateValue(new Date(room.openAt)))}부터 열려요`;
    case "OPEN":
      return `대화를 나눠보세요 · 남은 메시지 ${room.myRemainingCount}회`;
    case "CLOSED":
      return "여행이 종료됐어요";
    case "DISABLED":
      return "이용할 수 없는 채팅방이에요";
  }
}

export default function ChatRoomListItem({ room }: ChatRoomListItemProps) {
  const router = useRouter();
  const unreadCount = room.unreadCount ?? 0;

  return (
    <button
      type="button"
      onClick={() => router.push(`/chat/${room.id}`)}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <Avatar src={room.partnerProfileImageUrl} alt={room.partnerName} size={48} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-ink">{room.partnerName}</p>
          {unreadCount > 0 ? (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-semibold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted">{getStatusLabel(room)}</p>
      </div>
    </button>
  );
}
