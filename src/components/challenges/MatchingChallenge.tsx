import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Challenge } from "@/data/mockData";

interface Props {
  challenge: Challenge;
  submitted: boolean;
  onResolve: (allCorrect: boolean) => void;
}

// Shuffle helper
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const MatchingChallenge = ({ challenge, submitted, onResolve }: Props) => {
  const pairs = challenge.pairs ?? [];
  const lefts = useMemo(() => pairs.map((p) => p.left), [pairs]);
  const rights = useMemo(() => shuffle(pairs.map((p) => p.right)), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const allMatched = Object.keys(matches).length === pairs.length;

  useEffect(() => {
    if (allMatched && !submitted) {
      // All pairs were matched correctly by construction (we only allow correct matches)
      onResolve(true);
    }
  }, [allMatched, submitted, onResolve]);

  const handleRight = (right: string) => {
    if (!selectedLeft || submitted) return;
    const pair = pairs.find((p) => p.left === selectedLeft);
    if (pair && pair.right === right) {
      setMatches((prev) => ({ ...prev, [selectedLeft]: right }));
      setSelectedLeft(null);
    } else {
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 400);
    }
  };

  return (
    <>
      <h2 className="font-display text-lg font-bold mb-2">{challenge.question}</h2>
      <p className="text-xs text-muted-foreground mb-4">Toca un elemento de la izquierda y luego su pareja a la derecha.</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="space-y-2">
          {lefts.map((l) => {
            const matched = !!matches[l];
            const isSel = selectedLeft === l;
            return (
              <motion.button
                key={l}
                whileTap={{ scale: matched ? 1 : 0.96 }}
                disabled={matched || submitted}
                onClick={() => setSelectedLeft(l)}
                className={`w-full p-3 rounded-xl border-2 text-center font-display text-lg transition-all ${
                  matched
                    ? "border-energy bg-energy/15 text-energy opacity-70"
                    : isSel
                    ? "border-primary bg-primary/15 glow-primary"
                    : "border-border bg-card"
                }`}
              >
                {l}
                {matched && <Check size={14} className="inline ml-1" />}
              </motion.button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((r) => {
            const matched = Object.values(matches).includes(r);
            const isWrong = wrongFlash === r;
            return (
              <motion.button
                key={r}
                whileTap={{ scale: matched ? 1 : 0.96 }}
                disabled={matched || submitted}
                onClick={() => handleRight(r)}
                animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
                className={`w-full p-3 rounded-xl border-2 text-center text-base transition-all ${
                  matched
                    ? "border-energy bg-energy/15 opacity-70"
                    : isWrong
                    ? "border-streak bg-streak/15"
                    : "border-border bg-card"
                }`}
              >
                {r}
              </motion.button>
            );
          })}
        </div>
      </div>
      {allMatched && (
        <p className="text-center text-energy font-semibold text-sm mb-2">¡Todas las parejas conectadas! 🎉</p>
      )}
    </>
  );
};

export default MatchingChallenge;
