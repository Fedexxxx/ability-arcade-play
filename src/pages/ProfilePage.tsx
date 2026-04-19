import { motion } from "framer-motion";
import { Star, BookOpen, Zap, Trophy, Volume2, VolumeX, Sparkles } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { Switch } from "@/components/ui/switch";
import { userProfile } from "@/data/mockData";
import { useSoundEnabled } from "@/hooks/useSoundEnabled";
import { prefersReducedMotion } from "@/lib/prefs";
import { useEffect, useState } from "react";

const stats = [
  { icon: Trophy, label: "Dominados", value: userProfile.superpowersMastered, color: "text-xp" },
  { icon: BookOpen, label: "Módulos", value: userProfile.modulesCompleted, color: "text-power" },
  { icon: Zap, label: "Desafíos", value: userProfile.challengesCompleted, color: "text-energy" },
  { icon: Star, label: "Monedas", value: userProfile.coins, color: "text-accent" },
];

const ProfilePage = () => {
  const [soundEnabled, setSoundEnabled] = useSoundEnabled();
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center text-4xl mb-3">
          {userProfile.avatar}
        </div>
        <h1 className="font-display text-2xl font-bold">{userProfile.name}</h1>
        <p className="text-sm text-muted-foreground">Nivel {userProfile.level}</p>

        <div className="max-w-[200px] mx-auto mt-3">
          <ProgressBar value={userProfile.xp} max={userProfile.xpToNext} variant="xp" size="md" />
          <p className="text-[10px] text-muted-foreground mt-1">
            {userProfile.xp} / {userProfile.xpToNext} XP
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gradient-card rounded-2xl p-4 border border-border text-center"
          >
            <s.icon size={22} className={`mx-auto mb-2 ${s.color}`} />
            <p className="text-xl font-display font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Preferences */}
      <section className="mb-6">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Preferencias
        </h2>
        <div className="gradient-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                {soundEnabled ? (
                  <Volume2 size={18} className="text-energy" />
                ) : (
                  <VolumeX size={18} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Sonidos</p>
                <p className="text-[11px] text-muted-foreground">
                  Fanfares y chimes de celebración
                </p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              aria-label="Activar sonidos"
            />
          </div>

          {/* Reduced motion (read-only OS preference) */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Sparkles
                  size={18}
                  className={reducedMotion ? "text-muted-foreground" : "text-primary"}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Animaciones intensas</p>
                <p className="text-[11px] text-muted-foreground">
                  {reducedMotion
                    ? "Desactivadas por tu sistema (movimiento reducido)"
                    : "Confetti y efectos de celebración activados"}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                reducedMotion
                  ? "bg-muted text-muted-foreground"
                  : "bg-energy/15 text-energy"
              }`}
            >
              {reducedMotion ? "Off" : "On"}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 px-1 leading-relaxed">
          Para cambiar las animaciones, ajusta la preferencia de "movimiento reducido" en tu
          sistema operativo.
        </p>
      </section>

      <button className="w-full gradient-energy text-primary-foreground rounded-2xl py-3 font-display font-bold glow-primary">
        Mejorar Avatar
      </button>
    </div>
  );
};

export default ProfilePage;
