import { useAiAvatarVariant } from "@/hooks/useAiAvatarVariant";
import { resolveAiAvatarUrl } from "@/lib/aiAvatarCatalog";
import { cn } from "@/lib/utils";

interface Props {
  /** Legacy: kept for back-compat with existing callers. Ignored — identity comes from the AI avatar variant. */
  avatar?: string;
  /** Tailwind size classes for the round container */
  className?: string;
  /** Legacy: ignored. */
  emojiClassName?: string;
  /** Legacy: ignored — AI mode does not support gear overlays. */
  showGear?: boolean;
  /** 'bust' (default) for round avatars; 'full' for full-body preview. */
  variant?: "bust" | "full";
}

/**
 * Round avatar that renders the AI Pixar-style explorer for the current variant.
 * Identity is driven by `useAiAvatarVariant()` so changes propagate everywhere.
 */
const AvatarWithGear = ({ className = "w-20 h-20", variant = "bust" }: Props) => {
  const aiVariant = useAiAvatarVariant();

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
    </div>
  );
};

export default AvatarWithGear;
