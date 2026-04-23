import { resolveAiAvatarUrl, type AiAvatarVariant } from "@/lib/aiAvatarCatalog";
import { getGearPlacement, isPaired, type GearPos } from "@/lib/gearPositions";
import { getItem } from "@/lib/shopCatalog";
import type { WalletState } from "@/lib/wallet";
import { cn } from "@/lib/utils";
import { readUiPrefs, type HairTypeId } from "@/lib/uiPrefs";

interface Props {
  variant: AiAvatarVariant;
  frame: "bust" | "full";
  equipped: WalletState["equipped"];
  /** Hair color hex used as a multiply tint over the head region. */
  hairColor?: string;
  /** Optional hair-type override. Falls back to UiPrefs. */
  hairType?: HairTypeId;
  className?: string;
  showHairTint?: boolean;
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
  hairColor,
  hairType,
  className,
  showHairTint = true,
}: Props) => {
  const url = resolveAiAvatarUrl(variant, frame);
  const ht: HairTypeId = hairType ?? readUiPrefs().hairType;

  return (
    <div className={cn("relative", className)}>
      <img
        src={url}
        alt="Avatar IA"
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Hair overlay — stylized SVG of the hairstyle in the chosen color.
          This avoids the "color blob" effect of a multiply tint and gives a
          visible stylistic change on top of the AI base render. */}
      {showHairTint && hairColor && (
        <HairOverlay frame={frame} hairType={ht} color={hairColor} />
      )}

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

/** Stylized hair overlay drawn as SVG so it follows the head silhouette
 *  instead of looking like a rectangular tint. Sized in % of the container. */
const HairOverlay = ({
  frame,
  hairType,
  color,
}: {
  frame: "bust" | "full";
  hairType: HairTypeId;
  color: string;
}) => {
  // Head bounding box (as % of container).
  const box = frame === "full"
    ? { top: "3%",  left: "30%", width: "40%", height: "22%" }
    : { top: "2%",  left: "12%", width: "76%", height: "55%" };

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="hairShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {hairType === "corto" && (
          // Cap-like short hair hugging the top of the head.
          <path
            d="M 12,46 C 12,18  88,18  88,46 C 84,40 70,32 50,32 C 30,32 16,40 12,46 Z"
            fill="url(#hairShade)"
          />
        )}
        {hairType === "medio" && (
          // Medium hair: covers top + sides down to ear level.
          <path
            d="M 8,52 C 8,14  92,14  92,52 C 90,58 86,60 84,58 C 82,46 74,38 60,36 C 56,40 44,40 40,36 C 26,38 18,46 16,58 C 14,60 10,58 8,52 Z"
            fill="url(#hairShade)"
          />
        )}
        {hairType === "largo" && (
          // Long hair: top + falling past the shoulders.
          <path
            d="M 6,55 C 6,12  94,12  94,55 C 96,75 92,92 86,98 C 84,82 80,68 74,58 C 70,52 60,48 50,48 C 40,48 30,52 26,58 C 20,68 16,82 14,98 C 8,92 4,75 6,55 Z"
            fill="url(#hairShade)"
          />
        )}
      </svg>
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