import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Tent, ArrowRight, Mountain, Sparkles, Calendar, Compass } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import SherpaSpeech from "@/components/SherpaSpeech";
import Sherpa from "@/components/Sherpa";
import { userProfile, superpowers, missions } from "@/data/mockData";
import { useExplorer } from "@/hooks/useExplorer";
import { useDensity } from "@/contexts/AgeDensityContext";
import { useWallet } from "@/hooks/useWallet";
import AvatarWithGear from "@/components/AvatarWithGear";
import mountainBg from "@/assets/mountain-bg.jpg";

const greetings = [
  "Buen día",
  "A subir",
  "Hoy avanzamos",
];

// Rotating Sherpa quotes — picked deterministically by streak so the
// quote stays stable across re-renders within the same day.
const SHERPA_QUOTES = [
  { quote: "Un paso a la vez, llegamos lejos.", author: "Sherpa" },
  { quote: "La cumbre se conquista por la mañana.", author: "Sherpa" },
  { quote: "Cada respiro es un metro más.", author: "Sherpa" },
  { quote: "El que sube despacio, sube seguro.", author: "Sherpa" },
  { quote: "La montaña recompensa al constante.", author: "Sherpa" },
  { quote: "Tu mejor récord es el de mañana.", author: "Sherpa" },
];

/** Streak milestone — returns the ring class + emoji label, or null. */
function streakMilestone(streak: number): { ring: string; label: string } | null {
  if (streak >= 30) return { ring: "ring-2 ring-streak shadow-summit", label: `🔥 ${streak} días` };
  if (streak >= 14) return { ring: "ring-2 ring-secondary", label: `🔥 ${streak} días` };
  if (streak >= 7)  return { ring: "ring-2 ring-primary", label: `🔥 ${streak} días` };
  if (streak >= 3)  return { ring: "ring-1 ring-streak/60", label: `🔥 ${streak}` };
  return null;
}

const BasecampPage = () => {
  const navigate = useNavigate();
  const explorer = useExplorer();
  const density = useDensity();
  const wallet = useWallet();
  const activeSP = superpowers.find((s) => s.status === "in-progress") ?? superpowers.find((s) => s.status === "available");
  const activeModule = activeSP?.modules.find((m) => m.status === "in-progress") ?? activeSP?.modules.find((m) => m.status === "available");
  const dailyMission = missions.find((m) => m.type === "daily" && !m.completed);

  const explorerName = explorer?.name ?? userProfile.name;
  const explorerAvatar = explorer?.avatar ?? userProfile.avatar;
  const greeting = greetings[Math.floor(userProfile.streak) % greetings.length];
  const milestone = streakMilestone(userProfile.streak);
  const sherpaQuote = SHERPA_QUOTES[userProfile.streak % SHERPA_QUOTES.length];

  // Density-tuned class fragments
  const heroSize = density.scale === "lg" ? "text-4xl" : density.scale === "md" ? "text-3xl" : "text-2xl";
  const ctaTitle = density.scale === "lg" ? "text-2xl" : density.scale === "md" ? "text-xl" : "text-lg";
  const ctaPad = density.scale === "lg" ? "p-6" : density.scale === "md" ? "p-5" : "p-4";
  const ctaArrow = density.scale === "lg" ? "w-14 h-14" : density.scale === "md" ? "w-12 h-12" : "w-10 h-10";
  const cardTitle = density.scale === "lg" ? "text-lg" : density.scale === "md" ? "text-base" : "text-sm";

  return (
    <div className="min-h-screen pb-28 max-w-lg mx-auto relative overflow-hidden">
      {/* Atmospheric mountain backdrop (basecamp view) */}
      <div className="absolute inset-x-0 top-0 h-[55vh] -z-10">
        <img
          src={mountainBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom opacity-90"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        {/* drifting cloud */}
        <div aria-hidden className="absolute top-12 left-0 right-0 animate-drift">
          <div className="mx-auto w-24 h-6 rounded-full bg-snow/80 blur-md" />
        </div>
      </div>

      <header className="px-5 pt-8 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          aria-label="Ver explorador"
          className="shrink-0"
        >
          <AvatarWithGear
            avatar={explorerAvatar}
            className="w-12 h-12"
            emojiClassName="text-xl"
          />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            Nivel {userProfile.level} · Explorador
          </p>
          <ProgressBar value={userProfile.xp} max={userProfile.xpToNext} variant="sunrise" size="sm" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => navigate("/tienda")}
            className="flex items-center gap-1 bg-secondary-soft text-secondary rounded-full px-2.5 py-1 shadow-terrain"
            aria-label={`${wallet.balance} Alticoins, abrir tienda`}
          >
            <Sparkles size={13} />
            <span className="text-xs font-bold">{wallet.balance}</span>
          </button>
          <motion.div
            initial={milestone ? { scale: 0.9 } : false}
            animate={milestone ? { scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`flex items-center gap-1 bg-card border border-border rounded-full px-2.5 py-1 shadow-terrain ${
              milestone?.ring ?? ""
            }`}
            aria-label={`Racha de ${userProfile.streak} días`}
          >
            <Flame size={13} className="text-streak" />
            <span className="text-xs font-bold text-foreground">
              {milestone ? milestone.label : userProfile.streak}
            </span>
          </motion.div>
        </div>
      </header>

      {/* Sherpa welcomes you at basecamp */}
      <section className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-2">
          <Tent size={14} />
          <span>Campamento</span>
        </div>
<h1 className={`font-display ${heroSize} leading-tight text-foreground max-w-[16ch]`}>
  {greeting},
  <br />
  <span className="text-gradient-summit">{explorerName}</span>
</h1>
      </section>

      <section className="px-5 pt-2 pb-4">
        <SherpaSpeech
          mood="pointing"
          size="md"
          message={
            activeModule
              ? `Sigamos. ${activeModule.title} te espera.`
              : "¿Listo para empezar tu próxima montaña?"
          }
        />
      </section>

      {/* Primary action — continue the climb */}
      {activeSP ? (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (activeModule) navigate(`/module/${activeSP.id}/${activeModule.id}`);
            else navigate(`/superpower/${activeSP.id}`);
          }}
          className={`mx-5 w-[calc(100%-2.5rem)] gradient-sunrise text-secondary-foreground rounded-3xl ${ctaPad} shadow-summit text-left`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] opacity-90 font-bold">Continúa el ascenso</p>
              <p className={`font-display ${ctaTitle} leading-tight mt-0.5 truncate`}>{activeSP.title}</p>
              {activeModule && density.showSubtext && (
                <p className="text-sm opacity-90 mt-1 truncate">→ {activeModule.title}</p>
              )}
            </div>
            <div className={`ml-3 ${ctaArrow} rounded-full bg-card/25 backdrop-blur flex items-center justify-center flex-shrink-0`}>
              <ArrowRight size={density.scale === "lg" ? 26 : 22} />
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={activeSP.progress} variant="default" size="sm" />
            {density.showSubtext && (
              <p className="text-[11px] mt-1.5 opacity-90 font-semibold">Altitud {activeSP.progress}% · sigue subiendo</p>
            )}
          </div>
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/explore")}
          className={`mx-5 w-[calc(100%-2.5rem)] bg-card border-2 border-dashed border-primary/40 text-foreground rounded-3xl ${ctaPad} shadow-terrain text-left`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-primary font-bold">Empieza tu aventura</p>
              <p className={`font-display ${ctaTitle} leading-tight mt-0.5`}>Elige tu primera montaña</p>
              {density.showSubtext && (
                <p className="text-sm text-muted-foreground mt-1">Cada cima empieza con un paso.</p>
              )}
            </div>
            <div className={`ml-3 ${ctaArrow} rounded-full gradient-sky flex items-center justify-center flex-shrink-0`}>
              <Compass size={density.scale === "lg" ? 26 : 22} />
            </div>
          </div>
        </motion.button>
      )}

      {/* Today's small climb */}
      {dailyMission ? (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-5 mt-4 bg-card border border-border rounded-3xl p-4 shadow-terrain"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary-soft flex items-center justify-center">
              <Mountain size={20} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Climb del día</p>
              <p className={`font-display ${cardTitle} leading-tight`}>{dailyMission.title}</p>
              {density.showSubtext && (
                <p className="text-xs text-muted-foreground mt-0.5">{dailyMission.progress}/{dailyMission.target} pasos</p>
              )}
            </div>
            <span className="text-xs font-bold text-secondary whitespace-nowrap">+{dailyMission.xpReward} XP</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={dailyMission.progress} max={dailyMission.target} variant="sunrise" size="sm" />
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-5 mt-4 bg-card/60 border border-dashed border-border rounded-3xl p-4 shadow-terrain"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center">
              <Calendar size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Climb del día</p>
              <p className={`font-display ${cardTitle} leading-tight text-foreground`}>Sin misión hoy</p>
              {density.showSubtext && (
                <p className="text-xs text-muted-foreground mt-0.5">Vuelve mañana por tu nuevo Climb.</p>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Mountains preview */}
      <section className="px-5 mt-6">
        <button
          onClick={() => navigate("/explore")}
          className="w-full flex items-end justify-between mb-3 text-left active:opacity-70 transition-opacity"
          aria-label="Ver todas las montañas"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              Tus montañas
            </p>
            <h2 className="font-display text-xl">Elige tu próximo ascenso</h2>
          </div>
          <span className="text-xs font-bold text-primary py-2 pl-3">
            Ver todas →
          </span>
        </button>

        <div className="space-y-3">
          {superpowers.slice(0, 3).map((sp, i) => {
            const locked = sp.status === "locked";
            return (
              <motion.button
                key={sp.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                onClick={() => !locked && navigate(`/superpower/${sp.id}`)}
                disabled={locked}
                className={`w-full text-left bg-card border border-border rounded-3xl p-4 shadow-terrain flex items-center gap-3 ${
                  locked ? "opacity-55" : "active:scale-[0.99] transition-transform"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl gradient-sky flex items-center justify-center text-2xl flex-shrink-0">
                  {sp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-display ${cardTitle} truncate`}>{sp.title}</p>
                  {density.showSubtext && (
                    <p className="text-xs text-muted-foreground truncate">{sp.description}</p>
                  )}
                  <div className="mt-2">
                    <ProgressBar value={sp.progress} variant="sunrise" size="sm" />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {locked ? "Bloqueado" : `${sp.progress}%`}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Sherpa says */}
      <section className="px-5 mt-8 text-center">
        <Sherpa mood="encouraging" size="md" halo />
        <p className="font-display text-base mt-2 text-foreground">
          “{sherpaQuote.quote}”
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">— {sherpaQuote.author}</p>
      </section>
    </div>
  );
};

export default BasecampPage;
