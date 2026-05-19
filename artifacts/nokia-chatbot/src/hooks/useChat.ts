import { useState, useEffect, useCallback, useRef } from "react";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { useSound } from "./useSound";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function useChat() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const initialized = useRef(false);

  const createConversation = useCreateOpenaiConversation();
  const { playSent, playReceived } = useSound();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async (retry = true) => {
      try {
        const conv = await createConversation.mutateAsync({ data: { title: "Nokia Chat" } });
        setConversationId(conv.id);
      } catch (err) {
        if (retry) {
          setTimeout(() => init(false), 2000);
        }
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !content.trim() || isTyping) return;

    playSent();

    const tempUserMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: tempUserMsgId, role: "user", content }]);

    const tempAsstMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: tempAsstMsgId, role: "assistant", content: "" }]);
    setIsTyping(true);

    try {
      const BASE = import.meta.env.BASE_URL;
      const response = await fetch(`${BASE}api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (data.done) break;
              if (data.content) {
                fullContent += data.content;
                await new Promise((r) => setTimeout(r, 15));
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempAsstMsgId ? { ...msg, content: fullContent } : msg
                  )
                );
              }
            } catch (_e) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
      playReceived();
    } catch (_err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAsstMsgId ? { ...msg, content: "Error connecting to network." } : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, [conversationId, isTyping, playSent, playReceived]);

  return {
    messages,
    sendMessage,
    isTyping,
    isReady: !!conversationId,
  };
}
