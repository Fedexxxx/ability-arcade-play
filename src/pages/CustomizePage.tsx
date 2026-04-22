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

  const update = (patch: Parameters<typeof saveExplorerStyle>[0]) => {
    saveExplorerStyle(patch);
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
        <div className="w-44 h-72 my-2">
          <ExplorerSvg style={style} gear={wallet.equipped} variant="full" className="w-full h-full" />
        </div>
        <SherpaSpeech mood="encouraging" size="sm" message="Hazlo tuyo. Cada cambio se guarda al instante." />
      </motion.section>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["piel", "pelo", "ropa"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2 text-xs font-bold capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {t}
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
