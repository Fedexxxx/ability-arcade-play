import MountainAvatar from "@/components/avatar/MountainAvatar";
import { useMountainAvatar } from "@/hooks/useMountainAvatar";
import { cn } from "@/lib/utils";

interface Props {
  avatar?: string; // legacy, ignored
  className?: string;
  emojiClassName?: string; // legacy, ignored
  showGear?: boolean; // legacy, kept for compat (gear is now baked into the avatar config)
  variant?: "bust" | "full";
}

const AvatarWithGear = ({ className = "w-20 h-20", variant = "bust" }: Props) => {
  const a = useMountainAvatar();
  return (
    <div className={cn("relative rounded-full bg-card border-2 border-primary/40 shadow-summit overflow-hidden flex items-center justify-center", className)}>
      <MountainAvatar avatar={a} variant={variant} className="w-full h-full" />
    </div>
  );
};

export default AvatarWithGear;
