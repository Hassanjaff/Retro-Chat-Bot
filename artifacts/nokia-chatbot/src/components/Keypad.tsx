import { useSound } from "@/hooks/useSound";

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSend: () => void;
}

const KEYS = [
  { id: "1", label: "1", sub: ".!1" },
  { id: "2", label: "2", sub: "abc" },
  { id: "3", label: "3", sub: "def" },
  { id: "4", label: "4", sub: "ghi" },
  { id: "5", label: "5", sub: "jkl" },
  { id: "6", label: "6", sub: "mno" },
  { id: "7", label: "7", sub: "pqrs" },
  { id: "8", label: "8", sub: "tuv" },
  { id: "9", label: "9", sub: "wxyz" },
  { id: "*", label: "*", sub: "+" },
  { id: "0", label: "0", sub: "_" },
  { id: "#", label: "#", sub: "Aa1" },
];

export default function Keypad({ onKeyPress, onClear, onSend }: KeypadProps) {
  const { playClick } = useSound();

  const press = (key: string, handler: (key: string) => void) => {
    playClick();
    handler(key);
  };

  return (
    <div className="grid grid-cols-3 gap-x-[10px] gap-y-[6px] w-full h-full">
      {KEYS.map((k) => (
        <button
          key={k.id}
          className="nokia-key relative flex flex-col items-center justify-center rounded-[10px] transition-transform duration-75"
          onClick={() => press(k.id, onKeyPress)}
        >
          <span className="text-[#e0e0e0] font-bold text-[16px] leading-none mt-[2px]">
            {k.label}
          </span>
          <span className="text-[#999] text-[8px] leading-none mb-[2px] tracking-[1px] uppercase">
            {k.sub}
          </span>
        </button>
      ))}
    </div>
  );
}
