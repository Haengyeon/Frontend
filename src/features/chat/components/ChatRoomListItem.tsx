"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import type { ChatRoomSummary } from "@/features/chat/types";

type ChatRoomListItemProps = {
  room: ChatRoomSummary;
};

export default function ChatRoomListItem({ room }: ChatRoomListItemProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/chat/${room.chatId}`)}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <Avatar src={room.partnerPhotoUrl} alt={room.partnerName} size={48} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{room.partnerName}</p>
        <p className="truncate text-xs text-muted">{room.lastMessage}</p>
      </div>
    </button>
  );
}
