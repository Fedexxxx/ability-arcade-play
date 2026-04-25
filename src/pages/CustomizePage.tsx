/**
 * Personaliza tu Basecamp.
 *
 * Basecamp is the single canonical Explorer. Here the user adjusts their
 * IDENTITY (skin tone today; hair phase next) and equips unlocked GEAR SETS
 * bought in the shop. The grid of "different explorer characters" is gone.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Sparkles, Store } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MountainAvatar from "@/components/avatar/MountainAvatar";
import BasecampVariantsPreview from "@/components/avatar/BasecampVariantsPreview";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";
import { useCharacter } from "@/hooks/useCharacter";
import {
  BASECAMP_GEAR_SETS,
  BASECAMP_SKIN_VARIANTS,
  getSkinVariant,
  type BasecampSkinTone,
  type BasecampSkinVariant,
  type BasecampGearSet,
} from "@/lib/basecamp";
import { equipGearSet, setSkinTone } from "@/lib/character/state";

const CustomizePage = () => {
  const navigate = useNavigate();
  const { skinTone, ownedGearSetIds, equippedGearSetId } = useCharacter();
  const activeSkin = getSkinVariant(skinTone);

  const onPickSkin = (tone: BasecampSkinTone) => {
    if (tone === skinTone) return;
    setSkinTone(tone);
    celebrate();
  };

  const onEquipSet = (set: BasecampGearSet) => {
    if (!ownedGearSetIds.includes(set.id)) {
      toast({
        title: "Equipo bloqueado",
        description: `Desbloquéalo en la tienda con ${set.price} Alticoins.`,
      });
      navigate("/tienda");
      return;
    }
    equipGearSet(equippedGearSetId === set.id ? null : set.id);
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
        <div className="relative w-64 h-72 my-2">
          <MountainAvatar variant="full" />
        </div>
        {/* Live skin variants strip — sits with the avatar so the user
            sees that the preview above reflects their selection. */}
        <div className="w-full mt-1 mb-1">
          <BasecampVariantsPreview hideLabel size="md" />
        </div>
        <p className="font-display text-2xl leading-tight text-center">Basecamp</p>
        <p className="text-xs text-muted-foreground text-center mt-1 px-4">
          Tu compañero de aventura.
        </p>
        <div className="mt-3 w-full">
          <SherpaSpeech
            mood="encouraging"
            size="sm"
            message="Personaliza a Basecamp. Desbloquea más equipo con Alticoins."
          />
        </div>
      </motion.section>

      {/* Identity — skin tone */}
      <Section
        title="Identidad"
        subtitle="Elige el tono de piel de tu Basecamp"
      >
        <div className="grid grid-cols-5 gap-2">
          {BASECAMP_SKIN_VARIANTS.map((v) => (
            <SkinSwatch
              key={v.id}
              variant={v}
              active={v.id === activeSkin.id}
              onClick={() => onPickSkin(v.id)}
            />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          {activeSkin.label}
        </p>
      </Section>

      {/* Phase 2 placeholders — visible so the user understands the roadmap */}
      <Section title="Pelo" subtitle="Próximamente">
        <ComingSoon label="Estilos y colores de pelo llegan en la siguiente expedición." />
      </Section>

      {/* Gear sets */}
      <Section
        title="Equipo"
        subtitle="Conjuntos completos de Basecamp para cada ruta"
      >
        <div className="grid grid-cols-2 gap-3">
          {BASECAMP_GEAR_SETS.map((set) => {
            const owned = ownedGearSetIds.includes(set.id);
            const equipped = equippedGearSetId === set.id;
            return (
              <GearSetCard
                key={set.id}
                set={set}
                owned={owned}
                equipped={equipped}
                onClick={() => onEquipSet(set)}
              />
            );
          })}
        </div>
        <button
          onClick={() => navigate("/tienda")}
          className="w-full mt-3 inline-flex items-center justify-center gap-1.5 bg-card border border-dashed border-border text-muted-foreground hover:text-foreground rounded-2xl py-2.5 text-xs font-bold"
        >
          <Store size={12} /> Visitar la tienda
        </button>
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

const GearSetCard = ({
  set,
  owned,
  equipped,
  onClick,
}: {
  set: BasecampGearSet;
  owned: boolean;
  equipped: boolean;
  onClick: () => void;
}) => {
  const locked = !owned;
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-2xl border p-3 transition-colors overflow-hidden ${
        equipped
          ? "bg-primary/10 border-primary"
          : locked
          ? "bg-card/60 border-dashed border-border opacity-90"
          : "bg-card border-border hover:border-primary/40"
      }`}
    >
      <div className="aspect-square w-full rounded-xl bg-gradient-to-b from-muted/40 to-card overflow-hidden flex items-center justify-center mb-2">
        {set.image ? (
          <img
            src={set.image}
            alt={set.name}
            className={`w-full h-full object-contain ${locked ? "grayscale opacity-70" : ""}`}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="text-3xl opacity-60" aria-hidden>
            🎒
          </div>
        )}
      </div>
      <p className="font-display text-sm leading-tight">{set.name}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{set.blurb}</p>
      {!set.available && (
        <p className="text-[10px] text-secondary font-bold mt-1">Próximamente</p>
      )}

      {locked && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Lock size={10} /> {set.price}
        </span>
      )}
      {equipped && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
          <Check size={11} />
        </span>
      )}
    </button>
  );
};

const ComingSoon = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-dashed border-border bg-card/60 px-4 py-5 text-center">
    <p className="text-[11px] text-muted-foreground">{label}</p>
  </div>
);

export default CustomizePage;