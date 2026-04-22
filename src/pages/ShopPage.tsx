import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Minus, Plus, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { useExplorer } from "@/hooks/useExplorer";
import { buy, equip, type CosmeticSlot } from "@/lib/wallet";
import {
  RARITY_META,
  SHOP_ITEMS,
  SLOT_META,
  type ShopItem,
} from "@/lib/shopCatalog";
import AvatarWithGear from "@/components/AvatarWithGear";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";

const SLOT_ORDER: CosmeticSlot[] = ["hat", "scarf", "backpack", "boots", "badge"];

const ShopPage = () => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const explorer = useExplorer();
  const [filter, setFilter] = useState<CosmeticSlot | "all">("all");
  const [sherpaMsg, setSherpaMsg] = useState<string | null>(null);

  // Contextual default Sherpa message — based on wallet state.
  const ownedCount = wallet.owned.length;
  const contextualMsg = useMemo(() => {
    if (ownedCount === 0 && wallet.balance === 0) {
      return "Conquista cumbres para ganar Alticoins. Vuelve cuando tengas algunas.";
    }
    if (ownedCount === 0) {
      return "Tu primera pieza te espera. Elige con cariño.";
    }
    if (wallet.balance === 0) {
      return "Sin monedas, pero con estilo. Equipa lo que ya es tuyo.";
    }
    return "Cada moneda cuenta. Elige algo que te haga sentir explorador.";
  }, [ownedCount, wallet.balance]);
  const displayMsg = sherpaMsg ?? contextualMsg;

  const visible = useMemo<ShopItem[]>(() => {
    if (filter === "all") return SHOP_ITEMS;
    return SHOP_ITEMS.filter((i) => i.slot === filter);
  }, [filter]);

  // Cheapest unaffordable item among visible — used for the "Te faltan N" nudge.
  const cheapestUnaffordableId = useMemo(() => {
    const candidates = visible
      .filter((i) => !wallet.owned.includes(i.id) && i.price > wallet.balance)
      .sort((a, b) => a.price - b.price);
    return candidates[0]?.id ?? null;
  }, [visible, wallet.owned, wallet.balance]);

  const handleBuy = (item: ShopItem) => {
    const result = buy({
      itemId: item.id,
      price: item.price,
      slot: item.slot,
      label: item.name,
    });
    if (!result.ok) {
      if (result.reason === "insufficient_funds") {
        setSherpaMsg("Aún no alcanzan las monedas. Sigue subiendo y vuelve.");
        toast({
          title: "Faltan Alticoins",
          description: `Necesitas ${item.price - wallet.balance} más para ${item.name}.`,
        });
      }
      return;
    }
    setSherpaMsg(`¡${item.name}! Te queda increíble.`);
    celebrate();
    toast({
      title: "¡Equipado!",
      description: `${item.name} ya está en tu equipo.`,
    });
  };

  const handleEquipToggle = (item: ShopItem) => {
    const isEquipped = wallet.equipped[item.slot] === item.id;
    equip(item.slot, isEquipped ? null : item.id);
    setSherpaMsg(
      isEquipped
        ? `Quitaste ${item.name}. Está guardado en tu mochila.`
        : `${item.name} listo para la próxima cumbre.`,
    );
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-muted-foreground mb-3"
        aria-label="Volver"
      >
        <ArrowLeft size={22} />
      </button>

      {/* Header — preview + balance */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-5 shadow-terrain mb-5"
      >
        <div className="flex items-center gap-4">
          <AvatarWithGear
            avatar={explorer?.avatar ?? "🧗"}
            className="w-20 h-20"
            emojiClassName="text-4xl"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
              Tienda del Campamento
            </p>
            <h1 className="font-display text-2xl leading-tight">Tu equipo</h1>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-secondary-soft text-secondary rounded-full px-3 py-1">
              <Sparkles size={14} />
              <span className="text-sm font-bold">{wallet.balance} Alticoins</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <SherpaSpeech mood="encouraging" size="sm" message={displayMsg} />
        </div>
      </motion.section>

      {/* Slot filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-4">
        <FilterChip
          label="Todo"
          emoji="✨"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {SLOT_ORDER.map((slot) => (
          <FilterChip
            key={slot}
            label={SLOT_META[slot].label}
            emoji={SLOT_META[slot].emoji}
            active={filter === slot}
            onClick={() => setFilter(slot)}
          />
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3">
        {visible.map((item, i) => {
          const owned = wallet.owned.includes(item.id);
          const equipped = wallet.equipped[item.slot] === item.id;
          const affordable = wallet.balance >= item.price;
          const meta = RARITY_META[item.rarity];
          const showAffordRing = !owned && affordable;
          const isCheapestUnaffordable = !owned && !affordable && item.id === cheapestUnaffordableId;
          const missing = Math.max(0, item.price - wallet.balance);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`relative bg-card border border-border rounded-3xl p-4 shadow-terrain flex flex-col ${meta.ring} ${
                showAffordRing ? "ring-offset-2 ring-offset-background" : ""
              }`}
              style={
                showAffordRing
                  ? { boxShadow: "0 0 0 2px hsl(var(--secondary) / 0.5), 0 8px 18px -10px hsl(var(--secondary) / 0.5)" }
                  : undefined
              }
            >
              {owned && (
                <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-terrain">
                  <Check size={10} /> Tuyo
                </div>
              )}
              <div
                className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.chip}`}
              >
                {meta.label}
              </div>

              <div className="h-16 flex items-center justify-center text-5xl mb-2 mt-2">
                {item.glyph}
              </div>
              <p className="font-display text-sm leading-tight">{item.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-3">
                {owned ? (
                  <button
                    onClick={() => handleEquipToggle(item)}
                    className={`w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                      equipped
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground border border-primary/40"
                    }`}
                  >
                    {equipped ? <Minus size={14} /> : <Plus size={14} />}
                    {equipped ? "Quitar" : "Equipar"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!affordable}
                      className={`w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                        affordable
                          ? "gradient-sunrise text-secondary-foreground shadow-summit"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {affordable ? (
                        <>
                          <Sparkles size={14} />
                          {item.price}
                        </>
                      ) : (
                        <>
                          <Lock size={12} />
                          {item.price}
                        </>
                      )}
                    </button>
                    {isCheapestUnaffordable && (
                      <p className="mt-1.5 text-center text-[10px] font-semibold text-secondary">
                        Te faltan {missing} 🌟
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const FilterChip = ({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card text-muted-foreground border-border"
    }`}
  >
    <span aria-hidden>{emoji}</span>
    {label}
  </button>
);

export default ShopPage;
