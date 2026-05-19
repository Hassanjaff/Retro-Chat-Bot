import { useState, useRef, useCallback } from "react";
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

const TIMEOUT_MS = 800;

export function useT9() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<T9Mode>("Abc");
  const [composingChar, setComposingChar] = useState<string | null>(null);

  const { playClick } = useSound();

  // All mutable state lives in a single ref — no stale closures ever
  const stateRef = useRef({
    text: "",
    mode: "Abc" as T9Mode,
    composingChar: null as string | null,
    lastKey: null as string | null,
    cycleIndex: 0,
    timer: null as ReturnType<typeof setTimeout> | null,
  });

  // Keep ref in sync with state (for callbacks that fire asynchronously)
  stateRef.current.text = text;
  stateRef.current.mode = mode;
  stateRef.current.composingChar = composingChar;

  const flush = useCallback(() => {
    const s = stateRef.current;
    if (s.composingChar !== null) {
      const nextText = s.text + s.composingChar;
      s.text = nextText;
      setText(nextText);
      s.composingChar = null;
      setComposingChar(null);
    }
    s.lastKey = null;
    s.cycleIndex = 0;
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      playClick();
      const s = stateRef.current;

      // Cancel any pending timeout
      if (s.timer) {
        clearTimeout(s.timer);
        s.timer = null;
      }

      if (key === "#") {
        flush();
        const nextMode: T9Mode =
          s.mode === "Abc" ? "abc" : s.mode === "abc" ? "ABC" : s.mode === "ABC" ? "123" : "Abc";
        s.mode = nextMode;
        setMode(nextMode);
        return;
      }

      if (key === "*") {
        flush();
        const nextText = s.text + "*";
        s.text = nextText;
        setText(nextText);
        return;
      }

      if (s.mode === "123") {
        flush();
        const nextText = s.text + key;
        s.text = nextText;
        setText(nextText);
        return;
      }

      const chars = T9_MAP[key];
      if (!chars) return;

      if (key === s.lastKey) {
        // Same key pressed rapidly — cycle to next character
        s.cycleIndex = (s.cycleIndex + 1) % chars.length;
      } else {
        // Different key — finalize previous character, start new one
        flush();
        s.lastKey = key;
        s.cycleIndex = 0;
      }

      let char = chars[s.cycleIndex];

      if (s.mode === "ABC") {
        char = char.toUpperCase();
      } else if (s.mode === "Abc") {
        const t = s.text;
        if (t.length === 0 || t.endsWith(". ") || t.endsWith("! ") || t.endsWith("? ")) {
          char = char.toUpperCase();
        }
      }

      s.composingChar = char;
      setComposingChar(char);

      // Start timeout to auto-confirm this character
      s.timer = setTimeout(() => {
        flush();
      }, TIMEOUT_MS);
    },
    [flush, playClick]
  );

  const handleBackspace = useCallback(() => {
    playClick();
    const s = stateRef.current;

    if (s.timer) {
      clearTimeout(s.timer);
      s.timer = null;
    }

    if (s.composingChar !== null) {
      // Delete the currently composing character
      s.composingChar = null;
      setComposingChar(null);
      s.lastKey = null;
      s.cycleIndex = 0;
    } else {
      // Delete last confirmed character
      const nextText = s.text.slice(0, -1);
      s.text = nextText;
      setText(nextText);
    }
  }, [playClick]);

  const clear = useCallback(() => {
    const s = stateRef.current;
    if (s.timer) {
      clearTimeout(s.timer);
      s.timer = null;
    }
    s.text = "";
    s.composingChar = null;
    s.lastKey = null;
    s.cycleIndex = 0;
    setText("");
    setComposingChar(null);
  }, []);

  return {
    text,
    setText,
    mode,
    composingChar,
    handleKeyPress,
    handleBackspace,
    clear,
    confirmCurrentChar: flush,
  };
}
