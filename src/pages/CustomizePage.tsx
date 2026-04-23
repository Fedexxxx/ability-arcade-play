import { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Minus, Plus, RotateCcw, Sparkles, Store } from "lucide-react";
import SherpaSpeech from "@/components/SherpaSpeech";
import ExplorerSvg from "@/components/ExplorerSvg";
import { toast } from "@/hooks/use-toast";
import { useExplorerStyle } from "@/hooks/useExplorerStyle";
import { useWallet } from "@/hooks/useWallet";
import { equip } from "@/lib/wallet";
import { SHOP_ITEMS, SLOT_META } from "@/lib/shopCatalog";
import {
  DEFAULT_STYLE,
  HAIR_COLORS,
  SKIN_PALETTE,
  saveExplorerStyle,
  type ExplorerStyle,
  type HairStyle,
  type SkinTone,
} from "@/lib/explorerStyle";

// User-facing hair types: lacio, ondulado, corto, rizado, calvo.
// Mapped to the existing renderable hair styles.
const HAIR_TYPES: { id: HairStyle; label: string }[] = [
  { id: "medium", label: "Lacio" },
  { id: "wavy",   label: "Ondulado" },
  { id: "short",  label: "Corto" },
  { id: "curly",  label: "Rizado" },
  { id: "buzz",   label: "Calvo" },
];

const SKIN_TONES: SkinTone[] = ["porcelain", "honey", "tan", "cocoa", "espresso"];

const CustomizePage = () => {
  const navigate = useNavigate();
  const style = useExplorerStyle();
  const wallet = useWallet();
  const initialStyle = useRef<ExplorerStyle>(style);

  const handleReset = () => {
    saveExplorerStyle(initialStyle.current ?? DEFAULT_STYLE);
    toast({ title: "Restablecido", description: "Volviste al estilo inicial." });
  };

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
        <div className="w-64 h-80 my-2 flex items-center justify-center">
          <ExplorerSvg
            style={style}
            gear={wallet.equipped}
            variant="full"
            className="w-full h-full"
            ariaLabel="Vista previa de tu explorador"
          />
        </div>
        <SherpaSpeech
          mood="encouraging"
          size="sm"
          message="Cambios en vivo — los accesorios comprados también se ven."
        />
      </motion.section>

      <CustomizePanel style={style} />

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

const CustomizePanel = ({ style }: { style: ExplorerStyle }) => {
  const currentHairType = useMemo(
    () => HAIR_TYPES.find((h) => h.id === style.hair)?.id ?? "short",
    [style.hair],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Section title="Tono de piel">
        <div className="flex gap-2 flex-wrap">
          {SKIN_TONES.map((s) => {
            const palette = SKIN_PALETTE[s];
            const active = style.skin === s;
            return (
              <button
                key={s}
                onClick={() => saveExplorerStyle({ skin: s })}
                aria-label={palette.label}
                title={palette.label}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  active ? "border-primary scale-110 shadow-summit" : "border-border"
                }`}
                style={{ backgroundColor: palette.base }}
              />
            );
          })}
        </div>
      </Section>

      <Section title="Color de pelo">
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map((c) => {
            const active = style.hairColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => saveExplorerStyle({ hairColor: c.hex })}
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
              active={currentHairType === h.id}
              onClick={() => saveExplorerStyle({ hair: h.id })}
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
                    isEquipped
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    {item.glyph}
                  </span>
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
                    {isEquipped ? (
                      <>
                        <Minus size={9} /> Quitar
                      </>
                    ) : (
                      <>
                        <Plus size={9} /> Equipar
                      </>
                    )}
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
            Equipados sobre el explorador en vivo arriba.
          </p>
        </>
      )}
    </Section>
  );
};
