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
    confirmCurrentChar,
  } = useT9();

  const handleSend = () => {
    confirmCurrentChar();
    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex items-center justify-center bg-neutral-300 overflow-hidden select-none"
      style={{ fontFamily: "'VT323', monospace" }}
    >
      {/* Nokia 1100 Body */}
      <div className="relative nokia-1100-body">
        {/* Long speaker grille */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-24 h-[6px] rounded-full bg-[#2a2a2a] overflow-hidden flex items-center justify-center gap-[3px] nokia-speaker">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[1.5px] h-[3px] bg-[#555] rounded-full" />
          ))}
        </div>

        {/* Dark screen housing area */}
        <div className="absolute top-[24px] left-[12px] right-[12px] h-[120px] bg-[#1a1a1a] rounded-[12px] nokia-screen-housing">
          {/* NOKIA branding above screen */}
          <div className="absolute -top-[14px] left-0 right-0 text-center text-[9px] text-[#999] uppercase tracking-[2px]">
            NOKIA
          </div>

          {/* LCD Screen inside housing */}
          <div className="absolute top-[8px] left-[10px] right-[10px] bottom-[10px]">
            <LcdScreen
              messages={messages}
              isTyping={isTyping}
              t9Text={text}
              t9ComposingChar={composingChar}
              t9Mode={mode}
              isReady={isReady}
            />
          </div>
        </div>

        {/* Navigation / softkey area */}
        <div className="absolute top-[158px] left-[14px] right-[14px] h-[42px] flex items-center justify-between">
          <button
            className="w-[56px] h-[28px] nokia-softkey flex items-center justify-center text-[8px] text-[#555] uppercase"
            onClick={() => {}}
          >
            Menu
          </button>

          {/* Center nav cluster */}
          <div className="flex flex-col items-center gap-[1px]">
            <button className="w-6 h-[10px] nokia-nav-btn rounded-t-sm" />
            <div className="flex gap-[1px]">
              <button className="w-[10px] h-6 nokia-nav-btn rounded-l-sm" />
              <button
                className="w-8 h-6 nokia-nav-btn nokia-nav-center flex items-center justify-center text-[7px] text-[#777]"
                onClick={handleSend}
              >
                OK
              </button>
              <button className="w-[10px] h-6 nokia-nav-btn rounded-r-sm" />
            </div>
            <button className="w-6 h-[10px] nokia-nav-btn rounded-b-sm" />
          </div>

          <button
            className="w-[56px] h-[28px] nokia-softkey flex items-center justify-center text-[8px] text-[#555] uppercase"
            onClick={handleBackspace}
          >
            Clear
          </button>
        </div>

        {/* Call / End buttons row */}
        <div className="absolute top-[204px] left-[14px] right-[14px] h-[28px] flex items-center justify-between">
          <button className="w-[52px] h-[22px] nokia-call-btn rounded-full flex items-center justify-center text-green-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
          <div className="w-[60px] h-[22px] nokia-logo-area flex items-center justify-center text-[8px] text-[#aaa] tracking-widest">
            nokia
          </div>
          <button className="w-[52px] h-[22px] nokia-end-btn rounded-full flex items-center justify-center text-red-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
              <line x1="23" y1="1" x2="1" y2="23"/>
            </svg>
          </button>
        </div>

        {/* Number keypad */}
        <div className="absolute top-[242px] left-[16px] right-[16px] bottom-[18px]">
          <Keypad onKeyPress={handleKeyPress} onClear={handleBackspace} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
