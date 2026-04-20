import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Swords, CheckCircle2 } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { superpowers } from "@/data/mockData";
import { useDensity } from "@/contexts/AgeDensityContext";

const statusIcon = {
  locked: <Lock size={16} className="text-muted-foreground" />,
  available: <div className="w-4 h-4 rounded-full border-2 border-primary" />,
  "in-progress": <div className="w-4 h-4 rounded-full border-2 border-energy bg-energy/30" />,
  completed: <CheckCircle2 size={16} className="text-energy" />,
};

const SuperpowerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sp = superpowers.find((s) => s.id === id);

  if (!sp) return <div className="p-4 text-center text-muted-foreground">No encontrado</div>;

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft size={24} />
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <span className={`${heroIconSize} block mb-3`}>{sp.icon}</span>
          <h1 className={`font-display ${heroTitle} font-bold`}>{sp.title}</h1>
          {density.showSubtext && (
            <p className="text-sm text-muted-foreground mt-2">{sp.description}</p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progreso General</span>
            <span className="font-semibold">{sp.progress}%</span>
          </div>
          <ProgressBar value={sp.progress} variant="energy" size="md" />
        </div>

        <div className="space-y-3">
          {sp.modules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => mod.status !== "locked" && navigate(`/module/${sp.id}/${mod.id}`)}
              className={`gradient-card rounded-2xl ${cardPad} border border-border ${
                mod.status === "locked" ? "opacity-50" : "cursor-pointer active:scale-[0.98] transition-transform"
              }`}
            >
              <div className="flex items-center gap-3">
                {mod.isBoss ? (
                  <div className={`${modIcon} rounded-xl bg-streak/20 flex items-center justify-center`}>
                    <Swords size={density.scale === "lg" ? 22 : 16} className="text-streak" />
                  </div>
                ) : (
                  <div className={`${modIcon} rounded-xl bg-muted flex items-center justify-center`}>
                    {statusIcon[mod.status]}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`font-display font-semibold ${modTitle}`}>{mod.title}</h3>
                  {density.showSubtext && (
                    <p className="text-[10px] text-muted-foreground">
                      {mod.challenges.length} desafíos
                    </p>
                  )}
                </div>
                {mod.status !== "locked" && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    {mod.completion}%
                  </span>
                )}
              </div>
              {mod.status === "in-progress" && (
                <div className="mt-2">
                  <ProgressBar value={mod.completion} variant="energy" size="sm" />
                </div>
              )}
              {(mod.status === "available" || mod.status === "in-progress") && (
                <button className="mt-2 w-full text-center text-xs font-bold text-primary">
                  {mod.status === "available" ? "Iniciar Módulo" : "Continuar Módulo"} →
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SuperpowerPage;
