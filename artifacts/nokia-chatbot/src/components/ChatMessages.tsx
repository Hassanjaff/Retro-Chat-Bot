import { useEffect, useRef } from "react";
import { Message } from "../hooks/useChat";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  cursorVisible: boolean;
}

export default function ChatMessages({
  messages,
  isTyping,
  cursorVisible,
}: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-[16px]">
        <div className="opacity-70">- Nokia Chat -</div>
        <div className="opacity-50 text-[14px] mt-[2px]">Ready.</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col scrollbar-hide"
    >
      {messages.map((msg) => (
        <div key={msg.id} className="mb-[3px] leading-[20px] msg-pop-in">
          {msg.role === "user" ? (
            <div className="text-[#1a4a1a]">
              <span className="opacity-50">&gt; </span>
              <span>{msg.content}</span>
            </div>
          ) : (
            <div className="text-[#1a4a1a] break-words whitespace-pre-wrap">
              <span>{msg.content}</span>
              {isTyping && msg.id === messages[messages.length - 1]?.id && (
                <span className={cursorVisible ? "opacity-100" : "opacity-0"}>_</span>
              )}
            </div>
          )}
        </div>
      ))}

      {isTyping && messages[messages.length - 1]?.role === "user" && (
        <div className="mt-[3px] text-[#1a4a1a] opacity-50">
          <span className="lcd-blink">Receiving...</span>
        </div>
      )}

      <div ref={endRef} className="h-[4px]" />
    </div>
  );
}
