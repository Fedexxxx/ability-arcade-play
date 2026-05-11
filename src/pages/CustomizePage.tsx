/**
 * Personaliza tu Explorador.
 *
 * Two sections:
 *   1. Personajes         → 6 complete Explorador variants (Clásico free + 5
 *                           unlockables) bought with Alticoins.
 *   2. Próximos premios   → coming-soon previews (visually disabled).
 *
 * Reward loop: earn Alticoins → unlock a complete Explorador variant with
 * `spend()` → it gets recorded in `ownedGearSetIds` and auto-equipped →
 * MountainAvatar shows the equipped PNG everywhere, persisted in
 * localStorage. Skin tone customization has been removed; the Explorador
 * always uses the default tone internally.
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
  BASECAMP_GEAR_SETS,
  BASECAMP_GEAR_COMING_SOON,
  DEFAULT_GEAR_SET_ID,
  getGearSet,
  getSkinVariant,
  type BasecampGearSet,
} from "@/lib/basecamp";
import { equipGearSet, unlockGearSet } from "@/lib/character/state";
import { spend } from "@/lib/wallet";

const CustomizePage = () => {
  const navigate = useNavigate();
  const { skinTone, equippedGearSetId, ownedGearSetIds } = useCharacter();
  const wallet = useWallet();
  const activeSkin = getSkinVariant(skinTone);
  const equippedGear = getGearSet(equippedGearSetId);
  const equippedName = equippedGear?.name ?? "Explorador Clásico";
  const [sherpaMsg, setSherpaMsg] = useState<string | null>(null);

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
      description: "¡Tu Explorador está listo para la aventura!",
    });
  };

  const handleBuy = async (g: BasecampGearSet) => {
    if (g.tier !== "shop" || isOwned(g)) return;
    if (wallet.balance < g.price) {
      toast({
        title: "Faltan Alticoins",
        description:
          "Necesitas más Alticoins para desbloquear este Explorador.",
      });
      setSherpaMsg("Sigue subiendo y vuelve por tu nuevo Explorador.");
      return;
    }
    const result = await spend({ id: `gear:${g.id}`, price: g.price, label: g.name });
    if (!result.ok) return;
    unlockGearSet(g.id); // also auto-equips it
    celebrate();
    setSherpaMsg(`${g.name} desbloqueado. Te queda increíble.`);
    toast({
      title: "¡Nuevo Explorador desbloqueado!",
      description: `${g.name} ya es parte de tu colección.`,
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
            Tu Explorador
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
              "Desbloquea nuevos Exploradores con tus Alticoins."
            }
          />
        </div>
      </motion.section>

      {/* SECTION 1 — Complete Explorador variants */}
      <Section
        title="Personajes"
        subtitle="Exploradores completos. Desbloquéalos con Alticoins y equípalos al instante."
      >
        <div className="grid grid-cols-2 gap-3">
          {BASECAMP_GEAR_SETS.map((g) => (
            <GearCard
              key={g.id}
              gear={g}
              skinImage={activeSkin.image}
              owned={isOwned(g)}
              equipped={isEquipped(g)}
              balance={wallet.balance}
              onBuy={() => handleBuy(g)}
              onEquip={() => handleEquip(g)}
            />
          ))}
        </div>
      </Section>

      {/* SECTION 2 — Coming soon */}
      <Section
        title="Próximos premios"
        subtitle="Exploradores en preparación para futuras expediciones."
      >
        <div className="grid grid-cols-3 gap-2.5">
          {BASECAMP_GEAR_COMING_SOON.map((g) => (
            <ComingSoonCard key={g.id} gear={g} />
          ))}
        </div>
      </Section>

      <p className="text-[10px] text-muted-foreground text-center mt-6 px-6">
        Cada personaje es un Explorador completo.
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

const GearCard = ({
  gear,
  skinImage,
  owned,
  equipped,
  balance,
  onBuy,
  onEquip,
}: {
  gear: BasecampGearSet;
  /** Used as the preview source when the gear set has no dedicated PNG (the
   * free Clásico look — it should show the user's current skin tone, not
   * whatever gear is currently equipped on the live avatar). */
  skinImage: string;
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
        <img
          src={gear.image || skinImage}
          alt={gear.name}
          width={1024}
          height={1024}
          loading="lazy"
          draggable={false}
          className={`w-full h-full object-contain ${showLockedDim ? "grayscale opacity-80" : ""}`}
        />
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