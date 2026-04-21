import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Sparkles, Star, Zap, Award } from "lucide-react";
import { superpowers } from "@/data/mockData";
import { celebrateEpic } from "@/lib/celebrate";
import { unlockSuperpower } from "@/lib/unlocks";
import { earn } from "@/lib/wallet";

const XP_PER_CHALLENGE = 25;
const MASTERY_BONUS = 250;
const COIN_SUPERPOWER_REWARD = 300;

const SuperpowerVictoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const firedRef = useRef(false);

  const sp = superpowers.find((s) => s.id === id);

  const stats = useMemo(() => {
    if (!sp) return null;
    const totalChallenges = sp.modules.reduce(
      (acc, m) => acc + m.challenges.length,
      0,
    );
    const totalModules = sp.modules.length;
    const xp = totalChallenges * XP_PER_CHALLENGE + MASTERY_BONUS;
    return { totalChallenges, totalModules, xp };
  }, [sp]);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (sp) {
      unlockSuperpower({
        spId: sp.id,
        superpowerTitle: sp.title,
        category: sp.category,
        icon: sp.icon,
      });
      earn({
        amount: COIN_SUPERPOWER_REWARD,
        reason: "superpower",
        sourceId: sp.id,
        label: `Montaña: ${sp.title}`,
      });
    }
    const t = setTimeout(() => celebrateEpic(), 350);
    return () => clearTimeout(t);
  }, [sp]);

  if (!sp || !stats) {
    return <div className="p-4 text-center text-muted-foreground">Superpoder no encontrado</div>;
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-8 max-w-lg mx-auto flex flex-col relative overflow-hidden">
      {/* Ambient golden glow background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-xp/20 blur-[120px]" />
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 w-48 h-48 rounded-full bg-energy/20 blur-3xl" />
      </motion.div>

      <div className="relative flex-1 flex flex-col items-center text-center">
        {/* Header eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] uppercase tracking-[0.3em] text-xp font-bold mb-3"
        >
          ★ Superpoder Dominado ★
        </motion.p>

        {/* Avatar Evolution */}
        <div className="relative mb-2 h-44 flex items-center justify-center">
          {/* Rotating golden aura */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute w-56 h-56"
          >
            <div
              className="w-full h-full rounded-full opacity-70"
              style={{
                background:
                  "conic-gradient(from 0deg, hsl(var(--xp)) 0deg, transparent 90deg, hsl(var(--primary)) 180deg, transparent 270deg, hsl(var(--xp)) 360deg)",
                filter: "blur(20px)",
              }}
            />
          </motion.div>

          {/* Pulsing inner glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-40 h-40 rounded-full bg-xp/40 blur-2xl"
          />

          {/* Avatar evolution sequence */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, filter: "blur(12px)" }}
            animate={{
              scale: [0.4, 0.7, 0.55, 1.1, 1],
              opacity: [0, 0.6, 0.8, 1, 1],
              filter: [
                "blur(12px)",
                "blur(6px)",
                "blur(3px)",
                "blur(0px)",
                "blur(0px)",
              ],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.25, 0.5, 0.85, 1],
              ease: "easeOut",
            }}
            className="relative z-10"
          >
            <div className="text-7xl drop-shadow-[0_0_20px_hsl(var(--xp)/0.6)]">
              {sp.icon}
            </div>
          </motion.div>

          {/* Crown floating above */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0 }}
            animate={{ y: -50, opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 180, damping: 12 }}
            className="absolute z-20"
          >
            <Crown
              size={42}
              className="text-xp drop-shadow-[0_0_12px_hsl(var(--xp)/0.9)]"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </motion.div>

          {/* Orbiting sparkles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                delay: 1.5 + i * 0.3,
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
              className="absolute"
              style={{
                top: `${30 + Math.sin((i * Math.PI) / 2) * 60}%`,
                left: `${50 + Math.cos((i * Math.PI) / 2) * 40}%`,
              }}
            >
              <Sparkles size={18} className="text-xp" />
            </motion.div>
          ))}
        </div>

        {/* Golden Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180, y: 20 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ delay: 1.8, type: "spring", stiffness: 200, damping: 14 }}
          className="relative mt-6 mb-4"
        >
          <div className="absolute inset-0 blur-2xl bg-xp/60 rounded-full" />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--xp)) 0%, #fbbf24 50%, hsl(var(--xp)) 100%)",
              boxShadow:
                "0 0 40px hsl(var(--xp) / 0.7), inset 0 2px 8px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <Award
              size={52}
              className="text-background"
              strokeWidth={2.5}
              fill="currentColor"
            />
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-3"
          >
            <Star size={20} className="text-xp fill-xp" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="font-display text-3xl font-bold mb-1"
        >
          {sp.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1 }}
          className="text-sm text-muted-foreground mb-1 max-w-xs"
        >
          Has dominado este superpoder por completo.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="text-xs text-xp font-semibold uppercase tracking-wider mb-6"
        >
          Tu mente ha evolucionado ✨
        </motion.p>

        {/* Stats grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3 }}
            className="gradient-card rounded-2xl p-3 border border-xp/30 text-center"
          >
            <Zap size={18} className="text-xp mx-auto mb-1" />
            <p className="font-display text-lg font-bold text-xp">+{stats.xp}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">XP Total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.35 }}
            className="gradient-card rounded-2xl p-3 border border-border text-center"
          >
            <Award size={18} className="text-energy mx-auto mb-1" />
            <p className="font-display text-lg font-bold text-energy">
              {stats.totalModules}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Módulos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="gradient-card rounded-2xl p-3 border border-border text-center"
          >
            <Star size={18} className="text-primary mx-auto mb-1" />
            <p className="font-display text-lg font-bold text-primary">
              {stats.totalChallenges}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Desafíos</p>
          </motion.div>
        </div>

        {/* Master Title card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, type: "spring" }}
          className="w-full rounded-2xl p-5 border border-xp/40 mb-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--xp) / 0.15) 0%, hsl(var(--primary) / 0.1) 100%)",
          }}
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-xp/20 rounded-full blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-xp font-bold mb-2">
            ◆ Título de Maestría ◆
          </p>
          <p className="font-display font-bold text-xl leading-tight">
            Gran Maestro de {sp.title}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Categoría: <span className="text-foreground font-medium">{sp.category}</span>
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7 }}
          className="w-full mt-auto space-y-3"
        >
          <button
            onClick={() => navigate("/explore", { replace: true })}
            className="w-full gradient-energy text-primary-foreground rounded-2xl py-4 font-display font-bold text-lg glow-primary"
          >
            Descubrir Nuevo Superpoder →
          </button>
          <button
            onClick={() => navigate("/achievements", { replace: true })}
            className="w-full border border-xp/40 text-xp rounded-2xl py-3 font-semibold"
          >
            Ver Mis Logros
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="w-full text-muted-foreground rounded-2xl py-2 text-sm"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperpowerVictoryPage;
