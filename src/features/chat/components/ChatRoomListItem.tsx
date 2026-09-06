"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { formatDateLabel } from "@/features/matching/mocks";
import type { ChatRoom } from "@/features/chat/api/types";

type ChatRoomListItemProps = {
  room: ChatRoom;
};

function getStatusLabel(room: ChatRoom): string {
  switch (room.status) {
    case "LOCKED":
      return `채팅은 ${formatDateLabel(room.openAt.slice(0, 10))}부터 열려요`;
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

  return (
    <button
      type="button"
      onClick={() => router.push(`/chat/${room.id}`)}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <Avatar src={room.partner.profileImageUrl} alt={room.partner.name} size={48} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{room.partner.name}</p>
        <p className="truncate text-xs text-muted">{getStatusLabel(room)}</p>
      </div>
    </button>
  );
}
