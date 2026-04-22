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
/*  Shop gear renderers (kept from previous version, minor tweaks)     */
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
      <path d="M36 168 h12 l4 8 h-18 z" fill={defaultColor} />
      <path d="M52 168 h12 l4 8 h-18 z" fill={defaultColor} />
      <rect x="32" y="174" width="20" height="4" rx="1" fill="#1F1A18" />
      <rect x="48" y="174" width="20" height="4" rx="1" fill="#1F1A18" />
    </g>
  ),
  "boots-snow": () => (
    <g>
      <path d="M34 162 h16 l4 14 h-22 z" fill="#E8F2FA" stroke="#3B7CD9" strokeWidth="1.5" />
      <path d="M50 162 h16 l4 14 h-22 z" fill="#E8F2FA" stroke="#3B7CD9" strokeWidth="1.5" />
      <rect x="32" y="174" width="22" height="4" rx="1" fill="#1F2A44" />
      <rect x="48" y="174" width="22" height="4" rx="1" fill="#1F2A44" />
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
/*  Customize-tab accessories (free, recolorable)                      */
/* ------------------------------------------------------------------ */

function renderAccHat(kind: AccHat, color: string): JSX.Element | null {
  switch (kind) {
    case "none":
      return null;
    case "beanie":
      return (
        <g>
          <path d="M28 50 q4 -22 22 -22 q18 0 22 22 v4 H28 z" fill={color} />
          <rect x="28" y="52" width="44" height="5" rx="2" fill="rgba(0,0,0,0.18)" />
          <circle cx="50" cy="26" r="3" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M30 50 q4 -20 20 -20 q16 0 20 20 v3 H30 z" fill={color} />
          <path d="M28 52 h44 v3 H28 z" fill="rgba(0,0,0,0.22)" />
          <path d="M70 52 q14 1 18 6 q-2 4 -10 4 H70 z" fill="rgba(0,0,0,0.22)" />
        </g>
      );
    case "explorer-hat":
      return (
        <g>
          <ellipse cx="50" cy="52" rx="28" ry="5" fill="rgba(0,0,0,0.25)" />
          <ellipse cx="50" cy="50" rx="28" ry="5" fill={color} />
          <path d="M34 50 q4 -22 16 -22 q12 0 16 22 z" fill={color} />
          <rect x="34" y="46" width="32" height="3" fill="rgba(0,0,0,0.2)" />
        </g>
      );
  }
}

function renderAccScarf(kind: AccScarf, color: string): JSX.Element | null {
  if (kind === "none") return null;
  return (
    <g>
      <path d="M30 92 q20 -10 40 0 v8 q-20 10 -40 0 z" fill={color} />
      <path d="M30 100 l-4 14 l9 -2 l3 -10 z" fill={color} opacity="0.85" />
      <path d="M70 100 l4 14 l-9 -2 l-3 -10 z" fill={color} opacity="0.85" />
      <path d="M30 92 q20 -10 40 0" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
    </g>
  );
}

function renderAccBackpack(kind: AccBackpack, color: string): JSX.Element | null {
  switch (kind) {
    case "none":
      return null;
    case "day":
      return (
        <g>
          <rect x="14" y="100" width="14" height="32" rx="6" fill={color} />
          <rect x="16" y="108" width="10" height="8" rx="2" fill="rgba(0,0,0,0.2)" />
          <path d="M22 100 q4 -6 10 -2" stroke="rgba(0,0,0,0.25)" strokeWidth="2" fill="none" />
        </g>
      );
    case "trek":
      return (
        <g>
          <rect x="12" y="96" width="16" height="40" rx="6" fill={color} />
          <rect x="14" y="104" width="12" height="10" rx="2" fill="rgba(0,0,0,0.22)" />
          <rect x="14" y="118" width="12" height="8"  rx="2" fill="rgba(0,0,0,0.22)" />
          <path d="M20 96 l-4 -8 l4 -2 l4 2 z" fill="rgba(255,255,255,0.4)" />
        </g>
      );
  }
}

function renderGoggles(): JSX.Element {
  // Sits on forehead — non-intrusive, adventure-themed
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
  switch (style) {
    case "buzz":
      return <path d="M30 56 q20 -22 40 0 v6 q-20 -10 -40 0 z" fill={color} opacity="0.85" />;
    case "short":
      return (
        <path
          d="M28 60 q4 -28 22 -28 q18 0 22 28 q-4 -10 -22 -10 q-18 0 -22 10 z"
          fill={color}
        />
      );
    case "medium":
      return (
        <g fill={color}>
          <path d="M26 64 q2 -32 24 -32 q22 0 24 32 q-4 -8 -10 -6 q-4 -10 -14 -10 q-10 0 -14 10 q-6 -2 -10 6 z" />
          <path d="M26 64 q-2 8 0 18 l4 -2 q-2 -8 0 -16 z" />
          <path d="M74 64 q2 8 0 18 l-4 -2 q2 -8 0 -16 z" />
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
          {/* cloud-like curls around head */}
          <circle cx="32" cy="44" r="7" />
          <circle cx="42" cy="36" r="8" />
          <circle cx="52" cy="34" r="8" />
          <circle cx="62" cy="36" r="8" />
          <circle cx="70" cy="46" r="7" />
          <circle cx="30" cy="56" r="6" />
          <circle cx="72" cy="56" r="6" />
          <path d="M30 58 q20 -8 40 0 q-2 -10 -20 -10 q-18 0 -20 10 z" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <path d="M28 60 q4 -28 22 -28 q18 0 22 28 q-4 -10 -22 -10 q-18 0 -22 10 z" />
          <circle cx="50" cy="32" r="8" />
          <circle cx="50" cy="32" r="5" fill="rgba(0,0,0,0.15)" />
        </g>
      );
    case "long":
      return (
        <g fill={color}>
          <path d="M26 64 q2 -32 24 -32 q22 0 24 32 l2 36 q-12 -6 -26 -6 q-14 0 -26 6 z" />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Eyes / brows                                                       */
/* ------------------------------------------------------------------ */

function renderEyes(shape: EyeShape, color: string, blink: boolean) {
  if (blink) {
    return (
      <g stroke="#1F1A18" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M39 65 q3 2 6 0" />
        <path d="M55 65 q3 2 6 0" />
      </g>
    );
  }
  switch (shape) {
    case "round":
      return (
        <g>
          <circle cx="42" cy="65" r="3.2" fill="#FFFFFF" />
          <circle cx="58" cy="65" r="3.2" fill="#FFFFFF" />
          <circle cx="42" cy="65" r="2.2" fill={color} />
          <circle cx="58" cy="65" r="2.2" fill={color} />
          <circle cx="42.8" cy="64.2" r="0.9" fill="#FFFFFF" />
          <circle cx="58.8" cy="64.2" r="0.9" fill="#FFFFFF" />
        </g>
      );
    case "almond":
      return (
        <g>
          <path d="M38 65 q4 -3 8 0 q-4 3 -8 0 z" fill="#FFFFFF" />
          <path d="M54 65 q4 -3 8 0 q-4 3 -8 0 z" fill="#FFFFFF" />
          <ellipse cx="42" cy="65" rx="1.6" ry="2" fill={color} />
          <ellipse cx="58" cy="65" rx="1.6" ry="2" fill={color} />
          <circle cx="42.6" cy="64.4" r="0.6" fill="#FFFFFF" />
          <circle cx="58.6" cy="64.4" r="0.6" fill="#FFFFFF" />
        </g>
      );
    case "soft":
      return (
        <g>
          <ellipse cx="42" cy="65" rx="2.6" ry="2.2" fill="#FFFFFF" />
          <ellipse cx="58" cy="65" rx="2.6" ry="2.2" fill="#FFFFFF" />
          <circle cx="42" cy="65.2" r="1.8" fill={color} />
          <circle cx="58" cy="65.2" r="1.8" fill={color} />
          <circle cx="42.6" cy="64.6" r="0.7" fill="#FFFFFF" />
          <circle cx="58.6" cy="64.6" r="0.7" fill="#FFFFFF" />
        </g>
      );
  }
}

function renderEyebrows(style: EyebrowStyle, color: string) {
  // eyebrows tinted with hair color, slightly darker
  const stroke = color;
  switch (style) {
    case "soft":
      return (
        <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M38 58 q4 -1.5 8 0" />
          <path d="M54 58 q4 -1.5 8 0" />
        </g>
      );
    case "thick":
      return (
        <g fill={stroke}>
          <path d="M38 57 q4 -2.5 8 0 v2 q-4 -1 -8 0 z" />
          <path d="M54 57 q4 -2.5 8 0 v2 q-4 -1 -8 0 z" />
        </g>
      );
    case "arched":
      return (
        <g stroke={stroke} strokeWidth="1.7" strokeLinecap="round" fill="none">
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

  // Bust crop reveals more head room (for tall hats / curly hair)
  const viewBox = variant === "bust" ? "14 4 72 96" : "0 0 100 184";

  const hair = useMemo(() => renderHair(style.hair, style.hairColor), [style.hair, style.hairColor]);
  const eyebrows = useMemo(() => renderEyebrows(style.eyebrow, style.hairColor), [style.eyebrow, style.hairColor]);

  // --- Idle: blink every 4-6s, react-on-change "smile bounce" ---
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (!animate) return;
    let timeout: number;
    const loop = () => {
      const next = 3500 + Math.random() * 2500;
      timeout = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => {
          setBlink(false);
          loop();
        }, 140);
      }, next);
    };
    loop();
    return () => window.clearTimeout(timeout);
  }, [animate]);

  // React-on-change: subtle scale pulse whenever style changes (cheap key trick)
  const reactKey = useMemo(
    () =>
      `${style.skin}|${style.hair}|${style.hairColor}|${style.jacketColor}|${style.pantsColor}|${style.bootsColor}|${style.eyeShape}|${style.eyeColor}|${style.eyebrow}|${style.freckles}|${style.accHat}|${style.accHatColor}|${style.accScarf}|${style.accScarfColor}|${style.accBackpack}|${style.accBackpackColor}|${style.accGoggles}`,
    [style],
  );

  // Shop gear wins; fall back to customize-tab accessories.
  const ShopHat      = gear.hat ? HAT_RENDERERS[gear.hat] : null;
  const ShopScarf    = gear.scarf ? SCARF_RENDERERS[gear.scarf] : null;
  const ShopBackpack = gear.backpack ? BACKPACK_RENDERERS[gear.backpack] : null;
  const ShopBoots    = gear.boots ? BOOTS_RENDERERS[gear.boots] : null;
  const Badge        = gear.badge ? BADGE_RENDERERS[gear.badge] : null;

  const customHat      = !ShopHat ? renderAccHat(style.accHat, style.accHatColor) : null;
  const customScarf    = !ShopScarf ? renderAccScarf(style.accScarf, style.accScarfColor) : null;
  const customBackpack = !ShopBackpack ? renderAccBackpack(style.accBackpack, style.accBackpackColor) : null;

  const Wrapper: any = animate ? motion.svg : "svg";
  const wrapperProps = animate
    ? {
        key: reactKey,
        initial: { scale: 0.985 },
        animate: { scale: [0.985, 1.02, 1] },
        transition: { duration: 0.45, ease: "easeOut" },
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
        <radialGradient id="ground-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      {variant === "full" && (
        <ellipse cx="50" cy="180" rx="26" ry="3.5" fill="url(#ground-shadow)" />
      )}

      {/* Backpack (behind body) */}
      {ShopBackpack ? <ShopBackpack /> : customBackpack}

      {/* === Body / jacket — softer rounded torso === */}
      <path
        d="M26 100 q24 -18 48 0 q4 26 2 48 q-26 12 -52 0 q-2 -22 2 -48 z"
        fill={style.jacketColor}
      />
      {/* jacket highlight */}
      <path
        d="M28 100 q22 -14 44 0 q2 8 1 16 q-22 -10 -46 0 q-1 -8 1 -16 z"
        fill="rgba(255,255,255,0.14)"
      />
      {/* zipper */}
      <line x1="50" y1="98" x2="50" y2="148" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      {/* arms (rounded) */}
      <path d="M22 102 q-7 18 -1 38 q5 2 10 -2 q-4 -16 0 -32 z" fill={style.jacketColor} />
      <path d="M78 102 q7 18 1 38 q-5 2 -10 -2 q4 -16 0 -32 z" fill={style.jacketColor} />
      {/* arm shading */}
      <path d="M22 102 q-3 8 -2 16 l4 -1 q-1 -8 1 -14 z" fill="rgba(255,255,255,0.10)" />
      <path d="M78 102 q3 8 2 16 l-4 -1 q1 -8 -1 -14 z" fill="rgba(255,255,255,0.10)" />
      {/* hands */}
      <circle cx="26" cy="140" r="5.5" fill={skin.base} />
      <circle cx="74" cy="140" r="5.5" fill={skin.base} />

      {/* === Pants — rounded === */}
      <path
        d="M30 146 q20 8 40 0 l-3 24 q-4 2 -10 0 l-3 -16 l-2 16 q-4 2 -10 0 l-3 -16 l-2 16 q-4 2 -7 0 z"
        fill={style.pantsColor}
      />

      {/* === Boots === */}
      {ShopBoots ? (
        <ShopBoots defaultColor={style.bootsColor} />
      ) : (
        <g>
          <path d="M32 168 h16 q3 4 4 8 h-22 q1 -5 2 -8 z" fill={style.bootsColor} />
          <path d="M52 168 h16 q1 3 2 8 h-22 q1 -4 4 -8 z" fill={style.bootsColor} />
          <rect x="28" y="174" width="22" height="3" rx="1" fill="rgba(0,0,0,0.35)" />
          <rect x="50" y="174" width="22" height="3" rx="1" fill="rgba(0,0,0,0.35)" />
        </g>
      )}

      {/* === Scarf (in front of body, behind head) === */}
      {ShopScarf ? <ShopScarf /> : customScarf}

      {/* === Neck === */}
      <rect x="46" y="84" width="8" height="10" rx="2" fill={skin.shade} />

      {/* === Head — slightly larger, rounder === */}
      <ellipse cx="50" cy="62" rx="23" ry="24" fill={skin.base} />
      {/* face soft shading */}
      <path
        d="M50 86 a23 24 0 0 0 23 -24 q-8 22 -23 24 z"
        fill={skin.shade}
        opacity="0.22"
      />
      {/* ears */}
      <ellipse cx="27" cy="64" rx="3" ry="5.5" fill={skin.shade} />
      <ellipse cx="73" cy="64" rx="3" ry="5.5" fill={skin.shade} />

      {/* hair (after head) */}
      {hair}

      {/* eyebrows */}
      {eyebrows}

      {/* eyes */}
      {renderEyes(style.eyeShape, style.eyeColor, blink)}

      {/* freckles */}
      {style.freckles && renderFreckles()}

      {/* nose hint */}
      <path d="M49.5 69 q0.5 2 1 3 q-0.5 0.6 -1.2 0.4" stroke={skin.shade} strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* cheeks */}
      <circle cx="38" cy="72" r="2.6" fill="#E89B9B" opacity="0.55" />
      <circle cx="62" cy="72" r="2.6" fill="#E89B9B" opacity="0.55" />
      {/* smile */}
      <path d="M44 76 q6 5 12 0" stroke="#5A2F1B" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* === Goggles (forehead) === */}
      {style.accGoggles && renderGoggles()}

      {/* === Hats (shop > custom) === */}
      {ShopHat ? <ShopHat /> : customHat}

      {/* === Badge (chest pin) === */}
      {Badge && <Badge />}
    </Wrapper>
  );
};

export default ExplorerSvg;