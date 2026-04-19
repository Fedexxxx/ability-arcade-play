import { motion } from "framer-motion";
import type { Challenge } from "@/data/mockData";

interface Props {
  challenge: Challenge;
  selected: number | null;
  submitted: boolean;
  onSelect: (i: number) => void;
}

const VisualChallenge = ({ challenge, selected, submitted, onSelect }: Props) => {
  if (!challenge.visualOptions) return null;
  return (
    <>
      <h2 className="font-display text-lg font-bold mb-6">{challenge.question}</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {challenge.visualOptions.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => !submitted && onSelect(i)}
            className={`aspect-square flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
              selected === i
                ? "border-primary bg-primary/15 glow-primary"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <span className="text-3xl mb-2 leading-tight text-center break-all">{opt.emoji}</span>
            <span className="text-xs text-muted-foreground text-center">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </>
  );
};

export default VisualChallenge;
