import { useWallet } from "@/hooks/useWallet";
import { useExplorerStyle } from "@/hooks/useExplorerStyle";
import ExplorerSvg from "@/components/ExplorerSvg";
import { cn } from "@/lib/utils";

interface Props {
  /** Legacy: kept for back-compat with existing callers. Ignored — visual identity now comes from ExplorerStyle. */
  avatar?: string;
  /** Tailwind size classes for the round container */
  className?: string;
  /** Legacy: ignored. */
  emojiClassName?: string;
  /** Show equipped accessory overlays. Defaults to true. */
  showGear?: boolean;
  /** 'bust' (default) for round avatars; 'full' for full-body preview. */
  variant?: "bust" | "full";
}

/**
 * Round avatar that renders the layered SVG explorer with equipped cosmetics.
 * Drop-in replacement for the legacy emoji avatar — identity is now driven
 * by `useExplorerStyle()` so changes propagate to every surface instantly.
 */
const AvatarWithGear = ({
  className = "w-20 h-20",
  showGear = true,
  variant = "bust",
}: Props) => {
  const wallet = useWallet();
  const style = useExplorerStyle();

  return (
    <div
      className={cn(
        "relative rounded-full bg-card border-2 border-primary/40 shadow-summit overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <ExplorerSvg
        style={style}
        gear={showGear ? wallet.equipped : {}}
        variant={variant}
        className="w-full h-full"
      />
    </div>
  );
};

export default AvatarWithGear;
