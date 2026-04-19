import { motion } from "framer-motion";
import { Flag, Footprints, Mountain as MountainIcon, Compass, Volume2, VolumeX, Sparkles } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { Switch } from "@/components/ui/switch";
import { userProfile } from "@/data/mockData";
import { useSoundEnabled } from "@/hooks/useSoundEnabled";
import { prefersReducedMotion } from "@/lib/prefs";
import { useEffect, useState } from "react";
import Sherpa from "@/components/Sherpa";

const stats = [
  { icon: MountainIcon, label: "Montañas",     value: userProfile.superpowersMastered, color: "text-primary" },
  { icon: Flag,         label: "Checkpoints",  value: userProfile.modulesCompleted,    color: "text-secondary" },
  { icon: Footprints,   label: "Climbs",       value: userProfile.challengesCompleted, color: "text-accent" },
  { icon: Compass,      label: "Monedas",      value: userProfile.coins,                color: "text-primary" },
];

const ExplorerProfilePage = () => {
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
    <div className="min-h-screen pb-28 px-5 pt-8 max-w-lg mx-auto">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-7"
      >
        <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-3">
          <Compass size={14} />
          <span>Explorador</span>
        </div>
        <Sherpa mood="encouraging" size="lg" halo className="mx-auto" />
        <h1 className="font-display text-2xl mt-2">{userProfile.name}</h1>
        <p className="text-sm text-muted-foreground">Nivel {userProfile.level} · Aprendiz de cima</p>

        <div className="max-w-[220px] mx-auto mt-3">
          <ProgressBar value={userProfile.xp} max={userProfile.xpToNext} variant="sunrise" size="md" />
          <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
            {userProfile.xp} / {userProfile.xpToNext} XP hacia el siguiente nivel
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-2 gap-3 mb-7">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl p-4 text-center shadow-terrain"
          >
            <s.icon size={22} className={`mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-display">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Preferencias del viaje
        </h2>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden shadow-terrain">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center">
                {soundEnabled ? (
                  <Volume2 size={18} className="text-primary" />
                ) : (
                  <VolumeX size={18} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold">Sonidos del sendero</p>
                <p className="text-[11px] text-muted-foreground">
                  Pequeñas chimes al llegar a un checkpoint
                </p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              aria-label="Activar sonidos"
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-soft flex items-center justify-center">
                <Sparkles
                  size={18}
                  className={reducedMotion ? "text-muted-foreground" : "text-secondary"}
                />
              </div>
              <div>
                <p className="text-sm font-bold">Celebraciones</p>
                <p className="text-[11px] text-muted-foreground">
                  {reducedMotion
                    ? "Reducidas por preferencia del sistema"
                    : "Pequeñas chispas cuando lo logras"}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                reducedMotion
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary-soft text-secondary"
              }`}
            >
              {reducedMotion ? "Off" : "On"}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 px-1 leading-relaxed">
          Para reducir las animaciones, ajusta "movimiento reducido" en tu sistema operativo.
        </p>
      </section>

      <button className="w-full gradient-sunrise text-secondary-foreground rounded-2xl py-3.5 font-display text-base shadow-summit">
        Personalizar a Sherpa
      </button>
    </div>
  );
};

export default ExplorerProfilePage;
