import { notFound } from "next/navigation";
import ChatRoomHeader from "@/features/chat/components/ChatRoomHeader";
import ChatRoom from "@/features/chat/components/ChatRoom";
import { CHAT_ROOMS } from "@/features/chat/mocks";

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  const room = CHAT_ROOMS.find((item) => item.chatId === chatId);

  if (!room) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <ChatRoomHeader room={room} />
      <ChatRoom room={room} />
    </div>
  );
}
