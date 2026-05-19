import { useEffect, useRef } from "react";
import { Message } from "../hooks/useChat";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 mb-1 scrollbar-hide">
      {messages.length === 0 && (
        <div className="text-center mt-4 opacity-70">
          - Nokia Chat -<br/>
          Ready.
        </div>
      )}
      {messages.map((msg, i) => (
        <div key={msg.id} className="w-full text-left leading-tight break-words whitespace-pre-wrap">
          {msg.role === "user" ? (
            <span>{"> "}{msg.content}</span>
          ) : (
            <span>{msg.content}</span>
          )}
        </div>
      ))}
      {isTyping && (
        <div className="w-full text-left animate-pulse">
          ...
        </div>
      )}
    </div>
  );
}
