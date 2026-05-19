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

export default function LcdScreen({ messages, isTyping, t9Text, t9ComposingChar, t9Mode, isReady }: LcdScreenProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[200px] h-[220px] bg-[#8bac0f] rounded-lg p-2 flex flex-col relative overflow-hidden lcd-shadow border-4 border-[#6a8c0a]">
      {/* Scanline overlay */}
      <div className="absolute inset-0 z-10 lcd-scanlines pointer-events-none opacity-50 mix-blend-multiply" />
      
      {/* Content wrapper */}
      <div className="relative z-0 flex flex-col h-full text-[#1a4a1a] lcd-text-shadow font-mono text-[14px] leading-tight">
        
        {/* Status Bar */}
        <div className="flex justify-between items-center mb-1 border-b border-[#1a4a1a] pb-1 opacity-80 shrink-0">
          <div className="flex flex-col gap-[1px]">
            <div className="h-1 w-3 bg-[#1a4a1a]" />
            <div className="h-1 w-3 bg-[#1a4a1a]" />
            <div className="h-1 w-3 bg-[#1a4a1a]" />
            <div className="h-1 w-3 bg-[#1a4a1a]" />
          </div>
          <div className="text-center">
            NOKIA
          </div>
          <div className="text-right">
            {time}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {!isReady ? (
            <div className="flex-1 flex items-center justify-center animate-pulse">
              Connecting...
            </div>
          ) : (
            <ChatMessages messages={messages} isTyping={isTyping} />
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 min-h-[40px] border-t border-[#1a4a1a] pt-1 flex flex-col justify-end mt-1">
          <div className="flex justify-between text-[10px] opacity-70 mb-1">
            <span>{t9Mode}</span>
            <span>{160 - t9Text.length}</span>
          </div>
          <div className="break-words max-h-[30px] overflow-hidden leading-tight">
            {t9Text}
            {t9ComposingChar && <span className="bg-[#1a4a1a] text-[#8bac0f] inline-block w-[8px] text-center">{t9ComposingChar}</span>}
            {!t9ComposingChar && <span className="animate-pulse">_</span>}
          </div>
        </div>

        {/* Softkeys labels */}
        <div className="flex justify-between text-[12px] opacity-80 mt-1 shrink-0 font-bold">
          <span>Options</span>
          <span>Clear</span>
        </div>

      </div>
    </div>
  );
}
