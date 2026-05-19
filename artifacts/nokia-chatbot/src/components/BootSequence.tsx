import { useState, useEffect } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOP";

function MatrixRain() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, col) => (
        <div
          key={col}
          className="absolute top-0 boot-matrix-col text-[#1a4a1a] text-[11px] font-mono leading-[14px] opacity-30"
          style={{
            left: `${col * 8.5}%`,
            animationDelay: `${col * 180}ms`,
            animationDuration: `${1600 + col * 120}ms`,
          }}
        >
          {Array.from({ length: 22 }).map((_, row) => (
            <div
              key={row}
              style={{ opacity: 1 - row * 0.045 }}
            >
              {MATRIX_CHARS[Math.floor((col * 7 + row * 3) % MATRIX_CHARS.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 2500),
      setTimeout(() => setStep(4), 3800),
      setTimeout(() => setStep(5), 5800),
      setTimeout(() => onComplete(), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    if (step < 4 || step >= 5) return;
    const iv = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(iv);
  }, [step]);

  return (
    <div
      className="w-full h-full bg-[#0a1a0a] relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={onComplete}
    >
      {/* Matrix rain background */}
      {step >= 1 && <MatrixRain />}

      {/* Scanlines + pixel grid on top */}
      <div className="absolute inset-0 z-20 lcd-scanlines pointer-events-none opacity-50" />
      <div className="absolute inset-0 z-10 lcd-pixel-grid pointer-events-none" />

      {/* Main content */}
      <div
        className={`relative z-30 flex flex-col items-center font-mono transition-opacity duration-700 ${
          step >= 5 ? "opacity-0" : ""
        }`}
      >
        {/* AI chip icon */}
        {step >= 2 && (
          <div className="boot-fade-up mb-[18px]">
            <div className="relative w-[48px] h-[48px] flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-[10px] border border-[#2a6a2a] boot-ring-pulse" />
              {/* Inner ring */}
              <div className="absolute inset-[6px] rounded-[6px] border border-[#1a4a1a]" />
              {/* Center dot */}
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#2a6a2a] boot-center-blink" />
              {/* Corner pins */}
              {[
                "top-[-3px] left-[8px]", "top-[-3px] left-[18px]", "top-[-3px] left-[28px]",
                "bottom-[-3px] left-[8px]", "bottom-[-3px] left-[18px]", "bottom-[-3px] left-[28px]",
                "left-[-3px] top-[8px]", "left-[-3px] top-[18px]", "left-[-3px] top-[28px]",
                "right-[-3px] top-[8px]", "right-[-3px] top-[18px]", "right-[-3px] top-[28px]",
              ].map((pos, i) => (
                <div key={i} className={`absolute w-[3px] h-[6px] bg-[#1a4a1a] rounded-[1px] ${pos} ${i >= 6 ? "w-[6px] h-[3px]" : ""}`} />
              ))}
            </div>
          </div>
        )}

        {/* NOKIA AI heading */}
        {step >= 2 && (
          <div className="flex items-baseline gap-[6px] boot-fade-up" style={{ animationDelay: "100ms" }}>
            <span className="text-[32px] font-bold tracking-[5px] text-[#4a8a4a]">NOKIA</span>
            <span className="text-[14px] font-bold tracking-[3px] text-[#2a6a2a] border border-[#2a6a2a] px-[5px] py-[1px] rounded-[3px]">
              A·I
            </span>
          </div>
        )}

        {/* Tagline */}
        {step >= 3 && (
          <div className="mt-[10px] text-[12px] tracking-[3px] text-[#2a5a2a] boot-fade-up opacity-0">
            Intelligence. Connected.
          </div>
        )}

        {/* System init lines */}
        {step >= 4 && (
          <div className="mt-[24px] flex flex-col gap-[4px] w-[200px] boot-fade-up opacity-0">
            {["Neural engine OK", "Memory 8GB OK", "AI model loaded"].map((line, i) => (
              <div
                key={i}
                className="flex justify-between text-[10px] text-[#1a4a1a] boot-line-in opacity-0"
                style={{ animationDelay: `${i * 300}ms` }}
              >
                <span>{line}</span>
                <span className="text-[#2a6a2a]">✓</span>
              </div>
            ))}
            <div className="mt-[8px] text-[10px] text-[#2a5a2a]">
              {`Starting${".".repeat(dots + 1)}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
