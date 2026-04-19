import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Lock, Share2, Sparkles, Trophy, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { superpowers } from "@/data/mockData";
import { useUnlocks } from "@/hooks/useUnlocks";
import { prefersReducedMotion } from "@/lib/prefs";

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

interface MasteryCardProps {
  superpower: (typeof superpowers)[number];
  unlockedAt?: number;
  modulesUnlocked: number;
}

const MasteryCard = ({ superpower, unlockedAt, modulesUnlocked }: MasteryCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();
  const isMastered = !!unlockedAt;
  const [sharing, setSharing] = useState(false);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current || !isMastered) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${x}%`);
    ref.current.style.setProperty("--my", `${y}%`);
    const rotX = ((y - 50) / 50) * -6;
    const rotY = ((x - 50) / 50) * 6;
    ref.current.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mx", "50%");
    ref.current.style.setProperty("--my", "50%");
    ref.current.style.transform = "";
  };

  const totalModules = superpower.modules.length;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!captureRef.current || sharing) return;
    setSharing(true);
    handleLeave();

    try {
      const bg =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .trim() || "222 47% 8%";
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: `hsl(${bg})`,
      });

      const filename = `maestria-${superpower.id}.png`;

      if (navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], filename, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Maestría: ${superpower.title}`,
              text: `¡He dominado el superpoder ${superpower.title}! 🏆`,
            });
            toast.success("¡Compartido!");
            return;
          }
        } catch {
          // fall through to download
        }
      }

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      toast.success("Imagen descargada", {
        description: "Ya puedes compartirla en tus redes.",
      });
    } catch (err) {
      console.error("Share failed", err);
      toast.error("No se pudo generar la imagen");
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-3xl overflow-hidden ${
        isMastered ? "holo-card" : "holo-card-locked"
      }`}
    >
      <div ref={captureRef} className="relative p-5 bg-background">
        {/* Foil corner badge */}
        {isMastered && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-xp/20 border border-xp/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
            <Crown size={12} className="text-xp" fill="currentColor" />
            <span className="text-[10px] font-display font-bold text-xp uppercase tracking-wider">
              Maestría
            </span>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center pt-2">
          {/* Icon medallion */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl mb-3 ${
              isMastered
                ? "bg-background/40 ring-2 ring-xp/50 shadow-[0_0_30px_hsl(var(--xp)/0.4)]"
                : "bg-muted/40 ring-1 ring-border"
            }`}
          >
            {isMastered ? superpower.icon : <Lock size={28} className="text-muted-foreground" />}
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
            {superpower.category}
          </p>
          <h3
            className={`font-display font-bold text-lg leading-tight mb-1 ${
              isMastered ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {superpower.title}
          </h3>

          {isMastered ? (
            <>
              <p className="text-xs text-xp font-semibold mb-3">
                Gran Maestro · {totalModules}/{totalModules} módulos
              </p>
              <div className="w-full border-t border-xp/20 pt-3 mt-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Conquistado el
                </p>
                <p className="text-xs font-semibold text-foreground/90">
                  {formatDate(unlockedAt!)}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                {modulesUnlocked}/{totalModules} módulos dominados
              </p>
              <Link
                to={`/superpower/${superpower.id}`}
                className="text-[11px] font-semibold text-primary border border-primary/40 rounded-full px-3 py-1 hover:bg-primary/10 transition-colors"
              >
                Continuar entrenamiento →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Share action — outside captureRef so it does not appear in the PNG */}
      {isMastered && (
        <button
          type="button"
          onClick={handleShare}
          disabled={sharing}
          aria-label={`Compartir carta de ${superpower.title}`}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-background/70 hover:bg-background/90 border border-xp/40 rounded-full px-3 py-1.5 backdrop-blur-sm text-xp text-[11px] font-semibold transition-colors disabled:opacity-60"
        >
          {sharing ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Share2 size={12} />
          )}
          {sharing ? "Generando..." : "Compartir"}
        </button>
      )}
    </motion.div>
  );
};

const MasteryGalleryPage = () => {
  const unlocks = useUnlocks();

  const { masteredCount, byId, moduleCounts } = useMemo(() => {
    const byId = new Map<string, number>(); // spId -> unlockedAt
    const moduleCounts = new Map<string, number>(); // spId -> module unlocks
    for (const u of unlocks) {
      if (u.kind === "superpower") byId.set(u.spId, u.unlockedAt);
      if (u.kind === "module") {
        moduleCounts.set(u.spId, (moduleCounts.get(u.spId) ?? 0) + 1);
      }
    }
    return { masteredCount: byId.size, byId, moduleCounts };
  }, [unlocks]);

  // Sort: mastered first (newest), then in-progress (most modules), then locked.
  const sorted = useMemo(() => {
    return [...superpowers].sort((a, b) => {
      const aM = byId.get(a.id) ?? 0;
      const bM = byId.get(b.id) ?? 0;
      if (aM && bM) return bM - aM;
      if (aM) return -1;
      if (bM) return 1;
      return (moduleCounts.get(b.id) ?? 0) - (moduleCounts.get(a.id) ?? 0);
    });
  }, [byId, moduleCounts]);

  const total = superpowers.length;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to="/achievements"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Volver a logros"
        >
          <ArrowLeft size={22} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold leading-tight">Galería de Maestrías</h1>
          <p className="text-xs text-muted-foreground">
            Tu colección de superpoderes dominados.
          </p>
        </div>
      </div>

      {/* Counter card */}
      <div className="gradient-card rounded-2xl border border-border p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-xp/15 flex items-center justify-center">
          <Trophy size={22} className="text-xp" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-display font-bold">
            {masteredCount}{" "}
            <span className="text-sm text-muted-foreground font-normal">
              / {total} maestrías
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {masteredCount === 0
              ? "Empieza a dominar superpoderes para llenar tu galería"
              : masteredCount === total
                ? "¡Has completado la colección!"
                : "Sigue entrenando para conquistarlos todos"}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="gradient-card rounded-2xl p-8 border border-border text-center">
          <Sparkles size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-display font-semibold">Todavía no hay superpoderes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((sp) => (
            <MasteryCard
              key={sp.id}
              superpower={sp}
              unlockedAt={byId.get(sp.id)}
              modulesUnlocked={moduleCounts.get(sp.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MasteryGalleryPage;
