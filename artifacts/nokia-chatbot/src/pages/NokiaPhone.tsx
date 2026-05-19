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
      {/* Nokia Body — 390 x 844 mobile-first */}
      <div className="relative nokia-1100-body">
        {/* Speaker grille */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-32 h-[8px] rounded-full bg-[#2a2a2a] overflow-hidden flex items-center justify-center gap-[3px] nokia-speaker">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-[2px] h-[4px] bg-[#555] rounded-full" />
          ))}
        </div>

        {/* NOKIA branding above screen */}
        <div className="absolute top-[28px] left-0 right-0 text-center text-[12px] text-[#888] uppercase tracking-[4px]">
          NOKIA
        </div>

        {/* Screen housing — HUGE, chat-dominant */}
        <div className="absolute top-[48px] left-[18px] right-[18px] h-[480px] bg-[#0d0d0d] rounded-[16px] nokia-screen-housing">
          {/* LCD Screen */}
          <div className="absolute top-[12px] left-[14px] right-[14px] bottom-[12px]">
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
        <div className="absolute top-[542px] left-[22px] right-[22px] h-[56px] flex items-center justify-between">
          <button
            className="w-[80px] h-[38px] nokia-softkey flex items-center justify-center text-[11px] text-[#777] uppercase tracking-wider font-bold"
            onClick={() => {}}
          >
            Menu
          </button>

          {/* Real Nokia D-pad */}
          <div className="relative w-[56px] h-[56px]">
            {/* Up */}
            <button className="absolute top-0 left-1/2 -translate-x-1/2 w-[22px] h-[16px] nokia-dpad-dir rounded-t-md flex items-center justify-center">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M1 7 L5 1 L9 7" />
              </svg>
            </button>
            {/* Left */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-[16px] h-[22px] nokia-dpad-dir rounded-l-md flex items-center justify-center">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M7 1 L1 5 L7 9" />
              </svg>
            </button>
            {/* Center OK — round, prominent */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] nokia-dpad-center rounded-full flex items-center justify-center"
              onClick={handleSend}
            >
              <span className="text-[8px] text-[#444] font-bold">OK</span>
            </button>
            {/* Right */}
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-[16px] h-[22px] nokia-dpad-dir rounded-r-md flex items-center justify-center">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M1 1 L7 5 L1 9" />
              </svg>
            </button>
            {/* Down */}
            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[22px] h-[16px] nokia-dpad-dir rounded-b-md flex items-center justify-center">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M1 1 L5 7 L9 1" />
              </svg>
            </button>
          </div>

          <button
            className="w-[80px] h-[38px] nokia-softkey flex items-center justify-center text-[11px] text-[#777] uppercase tracking-wider font-bold"
            onClick={handleBackspace}
          >
            Clear
          </button>
        </div>

        {/* Call / End buttons row */}
        <div className="absolute top-[606px] left-[22px] right-[22px] h-[36px] flex items-center justify-between">
          <button className="w-[70px] h-[30px] nokia-call-btn rounded-full flex items-center justify-center text-green-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
          <div className="w-[80px] h-[30px] nokia-logo-area flex items-center justify-center text-[10px] text-[#aaa] tracking-[4px]">
            nokia
          </div>
          <button className="w-[70px] h-[30px] nokia-end-btn rounded-full flex items-center justify-center text-red-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
              <line x1="23" y1="1" x2="1" y2="23"/>
            </svg>
          </button>
        </div>

        {/* Number keypad */}
        <div className="absolute top-[654px] left-[24px] right-[24px] bottom-[24px]">
          <Keypad onKeyPress={handleKeyPress} onClear={handleBackspace} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
