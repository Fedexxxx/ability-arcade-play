import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "energy" | "xp" | "power" | "summit" | "sunrise" | "default";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const variantClasses = {
  energy: "gradient-energy",
  xp: "gradient-xp",
  summit: "gradient-summit",
  sunrise: "gradient-sunrise",
  power: "bg-summit",
  default: "bg-primary",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const ProgressBar = ({ value, max = 100, variant = "default", size = "md", showLabel }: ProgressBarProps) => {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`w-full rounded-full bg-muted overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${variantClasses[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
