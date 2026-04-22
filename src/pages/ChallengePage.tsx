import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";
import QuizChallenge from "@/components/challenges/QuizChallenge";
import VisualChallenge from "@/components/challenges/VisualChallenge";
import MatchingChallenge from "@/components/challenges/MatchingChallenge";
import DragDropChallenge from "@/components/challenges/DragDropChallenge";
import { superpowers } from "@/data/mockData";
import { celebrate } from "@/lib/celebrate";
import { useDensity } from "@/contexts/AgeDensityContext";
import { earn } from "@/lib/wallet";
import { findTieredModule, getActiveChallenges } from "@/data/mountains";
import { recordChallengeResult } from "@/lib/tiers";
import { useTier } from "@/hooks/useTier";
import { useExplorer } from "@/hooks/useExplorer";

const COIN_PER_CHALLENGE = 10;
const COIN_FAIL_CONSOLATION = 2;

const ChallengePage = () => {
  const { spId, modId, chId } = useParams();
  const navigate = useNavigate();
  const density = useDensity();
  const explorer = useExplorer();
  const { tier } = useTier(spId, modId);

  // Tier-aware lookup: pull challenges for the current tier from the new
  // mountains catalog, with a graceful fallback to the legacy seed array.
  const tiered = findTieredModule(spId, modId);
  const tierChallenges = tiered ? getActiveChallenges(tiered.module, tier) : [];
  const sp = tiered ? tiered.mountain : superpowers.find((s) => s.id === spId);
  const mod = tiered
    ? { ...tiered.module, challenges: tierChallenges }
    : sp?.modules.find((m) => m.id === modId);
  const challenge =
    tierChallenges.find((c) => c.id === chId) ??
    mod?.challenges.find((c) => c.id === chId);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<"learn" | "interact" | "feedback">("learn");
  // For non-quiz interactive challenges (matching, drag-drop) the component
  // itself decides when the user is done and whether the answer is correct.
  const [interactiveCorrect, setInteractiveCorrect] = useState<boolean | null>(null);
  const celebratedRef = useRef(false);

  const isQuizLike =
    challenge?.type === "quiz" || challenge?.type === "visual";
  const isCorrect = isQuizLike
    ? selectedAnswer === challenge?.correctAnswer
    : interactiveCorrect === true;

  // Celebrate on entering feedback with a correct answer (once per challenge attempt).
  useEffect(() => {
    if (phase === "feedback" && isCorrect && !celebratedRef.current) {
      celebratedRef.current = true;
      celebrate();
    }
  }, [phase, isCorrect]);

  // Award Alticoins on first successful completion of this challenge.
  useEffect(() => {
    if (phase !== "feedback" || !challenge || !sp || !mod) return;
    // Feed the adaptive engine — promotes/demotes the module's tier
    // based on rolling per-module accuracy. Idempotent per render via
    // celebratedRef gating already handled by the ledger dedup below
    // (we still want to record retries, so guard with submitted-once).
    if (isCorrect) {
      earn({
        amount: COIN_PER_CHALLENGE,
        reason: "challenge",
        sourceId: `${sp.id}:${mod.id}:${challenge.id}`,
        label: challenge.title,
      });
    } else {
      earn({
        amount: COIN_FAIL_CONSOLATION,
        reason: "challenge",
        sourceId: `${sp.id}:${mod.id}:${challenge.id}:try`,
        label: `Intento: ${challenge.title}`,
      });
    }
  }, [phase, isCorrect, challenge, sp, mod]);

  // Record per-module accuracy for the adaptive tier engine — once per
  // challenge submission. Uses a ref so retries on the same challenge
  // also count (a fresh retry resets `accuracyRecordedRef`).
  const accuracyRecordedRef = useRef(false);
  useEffect(() => {
    if (phase !== "feedback" || !sp || !mod) return;
    if (accuracyRecordedRef.current) return;
    accuracyRecordedRef.current = true;
    recordChallengeResult(sp.id, mod.id, explorer?.ageBand, isCorrect);
  }, [phase, isCorrect, sp, mod, explorer?.ageBand]);

  if (!sp || !mod || !challenge) {
    return <div className="p-4 text-center text-muted-foreground">Desafío no encontrado</div>;
  }

  const handleSubmit = () => {
    if (isQuizLike && selectedAnswer === null) return;
    setSubmitted(true);
    setPhase("feedback");
  };

  const handleInteractiveResolve = (correct: boolean) => {
    setInteractiveCorrect(correct);
    setSubmitted(true);
    // Small delay so the user sees the final state before feedback
    setTimeout(() => setPhase("feedback"), 600);
  };

  const handleNext = () => {
    const list = tierChallenges.length ? tierChallenges : mod.challenges;
    const idx = list.findIndex((c) => c.id === chId);
    const next = list[idx + 1];
    if (next && next.status !== "locked") {
      navigate(`/challenge/${spId}/${modId}/${next.id}`, { replace: true });
      setSelectedAnswer(null);
      setSubmitted(false);
      setInteractiveCorrect(null);
      celebratedRef.current = false;
      accuracyRecordedRef.current = false;
      setPhase("learn");
    } else {
      // Last challenge of the module → victory screen
      navigate(`/module/${spId}/${modId}/victory`, { replace: true });
    }
  };

  const retry = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setInteractiveCorrect(null);
    celebratedRef.current = false;
    accuracyRecordedRef.current = false;
    setPhase("interact");
  };

  const list = tierChallenges.length ? tierChallenges : mod.challenges;
  const chIdx = list.findIndex((c) => c.id === chId);
  const progressPct = ((chIdx + (submitted ? 1 : 0)) / list.length) * 100;

  const correctAnswerLabel = (() => {
    if (challenge.type === "quiz") return challenge.options?.[challenge.correctAnswer!];
    if (challenge.type === "visual") return challenge.visualOptions?.[challenge.correctAnswer!]?.label;
    return null;
  })();

  const renderInteractive = () => {
    switch (challenge.type) {
      case "quiz":
        return (
          <QuizChallenge
            challenge={challenge}
            selected={selectedAnswer}
            submitted={submitted}
            onSelect={setSelectedAnswer}
          />
        );
      case "visual":
        return (
          <VisualChallenge
            challenge={challenge}
            selected={selectedAnswer}
            submitted={submitted}
            onSelect={setSelectedAnswer}
          />
        );
      case "matching":
        return (
          <MatchingChallenge
            challenge={challenge}
            submitted={submitted}
            onResolve={handleInteractiveResolve}
          />
        );
      case "drag-drop":
        return (
          <DragDropChallenge
            challenge={challenge}
            submitted={submitted}
            onResolve={handleInteractiveResolve}
          />
        );
      default:
        return null;
    }
  };

  const ctaLabel =
    challenge.type === "visual" ? "¡Esa es!" : "Confirmar Respuesta";

  // Density-tuned classes
  const ctaPad = density.scale === "lg" ? "py-5 text-xl" : density.scale === "md" ? "py-4 text-lg" : "py-3.5 text-base";
  const conceptPad = density.scale === "lg" ? "p-6" : density.scale === "md" ? "p-5" : "p-4";
  const conceptText = density.scale === "lg" ? "text-base" : density.scale === "md" ? "text-sm" : "text-sm";
  const feedbackIconSize = density.scale === "lg" ? 100 : density.scale === "md" ? 80 : 64;
  const feedbackTitle = density.scale === "lg" ? "text-3xl" : density.scale === "md" ? "text-2xl" : "text-xl";

  return (
    <div className="min-h-screen px-4 pt-4 pb-8 max-w-lg mx-auto flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-muted-foreground" aria-label="Cerrar">
          <X size={22} />
        </button>
        <div className="flex-1">
          <ProgressBar value={progressPct} variant="energy" size="sm" />
        </div>
        <span className="text-xs text-muted-foreground">
          {chIdx + 1}/{list.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* Learn Phase */}
        {phase === "learn" && challenge.concept && (
          <motion.div
            key="learn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className={`gradient-card rounded-2xl ${conceptPad} border border-border mb-6`}>
              <p className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">
                Concepto Clave
              </p>
              <p className={`${conceptText} leading-relaxed`}>{challenge.concept}</p>
              {density.showSubtext && (
                <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tipo de reto:{" "}
                  <span className="text-foreground font-semibold">
                    {challenge.type === "quiz" && "Quiz"}
                    {challenge.type === "visual" && "Visual"}
                    {challenge.type === "matching" && "Asociar parejas"}
                    {challenge.type === "drag-drop" && "Arrastrar y soltar"}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setPhase("interact")}
                className={`w-full gradient-energy text-primary-foreground rounded-2xl ${ctaPad} font-display font-bold glow-primary`}
              >
                ¡A Entrenar!
              </button>
            </div>
          </motion.div>
        )}

        {/* Interact Phase */}
        {(phase === "interact" || (phase === "learn" && !challenge.concept)) && (
          <motion.div
            key="interact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            {renderInteractive()}

            {isQuizLike && (
              <div className="mt-auto">
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className={`w-full rounded-2xl ${ctaPad} font-display font-bold transition-all ${
                    selectedAnswer !== null
                      ? "gradient-energy text-primary-foreground glow-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {ctaLabel}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Feedback Phase */}
        {phase === "feedback" && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 size={feedbackIconSize} className="text-energy mb-4" />
                </motion.div>
                <h2 className={`font-display ${feedbackTitle} font-bold mb-2`}>¡Excelente!</h2>
                {density.showSubtext && (
                  <p className="text-muted-foreground text-sm mb-2">¡Lo clavaste! +25 XP</p>
                )}
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <XCircle size={feedbackIconSize} className="text-streak mb-4" />
                </motion.div>
                <h2 className={`font-display ${feedbackTitle} font-bold mb-2`}>¡Casi!</h2>
                {correctAnswerLabel && (
                  <p className="text-muted-foreground text-sm mb-1">
                    La respuesta correcta era:{" "}
                    <span className="text-foreground font-medium">{correctAnswerLabel}</span>
                  </p>
                )}
                {density.showSubtext && (
                  <p className="text-muted-foreground text-xs mb-2">¡Sigue evolucionando! +5 XP</p>
                )}
              </>
            )}

            <div className="w-full mt-8 space-y-3">
              {isCorrect ? (
                <button
                  onClick={handleNext}
                  className="w-full gradient-energy text-primary-foreground rounded-2xl py-3 font-display font-bold glow-primary"
                >
                  Seguir Evolucionando →
                </button>
              ) : (
                <>
                  <button
                    onClick={retry}
                    className="w-full gradient-energy text-primary-foreground rounded-2xl py-3 font-display font-bold glow-primary"
                  >
                    Intentar de Nuevo
                  </button>
                  <button
                    onClick={() => {
                      toast("Volviendo al Campamento", {
                        description: "Puedes retomar este reto cuando quieras.",
                      });
                      navigate("/");
                    }}
                    className="w-full text-xs text-muted-foreground py-1.5 font-medium hover:text-foreground transition-colors"
                  >
                    Ir atrás
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChallengePage;
