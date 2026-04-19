import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Lock, Sparkles, Gem } from "lucide-react";
import { achievements, superpowers } from "@/data/mockData";
import { useUnlocks } from "@/hooks/useUnlocks";
import type { UnlockedItem } from "@/lib/unlocks";

const legacyCategoryLabels = {
  constancia: "Constancia",
  precisión: "Precisión",
  exploración: "Exploración",
} as const;

type Tab = "insignias" | "logros";

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const AchievementsPage = () => {
  const unlocks = useUnlocks();
  const [tab, setTab] = useState<Tab>("insignias");
  const [category, setCategory] = useState<string>("Todas");

  // Build the category list from real superpower categories present in unlocks
  // + all categories so users can filter even before earning anything.
  const categories = useMemo(() => {
    const all = Array.from(new Set(superpowers.map((s) => s.category)));
    return ["Todas", ...all];
  }, []);

  const filteredUnlocks: UnlockedItem[] = useMemo(() => {
    if (category === "Todas") return unlocks;
    return unlocks.filter((u) => u.category === category);
  }, [unlocks, category]);

  // Legacy mock achievements (constancia / precisión / exploración)
  const [legacyFilter, setLegacyFilter] = useState<
    "all" | "constancia" | "precisión" | "exploración"
  >("all");
  const filteredLegacy =
    legacyFilter === "all"
      ? achievements
      : achievements.filter((a) => a.category === legacyFilter);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-bold mb-1">Logros</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Tus insignias y títulos de maestría conquistados.
      </p>

      {/* Mastery Gallery shortcut */}
      <Link
        to="/mastery"
        className="block mb-4 rounded-2xl p-4 border border-xp/40 bg-gradient-to-br from-xp/10 via-power/10 to-energy/10 hover:from-xp/15 hover:via-power/15 hover:to-energy/15 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-xp/20 flex items-center justify-center flex-shrink-0">
            <Gem size={20} className="text-xp" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-sm">Galería de Maestrías</p>
            <p className="text-[11px] text-muted-foreground">
              Explora tus superpoderes dominados como cartas holográficas
            </p>
          </div>
          <span className="text-xp text-lg">→</span>
        </div>
      </Link>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 p-1 bg-muted/40 rounded-xl">
        {(
          [
            { id: "insignias", label: `Insignias (${unlocks.length})` },
            { id: "logros", label: "Misiones" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "insignias" ? (
        <>
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredUnlocks.length === 0 ? (
            <div className="gradient-card rounded-2xl p-8 border border-border text-center">
              <Sparkles size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-display font-semibold mb-1">
                Aún no hay insignias aquí
              </p>
              <p className="text-xs text-muted-foreground">
                Completa módulos y superpoderes para desbloquear maestrías.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredUnlocks.map((u, i) => {
                const isMastery = u.kind === "superpower";
                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`relative gradient-card rounded-2xl p-4 border overflow-hidden ${
                      isMastery ? "border-xp/40" : "border-primary/30"
                    }`}
                  >
                    {isMastery && (
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-xp/15 rounded-full blur-2xl pointer-events-none" />
                    )}
                    <div className="flex items-center gap-3 relative">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                          isMastery ? "bg-xp/15" : "bg-primary/10"
                        }`}
                      >
                        {u.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isMastery && (
                            <Crown
                              size={14}
                              className="text-xp flex-shrink-0"
                              fill="currentColor"
                            />
                          )}
                          <p
                            className={`font-display font-bold text-sm leading-tight truncate ${
                              isMastery ? "text-xp" : ""
                            }`}
                          >
                            {u.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {u.superpowerTitle} · {u.category}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 mt-1">
                          Desbloqueado el {formatDate(u.unlockedAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {(["all", "constancia", "precisión", "exploración"] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setLegacyFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                    legacyFilter === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat === "all" ? "Todos" : legacyCategoryLabels[cat]}
                </button>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredLegacy.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`gradient-card rounded-2xl p-4 border border-border text-center ${
                  !a.unlocked ? "opacity-40" : ""
                }`}
              >
                <div className="text-3xl mb-2">
                  {a.unlocked ? (
                    a.icon
                  ) : (
                    <Lock
                      size={28}
                      className="mx-auto text-muted-foreground"
                    />
                  )}
                </div>
                <p className="text-sm font-display font-semibold">{a.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {a.description}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AchievementsPage;
