import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Gift, Zap } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { userProfile, superpowers, missions, areas } from "@/data/mockData";

const HomePage = () => {
  const navigate = useNavigate();
  const activeSP = superpowers.find((s) => s.status === "in-progress");
  const dailyMission = missions.find((m) => m.type === "daily" && !m.completed);
  const activeModule = activeSP?.modules.find((m) => m.status === "in-progress");

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
          {userProfile.avatar}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Nivel {userProfile.level}</p>
          <ProgressBar value={userProfile.xp} max={userProfile.xpToNext} variant="xp" size="sm" />
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {userProfile.xp} / {userProfile.xpToNext} XP
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-full px-3 py-1.5">
          <Flame size={16} className="text-streak" />
          <span className="text-sm font-semibold">{userProfile.streak}</span>
        </div>
      </motion.div>

      {/* Main CTA */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (activeModule && activeSP) {
            navigate(`/module/${activeSP.id}/${activeModule.id}`);
          } else if (activeSP) {
            navigate(`/superpower/${activeSP.id}`);
          }
        }}
        className="w-full gradient-energy text-primary-foreground rounded-2xl p-5 mb-5 glow-primary"
      >
        <p className="text-lg font-display font-bold">Seguir Entrenando</p>
        <p className="text-sm opacity-80 mt-1">Continúa donde lo dejaste</p>
      </motion.button>

      {/* Active Superpower */}
      {activeSP && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-2xl p-4 mb-4 border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{activeSP.icon}</span>
            <div className="flex-1">
              <h3 className="font-display font-semibold">{activeSP.title}</h3>
              {activeModule && (
                <p className="text-xs text-muted-foreground">{activeModule.title}</p>
              )}
            </div>
            <span className="text-sm font-semibold text-primary">{activeSP.progress}%</span>
          </div>
          <ProgressBar value={activeSP.progress} variant="energy" size="sm" />
          <button
            onClick={() => navigate(`/superpower/${activeSP.id}`)}
            className="mt-3 w-full text-center text-sm font-semibold text-primary"
          >
            Continuar Módulo →
          </button>
        </motion.div>
      )}

      {/* Áreas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4"
      >
        <h2 className="font-display text-lg font-bold mb-3">Áreas de Aprendizaje</h2>
        <div className="grid grid-cols-2 gap-2">
          {areas.slice(0, 4).map((area) => (
            <button
              key={area.id}
              onClick={() => navigate(`/explore?area=${area.id}`)}
              className="gradient-card rounded-xl p-3 border border-border text-left active:scale-[0.97] transition-transform"
            >
              <span className="text-2xl">{area.icon}</span>
              <p className="text-xs font-display font-semibold mt-1 truncate">{area.title}</p>
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate("/explore")}
          className="mt-2 w-full text-center text-xs font-semibold text-primary"
        >
          Ver todas las áreas →
        </button>
      </motion.div>

      {/* Daily Mission */}
      {dailyMission && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-2xl p-4 mb-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Zap size={20} className="text-xp" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Misión Diaria</p>
              <p className="text-xs text-muted-foreground">{dailyMission.title}</p>
            </div>
            <span className="text-xs text-xp font-semibold">+{dailyMission.xpReward} XP</span>
          </div>
        </motion.div>
      )}

      {/* Reward Chest */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="gradient-card rounded-2xl p-4 border border-border flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center animate-float">
          <Gift size={20} className="text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Recompensa Diaria</p>
          <p className="text-xs text-muted-foreground">¡Tu cofre está listo!</p>
        </div>
        <button className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold">
          Abrir
        </button>
      </motion.div>
    </div>
  );
};

export default HomePage;
