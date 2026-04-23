import { useAiAvatarVariant } from "@/hooks/useAiAvatarVariant";
import { resolveAiAvatarUrl } from "@/lib/aiAvatarCatalog";
import { useWallet } from "@/hooks/useWallet";
import { getItem } from "@/lib/shopCatalog";
import { cn } from "@/lib/utils";

interface Props {
  /** Legacy: kept for back-compat with existing callers. */
  avatar?: string;
  /** Tailwind size classes for the round container */
  className?: string;
  /** Legacy: ignored. */
  emojiClassName?: string;
  /** Show purchased gear from wallet as overlay glyphs. Defaults to true. */
  showGear?: boolean;
  /** 'bust' (default) for round avatars; 'full' for full-body preview. */
  variant?: "bust" | "full";
}

/**
 * Round avatar — Pixar-style AI image with equipped accessories overlaid as
 * positioned glyphs. Identity is driven by `useAiAvatarVariant()`.
 */
const AvatarWithGear = ({
  className = "w-20 h-20",
  variant = "bust",
  showGear = true,
}: Props) => {
  const aiVariant = useAiAvatarVariant();
  const wallet = useWallet();

  const equipped = showGear ? wallet.equipped : {};
  const hat = equipped.hat ? getItem(equipped.hat) : null;
  const scarf = equipped.scarf ? getItem(equipped.scarf) : null;
  const backpack = equipped.backpack ? getItem(equipped.backpack) : null;
  const boots = equipped.boots ? getItem(equipped.boots) : null;
  const badge = equipped.badge ? getItem(equipped.badge) : null;

  const isFull = variant === "full";

  // Per-variant positions tuned for round avatar vs full body.
  // Values are in % so they scale with container size.
  const slots = isFull
    ? {
        hat:      { top: "4%",  left: "50%", size: "20%", rotate: "-4deg" },
        scarf:    { top: "44%", left: "50%", size: "16%", rotate: "0deg" },
        backpack: { top: "40%", left: "16%", size: "18%", rotate: "-12deg" },
        boots:    { top: "92%", left: "50%", size: "16%", rotate: "0deg" },
        badge:    { top: "48%", left: "70%", size: "12%", rotate: "0deg" },
      }
    : {
        hat:      { top: "4%",  left: "50%", size: "32%", rotate: "-4deg" },
        scarf:    { top: "78%", left: "50%", size: "26%", rotate: "0deg" },
        backpack: { top: "62%", left: "14%", size: "26%", rotate: "-12deg" },
        boots:    { top: "82%", left: "82%", size: "22%", rotate: "0deg" },
        badge:    { top: "62%", left: "78%", size: "20%", rotate: "0deg" },
      };

  return (
    <div
      className={cn(
        "relative rounded-full bg-card border-2 border-primary/40 shadow-summit overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <img
        src={resolveAiAvatarUrl(aiVariant, variant)}
        alt="Tu explorador"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {hat && <GearGlyph glyph={hat.glyph} {...slots.hat} label={hat.name} />}
      {scarf && <GearGlyph glyph={scarf.glyph} {...slots.scarf} label={scarf.name} />}
      {backpack && <GearGlyph glyph={backpack.glyph} {...slots.backpack} label={backpack.name} />}
      {boots && <GearGlyph glyph={boots.glyph} {...slots.boots} label={boots.name} />}
      {badge && <GearGlyph glyph={badge.glyph} {...slots.badge} label={badge.name} />}
    </div>
  );
};

const GearGlyph = ({
  glyph,
  top,
  left,
  size,
  rotate,
  label,
}: {
  glyph: string;
  top: string;
  left: string;
  size: string;
  rotate: string;
  label: string;
}) => (
  <span
    aria-label={label}
    title={label}
    className="absolute -translate-x-1/2 -translate-y-1/2 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] pointer-events-none select-none"
    style={{ top, left, fontSize: size, transform: `translate(-50%, -50%) rotate(${rotate})` }}
  >
    {glyph}
  </span>
);

export default AvatarWithGear;
