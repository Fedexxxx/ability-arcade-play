import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle2 } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { missions } from "@/data/mockData";

const tabLabels = { daily: "Diarias", weekly: "Semanales" };

const MissionsPage = () => {
  const [tab, setTab] = useState<"daily" | "weekly">("daily");
  const filtered = missions.filter((m) => m.type === tab);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-bold mb-4">Misiones</h1>

      <div className="flex gap-2 mb-5">
        {(["daily", "weekly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`gradient-card rounded-2xl p-4 border border-border ${m.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.completed ? "bg-energy/20" : "bg-muted"}`}>
                {m.completed ? <CheckCircle2 size={18} className="text-energy" /> : <Zap size={18} className="text-xp" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{m.title}</p>
                <p className="text-[10px] text-muted-foreground">{m.description}</p>
              </div>
              <span className="text-xs font-bold text-xp">+{m.xpReward} XP</span>
            </div>
            <ProgressBar value={m.progress} max={m.target} variant="energy" size="sm" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {m.progress}/{m.target} {m.completed ? "✓ Completada" : ""}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MissionsPage;
