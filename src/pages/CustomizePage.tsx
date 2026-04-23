import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Minus, Plus, RotateCcw, Sparkles, Store } from "lucide-react";
import SherpaSpeech from "@/components/SherpaSpeech";
import { toast } from "@/hooks/use-toast";
import { useAiAvatarVariant } from "@/hooks/useAiAvatarVariant";
import { useWallet } from "@/hooks/useWallet";
import { equip } from "@/lib/wallet";
import { SHOP_ITEMS, SLOT_META, getItem } from "@/lib/shopCatalog";
import {
  AI_HAIRS,
  AI_OUTFITS,
  AI_SKINS,
  DEFAULT_AI_VARIANT,
  resolveAiAvatarUrl,
  saveAiVariant,
  type AiAvatarVariant,
  type AiHair,
  type AiOutfit,
  type AiSkin,
} from "@/lib/aiAvatarCatalog";

// User-facing hair types (UI-only). Mapped to the closest renderable AI hair length.
type HairTypeId = "lacio" | "ondulado" | "corto" | "rizado" | "calvo";
const HAIR_TYPES: { id: HairTypeId; label: string; aiHair: AiHair }[] = [
  { id: "lacio",    label: "Lacio",    aiHair: "medium" },
  { id: "ondulado", label: "Ondulado", aiHair: "medium" },
  { id: "corto",    label: "Corto",    aiHair: "short" },
  { id: "rizado",   label: "Rizado",   aiHair: "long" },
  { id: "calvo",    label: "Calvo",    aiHair: "short" },
];

// Hair color palette — UI-only (AI base image hair color is fixed per-variant).
const HAIR_COLORS: { hex: string; label: string }[] = [
  { hex: "#1F1A18", label: "Cuervo" },
  { hex: "#5A2F1B", label: "Castaño" },
  { hex: "#9C6A2A", label: "Miel" },
  { hex: "#D4A65A", label: "Arena" },
  { hex: "#D6622B", label: "Zanahoria" },
  { hex: "#9AA0A6", label: "Ceniza" },
  { hex: "#3FB59A", label: "Menta" },
  { hex: "#A23E7A", label: "Mora" },
];

// Local UI-only prefs (hair type + color don't drive the AI image yet).
const UI_PREFS_KEY = "sherpa.customize.uiPrefs.v1";
type UiPrefs = { hairType: HairTypeId; hairColor: string };
const DEFAULT_UI_PREFS: UiPrefs = { hairType: "corto", hairColor: "#5A2F1B" };

const readUiPrefs = (): UiPrefs => {
  if (typeof window === "undefined") return { ...DEFAULT_UI_PREFS };
  try {
    const raw = window.localStorage.getItem(UI_PREFS_KEY);
    if (!raw) return { ...DEFAULT_UI_PREFS };
    return { ...DEFAULT_UI_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_UI_PREFS };
  }
};

const writeUiPrefs = (patch: Partial<UiPrefs>) => {
  try {
    const next = { ...readUiPrefs(), ...patch };
    window.localStorage.setItem(UI_PREFS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("sherpa:customize-ui-prefs"));
  } catch {
    // ignore
  }
};

import { useEffect, useState } from "react";

const useUiPrefs = (): UiPrefs => {
  const [p, setP] = useState<UiPrefs>(() => readUiPrefs());
  useEffect(() => {
    const sync = () => setP(readUiPrefs());
    window.addEventListener("sherpa:customize-ui-prefs", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sherpa:customize-ui-prefs", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return p;
};

const CustomizePage = () => {
  const navigate = useNavigate();
  const v = useAiAvatarVariant();
  const wallet = useWallet();
  const initialVariant = useRef<AiAvatarVariant>(v);

  const handleReset = () => {
    saveAiVariant(initialVariant.current ?? DEFAULT_AI_VARIANT);
    writeUiPrefs(DEFAULT_UI_PREFS);
    toast({ title: "Restablecido", description: "Volviste al estilo inicial." });
  };

  // Equipped accessories overlay positions (full-body preview).
  const equipped = wallet.equipped;
  const hat = equipped.hat ? getItem(equipped.hat) : null;
  const scarf = equipped.scarf ? getItem(equipped.scarf) : null;
  const backpack = equipped.backpack ? getItem(equipped.backpack) : null;
  const boots = equipped.boots ? getItem(equipped.boots) : null;
  const badge = equipped.badge ? getItem(equipped.badge) : null;

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="text-muted-foreground mb-3" aria-label="Volver">
        <ArrowLeft size={22} />
      </button>

      {/* Live preview — no background panel */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-1 px-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
            Personaliza tu explorador
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold">
            <Sparkles size={11} /> En vivo
          </span>
        </div>
        <div className="relative w-64 h-80 my-2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${v.outfit}-${v.skin}-${v.hair}`}
              src={resolveAiAvatarUrl(v, "full")}
              alt="Avatar IA"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="w-full h-full object-contain"
            />
          </AnimatePresence>
          {hat && <Overlay glyph={hat.glyph} top="6%" left="50%" size="3.2rem" rotate="-4deg" label={hat.name} />}
          {scarf && <Overlay glyph={scarf.glyph} top="44%" left="50%" size="2.4rem" rotate="0deg" label={scarf.name} />}
          {backpack && <Overlay glyph={backpack.glyph} top="40%" left="14%" size="2.6rem" rotate="-12deg" label={backpack.name} />}
          {boots && <Overlay glyph={boots.glyph} top="92%" left="50%" size="2.2rem" rotate="0deg" label={boots.name} />}
          {badge && <Overlay glyph={badge.glyph} top="50%" left="72%" size="1.8rem" rotate="0deg" label={badge.name} />}
        </div>
        <SherpaSpeech
          mood="encouraging"
          size="sm"
          message="Cambios en vivo — los accesorios comprados también se ven."
        />
      </motion.section>

      <AiCustomizePanel />

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleReset}
          className="flex-1 bg-card border border-border text-foreground rounded-2xl py-3 font-bold flex items-center justify-center gap-2"
          aria-label="Restablecer al estilo inicial"
        >
          <RotateCcw size={16} /> Restablecer
        </button>
        <button
          onClick={() => {
            toast({ title: "¡Listo!", description: "Tu explorador está al día." });
            navigate(-1);
          }}
          className="flex-[1.2] gradient-sunrise text-secondary-foreground rounded-2xl py-3 font-bold flex items-center justify-center gap-2 shadow-summit"
        >
          <Check size={16} /> Listo
        </button>
      </div>
    </div>
  );
};

const Overlay = ({
  glyph, top, left, size, rotate, label,
}: { glyph: string; top: string; left: string; size: string; rotate: string; label: string }) => (
  <span
    aria-label={label}
    title={label}
    className="absolute -translate-x-1/2 -translate-y-1/2 leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] pointer-events-none select-none"
    style={{ top, left, fontSize: size, transform: `translate(-50%, -50%) rotate(${rotate})` }}
  >
    {glyph}
  </span>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2">{title}</p>
    {children}
  </div>
);

const ChipButton = ({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`rounded-2xl border py-2 text-xs font-bold transition-colors ${
      active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
    }`}
  >
    {children}
  </button>
);

const AiCustomizePanel = () => {
  const v = useAiAvatarVariant();
  const ui = useUiPrefs();

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
      <Section title="Outfit">
        <div className="grid grid-cols-2 gap-2">
          {AI_OUTFITS.map((o) => (
            <button
              key={o.id}
              onClick={() => saveAiVariant({ outfit: o.id as AiOutfit })}
              className={`text-left rounded-2xl border p-3 transition-colors ${
                v.outfit === o.id ? "bg-primary/10 border-primary text-foreground" : "bg-card border-border text-foreground"
              }`}
            >
              <p className="text-sm font-bold">{o.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{o.desc}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Tono de piel">
        <div className="flex gap-2 flex-wrap">
          {AI_SKINS.map((s) => (
            <button
              key={s.id}
              onClick={() => saveAiVariant({ skin: s.id as AiSkin })}
              aria-label={s.label}
              title={s.label}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                v.skin === s.id ? "border-primary scale-110 shadow-summit" : "border-border"
              }`}
              style={{ backgroundColor: s.swatch }}
            />
          ))}
        </div>
      </Section>

      <Section title="Color de pelo">
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map((c) => {
            const active = ui.hairColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                onClick={() => writeUiPrefs({ hairColor: c.hex })}
                aria-label={c.label}
                title={c.label}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  active ? "border-primary scale-110 shadow-summit" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </Section>

      <Section title="Tipo de pelo">
        <div className="grid grid-cols-3 gap-2">
          {HAIR_TYPES.map((h) => (
            <ChipButton
              key={h.id}
              active={ui.hairType === h.id}
              onClick={() => {
                writeUiPrefs({ hairType: h.id });
                // Map to the closest AI hair length so the base image shifts a bit.
                saveAiVariant({ hair: h.aiHair });
              }}
            >
              {h.label}
            </ChipButton>
          ))}
        </div>
        {(ui.hairType === "ondulado" || ui.hairType === "rizado" || ui.hairType === "calvo" || ui.hairColor !== DEFAULT_UI_PREFS.hairColor) && (
          <p className="mt-2 text-[10px] text-muted-foreground leading-snug">
            El color y algunos tipos de pelo aún no se reflejan en la imagen IA — pronto.
          </p>
        )}
      </Section>

      {/* Largo del pelo (IA) — el atributo real que sí cambia la imagen */}
      <Section title="Largo del pelo (imagen IA)">
        <div className="grid grid-cols-3 gap-2">
          {AI_HAIRS.map((h) => (
            <ChipButton
              key={h.id}
              active={v.hair === h.id}
              onClick={() => saveAiVariant({ hair: h.id as AiHair })}
            >
              {h.label}
            </ChipButton>
          ))}
        </div>
      </Section>

      <AccessoriesSection />
    </motion.div>
  );
};

export default CustomizePage;

const AccessoriesSection = () => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const owned = SHOP_ITEMS.filter((i) => wallet.owned.includes(i.id));
  const lockedCount = SHOP_ITEMS.length - owned.length;

  return (
    <Section title="Accesorios desbloqueados">
      {owned.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Aún no tienes accesorios. Gana Alticoins en cumbres y consigue tu primer equipo.
          </p>
          <button
            onClick={() => navigate("/tienda")}
            className="inline-flex items-center gap-1.5 gradient-sunrise text-secondary-foreground rounded-xl px-4 py-2 text-xs font-bold shadow-summit"
          >
            <Store size={14} /> Visitar tienda
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {owned.map((item) => {
              const isEquipped = wallet.equipped[item.slot] === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => equip(item.slot, isEquipped ? null : item.id)}
                  aria-label={`${isEquipped ? "Quitar" : "Equipar"} ${item.name}`}
                  className={`rounded-2xl border p-2 flex flex-col items-center gap-1 transition-colors ${
                    isEquipped ? "bg-primary/10 border-primary" : "bg-card border-border"
                  }`}
                >
                  <span className="text-2xl leading-none" aria-hidden>{item.glyph}</span>
                  <span className="text-[10px] font-bold text-foreground line-clamp-1 text-center w-full">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {SLOT_META[item.slot].label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      isEquipped ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {isEquipped ? (<><Minus size={9} /> Quitar</>) : (<><Plus size={9} /> Equipar</>)}
                  </span>
                </button>
              );
            })}
          </div>
          {lockedCount > 0 && (
            <button
              onClick={() => navigate("/tienda")}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-card border border-dashed border-border text-muted-foreground hover:text-foreground rounded-2xl py-2 text-xs font-bold transition-colors"
            >
              <Lock size={12} /> {lockedCount} accesorios más en la tienda
            </button>
          )}
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            Los accesorios equipados se ven sobre el explorador en vivo arriba.
          </p>
        </>
      )}
    </Section>
  );
};
