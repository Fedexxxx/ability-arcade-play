/**
 * Personaliza tu Basecamp.
 *
 * Basecamp is the single canonical Explorer. Here the user adjusts their
 * IDENTITY (skin tone today; hair phase next) and equips unlocked GEAR SETS
 * bought in the shop. The grid of "different explorer characters" is gone.
 */

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  // Snapshot of skin tone at mount → represents "saved" state.
  const [savedSkin, setSavedSkin] = useState<BasecampSkinTone>(skinTone);
  const isDirty = skinTone !== savedSkin;
  // Throttle the "¡Basecamp actualizado!" toast so rapid clicks don't spam.
  const lastToastAt = useRef(0);

  const onPickSkin = (tone: BasecampSkinTone) => {
    if (tone === skinTone) return;
    setSkinTone(tone);
    celebrate();
    const now = Date.now();
    if (now - lastToastAt.current > 600) {
      lastToastAt.current = now;
      toast({ title: "¡Basecamp actualizado!" });
    }
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
        <div className="relative w-80 h-96 my-2 sm:w-[22rem] sm:h-[26rem]">
          <MountainAvatar key={activeSkin.id} variant="full" />
        </div>
        <p className="font-display text-2xl leading-tight text-center">
          {activeSkin.label}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1 px-4">
          Tu compañero de aventura.
        </p>
        <div className="mt-3 w-full">
          <SherpaSpeech
            mood="encouraging"
            size="sm"
            message="Elige la versión de Basecamp que más te represente. Pronto llegarán pelo y equipo."
          />
        </div>
      </motion.section>

      {/* Tu explorador — skin tone picker (only customization in this MVP) */}
      <Section
        title="Tu explorador"
        subtitle="Elige la versión de Basecamp que te acompañará en la aventura."
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
      </Section>

      <div className="mt-6">
        <button
          onClick={() => {
            if (!isDirty) return;
            setSavedSkin(skinTone);
            toast({ title: "¡Listo!", description: "Tu Basecamp está al día." });
            navigate(-1);
          }}
          disabled={!isDirty}
          aria-disabled={!isDirty}
          className={`w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition-all ${
            isDirty
              ? "gradient-sunrise text-secondary-foreground shadow-summit"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <Check size={16} />
          {isDirty ? "Guardar Basecamp" : "Basecamp guardado"}
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
  <div className="flex flex-col items-center gap-1.5 min-w-0">
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={variant.label}
      title={variant.label}
      className={`relative aspect-square w-full rounded-2xl border-2 transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        active
          ? "border-primary scale-[1.04] shadow-summit ring-2 ring-primary/30"
          : "border-border hover:border-primary/40"
      }`}
      style={{ background: variant.swatch }}
    >
      <img
        src={variant.image}
        alt=""
        aria-hidden
        draggable={false}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top scale-[1.9] translate-y-[20%] pointer-events-none select-none"
      />
      {active && (
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-summit ring-2 ring-background">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
    </button>
    <span
      className={`text-[9.5px] leading-tight text-center truncate w-full font-bold ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {variant.label.replace("Basecamp ", "")}
    </span>
  </div>
);

export default CustomizePage;