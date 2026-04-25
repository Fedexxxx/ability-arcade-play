/**
 * BasecampVariantsPreview
 *
 * Horizontal strip showing every Basecamp skin-tone variant as a tiny live
 * thumbnail of the actual character (not just a color swatch). The currently
 * selected variant is highlighted, and tapping a thumb switches the global
 * skin tone — which propagates to every avatar surface in the app via
 * `useCharacter()` + `MountainAvatar`.
 *
 * Use it directly under any live avatar so the user understands that the
 * preview above reflects their selection.
 */

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCharacter } from "@/hooks/useCharacter";
import { setSkinTone } from "@/lib/character/state";
import {
  BASECAMP_SKIN_VARIANTS,
  type BasecampSkinTone,
  type BasecampSkinVariant,
} from "@/lib/basecamp";
import { celebrate } from "@/lib/celebrate";

interface Props {
  /** Optional label rendered above the strip (defaults to “Tu Basecamp”). */
  label?: string;
  /** Hide the label entirely. */
  hideLabel?: boolean;
  /** Compact size for tight surfaces (e.g. profile header). */
  size?: "sm" | "md";
  /** When false, the strip is read-only (no tone change on tap). */
  interactive?: boolean;
  className?: string;
}

const BasecampVariantsPreview = ({
  label = "Tu Basecamp",
  hideLabel = false,
  size = "md",
  interactive = true,
  className,
}: Props) => {
  const { skinTone } = useCharacter();

  const onPick = (tone: BasecampSkinTone) => {
    if (!interactive || tone === skinTone) return;
    setSkinTone(tone);
    celebrate();
  };

  const dim = size === "sm" ? "w-11 h-11" : "w-14 h-14";

  return (
    <div className={cn("w-full", className)}>
      {!hideLabel && (
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-bold text-center mb-1.5">
          {label}
        </p>
      )}
      <div
        role={interactive ? "radiogroup" : undefined}
        aria-label="Variantes de tono de piel de Basecamp"
        className="flex items-center justify-center gap-2"
      >
        {BASECAMP_SKIN_VARIANTS.map((v) => (
          <VariantThumb
            key={v.id}
            variant={v}
            active={v.id === skinTone}
            interactive={interactive}
            sizeClass={dim}
            onClick={() => onPick(v.id)}
          />
        ))}
      </div>
    </div>
  );
};

const VariantThumb = ({
  variant,
  active,
  interactive,
  sizeClass,
  onClick,
}: {
  variant: BasecampSkinVariant;
  active: boolean;
  interactive: boolean;
  sizeClass: string;
  onClick: () => void;
}) => {
  const Inner = (
    <span
      className={cn(
        "relative block rounded-full overflow-hidden border-2 transition-all bg-card",
        sizeClass,
        active
          ? "border-primary shadow-summit"
          : "border-border/70 hover:border-primary/50",
      )}
      style={{ background: variant.swatch }}
    >
      <img
        src={variant.image}
        alt=""
        aria-hidden
        draggable={false}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top scale-[1.85] translate-y-[18%] pointer-events-none select-none"
      />
      {active && (
        <motion.span
          layoutId="basecamp-variant-active"
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-summit ring-2 ring-background"
        >
          <Check size={10} strokeWidth={3} />
        </motion.span>
      )}
    </span>
  );

  if (!interactive) {
    return (
      <span aria-label={variant.label} title={variant.label}>
        {Inner}
      </span>
    );
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={variant.label}
      title={variant.label}
      onClick={onClick}
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {Inner}
    </button>
  );
};

export default BasecampVariantsPreview;