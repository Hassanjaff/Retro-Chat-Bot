import { useState, useCallback, useEffect } from "react";
import LcdScreen from "@/components/LcdScreen";
import Keypad from "@/components/Keypad";
import BootSequence from "@/components/BootSequence";
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

  const [booted, setBooted] = useState(false);
  const [screenLit, setScreenLit] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    // LCD warm-up glow after boot
    setTimeout(() => setScreenLit(true), 100);
  }, []);

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
      {/* Ambient backdrop glow behind phone */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] h-[740px] rounded-[28px] bg-gradient-to-b from-[#8bac0f]/[0.04] to-transparent blur-3xl" />
      </div>

      {/* Nokia Body — 340 x 720, fits vertical mobile */}
      <div className="relative nokia-1100-body">
        {/* Metallic side bevel strip */}
        <div className="absolute top-[40px] bottom-[20px] -left-[3px] w-[4px] nokia-side-bevel rounded-l-[4px]" />
        <div className="absolute top-[40px] bottom-[20px] -right-[3px] w-[4px] nokia-side-bevel rounded-r-[4px]" />

        {/* Side button (power / volume) */}
        <div className="absolute top-[180px] -left-[4px] w-[3px] h-[28px] nokia-side-btn rounded-l-[2px]" />

        {/* Speaker grille */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-28 h-[7px] rounded-full bg-[#2a2a2a] overflow-hidden flex items-center justify-center gap-[3px] nokia-speaker">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[1.5px] h-[3px] bg-[#555] rounded-full" />
          ))}
        </div>

        {/* NOKIA branding above screen */}
        <div className="absolute top-[24px] left-0 right-0 text-center text-[10px] text-[#888] uppercase tracking-[3px]">
          NOKIA
        </div>

        {/* Power LED — pulses when AI is typing */}
        <div className="absolute top-[22px] right-[20px] w-[5px] h-[5px] rounded-full">
          <div className={`w-full h-full rounded-full ${isTyping ? 'nokia-led-pulse' : 'bg-[#333]'}`} />
        </div>

        {/* Screen housing — generous but not overwhelming */}
        <div className="absolute top-[40px] left-[14px] right-[14px] h-[400px] bg-[#0d0d0d] rounded-[14px] nokia-screen-housing overflow-hidden">
          <div className={`absolute top-[10px] left-[12px] right-[12px] bottom-[10px] ${screenLit ? 'lcd-warmup' : ''}`}>
            {!booted ? (
              <BootSequence onComplete={handleBootComplete} />
            ) : (
              <LcdScreen
                messages={messages}
                isTyping={isTyping}
                t9Text={text}
                t9ComposingChar={composingChar}
                t9Mode={mode}
                isReady={isReady}
              />
            )}
          </div>
        </div>

        {/* Navigation / softkey area */}
        <div className="absolute top-[452px] left-[18px] right-[18px] h-[48px] flex items-center justify-between">
          <button
            className="w-[68px] h-[32px] nokia-softkey flex items-center justify-center text-[9px] text-[#777] uppercase tracking-wider font-bold"
            onClick={() => {}}
          >
            Menu
          </button>

          {/* D-pad cluster */}
          <div className="relative w-[56px] h-[56px]">
            {/* Up */}
            <button className="absolute top-0 left-1/2 -translate-x-1/2 w-[20px] h-[16px] nokia-dpad-dir rounded-t-md flex items-center justify-center">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M1 6 L5 1 L9 6" />
              </svg>
            </button>
            {/* Left */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-[16px] h-[20px] nokia-dpad-dir rounded-l-md flex items-center justify-center">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M6 1 L2 5 L6 9" />
              </svg>
            </button>
            {/* Center SEND — black round button */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] nokia-dpad-center rounded-full flex items-center justify-center"
              onClick={handleSend}
            >
              <span className="text-[8px] text-[#ccc] font-bold tracking-[0.5px] scale-90">SEND</span>
            </button>
            {/* Right */}
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-[16px] h-[20px] nokia-dpad-dir rounded-r-md flex items-center justify-center">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M2 1 L6 5 L2 9" />
              </svg>
            </button>
            {/* Down */}
            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[16px] nokia-dpad-dir rounded-b-md flex items-center justify-center">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#777" strokeWidth="1.5">
                <path d="M1 1 L5 6 L9 1" />
              </svg>
            </button>
          </div>

          <button
            className="w-[68px] h-[32px] nokia-softkey flex items-center justify-center text-[9px] text-[#777] uppercase tracking-wider font-bold"
            onClick={handleBackspace}
          >
            Clear
          </button>
        </div>

        {/* Call / End buttons row */}
        <div className="absolute top-[506px] left-[18px] right-[18px] h-[28px] flex items-center justify-between">
          <button className="w-[58px] h-[24px] nokia-call-btn rounded-full flex items-center justify-center text-green-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
          <div className="w-[60px] h-[24px] nokia-logo-area flex items-center justify-center text-[8px] text-[#aaa] tracking-[3px]">
            nokia
          </div>
          <button className="w-[58px] h-[24px] nokia-end-btn rounded-full flex items-center justify-center text-red-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
              <line x1="23" y1="1" x2="1" y2="23"/>
            </svg>
          </button>
        </div>

        {/* Number keypad */}
        <div className="absolute top-[546px] left-[20px] right-[20px] bottom-[20px]">
          <Keypad onKeyPress={handleKeyPress} onClear={handleBackspace} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
