import { motion, type HTMLMotionProps } from "framer-motion";
import idleSrc from "@/assets/sherpa-idle.png";
import pointingSrc from "@/assets/sherpa-pointing.png";
import celebratingSrc from "@/assets/sherpa-celebrating.png";
import thinkingSrc from "@/assets/sherpa-thinking.png";
import encouragingSrc from "@/assets/sherpa-encouraging.png";

export type SherpaMood = "idle" | "pointing" | "celebrating" | "thinking" | "encouraging";

const sources: Record<SherpaMood, string> = {
  idle: idleSrc,
  pointing: pointingSrc,
  celebrating: celebratingSrc,
  thinking: thinkingSrc,
  encouraging: encouragingSrc,
};

const altLabels: Record<SherpaMood, string> = {
  idle: "Sherpa, tu guía, esperando con calma",
  pointing: "Sherpa señalando el siguiente paso",
  celebrating: "Sherpa celebrando un logro",
  thinking: "Sherpa pensando una buena pista",
  encouraging: "Sherpa animándote con un pulgar arriba",
};

const sizeMap = {
  xs: "w-16 h-16",
  sm: "w-24 h-24",
  md: "w-36 h-36",
  lg: "w-48 h-48",
  xl: "w-64 h-64",
} as const;

interface SherpaProps extends Omit<HTMLMotionProps<"div">, "children"> {
  mood?: SherpaMood;
  size?: keyof typeof sizeMap;
  /** Add a soft glow halo behind Sherpa */
  halo?: boolean;
  /** Subtle breathing/bobbing animation */
  animate?: boolean;
  priority?: boolean;
}

/**
 * Sherpa — the soul of the experience.
 * Renders the appropriate illustration for the current mood
 * with subtle "alive" motion. Use across screens to give
 * consistent guidance and warmth.
 */
const Sherpa = ({
  mood = "idle",
  size = "md",
  halo = false,
  animate = true,
  priority = false,
  className = "",
  ...rest
}: SherpaProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative inline-block ${sizeMap[size]} ${className}`}
      {...rest}
    >
      {halo && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-70"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--sunrise-2) / 0.55), hsl(var(--primary) / 0.15) 55%, transparent 70%)",
          }}
        />
      )}
      <img
        key={mood}
        src={sources[mood]}
        alt={altLabels[mood]}
        loading={priority ? "eager" : "lazy"}
        width={512}
        height={512}
        className={`w-full h-full object-contain shadow-sherpa select-none pointer-events-none ${
          animate ? (mood === "idle" ? "animate-sherpa-breathe" : "animate-sherpa-bob") : ""
        }`}
        draggable={false}
      />
    </motion.div>
  );
};

export default Sherpa;
