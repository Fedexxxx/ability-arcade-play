// =============================================================
// MOUNTAINS — Slice 3 catalog: 6 ranges × 5 checkpoints, 3 tiers.
//
// Two "deep" mountains (Letras + Números) ship with playable challenges
// across all tiers and modules. The other four mountains (Naturaleza,
// Creativa, Lógica, Social) ship with one fully-tiered playable module
// each — the rest are skeleton stubs ("Próximamente") so the journey
// map already feels complete end-to-end.
//
// Compatible with the legacy Superpower / PowerModule / Challenge shape
// so existing pages (SuperpowerPage / ModulePage / ChallengePage) keep
// working through `getActiveChallenges(mod, tier)`.
// =============================================================

import type {
  Challenge,
  PowerModule,
  Superpower,
  VisualOption,
  MatchingPair,
  DragDropBucket,
  DragDropItem,
} from "@/data/mockData";
import type { Tier } from "@/lib/tiers";

/** Per-tier challenge sets. `null` = skeleton (Próximamente). */
export type TierChallenges = Record<Tier, Challenge[]> | null;

/** A module enriched with adaptive per-tier challenges. */
export interface TieredModule extends Omit<PowerModule, "challenges"> {
  /** Default challenges (= inicial tier) — kept so legacy pages still render. */
  challenges: Challenge[];
  /** Challenges per tier. Null means the module is a skeleton stub. */
  byTier: TierChallenges;
}

/** A mountain = legacy Superpower with tiered modules. */
export interface Mountain extends Omit<Superpower, "modules"> {
  modules: TieredModule[];
}

/** Pick the active challenges for a module given the explorer's current tier. */
export function getActiveChallenges(mod: TieredModule, tier: Tier): Challenge[] {
  if (!mod.byTier) return mod.challenges;
  return mod.byTier[tier] ?? mod.byTier.inicial ?? mod.challenges;
}

/** True if this module has no real content yet (skeleton stub). */
export function isSkeleton(mod: TieredModule): boolean {
  return mod.byTier === null;
}

// ---------- Authoring helpers ----------

let _idSeed = 0;
const uid = (prefix: string) => `${prefix}-${++_idSeed}`;

const q = (
  title: string, concept: string, question: string,
  options: string[], correctAnswer: number,
): Challenge => ({
  id: uid("ch"), title, type: "quiz", duration: "1 min", status: "available",
  concept, question, options, correctAnswer,
});

const v = (
  title: string, concept: string, question: string,
  visualOptions: VisualOption[], correctAnswer: number,
): Challenge => ({
  id: uid("ch"), title, type: "visual", duration: "1 min", status: "available",
  concept, question, visualOptions, correctAnswer,
});

const m = (
  title: string, concept: string, question: string,
  pairs: MatchingPair[],
): Challenge => ({
  id: uid("ch"), title, type: "matching", duration: "2 min", status: "available",
  concept, question, pairs,
});

const d = (
  title: string, concept: string, question: string,
  buckets: DragDropBucket[], dragItems: DragDropItem[],
): Challenge => ({
  id: uid("ch"), title, type: "drag-drop", duration: "2 min", status: "available",
  concept, question, buckets, dragItems,
});

/** Skeleton module factory — appears on the map but is not yet playable. */
const stub = (id: string, title: string, description: string): TieredModule => ({
  id, title, description,
  completion: 0,
  status: "locked",
  challenges: [],
  byTier: null,
});

/** Tiered module factory — three difficulty bands of the same checkpoint. */
const tiered = (
  id: string,
  title: string,
  description: string,
  byTier: Record<Tier, Challenge[]>,
  opts: Partial<Pick<PowerModule, "status" | "completion" | "isBoss">> = {},
): TieredModule => ({
  id, title, description,
  completion: opts.completion ?? 0,
  status: opts.status ?? "available",
  isBoss: opts.isBoss,
  challenges: byTier.inicial,
  byTier,
});

// =============================================================
// MOUNTAIN 1 — PICO DE LAS LETRAS (DEEP)
// =============================================================
const letras: Mountain = {
  id: "letras-peak",
  title: "Pico de las Letras",
  description: "El primer ascenso. Descubre las letras y las palabras que te rodean.",
  category: "Letras",
  icon: "📖",
  color: "primary",
  duration: "20 min",
  difficulty: "beginner",
  rewards: 250,
  progress: 0,
  status: "in-progress",
  modules: [
    tiered("lp-c1", "Las primeras letras", "Reconoce las vocales que abren todo camino.", {
      inicial: [
        v("¿Qué empieza con A?", "La letra A es la primera vocal 🐝", "¿Qué empieza con A?",
          [{ emoji: "🍎", label: "Manzana" }, { emoji: "🐝", label: "Abeja" }, { emoji: "🌳", label: "Árbol" }, { emoji: "🚗", label: "Coche" }], 1),
        q("Vocal escondida", "Las vocales son: A, E, I, O, U.", "¿Cuál NO es una vocal?", ["A", "E", "M", "O"], 2),
        v("Empieza con O", "La O es redonda como el sol 🌞", "¿Qué empieza con la letra O?",
          [{ emoji: "🐻", label: "Oso" }, { emoji: "🌸", label: "Flor" }, { emoji: "🦋", label: "Mariposa" }, { emoji: "🐠", label: "Pez" }], 0),
      ],
      avanzado: [
        q("Cuenta las vocales", "Mira con atención cada palabra.", "¿Cuántas vocales tiene ELEFANTE?", ["2", "3", "4", "5"], 2),
        m("Une vocal con su palabra", "Cada vocal abre una puerta.", "Une cada vocal con una palabra que empieza por ella",
          [{ left: "A", right: "Águila" }, { left: "E", right: "Estrella" }, { left: "I", right: "Iglú" }, { left: "U", right: "Uva" }]),
        q("Vocal repetida", "Algunas vocales aparecen más de una vez.", "¿Qué vocal se repite en BANANA?", ["E", "A", "I", "O"], 1),
      ],
      experto: [
        q("Vocal ausente", "Lee con calma.", "¿Qué vocal NO aparece en ORQUESTA?", ["A", "E", "I", "O"], 2),
        m("Vocal acentuada", "Los acentos también marcan ritmo.", "Une cada palabra con su vocal acentuada",
          [{ left: "PÁ-JA-RO", right: "Á" }, { left: "MÚ-SI-CA", right: "Ú" }, { left: "TÉ-RMI-NO", right: "É" }, { left: "ÍN-DI-CE", right: "Í" }]),
        q("Vocales únicas", "Cuenta solo las distintas.", "¿Cuántas vocales DIFERENTES tiene MURCIÉLAGO?", ["3", "4", "5", "6"], 2),
      ],
    }, { status: "available", completion: 0 }),

    tiered("lp-c2", "Sílabas en el camino", "Junta sonidos para formar palabras.", {
      inicial: [
        q("Une las sílabas", "MA + MÁ = MAMÁ.", "¿Qué palabra forman PA + PÁ?", ["PAPA", "PAPÁ", "PIPA", "POPÓ"], 1),
        m("Une sílabas en pareja", "Cada palabra tiene su música.", "Une las sílabas para formar una palabra",
          [{ left: "CA", right: "SA" }, { left: "SOL", right: "🌞" }, { left: "LU", right: "NA" }, { left: "PE", right: "RRO" }]),
        q("Cuenta sílabas", "Aplaude la palabra: GA-TO 👏👏", "¿Cuántas sílabas tiene MA-RI-PO-SA?", ["2", "3", "4", "5"], 2),
      ],
      avanzado: [
        q("Sílaba tónica", "La sílaba tónica suena más fuerte.", "¿Cuál es la sílaba fuerte de CA-MI-NO?", ["CA", "MI", "NO", "Ninguna"], 1),
        d("Clasifica por sílabas", "Cuenta antes de soltar.", "Arrastra cada palabra al grupo correcto",
          [{ id: "s1", label: "1 sílaba", emoji: "☝️" }, { id: "s2", label: "2 sílabas", emoji: "✌️" }, { id: "s3", label: "3 sílabas", emoji: "🤟" }, { id: "s4", label: "4 sílabas", emoji: "🖖" }],
          [{ id: "i1", label: "PA-TO", bucket: "s2" }, { id: "i2", label: "CA-SI-TA", bucket: "s3" }, { id: "i3", label: "MA-RI-PO-SA", bucket: "s4" }, { id: "i4", label: "SOL", bucket: "s1" }, { id: "i5", label: "TE-LÉ-FO-NO", bucket: "s4" }, { id: "i6", label: "LU-NA", bucket: "s2" }]),
        q("Falta una sílaba", "Imagina cómo suena.", "¿Qué falta? VEN-TA-__", ["NA", "DA", "TA", "RA"], 0),
      ],
      experto: [
        q("Diptongo", "Dos vocales juntas en una sílaba.", "¿En qué palabra hay un diptongo?", ["CASA", "AIRE", "PERRO", "MESA"], 1),
        d("Aguda, llana, esdrújula", "Mira dónde golpea la voz.", "Arrastra cada palabra a su tipo",
          [{ id: "ag", label: "Aguda", emoji: "↗️" }, { id: "ll", label: "Llana", emoji: "➡️" }, { id: "es", label: "Esdrújula", emoji: "⚡" }],
          [{ id: "i1", label: "CAFÉ", bucket: "ag" }, { id: "i2", label: "MESA", bucket: "ll" }, { id: "i3", label: "PÁJARO", bucket: "es" }, { id: "i4", label: "RELOJ", bucket: "ag" }, { id: "i5", label: "MÚSICA", bucket: "es" }, { id: "i6", label: "LIBRO", bucket: "ll" }]),
        q("Sílaba final", "Lee y escucha el final.", "¿Cuál es la última sílaba de SUBMARINO?", ["SUB", "MA", "RI", "NO"], 3),
      ],
    }, { status: "available", completion: 0 }),

    tiered("lp-c3", "Palabras que conozco", "Une palabras con lo que ves.", {
      inicial: [
        v("¿Cuál es un perro?", "Cada palabra tiene una imagen.", "¿Cuál es un PERRO?",
          [{ emoji: "🐱", label: "Gato" }, { emoji: "🐶", label: "Perro" }, { emoji: "🐰", label: "Conejo" }, { emoji: "🐦", label: "Pájaro" }], 1),
        d("Animales y cosas", "Algunas palabras son animales, otras son cosas.", "Arrastra cada palabra a su grupo",
          [{ id: "ani", label: "Animales", emoji: "🐾" }, { id: "cos", label: "Cosas", emoji: "📦" }],
          [{ id: "i1", label: "Gato", bucket: "ani" }, { id: "i2", label: "Mesa", bucket: "cos" }, { id: "i3", label: "Pez", bucket: "ani" }, { id: "i4", label: "Silla", bucket: "cos" }, { id: "i5", label: "Rana", bucket: "ani" }, { id: "i6", label: "Lápiz", bucket: "cos" }]),
        q("Sinónimo de casa", "Lee con calma 🪜", "¿Qué significa lo mismo que CASA?", ["Hogar", "Coche", "Mesa", "Sol"], 0),
      ],
      avanzado: [
        m("Sinónimos", "Sinónimo = significa lo mismo.", "Une cada palabra con su sinónimo",
          [{ left: "Bonito", right: "Lindo" }, { left: "Rápido", right: "Veloz" }, { left: "Grande", right: "Enorme" }, { left: "Feliz", right: "Alegre" }]),
        q("Antónimo", "Antónimo = lo contrario.", "¿Cuál es el contrario de FRÍO?", ["Helado", "Caliente", "Tibio", "Fresco" ], 1),
        d("Singular o plural", "Plural = más de uno.", "Arrastra cada palabra",
          [{ id: "sg", label: "Singular", emoji: "1️⃣" }, { id: "pl", label: "Plural", emoji: "🔢" }],
          [{ id: "i1", label: "Perro", bucket: "sg" }, { id: "i2", label: "Casas", bucket: "pl" }, { id: "i3", label: "Estrellas", bucket: "pl" }, { id: "i4", label: "Sol", bucket: "sg" }, { id: "i5", label: "Niños", bucket: "pl" }, { id: "i6", label: "Mesa", bucket: "sg" }]),
      ],
      experto: [
        q("Familia de palabras", "Comparten una raíz.", "¿Cuál NO es de la familia de PAN?", ["Panadero", "Panadería", "Pantalón", "Panecillo"], 2),
        m("Categoría gramatical", "Cada palabra tiene un papel.", "Une cada palabra con su tipo",
          [{ left: "Correr", right: "Verbo" }, { left: "Mesa", right: "Sustantivo" }, { left: "Verde", right: "Adjetivo" }, { left: "Rápidamente", right: "Adverbio" }]),
        q("Palabra polisémica", "Una palabra, varios significados.", "¿Cuál tiene varios significados?", ["Banco", "Lápiz", "Zapato", "Cuchara"], 0),
      ],
    }, { status: "available", completion: 0 }),

    tiered("lp-c4", "Pequeñas frases", "De palabras a frases con sentido.", {
      inicial: [
        q("Frase ordenada", "Una frase tiene orden.", "¿Cuál tiene sentido?", ["Perro come el", "El perro come", "Come el perro", "Perro el come"], 1),
        m("Sujeto y acción", "¿Quién? ¿Qué hace?", "Une el sujeto con su acción",
          [{ left: "El pájaro", right: "vuela" }, { left: "El pez", right: "nada" }, { left: "El conejo", right: "salta" }, { left: "El sol", right: "brilla" }]),
        v("¿Qué hace?", "Mira y elige.", "El gato…", [{ emoji: "🏃", label: "Corre" }, { emoji: "💤", label: "Duerme" }, { emoji: "🍽️", label: "Come" }, { emoji: "🎵", label: "Canta" }], 1),
      ],
      avanzado: [
        q("Pregunta o frase", "Las preguntas terminan en ?", "¿Cuál es una pregunta?", ["El cielo es azul.", "¿Dónde estás?", "Hace calor.", "Vamos al parque."], 1),
        d("Punto, coma, signo", "Cada signo tiene su lugar.", "Arrastra cada signo",
          [{ id: "fin", label: "Final de frase", emoji: "⏹️" }, { id: "pau", label: "Pausa", emoji: "⏸️" }, { id: "preg", label: "Pregunta", emoji: "❓" }],
          [{ id: "i1", label: ".", bucket: "fin" }, { id: "i2", label: ",", bucket: "pau" }, { id: "i3", label: "?", bucket: "preg" }, { id: "i4", label: "!", bucket: "fin" }]),
        q("Concordancia", "El verbo concuerda con el sujeto.", "¿Cuál está bien?", ["Los niños juega.", "Los niños juegan.", "Los niño juegan.", "Las niños juegan."], 1),
      ],
      experto: [
        q("Tipo de oración", "Cada frase tiene una intención.", "“¡Qué bonito día!” es una oración…", ["enunciativa", "interrogativa", "exclamativa", "imperativa"], 2),
        m("Verbo en su tiempo", "Pasado, presente o futuro.", "Une cada verbo con su tiempo",
          [{ left: "Comí", right: "Pasado" }, { left: "Como", right: "Presente" }, { left: "Comeré", right: "Futuro" }, { left: "Comía", right: "Pasado" }]),
        q("Conector lógico", "Conectores unen ideas.", "“Quería salir, ____ llovía mucho.”", ["porque", "pero", "y", "si"], 1),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("lp-summit", "Cumbre del Pico de las Letras", "Demuestra que ya eres explorador de palabras.", {
      inicial: [
        q("Reto del lector", "Confía en lo aprendido.", "¿Cuántas vocales hay en CARAMELO?", ["2", "3", "4", "5"], 1),
        v("Reto visual", "Mira con atención 👀", "¿Qué empieza con la letra L?",
          [{ emoji: "🦁", label: "León" }, { emoji: "🐯", label: "Tigre" }, { emoji: "🐘", label: "Elefante" }, { emoji: "🦒", label: "Jirafa" }], 0),
        q("Reto final", "Has llegado muy alto 🏔️", "¿Cuántas sílabas tiene EX-PLO-RA-DOR?", ["2", "3", "4", "5"], 2),
      ],
      avanzado: [
        q("Sílaba fuerte", "Escucha el golpe.", "¿Cuál es la tónica de MO-CHI-LA?", ["MO", "CHI", "LA", "Ninguna"], 1),
        m("Sinónimos cumbre", "Las palabras tienen primas.", "Une cada palabra",
          [{ left: "Cima", right: "Cumbre" }, { left: "Sendero", right: "Camino" }, { left: "Refugio", right: "Cabaña" }, { left: "Alto", right: "Elevado" }]),
        q("Frase final", "Concuerda y triunfa.", "¿Cuál es correcta?", ["Las montañas son alta.", "Las montañas son altas.", "La montaña son altas.", "Los montaña son alto."], 1),
      ],
      experto: [
        q("Reto experto", "Detalle fino.", "¿Cuál es esdrújula?", ["camino", "música", "pelota", "ventana"], 1),
        m("Categoría experta", "Cada palabra ocupa su lugar.", "Une cada palabra con su categoría",
          [{ left: "Escalar", right: "Verbo" }, { left: "Cumbre", right: "Sustantivo" }, { left: "Helado", right: "Adjetivo" }, { left: "Arriba", right: "Adverbio" }]),
        q("Conector experto", "Conecta con sentido.", "“Subiré a la cima ____ llueva.”", ["porque", "aunque", "y", "como"], 1),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// MOUNTAIN 2 — CRESTA DE LOS NÚMEROS (DEEP)
// =============================================================
const numeros: Mountain = {
  id: "numeros-ridge",
  title: "Cresta de los Números",
  description: "Sube contando, sumando y descubriendo patrones.",
  category: "Números",
  icon: "🔢",
  color: "secondary",
  duration: "25 min",
  difficulty: "beginner",
  rewards: 300,
  progress: 0,
  status: "available",
  modules: [
    tiered("nr-c1", "Contar hasta 10 (y más)", "Cada paso es un número.", {
      inicial: [
        v("Cuenta los animales", "Asocia cosa con número 🐾", "¿Qué grupo tiene exactamente 5?",
          [{ emoji: "🐶🐶🐶", label: "3 perros" }, { emoji: "🐱🐱🐱🐱🐱", label: "5 gatos" }, { emoji: "🐰🐰🐰🐰", label: "4 conejos" }, { emoji: "🐭🐭🐭🐭🐭🐭", label: "6 ratones" }], 1),
        q("Número siguiente", "Después del 4 viene el 5 🪜", "¿Qué va después del 7?", ["6", "8", "9", "5"], 1),
        q("Número anterior", "También se puede bajar.", "¿Qué va antes del 10?", ["11", "8", "9", "7"], 2),
      ],
      avanzado: [
        q("Cuenta de 2 en 2", "Salta de dos en dos.", "Después del 14 va…", ["15", "16", "17", "18"], 1),
        d("Más, menos, igual", "Compara cantidades.", "Arrastra cada par",
          [{ id: "may", label: "El primero es mayor", emoji: ">" }, { id: "men", label: "El primero es menor", emoji: "<" }, { id: "ig", label: "Iguales", emoji: "=" }],
          [{ id: "i1", label: "8 vs 5", bucket: "may" }, { id: "i2", label: "3 vs 9", bucket: "men" }, { id: "i3", label: "7 vs 7", bucket: "ig" }, { id: "i4", label: "12 vs 4", bucket: "may" }, { id: "i5", label: "6 vs 10", bucket: "men" }, { id: "i6", label: "11 vs 11", bucket: "ig" }]),
        q("Dos cifras", "Hasta el 99 también cuentas.", "¿Qué va después del 29?", ["20", "30", "31", "39"], 1),
      ],
      experto: [
        q("Cuenta hacia atrás", "Cuenta hacia atrás de 10 en 10.", "100, 90, 80, __", ["60", "70", "75", "85"], 1),
        q("Centena cercana", "¿Qué centena está más cerca?", "El 47 está más cerca de…", ["0", "50", "100", "150"], 1),
        d("Ordena de menor a mayor", "Compara con cuidado.", "Arrastra cada número a su posición",
          [{ id: "p1", label: "1º más pequeño", emoji: "🥉" }, { id: "p2", label: "Medio", emoji: "🥈" }, { id: "p3", label: "Más grande", emoji: "🥇" }],
          [{ id: "i1", label: "23", bucket: "p1" }, { id: "i2", label: "57", bucket: "p2" }, { id: "i3", label: "84", bucket: "p3" }]),
      ],
    }, { status: "available", completion: 0 }),

    tiered("nr-c2", "Sumar pasos", "Cada suma te lleva más arriba.", {
      inicial: [
        q("Primera suma", "Sumar es juntar 🪨", "¿Cuánto es 3 + 4?", ["6", "7", "8", "5"], 1),
        q("Suma con dedos", "Tus dedos cuentan 🖐️", "¿Cuánto es 5 + 2?", ["6", "7", "8", "9"], 1),
        d("Clasifica las sumas", "Compara con 10.", "Arrastra cada suma a su resultado",
          [{ id: "lt10", label: "Menor que 10", emoji: "🐣" }, { id: "eq10", label: "Igual a 10", emoji: "🎯" }, { id: "gt10", label: "Mayor que 10", emoji: "🚀" }],
          [{ id: "i1", label: "3 + 4", bucket: "lt10" }, { id: "i2", label: "6 + 4", bucket: "eq10" }, { id: "i3", label: "8 + 5", bucket: "gt10" }, { id: "i4", label: "2 + 5", bucket: "lt10" }, { id: "i5", label: "7 + 3", bucket: "eq10" }, { id: "i6", label: "9 + 6", bucket: "gt10" }]),
      ],
      avanzado: [
        q("Suma de dos cifras", "Suma sin perder ningún paso.", "¿Cuánto es 14 + 8?", ["20", "21", "22", "23"], 2),
        q("Llevarse 1", "Cuando pasas de 10, te llevas 1.", "¿Cuánto es 27 + 15?", ["32", "41", "42", "52"], 2),
        m("Une suma con resultado", "Calcula con calma.", "Une cada suma con su resultado",
          [{ left: "12 + 9", right: "21" }, { left: "25 + 5", right: "30" }, { left: "18 + 14", right: "32" }, { left: "33 + 7", right: "40" }]),
      ],
      experto: [
        q("Suma mental", "Descompón para sumar.", "¿Cuánto es 47 + 36?", ["73", "82", "83", "93"], 2),
        q("Tres sumandos", "Suma por pasos.", "¿Cuánto es 12 + 15 + 8?", ["33", "34", "35", "36"], 2),
        d("Suma exacta", "Encuentra qué pares dan 100.", "Arrastra cada suma",
          [{ id: "yes", label: "Da 100", emoji: "💯" }, { id: "no", label: "No da 100", emoji: "❌" }],
          [{ id: "i1", label: "60 + 40", bucket: "yes" }, { id: "i2", label: "75 + 25", bucket: "yes" }, { id: "i3", label: "55 + 50", bucket: "no" }, { id: "i4", label: "90 + 10", bucket: "yes" }, { id: "i5", label: "33 + 77", bucket: "no" }, { id: "i6", label: "85 + 15", bucket: "yes" }]),
      ],
    }, { status: "available", completion: 0 }),

    tiered("nr-c3", "Restar el camino", "También se baja la montaña.", {
      inicial: [
        q("Primera resta", "Restar es quitar.", "¿Cuánto es 5 − 2?", ["2", "3", "4", "1"], 1),
        v("Quita y cuenta", "Tenías 6 manzanas, comiste 2.", "¿Cuántas quedan?",
          [{ emoji: "🍎🍎🍎", label: "3" }, { emoji: "🍎🍎🍎🍎", label: "4" }, { emoji: "🍎🍎", label: "2" }, { emoji: "🍎🍎🍎🍎🍎", label: "5" }], 1),
        q("Resta sencilla", "Cuenta hacia atrás.", "¿Cuánto es 9 − 4?", ["3", "4", "5", "6"], 2),
      ],
      avanzado: [
        q("Resta de dos cifras", "Sin llevadas, paso a paso.", "¿Cuánto es 35 − 12?", ["13", "23", "27", "33"], 1),
        q("Resta con llevada", "Pide prestado al de al lado.", "¿Cuánto es 42 − 18?", ["24", "26", "34", "36"], 0),
        m("Une resta con resultado", "Trabaja con calma.", "Une cada resta",
          [{ left: "20 − 7", right: "13" }, { left: "50 − 25", right: "25" }, { left: "33 − 14", right: "19" }, { left: "60 − 11", right: "49" }]),
      ],
      experto: [
        q("Resta mental", "Descompón para restar.", "¿Cuánto es 100 − 47?", ["43", "53", "57", "63"], 1),
        q("Diferencia justa", "Distancia entre números.", "¿Cuánto le falta al 68 para llegar a 100?", ["22", "32", "42", "12"], 1),
        d("Resultado par o impar", "Un número par termina en 0,2,4,6,8.", "Arrastra cada resta",
          [{ id: "par", label: "Resultado par", emoji: "🎲" }, { id: "imp", label: "Resultado impar", emoji: "🔺" }],
          [{ id: "i1", label: "10 − 4", bucket: "par" }, { id: "i2", label: "15 − 8", bucket: "imp" }, { id: "i3", label: "20 − 5", bucket: "imp" }, { id: "i4", label: "30 − 12", bucket: "par" }, { id: "i5", label: "42 − 17", bucket: "imp" }, { id: "i6", label: "50 − 16", bucket: "par" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("nr-c4", "Patrones del camino", "Los números también tienen ritmo.", {
      inicial: [
        q("Patrón simple", "Van de dos en dos.", "¿Qué sigue: 2, 4, 6, __?", ["7", "8", "10", "9"], 1),
        m("Une número y cantidad", "Cada número es una cantidad.", "Une cada número",
          [{ left: "3", right: "🍎🍎🍎" }, { left: "5", right: "⭐⭐⭐⭐⭐" }, { left: "2", right: "🎈🎈" }, { left: "4", right: "🌟🌟🌟🌟" }]),
        q("Patrón saltarín", "De tres en tres 🦘", "¿Qué sigue: 3, 6, 9, __?", ["10", "11", "12", "15"], 2),
      ],
      avanzado: [
        q("Patrón de 5", "Salta de cinco en cinco.", "5, 10, 15, __", ["18", "19", "20", "25"], 2),
        q("Patrón decreciente", "Hacia abajo, paso a paso.", "20, 16, 12, __", ["10", "8", "9", "11"], 1),
        d("Pares e impares", "Pares: 0,2,4… Impares: 1,3,5…", "Arrastra cada número",
          [{ id: "par", label: "Par", emoji: "♟️" }, { id: "imp", label: "Impar", emoji: "♔" }],
          [{ id: "i1", label: "8", bucket: "par" }, { id: "i2", label: "11", bucket: "imp" }, { id: "i3", label: "16", bucket: "par" }, { id: "i4", label: "23", bucket: "imp" }, { id: "i5", label: "30", bucket: "par" }, { id: "i6", label: "47", bucket: "imp" }]),
      ],
      experto: [
        q("Patrón de multiplicar", "Tabla del 7.", "7, 14, 21, __", ["27", "28", "29", "35"], 1),
        q("Patrón mixto", "Suma 3, suma 5, repite.", "1, 4, 9, 12, 17, __", ["19", "20", "22", "24"], 2),
        m("Une patrón con regla", "Cada secuencia esconde una regla.", "Une cada secuencia con su regla",
          [{ left: "2,4,6,8", right: "+2" }, { left: "5,10,15", right: "+5" }, { left: "1,3,9,27", right: "×3" }, { left: "100,90,80", right: "−10" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("nr-summit", "Cumbre de la Cresta", "Demuestra que dominas los números.", {
      inicial: [
        q("Reto contador", "Cuenta despacio.", "¿Cuántos dedos tienes en total?", ["8", "10", "12", "20"], 1),
        q("Reto sumador", "Suma con calma 🧘", "¿Cuánto es 6 + 5?", ["10", "11", "12", "13"], 1),
        q("Reto del patrón", "Busca el ritmo.", "¿Qué sigue: 5, 10, 15, __?", ["18", "19", "20", "25"], 2),
      ],
      avanzado: [
        q("Suma cumbre", "Suma con llevada.", "¿Cuánto es 38 + 27?", ["55", "65", "67", "75"], 1),
        q("Resta cumbre", "Pide prestado.", "¿Cuánto es 64 − 29?", ["33", "35", "45", "55"], 1),
        q("Patrón cumbre", "Mira los saltos.", "¿Qué sigue: 6, 12, 18, 24, __?", ["28", "30", "32", "36"], 1),
      ],
      experto: [
        q("Mental cumbre", "Descompón rápido.", "¿Cuánto es 99 + 102?", ["191", "201", "202", "211"], 1),
        q("Doble salto", "Cuidado con el orden.", "¿Cuánto es (50 − 17) + 24?", ["55", "57", "67", "77"], 1),
        q("Patrón experto", "Tabla del 6.", "¿Qué sigue: 6, 12, 24, 48, __?", ["54", "60", "72", "96"], 3),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// MOUNTAIN 3 — SENDERO DE LA NATURALEZA (1 deep module)
// =============================================================
const naturaleza: Mountain = {
  id: "naturaleza-trail",
  title: "Sendero de la Naturaleza",
  description: "Animales, plantas y los secretos del planeta.",
  category: "Naturaleza",
  icon: "🌿",
  color: "accent",
  duration: "20 min",
  difficulty: "beginner",
  rewards: 300,
  progress: 0,
  status: "available",
  modules: [
    tiered("nt-c1", "Animales del mundo", "Conoce a los habitantes del camino.", {
      inicial: [
        v("¿Quién vive en el bosque?", "Algunos viven entre árboles 🌲", "¿Cuál vive en el bosque?",
          [{ emoji: "🐠", label: "Pez" }, { emoji: "🦊", label: "Zorro" }, { emoji: "🐳", label: "Ballena" }, { emoji: "🐧", label: "Pingüino" }], 1),
        d("¿Dónde vive cada uno?", "Cada animal tiene su hogar.", "Arrastra cada animal a su hogar",
          [{ id: "agua", label: "Agua", emoji: "🌊" }, { id: "tierra", label: "Tierra", emoji: "🌳" }, { id: "aire", label: "Aire", emoji: "☁️" }],
          [{ id: "i1", label: "Pez", bucket: "agua" }, { id: "i2", label: "Águila", bucket: "aire" }, { id: "i3", label: "Conejo", bucket: "tierra" }, { id: "i4", label: "Tortuga", bucket: "agua" }, { id: "i5", label: "Pájaro", bucket: "aire" }, { id: "i6", label: "Zorro", bucket: "tierra" }]),
        q("Sonido del bosque", "Cada animal tiene su voz.", "¿Qué animal dice 'guau'?", ["Gato", "Perro", "Vaca", "Pato"], 1),
      ],
      avanzado: [
        d("Mamífero, ave o pez", "Cada uno tiene su grupo.", "Arrastra cada animal",
          [{ id: "mam", label: "Mamífero", emoji: "🐻" }, { id: "ave", label: "Ave", emoji: "🦜" }, { id: "pez", label: "Pez", emoji: "🐟" }],
          [{ id: "i1", label: "Perro", bucket: "mam" }, { id: "i2", label: "Águila", bucket: "ave" }, { id: "i3", label: "Salmón", bucket: "pez" }, { id: "i4", label: "Vaca", bucket: "mam" }, { id: "i5", label: "Loro", bucket: "ave" }, { id: "i6", label: "Tiburón", bucket: "pez" }]),
        q("Herbívoro o carnívoro", "Herbívoro come plantas.", "¿Cuál es herbívoro?", ["León", "Tigre", "Vaca", "Tiburón"], 2),
        m("Animal y bebé", "Cada cría tiene su nombre.", "Une cada animal con su cría",
          [{ left: "Perro", right: "Cachorro" }, { left: "Gato", right: "Gatito" }, { left: "Vaca", right: "Ternero" }, { left: "Caballo", right: "Potro" }]),
      ],
      experto: [
        q("Cadena alimenticia", "Sigue la energía.", "El sol → planta → conejo → __", ["Hormiga", "Águila", "Pez", "Vaca"], 1),
        q("Animal en peligro", "Necesitan que los cuidemos.", "¿Cuál está en peligro?", ["Paloma", "Panda gigante", "Gallina", "Perro"], 1),
        d("Vertebrado o invertebrado", "Vertebrado = tiene huesos.", "Arrastra cada animal",
          [{ id: "ver", label: "Vertebrado", emoji: "🦴" }, { id: "inv", label: "Invertebrado", emoji: "🪱" }],
          [{ id: "i1", label: "Perro", bucket: "ver" }, { id: "i2", label: "Pulpo", bucket: "inv" }, { id: "i3", label: "Águila", bucket: "ver" }, { id: "i4", label: "Hormiga", bucket: "inv" }, { id: "i5", label: "Tiburón", bucket: "ver" }, { id: "i6", label: "Mariposa", bucket: "inv" }]),
      ],
    }, { status: "available", completion: 0 }),

    stub("nt-c2", "Las plantas crecen", "Mira nacer las cosas que respiran."),
    stub("nt-c3", "Cuida el planeta", "Pequeños pasos, gran montaña."),
    stub("nt-c4", "Ríos y océanos", "El agua que une todo."),
    stub("nt-summit", "Cumbre del Sendero", "Conviértete en guardián."),
  ],
};

// =============================================================
// MOUNTAIN 4 — MIRADOR CREATIVO (1 deep module)
// =============================================================
const creativa: Mountain = {
  id: "creativa-mirador",
  title: "Mirador Creativo",
  description: "Imagina, crea y mira el mundo con otros ojos.",
  category: "Creativa",
  icon: "🎨",
  color: "primary",
  duration: "18 min",
  difficulty: "beginner",
  rewards: 280,
  progress: 0,
  status: "available",
  modules: [
    tiered("cm-c1", "Colores y mezclas", "Cada color cuenta una historia.", {
      inicial: [
        v("Color del cielo", "Mira hacia arriba ☁️", "¿De qué color es el cielo en un día soleado?",
          [{ emoji: "🟦", label: "Azul" }, { emoji: "🟥", label: "Rojo" }, { emoji: "🟩", label: "Verde" }, { emoji: "🟨", label: "Amarillo" }], 0),
        m("Une cosa y color", "Cada cosa tiene su tono.", "Une cada cosa con su color",
          [{ left: "Sol", right: "Amarillo" }, { left: "Hierba", right: "Verde" }, { left: "Sangre", right: "Rojo" }, { left: "Nube", right: "Blanco" }]),
        q("Color cálido", "Cálido = recuerda al fuego.", "¿Cuál es un color cálido?", ["Azul", "Verde", "Rojo", "Morado"], 2),
      ],
      avanzado: [
        q("Mezcla simple", "Azul + amarillo = ?", "¿Qué sale al mezclar azul y amarillo?", ["Naranja", "Verde", "Morado", "Marrón"], 1),
        d("Cálido o frío", "Cálidos: rojo, naranja, amarillo. Fríos: azul, verde, morado.", "Arrastra cada color",
          [{ id: "cal", label: "Cálido", emoji: "🔥" }, { id: "fri", label: "Frío", emoji: "❄️" }],
          [{ id: "i1", label: "Rojo", bucket: "cal" }, { id: "i2", label: "Azul", bucket: "fri" }, { id: "i3", label: "Naranja", bucket: "cal" }, { id: "i4", label: "Verde", bucket: "fri" }, { id: "i5", label: "Amarillo", bucket: "cal" }, { id: "i6", label: "Morado", bucket: "fri" }]),
        q("Color secundario", "Se hace mezclando dos primarios.", "¿Cuál es secundario?", ["Rojo", "Azul", "Verde", "Amarillo"], 2),
      ],
      experto: [
        m("Mezcla experta", "Cada mezcla, un nuevo color.", "Une cada mezcla con su resultado",
          [{ left: "Rojo + Azul", right: "Morado" }, { left: "Rojo + Amarillo", right: "Naranja" }, { left: "Azul + Amarillo", right: "Verde" }, { left: "Blanco + Negro", right: "Gris" }]),
        q("Color complementario", "Están en lados opuestos.", "¿Cuál es el complementario del rojo?", ["Azul", "Verde", "Amarillo", "Morado"], 1),
        q("Tono y matiz", "Aclarar = añadir blanco.", "¿Cómo aclaras un color?", ["Añadiendo negro", "Añadiendo blanco", "Añadiendo agua", "Frotando"], 1),
      ],
    }, { status: "available", completion: 0 }),

    stub("cm-c2", "Formas y figuras", "Líneas, curvas y patrones."),
    stub("cm-c3", "Cuento mío", "Inventa una historia paso a paso."),
    stub("cm-c4", "Música y ritmo", "Sonidos que cuentan."),
    stub("cm-summit", "Cumbre del Mirador", "Tu obra al viento."),
  ],
};

// =============================================================
// MOUNTAIN 5 — PASO DE LA LÓGICA (1 deep module)
// =============================================================
const logica: Mountain = {
  id: "logica-paso",
  title: "Paso de la Lógica",
  description: "Pensar paso a paso para resolver acertijos.",
  category: "Lógica",
  icon: "🧩",
  color: "secondary",
  duration: "22 min",
  difficulty: "intermediate",
  rewards: 320,
  progress: 0,
  status: "locked",
  modules: [
    tiered("lg-c1", "Sigue la pista", "Observa, ordena, descubre.", {
      inicial: [
        v("¿Qué sigue?", "Mira el patrón.", "🔵 🔴 🔵 🔴 __",
          [{ emoji: "🔵", label: "Azul" }, { emoji: "🔴", label: "Rojo" }, { emoji: "🟢", label: "Verde" }, { emoji: "🟡", label: "Amarillo" }], 0),
        q("Lo que NO encaja", "Uno no es como los demás.", "¿Cuál es el intruso?", ["🍎 Manzana", "🍐 Pera", "🥕 Zanahoria", "🍌 Plátano"], 2),
        m("Une figura y sombra", "Las sombras imitan la forma.", "Une cada figura con su sombra",
          [{ left: "🐘 Elefante", right: "Grande y gris" }, { left: "🐭 Ratón", right: "Pequeño y rápido" }, { left: "🦒 Jirafa", right: "Alta y delgada" }, { left: "🐢 Tortuga", right: "Lenta y dura" }]),
      ],
      avanzado: [
        q("Adivinanza lógica", "Lee con calma.", "Ana es mayor que Ben. Ben es mayor que Coco. ¿Quién es el mayor?", ["Ana", "Ben", "Coco", "Ninguno"], 0),
        d("Causa o efecto", "La causa pasa antes.", "Arrastra cada hecho",
          [{ id: "cau", label: "Causa", emoji: "🌧️" }, { id: "ef", label: "Efecto", emoji: "💧" }],
          [{ id: "i1", label: "Llueve", bucket: "cau" }, { id: "i2", label: "El suelo se moja", bucket: "ef" }, { id: "i3", label: "Como mucho", bucket: "cau" }, { id: "i4", label: "Me lleno", bucket: "ef" }]),
        q("Falta una pieza", "Patrón con orden.", "¿Qué falta? ⬛⬜⬛⬜__⬜", ["⬛", "⬜", "🔴", "Nada"], 0),
      ],
      experto: [
        q("Si... entonces...", "Razona en cadena.", "Si todos los osos duermen y Bo es un oso, entonces…", ["Bo come", "Bo duerme", "Bo corre", "No sabemos"], 1),
        q("Lógica numérica", "Encuentra la regla.", "Si 2→4, 3→9, 4→16, entonces 5→?", ["10", "20", "25", "30"], 2),
        m("Une enigma con respuesta", "Piensa antes de unir.", "Une cada enigma",
          [{ left: "Tiene patas pero no anda", right: "Mesa" }, { left: "Cae pero no se rompe", right: "Noche" }, { left: "Cuanto más quitas, más grande es", right: "Hoyo" }, { left: "Sin alas pero vuela", right: "Tiempo" }]),
      ],
    }, { status: "available", completion: 0 }),

    stub("lg-c2", "Secuencias", "Lo que va antes y después."),
    stub("lg-c3", "Categorías", "Agrupar por lo que comparten."),
    stub("lg-c4", "Acertijos", "Pequeños retos para crecer."),
    stub("lg-summit", "Cumbre de la Lógica", "Pon tu mente a prueba."),
  ],
};

// =============================================================
// MOUNTAIN 6 — REFUGIO EMOCIONAL (1 deep module)
// =============================================================
const social: Mountain = {
  id: "social-refugio",
  title: "Refugio Emocional",
  description: "Sentir, entender y convivir bien.",
  category: "Social",
  icon: "💛",
  color: "accent",
  duration: "18 min",
  difficulty: "beginner",
  rewards: 260,
  progress: 0,
  status: "locked",
  modules: [
    tiered("sr-c1", "Reconocer emociones", "Cada cara cuenta una historia.", {
      inicial: [
        v("¿Qué siente?", "Mira la cara.", "Esta cara está…",
          [{ emoji: "😀", label: "Feliz" }, { emoji: "😢", label: "Triste" }, { emoji: "😡", label: "Enfadado" }, { emoji: "😴", label: "Dormido" }], 0),
        v("Cara triste", "Lágrimas y boca abajo.", "¿Cuál está triste?",
          [{ emoji: "😄", label: "Feliz" }, { emoji: "😢", label: "Triste" }, { emoji: "😯", label: "Sorprendido" }, { emoji: "😠", label: "Enfadado" }], 1),
        m("Une emoción y emoji", "Cada emoción tiene cara.", "Une cada emoción con su cara",
          [{ left: "Feliz", right: "😀" }, { left: "Triste", right: "😢" }, { left: "Enfadado", right: "😡" }, { left: "Sorprendido", right: "😯" }]),
      ],
      avanzado: [
        q("¿Qué hago si…?", "Pensar antes de actuar.", "Si un amigo está triste, lo mejor es…", ["Reírme", "Preguntarle si está bien", "Irme", "Gritar"], 1),
        d("Emoción agradable o no", "Algunas se sienten ricas, otras pesadas.", "Arrastra cada emoción",
          [{ id: "ag", label: "Agradable", emoji: "🌞" }, { id: "in", label: "Incómoda", emoji: "🌧️" }],
          [{ id: "i1", label: "Alegría", bucket: "ag" }, { id: "i2", label: "Miedo", bucket: "in" }, { id: "i3", label: "Calma", bucket: "ag" }, { id: "i4", label: "Enfado", bucket: "in" }, { id: "i5", label: "Cariño", bucket: "ag" }, { id: "i6", label: "Vergüenza", bucket: "in" }]),
        q("Calmarse", "Respirar ayuda.", "¿Qué ayuda a calmarse cuando hay enfado?", ["Romper algo", "Respirar profundo", "Gritar", "Esconderse"], 1),
      ],
      experto: [
        q("Empatía", "Ponerse en su lugar.", "Empatizar significa…", ["Reírse de alguien", "Sentir lo que siente otro", "Hacer lo que quieras", "Estar callado"], 1),
        q("Resolver un conflicto", "Hablar es la primera escalera.", "Si discutes con un amigo, primero…", ["Hablar tranquilo", "Pegar", "Romper amistad", "Esconderte"], 0),
        m("Une situación con emoción", "Cada momento trae una emoción.", "Une cada situación",
          [{ left: "Examen sorpresa", right: "Nervios" }, { left: "Ganar el partido", right: "Alegría" }, { left: "Perder un juguete", right: "Tristeza" }, { left: "Caja sin abrir", right: "Curiosidad" }]),
      ],
    }, { status: "available", completion: 0 }),

    stub("sr-c2", "Calmar la tormenta", "Trucos para los días difíciles."),
    stub("sr-c3", "Compartir el camino", "Convivir con otros."),
    stub("sr-c4", "Pedir y dar ayuda", "Subimos mejor en grupo."),
    stub("sr-summit", "Cumbre del Refugio", "Tu corazón fuerte y tranquilo."),
  ],
};

// =============================================================
// EXPORTED CATALOG
// =============================================================
export const mountains: Mountain[] = [
  letras,
  numeros,
  naturaleza,
  creativa,
  logica,
  social,
];

export const mountainsCategories = ["Todas", "Letras", "Números", "Naturaleza", "Creativa", "Lógica", "Social"];

/** Find a mountain by id. */
export function findMountain(id: string | undefined): Mountain | undefined {
  return mountains.find((mn) => mn.id === id);
}

/** Find a module within a mountain. */
export function findTieredModule(
  mountainId: string | undefined,
  moduleId: string | undefined,
): { mountain: Mountain; module: TieredModule } | null {
  const mountain = findMountain(mountainId);
  if (!mountain) return null;
  const module = mountain.modules.find((mo) => mo.id === moduleId);
  if (!module) return null;
  return { mountain, module };
}

/** Find a single challenge across all mountains/modules at the given tier. */
export function findChallenge(
  mountainId: string | undefined,
  moduleId: string | undefined,
  challengeId: string | undefined,
  tier: Tier,
) {
  const found = findTieredModule(mountainId, moduleId);
  if (!found) return null;
  const challenges = getActiveChallenges(found.module, tier);
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) return null;
  return { mountain: found.mountain, module: found.module, challenges, challenge };
}
