import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Lock, RotateCcw, Shuffle, Sparkles, Store } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { useMountainAvatar } from "@/hooks/useMountainAvatar";
import MountainAvatar from "@/components/avatar/MountainAvatar";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";
import {
  ACC_COLOR_CHOICES, ACCESSORY_COLORS, BACKPACK_OPTIONS, BADGE_OPTIONS,
  BOOTS_COLOR_CHOICES, BOOTS_OPTIONS, BOTTOM_COLOR_CHOICES, BOTTOM_OPTIONS,
  DEFAULT_MOUNTAIN_AVATAR, EXPRESSION_OPTIONS, HAIR_COLORS, HAIR_COLOR_OPTIONS,
  HAIR_STYLES, HAT_OPTIONS, NECK_OPTIONS, OUTFIT_COLORS, PRESETS, SKIN_PALETTE,
  SKIN_TONES, TOP_COLOR_CHOICES, TOP_OPTIONS,
  randomizeAvatar, saveMountainAvatar, setMountainAvatar, unlockedOptionIds,
  type AccessoryColorId, type GearOption, type HairColorId, type HairStyleId,
  type MountainAvatar as MA, type OutfitColorId, type SkinToneId,
} from "@/lib/mountainAvatar";

type Tab = "skin" | "hair" | "outfit" | "accessories" | "backpack" | "presets";
const TABS: { id: Tab; label: string }[] = [
  { id: "skin", label: "Piel" }, { id: "hair", label: "Pelo" },
  { id: "outfit", label: "Ropa" }, { id: "accessories", label: "Accesorios" },
  { id: "backpack", label: "Mochila" }, { id: "presets", label: "Estilos" },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2">{title}</p>
    {children}
  </div>
);
const Swatch = ({ hex, label, active, onClick }: { hex: string; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} aria-label={label} title={label}
    className={`w-9 h-9 rounded-full border-2 transition-transform ${active ? "border-primary scale-110 shadow-summit" : "border-border"}`}
    style={{ backgroundColor: hex }} />
);
const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}
    className={`rounded-2xl border py-2 px-3 text-xs font-bold transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
    {children}
  </button>
);
const GearCard = ({ option, active, locked, onSelect, onLockedClick }:
  { option: GearOption; active: boolean; locked: boolean; onSelect: () => void; onLockedClick: () => void }) => {
  const lockLabel = option.lockReason === "adventure" ? "Desbloquéalo en aventuras" : "Desbloquéalo con Alticoins";
  return (
    <button onClick={locked ? onLockedClick : onSelect}
      className={`relative text-left rounded-2xl border p-3 transition-colors ${
        locked ? "bg-card/60 border-dashed border-border opacity-70"
        : active ? "bg-primary/10 border-primary" : "bg-card border-border"}`}>
      <p className="text-sm font-bold leading-tight">{option.label}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{locked ? lockLabel : option.free ? "Gratis" : "Desbloqueado"}</p>
      {locked && <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground"><Lock size={11} /></span>}
      {active && !locked && <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground"><Check size={11} /></span>}
    </button>
  );
};

const CustomizePage = () => {
  const navigate = useNavigate();
  const avatar = useMountainAvatar();
  const wallet = useWallet();
  const initial = useRef<MA>(avatar);
  const [tab, setTab] = useState<Tab>("skin");
  const unlocked = useMemo(() => unlockedOptionIds(wallet), [wallet]);
  const goShop = () => { toast({ title: "Bloqueado", description: "Consíguelo con Alticoins." }); navigate("/tienda"); };
  const handleReset = () => { setMountainAvatar(initial.current ?? DEFAULT_MOUNTAIN_AVATAR); toast({ title: "Restablecido", description: "Volviste al estilo inicial." }); };
  const handleRandomize = () => { setMountainAvatar(randomizeAvatar(unlocked)); celebrate(); };

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="text-muted-foreground mb-3" aria-label="Volver"><ArrowLeft size={22} /></button>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-1 px-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">Personaliza tu explorador</p>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold"><Sparkles size={11} /> En vivo</span>
        </div>
        <div className="relative w-64 h-80 my-2"><MountainAvatar avatar={avatar} variant="full" /></div>
        <SherpaSpeech mood="encouraging" size="sm" message="Cambios en vivo. Desbloquea más equipo en la tienda." />
      </motion.section>

      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 mb-3">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${tab === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}>

          {tab === "skin" && (<>
            <Section title="Tono de piel">
              <div className="flex gap-2 flex-wrap">{SKIN_TONES.map((s) => (
                <Swatch key={s.id} hex={SKIN_PALETTE[s.id]} label={s.label} active={avatar.skinTone === s.id}
                  onClick={() => saveMountainAvatar({ skinTone: s.id as SkinToneId })} />))}</div>
            </Section>
            <Section title="Expresión">
              <div className="grid grid-cols-2 gap-2">{EXPRESSION_OPTIONS.map((e) => (
                <Chip key={e.id} active={avatar.expression === e.id} onClick={() => saveMountainAvatar({ expression: e.id })}>{e.label}</Chip>))}</div>
            </Section>
          </>)}

          {tab === "hair" && (<>
            <Section title="Estilo">
              <div className="grid grid-cols-3 gap-2">{HAIR_STYLES.map((h) => (
                <Chip key={h.id} active={avatar.hairStyle === h.id} onClick={() => saveMountainAvatar({ hairStyle: h.id as HairStyleId })}>{h.label}</Chip>))}</div>
            </Section>
            <Section title="Color">
              <div className="flex gap-2 flex-wrap">{HAIR_COLOR_OPTIONS.map((c) => (
                <Swatch key={c.id} hex={HAIR_COLORS[c.id]} label={c.label} active={avatar.hairColor === c.id}
                  onClick={() => saveMountainAvatar({ hairColor: c.id as HairColorId })} />))}</div>
            </Section>
          </>)}

          {tab === "outfit" && (<>
            <Section title="Chaqueta">
              <div className="grid grid-cols-2 gap-2">{TOP_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.top === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ top: o.id })} onLockedClick={goShop} />))}</div>
              <div className="mt-3 flex gap-2 flex-wrap">{TOP_COLOR_CHOICES.map((c) => (
                <Swatch key={c} hex={OUTFIT_COLORS[c]} label={c} active={avatar.topColor === c}
                  onClick={() => saveMountainAvatar({ topColor: c as OutfitColorId })} />))}</div>
            </Section>
            <Section title="Pantalón">
              <div className="grid grid-cols-2 gap-2">{BOTTOM_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.bottom === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ bottom: o.id })} onLockedClick={goShop} />))}</div>
              <div className="mt-3 flex gap-2 flex-wrap">{BOTTOM_COLOR_CHOICES.map((c) => (
                <Swatch key={c} hex={OUTFIT_COLORS[c]} label={c} active={avatar.bottomColor === c}
                  onClick={() => saveMountainAvatar({ bottomColor: c as OutfitColorId })} />))}</div>
            </Section>
            <Section title="Botas">
              <div className="grid grid-cols-2 gap-2">{BOOTS_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.boots === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ boots: o.id })} onLockedClick={goShop} />))}</div>
              <div className="mt-3 flex gap-2 flex-wrap">{BOOTS_COLOR_CHOICES.map((c) => (
                <Swatch key={c} hex={OUTFIT_COLORS[c]} label={c} active={avatar.bootsColor === c}
                  onClick={() => saveMountainAvatar({ bootsColor: c as OutfitColorId })} />))}</div>
            </Section>
          </>)}

          {tab === "accessories" && (<>
            <Section title="Gorro">
              <div className="grid grid-cols-2 gap-2">{HAT_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.hat === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ hat: o.id })} onLockedClick={goShop} />))}</div>
              {avatar.hat !== "none" && (
                <div className="mt-3 flex gap-2 flex-wrap">{ACC_COLOR_CHOICES.map((c) => (
                  <Swatch key={c} hex={ACCESSORY_COLORS[c]} label={c} active={avatar.hatColor === c}
                    onClick={() => saveMountainAvatar({ hatColor: c as AccessoryColorId })} />))}</div>)}
            </Section>
            <Section title="Cuello">
              <div className="grid grid-cols-2 gap-2">{NECK_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.neck === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ neck: o.id })} onLockedClick={goShop} />))}</div>
              {avatar.neck !== "none" && (
                <div className="mt-3 flex gap-2 flex-wrap">{ACC_COLOR_CHOICES.map((c) => (
                  <Swatch key={c} hex={ACCESSORY_COLORS[c]} label={c} active={avatar.neckColor === c}
                    onClick={() => saveMountainAvatar({ neckColor: c as AccessoryColorId })} />))}</div>)}
            </Section>
            <Section title="Insignia">
              <div className="grid grid-cols-2 gap-2">{BADGE_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.badge === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ badge: o.id })} onLockedClick={goShop} />))}</div>
            </Section>
            <button onClick={() => navigate("/tienda")}
              className="w-full mt-1 inline-flex items-center justify-center gap-1.5 bg-card border border-dashed border-border text-muted-foreground hover:text-foreground rounded-2xl py-2 text-xs font-bold">
              <Store size={12} /> Visitar la tienda
            </button>
          </>)}

          {tab === "backpack" && (<>
            <Section title="Mochila">
              <div className="grid grid-cols-2 gap-2">{BACKPACK_OPTIONS.map((o) => (
                <GearCard key={o.id} option={o} active={avatar.backpack === o.id} locked={!o.free && !unlocked.has(o.id)}
                  onSelect={() => saveMountainAvatar({ backpack: o.id })} onLockedClick={goShop} />))}</div>
              {avatar.backpack !== "none" && (
                <div className="mt-3 flex gap-2 flex-wrap">{ACC_COLOR_CHOICES.map((c) => (
                  <Swatch key={c} hex={ACCESSORY_COLORS[c]} label={c} active={avatar.backpackColor === c}
                    onClick={() => saveMountainAvatar({ backpackColor: c as AccessoryColorId })} />))}</div>)}
            </Section>
          </>)}

          {tab === "presets" && (
            <Section title="Estilos rápidos">
              <div className="grid grid-cols-2 gap-3">{PRESETS.map((p) => {
                const ids = [p.config.top, p.config.bottom, p.config.boots, p.config.hat, p.config.neck, p.config.backpack, p.config.badge];
                const FREE = new Set(["alpine-jacket", "trail-pants", "classic-hiking", "none"]);
                const lockedItems = ids.filter((id) => !FREE.has(id) && !unlocked.has(id));
                const isLocked = !p.freeOnly && lockedItems.length > 0;
                return (
                  <button key={p.id}
                    onClick={() => {
                      if (isLocked) { toast({ title: "Estilo bloqueado", description: "Algunas piezas aún no están desbloqueadas." }); return; }
                      setMountainAvatar(p.config); celebrate();
                    }}
                    className={`relative text-left rounded-2xl border p-3 transition-colors ${isLocked ? "bg-card/60 border-dashed border-border opacity-70" : "bg-card border-border hover:border-primary/40"}`}>
                    <p className="font-display text-sm leading-tight">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{p.blurb}</p>
                    {isLocked && <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground"><Lock size={11} /></span>}
                    {p.freeOnly && <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary-soft px-1.5 py-0.5 rounded-full">Free</span>}
                  </button>
                );
              })}</div>
            </Section>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <button onClick={handleRandomize} className="flex-1 bg-card border border-border text-foreground rounded-2xl py-3 font-bold flex items-center justify-center gap-2"><Shuffle size={16} /> Sorpréndeme</button>
          <button onClick={handleReset} className="flex-1 bg-card border border-border text-foreground rounded-2xl py-3 font-bold flex items-center justify-center gap-2"><RotateCcw size={16} /> Restablecer</button>
        </div>
        <button onClick={() => { toast({ title: "¡Listo!", description: "Tu explorador está al día." }); navigate(-1); }}
          className="w-full gradient-sunrise text-secondary-foreground rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 shadow-summit">
          <Check size={16} /> Guardar explorador
        </button>
      </div>
    </div>
  );
};

export default CustomizePage;
