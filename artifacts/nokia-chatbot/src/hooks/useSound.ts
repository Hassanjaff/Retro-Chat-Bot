import { useCallback } from "react";

function noteToFreq(note: string): number {
  const notes: Record<string, number> = {
    "E5": 659.25, "D5": 587.33, "C#5": 554.37, "B4": 493.88,
    "A4": 440.00, "G#4": 415.30, "F#4": 369.99, "E4": 329.63,
    "D4": 293.66, "C#4": 277.18, "B3": 246.94, "A3": 220.00,
  };
  return notes[note] ?? 440;
}

export function playNokiaRingtone() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Classic Nokia Gran Vals — simplified 4-bar melody
    const BPM = 185;
    const Q  = 60 / BPM;       // quarter note
    const E  = Q / 2;           // eighth note
    const S  = Q / 4;           // sixteenth note

    const melody: [string, number][] = [
      ["E5", E], ["D5", E],
      ["F#4", Q], ["G#4", Q],
      ["C#5", E], ["B4", E],
      ["D4", Q],  ["E4", Q],
      ["B4", E],  ["A4", E],
      ["C#4", Q], ["E4", Q],
      ["A4", Q + Q + Q + Q],  // held note at end
    ];

    let t = audioCtx.currentTime + 0.05;

    for (const [note, dur] of melody) {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(noteToFreq(note), t);

      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, t + 0.01);
      env.gain.setValueAtTime(1, t + dur - 0.04);
      env.gain.linearRampToValueAtTime(0, t + dur);

      osc.connect(env);
      env.connect(masterGain);

      osc.start(t);
      osc.stop(t + dur);

      t += dur + S * 0.1; // tiny gap between notes
    }
  } catch (_e) {
    // Ignore audio errors (autoplay policy etc.)
  }
}

export function useSound() {
  const playClick = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (_e) { }
  }, []);

  const playSent = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (_e) { }
  }, []);

  const playReceived = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (_e) { }
  }, []);

  return { playClick, playSent, playReceived };
}
