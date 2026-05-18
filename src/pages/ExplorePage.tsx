import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Mountain as MountainIcon, Lock, Star, ArrowRight } from "lucide-react";
import { superpowers, areas, categories } from "@/data/mockData";
import { mountains } from "@/data/mountains";
import SherpaSpeech from "@/components/SherpaSpeech";
import { useDensity } from "@/contexts/AgeDensityContext";
import { useActiveMountain } from "@/hooks/useChallengeCompletions";

const difficultyLabels = {
  beginner: "Sendero suave",
  intermediate: "Ascenso medio",
  advanced: "Cima exigente",
};

const statusBadge = {
  locked:        { label: "Bloqueada",     className: "bg-muted text-muted-foreground" },
  available:     { label: "Lista",         className: "bg-primary-soft text-primary" },
  "in-progress": { label: "Subiendo",      className: "bg-secondary-soft text-secondary" },
  completed:     { label: "Conquistada",   className: "bg-accent/30 text-foreground" },
};

/** A mountain is "Próximamente" when every module is a skeleton stub (byTier === null). */
const COMING_SOON_IDS = new Set(
  mountains.filter((m) => m.modules.every((mo) => mo.byTier === null)).map((m) => m.id),
);

/** A mountain is "partial" if it has playable content but ≥1 stub. */
const PARTIAL_IDS = new Set(
  mountains
    .filter((m) => m.modules.some((mo) => mo.byTier === null) && m.modules.some((mo) => mo.byTier !== null))
    .map((m) => m.id),
);

const STATUS_GROUPS: { key: "in-progress" | "available" | "completed" | "locked"; label: string }[] = [
  { key: "in-progress", label: "En marcha" },
  { key: "available",   label: "Listas para subir" },
  { key: "completed",   label: "Conquistadas" },
  { key: "locked",      label: "Por desbloquear" },
];

const MountainsPage = () => {
  const [searchParams] = useSearchParams();
  const areaParam = searchParams.get("area");
  const density = useDensity();

  const areaToCategory: Record<string, string> = {};
  areas.forEach((a) => {
    const cat = categories.find(
      (c) => c !== "Todas" && a.title.toLowerCase().includes(c.toLowerCase()),
    );
    if (cat) areaToCategory[a.id] = cat;
  });

  const initialCategory = areaParam ? areaToCategory[areaParam] || "Todas" : "Todas";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const navigate = useNavigate();

  // Density-tuned class fragments
  const heroSize = density.scale === "lg" ? "text-4xl" : density.scale === "md" ? "text-3xl" : "text-2xl";
  const cardPad = density.scale === "lg" ? "p-5" : density.scale === "md" ? "p-4" : "p-3.5";
  const cardTitle = density.scale === "lg" ? "text-lg" : density.scale === "md" ? "text-base" : "text-sm";
  const iconBox = density.scale === "lg" ? "w-16 h-16 text-4xl" : density.scale === "md" ? "w-14 h-14 text-3xl" : "w-12 h-12 text-2xl";
  const chipPad = density.scale === "lg" ? "px-5 py-2 text-base" : density.scale === "md" ? "px-4 py-1.5 text-sm" : "px-3.5 py-1 text-sm";

  const filtered =
    activeCategory === "Todas"
      ? superpowers
      : superpowers.filter((s) => s.category === activeCategory);

  // Pinned mountain — the one currently in progress (across the whole catalog,
  // not just the active filter, so the user always sees their climb).
  // Sourced from mountain_progress (live), with a fallback to the legacy seed.
  const activeRow = useActiveMountain();
  const pinnedSP =
    (activeRow ? superpowers.find((s) => s.id === activeRow.mountainId) : null) ??
    superpowers.find((s) => s.status === "in-progress") ??
    null;
  const pinnedPct = activeRow?.pct ?? pinnedSP?.progress ?? 0;

  // Group filtered list by status, excluding the pinned card to avoid duplication.
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const sp of filtered) {
      if (pinnedSP && sp.id === pinnedSP.id) continue;
      const arr = map.get(sp.status) ?? [];
      arr.push(sp);
      map.set(sp.status, arr);
    }
    return STATUS_GROUPS.map((g) => ({ ...g, items: map.get(g.key) ?? [] })).filter((g) => g.items.length > 0);
  }, [filtered, pinnedSP]);

  // First locked mountain (in catalog order) — used as a hint on every locked card.
  const lockedHint = useMemo(() => {
    const idx = superpowers.findIndex((s) => s.status === "locked");
    if (idx <= 0) return null;
    const prev = superpowers[idx - 1];
    return prev?.title ?? null;
  }, []);

  // Contextual Sherpa message based on user state.
  const inProgressCount = superpowers.filter((s) => s.status === "in-progress").length;
  const completedCount = superpowers.filter((s) => s.status === "completed").length;
  const sherpaMsg =
    inProgressCount === 0 && completedCount === 0
      ? "Cada montaña es un nuevo viaje. Empieza por la que más te llame."
      : inProgressCount > 0
      ? "Sigamos con lo que tienes en marcha — y cuando vuelvas, hay más cumbres esperándote."
      : "¡Lo conquistaste! Es momento de elegir la próxima cima.";

  return (
    <div className="min-h-screen pb-28 px-5 pt-8 max-w-lg mx-auto">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2">
          <MountainIcon size={14} />
          <span>Tus montañas</span>
        </div>
        <h1 className={`font-display ${heroSize} leading-tight`}>
          Elige tu próxima <span className="text-gradient-summit">cima</span>
        </h1>
      </header>

      <SherpaSpeech
        mood="thinking"
        size="sm"
        message={sherpaMsg}
        className="mb-5"
      />

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-5 px-5 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${chipPad} rounded-full font-bold whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinned: currently subiendo — only when matches the active filter or "Todas" */}
      {pinnedSP && (activeCategory === "Todas" || pinnedSP.category === activeCategory) && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/superpower/${pinnedSP.id}`)}
          className="w-full text-left rounded-3xl p-[2px] gradient-sunrise shadow-summit mb-4"
          aria-label={`Continuar ${pinnedSP.title}`}
        >
          <div className={`bg-card rounded-[calc(theme(borderRadius.3xl)-2px)] ${cardPad}`}>
            <div className="flex items-start gap-3">
              <div className={`${iconBox} rounded-2xl gradient-sky flex items-center justify-center flex-shrink-0`}>
                {pinnedSP.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] text-secondary font-bold">Subiendo ahora</p>
                <h3 className={`font-display ${cardTitle} truncate`}>{pinnedSP.title}</h3>
                {density.showSubtext && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{pinnedSP.description}</p>
                )}
              </div>
              <ArrowRight size={density.scale === "lg" ? 22 : 18} className="text-secondary mt-1 flex-shrink-0" />
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full gradient-sunrise" style={{ width: `${pinnedPct}%` }} />
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-secondary">
              Continuar ascenso →
            </div>
          </div>
        </motion.button>
      )}

      {/* Grouped lists by status */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <section key={group.key}>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2 px-1">
              {group.label}
            </p>
            <div className="space-y-3">
              {group.items.map((sp, i) => {
                const badge = statusBadge[sp.status];
                const locked = sp.status === "locked";
                const comingSoon = COMING_SOON_IDS.has(sp.id);
                const partial = PARTIAL_IDS.has(sp.id);
                return (
                  <motion.button
                    key={sp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !locked && navigate(`/superpower/${sp.id}`)}
                    disabled={locked}
                    className={`w-full text-left bg-card border border-border rounded-3xl ${cardPad} shadow-terrain ${
                      locked ? "opacity-60" : "active:scale-[0.99] transition-transform"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${iconBox} rounded-2xl gradient-sky flex items-center justify-center flex-shrink-0`}>
                        {sp.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`font-display ${cardTitle} truncate`}>{sp.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badge.className}`}>
                            {badge.label}
                          </span>
                          {comingSoon && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground">
                              Próximamente
                            </span>
                          )}
                          {partial && !locked && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-accent/30 text-foreground">
                              En desarrollo
                            </span>
                          )}
                        </div>
                        {density.showSubtext && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{sp.description}</p>
                        )}
                        {density.showSubtext && (
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {sp.duration}
                            </span>
                            <span className="capitalize">{difficultyLabels[sp.difficulty]}</span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-secondary" /> {sp.rewards} XP
                            </span>
                          </div>
                        )}
                        {locked && lockedHint && (
                          <p className="mt-2 text-[10px] text-muted-foreground">
                            Termina <span className="font-bold">{lockedHint}</span> para desbloquearla.
                          </p>
                        )}
                      </div>
                      {locked && <Lock size={density.scale === "lg" ? 22 : 18} className="text-muted-foreground mt-1" />}
                    </div>

                    {sp.status !== "locked" && sp.progress > 0 && (
                      <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full gradient-sunrise" style={{ width: `${sp.progress}%` }} />
                      </div>
                    )}

                    {sp.status === "available" && sp.progress === 0 && !comingSoon && (
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                        Empezar ascenso →
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state — no mountains match the active filter */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-card border border-dashed border-border rounded-3xl p-6 text-center"
        >
          <div className="w-14 h-14 rounded-2xl gradient-sky flex items-center justify-center mx-auto mb-3">
            <MountainIcon size={28} className="text-primary" />
          </div>
          <h3 className={`font-display ${cardTitle} mb-1`}>
            No hay montañas en “{activeCategory}”
          </h3>
          {density.showSubtext && (
            <p className="text-xs text-muted-foreground mb-4">
              Estamos preparando nuevas cumbres para esta categoría. Mientras tanto, explora todas tus montañas.
            </p>
          )}
          <button
            onClick={() => setActiveCategory("Todas")}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold active:scale-[0.98] transition-transform"
          >
            Ver todas las montañas →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MountainsPage;
