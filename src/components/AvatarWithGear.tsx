import { useAiAvatarVariant } from "@/hooks/useAiAvatarVariant";
import { useWallet } from "@/hooks/useWallet";
import { useUiPrefs } from "@/hooks/useUiPrefs";
import { cn } from "@/lib/utils";
import AiAvatarCanvas from "@/components/AiAvatarCanvas";

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
  const ui = useUiPrefs();
  const equipped = showGear ? wallet.equipped : {};

  return (
    <div
      className={cn(
        "relative rounded-full bg-card border-2 border-primary/40 shadow-summit overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <AiAvatarCanvas
        variant={aiVariant}
        frame={variant}
        equipped={equipped}
        hairColor={ui.hairColor}
        className="w-full h-full"
      />
    </div>
  );
};

export default AvatarWithGear;
