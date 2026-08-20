"use client";

import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import { useDaysUntilTrip } from "@/features/matching/hooks/useDaysUntilTrip";
import type { ChatRoomSummary } from "@/features/chat/types";

type ChatRoomHeaderProps = {
  room: ChatRoomSummary;
};

export default function ChatRoomHeader({ room }: ChatRoomHeaderProps) {
  const daysUntilTrip = useDaysUntilTrip();

  return (
    <Header>
      <Avatar src={room.partnerPhotoUrl} alt={room.partnerName} size={32} />
      <div>
        <p className="text-sm font-medium text-ink">{room.partnerName}</p>
        {daysUntilTrip !== null ? <p className="text-xs text-muted">D-{daysUntilTrip}</p> : null}
      </div>
    </Header>
  );
}
