import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import ExplorerSvg from "@/components/ExplorerSvg";
import SherpaSpeech from "@/components/SherpaSpeech";
import { useExplorerStyle } from "@/hooks/useExplorerStyle";
import { useWallet } from "@/hooks/useWallet";
import { getItem, SLOT_META } from "@/lib/shopCatalog";
import type { CosmeticSlot } from "@/lib/wallet";
import {
  ACCESSORY_COLORS,
  BACKPACK_OPTIONS,
  BOOTS_COLORS,
  EYE_COLORS,
  EYE_SHAPES,
  EYEBROW_STYLES,
  HAIR_COLORS,
  HAIR_STYLES,
  HAT_OPTIONS,
  JACKET_COLORS,
  PANTS_COLORS,
  SCARF_OPTIONS,
  SKIN_PALETTE,
  saveExplorerStyle,
  type AccBackpack,
  type AccHat,
  type AccScarf,
  type EyebrowStyle,
  type EyeShape,
  type HairStyle,
  type SkinTone,
} from "@/lib/explorerStyle";
import { toast } from "@/hooks/use-toast";
import { useAvatarMode } from "@/hooks/useAvatarMode";
import { setAvatarMode } from "@/lib/avatarMode";
import { useAiAvatarVariant } from "@/hooks/useAiAvatarVariant";
import {
  AI_HAIRS,
  AI_OUTFITS,
  AI_SKINS,
  resolveAiAvatarUrl,
  saveAiVariant,
  type AiHair,
  type AiOutfit,
  type AiSkin,
} from "@/lib/aiAvatarCatalog";

type Tab = "cara" | "pelo" | "ropa" | "accesorios";

const TABS: { id: Tab; label: string }[] = [
  { id: "cara", label: "Cara" },
  { id: "pelo", label: "Pelo" },
  { id: "ropa", label: "Ropa" },
  { id: "accesorios", label: "Accesorios" },
];

const SHERPA_BY_TAB: Record<Tab, string> = {
  cara: "Tus rasgos te hacen único. Toca para probar.",
  pelo: "Tu pelo, tu estilo. Cambia las veces que quieras.",
  ropa: "Ropa para escalar — los colores son tuyos.",
  accesorios: "Equipo de explorador para tu aventura.",
};

const CustomizePage = () => {
  const navigate = useNavigate();
  const style = useExplorerStyle();
  const wallet = useWallet();
  const mode = useAvatarMode();
  const aiVariant = useAiAvatarVariant();
  const [tab, setTab] = useState<Tab>("cara");
  const initialStyle = useRef(style);
  const [touched, setTouched] = useState<Record<Tab, boolean>>({
    cara: false,
    pelo: false,
    ropa: false,
    accesorios: false,
  });

  const equippedChips = useMemo(() => {
    const slots: CosmeticSlot[] = ["hat", "scarf", "backpack", "boots", "badge"];
    return slots
      .map((slot) => {
        const id = wallet.equipped[slot];
        if (!id) return null;
        const item = getItem(id);
        if (!item) return null;
        return { slot, glyph: item.glyph, name: item.name };
      })
      .filter((x): x is { slot: CosmeticSlot; glyph: string; name: string } => x !== null);
  }, [wallet.equipped]);

  const update = (patch: Parameters<typeof saveExplorerStyle>[0]) => {
    saveExplorerStyle(patch);
    setTouched((t) => ({ ...t, [tab]: true }));
  };

  const handleReset = () => {
    saveExplorerStyle(initialStyle.current);
    setTouched({ cara: false, pelo: false, ropa: false, accesorios: false });
    toast({ title: "Restablecido", description: "Volviste al estilo inicial." });
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="text-muted-foreground mb-3" aria-label="Volver">
        <ArrowLeft size={22} />
      </button>

      {/* A/B mode toggle */}
      <div
        role="tablist"
        aria-label="Modo de avatar"
        className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-2xl mb-4"
      >
        <button
          role="tab"
          aria-selected={mode === "svg"}
          onClick={() => setAvatarMode("svg")}
          className={`rounded-xl py-2 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            mode === "svg"
              ? "bg-card text-foreground shadow-terrain"
              : "text-muted-foreground"
          }`}
        >
          <Sparkles size={13} /> Clásico (SVG)
        </button>
        <button
          role="tab"
          aria-selected={mode === "ai"}
          onClick={() => setAvatarMode("ai")}
          className={`rounded-xl py-2 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            mode === "ai"
              ? "bg-card text-foreground shadow-terrain"
              : "text-muted-foreground"
          }`}
        >
          <Wand2 size={13} /> Nuevo (IA)
          <span className="ml-1 text-[9px] uppercase tracking-wider bg-secondary text-secondary-foreground rounded-full px-1.5 py-0.5">
            beta
          </span>
        </button>
      </div>

      {/* Live preview */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-5 shadow-terrain mb-5 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
            Personaliza tu explorador
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold">
            <Sparkles size={11} /> En vivo
          </span>
        </div>
        {mode === "svg" ? (
          <motion.div
            className="w-44 h-72 my-2"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ExplorerSvg style={style} gear={wallet.equipped} variant="full" className="w-full h-full" />
          </motion.div>
        ) : (
          <div className="w-56 h-72 my-2 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${aiVariant.outfit}-${aiVariant.skin}-${aiVariant.hair}`}
                src={resolveAiAvatarUrl(aiVariant, "full")}
                alt="Avatar IA"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>
          </div>
        )}
        <SherpaSpeech
          mood="encouraging"
          size="sm"
          message={
            mode === "ai"
              ? "Versión beta — sin accesorios todavía."
              : SHERPA_BY_TAB[tab]
          }
        />

        {/* Mi equipo — chips of equipped Shop gear (hidden in AI mode) */}
        {mode === "svg" && (
        <div className="w-full mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-bold">Mi equipo</p>
            <button
              onClick={() => navigate("/tienda")}
              className="text-[10px] font-bold text-primary"
            >
              Cambiar en la tienda →
            </button>
          </div>
          {equippedChips.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Aún no llevas equipo de la tienda. Conquista cumbres para conseguir Alticoins.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {equippedChips.map((chip) => (
                <span
                  key={chip.slot}
                  className="inline-flex items-center gap-1 bg-muted text-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  title={`${SLOT_META[chip.slot].label}: ${chip.name}`}
                >
                  <span aria-hidden>{chip.glyph}</span>
                  <span className="truncate max-w-[7rem]">{chip.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        )}
      </motion.section>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-full py-2 text-[11px] font-bold capitalize transition-colors ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {t.label}
            {touched[t.id] && (
              <span
                className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-secondary"
                aria-label="Cambios sin restablecer"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "cara" && (
            <>
              <Section title="Tono de piel">
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(SKIN_PALETTE) as SkinTone[]).map((id) => (
                    <SwatchButton
                      key={id}
                      color={SKIN_PALETTE[id].base}
                      active={style.skin === id}
                      onClick={() => update({ skin: id })}
                      label={SKIN_PALETTE[id].label}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Forma de ojos">
                <div className="grid grid-cols-3 gap-2">
                  {EYE_SHAPES.map((s) => (
                    <ChipButton
                      key={s.id}
                      active={style.eyeShape === s.id}
                      onClick={() => update({ eyeShape: s.id as EyeShape })}
                    >
                      {s.label}
                    </ChipButton>
                  ))}
                </div>
              </Section>

              <Section title="Color de ojos">
                <div className="grid grid-cols-5 gap-2">
                  {EYE_COLORS.map((c) => (
                    <SwatchButton
                      key={c.hex}
                      color={c.hex}
                      active={style.eyeColor === c.hex}
                      onClick={() => update({ eyeColor: c.hex })}
                      label={c.label}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Cejas">
                <div className="grid grid-cols-3 gap-2">
                  {EYEBROW_STYLES.map((s) => (
                    <ChipButton
                      key={s.id}
                      active={style.eyebrow === s.id}
                      onClick={() => update({ eyebrow: s.id as EyebrowStyle })}
                    >
                      {s.label}
                    </ChipButton>
                  ))}
                </div>
              </Section>

              <Section title="Pecas">
                <div className="grid grid-cols-2 gap-2">
                  <ChipButton active={!style.freckles} onClick={() => update({ freckles: false })}>
                    Sin pecas
                  </ChipButton>
                  <ChipButton active={style.freckles} onClick={() => update({ freckles: true })}>
                    Con pecas
                  </ChipButton>
                </div>
              </Section>
            </>
          )}

          {tab === "pelo" && (
            <>
              <Section title="Estilo">
                <div className="grid grid-cols-3 gap-2">
                  {HAIR_STYLES.map((h) => (
                    <ChipButton
                      key={h.id}
                      active={style.hair === h.id}
                      onClick={() => update({ hair: h.id as HairStyle })}
                    >
                      {h.label}
                    </ChipButton>
                  ))}
                </div>
              </Section>
              <Section title="Color de pelo">
                <div className="grid grid-cols-8 gap-2">
                  {HAIR_COLORS.map((c) => (
                    <SwatchButton
                      key={c.id}
                      color={c.hex}
                      active={style.hairColor === c.hex}
                      onClick={() => update({ hairColor: c.hex })}
                      label={c.label}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}

          {tab === "ropa" && (
            <>
              <Section title="Chaqueta">
                <div className="grid grid-cols-8 gap-2">
                  {JACKET_COLORS.map((c) => (
                    <SwatchButton
                      key={c.hex}
                      color={c.hex}
                      active={style.jacketColor === c.hex}
                      onClick={() => update({ jacketColor: c.hex })}
                      label={c.label}
                    />
                  ))}
                </div>
              </Section>
              <Section title="Pantalones">
                <div className="grid grid-cols-6 gap-2">
                  {PANTS_COLORS.map((c) => (
                    <SwatchButton
                      key={c.hex}
                      color={c.hex}
                      active={style.pantsColor === c.hex}
                      onClick={() => update({ pantsColor: c.hex })}
                      label={c.label}
                    />
                  ))}
                </div>
              </Section>
              <Section title="Botas">
                <div className="grid grid-cols-4 gap-2">
                  {BOOTS_COLORS.map((c) => (
                    <SwatchButton
                      key={c.hex}
                      color={c.hex}
                      active={style.bootsColor === c.hex}
                      onClick={() => update({ bootsColor: c.hex })}
                      label={c.label}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}

          {tab === "accesorios" && (
            <>
              <p className="text-[11px] text-muted-foreground mb-3">
                Estos accesorios están incluidos. El equipo de la tienda tiene prioridad si lo llevas puesto.
              </p>

              <Section title="Sombrero">
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {HAT_OPTIONS.map((h) => (
                    <ChipButton
                      key={h.id}
                      active={style.accHat === h.id}
                      onClick={() => update({ accHat: h.id as AccHat })}
                    >
                      {h.label}
                    </ChipButton>
                  ))}
                </div>
                {style.accHat !== "none" && (
                  <div className="grid grid-cols-8 gap-2">
                    {ACCESSORY_COLORS.map((c) => (
                      <SwatchButton
                        key={c.hex}
                        color={c.hex}
                        active={style.accHatColor === c.hex}
                        onClick={() => update({ accHatColor: c.hex })}
                        label={c.label}
                      />
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Bufanda">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {SCARF_OPTIONS.map((s) => (
                    <ChipButton
                      key={s.id}
                      active={style.accScarf === s.id}
                      onClick={() => update({ accScarf: s.id as AccScarf })}
                    >
                      {s.label}
                    </ChipButton>
                  ))}
                </div>
                {style.accScarf !== "none" && (
                  <div className="grid grid-cols-8 gap-2">
                    {ACCESSORY_COLORS.map((c) => (
                      <SwatchButton
                        key={c.hex}
                        color={c.hex}
                        active={style.accScarfColor === c.hex}
                        onClick={() => update({ accScarfColor: c.hex })}
                        label={c.label}
                      />
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Mochila">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {BACKPACK_OPTIONS.map((b) => (
                    <ChipButton
                      key={b.id}
                      active={style.accBackpack === b.id}
                      onClick={() => update({ accBackpack: b.id as AccBackpack })}
                    >
                      {b.label}
                    </ChipButton>
                  ))}
                </div>
                {style.accBackpack !== "none" && (
                  <div className="grid grid-cols-8 gap-2">
                    {ACCESSORY_COLORS.map((c) => (
                      <SwatchButton
                        key={c.hex}
                        color={c.hex}
                        active={style.accBackpackColor === c.hex}
                        onClick={() => update({ accBackpackColor: c.hex })}
                        label={c.label}
                      />
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Gafas de aventura">
                <div className="grid grid-cols-2 gap-2">
                  <ChipButton active={!style.accGoggles} onClick={() => update({ accGoggles: false })}>
                    Sin gafas
                  </ChipButton>
                  <ChipButton active={style.accGoggles} onClick={() => update({ accGoggles: true })}>
                    Con gafas
                  </ChipButton>
                </div>
              </Section>
            </>
          )}
        </motion.div>
      </AnimatePresence>

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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold mb-2">{title}</p>
    {children}
  </div>
);

const SwatchButton = ({
  color,
  active,
  onClick,
  label,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`aspect-square rounded-full border-2 transition-transform ${
      active ? "border-primary scale-110 shadow-summit" : "border-border"
    }`}
    style={{ backgroundColor: color }}
  />
);

const ChipButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`rounded-2xl border py-2 text-xs font-bold transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card text-foreground border-border"
    }`}
  >
    {children}
  </button>
);

export default CustomizePage;