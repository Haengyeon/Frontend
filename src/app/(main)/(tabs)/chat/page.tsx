import ChatRoomListItem from "@/features/chat/components/ChatRoomListItem";
import { CHAT_ROOMS } from "@/features/chat/mocks";

export default function Page() {
  const nowRooms = CHAT_ROOMS.filter((room) => !room.isPast);
  const pastRooms = CHAT_ROOMS.filter((room) => room.isPast);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      {nowRooms.length > 0 ? (
        <div className="flex flex-col">
          <span className="pb-1 text-sm font-medium text-ink">Now</span>
          <div className="flex flex-col divide-y divide-line">
            {nowRooms.map((room) => (
              <ChatRoomListItem key={room.chatId} room={room} />
            ))}
          </div>
        </div>
      ) : null}

      {pastRooms.length > 0 ? (
        <div className="flex flex-col">
          <span className="pb-1 text-sm font-medium text-ink">Past</span>
          <div className="flex flex-col divide-y divide-line">
            {pastRooms.map((room) => (
              <ChatRoomListItem key={room.chatId} room={room} />
            ))}
          </div>
        </div>
      ) : null}

      {CHAT_ROOMS.length === 0 ? (
        <p className="pt-8 text-center text-sm text-muted">아직 채팅방이 없어요.</p>
      ) : null}
    </div>
  );
}
