import { forwardRef } from "react";
import Sherpa, { type SherpaMood } from "@/components/Sherpa";
import { motion, AnimatePresence } from "framer-motion";

interface SherpaSpeechProps {
  message: string;
  mood?: SherpaMood;
  size?: "xs" | "sm" | "md" | "lg";
  /** Layout: bubble on the right of Sherpa (default) or below */
  layout?: "row" | "column";
  className?: string;
}

/**
 * Sherpa with a speech bubble — used to guide, encourage,
 * or react to user actions. Short, motivating phrases only.
 *
 * forwardRef so framer-motion's AnimatePresence can attach refs cleanly
 * when this component is rendered as a direct child of <AnimatePresence>.
 */
const SherpaSpeech = forwardRef<HTMLDivElement, SherpaSpeechProps>(
  ({ message, mood = "encouraging", size = "sm", layout = "row", className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex ${layout === "row" ? "items-end gap-3" : "flex-col items-center gap-2"} ${className}`}
      >
        <Sherpa mood={mood} size={size} halo />
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[16rem] rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-2.5 shadow-terrain"
          >
            <p className="text-sm font-medium text-foreground leading-snug">{message}</p>
            {/* tail */}
            {layout === "row" && (
              <span
                aria-hidden
                className="absolute -left-1.5 bottom-3 w-3 h-3 rotate-45 bg-card border-l border-b border-border"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);

SherpaSpeech.displayName = "SherpaSpeech";

export default SherpaSpeech;
