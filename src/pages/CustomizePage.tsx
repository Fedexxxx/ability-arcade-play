import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Sparkles } from "lucide-react";
import ExplorerSvg from "@/components/ExplorerSvg";
import SherpaSpeech from "@/components/SherpaSpeech";
import { useExplorerStyle } from "@/hooks/useExplorerStyle";
import { useWallet } from "@/hooks/useWallet";
import { getItem, SLOT_META } from "@/lib/shopCatalog";
import type { CosmeticSlot } from "@/lib/wallet";
import {
  BOOTS_COLORS,
  HAIR_COLORS,
  HAIR_STYLES,
  JACKET_COLORS,
  PANTS_COLORS,
  SKIN_PALETTE,
  saveExplorerStyle,
  type HairStyle,
  type SkinTone,
} from "@/lib/explorerStyle";
import { toast } from "@/hooks/use-toast";

const SHERPA_BY_TAB: Record<"piel" | "pelo" | "ropa", string> = {
  piel: "Elige el tono que más te recuerde a ti.",
  pelo: "Tu pelo, tu estilo. Cambia las veces que quieras.",
  ropa: "Ropa para escalar — los colores son tuyos.",
};

const CustomizePage = () => {
  const navigate = useNavigate();
  const style = useExplorerStyle();
  const wallet = useWallet();
  const [tab, setTab] = useState<"piel" | "pelo" | "ropa">("piel");
  // Snapshot the style on first mount so "Restablecer" reverts session edits.
  const initialStyle = useRef(style);
  // Track which tabs have changes this session (for the active dot).
  const [touched, setTouched] = useState<Record<"piel" | "pelo" | "ropa", boolean>>({
    piel: false,
    pelo: false,
    ropa: false,
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
    setTouched({ piel: false, pelo: false, ropa: false });
    toast({ title: "Restablecido", description: "Volviste al estilo inicial." });
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="text-muted-foreground mb-3" aria-label="Volver">
        <ArrowLeft size={22} />
      </button>

      {/* Live preview */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-5 shadow-terrain mb-5 flex flex-col items-center"
      >
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold self-start">
          Personaliza tu explorador
        </p>
        <motion.div
          className="w-44 h-72 my-2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ExplorerSvg style={style} gear={wallet.equipped} variant="full" className="w-full h-full" />
        </motion.div>
        <SherpaSpeech mood="encouraging" size="sm" message={SHERPA_BY_TAB[tab]} />

        {/* Mi equipo — chips of equipped Shop gear */}
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
      </motion.section>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["piel", "pelo", "ropa"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex-1 rounded-full py-2 text-xs font-bold capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {t}
            {touched[t] && (
              <span
                className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-secondary"
                aria-label="Cambios sin restablecer"
              />
            )}
          </button>
        ))}
      </div>

      {tab === "piel" && (
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
      )}

      {tab === "pelo" && (
        <>
          <Section title="Estilo">
            <div className="grid grid-cols-3 gap-2">
              {HAIR_STYLES.map((h) => (
                <button
                  key={h.id}
                  onClick={() => update({ hair: h.id as HairStyle })}
                  className={`rounded-2xl border py-2 text-xs font-bold ${
                    style.hair === h.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  {h.label}
                </button>
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

      <button
        onClick={() => {
          toast({ title: "¡Listo!", description: "Tu explorador está al día." });
          navigate(-1);
        }}
        className="mt-6 w-full gradient-sunrise text-secondary-foreground rounded-2xl py-3 font-bold flex items-center justify-center gap-2 shadow-summit"
      >
        <Check size={16} /> Guardar y volver
      </button>
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

export default CustomizePage;
