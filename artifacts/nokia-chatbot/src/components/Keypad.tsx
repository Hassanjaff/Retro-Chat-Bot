import { motion } from "framer-motion";

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSend: () => void;
}

export default function Keypad({ onKeyPress, onClear, onSend }: KeypadProps) {
  const keys = [
    { id: "1", label: "1", sub: ".,!?" },
    { id: "2", label: "2", sub: "abc" },
    { id: "3", label: "3", sub: "def" },
    { id: "4", label: "4", sub: "ghi" },
    { id: "5", label: "5", sub: "jkl" },
    { id: "6", label: "6", sub: "mno" },
    { id: "7", label: "7", sub: "pqrs" },
    { id: "8", label: "8", sub: "tuv" },
    { id: "9", label: "9", sub: "wxyz" },
    { id: "*", label: "*", sub: "+" },
    { id: "0", label: "0", sub: "␣" },
    { id: "#", label: "#", sub: "Aa1" },
  ];

  return (
    <div className="w-full mt-4 flex flex-col items-center gap-4">
      {/* Control cluster */}
      <div className="flex justify-between items-center w-full px-4 mb-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-16 h-8 nokia-button rounded-[20px] text-gray-300 text-xs font-bold"
          onClick={() => {}}
        >
          -
        </motion.button>

        {/* D-Pad Center */}
        <div className="w-20 h-16 relative">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-lg nokia-dpad flex items-center justify-center font-bold text-gray-800 border-2 border-gray-400"
            onClick={onSend}
          >
            OK
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-16 h-8 nokia-button rounded-[20px] text-gray-300 text-xs font-bold"
          onClick={onClear}
        >
          -
        </motion.button>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-3 w-full px-6">
        {keys.map((k) => (
          <motion.button
            key={k.id}
            whileTap={{ scale: 0.95, y: 2 }}
            className="nokia-button h-10 rounded-[15px] flex flex-col items-center justify-center"
            onClick={() => onKeyPress(k.id)}
          >
            <span className="text-gray-100 font-bold text-lg leading-none mt-1">{k.label}</span>
            <span className="text-gray-400 text-[9px] leading-none mb-1 font-sans tracking-widest uppercase">{k.sub}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
