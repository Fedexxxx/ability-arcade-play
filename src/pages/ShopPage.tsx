import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AvatarWithGear from "@/components/AvatarWithGear";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";
import { useWallet } from "@/hooks/useWallet";
import { useCharacter } from "@/hooks/useCharacter";
import { spend } from "@/lib/wallet";
import { CHARACTERS, type CharacterDef } from "@/lib/characters";
import { setCharacterId, unlockCharacter } from "@/lib/character/state";

type StatusFilter = "all" | "available" | "owned" | "locked";

const STATUS_META: Record<StatusFilter, { label: string; emoji: string }> = {
  all:       { label: "Todos",       emoji: "🗂️" },
  available: { label: "Disponible",  emoji: "🪙" },
  owned:     { label: "Tuyo",        emoji: "✅" },
  locked:    { label: "Por subir",   emoji: "🔒" },
};

const ShopPage = () => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { characterId, ownedCharacterIds } = useCharacter();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sherpaMsg, setSherpaMsg] = useState<string | null>(null);

  const gear = useMemo(() => CHARACTERS.filter((c) => c.tier === "gear"), []);

  const visible = useMemo<CharacterDef[]>(() => {
    return gear.filter((c) => {
      const owned = ownedCharacterIds.includes(c.id);
      const affordable = wallet.balance >= (c.price ?? 0);
      switch (status) {
        case "available":
          return !owned && affordable;
        case "owned":
          return owned;
        case "locked":
          return !owned && !affordable;
        default:
          return true;
      }
    });
  }, [gear, ownedCharacterIds, wallet.balance, status]);

  const cheapestUnaffordable = useMemo(() => {
    return [...gear]
      .filter((c) => !ownedCharacterIds.includes(c.id) && (c.price ?? 0) > wallet.balance)
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
  }, [gear, ownedCharacterIds, wallet.balance]);

  const contextualMsg = useMemo(() => {
    if (ownedCharacterIds.length === 0 && wallet.balance === 0) {
      return "Conquista cumbres para ganar Alticoins. Vuelve cuando tengas algunas.";
    }
    if (ownedCharacterIds.length === 0) {
      return "Tu primer compañero te espera. Elige con cariño.";
    }
    if (wallet.balance === 0) {
      return "Sin monedas, pero con estilo. Equipa lo que ya es tuyo.";
    }
    return "Cada moneda cuenta. Elige al explorador que quieras llevar.";
  }, [ownedCharacterIds.length, wallet.balance]);

  const displayMsg = sherpaMsg ?? contextualMsg;

  const handleBuy = (c: CharacterDef) => {
    const result = spend({ id: c.id, price: c.price ?? 0, label: c.name });
    if (!result.ok) {
      if (result.reason === "insufficient_funds") {
        const missing = (c.price ?? 0) - wallet.balance;
        setSherpaMsg("Aún no alcanzan las monedas. Sigue subiendo y vuelve.");
        toast({
          title: "Faltan Alticoins",
          description: `Te faltan ${missing} para ${c.name}.`,
        });
      }
      return;
    }
    unlockCharacter(c.id); // also auto-equips
    setSherpaMsg(`¡${c.name}! Te queda increíble.`);
    celebrate();
    toast({ title: "¡Equipado!", description: `${c.name} ya es parte de tu equipo.` });
  };

  const handleEquip = (c: CharacterDef) => {
    setCharacterId(c.id);
    setSherpaMsg(`${c.name} listo para la próxima cumbre.`);
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-3 text-sm font-bold"
        aria-label="Volver"
      >
        <ArrowLeft size={18} /> Ir atrás
      </button>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-5 shadow-terrain mb-5"
      >
        <div className="flex items-center gap-4">
          <AvatarWithGear className="w-20 h-20" variant="bust" />
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

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-4">
        {(Object.keys(STATUS_META) as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              status === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border"
            }`}
          >
            <span aria-hidden>{STATUS_META[s].emoji}</span>
            {STATUS_META[s].label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-6 text-center shadow-terrain">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-display text-base">Nada por aquí todavía</p>
          <p className="text-xs text-muted-foreground mt-1">
            Prueba con otro filtro o sigue conquistando cumbres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {visible.map((c, i) => {
            const owned = ownedCharacterIds.includes(c.id);
            const equipped = c.id === characterId;
            const affordable = wallet.balance >= (c.price ?? 0);
            const isCheapestUnaffordable =
              !owned && !affordable && cheapestUnaffordable?.id === c.id;
            const missing = Math.max(0, (c.price ?? 0) - wallet.balance);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`relative bg-card border border-border rounded-3xl p-3 shadow-terrain flex flex-col ${
                  owned ? "border-primary/40" : ""
                }`}
              >
                {owned && (
                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-terrain">
                    <Check size={10} /> Tuyo
                  </div>
                )}

                <div className="aspect-square w-full rounded-2xl bg-gradient-to-b from-muted/40 to-card overflow-hidden flex items-center justify-center mb-2">
                  <img
                    src={c.image}
                    alt={c.name}
                    className={`w-full h-full object-contain ${!owned && !affordable ? "grayscale opacity-80" : ""}`}
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                <p className="font-display text-sm leading-tight">{c.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {c.blurb}
                </p>

                <div className="mt-3">
                  {owned ? (
                    <button
                      onClick={() => handleEquip(c)}
                      disabled={equipped}
                      className={`w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                        equipped
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground border border-primary/40"
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
                    <>
                      <button
                        onClick={() => handleBuy(c)}
                        disabled={!affordable}
                        className={`w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                          affordable
                            ? "gradient-sunrise text-secondary-foreground shadow-summit"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {affordable ? <Sparkles size={14} /> : <Lock size={12} />}
                        {c.price}
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
      )}
    </div>
  );
};

export default ShopPage;
