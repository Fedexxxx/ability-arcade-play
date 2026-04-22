import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  SKIN_PALETTE,
  type ExplorerStyle,
} from "@/lib/explorerStyle";
import type { CosmeticSlot } from "@/lib/wallet";

interface Props {
  style: ExplorerStyle;
  /** Equipped cosmetics by slot — pass wallet.equipped */
  gear?: Partial<Record<CosmeticSlot, string | undefined>>;
  /** Crop variant: 'full' shows full body, 'bust' crops to head+shoulders for round avatars. */
  variant?: "full" | "bust";
  className?: string;
  ariaLabel?: string;
}

/** Maps shop item id -> SVG gear renderer. Falls back gracefully when no match. */
const HAT_RENDERERS: Record<string, (props: { x: number }) => JSX.Element> = {
  "hat-cap-base": () => (
    <g>
      {/* baseball cap */}
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

const SCARF_RENDERERS: Record<string, (props: { y: number }) => JSX.Element> = {
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

const ExplorerSvg = ({
  style,
  gear = {},
  variant = "full",
  className,
  ariaLabel = "Explorador",
}: Props) => {
  const skin = SKIN_PALETTE[style.skin];

  // viewBox crops differently for bust vs full
  const viewBox = variant === "bust" ? "16 8 68 90" : "0 0 100 184";

  // hair path varies by style
  const hair = useMemo(() => renderHair(style.hair, style.hairColor), [style.hair, style.hairColor]);

  const Hat = gear.hat ? HAT_RENDERERS[gear.hat] : null;
  const Scarf = gear.scarf ? SCARF_RENDERERS[gear.scarf] : null;
  const Backpack = gear.backpack ? BACKPACK_RENDERERS[gear.backpack] : null;
  const Boots = gear.boots ? BOOTS_RENDERERS[gear.boots] : null;
  const Badge = gear.badge ? BADGE_RENDERERS[gear.badge] : null;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
    >
      {/* === Backpack (behind body) === */}
      {Backpack && <Backpack />}

      {/* === Body / jacket === */}
      <path
        d="M28 96 q22 -16 44 0 l4 50 q-26 12 -52 0 z"
        fill={style.jacketColor}
      />
      {/* jacket shading */}
      <path
        d="M28 96 q22 -16 44 0 l2 14 q-24 -10 -48 0 z"
        fill="rgba(255,255,255,0.12)"
      />
      {/* zipper */}
      <line x1="50" y1="96" x2="50" y2="146" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
      {/* arms */}
      <path d="M24 100 q-6 18 0 38 l8 -2 q-4 -16 0 -32 z" fill={style.jacketColor} />
      <path d="M76 100 q6 18 0 38 l-8 -2 q4 -16 0 -32 z" fill={style.jacketColor} />
      {/* hands */}
      <circle cx="28" cy="138" r="5" fill={skin.base} />
      <circle cx="72" cy="138" r="5" fill={skin.base} />

      {/* === Pants === */}
      <path d="M30 144 q20 8 40 0 l-2 24 h-12 l-2 -16 l-2 16 h-12 l-2 -16 l-2 16 h-4 z"
            fill={style.pantsColor} />

      {/* === Boots === */}
      {Boots ? (
        <Boots defaultColor={style.bootsColor} />
      ) : (
        <g>
          <path d="M34 168 h14 l3 8 h-20 z" fill={style.bootsColor} />
          <path d="M52 168 h14 l3 8 h-20 z" fill={style.bootsColor} />
        </g>
      )}

      {/* === Scarf (in front of body, behind head) === */}
      {Scarf && <Scarf y={96} />}

      {/* === Neck === */}
      <rect x="46" y="84" width="8" height="10" fill={skin.shade} />

      {/* === Head === */}
      <circle cx="50" cy="62" r="22" fill={skin.base} />
      {/* face shading */}
      <path d="M50 84 a22 22 0 0 0 22 -22 q-6 18 -22 22 z" fill={skin.shade} opacity="0.25" />
      {/* ears */}
      <ellipse cx="28" cy="64" rx="3" ry="5" fill={skin.shade} />
      <ellipse cx="72" cy="64" rx="3" ry="5" fill={skin.shade} />

      {/* hair (after head) */}
      {hair}

      {/* eyes */}
      <ellipse cx="42" cy="64" rx="2.4" ry="3" fill="#1F1A18" />
      <ellipse cx="58" cy="64" rx="2.4" ry="3" fill="#1F1A18" />
      <circle cx="42.8" cy="63" r="0.8" fill="#FFFFFF" />
      <circle cx="58.8" cy="63" r="0.8" fill="#FFFFFF" />
      {/* cheeks */}
      <circle cx="38" cy="70" r="2.5" fill="#E89B9B" opacity="0.55" />
      <circle cx="62" cy="70" r="2.5" fill="#E89B9B" opacity="0.55" />
      {/* smile */}
      <path d="M44 73 q6 5 12 0" stroke="#5A2F1B" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* === Hat === */}
      {Hat && <Hat x={50} />}

      {/* === Badge (chest pin) === */}
      {Badge && <Badge />}
    </svg>
  );
};

function renderHair(style: ExplorerStyle["hair"], color: string): JSX.Element {
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
    case "wavy":
      return (
        <g fill={color}>
          <path d="M28 62 q2 -30 22 -30 q20 0 22 30 q-6 -8 -12 -6 q-4 -10 -10 -10 q-6 0 -10 10 q-6 -2 -12 6 z" />
          <circle cx="32" cy="62" r="3" />
          <circle cx="68" cy="62" r="3" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <path d="M28 60 q4 -28 22 -28 q18 0 22 28 q-4 -10 -22 -10 q-18 0 -22 10 z" />
          <circle cx="50" cy="32" r="8" />
        </g>
      );
    case "long":
      return (
        <g fill={color}>
          <path d="M26 64 q2 -32 24 -32 q22 0 24 32 l2 30 q-12 -6 -26 -6 q-14 0 -26 6 z" />
          <path d="M28 60 q22 -10 44 0 q-22 -22 -44 0 z" fill={color} opacity="0" />
        </g>
      );
  }
}

export default ExplorerSvg;
