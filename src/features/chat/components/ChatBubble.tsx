import type { ChatMessage } from "@/features/chat/types";

type ChatBubbleProps = {
  message: ChatMessage;
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isMine = message.senderId === "me";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-tl-2xl rounded-tr-2xl px-4 py-2.5 text-sm ${
          isMine
            ? "rounded-bl-2xl bg-forest-light text-ink"
            : "rounded-br-2xl bg-cream-card text-ink"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
