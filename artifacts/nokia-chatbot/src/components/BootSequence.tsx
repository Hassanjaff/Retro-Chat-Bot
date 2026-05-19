import { useState, useEffect } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => setStep(4), 3400),
      setTimeout(() => setStep(5), 5200),
      setTimeout(() => onComplete(), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="w-full h-full bg-[#8bac0f] relative flex flex-col items-center justify-center cursor-pointer"
      onClick={onComplete}
    >
      <div className="absolute inset-0 z-20 lcd-scanlines pointer-events-none" />
      <div className="absolute inset-0 z-10 lcd-pixel-grid pointer-events-none" />

      <div
        className={`relative z-30 flex flex-col items-center text-[#1a4a1a] font-mono transition-opacity duration-700 ${
          step >= 5 ? "opacity-0" : ""
        }`}
      >
        {/* NOKIA logo */}
        <div className={`flex gap-[3px] text-[40px] font-bold tracking-[8px] ${step >= 2 ? "" : "invisible"}`}>
          {"NOKIA".split("").map((letter, i) => (
            <span
              key={i}
              className="boot-letter-pop"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Connecting People */}
        <div className={`text-[16px] tracking-[4px] mt-[16px] boot-tagline-fade ${step >= 3 ? "" : "invisible"}`}>
          Connecting People
        </div>

        {/* Signal + Battery */}
        <div className={`flex items-center gap-[24px] mt-[32px] ${step >= 4 ? "" : "invisible"}`}>
          <div className="flex items-end gap-[3px] h-[18px]">
            {[4, 8, 12, 16].map((h, i) => (
              <div
                key={i}
                className="w-[4px] bg-[#1a4a1a] boot-bar-rise"
                style={{ height: `${h}px`, animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-[4px] text-[12px]">
            <span>Batt</span>
            <div className="w-[20px] h-[9px] border border-[#1a4a1a] relative overflow-hidden">
              <div className="absolute top-[1px] left-[1px] bottom-[1px] bg-[#1a4a1a] boot-batt-fill" />
            </div>
            <span>OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
