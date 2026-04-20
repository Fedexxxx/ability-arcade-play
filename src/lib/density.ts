// Age-based UI density tokens. Drives touch target sizes, text scale,
// subtext visibility, and section spacing across the app.
// Mapped from explorer age band but kept as its own concept so screens
// can read a single, predictable shape.

import type { AgeBand } from "@/lib/explorer";

export type DensityScale = "lg" | "md" | "sm";

export interface DensityTokens {
  scale: DensityScale;
  /** Show secondary descriptive text (subtitles, hints). */
  showSubtext: boolean;
  /** Tailwind class for body copy size. */
  textBase: string;
  /** Tailwind class for section/heading display size. */
  textDisplay: string;
  /** Tailwind class for tiny labels (uppercase eyebrow). */
  textTiny: string;
  /** Vertical spacing between primary sections. */
  sectionGap: string;
  /** Pixel size for primary tap-target icons (lucide `size` prop). */
  iconLg: number;
  /** Pixel size for inline icons. */
  iconSm: number;
  /** Tailwind class for square tap target (avatars, nav buttons). */
  tapTarget: string;
  /** Tailwind class for primary CTA vertical padding. */
  ctaPadY: string;
  /** Tailwind class for card inner padding. */
  cardPad: string;
}

const TOKENS: Record<DensityScale, DensityTokens> = {
  lg: {
    scale: "lg",
    showSubtext: false,
    textBase: "text-lg",
    textDisplay: "text-3xl",
    textTiny: "text-xs",
    sectionGap: "mt-8",
    iconLg: 28,
    iconSm: 18,
    tapTarget: "w-14 h-14",
    ctaPadY: "py-5",
    cardPad: "p-5",
  },
  md: {
    scale: "md",
    showSubtext: true,
    textBase: "text-base",
    textDisplay: "text-2xl",
    textTiny: "text-[11px]",
    sectionGap: "mt-6",
    iconLg: 22,
    iconSm: 16,
    tapTarget: "w-11 h-11",
    ctaPadY: "py-4",
    cardPad: "p-4",
  },
  sm: {
    scale: "sm",
    showSubtext: true,
    textBase: "text-sm",
    textDisplay: "text-xl",
    textTiny: "text-[10px]",
    sectionGap: "mt-5",
    iconLg: 20,
    iconSm: 14,
    tapTarget: "w-10 h-10",
    ctaPadY: "py-3.5",
    cardPad: "p-3.5",
  },
};

export const densityForBand = (band: AgeBand | undefined | null): DensityTokens => {
  switch (band) {
    case "4-6":
      return TOKENS.lg;
    case "9-10":
      return TOKENS.sm;
    case "7-8":
    default:
      return TOKENS.md;
  }
};

export const DEFAULT_DENSITY = TOKENS.md;
