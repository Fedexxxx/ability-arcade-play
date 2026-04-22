import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SKIN_PALETTE,
  type ExplorerStyle,
  type EyeShape,
  type EyebrowStyle,
  type HairStyle,
  type AccHat,
  type AccScarf,
  type AccBackpack,
} from "@/lib/explorerStyle";
import type { CosmeticSlot } from "@/lib/wallet";

interface Props {
  style: ExplorerStyle;
  /** Equipped shop cosmetics by slot — pass wallet.equipped. Wins over customize-tab accessories. */
  gear?: Partial<Record<CosmeticSlot, string | undefined>>;
  /** Crop variant: 'full' shows full body, 'bust' crops to head+shoulders. */
  variant?: "full" | "bust";
  /** Enable idle animation (breathing + blinking). Defaults to true. */
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
}

/* ------------------------------------------------------------------ */
/*  Color helpers — derive shade/highlight from a base hex            */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}
function rgbToHex(r: number, g: number, b: number) {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function shade(hex: string, amount: number) {
  // amount: -1 (black) .. +1 (white)
  const { r, g, b } = hexToRgb(hex);
  if (amount >= 0) {
    return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
  }
  const t = 1 + amount;
  return rgbToHex(r * t, g * t, b * t);
}

/* ------------------------------------------------------------------ */
/*  Shop gear renderers                                                */
/* ------------------------------------------------------------------ */

const HAT_RENDERERS: Record<string, () => JSX.Element> = {
  "hat-cap-base": () => (
    <g>
      <path d="M30 38 q20 -22 40 0 v4 H30 z" fill="#3B7CD9" />
      <path d="M28 42 h44 v3 H28 z" fill="#1F4E9C" />
      <path d="M70 42 q14 0 18 6 q-2 4 -10 4 H70 z" fill="#1F4E9C" />
      <circle cx="50" cy="32" r="2" fill="#FFD96B" />
    </g>
  ),
  "hat-helmet-climb": () => (
    <g>
      <path d="M28 44 q22 -28 44 0 v4 H28 z" fill="#E03B3B" />
      <path d="M48 22 h4 v22 h-4 z" fill="#FFFFFF" />
      <path d="M40 30 h20 v4 H40 z" fill="#FFFFFF" />
      <path d="M28 44 h44 v4 H28 z" fill="#1F1A18" />
    </g>
  ),
  "hat-crown-summit": () => (
    <g>
      <path d="M30 42 L36 26 L44 38 L50 22 L56 38 L64 26 L70 42 z" fill="#F5C946" stroke="#A87A14" strokeWidth="1.5" />
      <circle cx="36" cy="26" r="2.5" fill="#E03B3B" />
      <circle cx="50" cy="22" r="3" fill="#3B7CD9" />
      <circle cx="64" cy="26" r="2.5" fill="#2EA86F" />
      <rect x="30" y="42" width="40" height="3" fill="#A87A14" />
    </g>
  ),
};

const SCARF_RENDERERS: Record<string, () => JSX.Element> = {
  "scarf-wool": () => (
    <g>
      <path d="M32 96 q18 -10 36 0 v6 q-18 10 -36 0 z" fill="#B23A48" />
      <path d="M32 102 l-4 14 l8 -2 l4 -10 z" fill="#8E2B38" />
      <path d="M68 102 l4 14 l-8 -2 l-4 -10 z" fill="#8E2B38" />
    </g>
  ),
  "scarf-aurora": () => (
    <g>
      <defs>
        <linearGradient id="aurora-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#7A4FD1" />
          <stop offset="0.5" stopColor="#3FB59A" />
          <stop offset="1" stopColor="#E5C04A" />
        </linearGradient>
      </defs>
      <path d="M32 96 q18 -10 36 0 v6 q-18 10 -36 0 z" fill="url(#aurora-grad)" />
      <path d="M32 102 l-4 14 l8 -2 l4 -10 z" fill="#7A4FD1" />
      <path d="M68 102 l4 14 l-8 -2 l-4 -10 z" fill="#E5C04A" />
    </g>
  ),
};

const BACKPACK_RENDERERS: Record<string, () => JSX.Element> = {
  "bp-day": () => (
    <g>
      <rect x="14" y="100" width="14" height="32" rx="5" fill="#2EA86F" />
      <rect x="16" y="108" width="10" height="8" rx="2" fill="#1E7C50" />
      <path d="M22 100 q4 -6 10 -2" stroke="#1E7C50" strokeWidth="2" fill="none" />
    </g>
  ),
  "bp-expedition": () => (
    <g>
      <rect x="12" y="96" width="16" height="40" rx="6" fill="#7A4FD1" />
      <rect x="14" y="104" width="12" height="10" rx="2" fill="#5C36A8" />
      <rect x="14" y="118" width="12" height="8" rx="2" fill="#5C36A8" />
      <path d="M20 96 l-4 -8 l4 -2 l4 2 z" fill="#3FB59A" />
    </g>
  ),
};

const BOOTS_RENDERERS: Record<string, (props: { defaultColor: string }) => JSX.Element> = {
  "boots-trail": ({ defaultColor }) => (
    <g>
      <path d="M34 168 h14 l4 8 h-20 z" fill={defaultColor} />
      <path d="M54 166 h14 l4 10 h-20 z" fill={defaultColor} />
      <rect x="30" y="174" width="22" height="4" rx="1" fill="#1F1A18" />
      <rect x="50" y="174" width="22" height="4" rx="1" fill="#1F1A18" />
    </g>
  ),
  "boots-snow": () => (
    <g>
      <path d="M32 162 h16 l4 14 h-22 z" fill="#E8F2FA" stroke="#3B7CD9" strokeWidth="1.5" />
      <path d="M52 160 h16 l4 16 h-22 z" fill="#E8F2FA" stroke="#3B7CD9" strokeWidth="1.5" />
      <rect x="30" y="174" width="22" height="4" rx="1" fill="#1F2A44" />
      <rect x="50" y="174" width="22" height="4" rx="1" fill="#1F2A44" />
    </g>
  ),
};

const BADGE_RENDERERS: Record<string, () => JSX.Element> = {
  "badge-compass": () => (
    <g>
      <circle cx="74" cy="106" r="8" fill="#E5C04A" stroke="#A87A14" strokeWidth="1.5" />
      <path d="M74 100 l2 6 l-2 6 l-2 -6 z" fill="#B23A48" />
    </g>
  ),
  "badge-flag": () => (
    <g>
      <rect x="72" y="98" width="1.5" height="14" fill="#1F1A18" />
      <path d="M73 98 l8 3 l-8 3 z" fill="#E03B3B" />
    </g>
  ),
  "badge-summit": () => (
    <g>
      <path d="M70 112 l5 -10 l5 10 z" fill="#3B7CD9" />
      <path d="M73 106 l2 -2 l2 2 l-2 2 z" fill="#FFFFFF" />
    </g>
  ),
};

/* ------------------------------------------------------------------ */
/*  Customize-tab accessories                                          */
/* ------------------------------------------------------------------ */

function renderAccHat(kind: AccHat, color: string): JSX.Element | null {
  const dark = shade(color, -0.25);
  switch (kind) {
    case "none":
      return null;
    case "beanie":
      return (
        <g>
          <path d="M28 50 q4 -22 22 -22 q18 0 22 22 v4 H28 z" fill={color} />
          <path d="M28 50 q4 -22 22 -22 q18 0 22 22" fill="none" stroke={dark} strokeWidth="0.6" opacity="0.5" />
          <rect x="28" y="52" width="44" height="5" rx="2" fill={dark} opacity="0.5" />
          <circle cx="50" cy="26" r="3" fill={color} stroke={dark} strokeWidth="0.8" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M30 50 q4 -20 20 -20 q16 0 20 20 v3 H30 z" fill={color} />
          <path d="M28 52 h44 v3 H28 z" fill={dark} />
          <path d="M70 52 q14 1 18 6 q-2 4 -10 4 H70 z" fill={dark} />
        </g>
      );
    case "explorer-hat":
      return (
        <g>
          <ellipse cx="50" cy="52" rx="28" ry="5" fill={dark} opacity="0.55" />
          <ellipse cx="50" cy="50" rx="28" ry="5" fill={color} />
          <path d="M34 50 q4 -22 16 -22 q12 0 16 22 z" fill={color} />
          <rect x="34" y="46" width="32" height="3" fill={dark} opacity="0.5" />
        </g>
      );
  }
}

function renderAccScarf(kind: AccScarf, color: string): JSX.Element | null {
  if (kind === "none") return null;
  const dark = shade(color, -0.2);
  return (
    <g>
      <path d="M30 92 q20 -10 40 0 v8 q-20 10 -40 0 z" fill={color} />
      <path d="M30 100 l-4 14 l9 -2 l3 -10 z" fill={dark} />
      <path d="M70 100 l4 14 l-9 -2 l-3 -10 z" fill={dark} />
      <path d="M30 92 q20 -10 40 0" stroke={dark} strokeWidth="0.8" fill="none" opacity="0.6" />
    </g>
  );
}

function renderAccBackpack(kind: AccBackpack, color: string): JSX.Element | null {
  const dark = shade(color, -0.25);
  switch (kind) {
    case "none":
      return null;
    case "day":
      return (
        <g>
          <rect x="14" y="100" width="14" height="32" rx="6" fill={color} />
          <rect x="16" y="108" width="10" height="8" rx="2" fill={dark} />
          <path d="M22 100 q4 -6 10 -2" stroke={dark} strokeWidth="2" fill="none" />
        </g>
      );
    case "trek":
      return (
        <g>
          <rect x="12" y="96" width="16" height="40" rx="6" fill={color} />
          <rect x="14" y="104" width="12" height="10" rx="2" fill={dark} />
          <rect x="14" y="118" width="12" height="8" rx="2" fill={dark} />
          <path d="M20 96 l-4 -8 l4 -2 l4 2 z" fill={shade(color, 0.3)} />
        </g>
      );
  }
}

function renderGoggles(): JSX.Element {
  return (
    <g>
      <rect x="32" y="48" width="36" height="3" rx="1.5" fill="#3D3A36" />
      <circle cx="40" cy="50" r="6.5" fill="#1F2A44" stroke="#3D3A36" strokeWidth="1.5" />
      <circle cx="60" cy="50" r="6.5" fill="#1F2A44" stroke="#3D3A36" strokeWidth="1.5" />
      <circle cx="38" cy="48" r="1.5" fill="#FFFFFF" opacity="0.7" />
      <circle cx="58" cy="48" r="1.5" fill="#FFFFFF" opacity="0.7" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Hair                                                               */
/* ------------------------------------------------------------------ */

function renderHair(style: HairStyle, color: string): JSX.Element {
  const dark = shade(color, -0.3);
  const light = shade(color, 0.18);
  switch (style) {
    case "buzz":
      return (
        <g>
          <path d="M30 56 q20 -22 40 0 v6 q-20 -10 -40 0 z" fill={color} opacity="0.9" />
          <path d="M30 56 q20 -22 40 0" fill="none" stroke={light} strokeWidth="0.5" opacity="0.6" />
        </g>
      );
    case "short":
      return (
        <g>
          <path
            d="M28 60 q4 -28 22 -28 q18 0 22 28 q-4 -10 -22 -10 q-18 0 -22 10 z"
            fill={color}
          />
          <path
            d="M30 50 q4 -16 20 -16 q16 0 20 16"
            fill="none"
            stroke={light}
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>
      );
    case "medium":
      return (
        <g>
          <g fill={color}>
            <path d="M26 64 q2 -32 24 -32 q22 0 24 32 q-4 -8 -10 -6 q-4 -10 -14 -10 q-10 0 -14 10 q-6 -2 -10 6 z" />
            <path d="M26 64 q-2 8 0 18 l4 -2 q-2 -8 0 -16 z" />
            <path d="M74 64 q2 8 0 18 l-4 -2 q2 -8 0 -16 z" />
          </g>
          <path d="M28 50 q4 -16 22 -16 q18 0 22 16" fill="none" stroke={light} strokeWidth="0.8" opacity="0.5" />
        </g>
      );
    case "wavy":
      return (
        <g fill={color}>
          <path d="M28 62 q2 -30 22 -30 q20 0 22 30 q-6 -8 -12 -6 q-4 -10 -10 -10 q-6 0 -10 10 q-6 -2 -12 6 z" />
          <circle cx="32" cy="62" r="3" />
          <circle cx="68" cy="62" r="3" />
        </g>
      );
    case "curly":
      return (
        <g fill={color}>
          <circle cx="32" cy="44" r="7" />
          <circle cx="42" cy="36" r="8" />
          <circle cx="52" cy="34" r="8" />
          <circle cx="62" cy="36" r="8" />
          <circle cx="70" cy="46" r="7" />
          <circle cx="30" cy="56" r="6" />
          <circle cx="72" cy="56" r="6" />
          <path d="M30 58 q20 -8 40 0 q-2 -10 -20 -10 q-18 0 -20 10 z" />
          <circle cx="42" cy="36" r="2.5" fill={light} opacity="0.6" />
          <circle cx="62" cy="36" r="2.5" fill={light} opacity="0.6" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <path d="M28 60 q4 -28 22 -28 q18 0 22 28 q-4 -10 -22 -10 q-18 0 -22 10 z" />
          <circle cx="50" cy="32" r="8" />
          <circle cx="50" cy="32" r="5" fill={dark} opacity="0.4" />
        </g>
      );
    case "long":
      return (
        <g fill={color}>
          <path d="M26 64 q2 -32 24 -32 q22 0 24 32 l2 36 q-12 -6 -26 -6 q-14 0 -26 6 z" />
          <path d="M28 70 q2 14 0 28" fill="none" stroke={dark} strokeWidth="0.6" opacity="0.4" />
          <path d="M72 70 q-2 14 0 28" fill="none" stroke={dark} strokeWidth="0.6" opacity="0.4" />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Eyes / brows  — alive, expressive, with offset pupils + highlights */
/* ------------------------------------------------------------------ */

function renderEyes(shape: EyeShape, color: string, blink: boolean, gaze: number) {
  // gaze: -1..+1 horizontal pupil offset
  if (blink) {
    return (
      <g stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M38.5 65.5 q3.5 2.5 7 0" />
        <path d="M54.5 65.5 q3.5 2.5 7 0" />
      </g>
    );
  }
  const dx = gaze * 0.7;
  const dark = shade(color, -0.55);
  switch (shape) {
    case "round":
      return (
        <g>
          {/* sclera with subtle shading */}
          <ellipse cx="42" cy="65.4" rx="3.3" ry="3.4" fill="#FCFAF6" />
          <ellipse cx="58" cy="65.4" rx="3.3" ry="3.4" fill="#FCFAF6" />
          <ellipse cx="42" cy="66.6" rx="3.1" ry="1.5" fill="#E8DDD0" opacity="0.45" />
          <ellipse cx="58" cy="66.6" rx="3.1" ry="1.5" fill="#E8DDD0" opacity="0.45" />
          {/* iris */}
          <circle cx={42 + dx} cy={65.6} r="2.3" fill={color} />
          <circle cx={58 + dx} cy={65.6} r="2.3" fill={color} />
          {/* iris ring */}
          <circle cx={42 + dx} cy={65.6} r="2.3" fill="none" stroke={dark} strokeWidth="0.4" opacity="0.7" />
          <circle cx={58 + dx} cy={65.6} r="2.3" fill="none" stroke={dark} strokeWidth="0.4" opacity="0.7" />
          {/* pupil */}
          <circle cx={42 + dx} cy={65.8} r="1.1" fill="#1A0F08" />
          <circle cx={58 + dx} cy={65.8} r="1.1" fill="#1A0F08" />
          {/* highlight (life!) */}
          <circle cx={42.9 + dx} cy={64.7} r="0.9" fill="#FFFFFF" />
          <circle cx={58.9 + dx} cy={64.7} r="0.9" fill="#FFFFFF" />
          <circle cx={41.5 + dx} cy={66.4} r="0.35" fill="#FFFFFF" opacity="0.7" />
          <circle cx={57.5 + dx} cy={66.4} r="0.35" fill="#FFFFFF" opacity="0.7" />
          {/* upper eyelid soft shadow */}
          <path d="M38.7 63.2 q3.3 -1.6 6.6 0" stroke={shade(color, -0.4)} strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M54.7 63.2 q3.3 -1.6 6.6 0" stroke={shade(color, -0.4)} strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round" />
        </g>
      );
    case "almond":
      return (
        <g>
          <path d="M38 65.6 q4 -3.2 8 0 q-4 2.8 -8 0 z" fill="#FCFAF6" />
          <path d="M54 65.6 q4 -3.2 8 0 q-4 2.8 -8 0 z" fill="#FCFAF6" />
          <ellipse cx={42 + dx} cy={65.6} rx="1.7" ry="2.1" fill={color} />
          <ellipse cx={58 + dx} cy={65.6} rx="1.7" ry="2.1" fill={color} />
          <ellipse cx={42 + dx} cy={65.8} rx="0.8" ry="1.2" fill="#1A0F08" />
          <ellipse cx={58 + dx} cy={65.8} rx="0.8" ry="1.2" fill="#1A0F08" />
          <circle cx={42.7 + dx} cy={64.8} r="0.7" fill="#FFFFFF" />
          <circle cx={58.7 + dx} cy={64.8} r="0.7" fill="#FFFFFF" />
          {/* eyeliner */}
          <path d="M38 65.6 q4 -3.2 8 0" stroke="#2A1810" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          <path d="M54 65.6 q4 -3.2 8 0" stroke="#2A1810" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        </g>
      );
    case "soft":
      return (
        <g>
          <ellipse cx="42" cy="65.4" rx="2.8" ry="2.4" fill="#FCFAF6" />
          <ellipse cx="58" cy="65.4" rx="2.8" ry="2.4" fill="#FCFAF6" />
          <circle cx={42 + dx} cy={65.6} r="1.9" fill={color} />
          <circle cx={58 + dx} cy={65.6} r="1.9" fill={color} />
          <circle cx={42 + dx} cy={65.8} r="0.9" fill="#1A0F08" />
          <circle cx={58 + dx} cy={65.8} r="0.9" fill="#1A0F08" />
          <circle cx={42.7 + dx} cy={64.8} r="0.75" fill="#FFFFFF" />
          <circle cx={58.7 + dx} cy={64.8} r="0.75" fill="#FFFFFF" />
          {/* lower lid lift = soft smile in eyes */}
          <path d="M39.5 67 q2.5 1 5 0" stroke={shade(color, -0.4)} strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round" />
          <path d="M55.5 67 q2.5 1 5 0" stroke={shade(color, -0.4)} strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round" />
        </g>
      );
  }
}

function renderEyebrows(style: EyebrowStyle, color: string) {
  const stroke = shade(color, -0.15);
  switch (style) {
    case "soft":
      return (
        <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M38.5 58.5 q3.5 -1.8 7.5 -0.2" />
          <path d="M54 58.3 q4 -1.6 7.5 0.2" />
        </g>
      );
    case "thick":
      return (
        <g fill={stroke}>
          <path d="M38 57.5 q4 -2.5 8 -0.2 v2 q-4 -1.2 -8 0 z" />
          <path d="M54 57.3 q4 -2.3 8 0.2 v2 q-4 -1 -8 0.2 z" />
        </g>
      );
    case "arched":
      return (
        <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M38 59 q3 -3 8 -1" />
          <path d="M54 58 q5 -2 8 1" />
        </g>
      );
  }
}

function renderFreckles() {
  return (
    <g fill="#8E5A3C" opacity="0.55">
      <circle cx="40" cy="71" r="0.7" />
      <circle cx="43" cy="73" r="0.6" />
      <circle cx="57" cy="73" r="0.6" />
      <circle cx="60" cy="71" r="0.7" />
      <circle cx="48" cy="74" r="0.5" />
      <circle cx="52" cy="74" r="0.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ExplorerSvg = ({
  style,
  gear = {},
  variant = "full",
  animate = true,
  className,
  ariaLabel = "Explorador",
}: Props) => {
  const skin = SKIN_PALETTE[style.skin];
  const skinHi = shade(skin.base, 0.12);
  const jacketDark = shade(style.jacketColor, -0.22);
  const jacketHi = shade(style.jacketColor, 0.22);
  const pantsDark = shade(style.pantsColor, -0.2);

  // Wider viewBox to allow forward-leaning pose without clipping
  const viewBox = variant === "bust" ? "12 2 76 98" : "0 0 100 184";

  // Stable per-instance gradient ids (avoid collisions when many svgs render)
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  const gSkin = `g-skin-${uid}`;
  const gFace = `g-face-${uid}`;
  const gJacket = `g-jacket-${uid}`;
  const gPants = `g-pants-${uid}`;
  const gHair = `g-hair-${uid}`;
  const gShadow = `g-shadow-${uid}`;
  const gCheek = `g-cheek-${uid}`;

  const hair = useMemo(() => renderHair(style.hair, style.hairColor), [style.hair, style.hairColor]);
  const eyebrows = useMemo(() => renderEyebrows(style.eyebrow, style.hairColor), [style.eyebrow, style.hairColor]);

  // --- Idle: blink + subtle gaze drift ---
  const [blink, setBlink] = useState(false);
  const [gaze, setGaze] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let blinkTimer: number;
    const blinkLoop = () => {
      const next = 3500 + Math.random() * 2800;
      blinkTimer = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => {
          setBlink(false);
          // small chance of double-blink
          if (Math.random() < 0.18) {
            window.setTimeout(() => {
              setBlink(true);
              window.setTimeout(() => {
                setBlink(false);
                blinkLoop();
              }, 120);
            }, 160);
          } else {
            blinkLoop();
          }
        }, 130);
      }, next);
    };
    blinkLoop();

    let gazeTimer: number;
    const gazeLoop = () => {
      const next = 2200 + Math.random() * 2600;
      gazeTimer = window.setTimeout(() => {
        setGaze((Math.random() - 0.5) * 1.6);
        gazeLoop();
      }, next);
    };
    gazeLoop();

    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(gazeTimer);
    };
  }, [animate]);

  // React-on-change pulse key
  const reactKey = useMemo(
    () =>
      `${style.skin}|${style.hair}|${style.hairColor}|${style.jacketColor}|${style.pantsColor}|${style.bootsColor}|${style.eyeShape}|${style.eyeColor}|${style.eyebrow}|${style.freckles}|${style.accHat}|${style.accHatColor}|${style.accScarf}|${style.accScarfColor}|${style.accBackpack}|${style.accBackpackColor}|${style.accGoggles}`,
    [style],
  );

  // Shop gear wins; fall back to customize-tab accessories.
  const ShopHat = gear.hat ? HAT_RENDERERS[gear.hat] : null;
  const ShopScarf = gear.scarf ? SCARF_RENDERERS[gear.scarf] : null;
  const ShopBackpack = gear.backpack ? BACKPACK_RENDERERS[gear.backpack] : null;
  const ShopBoots = gear.boots ? BOOTS_RENDERERS[gear.boots] : null;
  const Badge = gear.badge ? BADGE_RENDERERS[gear.badge] : null;

  const customHat = !ShopHat ? renderAccHat(style.accHat, style.accHatColor) : null;
  const customScarf = !ShopScarf ? renderAccScarf(style.accScarf, style.accScarfColor) : null;
  const customBackpack = !ShopBackpack ? renderAccBackpack(style.accBackpack, style.accBackpackColor) : null;

  const Wrapper: any = animate ? motion.svg : "svg";
  const wrapperProps = animate
    ? {
        key: reactKey,
        initial: { scale: 0.985 },
        animate: { scale: [0.985, 1.025, 1] },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      role="img"
      aria-label={ariaLabel}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      {...wrapperProps}
    >
      <defs>
        <radialGradient id={gShadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(0,0,0,0.28)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        {/* Skin: top-left light → bottom-right warm shade */}
        <linearGradient id={gSkin} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={skinHi} />
          <stop offset="0.55" stopColor={skin.base} />
          <stop offset="1" stopColor={skin.shade} />
        </linearGradient>
        <radialGradient id={gFace} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor={skinHi} stopOpacity="0.9" />
          <stop offset="0.5" stopColor={skin.base} stopOpacity="0" />
          <stop offset="1" stopColor={skin.shade} stopOpacity="0.45" />
        </radialGradient>
        {/* Jacket: top-left highlight → bottom shade */}
        <linearGradient id={gJacket} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={jacketHi} />
          <stop offset="0.5" stopColor={style.jacketColor} />
          <stop offset="1" stopColor={jacketDark} />
        </linearGradient>
        <linearGradient id={gPants} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={style.pantsColor} />
          <stop offset="1" stopColor={pantsDark} />
        </linearGradient>
        <linearGradient id={gHair} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor={shade(style.hairColor, 0.18)} />
          <stop offset="0.6" stopColor={style.hairColor} />
          <stop offset="1" stopColor={shade(style.hairColor, -0.25)} />
        </linearGradient>
        <radialGradient id={gCheek} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F2A6A0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#F2A6A0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow — offset for forward stance */}
      {variant === "full" && (
        <ellipse cx="52" cy="180" rx="28" ry="3.8" fill={`url(#${gShadow})`} />
      )}

      {/* Whole-character group: subtle breathing + slight forward lean & sway */}
      <motion.g
        animate={
          animate
            ? {
                y: [0, -0.7, 0, -0.5, 0],
                rotate: [-0.6, 0.2, -0.4, 0.1, -0.6],
              }
            : undefined
        }
        transition={
          animate
            ? { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        style={{ transformOrigin: "50px 170px" }}
      >
        {/* Backpack (behind body) — slightly tilted with strap suggestion */}
        <g transform="rotate(-2 50 116)">
          {ShopBackpack ? <ShopBackpack /> : customBackpack}
        </g>

        {/* === Body / jacket — asymmetric, slight forward lean === */}
        {/* Torso: shoulders slightly rotated, weight on right leg */}
        <g>
          {/* back arm (left, slightly behind, hangs lower) */}
          <path
            d="M22 102 q-8 16 -3 36 q5 3 10 -1 q-3 -16 1 -32 z"
            fill={`url(#${gJacket})`}
          />
          <path d="M22 102 q-3 8 -2 16 l3 -1 q-1 -8 1 -14 z" fill={jacketHi} opacity="0.55" />

          {/* torso: subtle forward lean (top tilted right ~3deg via path) */}
          <path
            d="M27 100 q24 -19 47 -1 q5 26 1 50 q-26 11 -52 -1 q0 -22 4 -48 z"
            fill={`url(#${gJacket})`}
          />
          {/* shoulder/chest highlight (top-left light) */}
          <path
            d="M29 100 q22 -15 44 -1 q1 7 0 14 q-22 -10 -45 0 q0 -7 1 -13 z"
            fill={jacketHi}
            opacity="0.55"
          />
          {/* side shadow on right (light from top-left) */}
          <path
            d="M70 102 q4 4 5 14 q-2 22 -1 34 q-3 2 -6 2 q1 -24 -1 -46 q1 -2 3 -4 z"
            fill={jacketDark}
            opacity="0.5"
          />
          {/* zipper, slightly off-center for the lean */}
          <path
            d="M51 98 q-1 25 -2 50"
            stroke={jacketDark}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* collar */}
          <path
            d="M40 96 q10 -6 20 0 q-3 4 -10 4 q-7 0 -10 -4 z"
            fill={jacketDark}
            opacity="0.65"
          />

          {/* front arm (right, bent slightly forward — agile) */}
          <path
            d="M76 102 q9 16 4 32 q-2 6 -8 5 q-3 -3 -1 -8 q4 -14 -2 -28 z"
            fill={`url(#${gJacket})`}
          />
          <path d="M76 102 q3 8 2 16 l-3 -1 q1 -8 -1 -14 z" fill={jacketHi} opacity="0.55" />

          {/* hands */}
          <circle cx="25" cy="140" r="5.2" fill={`url(#${gSkin})`} />
          <circle cx="73" cy="139" r="5.2" fill={`url(#${gSkin})`} />
          {/* hand under-shadow */}
          <path d="M21 142 q4 3 8 0" stroke={skin.shade} strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M69 141 q4 3 8 0" stroke={skin.shade} strokeWidth="0.6" fill="none" opacity="0.5" />
        </g>

        {/* === Pants — asymmetric stance: right leg planted, left leg slightly forward === */}
        <g>
          <path
            d="M30 146 q20 8 40 0 l-2 24 q-3 2 -9 0 l-3 -16 l-3 16 q-3 2 -9 0 l-3 -16 l-3 16 q-3 2 -7 0 z"
            fill={`url(#${gPants})`}
          />
          {/* left leg (slightly forward — lighter front) */}
          <path d="M34 162 q3 5 6 0 l-1 6 q-2 1 -4 0 z" fill={shade(style.pantsColor, 0.12)} opacity="0.7" />
          {/* right leg (planted — slight shadow) */}
          <path d="M58 160 q3 6 6 0 l-1 8 q-2 1 -4 0 z" fill={pantsDark} opacity="0.5" />
        </g>

        {/* === Boots — staggered for the step-forward pose === */}
        {ShopBoots ? (
          <ShopBoots defaultColor={style.bootsColor} />
        ) : (
          <g>
            {/* left boot (forward) */}
            <path d="M32 168 h16 q4 4 6 8 h-24 q1 -5 2 -8 z" fill={style.bootsColor} />
            <path d="M32 168 h16 q4 4 6 8 h-24" fill="none" stroke={shade(style.bootsColor, 0.25)} strokeWidth="0.5" opacity="0.6" />
            <rect x="28" y="174" width="26" height="3" rx="1" fill={shade(style.bootsColor, -0.5)} />
            {/* right boot (planted, slightly back) */}
            <path d="M54 170 h16 q3 3 4 6 h-22 q1 -4 2 -6 z" fill={style.bootsColor} />
            <rect x="50" y="176" width="22" height="3" rx="1" fill={shade(style.bootsColor, -0.5)} />
          </g>
        )}

        {/* === Scarf === */}
        {ShopScarf ? <ShopScarf /> : customScarf}

        {/* === HEAD GROUP — subtle independent micro-tilt === */}
        <motion.g
          animate={
            animate
              ? { rotate: [-1.2, 0.6, -0.8, 0.4, -1.2] }
              : undefined
          }
          transition={
            animate
              ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          style={{ transformOrigin: "50px 86px" }}
        >
          {/* Neck */}
          <path d="M45 84 q5 4 10 0 v8 q-5 3 -10 0 z" fill={skin.shade} />

          {/* Head — slight oval, larger for friendly proportions */}
          <ellipse cx="50" cy="62" rx="23" ry="24.5" fill={`url(#${gSkin})`} />
          {/* Face soft volumetric shading */}
          <ellipse cx="50" cy="62" rx="23" ry="24.5" fill={`url(#${gFace})`} />
          {/* Chin shadow */}
          <path
            d="M38 80 q12 8 24 0 q-3 6 -12 6 q-9 0 -12 -6 z"
            fill={skin.shade}
            opacity="0.35"
          />
          {/* Side shadow (light from top-left) */}
          <path
            d="M73 62 q-1 14 -8 22 q-2 -2 -3 -4 q6 -8 8 -22 q1.5 1.5 3 4 z"
            fill={skin.shade}
            opacity="0.3"
          />

          {/* Ears */}
          <ellipse cx="27" cy="64" rx="3" ry="5.5" fill={skin.shade} />
          <ellipse cx="73" cy="64" rx="3" ry="5.5" fill={skin.shade} />
          <ellipse cx="27.3" cy="64" rx="1.4" ry="3" fill={shade(skin.base, -0.3)} opacity="0.5" />
          <ellipse cx="72.7" cy="64" rx="1.4" ry="3" fill={shade(skin.base, -0.3)} opacity="0.5" />

          {/* Hair (use gradient for hair fill via mask trick: re-render with gradient stroke for highlight) */}
          {hair}
          {/* hair glossy highlight overlay */}
          <path
            d="M34 46 q8 -10 18 -10"
            stroke={shade(style.hairColor, 0.35)}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />

          {/* Eyebrows */}
          {eyebrows}

          {/* Eyes */}
          {renderEyes(style.eyeShape, style.eyeColor, blink, gaze)}

          {/* Freckles */}
          {style.freckles && renderFreckles()}

          {/* Nose — subtle bridge + tip shadow for volume */}
          <path
            d="M49 68 q1 4 2 6 q-1 0.8 -2.4 0.4"
            stroke={shade(skin.base, -0.25)}
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="50.2" cy="74.2" rx="1.4" ry="0.8" fill={shade(skin.base, -0.18)} opacity="0.5" />

          {/* Cheeks — soft radial blush */}
          <circle cx="38" cy="73" r="3.2" fill={`url(#${gCheek})`} />
          <circle cx="62" cy="73" r="3.2" fill={`url(#${gCheek})`} />

          {/* Mouth — gentle asymmetric smile */}
          <path
            d="M44 77 q3 3 6 3 q3.5 0 6.5 -3.4"
            stroke="#5A2F1B"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          {/* lower lip hint */}
          <path
            d="M45 78.5 q5 2.5 10 0"
            stroke={shade(skin.base, -0.2)}
            strokeWidth="0.6"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />

          {/* Goggles (forehead) */}
          {style.accGoggles && renderGoggles()}

          {/* Hats (shop > custom) */}
          {ShopHat ? <ShopHat /> : customHat}
        </motion.g>

        {/* Badge (chest pin) */}
        {Badge && <Badge />}
      </motion.g>
    </Wrapper>
  );
};

export default ExplorerSvg;
