import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Challenge } from "@/data/mockData";

interface Props {
  challenge: Challenge;
  submitted: boolean;
  onResolve: (allCorrect: boolean) => void;
}

const DragDropChallenge = ({ challenge, submitted, onResolve }: Props) => {
  const items = challenge.dragItems ?? [];
  const buckets = challenge.buckets ?? [];

  // itemId -> bucketId
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overBucket, setOverBucket] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);

  const remaining = items.filter((it) => !placed[it.id]);
  const allPlaced = remaining.length === 0;

  useEffect(() => {
    if (allPlaced && !submitted) {
      const correct = items.every((it) => placed[it.id] === it.bucket);
      onResolve(correct);
    }
  }, [allPlaced, submitted, items, placed, onResolve]);

  const dropItem = (itemId: string, bucketId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (item.bucket === bucketId) {
      setPlaced((p) => ({ ...p, [itemId]: bucketId }));
    } else {
      setShake(bucketId);
      setTimeout(() => setShake(null), 400);
    }
    setDraggingId(null);
    setOverBucket(null);
  };

  return (
    <>
      <h2 className="font-display text-lg font-bold mb-2">{challenge.question}</h2>
      <p className="text-xs text-muted-foreground mb-4">Arrastra (o toca) cada tarjeta y suéltala en la categoría correcta.</p>

      {/* Pool */}
      <div className="flex flex-wrap gap-2 mb-5 min-h-[60px] p-3 rounded-2xl border border-dashed border-border bg-card/40">
        {remaining.length === 0 ? (
          <span className="text-xs text-muted-foreground m-auto">¡Todo clasificado!</span>
        ) : (
          remaining.map((it) => (
            <motion.button
              key={it.id}
              whileTap={{ scale: 0.95 }}
              draggable
              onDragStart={() => setDraggingId(it.id)}
              onDragEnd={() => setDraggingId(null)}
              onClick={() => setDraggingId(draggingId === it.id ? null : it.id)}
              disabled={submitted}
              className={`px-3 py-2 rounded-xl border-2 text-sm font-medium cursor-grab active:cursor-grabbing transition-all ${
                draggingId === it.id
                  ? "border-primary bg-primary/15 glow-primary"
                  : "border-border bg-card"
              }`}
            >
              {it.label}
            </motion.button>
          ))
        )}
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {buckets.map((b) => {
          const inBucket = items.filter((it) => placed[it.id] === b.id);
          const isOver = overBucket === b.id;
          const isShake = shake === b.id;
          return (
            <motion.div
              key={b.id}
              animate={isShake ? { x: [-6, 6, -4, 4, 0] } : {}}
              onDragOver={(e) => {
                e.preventDefault();
                setOverBucket(b.id);
              }}
              onDragLeave={() => setOverBucket((cur) => (cur === b.id ? null : cur))}
              onDrop={() => draggingId && dropItem(draggingId, b.id)}
              onClick={() => draggingId && dropItem(draggingId, b.id)}
              className={`rounded-2xl border-2 p-3 transition-all ${
                isOver
                  ? "border-primary bg-primary/10"
                  : isShake
                  ? "border-streak bg-streak/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {b.emoji && <span className="text-xl">{b.emoji}</span>}
                <span className="font-display font-semibold text-sm">{b.label}</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {inBucket.length === 0 ? (
                  <span className="text-xs text-muted-foreground italic">Suelta aquí…</span>
                ) : (
                  inBucket.map((it) => (
                    <span key={it.id} className="px-2 py-1 rounded-lg bg-energy/15 border border-energy/40 text-xs text-energy">
                      {it.label}
                    </span>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default DragDropChallenge;
