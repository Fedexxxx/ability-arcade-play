import MountainAvatar from "@/components/avatar/MountainAvatar";
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
  // Basecamp is the user's only avatar. We deliberately ignore any stored
  // characterId here so legacy values (e.g. "alpine-explorer") can never
  // surface as the user's identity. NPC characters are rendered explicitly
  // by their consumers via <MountainAvatar characterId="..." />.
  return (
    <div
      className={cn(
        "relative rounded-full bg-card border-2 border-primary/40 shadow-summit overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <MountainAvatar variant={variant} className="w-full h-full" />
    </div>
  );
};

export default AvatarWithGear;
