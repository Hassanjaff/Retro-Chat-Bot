import { useState, useEffect, useCallback, useRef } from "react";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { useSound } from "./useSound";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  displayContent?: string; // partial text for typewriter effect
  isComplete?: boolean;
};

export function useChat() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const initialized = useRef(false);

  const createConversation = useCreateOpenaiConversation();
  const { playSent, playReceived } = useSound();

  // typewriter state per message
  const typingTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async (retry = true) => {
      try {
        const conv = await createConversation.mutateAsync({
          data: { title: "Nokia Chat" },
        });
        setConversationId(conv.id);
      } catch (_err) {
        if (retry) {
          setTimeout(() => init(false), 2000);
        }
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cleanup typing timers
  useEffect(() => {
    return () => {
      Object.values(typingTimers.current).forEach(clearInterval);
    };
  }, []);

  const startTypewriter = useCallback(
    (msgId: string, fullText: string) => {
      if (typingTimers.current[msgId]) clearInterval(typingTimers.current[msgId]);

      let idx = 0;
      const speed = 35; // ms per character

      typingTimers.current[msgId] = setInterval(() => {
        idx++;
        if (idx >= fullText.length) {
          clearInterval(typingTimers.current[msgId]);
          delete typingTimers.current[msgId];
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? { ...m, displayContent: fullText, isComplete: true }
                : m
            )
          );
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, displayContent: fullText.slice(0, idx) } : m
          )
        );
      }, speed);
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim() || isTyping) return;

      playSent();

      const userMsgId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content, isComplete: true },
      ]);

      const asstMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: asstMsgId, role: "assistant", content: "", displayContent: "", isComplete: false },
      ]);
      setIsTyping(true);

      let fullResponse = "";

      try {
        const BASE = import.meta.env.BASE_URL;
        const response = await fetch(
          `${BASE}api/openai/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          }
        );

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

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
                  fullResponse += data.content;
                }
              } catch (_e) {
                // ignore
              }
            }
          }
        }

        // Save full response, then start typewriter animation
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstMsgId
              ? { ...m, content: fullResponse, displayContent: "", isComplete: false }
              : m
          )
        );

        setIsTyping(false);
        startTypewriter(asstMsgId, fullResponse);

        setTimeout(() => {
          playReceived();
        }, fullResponse.length * 35 + 100);
      } catch (_err) {
        setIsTyping(false);
        const errText = "Error connecting to network.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstMsgId
              ? { ...m, content: errText, displayContent: errText, isComplete: true }
              : m
          )
        );
      }
    },
    [conversationId, isTyping, playSent, playReceived, startTypewriter]
  );

  // For display: use displayContent if present (incomplete typewriter), else content
  const displayMessages = messages.map((m) => ({
    ...m,
    content: m.displayContent !== undefined ? m.displayContent : m.content,
  }));

  return {
    messages: displayMessages,
    sendMessage,
    isTyping,
    isReady: !!conversationId,
  };
}
