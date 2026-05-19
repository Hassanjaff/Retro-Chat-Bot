import { useState, useRef, useCallback, useEffect } from "react";
import { useSound } from "./useSound";

type T9Mode = "Abc" | "abc" | "ABC" | "123";

const T9_MAP: Record<string, string[]> = {
  "1": [".", ",", "!", "?", "1"],
  "2": ["a", "b", "c", "2"],
  "3": ["d", "e", "f", "3"],
  "4": ["g", "h", "i", "4"],
  "5": ["j", "k", "l", "5"],
  "6": ["m", "n", "o", "6"],
  "7": ["p", "q", "r", "s", "7"],
  "8": ["t", "u", "v", "8"],
  "9": ["w", "x", "y", "z", "9"],
  "0": [" ", "0"],
};

export function useT9() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<T9Mode>("Abc");
  const [composingChar, setComposingChar] = useState<string | null>(null);
  const { playClick } = useSound();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastKeyRef = useRef<string | null>(null);
  const cycleIndexRef = useRef<number>(0);

  const confirmCurrentChar = useCallback(() => {
    if (composingChar !== null) {
      setText((prev) => prev + composingChar);
      setComposingChar(null);
    }
    lastKeyRef.current = null;
    cycleIndexRef.current = 0;
  }, [composingChar]);

  const handleKeyPress = useCallback(
    (key: string) => {
      playClick();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (key === "#") {
        confirmCurrentChar();
        setMode((prev) => {
          if (prev === "Abc") return "abc";
          if (prev === "abc") return "ABC";
          if (prev === "ABC") return "123";
          return "Abc";
        });
        return;
      }

      if (key === "*") {
        confirmCurrentChar();
        setText((prev) => prev + "*");
        return;
      }

      if (mode === "123") {
        confirmCurrentChar();
        setText((prev) => prev + key);
        return;
      }

      const chars = T9_MAP[key];
      if (!chars) return;

      if (key === lastKeyRef.current) {
        cycleIndexRef.current = (cycleIndexRef.current + 1) % chars.length;
      } else {
        confirmCurrentChar();
        lastKeyRef.current = key;
        cycleIndexRef.current = 0;
      }

      let char = chars[cycleIndexRef.current];
      
      if (mode === "ABC") {
        char = char.toUpperCase();
      } else if (mode === "Abc") {
        if (text.length === 0 || text.endsWith(". ") || text.endsWith("! ") || text.endsWith("? ")) {
            char = char.toUpperCase();
        } else {
            char = char.toLowerCase();
        }
      }

      setComposingChar(char);

      timerRef.current = setTimeout(() => {
        confirmCurrentChar();
      }, 1000);
    },
    [mode, playClick, confirmCurrentChar, text]
  );

  const handleBackspace = useCallback(() => {
    playClick();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (composingChar !== null) {
      setComposingChar(null);
      lastKeyRef.current = null;
      cycleIndexRef.current = 0;
    } else {
      setText((prev) => prev.slice(0, -1));
    }
  }, [composingChar, playClick]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setText("");
    setComposingChar(null);
    lastKeyRef.current = null;
    cycleIndexRef.current = 0;
  }, []);

  return {
    text,
    setText,
    mode,
    composingChar,
    handleKeyPress,
    handleBackspace,
    clear,
    confirmCurrentChar
  };
}
