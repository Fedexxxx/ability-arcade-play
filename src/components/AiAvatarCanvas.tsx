import { useEffect, useState } from "react";
import {
  fileNameFor,
  loadAvatarManifest,
  resolveAiAvatarUrl,
  resolveAiAvatarUrlWithFallback,
  type AiAvatarVariant,
} from "@/lib/aiAvatarCatalog";
import { getGearPlacement, isPaired, type GearPos } from "@/lib/gearPositions";
import { getItem } from "@/lib/shopCatalog";
import type { WalletState } from "@/lib/wallet";
import { cn } from "@/lib/utils";

interface Props {
  variant: AiAvatarVariant;
  frame: "bust" | "full";
  equipped: WalletState["equipped"];
  className?: string;
}

/**
 * Renders the base AI avatar image with:
 *  1. An optional hair-color tint applied via a clipped multiply overlay
 *     (approximates re-coloring without re-rendering the AI image).
 *  2. Equipped cosmetics positioned per item using `getGearPlacement`.
 */
const AiAvatarCanvas = ({
  variant,
  frame,
  equipped,
  className,
}: Props) => {
  const [manifestReady, setManifestReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    loadAvatarManifest().then(() => {
      if (!cancelled) setManifestReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const url = manifestReady
    ? resolveAiAvatarUrlWithFallback(variant, frame)
    : resolveAiAvatarUrl(variant, frame);
  const fallbackUrl = `/avatar/ai/v2/${fileNameFor(
    { ...variant, hairColor: "brown" },
    frame,
  )}`;

  return (
    <div className={cn("relative", className)}>
      <img
        src={url}
        alt="Avatar IA"
        className="w-full h-full object-contain"
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget;
          // Try the brown-hair equivalent once; then explorer/honey/short brown.
          if (img.dataset.fallbackStep === undefined) {
            img.dataset.fallbackStep = "1";
            img.src = fallbackUrl;
          } else if (img.dataset.fallbackStep === "1") {
            img.dataset.fallbackStep = "2";
            img.src = `/avatar/ai/v2/${fileNameFor(
              { outfit: "explorer", skin: "honey", hair: "short", hairColor: "brown" },
              frame,
            )}`;
          }
        }}
      />

      {/* Equipped gear */}
      {Object.entries(equipped).map(([slot, itemId]) => {
        if (!itemId) return null;
        const item = getItem(itemId);
        if (!item) return null;
        const placement = getGearPlacement(item.id, item.slot);
        const pos = frame === "full" ? placement.full : placement.bust;

        if (isPaired(item.slot)) {
          // Render two boots, mirrored around center.
          const leftPct = parseFloat(pos.left);
          const rightLeft = `${100 - leftPct}%`;
          return (
            <span key={slot} aria-hidden>
              <Glyph glyph={item.glyph} pos={pos} label={item.name} />
              <Glyph
                glyph={item.glyph}
                pos={{ ...pos, left: rightLeft, rotate: `-${pos.rotate.replace("-", "")}` }}
                label={item.name}
                mirror
              />
            </span>
          );
        }

        return <Glyph key={slot} glyph={item.glyph} pos={pos} label={item.name} />;
      })}
    </div>
  );
};

const Glyph = ({
  glyph,
  pos,
  label,
  mirror,
}: {
  glyph: string;
  pos: GearPos;
  label: string;
  mirror?: boolean;
}) => (
  <span
    aria-label={label}
    title={label}
    className="absolute leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] pointer-events-none select-none"
    style={{
      top: pos.top,
      left: pos.left,
      fontSize: pos.size,
      transform: `translate(-50%, -50%) rotate(${pos.rotate})${mirror ? " scaleX(-1)" : ""}`,
    }}
  >
    {glyph}
  </span>
);

export default AiAvatarCanvas;