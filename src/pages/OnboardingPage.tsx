import { forwardRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Mountain, Check } from "lucide-react";
import SherpaSpeech from "@/components/SherpaSpeech";
import Sherpa, { type SherpaMood } from "@/components/Sherpa";
import { AGE_BANDS, AVATAR_CHOICES, saveExplorer, type AgeBand } from "@/lib/explorer";
import mountainBg from "@/assets/mountain-bg.jpg";

/** Optional state passed via navigate("/onboarding", { state: { editMode, prefill } }). */
interface OnboardingNavState {
  editMode?: boolean;
  prefill?: { name?: string; avatar?: string; ageBand?: AgeBand };
}

type Step = 0 | 1 | 2 | 3 | 4;

const stepMoods: Record<Step, SherpaMood> = {
  0: "encouraging",
  1: "pointing",
  2: "thinking",
  3: "pointing",
  4: "celebrating",
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as OnboardingNavState | null) ?? null;
  const editMode = !!navState?.editMode;
  const prefill = navState?.prefill;

  // In edit mode we skip the welcome step and seed the form with current values.
  const [step, setStep] = useState<Step>(editMode ? 1 : 0);
  const [name, setName] = useState(prefill?.name ?? "");
  const [avatar, setAvatar] = useState<string>(prefill?.avatar ?? "");
  const [ageBand, setAgeBand] = useState<AgeBand | "">(prefill?.ageBand ?? "");

  const canContinue =
    (step === 0) ||
    (step === 1 && name.trim().length >= 2 && name.trim().length <= 20) ||
    (step === 2 && !!avatar) ||
    (step === 3 && !!ageBand) ||
    step === 4;

  const next = () => {
    if (step === 4) {
      if (!ageBand || !avatar || !name.trim()) return;
      saveExplorer({ name: name.trim(), avatar, ageBand });
      // Edit mode returns to the profile so the user sees the updated card.
      navigate(editMode ? "/profile" : "/", { replace: true });
      return;
    }
    setStep((s) => Math.min(4, (s + 1)) as Step);
  };

  // In edit mode, never let the back button drop us back to the welcome step.
  const back = () => setStep((s) => Math.max(editMode ? 1 : 0, (s - 1)) as Step);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 -z-10">
        <img
          src={mountainBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom opacity-90"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
      </div>

      {/* Top bar with progress dots */}
      <header className="px-5 pt-6 pb-2 max-w-lg w-full mx-auto flex items-center gap-3">
        <button
          onClick={editMode && step === 1 ? () => navigate("/profile") : back}
          disabled={!editMode && step === 0}
          className="w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center disabled:opacity-30"
          aria-label={editMode && step === 1 ? "Cancelar edición" : "Volver"}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 flex items-center gap-1.5 justify-center">
          {(editMode ? [1, 2, 3, 4] : [0, 1, 2, 3, 4]).map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/60" : "w-3 bg-border"
              }`}
            />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-5 pt-2 pb-32 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {step === 0 && (
              <Welcome />
            )}
            {step === 1 && (
              <NameStep name={name} setName={setName} />
            )}
            {step === 2 && (
              <AvatarStep avatar={avatar} setAvatar={setAvatar} />
            )}
            {step === 3 && (
              <AgeStep ageBand={ageBand} setAgeBand={setAgeBand} />
            )}
            {step === 4 && (
              <Ready name={name} avatar={avatar} ageBand={ageBand as AgeBand} />
            )}

            {/* Sherpa moves with each step */}
            <div className="mt-auto pt-6">
              <SherpaSpeech
                mood={stepMoods[step]}
                size="lg"
                message={messageFor(step, name)}
              />
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={next}
            disabled={!canContinue}
            className="w-full gradient-sunrise text-secondary-foreground rounded-2xl py-4 px-5 font-display text-lg shadow-summit flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none active:scale-[0.99] transition-transform"
          >
            {ctaLabel(step, editMode)}
            {step === 4 ? <Mountain size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── Steps ─────────────────────────

const Welcome = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="text-center pt-8">
    <div className="flex justify-center mb-6">
      <Sherpa mood="encouraging" size="xl" halo priority />
    </div>
    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
      Bienvenido a
    </p>
    <h1 className="font-display text-5xl mt-2 text-gradient-summit">Sherpa Go</h1>
    <p className="text-muted-foreground mt-4 max-w-sm mx-auto text-lg leading-relaxed">
      Soy Sherpa. Voy a guiarte mientras escalas tu propia montaña de conocimiento.
    </p>
  </div>
));
Welcome.displayName = "Welcome";

const NameStep = forwardRef<HTMLDivElement, { name: string; setName: (v: string) => void }>(
  ({ name, setName }, ref) => (
    <div ref={ref} className="pt-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
        Paso 1 · Tu nombre
      </p>
      <h2 className="font-display text-4xl mt-2">¿Cómo te llamo?</h2>
      <p className="text-base text-muted-foreground mt-2">Así te saludaré en cada Campamento.</p>

      <div className="mt-8">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          placeholder="Tu nombre de explorador"
          maxLength={20}
          className="w-full bg-card border border-border rounded-2xl px-6 py-5 font-display text-2xl shadow-terrain focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <p className="text-sm text-muted-foreground mt-3 text-right">{name.trim().length}/20</p>
      </div>
    </div>
  )
);
NameStep.displayName = "NameStep";

const AvatarStep = forwardRef<HTMLDivElement, { avatar: string; setAvatar: (v: string) => void }>(
  ({ avatar, setAvatar }, ref) => (
    <div ref={ref} className="pt-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
        Paso 2 · Tu insignia
      </p>
      <h2 className="font-display text-3xl mt-1">Elige tu compañero</h2>
      <p className="text-sm text-muted-foreground mt-1">Te acompañará en la mochila.</p>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {AVATAR_CHOICES.map((emoji) => {
          const selected = avatar === emoji;
          return (
            <button
              key={emoji}
              onClick={() => setAvatar(emoji)}
              className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-4xl transition-all active:scale-95 ${
                selected
                  ? "border-primary bg-primary/10 shadow-summit scale-105"
                  : "border-border bg-card shadow-terrain"
              }`}
              aria-pressed={selected}
              aria-label={`Avatar ${emoji}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  )
);
AvatarStep.displayName = "AvatarStep";

const AgeStep = forwardRef<
  HTMLDivElement,
  { ageBand: AgeBand | ""; setAgeBand: (v: AgeBand) => void }
>(({ ageBand, setAgeBand }, ref) => (
  <div ref={ref} className="pt-4">
    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
      Paso 3 · Tu altitud
    </p>
    <h2 className="font-display text-4xl mt-2">¿Cuántos años tienes?</h2>
    <p className="text-base text-muted-foreground mt-2">Ajusto el ritmo para ti.</p>

    <div className="space-y-4 mt-8">
      {AGE_BANDS.map((band) => {
        const selected = ageBand === band.id;
        return (
          <button
            key={band.id}
            onClick={() => setAgeBand(band.id)}
            className={`w-full text-left rounded-2xl border-2 p-5 flex items-center gap-4 transition-all active:scale-[0.99] ${
              selected
                ? "border-primary bg-primary/10 shadow-summit"
                : "border-border bg-card shadow-terrain"
            }`}
            aria-pressed={selected}
          >
            <div className="flex-1">
              <p className="font-display text-xl">{band.label}</p>
              <p className="text-sm text-muted-foreground">{band.hint}</p>
            </div>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                selected ? "border-primary bg-primary text-primary-foreground" : "border-border"
              }`}
            >
              {selected && <Check size={16} strokeWidth={3} />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
));
AgeStep.displayName = "AgeStep";

const Ready = forwardRef<
  HTMLDivElement,
  { name: string; avatar: string; ageBand: AgeBand }
>(({ name, avatar, ageBand }, ref) => (
  <div ref={ref} className="text-center pt-4">
    <div className="flex justify-center mb-4">
      <Sherpa mood="celebrating" size="xl" halo priority />
    </div>
    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
      Todo listo
    </p>
    <h2 className="font-display text-3xl mt-1">
      Vamos, <span className="text-gradient-summit">{name || "explorador"}</span>
    </h2>
    <div className="mx-auto mt-5 inline-flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-terrain">
      <span className="text-3xl">{avatar}</span>
      <div className="text-left">
        <p className="font-display text-base leading-tight">{name}</p>
        <p className="text-xs text-muted-foreground">{ageBand} años</p>
      </div>
    </div>
  </div>
));
Ready.displayName = "Ready";

// ───────────────────────── Helpers ─────────────────────────

const messageFor = (step: Step, name: string) => {
  switch (step) {
    case 0: return "Bienvenido. Soy Sherpa, tu guía.";
    case 1: return "Cuéntame, ¿cómo te llamas?";
    case 2: return "Elige al que te acompañará.";
    case 3: return "Así sabré a qué ritmo subir.";
    case 4: return name ? `¡Vamos, ${name}! El Campamento te espera.` : "El Campamento te espera.";
  }
};

const ctaLabel = (step: Step, editMode = false) => {
  switch (step) {
    case 0: return "Empezar el ascenso";
    case 1: return "Continuar";
    case 2: return "Continuar";
    case 3: return "Continuar";
    case 4: return editMode ? "Guardar cambios" : "Ir al Campamento";
  }
};

export default OnboardingPage;
