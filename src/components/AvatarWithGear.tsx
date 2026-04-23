import ExplorerSvg from "@/components/ExplorerSvg";
import { useExplorerStyle } from "@/hooks/useExplorerStyle";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";

interface Props {
  /** Legacy: kept for back-compat with existing callers. */
  avatar?: string;
  /** Tailwind size classes for the round container */
  className?: string;
  /** Legacy: ignored. */
  emojiClassName?: string;
  /** Show purchased gear from wallet on top. Defaults to true. */
  showGear?: boolean;
  /** 'bust' (default) for round avatars; 'full' for full-body preview. */
  variant?: "bust" | "full";
}

/**
 * Round avatar that renders the customizable SVG explorer with equipped gear
 * from the wallet. Identity is driven by `useExplorerStyle()` so changes
 * propagate everywhere.
 */
const AvatarWithGear = ({
  className = "w-20 h-20",
  variant = "bust",
  showGear = true,
}: Props) => {
  const style = useExplorerStyle();
  const wallet = useWallet();

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
