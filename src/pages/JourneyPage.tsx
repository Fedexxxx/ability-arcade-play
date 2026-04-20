import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag, Lock, CheckCircle2, Sparkles, Mountain as MountainIcon } from "lucide-react";
import { superpowers, userProfile } from "@/data/mockData";
import Sherpa from "@/components/Sherpa";
import SherpaSpeech from "@/components/SherpaSpeech";
import { useDensity } from "@/contexts/AgeDensityContext";

/**
 * JourneyMap — vertical scrolling mountain path.
 * The user climbs UPWARD (we render bottom→top).
 * Each mountain is a stage; each module a checkpoint along the path.
 */
const JourneyPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const density = useDensity();

  // Flatten all mountains into a single chain of checkpoints,
  // ordered by mountain order then module order.
  const checkpoints = useMemo(() => {
    return superpowers.flatMap((sp) =>
      sp.modules.map((mod) => ({
        spId: sp.id,
        spTitle: sp.title,
        spIcon: sp.icon,
        modId: mod.id,
        title: mod.title,
        status: mod.status,
        isBoss: !!mod.isBoss,
      })),
    );
  }, []);

  // We render from BOTTOM (index 0 = basecamp) to TOP (last = summit)
  // To get visual climbing, reverse rendering order via flex-col-reverse,
  // and use alternating left/right offsets.
  const completedCount = checkpoints.filter((c) => c.status === "completed").length;
  const totalCount = checkpoints.length;
  const altitude = Math.round((completedCount / totalCount) * 100);

  // Density-tuned class fragments
  const summitTitle = density.scale === "lg" ? "text-3xl" : density.scale === "md" ? "text-2xl" : "text-xl";
  const cpMarker = density.scale === "lg" ? "w-12 h-12" : density.scale === "md" ? "w-10 h-10" : "w-9 h-9";
  const cpMarkerIcon = density.scale === "lg" ? 20 : density.scale === "md" ? 16 : 14;
  const cpCardPad = density.scale === "lg" ? "p-4" : density.scale === "md" ? "p-3" : "p-2.5";
  const cpCardTitle = density.scale === "lg" ? "text-base" : density.scale === "md" ? "text-sm" : "text-xs";
  const trailGap = density.scale === "lg" ? "gap-9" : density.scale === "md" ? "gap-7" : "gap-6";

  return (
    <div className="min-h-screen pb-28 max-w-lg mx-auto" ref={containerRef}>
      {/* Sticky altitude header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/75 border-b border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-bold">Tu ruta</p>
            <h1 className="font-display text-lg leading-tight">Mapa del viaje</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-bold">Altitud</p>
            <p className="font-display text-lg text-secondary">{altitude}%</p>
          </div>
        </div>
      </header>

      {/* SUMMIT (top of scroll) */}
      <section className="relative px-5 pt-10 pb-6 text-center gradient-summit">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full gradient-sunrise opacity-30 blur-3xl animate-sun-rise" />
        <div className="relative inline-flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-secondary" />
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-secondary">La cima</span>
          <Sparkles size={14} className="text-secondary" />
        </div>
        <h2 className={`font-display ${summitTitle} text-summit`}>Cumbre del Conocimiento</h2>
        {density.showSubtext && (
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Cada checkpoint te acerca un poco más. Hoy escalaste {completedCount} de {totalCount}.
          </p>
        )}
      </section>

      {/* The trail (rendered top→bottom in DOM, but col-reverse so user climbs upward) */}
      <div className="relative px-5 pt-8 pb-10">
        {/* Vertical dashed climbing path */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] trail-line"
        />

        <ol className={`relative flex flex-col-reverse ${trailGap}`}>
          {checkpoints.map((cp, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            const StatusIcon =
              cp.status === "completed" ? CheckCircle2 : cp.status === "locked" ? Lock : Flag;
            const accent =
              cp.status === "completed"
                ? "bg-primary text-primary-foreground border-primary"
                : cp.status === "locked"
                ? "bg-muted text-muted-foreground border-border"
                : "bg-secondary text-secondary-foreground border-secondary glow-sunrise";

            return (
              <motion.li
                key={cp.modId}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
                className="relative flex items-center"
              >
                {/* Card on alternating sides */}
                <button
                  disabled={cp.status === "locked"}
                  onClick={() => navigate(`/module/${cp.spId}/${cp.modId}`)}
                  className={`w-[44%] bg-card border border-border rounded-2xl ${cpCardPad} shadow-terrain text-left ${
                    side === "left" ? "mr-auto" : "ml-auto"
                  } ${cp.status === "locked" ? "opacity-55" : "active:scale-[0.98] transition-transform"}`}
                >
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground truncate">
                    {cp.spIcon} {cp.spTitle}
                  </p>
                  <p className={`font-display ${cpCardTitle} leading-tight mt-0.5 line-clamp-2`}>
                    {cp.isBoss ? "🏔️ " : ""}
                    {cp.title}
                  </p>
                </button>

                {/* Checkpoint marker on the trail line */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <div
                    className={`${cpMarker} rounded-full border-2 flex items-center justify-center shadow-terrain ${accent}`}
                  >
                    <StatusIcon size={cpMarkerIcon} />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* Sherpa standing where the user currently is */}
        <div className="relative flex justify-center mt-2">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <Sherpa mood="idle" size="sm" halo />
          </div>
        </div>
      </div>

      {/* BASECAMP (bottom) */}
      <section className="px-5 pt-12 pb-2 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <MountainIcon size={14} className="text-primary" />
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-primary">Basecamp</span>
        </div>
        <SherpaSpeech
          mood="encouraging"
          layout="column"
          size="md"
          message={`Llevas ${userProfile.streak} días en el sendero. Estoy orgulloso.`}
          className="justify-center"
        />
      </section>
    </div>
  );
};

export default JourneyPage;
