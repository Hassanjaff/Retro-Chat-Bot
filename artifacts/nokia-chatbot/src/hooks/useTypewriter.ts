import { useState, useEffect, useRef, useCallback } from "react";

interface TypewriterState {
  displayText: string;
  isTyping: boolean;
  isDone: boolean;
  fullText: string;
}

export function useTypewriter(delay = 40) {
  const [state, setState] = useState<TypewriterState>({
    displayText: "",
    isTyping: false,
    isDone: true,
    fullText: "",
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fullTextRef = useRef("");
  const indexRef = useRef(0);

  const startTyping = useCallback(
    (text: string) => {
      // clear any previous
      if (intervalRef.current) clearInterval(intervalRef.current);

      fullTextRef.current = text;
      indexRef.current = 0;

      setState({
        displayText: "",
        isTyping: true,
        isDone: false,
        fullText: text,
      });

      intervalRef.current = setInterval(() => {
        const idx = indexRef.current;
        if (idx >= fullTextRef.current.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setState((prev) => ({
            ...prev,
            isTyping: false,
            isDone: true,
          }));
          return;
        }

        indexRef.current = idx + 1;
        setState((prev) => ({
          ...prev,
          displayText: fullTextRef.current.slice(0, indexRef.current),
        }));
      }, delay);
    },
    [delay]
  );

  const stopTyping = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState((prev) => ({
      ...prev,
      displayText: prev.fullText,
      isTyping: false,
      isDone: true,
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { ...state, startTyping, stopTyping };
}
