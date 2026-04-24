import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Sparkles, Store } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MountainAvatar from "@/components/avatar/MountainAvatar";
import SherpaSpeech from "@/components/SherpaSpeech";
import { celebrate } from "@/lib/celebrate";
import { useCharacter } from "@/hooks/useCharacter";
import {
  CHARACTERS,
  getCharacter,
  isCharacterUnlocked,
  type CharacterDef,
} from "@/lib/characters";
import { setCharacterId } from "@/lib/character/state";

const CustomizePage = () => {
  const navigate = useNavigate();
  const { characterId, ownedCharacterIds } = useCharacter();
  const active = getCharacter(characterId) ?? CHARACTERS[0];

  const free = useMemo(() => CHARACTERS.filter((c) => c.tier === "free"), []);
  const gear = useMemo(() => CHARACTERS.filter((c) => c.tier === "gear"), []);
  const ownedGear = useMemo(
    () => gear.filter((c) => isCharacterUnlocked(c.id, ownedCharacterIds)),
    [gear, ownedCharacterIds],
  );
  const lockedGear = useMemo(
    () => gear.filter((c) => !isCharacterUnlocked(c.id, ownedCharacterIds)),
    [gear, ownedCharacterIds],
  );

  const onSelect = (c: CharacterDef) => {
    if (!isCharacterUnlocked(c.id, ownedCharacterIds)) {
      toast({
        title: "Equipo bloqueado",
        description: `Desbloquéalo en la tienda con ${c.price} Alticoins.`,
      });
      navigate("/tienda");
      return;
    }
    setCharacterId(c.id);
    celebrate();
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

      {/* Live preview */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-1 px-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
            Tu explorador
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold">
            <Sparkles size={11} /> En vivo
          </span>
        </div>
        <div className="relative w-64 h-72 my-2">
          <MountainAvatar characterId={active.id} variant="full" />
        </div>
        <p className="font-display text-xl leading-tight text-center">{active.name}</p>
        <p className="text-xs text-muted-foreground text-center mt-1 px-4">{active.blurb}</p>
        <div className="mt-3">
          <SherpaSpeech
            mood="encouraging"
            size="sm"
            message="Elige tu compañero de aventura. Desbloquea más con Alticoins."
          />
        </div>
      </motion.section>

      {/* Free explorers */}
      <Section
        title="Exploradores gratis"
        subtitle="Disponibles desde el primer paso"
      >
        <Grid>
          {free.map((c) => (
            <CharacterCard
              key={c.id}
              character={c}
              active={c.id === active.id}
              locked={false}
              onClick={() => onSelect(c)}
            />
          ))}
        </Grid>
      </Section>

      {/* Owned gear */}
      {ownedGear.length > 0 && (
        <Section title="Tu equipo desbloqueado" subtitle="Conseguido con Alticoins">
          <Grid>
            {ownedGear.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                active={c.id === active.id}
                locked={false}
                onClick={() => onSelect(c)}
              />
            ))}
          </Grid>
        </Section>
      )}

      {/* Locked gear */}
      {lockedGear.length > 0 && (
        <Section title="Equipos por desbloquear" subtitle="Consíguelos en la tienda">
          <Grid>
            {lockedGear.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                active={false}
                locked
                onClick={() => onSelect(c)}
              />
            ))}
          </Grid>
          <button
            onClick={() => navigate("/tienda")}
            className="w-full mt-3 inline-flex items-center justify-center gap-1.5 bg-card border border-dashed border-border text-muted-foreground hover:text-foreground rounded-2xl py-2.5 text-xs font-bold"
          >
            <Store size={12} /> Visitar la tienda
          </button>
        </Section>
      )}

      <div className="mt-6">
        <button
          onClick={() => {
            toast({ title: "¡Listo!", description: "Tu explorador está al día." });
            navigate(-1);
          }}
          className="w-full gradient-sunrise text-secondary-foreground rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 shadow-summit"
        >
          <Check size={16} /> Guardar explorador
        </button>
      </div>
    </div>
  );
};

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="mb-6">
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-bold">
      {title}
    </p>
    {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
    <div className="mt-2.5">{children}</div>
  </section>
);

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

const CharacterCard = ({
  character,
  active,
  locked,
  onClick,
}: {
  character: CharacterDef;
  active: boolean;
  locked: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative text-left rounded-2xl border p-2.5 transition-colors overflow-hidden ${
      locked
        ? "bg-card/60 border-dashed border-border opacity-80"
        : active
        ? "bg-primary/10 border-primary"
        : "bg-card border-border hover:border-primary/40"
    }`}
  >
    <div className="aspect-square w-full rounded-xl bg-gradient-to-b from-muted/40 to-card overflow-hidden flex items-center justify-center mb-2">
      <img
        src={character.image}
        alt={character.name}
        className={`w-full h-full object-contain ${locked ? "grayscale opacity-70" : ""}`}
        draggable={false}
        loading="lazy"
      />
    </div>
    <p className="font-display text-sm leading-tight">{character.name}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{character.vibe}</p>

    {locked && (
      <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
        <Lock size={10} /> {character.price}
      </span>
    )}
    {active && !locked && (
      <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
        <Check size={11} />
      </span>
    )}
    {!active && !locked && character.tier === "free" && (
      <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary-soft px-1.5 py-0.5 rounded-full">
        Free
      </span>
    )}
  </button>
);

export default CustomizePage;
