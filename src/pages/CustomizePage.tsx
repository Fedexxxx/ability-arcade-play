/**
 * Personaliza tu Basecamp.
 *
 * Three sections:
 *   1. Tu Basecamp        → skin-tone identity picker (5 variants).
 *   2. Equipo de aventura → 6 gear sets: Clásico (free) + 5 unlockables.
 *   3. Próximos premios   → coming-soon previews (visually disabled).
 *
 * Reward loop: earn Alticoins → unlock a gear set with `spend()` → it gets
 * recorded in `ownedGearSetIds` and auto-equipped → MountainAvatar shows
 * the equipped PNG everywhere in the app, persisted in localStorage.
 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Lock,
  Sparkles,
  Hourglass,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MountainAvatar from "@/components/avatar/MountainAvatar";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";
import { useCharacter } from "@/hooks/useCharacter";
import { useWallet } from "@/hooks/useWallet";
import {
  BASECAMP_SKIN_VARIANTS,
  BASECAMP_GEAR_SETS,
  BASECAMP_GEAR_COMING_SOON,
  DEFAULT_GEAR_SET_ID,
  getGearSet,
  getSkinVariant,
  type BasecampGearSet,
  type BasecampSkinTone,
  type BasecampSkinVariant,
} from "@/lib/basecamp";
import { equipGearSet, setSkinTone, unlockGearSet } from "@/lib/character/state";
import { spend } from "@/lib/wallet";

const CustomizePage = () => {
  const navigate = useNavigate();
  const { skinTone, equippedGearSetId, ownedGearSetIds } = useCharacter();
  const wallet = useWallet();
  const activeSkin = getSkinVariant(skinTone);
  const equippedGear = getGearSet(equippedGearSetId);
  const equippedName = equippedGear?.name ?? "Basecamp Clásico";
  const [sherpaMsg, setSherpaMsg] = useState<string | null>(null);

  const onPickSkin = (tone: BasecampSkinTone) => {
    if (tone === skinTone) return;
    setSkinTone(tone);
    celebrate();
  };

  const isOwned = (g: BasecampGearSet): boolean =>
    g.id === DEFAULT_GEAR_SET_ID || ownedGearSetIds.includes(g.id);

  const isEquipped = (g: BasecampGearSet): boolean => {
    if (g.id === DEFAULT_GEAR_SET_ID) return equippedGearSetId === null;
    return equippedGearSetId === g.id;
  };

  const handleEquip = (g: BasecampGearSet) => {
    if (!isOwned(g)) return;
    if (isEquipped(g)) return;
    equipGearSet(g.id === DEFAULT_GEAR_SET_ID ? null : g.id);
    celebrate();
    setSherpaMsg(`${g.name} listo para la cumbre.`);
    toast({
      title: "¡Equipado!",
      description: "¡Basecamp está listo para la aventura!",
    });
  };

  const handleBuy = (g: BasecampGearSet) => {
    if (g.tier !== "shop" || isOwned(g)) return;
    if (wallet.balance < g.price) {
      toast({
        title: "Faltan Alticoins",
        description:
          "Necesitas más Alticoins para desbloquear este equipo.",
      });
      setSherpaMsg("Sigue subiendo y vuelve por tu equipo.");
      return;
    }
    const result = spend({ id: `gear:${g.id}`, price: g.price, label: g.name });
    if (!result.ok) return;
    unlockGearSet(g.id); // also auto-equips it
    celebrate();
    setSherpaMsg(`${g.name} desbloqueado. Te queda increíble.`);
    toast({
      title: "¡Nuevo equipo desbloqueado!",
      description: `${g.name} ya es parte de tu equipo.`,
    });
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

      {/* HERO — large preview with equipped gear name + Alticoin balance */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-1 px-1">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
            Tu Basecamp
          </span>
          <span className="inline-flex items-center gap-1 bg-secondary-soft text-secondary rounded-full px-2.5 py-1">
            <Sparkles size={12} />
            <span className="text-xs font-bold">{wallet.balance}</span>
          </span>
        </div>
        <div className="relative w-80 h-96 my-2 sm:w-[22rem] sm:h-[26rem]">
          <MountainAvatar key={`${activeSkin.id}-${equippedGearSetId ?? "classic"}`} variant="full" />
        </div>
        <p className="font-display text-2xl leading-tight text-center">
          {equippedName}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1 px-4">
          Tu compañero de aventura.
        </p>
        <div className="mt-3 w-full">
          <SherpaSpeech
            mood="encouraging"
            size="sm"
            message={
              sherpaMsg ??
              "Cambia tu identidad o desbloquea equipo con Alticoins."
            }
          />
        </div>
      </motion.section>

      {/* SECTION 1 — Skin tone identity */}
      <Section
        title="Tu Basecamp"
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

      {/* SECTION 2 — Gear sets */}
      <Section
        title="Equipo de aventura"
        subtitle="Conjuntos completos. Desbloquéalos con Alticoins y equípalos al instante."
      >
        <div className="grid grid-cols-2 gap-3">
          {BASECAMP_GEAR_SETS.map((g) => (
            <GearCard
              key={g.id}
              gear={g}
              owned={isOwned(g)}
              equipped={isEquipped(g)}
              balance={wallet.balance}
              onBuy={() => handleBuy(g)}
              onEquip={() => handleEquip(g)}
            />
          ))}
        </div>
      </Section>

      {/* SECTION 3 — Coming soon */}
      <Section
        title="Próximos premios"
        subtitle="Conjuntos en preparación para futuras expediciones."
      >
        <div className="grid grid-cols-3 gap-2.5">
          {BASECAMP_GEAR_COMING_SOON.map((g) => (
            <ComingSoonCard key={g.id} gear={g} />
          ))}
        </div>
      </Section>

      <p className="text-[10px] text-muted-foreground text-center mt-6 px-6">
        Cada conjunto es un Basecamp completo. Sin accesorios sueltos.
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
  <section className="mb-7">
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
      {title}
    </p>
    {subtitle && (
      <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
    )}
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

const GearCard = ({
  gear,
  owned,
  equipped,
  balance,
  onBuy,
  onEquip,
}: {
  gear: BasecampGearSet;
  owned: boolean;
  equipped: boolean;
  balance: number;
  onBuy: () => void;
  onEquip: () => void;
}) => {
  const affordable = balance >= gear.price;
  const showLockedDim = !owned && !affordable;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-card border rounded-3xl p-3 shadow-terrain flex flex-col ${
        equipped
          ? "border-primary ring-2 ring-primary/30"
          : owned
            ? "border-primary/40"
            : "border-border"
      }`}
    >
      {equipped && (
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-terrain">
          <Check size={10} /> Equipado
        </div>
      )}
      {!equipped && owned && gear.tier !== "free" && (
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-secondary-soft text-secondary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          <Check size={10} /> Tuyo
        </div>
      )}

      {/* Preview */}
      <div className="aspect-square w-full rounded-2xl bg-gradient-to-b from-muted/40 to-card overflow-hidden flex items-center justify-center mb-2">
        {gear.image ? (
          <img
            src={gear.image}
            alt={gear.name}
            width={1024}
            height={1024}
            loading="lazy"
            draggable={false}
            className={`w-full h-full object-contain ${showLockedDim ? "grayscale opacity-80" : ""}`}
          />
        ) : (
          // Free Clásico has no dedicated image — render the live Basecamp.
          <div className="w-full h-full">
            <MountainAvatar variant="full" animate={false} />
          </div>
        )}
      </div>

      <p className="font-display text-sm leading-tight">{gear.name}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
        {gear.blurb}
      </p>

      <div className="mt-3">
        {owned ? (
          <button
            onClick={onEquip}
            disabled={equipped}
            className={`w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              equipped
                ? "bg-primary/10 text-primary cursor-default"
                : "bg-card text-foreground border border-primary/40 hover:bg-primary/5"
            }`}
          >
            {equipped ? (
              <>
                <Check size={14} /> Equipado
              </>
            ) : (
              "Equipar"
            )}
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={!affordable}
            aria-disabled={!affordable}
            className={`w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              affordable
                ? "gradient-sunrise text-secondary-foreground shadow-summit"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {affordable ? <Sparkles size={14} /> : <Lock size={12} />}
            <span>{gear.price}</span>
            <span className="opacity-80">{affordable ? "Comprar" : "Alticoins"}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ComingSoonCard = ({ gear }: { gear: BasecampGearSet }) => (
  <div
    className="relative bg-card/60 border border-dashed border-border rounded-3xl p-2.5 flex flex-col items-center text-center"
    aria-label={`${gear.name} — próximamente`}
  >
    <div className="aspect-square w-full rounded-2xl bg-muted/40 flex items-center justify-center mb-2">
      <Hourglass size={26} className="text-muted-foreground opacity-70" />
    </div>
    <p className="font-display text-[12px] leading-tight">{gear.name}</p>
    <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">
      Próximamente
    </p>
  </div>
);

export default CustomizePage;