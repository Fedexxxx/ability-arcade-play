import { useWallet } from "@/hooks/useWallet";
import { getItem } from "@/lib/shopCatalog";
import { cn } from "@/lib/utils";

interface Props {
  /** Base emoji avatar */
  avatar: string;
  /** Tailwind size classes for the round container */
  className?: string;
  /** Avatar emoji size class (e.g. text-4xl) */
  emojiClassName?: string;
  /** Show equipped accessory overlays (badge, hat, scarf). Defaults to true. */
  showGear?: boolean;
}

/**
 * Round avatar that overlays the explorer's equipped cosmetics.
 * MVP: hat sits on top, badge on top-right, scarf on bottom-left,
 * backpack on bottom-right. Boots are shown in the shop preview only.
 */
const AvatarWithGear = ({
  avatar,
  className = "w-20 h-20",
  emojiClassName = "text-4xl",
  showGear = true,
}: Props) => {
  const wallet = useWallet();
  const eq = wallet.equipped;

  const glyph = (slot: keyof typeof eq) => {
    const id = eq[slot];
    if (!id) return null;
    return getItem(id)?.glyph ?? null;
  };

  const hat = showGear ? glyph("hat") : null;
  const scarf = showGear ? glyph("scarf") : null;
  const backpack = showGear ? glyph("backpack") : null;
  const badge = showGear ? glyph("badge") : null;

  return (
    <div
      className={cn(
        "relative rounded-full bg-card border-2 border-primary/40 shadow-summit flex items-center justify-center",
        className,
      )}
    >
      <span className={emojiClassName} aria-hidden>
        {avatar}
      </span>

      {hat && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl drop-shadow-md"
        >
          {hat}
        </span>
      )}
      {badge && (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-card border border-border shadow-terrain flex items-center justify-center text-xs"
        >
          {badge}
        </span>
      )}
      {scarf && (
        <span
          aria-hidden
          className="absolute -bottom-1 -left-1 text-lg drop-shadow"
        >
          {scarf}
        </span>
      )}
      {backpack && (
        <span
          aria-hidden
          className="absolute -bottom-1 -right-1 text-lg drop-shadow"
        >
          {backpack}
        </span>
      )}
    </div>
  );
};

export default AvatarWithGear;
