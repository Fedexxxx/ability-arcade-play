import { resolveAiAvatarUrl, type AiAvatarVariant } from "@/lib/aiAvatarCatalog";
import { getGearPlacement, isPaired, type GearPos } from "@/lib/gearPositions";
import { getItem } from "@/lib/shopCatalog";
import type { WalletState } from "@/lib/wallet";
import { cn } from "@/lib/utils";

interface Props {
  variant: AiAvatarVariant;
  frame: "bust" | "full";
  equipped: WalletState["equipped"];
  /** Hair color hex used as a multiply tint over the head region. */
  hairColor?: string;
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
  className,
  showHairTint = true,
}: Props) => {
  const url = resolveAiAvatarUrl(variant, frame);

  // Hair region as % of container (head occupies the top portion).
  // For "full" the head is small at the top; for "bust" it's the whole top half.
  const hairRegion = frame === "full"
    ? { top: "4%",  left: "32%", width: "36%", height: "16%" }
    : { top: "6%",  left: "20%", width: "60%", height: "34%" };

  return (
    <div className={cn("relative", className)}>
      <img
        src={url}
        alt="Avatar IA"
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Hair color tint — multiply blend confined to the head region.
          Uses a soft radial mask so edges fade out. */}
      {showHairTint && hairColor && (
        <div
          aria-hidden
          className="absolute pointer-events-none mix-blend-multiply opacity-70"
          style={{
            top: hairRegion.top,
            left: hairRegion.left,
            width: hairRegion.width,
            height: hairRegion.height,
            backgroundColor: hairColor,
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0) 100%)",
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0) 100%)",
            borderRadius: "9999px",
          }}
        />
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