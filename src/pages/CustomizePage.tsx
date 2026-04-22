import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Minus, Plus, RotateCcw, Sparkles, Store } from "lucide-react";
import SherpaSpeech from "@/components/SherpaSpeech";
import { toast } from "@/hooks/use-toast";
import { useAiAvatarVariant } from "@/hooks/useAiAvatarVariant";
import { useWallet } from "@/hooks/useWallet";
import { equip } from "@/lib/wallet";
import { SHOP_ITEMS, SLOT_META } from "@/lib/shopCatalog";
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

const CustomizePage = () => {
  const navigate = useNavigate();
  const v = useAiAvatarVariant();
  const initialVariant = useRef<AiAvatarVariant>(v);

  const handleReset = () => {
    saveAiVariant(initialVariant.current ?? DEFAULT_AI_VARIANT);
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
        <div className="w-full flex items-center justify-between mb-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
            Personaliza tu explorador
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold">
            <Sparkles size={11} /> En vivo
          </span>
        </div>
        <div className="w-56 h-72 my-2 flex items-center justify-center">
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
        </div>
        <SherpaSpeech
          mood="encouraging"
          size="sm"
          message="Versión beta — sin accesorios todavía."
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

const AiCustomizePanel = () => {
  const v = useAiAvatarVariant();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="bg-secondary/10 border border-secondary/30 text-foreground rounded-2xl p-3 mb-5 text-xs">
        <strong className="font-bold">Modo beta IA.</strong> Set acotado de 48 variantes pre-renderizadas.
        Sin accesorios ni equipo de la tienda todavía.
      </div>

      <Section title="Outfit">
        <div className="grid grid-cols-2 gap-2">
          {AI_OUTFITS.map((o) => (
            <button
              key={o.id}
              onClick={() => saveAiVariant({ outfit: o.id as AiOutfit })}
              className={`text-left rounded-2xl border p-3 transition-colors ${
                v.outfit === o.id
                  ? "bg-primary/10 border-primary text-foreground"
                  : "bg-card border-border text-foreground"
              }`}
            >
              <p className="text-sm font-bold">{o.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{o.desc}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Tono de piel">
        <div className="grid grid-cols-4 gap-2">
          {AI_SKINS.map((s) => (
            <button
              key={s.id}
              onClick={() => saveAiVariant({ skin: s.id as AiSkin })}
              aria-label={s.label}
              title={s.label}
              className={`aspect-square rounded-full border-2 transition-transform ${
                v.skin === s.id ? "border-primary scale-110 shadow-summit" : "border-border"
              }`}
              style={{ backgroundColor: s.swatch }}
            />
          ))}
        </div>
      </Section>

      <Section title="Pelo">
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
            Los accesorios aún no se muestran sobre el avatar IA — beta.
          </p>
        </>
      )}
    </Section>
  );
};
