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
import {
  CHARACTERS,
  DEFAULT_CHARACTER_ID,
  getCharacter,
} from "@/lib/characters";

interface Props {
  /** Character id from `lib/characters.ts`. Falls back to default when missing. */
  characterId?: string;
  /** 'full' = whole body; 'bust' = focused on head + shoulders (uses CSS framing). */
  variant?: "full" | "bust";
  /** Subtle idle breathe animation. */
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
}

const FALLBACK = CHARACTERS[0]?.image ?? "/avatar/characters/alpine-explorer.png";

const MountainAvatar = ({
  characterId,
  variant = "full",
  animate = true,
  className,
  ariaLabel,
}: Props) => {
  const character = getCharacter(characterId ?? DEFAULT_CHARACTER_ID) ??
    getCharacter(DEFAULT_CHARACTER_ID);
  const src = character?.image ?? FALLBACK;
  const alt = ariaLabel ?? character?.name ?? "Explorador";

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
