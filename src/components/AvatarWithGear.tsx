import MountainAvatar from "@/components/avatar/MountainAvatar";
import { useCharacter } from "@/hooks/useCharacter";
import { cn } from "@/lib/utils";

interface Props {
  /** Legacy emoji avatar — ignored. Kept so older call sites still type-check. */
  avatar?: string;
  className?: string;
  /** Legacy. Ignored. */
  emojiClassName?: string;
  /** Legacy. Gear is now baked into the chosen character. */
  showGear?: boolean;
  variant?: "bust" | "full";
}

const AvatarWithGear = ({ className = "w-20 h-20", variant = "bust" }: Props) => {
  const { characterId } = useCharacter();
  return (
    <div
      className={cn(
        "relative rounded-full bg-card border-2 border-primary/40 shadow-summit overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <MountainAvatar characterId={characterId} variant={variant} className="w-full h-full" />
    </div>
  );
};

export default AvatarWithGear;
