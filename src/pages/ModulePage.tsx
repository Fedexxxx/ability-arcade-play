import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Lock, Clock } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { superpowers } from "@/data/mockData";
import { useDensity } from "@/contexts/AgeDensityContext";

const typeLabels: Record<string, string> = {
  quiz: "quiz",
  visual: "visual",
  matching: "asociar",
  "drag-drop": "arrastrar",
};

const typeColors: Record<string, string> = {
  quiz: "bg-primary/20 text-primary",
  visual: "bg-power/20 text-power",
  matching: "bg-xp/20 text-xp",
  "drag-drop": "bg-streak/20 text-streak",
};

const ModulePage = () => {
  const { spId, modId } = useParams();
  const navigate = useNavigate();
  const density = useDensity();
  const sp = superpowers.find((s) => s.id === spId);
  const mod = sp?.modules.find((m) => m.id === modId);

  if (!sp || !mod) return <div className="p-4 text-center text-muted-foreground">No encontrado</div>;

  const heroTitle = density.scale === "lg" ? "text-2xl" : density.scale === "md" ? "text-xl" : "text-lg";
  const cardPad = density.scale === "lg" ? "p-4" : density.scale === "md" ? "p-3.5" : "p-3";
  const cardTitle = density.scale === "lg" ? "text-base" : density.scale === "md" ? "text-sm" : "text-sm";
  const cardIcon = density.scale === "lg" ? "w-11 h-11" : density.scale === "md" ? "w-8 h-8" : "w-7 h-7";

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft size={24} />
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`font-display ${heroTitle} font-bold mb-1`}>{mod.title}</h1>
        {density.showSubtext && (
          <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>
        )}

        <div className="mb-6">
          <ProgressBar value={mod.completion} variant="energy" size="md" showLabel />
        </div>

        <div className="space-y-2">
          {mod.challenges.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => ch.status !== "locked" && navigate(`/challenge/${sp.id}/${mod.id}/${ch.id}`)}
              className={`gradient-card rounded-xl ${cardPad} border border-border flex items-center gap-3 ${
                ch.status === "locked" ? "opacity-40" : "cursor-pointer active:scale-[0.98] transition-transform"
              }`}
            >
              <div className={`${cardIcon} rounded-lg bg-muted flex items-center justify-center`}>
                {ch.status === "completed" ? (
                  <CheckCircle2 size={density.scale === "lg" ? 22 : 16} className="text-energy" />
                ) : ch.status === "locked" ? (
                  <Lock size={density.scale === "lg" ? 18 : 14} className="text-muted-foreground" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${cardTitle} font-medium truncate`}>{ch.title}</p>
                {density.showSubtext && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[ch.type]}`}>
                      {typeLabels[ch.type]}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock size={10} /> {ch.duration}
                    </span>
                  </div>
                )}
              </div>
              {ch.status === "available" && (
                <span className="text-xs font-bold text-primary">Entrenar →</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ModulePage;
