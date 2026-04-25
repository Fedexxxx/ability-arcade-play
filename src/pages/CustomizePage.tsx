/**
 * Personaliza tu Basecamp.
 *
 * Basecamp is the single canonical Explorer. Here the user adjusts their
 * IDENTITY (skin tone today; hair phase next) and equips unlocked GEAR SETS
 * bought in the shop. The grid of "different explorer characters" is gone.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MountainAvatar from "@/components/avatar/MountainAvatar";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";
import { useCharacter } from "@/hooks/useCharacter";
import {
  BASECAMP_SKIN_VARIANTS,
  getSkinVariant,
  type BasecampSkinTone,
  type BasecampSkinVariant,
} from "@/lib/basecamp";
import { setSkinTone } from "@/lib/character/state";

const CustomizePage = () => {
  const navigate = useNavigate();
  const { skinTone } = useCharacter();
  const activeSkin = getSkinVariant(skinTone);

  const onPickSkin = (tone: BasecampSkinTone) => {
    if (tone === skinTone) return;
    setSkinTone(tone);
    celebrate();
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-muted-foreground mb-3 inline-flex items-center gap-1.5 text-sm font-bold"
        aria-label="Volver"
      >
        <ArrowLeft size={18} /> Ir atrás
      </button>

      {/* Hero preview */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-1 px-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
            Tu Basecamp
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold">
            <Sparkles size={11} /> En vivo
          </span>
        </div>
        <div className="relative w-72 h-80 my-2">
          <MountainAvatar variant="full" />
        </div>
        <p className="font-display text-2xl leading-tight text-center">Basecamp</p>
        <p className="text-xs text-muted-foreground text-center mt-1 px-4">
          Tu compañero de aventura.
        </p>
        <div className="mt-3 w-full">
          <SherpaSpeech
            mood="encouraging"
            size="sm"
            message="Elige el tono de piel de tu explorador. Pronto podrás cambiar pelo y equipo."
          />
        </div>
      </motion.section>

      {/* Tu explorador — skin tone picker (only customization in this MVP) */}
      <Section
        title="Tu explorador"
        subtitle="Elige el tono de piel de tu Basecamp"
      >
        <div className="grid grid-cols-5 gap-2.5">
          {BASECAMP_SKIN_VARIANTS.map((v) => (
            <SkinSwatch
              key={v.id}
              variant={v}
              active={v.id === activeSkin.id}
              onClick={() => onPickSkin(v.id)}
            />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2.5 text-center">
          {activeSkin.label}
        </p>
      </Section>

      <div className="mt-6">
        <button
          onClick={() => {
            toast({ title: "¡Listo!", description: "Tu Basecamp está al día." });
            navigate(-1);
          }}
          className="w-full gradient-sunrise text-secondary-foreground rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 shadow-summit"
        >
          <Check size={16} /> Guardar Basecamp
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-4 px-6">
        Pronto: estilos de pelo y conjuntos de equipo desbloqueables con Alticoins.
      </p>
    </div>
  );
};

// ───────── Subcomponents ─────────

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="mb-6">
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
      {title}
    </p>
    {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
    <div className="mt-2.5">{children}</div>
  </section>
);

const SkinSwatch = ({
  variant,
  active,
  onClick,
}: {
  variant: BasecampSkinVariant;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    aria-label={variant.label}
    className={`relative aspect-square rounded-2xl border-2 transition-all overflow-hidden ${
      active
        ? "border-primary scale-[1.04] shadow-summit"
        : "border-border hover:border-primary/40"
    }`}
    style={{ background: variant.swatch }}
  >
    {active && (
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-summit">
          <Check size={12} strokeWidth={3} />
        </span>
      </span>
    )}
  </button>
);

export default CustomizePage;