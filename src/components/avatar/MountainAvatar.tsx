/**
 * Pre-rendered PNG character renderer.
 *
 * Replaces the old layered SVG system. The avatar is now a single, complete
 * Pixar-style image chosen from the curated catalog in `lib/characters.ts`.
 * No layers, no overlays, no clipping risks — what you see is what was
 * rendered.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCharacter } from "@/lib/characters";
import {
  BASECAMP_SKIN_VARIANTS,
  getGearSet,
  getSkinVariant,
} from "@/lib/basecamp";
import { useCharacter } from "@/hooks/useCharacter";

interface Props {
  /**
   * Character id from `lib/characters.ts`. Falls back to the user's selected
   * Basecamp variant when omitted. NPC ids (alpine, glacier, summit, …) still
   * resolve to their pre-rendered PNG so they can appear in modules and story
   * moments.
   */
  characterId?: string;
  /** 'full' = whole body; 'bust' = focused on head + shoulders (uses CSS framing). */
  variant?: "full" | "bust";
  /** Subtle idle breathe animation. */
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
}

// If anything goes wrong loading a Basecamp PNG we still want the user to see
// Basecamp — never an unrelated NPC explorer (Alpine, Glacier, …).
const FALLBACK =
  BASECAMP_SKIN_VARIANTS[0]?.image ?? "/avatar/basecamp/basecamp-light-warm.png";

const MountainAvatar = ({
  characterId,
  variant = "full",
  animate = true,
  className,
  ariaLabel,
}: Props) => {
  const { skinTone, equippedGearSetId } = useCharacter();

  // No explicit id (or explicitly the Basecamp character) → render the user's
  // current Basecamp look. If they have a gear set equipped, show that
  // pre-rendered PNG; otherwise fall back to the chosen skin-tone variant.
  // Any non-Basecamp id renders an NPC (story moments only).
  const isBasecamp = !characterId || characterId === "basecamp-explorer";
  const skin = getSkinVariant(skinTone);
  const gear = isBasecamp ? getGearSet(equippedGearSetId) : undefined;
  const npc = isBasecamp ? null : getCharacter(characterId);

  const src = isBasecamp
    ? gear?.image || skin.image
    : npc?.image ?? FALLBACK;
  const alt =
    ariaLabel ??
    (isBasecamp ? gear?.name ?? "Basecamp" : npc?.name ?? "Explorador");

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden",
        // Bust crops the top portion of the full character image.
        variant === "bust" ? "" : "",
        className,
      )}
      aria-label={alt}
      role="img"
    >
      <motion.img
        key={src}
        src={src}
        alt={alt}
        draggable={false}
        initial={animate ? { opacity: 0, scale: 0.96 } : false}
        animate={animate ? { opacity: 1, scale: 1 } : { opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "w-full h-full object-contain select-none pointer-events-none",
          // Bust framing: scale up & shift down so we crop to head+shoulders.
          variant === "bust" && "scale-[1.85] translate-y-[18%]",
        )}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.dataset.fallback !== "1") {
            img.dataset.fallback = "1";
            img.src = FALLBACK;
          }
        }}
      />

      {animate && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default MountainAvatar;
