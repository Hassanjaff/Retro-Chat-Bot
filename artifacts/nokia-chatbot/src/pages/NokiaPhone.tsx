import { useEffect } from "react";
import LcdScreen from "@/components/LcdScreen";
import Keypad from "@/components/Keypad";
import { useChat } from "@/hooks/useChat";
import { useT9 } from "@/hooks/useT9";

export default function NokiaPhone() {
  const { messages, isTyping, sendMessage, isReady } = useChat();
  const {
    text,
    setText,
    mode,
    composingChar,
    handleKeyPress,
    handleBackspace,
    confirmCurrentChar
  } = useT9();

  const handleSend = () => {
    confirmCurrentChar();
    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-900 overflow-hidden select-none">
      
      {/* Phone Body */}
      <div className="w-[300px] h-[650px] bg-[#1a1a2e] rounded-[40px] shadow-2xl relative flex flex-col items-center pt-10 pb-8 border-x-8 border-t-8 border-b-[20px] border-[#0a0a16] shadow-black/80">
        
        {/* Speaker slot */}
        <div className="absolute top-4 w-12 h-2 bg-black rounded-full shadow-inner flex gap-[2px] justify-center items-center overflow-hidden">
           <div className="w-[2px] h-full bg-gray-700"></div>
           <div className="w-[2px] h-full bg-gray-700"></div>
           <div className="w-[2px] h-full bg-gray-700"></div>
           <div className="w-[2px] h-full bg-gray-700"></div>
           <div className="w-[2px] h-full bg-gray-700"></div>
        </div>

        {/* Screen bezel */}
        <div className="w-[220px] h-[260px] bg-black rounded-[20px] mb-2 p-2 relative flex items-center justify-center">
          <div className="absolute top-1 right-2 text-gray-600 text-[10px] font-bold font-sans">NOKIA</div>
          <LcdScreen 
            messages={messages} 
            isTyping={isTyping} 
            t9Text={text}
            t9ComposingChar={composingChar}
            t9Mode={mode}
            isReady={isReady}
          />
        </div>

        {/* Keypad */}
        <div className="w-full flex-1 relative z-10 px-2 mt-4">
          <Keypad 
            onKeyPress={handleKeyPress}
            onClear={handleBackspace}
            onSend={handleSend}
          />
        </div>

        {/* Bottom curve details */}
        <div className="absolute bottom-3 w-1/2 h-1 bg-[#0a0a16] rounded-full opacity-50"></div>
      </div>

    </div>
  );
}
