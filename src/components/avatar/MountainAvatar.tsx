/**
 * Mountain Avatar — pure SVG, layered, data-driven.
 * One component renders every layer based on a MountainAvatar config.
 * Pixar-soft look via gradients, soft shadows, gentle highlights.
 */

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getAccessoryHex,
  getHairHex,
  getOutfitHex,
  getSkinHex,
  shade,
  type AccessoryColorId,
  type HairColorId,
  type OutfitColorId,
  type SkinToneId,
} from "@/lib/mountainAvatar/palette";
import type {
  BackpackId,
  BadgeId,
  BootsId,
  BottomId,
  ExpressionId,
  HairStyleId,
  HatId,
  NeckId,
  TopId,
} from "@/lib/mountainAvatar/options";
import type { MountainAvatar } from "@/lib/mountainAvatar/state";

interface Props {
  avatar: MountainAvatar;
  /** 'full' = whole body; 'bust' = head + shoulders. */
  variant?: "full" | "bust";
  /** Idle breathe + blink + gaze drift. */
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
}

/* ────────────────────────────  Hair  ──────────────────────────── */

function Hair({ style, color }: { style: HairStyleId; color: string }) {
  const dark = shade(color, -0.3);
  const hi = shade(color, 0.18);
  switch (style) {
    case "soft-short":
      return (
        <g>
          <path d="M64 56 q4 -34 36 -34 q32 0 36 34 q-6 -10 -16 -10 q-6 -8 -20 -8 q-14 0 -20 8 q-10 0 -16 10 z" fill={color} />
          <path d="M70 50 q6 -22 30 -22 q24 0 30 22" fill="none" stroke={hi} strokeWidth="1.2" opacity="0.6" />
        </g>
      );
    case "wavy-medium":
      return (
        <g fill={color}>
          <path d="M62 64 q2 -42 38 -42 q36 0 38 42 q-8 -14 -16 -8 q-6 -12 -22 -12 q-16 0 -22 12 q-8 -6 -16 8 z" />
          <path d="M62 64 q-4 16 0 30 l8 -2 q-4 -12 0 -26 z" />
          <path d="M138 64 q4 16 0 30 l-8 -2 q4 -12 0 -26 z" />
          <path d="M70 52 q8 -22 30 -22 q22 0 30 22" fill="none" stroke={hi} strokeWidth="1.2" opacity="0.55" />
        </g>
      );
    case "curly-round":
      return (
        <g fill={color}>
          <circle cx="68" cy="40" r="14" />
          <circle cx="84" cy="28" r="15" />
          <circle cx="100" cy="22" r="16" />
          <circle cx="116" cy="28" r="15" />
          <circle cx="132" cy="40" r="14" />
          <circle cx="64" cy="58" r="12" />
          <circle cx="136" cy="58" r="12" />
          <path d="M64 60 q36 -14 72 0 q-4 -16 -36 -16 q-32 0 -36 16 z" />
          <circle cx="84" cy="28" r="5" fill={hi} opacity="0.55" />
          <circle cx="116" cy="28" r="5" fill={hi} opacity="0.55" />
        </g>
      );
    case "side-swept":
      return (
        <g fill={color}>
          <path d="M64 60 q4 -36 36 -36 q34 0 36 30 q-22 -8 -32 -2 q-14 -2 -22 8 q-10 -2 -18 0 z" />
          <path d="M64 60 q24 -22 50 -16" fill="none" stroke={hi} strokeWidth="1.4" opacity="0.6" />
        </g>
      );
    case "fluffy-explorer":
      return (
        <g fill={color}>
          <path d="M58 60 q2 -42 42 -42 q40 0 42 42 q-10 -16 -20 -8 q-6 -14 -22 -14 q-16 0 -22 14 q-10 -8 -20 8 z" />
          <circle cx="62" cy="44" r="8" />
          <circle cx="138" cy="44" r="8" />
          <circle cx="100" cy="14" r="9" />
          <path d="M66 48 q-2 8 0 18 l-4 -2 q-2 -8 0 -16 z" />
          <path d="M134 48 q2 8 0 18 l4 -2 q2 -8 0 -16 z" />
        </g>
      );
    case "tied-back":
      return (
        <g fill={color}>
          <path d="M64 60 q4 -36 36 -36 q32 0 36 36 q-8 -10 -18 -8 q-6 -10 -18 -10 q-12 0 -18 10 q-10 -2 -18 8 z" />
          <ellipse cx="100" cy="34" rx="14" ry="6" fill={dark} opacity="0.5" />
          <circle cx="100" cy="22" r="10" />
          <circle cx="100" cy="22" r="6" fill={dark} opacity="0.4" />
        </g>
      );
  }
}

/* ────────────────────────────  Tops  ──────────────────────────── */

function Top({
  kind, color, uid,
}: { kind: TopId; color: string; uid: string }) {
  const dark = shade(color, -0.22);
  const hi = shade(color, 0.18);
  const gradId = `top-${uid}`;
  // Common torso silhouette bounds: 58–142 horizontal, 118–208 vertical.
  const collar = (
    <path d="M84 122 q16 -8 32 0 l-2 8 q-14 -6 -28 0 z" fill={dark} />
  );
  const grad = (
    <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="0.55" stopColor={color} />
      <stop offset="1" stopColor={dark} />
    </linearGradient>
  );

  switch (kind) {
    case "alpine-jacket":
      return (
        <g>
          <defs>{grad}</defs>
          {/* shoulders */}
          <path d="M58 134 q12 -22 42 -22 q30 0 42 22 v10 q-12 -8 -42 -8 q-30 0 -42 8 z" fill={`url(#${gradId})`} />
          {/* body */}
          <path d="M58 138 q8 -2 14 0 v70 h56 v-70 q6 -2 14 0 v76 q-42 10 -84 0 z" fill={`url(#${gradId})`} />
          {/* zipper */}
          <line x1="100" y1="124" x2="100" y2="206" stroke={dark} strokeWidth="1.2" />
          {/* puff seam */}
          <path d="M62 168 q38 -8 76 0" fill="none" stroke={dark} strokeWidth="0.7" opacity="0.5" />
          {collar}
        </g>
      );
    case "explorer-vest":
      return (
        <g>
          <defs>{grad}</defs>
          {/* short-sleeve t-shirt under */}
          <path d="M56 138 q12 -22 44 -22 q32 0 44 22 v8 q-44 -6 -88 0 z" fill={shade(color, 0.05)} opacity="0.6" />
          {/* vest panel */}
          <path d="M70 138 q10 -16 30 -16 q20 0 30 16 v66 q-30 8 -60 0 z" fill={`url(#${gradId})`} />
          <line x1="100" y1="128" x2="100" y2="200" stroke={dark} strokeWidth="1.2" />
          {/* pocket */}
          <rect x="76" y="160" width="14" height="14" rx="2" fill={dark} opacity="0.5" />
          <rect x="110" y="160" width="14" height="14" rx="2" fill={dark} opacity="0.5" />
          {collar}
        </g>
      );
    case "mountain-hoodie":
      return (
        <g>
          <defs>{grad}</defs>
          {/* hood draped behind shoulders */}
          <path d="M62 122 q14 -22 38 -22 q24 0 38 22 q-12 14 -38 14 q-26 0 -38 -14 z" fill={dark} />
          <path d="M58 138 q12 -16 42 -16 q30 0 42 16 v68 q-42 10 -84 0 z" fill={`url(#${gradId})`} />
          {/* drawstrings */}
          <path d="M92 140 q-2 14 0 26" stroke={dark} strokeWidth="1.2" fill="none" />
          <path d="M108 140 q2 14 0 26" stroke={dark} strokeWidth="1.2" fill="none" />
          {/* kangaroo pocket */}
          <path d="M70 174 q30 8 60 0 v18 q-30 6 -60 0 z" fill={dark} opacity="0.45" />
        </g>
      );
    case "padded-trail-jacket":
      return (
        <g>
          <defs>{grad}</defs>
          <path d="M56 134 q14 -22 44 -22 q30 0 44 22 v12 q-14 -8 -44 -8 q-30 0 -44 8 z" fill={`url(#${gradId})`} />
          <path d="M56 140 v66 q44 12 88 0 v-66 q-12 -4 -20 0 v62 h-48 v-62 q-8 -4 -20 0 z" fill={`url(#${gradId})`} />
          {/* baffles */}
          <path d="M62 158 q38 -6 76 0" stroke={dark} strokeWidth="0.8" fill="none" opacity="0.55" />
          <path d="M62 174 q38 -6 76 0" stroke={dark} strokeWidth="0.8" fill="none" opacity="0.55" />
          <path d="M62 190 q38 -6 76 0" stroke={dark} strokeWidth="0.8" fill="none" opacity="0.55" />
          <line x1="100" y1="124" x2="100" y2="204" stroke={dark} strokeWidth="1.4" />
          {collar}
        </g>
      );
    case "sherpa-coat":
      return (
        <g>
          <defs>{grad}</defs>
          {/* fur collar */}
          <ellipse cx="100" cy="124" rx="32" ry="6" fill="#EDE6D6" />
          <ellipse cx="100" cy="124" rx="32" ry="6" fill="none" stroke={shade("#EDE6D6", -0.2)} strokeWidth="0.6" />
          <path d="M56 138 q14 -16 44 -16 q30 0 44 16 v68 q-44 12 -88 0 z" fill={`url(#${gradId})`} />
          {/* fur trim bottom */}
          <path d="M58 200 q42 10 84 0 v8 q-42 12 -84 0 z" fill="#EDE6D6" />
        </g>
      );
    case "summit-sweater":
      return (
        <g>
          <defs>{grad}</defs>
          <path d="M58 138 q12 -20 42 -20 q30 0 42 20 v68 q-42 10 -84 0 z" fill={`url(#${gradId})`} />
          {/* knit pattern (zigzag) */}
          <path d="M62 168 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6" stroke={dark} strokeWidth="1.1" fill="none" opacity="0.55" />
          <path d="M62 184 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6" stroke={dark} strokeWidth="1.1" fill="none" opacity="0.55" />
          {collar}
        </g>
      );
  }
}

/* ────────────────────────────  Bottoms  ──────────────────────────── */

function Bottom({
  kind, color, uid,
}: { kind: BottomId; color: string; uid: string }) {
  const dark = shade(color, -0.22);
  const hi = shade(color, 0.15);
  const gradId = `bot-${uid}`;
  const grad = (
    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="1" stopColor={dark} />
    </linearGradient>
  );
  // Common waist 60–140 at y=204; legs split at x=100; ankles ~96–104.
  const waistband = (
    <path d="M58 204 q42 -8 84 0 v6 q-42 8 -84 0 z" fill={dark} />
  );
  switch (kind) {
    case "trail-pants":
      return (
        <g>
          <defs>{grad}</defs>
          {waistband}
          <path d="M60 208 q4 50 12 80 h22 v-78 z" fill={`url(#${gradId})`} />
          <path d="M140 208 q-4 50 -12 80 h-22 v-78 z" fill={`url(#${gradId})`} />
          <line x1="100" y1="208" x2="100" y2="288" stroke={dark} strokeWidth="0.8" opacity="0.5" />
        </g>
      );
    case "mountain-shorts":
      return (
        <g>
          <defs>{grad}</defs>
          {waistband}
          <path d="M60 208 q4 22 10 38 h28 v-36 z" fill={`url(#${gradId})`} />
          <path d="M140 208 q-4 22 -10 38 h-28 v-36 z" fill={`url(#${gradId})`} />
          {/* leggings (visible from knee down) */}
          <path d="M70 246 q4 30 16 42 h12 v-42 z" fill={shade(color, -0.4)} />
          <path d="M130 246 q-4 30 -16 42 h-12 v-42 z" fill={shade(color, -0.4)} />
        </g>
      );
    case "hiking-pants":
      return (
        <g>
          <defs>{grad}</defs>
          {waistband}
          <path d="M62 208 q2 50 10 80 h26 v-78 z" fill={`url(#${gradId})`} />
          <path d="M138 208 q-2 50 -10 80 h-26 v-78 z" fill={`url(#${gradId})`} />
          {/* knee seam */}
          <path d="M70 250 q12 4 22 0" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.6" />
          <path d="M108 250 q12 4 22 0" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.6" />
        </g>
      );
    case "explorer-pants":
      return (
        <g>
          <defs>{grad}</defs>
          {waistband}
          <path d="M60 208 q4 50 12 80 h22 v-78 z" fill={`url(#${gradId})`} />
          <path d="M140 208 q-4 50 -12 80 h-22 v-78 z" fill={`url(#${gradId})`} />
          {/* cargo pockets */}
          <rect x="64" y="234" width="14" height="16" rx="2" fill={dark} opacity="0.55" />
          <rect x="122" y="234" width="14" height="16" rx="2" fill={dark} opacity="0.55" />
          {/* belt */}
          <rect x="60" y="206" width="80" height="4" fill={shade(color, -0.45)} />
        </g>
      );
  }
}

/* ────────────────────────────  Boots  ──────────────────────────── */

function Boots({
  kind, color,
}: { kind: BootsId; color: string }) {
  const dark = shade(color, -0.35);
  const hi = shade(color, 0.18);
  switch (kind) {
    case "classic-hiking":
      return (
        <g>
          {/* left */}
          <path d="M68 286 q-2 14 4 18 h28 v-22 z" fill={color} />
          <rect x="64" y="302" width="38" height="6" rx="1.5" fill={dark} />
          <path d="M70 290 q14 -3 28 0" stroke={hi} strokeWidth="0.8" fill="none" />
          {/* right */}
          <path d="M132 286 q2 14 -4 18 h-28 v-22 z" fill={color} />
          <rect x="98" y="302" width="38" height="6" rx="1.5" fill={dark} />
          <path d="M102 290 q14 -3 28 0" stroke={hi} strokeWidth="0.8" fill="none" />
        </g>
      );
    case "slate-mountain":
      return (
        <g>
          <path d="M66 284 q-4 18 6 22 h30 v-26 z" fill={color} />
          <rect x="62" y="304" width="42" height="6" rx="1.5" fill={dark} />
          <path d="M134 284 q4 18 -6 22 h-30 v-26 z" fill={color} />
          <rect x="96" y="304" width="42" height="6" rx="1.5" fill={dark} />
          <path d="M70 296 l30 -2" stroke={dark} strokeWidth="0.6" fill="none" />
          <path d="M100 294 l30 2" stroke={dark} strokeWidth="0.6" fill="none" />
        </g>
      );
    case "snow-friendly":
      return (
        <g>
          <path d="M64 280 q-4 22 8 26 h30 v-30 z" fill="#EDE6D6" stroke={shade("#EDE6D6", -0.2)} strokeWidth="1" />
          <path d="M136 280 q4 22 -8 26 h-30 v-30 z" fill="#EDE6D6" stroke={shade("#EDE6D6", -0.2)} strokeWidth="1" />
          <rect x="60" y="304" width="44" height="6" rx="1.5" fill={dark} />
          <rect x="96" y="304" width="44" height="6" rx="1.5" fill={dark} />
          <path d="M68 290 q14 -2 28 0" stroke={color} strokeWidth="2" fill="none" />
          <path d="M104 290 q14 -2 28 0" stroke={color} strokeWidth="2" fill="none" />
        </g>
      );
    case "soft-trail":
      return (
        <g>
          <path d="M70 290 q-2 12 6 16 h26 v-18 z" fill={color} />
          <path d="M130 290 q2 12 -6 16 h-26 v-18 z" fill={color} />
          <rect x="68" y="304" width="34" height="4" rx="2" fill={dark} />
          <rect x="98" y="304" width="34" height="4" rx="2" fill={dark} />
        </g>
      );
  }
}

/* ────────────────────────────  Backpack (straps front, body behind) ──── */

function BackpackStraps({
  kind, color,
}: { kind: BackpackId; color: string }) {
  if (kind === "none") return null;
  const dark = shade(color, -0.3);
  return (
    <g>
      <path d="M76 130 q-6 30 0 70" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M124 130 q6 30 0 70" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

function BackpackBody({
  kind, color, uid,
}: { kind: BackpackId; color: string; uid: string }) {
  if (kind === "none") return null;
  const dark = shade(color, -0.3);
  const hi = shade(color, 0.15);
  const gradId = `bp-${uid}`;
  const grad = (
    <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="1" stopColor={dark} />
    </linearGradient>
  );
  switch (kind) {
    case "round-explorer":
      return (
        <g>
          <defs>{grad}</defs>
          <ellipse cx="158" cy="174" rx="20" ry="36" fill={`url(#${gradId})`} />
          <ellipse cx="158" cy="180" rx="14" ry="10" fill={dark} opacity="0.55" />
          <circle cx="158" cy="160" r="4" fill={hi} />
        </g>
      );
    case "compact-trail":
      return (
        <g>
          <defs>{grad}</defs>
          <rect x="142" y="140" width="32" height="60" rx="8" fill={`url(#${gradId})`} />
          <rect x="148" y="158" width="20" height="14" rx="3" fill={dark} opacity="0.55" />
        </g>
      );
    case "rope-detail":
      return (
        <g>
          <defs>{grad}</defs>
          <rect x="142" y="138" width="32" height="64" rx="6" fill={`url(#${gradId})`} />
          <path d="M148 154 q10 -8 20 0 q-10 8 -20 0 z" fill="#C6A878" />
          <path d="M148 154 q10 -8 20 0" fill="none" stroke={shade("#C6A878", -0.3)} strokeWidth="0.7" />
        </g>
      );
    case "badge-pack":
      return (
        <g>
          <defs>{grad}</defs>
          <rect x="142" y="140" width="32" height="60" rx="6" fill={`url(#${gradId})`} />
          <circle cx="158" cy="160" r="5" fill="#D9A441" />
          <circle cx="158" cy="178" r="4" fill="#A84848" />
        </g>
      );
    case "summit-pack":
      return (
        <g>
          <defs>{grad}</defs>
          <rect x="140" y="132" width="36" height="74" rx="6" fill={`url(#${gradId})`} />
          {/* sleeping bag roll on top */}
          <ellipse cx="158" cy="130" rx="22" ry="6" fill={hi} />
          <ellipse cx="158" cy="130" rx="22" ry="6" fill="none" stroke={dark} strokeWidth="0.7" />
          {/* ice axe */}
          <line x1="178" y1="138" x2="186" y2="200" stroke="#6E7781" strokeWidth="2" />
          <path d="M182 134 l8 4 l-4 6 z" fill="#D9A441" />
        </g>
      );
  }
}

/* ────────────────────────────  Hats  ──────────────────────────── */

function Hat({
  kind, color,
}: { kind: HatId; color: string }) {
  if (kind === "none") return null;
  const dark = shade(color, -0.25);
  const hi = shade(color, 0.2);
  switch (kind) {
    case "explorer-beanie":
      return (
        <g>
          <path d="M58 50 q6 -38 42 -38 q36 0 42 38 v8 q-42 -10 -84 0 z" fill={color} />
          <path d="M58 56 q42 -10 84 0 v6 q-42 10 -84 0 z" fill={dark} />
          <circle cx="100" cy="10" r="6" fill={hi} stroke={dark} strokeWidth="1" />
        </g>
      );
    case "mountain-cap":
      return (
        <g>
          <path d="M60 50 q8 -34 40 -34 q32 0 40 34 v6 H60 z" fill={color} />
          <path d="M58 56 h84 v6 H58 z" fill={dark} />
          {/* visor */}
          <path d="M140 56 q24 0 32 10 q-4 6 -16 6 H140 z" fill={dark} />
          {/* logo */}
          <path d="M88 36 l12 -16 l12 16 z" fill={hi} />
        </g>
      );
    case "sherpa-wool":
      return (
        <g>
          <path d="M56 52 q4 -40 44 -40 q40 0 44 40 v6 q-44 -10 -88 0 z" fill={color} />
          {/* fur trim */}
          <path d="M56 56 q44 -10 88 0 v8 q-44 10 -88 0 z" fill="#EDE6D6" />
          <ellipse cx="100" cy="60" rx="44" ry="3" fill="none" stroke={shade("#EDE6D6", -0.2)} strokeWidth="0.6" />
          {/* ear flaps */}
          <ellipse cx="58" cy="68" rx="6" ry="10" fill={color} />
          <ellipse cx="142" cy="68" rx="6" ry="10" fill={color} />
        </g>
      );
    case "headband":
      return (
        <g>
          <path d="M62 54 q38 -8 76 0 v8 q-38 8 -76 0 z" fill={color} />
          <path d="M62 54 q38 -8 76 0" fill="none" stroke={dark} strokeWidth="0.6" opacity="0.6" />
          <circle cx="100" cy="50" r="3" fill={hi} />
        </g>
      );
  }
}

/* ────────────────────────────  Neck  ──────────────────────────── */

function Neck({
  kind, color,
}: { kind: NeckId; color: string }) {
  if (kind === "none") return null;
  const dark = shade(color, -0.22);
  switch (kind) {
    case "scarf":
      return (
        <g>
          <path d="M68 118 q32 -10 64 0 v10 q-32 10 -64 0 z" fill={color} />
          <path d="M68 124 l-4 22 l12 -2 l4 -16 z" fill={dark} />
          <path d="M132 124 l4 22 l-12 -2 l-4 -16 z" fill={dark} />
          <path d="M68 118 q32 -10 64 0" stroke={dark} strokeWidth="0.6" fill="none" opacity="0.6" />
        </g>
      );
    case "neck-warmer":
      return (
        <g>
          <path d="M76 116 q24 -6 48 0 v14 q-24 6 -48 0 z" fill={color} />
          <path d="M76 124 q24 -4 48 0" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.55" />
        </g>
      );
    case "bandana":
      return (
        <g>
          <path d="M76 116 q24 -4 48 0 l-4 12 q-20 4 -40 0 z" fill={color} />
          <path d="M120 128 l8 8 l-12 -2 z" fill={dark} />
          {/* dot pattern */}
          <circle cx="90" cy="122" r="1.2" fill={dark} opacity="0.5" />
          <circle cx="100" cy="124" r="1.2" fill={dark} opacity="0.5" />
          <circle cx="110" cy="122" r="1.2" fill={dark} opacity="0.5" />
        </g>
      );
  }
}

/* ────────────────────────────  Badge  ──────────────────────────── */

function Badge({ kind }: { kind: BadgeId }) {
  if (kind === "none") return null;
  const cx = 124, cy = 158;
  switch (kind) {
    case "compass":
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="#EDE6D6" stroke="#D9A441" strokeWidth="1.4" />
          <path d={`M${cx} ${cy - 5} L${cx + 1.5} ${cy} L${cx} ${cy + 5} L${cx - 1.5} ${cy} z`} fill="#A84848" />
        </g>
      );
    case "mountain":
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="#243B53" />
          <path d={`M${cx - 5} ${cy + 2} l4 -6 l3 4 l3 -3 l4 5 z`} fill="#EDE6D6" />
        </g>
      );
    case "star":
      return (
        <path
          d={`M${cx} ${cy - 7} l2 5 l5 0.5 l-4 3.5 l1.5 5 l-4.5 -3 l-4.5 3 l1.5 -5 l-4 -3.5 l5 -0.5 z`}
          fill="#D9A441"
          stroke="#7A4426"
          strokeWidth="0.6"
        />
      );
    case "map-pin":
      return (
        <g>
          <path d={`M${cx} ${cy - 7} q6 0 6 6 q0 6 -6 9 q-6 -3 -6 -9 q0 -6 6 -6 z`} fill="#A84848" />
          <circle cx={cx} cy={cy - 1} r="2" fill="#EDE6D6" />
        </g>
      );
    case "snowflake":
      return (
        <g stroke="#6FB6B2" strokeWidth="1.4" strokeLinecap="round">
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
          <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy + 4} />
          <line x1={cx - 4} y1={cy + 4} x2={cx + 4} y2={cy - 4} />
        </g>
      );
    case "trail":
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="#EDE6D6" stroke="#6F7F4F" strokeWidth="1" />
          <path d={`M${cx - 5} ${cy + 3} q3 -6 5 -2 q3 4 5 -2`} stroke="#6F7F4F" strokeWidth="1.2" fill="none" />
        </g>
      );
  }
}

/* ────────────────────────────  Face / eyes  ──────────────────────────── */

function Face({
  skin, expression, blink, gaze,
}: {
  skin: SkinToneId;
  expression: ExpressionId;
  blink: boolean;
  gaze: number;
}) {
  const dx = gaze * 1.6;
  // eyes baseline 78
  const ey = 78;
  const irisColor = "#3F2614";

  if (blink) {
    return (
      <g stroke="#2A1810" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d={`M${82} ${ey + 1} q5 3 10 0`} />
        <path d={`M${108} ${ey + 1} q5 3 10 0`} />
      </g>
    );
  }

  // expression deltas: smile, brow lift
  let mouth: JSX.Element;
  let browLift = 0;
  switch (expression) {
    case "friendly-curious":
      browLift = 0;
      mouth = <path d="M92 100 q8 6 16 0" stroke="#5A3528" strokeWidth="1.6" fill="none" strokeLinecap="round" />;
      break;
    case "confident-smile":
      browLift = -1;
      mouth = (
        <g>
          <path d="M90 100 q10 9 20 0" stroke="#5A3528" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M90 100 q10 9 20 0 q-10 1 -20 0 z" fill="#A84848" opacity="0.35" />
        </g>
      );
      break;
    case "calm-focused":
      browLift = 1;
      mouth = <path d="M93 101 q7 2 14 0" stroke="#5A3528" strokeWidth="1.6" fill="none" strokeLinecap="round" />;
      break;
    case "joyful-cheer":
      browLift = -2;
      mouth = (
        <g>
          <path d="M88 99 q12 12 24 0" stroke="#5A3528" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M88 99 q12 12 24 0 q-12 1 -24 0 z" fill="#A84848" opacity="0.45" />
          <path d="M92 102 q8 4 16 0" stroke="#EDE6D6" strokeWidth="0.8" fill="none" />
        </g>
      );
      break;
  }

  return (
    <g>
      {/* eyes */}
      <g>
        {/* sclera */}
        <ellipse cx="87" cy={ey} rx="5" ry="5.2" fill="#FCFAF6" />
        <ellipse cx="113" cy={ey} rx="5" ry="5.2" fill="#FCFAF6" />
        {/* iris */}
        <circle cx={87 + dx} cy={ey + 0.5} r="3.4" fill={irisColor} />
        <circle cx={113 + dx} cy={ey + 0.5} r="3.4" fill={irisColor} />
        {/* pupil */}
        <circle cx={87 + dx} cy={ey + 0.7} r="1.6" fill="#1A0F08" />
        <circle cx={113 + dx} cy={ey + 0.7} r="1.6" fill="#1A0F08" />
        {/* highlight */}
        <circle cx={88.5 + dx} cy={ey - 1} r="1.3" fill="#FFFFFF" />
        <circle cx={114.5 + dx} cy={ey - 1} r="1.3" fill="#FFFFFF" />
        <circle cx={86 + dx} cy={ey + 1.3} r="0.5" fill="#FFFFFF" opacity="0.7" />
        <circle cx={112 + dx} cy={ey + 1.3} r="0.5" fill="#FFFFFF" opacity="0.7" />
      </g>
      {/* brows — slight lift by expression */}
      <g stroke="#3F2614" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d={`M82 ${68 + browLift} q5 -2.5 10 -0.4`} />
        <path d={`M108 ${68 + browLift - 0.4} q5 -2 10 0.4`} />
      </g>
      {/* nose hint */}
      <path d="M99 86 q1 4 2 6 q-2 1 -4 0" stroke={shade(getSkinHex(skin), -0.25)} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* cheeks */}
      <ellipse cx="80" cy="92" rx="5" ry="3" fill="#E89B8E" opacity="0.4" />
      <ellipse cx="120" cy="92" rx="5" ry="3" fill="#E89B8E" opacity="0.4" />
      {/* mouth */}
      {mouth}
    </g>
  );
}

/* ────────────────────────────  Main  ──────────────────────────── */

export default function MountainAvatarComponent({
  avatar,
  variant = "full",
  animate = true,
  className,
  ariaLabel = "Mi explorador",
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const skinHex = getSkinHex(avatar.skinTone);
  const skinShade = shade(skinHex, -0.18);
  const skinHi = shade(skinHex, 0.12);
  const hairHex = getHairHex(avatar.hairColor);
  const topHex = getOutfitHex(avatar.topColor);
  const bottomHex = getOutfitHex(avatar.bottomColor);
  const bootsHex = getOutfitHex(avatar.bootsColor);
  const hatHex = getAccessoryHex(avatar.hatColor);
  const neckHex = getAccessoryHex(avatar.neckColor);
  const bpHex = getAccessoryHex(avatar.backpackColor);

  // ── idle blink + gaze ──
  const [blink, setBlink] = useState(false);
  const [gaze, setGaze] = useState(0);
  useEffect(() => {
    if (!animate) return;
    let cancelled = false;
    const scheduleBlink = () => {
      const wait = 3500 + Math.random() * 2500;
      setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        setTimeout(() => {
          if (cancelled) return;
          setBlink(false);
          // occasional double blink
          if (Math.random() < 0.25) {
            setTimeout(() => {
              if (cancelled) return;
              setBlink(true);
              setTimeout(() => !cancelled && setBlink(false), 110);
            }, 200);
          }
          scheduleBlink();
        }, 130);
      }, wait);
    };
    const scheduleGaze = () => {
      const wait = 2200 + Math.random() * 2800;
      setTimeout(() => {
        if (cancelled) return;
        setGaze(Math.random() * 2 - 1);
        scheduleGaze();
      }, wait);
    };
    scheduleBlink();
    scheduleGaze();
    return () => {
      cancelled = true;
    };
  }, [animate]);

  const viewBox = variant === "bust" ? "40 0 120 130" : "0 0 200 320";

  // Pulse on style change so customization feels responsive.
  const styleHash = useMemo(
    () =>
      `${avatar.skinTone}-${avatar.hairStyle}-${avatar.hairColor}-${avatar.top}-${avatar.topColor}-${avatar.bottom}-${avatar.bottomColor}-${avatar.boots}-${avatar.bootsColor}-${avatar.hat}-${avatar.hatColor}-${avatar.neck}-${avatar.neckColor}-${avatar.backpack}-${avatar.backpackColor}-${avatar.badge}-${avatar.expression}`,
    [avatar],
  );

  return (
    <motion.svg
      key={styleHash}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={cn("block w-full h-full", className)}
      initial={{ scale: 1 }}
      animate={
        animate
          ? { scale: [1, 1.012, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 4.2, repeat: animate ? Infinity : 0, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id={`skin-${uid}`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor={skinHi} />
          <stop offset="0.6" stopColor={skinHex} />
          <stop offset="1" stopColor={skinShade} />
        </radialGradient>
        <linearGradient id={`hair-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(hairHex, 0.18)} />
          <stop offset="1" stopColor={hairHex} />
        </linearGradient>
        {/* Soft drop shadow under feet */}
        <radialGradient id={`floor-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor shadow (full only) */}
      {variant === "full" && (
        <ellipse cx="100" cy="312" rx="60" ry="6" fill={`url(#floor-${uid})`} />
      )}

      {/* Backpack body sits BEHIND torso */}
      <BackpackBody kind={avatar.backpack} color={bpHex} uid={uid} />

      {/* Legs + boots (rendered first so torso overlaps waistline) */}
      <Bottom kind={avatar.bottom} color={bottomHex} uid={uid} />
      <Boots kind={avatar.boots} color={bootsHex} />

      {/* Body — neck + torso silhouette in skin tone */}
      <g>
        {/* neck */}
        <rect x="92" y="100" width="16" height="22" rx="6" fill={`url(#skin-${uid})`} />
        {/* shoulder/arm hint behind jacket — kept subtle */}
        <ellipse cx="62" cy="148" rx="10" ry="22" fill={`url(#skin-${uid})`} opacity="0.0" />
      </g>

      {/* Top (jacket / vest / etc) */}
      <Top kind={avatar.top} color={topHex} uid={uid} />

      {/* Backpack straps cross over the torso */}
      <BackpackStraps kind={avatar.backpack} color={bpHex} />

      {/* Neck accessory (over top) */}
      <Neck kind={avatar.neck} color={neckHex} />

      {/* Badge (chest) */}
      <Badge kind={avatar.badge} />

      {/* Head — drawn after torso so the chin overlaps the collar */}
      <g>
        {/* ears */}
        <ellipse cx="62" cy="76" rx="5" ry="7" fill={`url(#skin-${uid})`} />
        <ellipse cx="138" cy="76" rx="5" ry="7" fill={`url(#skin-${uid})`} />
        {/* head */}
        <ellipse cx="100" cy="68" rx="38" ry="42" fill={`url(#skin-${uid})`} />
        {/* jaw shading */}
        <path d="M62 80 q38 28 76 0 q-12 26 -38 26 q-26 0 -38 -26 z" fill={skinShade} opacity="0.18" />
      </g>

      {/* Hair — drawn over the head */}
      <g>
        <Hair style={avatar.hairStyle} color={hairHex} />
      </g>

      {/* Face — eyes, brows, mouth */}
      <Face skin={avatar.skinTone} expression={avatar.expression} blink={blink} gaze={gaze} />

      {/* Hat — top of head, drawn last so it sits above hair */}
      <Hat kind={avatar.hat} color={hatHex} />
    </motion.svg>
  );
}