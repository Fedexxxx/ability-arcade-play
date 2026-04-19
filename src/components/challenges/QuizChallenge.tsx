import { motion } from "framer-motion";
import type { Challenge } from "@/data/mockData";

interface Props {
  challenge: Challenge;
  selected: number | null;
  submitted: boolean;
  onSelect: (i: number) => void;
}

const QuizChallenge = ({ challenge, selected, submitted, onSelect }: Props) => {
  if (!challenge.options) return null;
  return (
    <>
      <h2 className="font-display text-lg font-bold mb-6">{challenge.question}</h2>
      <div className="space-y-3 mb-6">
        {challenge.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={() => !submitted && onSelect(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected === i
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <span className="text-sm">{opt}</span>
          </motion.button>
        ))}
      </div>
    </>
  );
};

export default QuizChallenge;
