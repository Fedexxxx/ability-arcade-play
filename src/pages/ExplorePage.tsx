import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Star, Lock } from "lucide-react";
import { superpowers, areas, categories } from "@/data/mockData";

const difficultyColors = {
  beginner: "text-energy",
  intermediate: "text-xp",
  advanced: "text-streak",
};

const difficultyLabels = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const statusBadge = {
  locked: { label: "Bloqueado", className: "bg-muted text-muted-foreground" },
  available: { label: "Disponible", className: "bg-primary/20 text-primary" },
  "in-progress": { label: "En Progreso", className: "bg-energy/20 text-energy" },
  completed: { label: "Dominado", className: "bg-xp/20 text-xp" },
};

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const areaParam = searchParams.get("area");

  // Map area id to category
  const areaToCategory: Record<string, string> = {};
  areas.forEach((a) => {
    const cat = categories.find((c) => c !== "Todas" && a.title.toLowerCase().includes(c.toLowerCase()));
    if (cat) areaToCategory[a.id] = cat;
  });

  const initialCategory = areaParam
    ? (areaToCategory[areaParam] || "Todas")
    : "Todas";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const navigate = useNavigate();

  const filtered = activeCategory === "Todas"
    ? superpowers
    : superpowers.filter((s) => s.category === activeCategory);

  // Group by area for display
  const currentArea = areas.find((a) => areaToCategory[a.id] === activeCategory);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-bold mb-1">Explorar Superpoderes</h1>
      {currentArea && (
        <p className="text-xs text-muted-foreground mb-4">{currentArea.icon} {currentArea.subtitle}</p>
      )}

      {/* Áreas */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((sp, i) => {
          const badge = statusBadge[sp.status];
          return (
            <motion.div
              key={sp.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => sp.status !== "locked" && navigate(`/superpower/${sp.id}`)}
              className={`gradient-card rounded-2xl p-4 border border-border ${
                sp.status === "locked" ? "opacity-50" : "cursor-pointer active:scale-[0.98] transition-transform"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{sp.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold truncate">{sp.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{sp.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {sp.duration}
                    </span>
                    <span className={`capitalize ${difficultyColors[sp.difficulty]}`}>
                      {difficultyLabels[sp.difficulty]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-xp" /> {sp.rewards} XP
                    </span>
                  </div>
                </div>
                {sp.status === "locked" && <Lock size={18} className="text-muted-foreground mt-1" />}
              </div>

              {sp.status !== "locked" && sp.status !== "available" && (
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-energy"
                      style={{ width: `${sp.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {sp.status === "available" && (
                <button className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-2 text-sm font-bold">
                  Desbloquear Superpoder
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePage;
