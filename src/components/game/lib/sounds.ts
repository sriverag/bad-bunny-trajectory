export type SoundType =
  | "correct"
  | "wrong"
  | "streak3"
  | "streak5"
  | "streak10"
  | "timerTick"
  | "gameOver"
  | "select";

const MUTE_KEY = "bb-sfx-muted";

let audioCtx: AudioContext | null = null;
let muted = false;

// Load persisted mute state
if (typeof window !== "undefined") {
  muted = localStorage.getItem(MUTE_KEY) === "true";
}

export function initSounds(): void {
  if (audioCtx) return;
  audioCtx = new AudioContext();
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  if (typeof window !== "undefined") {
    localStorage.setItem(MUTE_KEY, String(muted));
  }
  return muted;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Note frequencies
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const E6 = 1318.51;

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  gain: number = 0.15,
): void {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playArpeggio(
  ctx: AudioContext,
  notes: number[],
  noteDuration: number,
  gain: number = 0.15,
): void {
  const now = ctx.currentTime;
  for (let i = 0; i < notes.length; i++) {
    playTone(ctx, notes[i], now + i * noteDuration, noteDuration * 1.2, "sine", gain);
  }
}

export function playSound(type: SoundType): void {
  if (muted || prefersReducedMotion()) return;
  if (!audioCtx) initSounds();
  if (!audioCtx) return;

  // Resume context if suspended (browser autoplay policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const ctx = audioCtx;
  const now = ctx.currentTime;

  switch (type) {
    case "correct":
      playTone(ctx, C5, now, 0.15);
      playTone(ctx, E5, now + 0.15, 0.15);
      break;

    case "wrong": {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 150;
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }

    case "select":
      playTone(ctx, 1000, now, 0.05, "sine", 0.12);
      break;

    case "streak3":
      playArpeggio(ctx, [C5, E5, G5], 0.1, 0.18);
      break;

    case "streak5":
      playArpeggio(ctx, [C5, E5, G5, C6], 0.08, 0.2);
      break;

    case "streak10":
      playArpeggio(ctx, [C5, E5, G5, C6, E6], 0.08, 0.25);
      break;

    case "timerTick":
      playTone(ctx, 800, now, 0.03, "square", 0.1);
      break;

    case "gameOver":
      // Descending then ascending
      playTone(ctx, G5, now, 0.12, "sine", 0.18);
      playTone(ctx, E5, now + 0.12, 0.12, "sine", 0.18);
      playTone(ctx, C5, now + 0.24, 0.18, "sine", 0.18);
      playTone(ctx, E5, now + 0.5, 0.12, "sine", 0.18);
      playTone(ctx, G5, now + 0.62, 0.12, "sine", 0.18);
      playTone(ctx, C6, now + 0.74, 0.25, "sine", 0.2);
      break;
  }
}
