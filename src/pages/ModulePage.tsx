import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Lock, Clock, Sparkles, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";
import { superpowers } from "@/data/mockData";
import { useDensity } from "@/contexts/AgeDensityContext";
import { findTieredModule, getActiveChallenges, isSkeleton } from "@/data/mountains";
import { useTier } from "@/hooks/useTier";
import {
  TIER_LABEL,
  TIER_HINT,
  TIER_ORDER,
  setModuleTier,
  unpinModuleTier,
  type Tier,
} from "@/lib/tiers";

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
  const tieredFound = findTieredModule(spId, modId);
  const sp = tieredFound?.mountain ?? superpowers.find((s) => s.id === spId);
  const tieredModule = tieredFound?.module;
  const legacyMod = sp?.modules.find((m) => m.id === modId);
  const { tier, pinned } = useTier(spId, modId);

  if (!sp || (!tieredModule && !legacyMod))
    return <div className="p-4 text-center text-muted-foreground">No encontrado</div>;

  const skeleton = tieredModule ? isSkeleton(tieredModule) : false;
  const challenges = tieredModule
    ? getActiveChallenges(tieredModule, tier)
    : legacyMod?.challenges ?? [];
  const mod = tieredModule
    ? { ...tieredModule, challenges }
    : legacyMod!;

  const heroTitle = density.scale === "lg" ? "text-2xl" : density.scale === "md" ? "text-xl" : "text-lg";
  const cardPad = density.scale === "lg" ? "p-4" : density.scale === "md" ? "p-3.5" : "p-3";
  const cardTitle = density.scale === "lg" ? "text-base" : density.scale === "md" ? "text-sm" : "text-sm";
  const cardIcon = density.scale === "lg" ? "w-11 h-11" : density.scale === "md" ? "w-8 h-8" : "w-7 h-7";

  const countFor = (t: Tier) =>
    tieredModule ? getActiveChallenges(tieredModule, t).length : challenges.length;

  const retosLabel = (n: number) => `${n} ${n === 1 ? "reto activo" : "retos activos"}`;

  // Centralized writer: applies the requested change, surfaces errors via
  // toast, and offers Retry / Revert actions that restore the prior state.
  const applyTierChange = (
    intent: "pin" | "unpin",
    nextTier: Tier,
    prevSnapshot: { tier: Tier; pinned: boolean },
    isRetry = false,
  ) => {
    if (!spId || !modId) return;
    try {
      if (intent === "pin") {
        setModuleTier(spId, modId, nextTier);
      } else {
        unpinModuleTier(spId, modId);
      }
      const count = countFor(nextTier);
      const title =
        intent === "pin"
          ? `${isRetry ? "Guardado tras reintentar · " : ""}Fijado en ${TIER_LABEL[nextTier]}`
          : `${isRetry ? "Guardado tras reintentar · " : ""}Auto · ${TIER_LABEL[nextTier]}`;
      const description =
        intent === "pin"
          ? `${retosLabel(count)} en este nivel`
          : `Adaptativo activado · ${retosLabel(count)}`;
      toast.success(title, { description });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar tu preferencia.";
      const attempted =
        intent === "pin"
          ? `Fijar en ${TIER_LABEL[nextTier]}`
          : `Auto · ${TIER_LABEL[nextTier]}`;
      const kept = prevSnapshot.pinned
        ? `Fijado en ${TIER_LABEL[prevSnapshot.tier]}`
        : `Auto · ${TIER_LABEL[prevSnapshot.tier]}`;
      const errorTitle = isRetry
        ? `Reintento fallido: ${attempted}`
        : `No se pudo guardar: ${attempted}`;
      toast.error(errorTitle, {
        description: `${message} Sigues en ${kept}.`,
        duration: 10000,
        action: {
          label: isRetry ? "Reintentar de nuevo" : "Reintentar",
          onClick: () => applyTierChange(intent, nextTier, prevSnapshot, true),
        },
        cancel: {
          label: `Mantener ${TIER_LABEL[prevSnapshot.tier]}`,
          onClick: () => {
            // No-op: the failed write never mutated storage, so the previous
            // tier is what's still shown. The button just lets the user
            // dismiss the error and confirm the kept selection.
          },
        },
      });
    }
  };

  const handleTierChange = (next: Tier) => {
    if (!spId || !modId) return;
    const snapshot = { tier, pinned };
    if (next === tier && pinned) {
      applyTierChange("unpin", next, snapshot);
    } else {
      applyTierChange("pin", next, snapshot);
    }
  };

  const handleUnpin = () => {
    if (!spId || !modId) return;
    applyTierChange("unpin", tier, { tier, pinned });
  };

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

        {/* Tier selector — adaptive default with manual override */}
        {!skeleton && (
          <div className="mb-5 bg-card border border-border rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
                <Sparkles size={12} className="text-secondary" />
                <span>Nivel del ascenso</span>
              </div>
              {pinned ? (
                <button
                  onClick={handleUnpin}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary"
                  aria-label="Quitar fijado y dejar que se adapte"
                >
                  <PinOff size={11} /> Auto
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Pin size={11} /> Adaptativo
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIER_ORDER.map((t) => {
                const active = tier === t;
                return (
                  <button
                    key={t}
                    onClick={() => handleTierChange(t)}
                    className={`rounded-xl px-2 py-2 text-center transition-colors border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border"
                    }`}
                  >
                    <p className="text-xs font-bold leading-none">{TIER_LABEL[t]}</p>
                    <p className={`text-[10px] mt-1 ${active ? "opacity-90" : "text-muted-foreground"}`}>
                      {TIER_HINT[t]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <ProgressBar value={mod.completion} variant="energy" size="md" showLabel />
        </div>

        {skeleton ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2">
              Próximamente
            </p>
            <p className="text-sm text-foreground">
              Este checkpoint está reservado en el mapa. Estará listo en una próxima expedición.
            </p>
          </div>
        ) : (
        <div className="space-y-2">
          {challenges.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              role={ch.status !== "locked" ? "button" : undefined}
              tabIndex={ch.status !== "locked" ? 0 : -1}
              onClick={() =>
                ch.status !== "locked" &&
                navigate(`/challenge/${sp.id}/${mod.id}/${ch.id}`)
              }
              onKeyDown={(e) => {
                if (ch.status === "locked") return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/challenge/${sp.id}/${mod.id}/${ch.id}`);
                }
              }}
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
        )}
      </motion.div>
    </div>
  );
};

export default ModulePage;
