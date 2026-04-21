import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Sparkles, Zap, Target } from "lucide-react";
import { superpowers } from "@/data/mockData";
import { celebrateBig } from "@/lib/celebrate";
import { unlockModule } from "@/lib/unlocks";
import { earn } from "@/lib/wallet";

const XP_PER_CHALLENGE = 25;
const COIN_MODULE_REWARD = 60;

const ModuleVictoryPage = () => {
  const { spId, modId } = useParams();
  const navigate = useNavigate();
  const firedRef = useRef(false);

  const sp = superpowers.find((s) => s.id === spId);
  const mod = sp?.modules.find((m) => m.id === modId);

  const stats = useMemo(() => {
    if (!mod) return null;
    const total = mod.challenges.length;
    const xp = total * XP_PER_CHALLENGE;
    return { total, xp };
  }, [mod]);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    // Persist the badge as soon as the victory screen is shown
    if (sp && mod) {
      unlockModule({
        spId: sp.id,
        modId: mod.id,
        moduleTitle: mod.title,
        superpowerTitle: sp.title,
        category: sp.category,
        icon: sp.icon,
      });
      earn({
        amount: COIN_MODULE_REWARD,
        reason: "module",
        sourceId: `${sp.id}:${mod.id}`,
        label: `Módulo: ${mod.title}`,
      });
    }
    // Slight delay so the user sees the screen first, then celebrates
    const t = setTimeout(() => celebrateBig(), 250);
    return () => clearTimeout(t);
  }, [sp, mod]);

  if (!sp || !mod || !stats) {
    return <div className="p-4 text-center text-muted-foreground">Módulo no encontrado</div>;
  }

  // Find the next available module in the same superpower (if any)
  const modIdx = sp.modules.findIndex((m) => m.id === modId);
  const nextMod = sp.modules[modIdx + 1];

  return (
    <div className="min-h-screen px-4 pt-8 pb-8 max-w-lg mx-auto flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center text-center"
      >
        {/* Trophy hero */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 blur-2xl gradient-energy opacity-60 rounded-full" />
          <div className="relative w-32 h-32 rounded-full gradient-energy flex items-center justify-center glow-primary">
            <Trophy size={64} className="text-primary-foreground" strokeWidth={2.2} />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles size={28} className="text-xp" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-2"
        >
          ¡Módulo Conquistado!
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl font-bold mb-2"
        >
          {mod.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mb-8"
        >
          Has completado todos los desafíos. ¡Tu cerebro ha evolucionado!
        </motion.p>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="gradient-card rounded-2xl p-4 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center mb-2 mx-auto">
              <Zap size={20} className="text-xp" />
            </div>
            <p className="font-display text-2xl font-bold text-xp">+{stats.xp}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">XP ganado</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="gradient-card rounded-2xl p-4 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-energy/20 flex items-center justify-center mb-2 mx-auto">
              <Target size={20} className="text-energy" />
            </div>
            <p className="font-display text-2xl font-bold text-energy">{stats.total}/{stats.total}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Desafíos</p>
          </motion.div>
        </div>

        {/* Badge unlocked */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, type: "spring" }}
          className="w-full gradient-card rounded-2xl p-5 border border-primary/30 mb-8 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-3">
            Insignia Desbloqueada
          </p>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{sp.icon}</div>
            <div className="flex-1 text-left">
              <p className="font-display font-bold text-base leading-tight">
                Maestro de {mod.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Parte del superpoder <span className="text-foreground font-medium">{sp.title}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full mt-auto space-y-3"
        >
          {nextMod && nextMod.status !== "locked" ? (
            <button
              onClick={() => navigate(`/module/${sp.id}/${nextMod.id}`, { replace: true })}
              className="w-full gradient-energy text-primary-foreground rounded-2xl py-4 font-display font-bold text-lg glow-primary"
            >
              Siguiente Módulo →
            </button>
          ) : !nextMod ? (
            <button
              onClick={() => navigate(`/superpower/${sp.id}/victory`, { replace: true })}
              className="w-full gradient-energy text-primary-foreground rounded-2xl py-4 font-display font-bold text-lg glow-primary"
            >
              ¡Reclamar Maestría! ✨
            </button>
          ) : (
            <button
              onClick={() => navigate(`/superpower/${sp.id}`, { replace: true })}
              className="w-full gradient-energy text-primary-foreground rounded-2xl py-4 font-display font-bold text-lg glow-primary"
            >
              Ver Superpoder
            </button>
          )}
          <button
            onClick={() => navigate("/", { replace: true })}
            className="w-full border border-border text-foreground rounded-2xl py-3 font-semibold"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModuleVictoryPage;
