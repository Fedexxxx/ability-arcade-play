import confetti from "canvas-confetti";
import { getSoundEnabled, prefersReducedMotion } from "@/lib/prefs";

/**
 * Fires a celebratory confetti burst from the bottom-center,
 * with two side cannons for a richer effect.
 * Respects prefers-reduced-motion (skips when reduced).
 */
export const fireConfetti = () => {
  if (prefersReducedMotion()) return;
  const defaults = {
    spread: 70,
    ticks: 80,
    gravity: 0.9,
    decay: 0.94,
    startVelocity: 35,
    colors: ["#a78bfa", "#22d3ee", "#facc15", "#34d399", "#f472b6"],
  };

  // Center burst
  confetti({
    ...defaults,
    particleCount: 80,
    origin: { x: 0.5, y: 0.7 },
    scalar: 1,
  });

  // Side cannons (slight delay)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 40,
      angle: 60,
      origin: { x: 0, y: 0.8 },
    });
    confetti({
      ...defaults,
      particleCount: 40,
      angle: 120,
      origin: { x: 1, y: 0.8 },
    });
  }, 180);
};

/**
 * A more intense, longer celebration for big milestones (e.g. completing a module).
 * Continuous side cannons + center bursts for ~2.5s.
 */
export const fireBigConfetti = () => {
  if (prefersReducedMotion()) return;
  const colors = ["#a78bfa", "#22d3ee", "#facc15", "#34d399", "#f472b6", "#fb923c"];
  const duration = 2500;
  const end = Date.now() + duration;

  // Initial big center burst
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
    colors,
    scalar: 1.1,
  });

  // Continuous side cannons
  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 65,
      startVelocity: 45,
      origin: { x: 0, y: 0.75 },
      colors,
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 65,
      startVelocity: 45,
      origin: { x: 1, y: 0.75 },
      colors,
    });
  }, 220);
};

/**
 * Plays a subtle two-note "success" chime using the Web Audio API.
 * No external assets required.
 */
let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
};

const playTone = (
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration = 0.18,
  gain = 0.08,
) => {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startAt);
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
};

export const playSuccessChime = () => {
  if (!getSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // C5 → E5 → G5 quick arpeggio
  playTone(ctx, 523.25, t, 0.16);
  playTone(ctx, 659.25, t + 0.09, 0.16);
  playTone(ctx, 783.99, t + 0.18, 0.22, 0.09);
};

/**
 * A bigger fanfare for module completion. Triumphant ascending arpeggio.
 */
export const playFanfare = () => {
  if (!getSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // C5 - E5 - G5 - C6 ascending, with a sustained final note
  playTone(ctx, 523.25, t + 0.0, 0.18, 0.09);
  playTone(ctx, 659.25, t + 0.12, 0.18, 0.09);
  playTone(ctx, 783.99, t + 0.24, 0.18, 0.09);
  playTone(ctx, 1046.5, t + 0.36, 0.5, 0.1);
  // Harmonic on top
  playTone(ctx, 1318.51, t + 0.4, 0.45, 0.06);
};

export const celebrate = () => {
  fireConfetti();
  playSuccessChime();
};

export const celebrateBig = () => {
  fireBigConfetti();
  playFanfare();
};

/**
 * EPIC celebration for completing an entire superpower.
 * Gold-themed, longer (4s), with a final golden burst.
 */
export const fireEpicConfetti = () => {
  if (prefersReducedMotion()) return;
  const gold = ["#fde047", "#facc15", "#eab308", "#fbbf24", "#fcd34d", "#fff7c2"];
  const accent = ["#a78bfa", "#22d3ee", "#f472b6"];
  const all = [...gold, ...accent];
  const duration = 4000;
  const end = Date.now() + duration;

  // Massive opening burst
  confetti({
    particleCount: 240,
    spread: 130,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.5 },
    colors: all,
    scalar: 1.3,
    ticks: 200,
  });

  // Continuous side cannons + occasional star bursts
  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 75,
      startVelocity: 55,
      origin: { x: 0, y: 0.7 },
      colors: gold,
      scalar: 1.1,
    });
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 75,
      startVelocity: 55,
      origin: { x: 1, y: 0.7 },
      colors: gold,
      scalar: 1.1,
    });
    // Sparkle stars from top
    confetti({
      particleCount: 12,
      angle: 270,
      spread: 180,
      startVelocity: 25,
      gravity: 0.6,
      origin: { x: Math.random(), y: 0 },
      colors: all,
      shapes: ["star"],
      scalar: 1.2,
    });
  }, 280);
};

/**
 * An epic, grander fanfare for full superpower mastery.
 */
export const playEpicFanfare = () => {
  if (!getSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // Triumphant ascending: C5 - G5 - C6 - E6 - G6, sustained
  playTone(ctx, 523.25, t + 0.0, 0.2, 0.09);
  playTone(ctx, 783.99, t + 0.14, 0.2, 0.09);
  playTone(ctx, 1046.5, t + 0.28, 0.2, 0.1);
  playTone(ctx, 1318.51, t + 0.42, 0.25, 0.09);
  playTone(ctx, 1567.98, t + 0.6, 0.7, 0.1);
  // Bass octave for richness
  playTone(ctx, 261.63, t + 0.0, 0.9, 0.07);
  playTone(ctx, 392.0, t + 0.3, 0.7, 0.07);
  // Sparkle harmonic
  playTone(ctx, 2093.0, t + 0.65, 0.6, 0.05);
};

export const celebrateEpic = () => {
  fireEpicConfetti();
  playEpicFanfare();
};
