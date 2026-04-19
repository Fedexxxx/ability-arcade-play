import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Mountain as MountainIcon, Lock, Star } from "lucide-react";
import { superpowers, areas, categories } from "@/data/mockData";
import SherpaSpeech from "@/components/SherpaSpeech";

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

const MountainsPage = () => {
  const [searchParams] = useSearchParams();
  const areaParam = searchParams.get("area");

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

  const filtered =
    activeCategory === "Todas"
      ? superpowers
      : superpowers.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen pb-28 px-5 pt-8 max-w-lg mx-auto">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2">
          <MountainIcon size={14} />
          <span>Tus montañas</span>
        </div>
        <h1 className="font-display text-3xl leading-tight">
          Elige tu próxima <span className="text-gradient-summit">cima</span>
        </h1>
      </header>

      <SherpaSpeech
        mood="thinking"
        size="sm"
        message="Cada montaña es un nuevo viaje. Empieza por la que más te llame."
        className="mb-5"
      />

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-5 px-5 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((sp, i) => {
          const badge = statusBadge[sp.status];
          const locked = sp.status === "locked";
          return (
            <motion.button
              key={sp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => !locked && navigate(`/superpower/${sp.id}`)}
              disabled={locked}
              className={`w-full text-left bg-card border border-border rounded-3xl p-4 shadow-terrain ${
                locked ? "opacity-55" : "active:scale-[0.99] transition-transform"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl gradient-sky flex items-center justify-center text-3xl flex-shrink-0">
                  {sp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base truncate">{sp.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{sp.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {sp.duration}
                    </span>
                    <span className="capitalize">{difficultyLabels[sp.difficulty]}</span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-secondary" /> {sp.rewards} XP
                    </span>
                  </div>
                </div>
                {locked && <Lock size={18} className="text-muted-foreground mt-1" />}
              </div>

              {sp.status !== "locked" && sp.progress > 0 && (
                <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-sunrise"
                    style={{ width: `${sp.progress}%` }}
                  />
                </div>
              )}

              {sp.status === "available" && sp.progress === 0 && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  Empezar ascenso →
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MountainsPage;
