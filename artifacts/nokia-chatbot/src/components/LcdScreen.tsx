import { useEffect, useState } from "react";
import ChatMessages from "./ChatMessages";
import { Message } from "../hooks/useChat";

interface LcdScreenProps {
  messages: Message[];
  isTyping: boolean;
  t9Text: string;
  t9ComposingChar: string | null;
  t9Mode: string;
  isReady: boolean;
}

export default function LcdScreen({
  messages,
  isTyping,
  t9Text,
  t9ComposingChar,
  t9Mode,
  isReady,
}: LcdScreenProps) {
  const [time, setTime] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <div className="w-full h-full bg-[#8bac0f] relative overflow-hidden lcd-shadow lcd-glow">
      {/* Scanline overlay */}
      <div className="absolute inset-0 z-10 lcd-scanlines pointer-events-none" />

      {/* LCD pixel grid */}
      <div className="absolute inset-0 z-0 lcd-pixel-grid pointer-events-none" />

      {/* Content */}
      <div className="relative z-5 flex flex-col h-full text-[#1a4a1a] font-mono text-[18px] leading-[20px] px-[10px] py-[8px]">
        {/* Status Bar */}
        <div className="flex justify-between items-center shrink-0 border-b border-[#1a4a1a]/40 pb-[4px] mb-[4px]">
          <div className="flex gap-[2px] items-end h-[12px]">
            <div className="w-[4px] h-[4px] bg-[#1a4a1a]" />
            <div className="w-[4px] h-[6px] bg-[#1a4a1a]" />
            <div className="w-[4px] h-[8px] bg-[#1a4a1a]" />
            <div className="w-[4px] h-[11px] bg-[#1a4a1a]" />
          </div>
          <span className="text-[13px] tracking-[2px] opacity-70">NOKIA</span>
          <span className="text-[16px]">{time}</span>
        </div>

        {/* Battery / signal row */}
        <div className="flex justify-between items-center shrink-0 mb-[4px] text-[12px] opacity-60">
          <span>|||||</span>
          <span>Messages</span>
          <div className="flex items-center gap-[2px]">
            <span>[</span>
            <span className="inline-block w-[14px] h-[7px] border border-[#1a4a1a] bg-[#1a4a1a]" />
            <span>]</span>
          </div>
        </div>

        {/* Main Chat Area — dominates the screen */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {!isReady ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="lcd-blink">Connecting...</span>
            </div>
          ) : (
            <ChatMessages messages={messages} isTyping={isTyping} cursorVisible={cursorVisible} />
          )}
        </div>

        {/* Input line */}
        <div className="shrink-0 border-t border-[#1a4a1a]/40 pt-[4px] mt-[4px] min-h-[34px]">
          <div className="flex justify-between text-[12px] opacity-60 mb-[2px]">
            <span>{t9Mode}</span>
            <span>{160 - t9Text.length}</span>
          </div>
          <div className="break-words leading-[18px] min-h-[20px]">
            {t9Text}
            {t9ComposingChar && (
              <span className="bg-[#1a4a1a] text-[#8bac0f] inline-block w-[10px] text-center text-[16px]">
                {t9ComposingChar}
              </span>
            )}
            {!t9ComposingChar && (
              <span className={cursorVisible ? "opacity-100" : "opacity-0"}>_</span>
            )}
          </div>
        </div>

        {/* Softkeys */}
        <div className="flex justify-between text-[13px] opacity-70 shrink-0 mt-[2px] font-bold tracking-wide">
          <span>Options</span>
          <span>Clear</span>
        </div>
      </div>
    </div>
  );
}
