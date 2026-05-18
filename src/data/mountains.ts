// =============================================================
// MOUNTAINS — Complete catalog: 6 mountains × 5 checkpoints × 3 tiers.
//
// All six mountains ship with fully playable challenges across all
// tiers and modules. Compatible with the legacy Superpower / PowerModule
// / Challenge shape so existing pages keep working through
// `getActiveChallenges(mod, tier)`.
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
  challenges: Challenge[];
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

/** Tiered module factory. */
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
// MOUNTAIN 1 — PICO DE LAS LETRAS (COMPLETE)
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
        q("Antónimo", "Antónimo = lo contrario.", "¿Cuál es el contrario de FRÍO?", ["Helado", "Caliente", "Tibio", "Fresco"], 1),
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
        v("¿Qué hace?", "Mira y elige.", "El gato…",
          [{ emoji: "🏃", label: "Corre" }, { emoji: "💤", label: "Duerme" }, { emoji: "🍽️", label: "Come" }, { emoji: "🎵", label: "Canta" }], 1),
      ],
      avanzado: [
        q("Pregunta o frase", "Las preguntas terminan en ?", "¿Cuál es una pregunta?", ["El cielo es azul.", "¿Dónde estás?", "Hace calor.", "Vamos al parque."], 1),
        d("Punto, coma, signo", "Cada signo tiene su lugar.", "Arrastra cada signo",
          [{ id: "fin", label: "Final de frase", emoji: "⏹️" }, { id: "pau", label: "Pausa", emoji: "⏸️" }, { id: "preg", label: "Pregunta", emoji: "❓" }],
          [{ id: "i1", label: ".", bucket: "fin" }, { id: "i2", label: ",", bucket: "pau" }, { id: "i3", label: "?", bucket: "preg" }, { id: "i4", label: "!", bucket: "fin" }]),
        q("Concordancia", "El verbo concuerda con el sujeto.", "¿Cuál está bien?", ["Los niños juega.", "Los niños juegan.", "Los niño juegan.", "Las niños juegan."], 1),
      ],
      experto: [
        q("Tipo de oración", "Cada frase tiene una intención.", '"¡Qué bonito día!" es una oración…', ["enunciativa", "interrogativa", "exclamativa", "imperativa"], 2),
        m("Verbo en su tiempo", "Pasado, presente o futuro.", "Une cada verbo con su tiempo",
          [{ left: "Comí", right: "Pasado" }, { left: "Como", right: "Presente" }, { left: "Comeré", right: "Futuro" }, { left: "Comía", right: "Pasado" }]),
        q("Conector lógico", "Conectores unen ideas.", '"Quería salir, ____ llovía mucho."', ["porque", "pero", "y", "si"], 1),
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
        q("Conector experto", "Conecta con sentido.", '"Subiré a la cima ____ llueva."', ["porque", "aunque", "y", "como"], 1),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// MOUNTAIN 2 — CRESTA DE LOS NÚMEROS (COMPLETE)
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
// MOUNTAIN 3 — SENDERO DE LA NATURALEZA (COMPLETE)
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
        q("Animal en peligro", "Necesitan que los cuidemos.", "¿Cuál está en peligro de extinción?", ["Paloma", "Panda gigante", "Gallina", "Perro"], 1),
        d("Vertebrado o invertebrado", "Vertebrado = tiene columna.", "Arrastra cada animal",
          [{ id: "ver", label: "Vertebrado", emoji: "🦴" }, { id: "inv", label: "Invertebrado", emoji: "🪱" }],
          [{ id: "i1", label: "Perro", bucket: "ver" }, { id: "i2", label: "Pulpo", bucket: "inv" }, { id: "i3", label: "Águila", bucket: "ver" }, { id: "i4", label: "Hormiga", bucket: "inv" }, { id: "i5", label: "Tiburón", bucket: "ver" }, { id: "i6", label: "Mariposa", bucket: "inv" }]),
      ],
    }, { status: "available", completion: 0 }),

    tiered("nt-c2", "Las plantas crecen", "Descubre cómo nace y crece la vida verde.", {
      inicial: [
        v("¿Qué crece de una semilla?", "Toda planta grande fue pequeña 🌱", "¿Qué crece de una semilla?",
          [{ emoji: "🌳", label: "Árbol" }, { emoji: "🪨", label: "Piedra" }, { emoji: "💧", label: "Gota" }, { emoji: "☁️", label: "Nube" }], 0),
        q("Las plantas necesitan", "Agua, sol y tierra son sus tres amigos.", "¿Qué necesita una planta para crecer?", ["Solo agua", "Solo sol", "Agua, sol y tierra", "Nada"], 2),
        m("Partes de la planta", "Cada parte tiene su trabajo.", "Une la parte con su función",
          [{ left: "Raíz", right: "Bebe agua" }, { left: "Hoja", right: "Atrapa el sol" }, { left: "Flor", right: "Hace semillas" }, { left: "Tallo", right: "Sostiene todo" }]),
      ],
      avanzado: [
        q("Fotosíntesis", "Las plantas fabrican su propio alimento con luz.", "¿Qué producen las plantas con la fotosíntesis?", ["Agua", "Oxígeno", "Tierra", "Lluvia"], 1),
        d("¿Dónde crece cada planta?", "Cada planta elige su hogar.", "Arrastra cada planta a su lugar",
          [{ id: "agua", label: "Agua", emoji: "🌊" }, { id: "desierto", label: "Desierto", emoji: "🏜️" }, { id: "bosque", label: "Bosque", emoji: "🌲" }],
          [{ id: "i1", label: "Nenúfar", bucket: "agua" }, { id: "i2", label: "Cactus", bucket: "desierto" }, { id: "i3", label: "Roble", bucket: "bosque" }, { id: "i4", label: "Alga", bucket: "agua" }, { id: "i5", label: "Pino", bucket: "bosque" }, { id: "i6", label: "Palmera datilera", bucket: "desierto" }]),
        q("Planta con flor", "Las plantas con flor se llaman angiospermas.", "¿Cuál es una planta con flor?", ["Helecho", "Musgo", "Rosal", "Pino"], 2),
      ],
      experto: [
        q("Polinización", "Las flores necesitan ayuda para reproducirse.", "¿Quién ayuda principalmente a polinizar las flores?", ["Peces", "Abejas", "Serpientes", "Tortugas"], 1),
        m("Tipo de planta", "Cada planta pertenece a un grupo.", "Une cada planta con su tipo",
          [{ left: "Rosal", right: "Angiosperma" }, { left: "Pino", right: "Gimnosperma" }, { left: "Helecho", right: "Pteridofita" }, { left: "Musgo", right: "Briofita" }]),
        d("¿Útil para qué?", "Las plantas nos dan muchas cosas.", "Arrastra cada planta",
          [{ id: "com", label: "Comida", emoji: "🍽️" }, { id: "med", label: "Medicina", emoji: "💊" }, { id: "dec", label: "Decoración", emoji: "🌸" }],
          [{ id: "i1", label: "Manzano", bucket: "com" }, { id: "i2", label: "Aloe vera", bucket: "med" }, { id: "i3", label: "Orquídea", bucket: "dec" }, { id: "i4", label: "Trigo", bucket: "com" }, { id: "i5", label: "Menta", bucket: "med" }, { id: "i6", label: "Rosa", bucket: "dec" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("nt-c3", "Cuida el planeta", "Pequeños pasos, gran montaña.", {
      inicial: [
        q("Reciclar ayuda", "Cada cosa va a su lugar.", "¿Qué ayuda a cuidar la naturaleza?", ["Tirar basura al suelo", "Reciclar", "Talar árboles", "Contaminar el río"], 1),
        d("Recicla bien", "Cada residuo tiene su contenedor.", "Arrastra cada objeto a su contenedor",
          [{ id: "papel", label: "Papel", emoji: "📄" }, { id: "plast", label: "Plástico", emoji: "♻️" }, { id: "org", label: "Orgánico", emoji: "🍂" }],
          [{ id: "i1", label: "Periódico", bucket: "papel" }, { id: "i2", label: "Botella", bucket: "plast" }, { id: "i3", label: "Cáscara de fruta", bucket: "org" }, { id: "i4", label: "Cartón", bucket: "papel" }, { id: "i5", label: "Bolsa", bucket: "plast" }, { id: "i6", label: "Restos de comida", bucket: "org" }]),
        q("Ahorrar agua", "Cada gota vale.", "¿Cuándo gastamos menos agua?", ["Dejando el grifo abierto", "Cerrando el grifo al lavarse", "Usando la manguera siempre", "Llenando la bañera a diario"], 1),
      ],
      avanzado: [
        q("Efecto invernadero", "Los gases atrapan el calor del planeta.", "¿Qué gas contribuye más al efecto invernadero?", ["Oxígeno", "Hidrógeno", "Dióxido de carbono", "Nitrógeno"], 2),
        m("Acción y efecto", "Cada acción tiene consecuencia.", "Une cada acción con su efecto",
          [{ left: "Plantar árboles", right: "Más oxígeno" }, { left: "Contaminar ríos", right: "Peces enfermos" }, { left: "Usar energía solar", right: "Menos contaminación" }, { left: "Quemar basura", right: "Aire sucio" }]),
        d("Energía limpia o contaminante", "Algunas energías cuidan el planeta.", "Arrastra cada fuente de energía",
          [{ id: "lim", label: "Limpia", emoji: "🌱" }, { id: "con", label: "Contaminante", emoji: "🏭" }],
          [{ id: "i1", label: "Solar", bucket: "lim" }, { id: "i2", label: "Carbón", bucket: "con" }, { id: "i3", label: "Eólica", bucket: "lim" }, { id: "i4", label: "Petróleo", bucket: "con" }, { id: "i5", label: "Hidráulica", bucket: "lim" }, { id: "i6", label: "Gas natural", bucket: "con" }]),
      ],
      experto: [
        q("Biodiversidad", "Cuantas más especies, más sano el ecosistema.", "¿Qué significa biodiversidad?", ["Muchas montañas", "Variedad de seres vivos", "Cantidad de agua", "Tipo de suelo"], 1),
        q("Huella de carbono", "Cada acción deja una marca.", "¿Qué reduce más la huella de carbono?", ["Usar el coche siempre", "Comer más carne", "Usar transporte público", "Comprar ropa nueva cada semana"], 2),
        m("Problema y solución", "Cada problema ambiental tiene solución.", "Une cada problema con su solución",
          [{ left: "Deforestación", right: "Reforestar" }, { left: "Contaminación marina", right: "Reducir plásticos" }, { left: "Calentamiento global", right: "Energías renovables" }, { left: "Extinción de especies", right: "Crear reservas naturales" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("nt-c4", "Ríos y océanos", "El agua que une todo.", {
      inicial: [
        v("¿Qué es un río?", "El río corre hacia el mar 🌊", "¿Cuál es un río?",
          [{ emoji: "🏔️", label: "Montaña" }, { emoji: "🌊", label: "Río" }, { emoji: "🌵", label: "Desierto" }, { emoji: "🌲", label: "Bosque" }], 1),
        q("Agua dulce o salada", "El mar es salado, el río es dulce.", "¿Dónde hay agua dulce?", ["En el océano", "En el río", "En el mar", "En la playa"], 1),
        m("Animal y su hogar acuático", "Cada ser tiene su agua.", "Une cada animal con su hogar",
          [{ left: "Trucha", right: "Río" }, { left: "Tiburón", right: "Océano" }, { left: "Hipopótamo", right: "Lago" }, { left: "Cangrejo de río", right: "Río" }]),
      ],
      avanzado: [
        q("Ciclo del agua", "El agua viaja sin parar.", "¿Qué pasa cuando el sol calienta el agua del mar?", ["Se congela", "Se evapora", "Se vuelve dulce", "Desaparece"], 1),
        d("Agua dulce o salada", "No toda el agua es igual.", "Arrastra cada elemento",
          [{ id: "dulce", label: "Agua dulce", emoji: "💧" }, { id: "salada", label: "Agua salada", emoji: "🌊" }],
          [{ id: "i1", label: "Lago de montaña", bucket: "dulce" }, { id: "i2", label: "Océano Pacífico", bucket: "salada" }, { id: "i3", label: "Río Amazonas", bucket: "dulce" }, { id: "i4", label: "Mar Mediterráneo", bucket: "salada" }, { id: "i5", label: "Glaciar", bucket: "dulce" }, { id: "i6", label: "Mar Muerto", bucket: "salada" }]),
        q("Profundidad del océano", "El fondo del mar guarda secretos.", "¿Cómo se llama la zona más profunda del océano?", ["Zona litoral", "Zona abisal", "Zona de mareas", "Zona costera"], 1),
      ],
      experto: [
        q("Corrientes marinas", "El océano también se mueve.", "¿Para qué sirven las corrientes marinas?", ["Para crear tormentas", "Para regular el clima del planeta", "Para elevar las montañas", "Para crear ríos"], 1),
        m("Ecosistema acuático", "Cada zona tiene su comunidad.", "Une cada ecosistema con su característica",
          [{ left: "Arrecife de coral", right: "Gran biodiversidad" }, { left: "Zona abisal", right: "Sin luz solar" }, { left: "Estuario", right: "Mezcla de agua dulce y salada" }, { left: "Marisma", right: "Zona costera pantanosa" }]),
        q("Amenaza oceánica", "Los océanos están en peligro.", "¿Cuál es la mayor amenaza para los arrecifes de coral?", ["El viento", "El calentamiento del agua", "La luna", "Las mareas"], 1),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("nt-summit", "Cumbre del Sendero", "Conviértete en guardián de la naturaleza.", {
      inicial: [
        q("Reto del bosque", "Recuerda lo que viste.", "¿Qué animal vive en el agua?", ["Águila", "Pez", "Zorro", "Ratón"], 1),
        q("Reto verde", "Las plantas son vida.", "¿Qué parte de la planta bebe agua?", ["Hoja", "Flor", "Raíz", "Tallo"], 2),
        q("Reto del planeta", "Cada gesto cuenta.", "¿Cuál es la mejor acción para el planeta?", ["Reciclar", "Tirar al suelo", "Quemar plástico", "Cortar árboles"], 0),
      ],
      avanzado: [
        q("Reto animal", "La vida salvaje nos necesita.", "¿Qué es una cadena alimenticia?", ["Una cadena de metal", "La relación entre depredadores y presas", "Un tipo de ecosistema", "Una especie en peligro"], 1),
        m("Reto del ciclo", "El agua no descansa.", "Une cada fase del ciclo del agua con su descripción",
          [{ left: "Evaporación", right: "El agua sube al cielo" }, { left: "Condensación", right: "Se forman nubes" }, { left: "Precipitación", right: "Llueve o nieva" }, { left: "Infiltración", right: "El agua entra al suelo" }]),
        q("Reto energético", "El planeta tiene soluciones.", "¿Cuál es una energía renovable?", ["Carbón", "Petróleo", "Solar", "Gas"], 2),
      ],
      experto: [
        q("Reto ecosistema", "Todo está conectado.", "¿Qué ocurre si desaparecen las abejas?", ["Nada importante", "Menos polinización y menos frutos", "Más flores", "El clima mejora"], 1),
        q("Reto huella", "Mide tu impacto.", "¿Qué dieta tiene menor huella de carbono?", ["Rica en carne de res", "Basada en plantas", "Solo pescado", "Solo lácteos"], 1),
        m("Reto conservación", "Proteger requiere conocimiento.", "Une cada espacio protegido con su objetivo",
          [{ left: "Parque nacional", right: "Proteger ecosistemas" }, { left: "Reserva marina", right: "Proteger vida oceánica" }, { left: "Corredor biológico", right: "Conectar hábitats" }, { left: "Zona de exclusión", right: "Evitar actividad humana" }]),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// MOUNTAIN 4 — MIRADOR CREATIVO (COMPLETE)
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
        q("Color secundario", "Se hace mezclando dos primarios.", "¿Cuál es un color secundario?", ["Rojo", "Azul", "Verde", "Amarillo"], 2),
      ],
      experto: [
        m("Mezcla experta", "Cada mezcla, un nuevo color.", "Une cada mezcla con su resultado",
          [{ left: "Rojo + Azul", right: "Morado" }, { left: "Rojo + Amarillo", right: "Naranja" }, { left: "Azul + Amarillo", right: "Verde" }, { left: "Blanco + Negro", right: "Gris" }]),
        q("Color complementario", "Están en lados opuestos del círculo cromático.", "¿Cuál es el complementario del rojo?", ["Azul", "Verde", "Amarillo", "Morado"], 1),
        q("Tono y matiz", "Aclarar = añadir blanco.", "¿Cómo se aclara un color?", ["Añadiendo negro", "Añadiendo blanco", "Añadiendo agua", "Mezclando todos"], 1),
      ],
    }, { status: "available", completion: 0 }),

    tiered("cm-c2", "Formas y figuras", "Líneas, curvas y patrones que construyen el mundo.", {
      inicial: [
        v("¿Qué forma es?", "Las formas están en todas partes 🔷", "¿Cuál es un círculo?",
          [{ emoji: "🔴", label: "Círculo" }, { emoji: "🔷", label: "Rombo" }, { emoji: "⬛", label: "Cuadrado" }, { emoji: "🔺", label: "Triángulo" }], 0),
        q("Lados del triángulo", "Tri = tres.", "¿Cuántos lados tiene un triángulo?", ["2", "3", "4", "5"], 1),
        m("Une forma y objeto", "Cada objeto esconde una forma.", "Une cada forma con un objeto del mundo real",
          [{ left: "Círculo", right: "Rueda" }, { left: "Cuadrado", right: "Ventana" }, { left: "Triángulo", right: "Pizza" }, { left: "Rectángulo", right: "Puerta" }]),
      ],
      avanzado: [
        q("Polígonos", "Polígono = figura cerrada con líneas rectas.", "¿Cuántos lados tiene un hexágono?", ["4", "5", "6", "8"], 2),
        d("Figura plana o sólida", "Plana = 2D. Sólida = 3D.", "Arrastra cada figura",
          [{ id: "plan", label: "Plana (2D)", emoji: "📄" }, { id: "sol", label: "Sólida (3D)", emoji: "📦" }],
          [{ id: "i1", label: "Círculo", bucket: "plan" }, { id: "i2", label: "Esfera", bucket: "sol" }, { id: "i3", label: "Cuadrado", bucket: "plan" }, { id: "i4", label: "Cubo", bucket: "sol" }, { id: "i5", label: "Triángulo", bucket: "plan" }, { id: "i6", label: "Pirámide", bucket: "sol" }]),
        q("Simetría", "Simétrico = igual a ambos lados.", "¿Cuál tiene simetría?", ["Letra S", "Letra A", "Letra Z", "Letra R"], 1),
      ],
      experto: [
        q("Área del cuadrado", "Área = lado × lado.", "¿Cuál es el área de un cuadrado de lado 5?", ["10", "20", "25", "15"], 2),
        m("Figura y propiedad", "Cada forma tiene sus reglas.", "Une cada figura con su propiedad",
          [{ left: "Círculo", right: "Sin lados rectos" }, { left: "Cuadrado", right: "4 lados iguales" }, { left: "Triángulo equilátero", right: "3 lados iguales" }, { left: "Rectángulo", right: "4 ángulos rectos" }]),
        d("Ángulo agudo, recto u obtuso", "Agudo < 90°, Recto = 90°, Obtuso > 90°.", "Arrastra cada ángulo",
          [{ id: "ag", label: "Agudo", emoji: "📐" }, { id: "rec", label: "Recto", emoji: "⬜" }, { id: "ob", label: "Obtuso", emoji: "📏" }],
          [{ id: "i1", label: "45°", bucket: "ag" }, { id: "i2", label: "90°", bucket: "rec" }, { id: "i3", label: "120°", bucket: "ob" }, { id: "i4", label: "30°", bucket: "ag" }, { id: "i5", label: "150°", bucket: "ob" }, { id: "i6", label: "180°", bucket: "ob" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("cm-c3", "Cuento mío", "Inventa historias paso a paso.", {
      inicial: [
        q("Partes del cuento", "Todo cuento tiene inicio, nudo y desenlace.", "¿Qué va primero en un cuento?", ["El final", "El nudo", "El inicio", "El personaje"], 2),
        m("Une parte con su momento", "Cada parte del cuento tiene su momento.", "Une cada parte con lo que pasa",
          [{ left: "Inicio", right: "Presentamos a los personajes" }, { left: "Nudo", right: "Ocurre el problema" }, { left: "Desenlace", right: "El problema se resuelve" }, { left: "Moraleja", right: "Lo que aprendemos" }]),
        v("¿Quién es el protagonista?", "El protagonista es el personaje principal 🦸", "¿Cuál suele ser el protagonista en un cuento?",
          [{ emoji: "🧙", label: "Mago" }, { emoji: "🦸", label: "Héroe" }, { emoji: "🐉", label: "Dragón" }, { emoji: "🌲", label: "Árbol" }], 1),
      ],
      avanzado: [
        q("Narrador", "El narrador cuenta la historia.", "¿Cómo cuenta la historia un narrador en primera persona?", ["Dice 'él hizo'", "Dice 'yo hice'", "Dice 'tú hiciste'", "No habla"], 1),
        d("Tipo de personaje", "Cada personaje tiene su papel.", "Arrastra cada personaje a su tipo",
          [{ id: "prot", label: "Protagonista", emoji: "🦸" }, { id: "ant", label: "Antagonista", emoji: "🦹" }, { id: "sec", label: "Secundario", emoji: "🧑" }],
          [{ id: "i1", label: "El héroe valiente", bucket: "prot" }, { id: "i2", label: "El villano malvado", bucket: "ant" }, { id: "i3", label: "El amigo fiel", bucket: "sec" }, { id: "i4", label: "La bruja maliciosa", bucket: "ant" }, { id: "i5", label: "El explorador", bucket: "prot" }, { id: "i6", label: "El guarda del bosque", bucket: "sec" }]),
        q("Descripción", "Describir es pintar con palabras.", "¿Qué hace una descripción?", ["Resume el final", "Presenta un problema", "Explica cómo es algo", "Indica el tiempo"], 2),
      ],
      experto: [
        q("Metáfora", "Decir que algo ES otra cosa.", '"Sus ojos eran dos estrellas" es una…', ["Comparación", "Metáfora", "Pregunta", "Descripción"], 1),
        m("Recurso literario", "Cada figura da color al texto.", "Une cada ejemplo con su recurso",
          [{ left: '"Rápido como el viento"', right: "Símil" }, { left: '"El mar rugía"', right: "Personificación" }, { left: '"Llegó, vio, venció"', right: "Enumeración" }, { left: '"Sus ojos son luceros"', right: "Metáfora" }]),
        q("Punto de vista", "La historia cambia según quien la cuenta.", "¿Qué cambia al contar una historia en tercera persona?", ["El lugar", "El tiempo", "El narrador habla de 'él' o 'ella'", "El número de personajes"], 2),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("cm-c4", "Música y ritmo", "Sonidos que cuentan historias.", {
      inicial: [
        v("¿Qué hace ruido?", "La música tiene instrumentos 🎵", "¿Cuál hace música?",
          [{ emoji: "🎸", label: "Guitarra" }, { emoji: "🪨", label: "Piedra" }, { emoji: "🌵", label: "Cactus" }, { emoji: "🥾", label: "Bota" }], 0),
        m("Instrumento y familia", "Los instrumentos se agrupan por cómo suenan.", "Une cada instrumento con su familia",
          [{ left: "Guitarra", right: "Cuerda" }, { left: "Flauta", right: "Viento" }, { left: "Tambor", right: "Percusión" }, { left: "Violín", right: "Cuerda" }]),
        q("El ritmo", "El ritmo es el pulso de la música.", "¿Qué es el ritmo en música?", ["El volumen", "El pulso y la repetición de sonidos", "El instrumento", "La letra"], 1),
      ],
      avanzado: [
        q("Notas musicales", "Do, Re, Mi, Fa, Sol, La, Si.", "¿Cuántas notas tiene la escala musical?", ["5", "6", "7", "8"], 2),
        d("Instrumento de viento, cuerda o percusión", "Cada familia suena diferente.", "Arrastra cada instrumento",
          [{ id: "viento", label: "Viento", emoji: "💨" }, { id: "cuerda", label: "Cuerda", emoji: "🎸" }, { id: "perc", label: "Percusión", emoji: "🥁" }],
          [{ id: "i1", label: "Trompeta", bucket: "viento" }, { id: "i2", label: "Piano", bucket: "cuerda" }, { id: "i3", label: "Batería", bucket: "perc" }, { id: "i4", label: "Saxofón", bucket: "viento" }, { id: "i5", label: "Arpa", bucket: "cuerda" }, { id: "i6", label: "Maracas", bucket: "perc" }]),
        q("Tempo", "El tempo marca la velocidad de la música.", "¿Qué significa 'Allegro' en música?", ["Lento", "Muy lento", "Rápido", "Sin ritmo"], 2),
      ],
      experto: [
        q("Compás", "El compás organiza el ritmo.", "¿Qué indica el compás de 4/4?", ["4 notas iguales", "4 tiempos por cada compás", "4 instrumentos", "4 canciones"], 1),
        m("Género y característica", "Cada género tiene su sello.", "Une cada género con su característica",
          [{ left: "Jazz", right: "Improvisación y sincopado" }, { left: "Flamenco", right: "Guitarra y palmas" }, { left: "Clásica", right: "Orquesta y partitura" }, { left: "Rock", right: "Guitarra eléctrica" }]),
        q("Armonía", "Sonidos que suenan juntos y bien.", "¿Qué es la armonía en música?", ["La letra de una canción", "La combinación agradable de notas simultáneas", "El volumen máximo", "El tempo más lento"], 1),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("cm-summit", "Cumbre del Mirador", "Tu obra más alta.", {
      inicial: [
        q("Reto del color", "¿Recuerdas las mezclas?", "¿Qué obtienes al mezclar rojo y azul?", ["Verde", "Naranja", "Morado", "Marrón"], 2),
        q("Reto de formas", "Las figuras están en todas partes.", "¿Cuántos lados tiene un cuadrado?", ["3", "4", "5", "6"], 1),
        q("Reto del cuento", "Todo cuento tiene su orden.", "¿Qué parte del cuento presenta el problema?", ["El inicio", "El nudo", "El desenlace", "La moraleja"], 1),
      ],
      avanzado: [
        q("Reto cromático", "El círculo cromático no miente.", "¿Cuál es el complementario del azul?", ["Verde", "Morado", "Naranja", "Rojo"], 2),
        m("Reto creativo", "Arte en todas sus formas.", "Une cada disciplina con su herramienta",
          [{ left: "Pintura", right: "Pincel" }, { left: "Escultura", right: "Cincel" }, { left: "Música", right: "Partitura" }, { left: "Literatura", right: "Pluma" }]),
        q("Reto narrativo", "El narrador da vida a la historia.", "¿Qué es un símil?", ["Una metáfora directa", "Una comparación con 'como'", "Un personaje secundario", "El punto de vista"], 1),
      ],
      experto: [
        q("Reto geométrico", "Ángulos y medidas.", "¿Cuántos grados suman los ángulos internos de un triángulo?", ["90°", "180°", "270°", "360°"], 1),
        q("Reto musical", "La teoría hace al músico.", "¿Cuántas corcheas equivalen a una negra?", ["1", "2", "3", "4"], 1),
        m("Reto de recursos", "El lenguaje tiene muchos colores.", "Une cada recurso con su ejemplo",
          [{ left: "Metáfora", right: '"La vida es un sueño"' }, { left: "Hipérbole", right: '"Tengo mil cosas que hacer"' }, { left: "Personificación", right: '"El viento susurraba"' }, { left: "Aliteración", right: '"Tres tristes tigres"' }]),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// MOUNTAIN 5 — PASO DE LA LÓGICA (COMPLETE)
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
        q("El intruso", "Uno no es como los demás.", "¿Cuál NO es una fruta?", ["🍎 Manzana", "🍐 Pera", "🥕 Zanahoria", "🍌 Plátano"], 2),
        m("Une figura y sombra", "Las sombras imitan la forma.", "Une cada animal con su característica",
          [{ left: "🐘 Elefante", right: "Grande y con trompa" }, { left: "🐭 Ratón", right: "Pequeño y rápido" }, { left: "🦒 Jirafa", right: "Alta y con manchas" }, { left: "🐢 Tortuga", right: "Lenta con caparazón" }]),
      ],
      avanzado: [
        q("Adivinanza lógica", "Lee con calma.", "Ana es mayor que Ben. Ben es mayor que Coco. ¿Quién es el más joven?", ["Ana", "Ben", "Coco", "Ninguno"], 2),
        d("Causa o efecto", "La causa pasa antes.", "Arrastra cada hecho",
          [{ id: "cau", label: "Causa", emoji: "🌧️" }, { id: "ef", label: "Efecto", emoji: "💧" }],
          [{ id: "i1", label: "Llueve mucho", bucket: "cau" }, { id: "i2", label: "El suelo se moja", bucket: "ef" }, { id: "i3", label: "Como mucho", bucket: "cau" }, { id: "i4", label: "Me lleno", bucket: "ef" }]),
        q("Patrón con figuras", "Busca qué se repite.", "¿Qué falta? ⬛⬜⬛⬜__⬜", ["⬛", "⬜", "🔴", "Nada"], 0),
      ],
      experto: [
        q("Si... entonces...", "Razona en cadena.", "Si todos los osos duermen en invierno y Bo es un oso, entonces…", ["Bo come", "Bo duerme", "Bo corre", "No sabemos"], 1),
        q("Regla numérica", "Encuentra la regla.", "Si 2→4, 3→9, 4→16, entonces 5→?", ["10", "20", "25", "30"], 2),
        m("Enigma y respuesta", "Piensa antes de unir.", "Une cada enigma con su respuesta",
          [{ left: "Tiene patas pero no anda", right: "Mesa" }, { left: "Cae pero no se rompe", right: "Noche" }, { left: "Cuanto más quitas, más grande es", right: "Hoyo" }, { left: "Sin alas pero vuela", right: "Tiempo" }]),
      ],
    }, { status: "available", completion: 0 }),

    tiered("lg-c2", "Secuencias", "Lo que va antes y lo que va después.", {
      inicial: [
        q("¿Qué va después?", "Las secuencias tienen orden.", "Lunes, Martes, Miércoles, __", ["Viernes", "Jueves", "Sábado", "Domingo"], 1),
        m("Ordena las estaciones", "El año tiene cuatro estaciones.", "Une cada estación con lo que trae",
          [{ left: "Primavera", right: "Flores y lluvia" }, { left: "Verano", right: "Calor y playa" }, { left: "Otoño", right: "Hojas que caen" }, { left: "Invierno", right: "Frío y nieve" }]),
        v("¿Qué va primero?", "El orden importa 📋", "¿Qué haces primero para lavarte los dientes?",
          [{ emoji: "🦷", label: "Cepillar" }, { emoji: "💧", label: "Mojar el cepillo" }, { emoji: "🪥", label: "Coger el cepillo" }, { emoji: "🚰", label: "Enjuagar" }], 2),
      ],
      avanzado: [
        d("Ordena la historia", "Cada evento tiene su momento.", "Arrastra en el orden correcto",
          [{ id: "p1", label: "1º", emoji: "1️⃣" }, { id: "p2", label: "2º", emoji: "2️⃣" }, { id: "p3", label: "3º", emoji: "3️⃣" }, { id: "p4", label: "4º", emoji: "4️⃣" }],
          [{ id: "i1", label: "Plantar la semilla", bucket: "p1" }, { id: "i2", label: "Regar cada día", bucket: "p2" }, { id: "i3", label: "Brotar el tallo", bucket: "p3" }, { id: "i4", label: "Florecer", bucket: "p4" }]),
        q("Número en la secuencia", "Busca la regla.", "1, 1, 2, 3, 5, 8, __", ["10", "11", "13", "12"], 2),
        m("Evento histórico en orden", "El tiempo tiene su fila.", "Ordena del más antiguo al más reciente",
          [{ left: "1º", right: "Invención de la escritura" }, { left: "2º", right: "Construcción de las pirámides" }, { left: "3º", right: "Llegada del hombre a la luna" }, { left: "4º", right: "Creación de internet" }]),
      ],
      experto: [
        q("Progresión geométrica", "Se multiplica en vez de sumar.", "2, 6, 18, 54, __", ["72", "108", "162", "216"], 1),
        q("Deducción en cadena", "Usa todo lo que sabes.", "A es más alto que B. C es más bajo que B. D es igual que A. ¿Quién es el más bajo?", ["A", "B", "C", "D"], 2),
        d("Tipo de secuencia", "Cada secuencia sigue su regla.", "Arrastra cada secuencia a su tipo",
          [{ id: "arit", label: "Aritmética (+constante)", emoji: "➕" }, { id: "geo", label: "Geométrica (×constante)", emoji: "✖️" }],
          [{ id: "i1", label: "2, 4, 6, 8", bucket: "arit" }, { id: "i2", label: "3, 9, 27, 81", bucket: "geo" }, { id: "i3", label: "10, 20, 30, 40", bucket: "arit" }, { id: "i4", label: "2, 4, 8, 16", bucket: "geo" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("lg-c3", "Categorías", "Agrupar por lo que comparten.", {
      inicial: [
        d("Frutas o verduras", "Cada alimento tiene su grupo.", "Arrastra cada alimento",
          [{ id: "fru", label: "Fruta", emoji: "🍎" }, { id: "ver", label: "Verdura", emoji: "🥦" }],
          [{ id: "i1", label: "Manzana", bucket: "fru" }, { id: "i2", label: "Zanahoria", bucket: "ver" }, { id: "i3", label: "Naranja", bucket: "fru" }, { id: "i4", label: "Brócoli", bucket: "ver" }, { id: "i5", label: "Uva", bucket: "fru" }, { id: "i6", label: "Lechuga", bucket: "ver" }]),
        q("¿Qué tienen en común?", "Busca lo que comparten.", "¿Qué tienen en común perro, gato y caballo?", ["Vuelan", "Son mamíferos", "Viven en el agua", "Son insectos"], 1),
        m("Une con su categoría", "Cada cosa pertenece a algún grupo.", "Une cada cosa con su categoría",
          [{ left: "Guitarra", right: "Instrumento" }, { left: "Rosa", right: "Planta" }, { left: "Tiburón", right: "Animal" }, { left: "Flauta", right: "Instrumento" }]),
      ],
      avanzado: [
        q("El que no encaja", "Busca al intruso.", "¿Cuál NO pertenece al grupo? Plutón, Júpiter, Saturno, Luna", ["Plutón", "Júpiter", "Saturno", "Luna"], 3),
        d("Seres vivos o no vivos", "Los seres vivos nacen, crecen y mueren.", "Arrastra cada elemento",
          [{ id: "vivo", label: "Ser vivo", emoji: "🌱" }, { id: "novivo", label: "No vivo", emoji: "🪨" }],
          [{ id: "i1", label: "Perro", bucket: "vivo" }, { id: "i2", label: "Piedra", bucket: "novivo" }, { id: "i3", label: "Árbol", bucket: "vivo" }, { id: "i4", label: "Nube", bucket: "novivo" }, { id: "i5", label: "Hongo", bucket: "vivo" }, { id: "i6", label: "Agua", bucket: "novivo" }]),
        q("Subconjunto", "Dentro de un grupo puede haber grupos más pequeños.", "Los poodles son un subconjunto de…", ["Gatos", "Perros", "Aves", "Peces"], 1),
      ],
      experto: [
        q("Intersección", "Algunos elementos comparten dos categorías.", "¿Cuál es a la vez mamífero y marino?", ["Tiburón", "Pingüino", "Delfín", "Pulpo"], 2),
        m("Jerarquía de categorías", "Los grupos tienen niveles.", "Une cada nivel de la jerarquía",
          [{ left: "Animal", right: "Categoría general" }, { left: "Mamífero", right: "Subcategoría" }, { left: "Perro", right: "Especie" }, { left: "Poodle", right: "Raza" }]),
        d("Clasifica por dos criterios", "Algunos grupos comparten dos rasgos.", "Arrastra cada animal",
          [{ id: "volmam", label: "Vuela y es mamífero", emoji: "🦇" }, { id: "volnomam", label: "Vuela, no mamífero", emoji: "🐦" }, { id: "noval", label: "No vuela", emoji: "🐘" }],
          [{ id: "i1", label: "Murciélago", bucket: "volmam" }, { id: "i2", label: "Águila", bucket: "volnomam" }, { id: "i3", label: "Elefante", bucket: "noval" }, { id: "i4", label: "Loro", bucket: "volnomam" }, { id: "i5", label: "Pingüino", bucket: "noval" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("lg-c4", "Acertijos", "Pequeños retos para crecer.", {
      inicial: [
        q("Acertijo fácil", "Piensa despacio.", "Tengo manos pero no puedo aplaudir. ¿Qué soy?", ["Un guante", "Un reloj", "Un árbol", "Una puerta"], 1),
        q("Acertijo de animales", "El animal habla en acertijo.", "Vuelo sin alas, lloro sin ojos. Cuando llego, el campo festeja. ¿Qué soy?", ["El viento", "La lluvia", "El sol", "La nube"], 1),
        v("Acertijo visual", "La imagen da la pista 🔍", "Soy redondo, ilumino de noche y cambio de forma. ¿Qué soy?",
          [{ emoji: "☀️", label: "Sol" }, { emoji: "🌙", label: "Luna" }, { emoji: "⭐", label: "Estrella" }, { emoji: "💡", label: "Bombilla" }], 1),
      ],
      avanzado: [
        q("Acertijo numérico", "Los números también son acertijos.", "Soy un número. Si me doblas, obtienes 18. ¿Quién soy?", ["7", "8", "9", "10"], 2),
        q("Acertijo lógico", "Razona paso a paso.", "En una carrera, si adelantas al segundo, ¿en qué posición quedas?", ["Primero", "Segundo", "Tercero", "Último"], 1),
        m("Une acertijo con respuesta", "Cada enigma tiene su llave.", "Une cada acertijo con su respuesta",
          [{ left: "Cuanto más seca, más moja", right: "Toalla" }, { left: "Tiene dientes pero no muerde", right: "Peine" }, { left: "Habla sin boca", right: "Eco" }, { left: "Va por el río sin moverse", right: "Orilla" }]),
      ],
      experto: [
        q("Acertijo de tiempo", "El tiempo también es un misterio.", "El padre de mi hijo no es mi marido. ¿Quién es?", ["Mi hermano", "Mi padre", "Yo misma", "Mi tío"], 2),
        q("Acertijo de lógica pura", "Piensa al revés si hace falta.", "Un hombre vive en el piso 30. Baja siempre en ascensor pero sube andando hasta el piso 15. ¿Por qué?", ["Le gusta caminar", "El ascensor no sube", "Es muy bajo y no alcanza el botón 30", "Ahorra energía"], 2),
        d("Tipo de razonamiento", "Cada acertijo usa un tipo.", "Arrastra cada acertijo a su tipo de razonamiento",
          [{ id: "ded", label: "Deductivo", emoji: "🔍" }, { id: "ind", label: "Inductivo", emoji: "📊" }, { id: "lat", label: "Lateral", emoji: "🔄" }],
          [{ id: "i1", label: "Si todos los A son B y X es A, entonces X es B", bucket: "ded" }, { id: "i2", label: "He visto 10 cuervos negros, probablemente todos lo son", bucket: "ind" }, { id: "i3", label: "El hombre del ascensor que es bajo", bucket: "lat" }]),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("lg-summit", "Cumbre de la Lógica", "Pon tu mente a prueba.", {
      inicial: [
        q("Reto de patrón", "El ritmo no miente.", "¿Qué sigue? 🔴🔵🟢🔴🔵__", ["🔴", "🔵", "🟢", "🟡"], 2),
        q("Reto del intruso", "Uno no encaja.", "¿Cuál NO es un planeta?", ["Marte", "Luna", "Saturno", "Júpiter"], 1),
        q("Reto de acertijo", "Piensa con calma.", "¿Qué cosa tiene un ojo pero no puede ver?", ["Un pez", "Una aguja", "Un cíclope", "Un telescopio"], 1),
      ],
      avanzado: [
        q("Reto de secuencia", "Busca la regla oculta.", "2, 3, 5, 7, 11, __", ["12", "13", "14", "15"], 1),
        q("Reto de deducción", "Razona en cadena.", "Si A > B y B > C, entonces…", ["C > A", "A > C", "B > A", "C = A"], 1),
        m("Reto de categorías", "Cada cosa en su lugar.", "Une cada elemento con su categoría correcta",
          [{ left: "Ecuación", right: "Matemáticas" }, { left: "Metáfora", right: "Literatura" }, { left: "Fotosíntesis", right: "Biología" }, { left: "Democracia", right: "Ciencias sociales" }]),
      ],
      experto: [
        q("Reto experto de acertijo", "El más difícil.", "Cuanto más grande, menos ves. ¿Qué soy?", ["Un elefante", "La oscuridad", "Un agujero", "El universo"], 1),
        q("Reto de lógica formal", "La verdad no negocia.", "Si 'todos los gatos son mamíferos' y 'Felix es un gato', ¿qué es verdad?", ["Felix vuela", "Felix es mamífero", "Felix es reptil", "No sabemos"], 1),
        m("Reto de razonamiento", "Cada tipo de razonamiento tiene su lugar.", "Une cada ejemplo con su tipo",
          [{ left: "Todos los hombres son mortales, Sócrates es hombre, luego...", right: "Deductivo" }, { left: "He visto 100 cisnes blancos, probablemente todos lo son", right: "Inductivo" }, { left: "¿Cómo cruzar el río con el lobo, la cabra y la col?", right: "Lateral" }, { left: "Si p entonces q; p es verdad; luego q", right: "Deductivo" }]),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// MOUNTAIN 6 — REFUGIO EMOCIONAL (COMPLETE)
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
        q("¿Qué hago si…?", "Pensar antes de actuar.", "Si un amigo está triste, lo mejor es…", ["Reírme de él", "Preguntarle si está bien", "Irme sin decir nada", "Gritar"], 1),
        d("Emoción agradable o incómoda", "Todas las emociones son válidas.", "Arrastra cada emoción",
          [{ id: "ag", label: "Agradable", emoji: "🌞" }, { id: "in", label: "Incómoda", emoji: "🌧️" }],
          [{ id: "i1", label: "Alegría", bucket: "ag" }, { id: "i2", label: "Miedo", bucket: "in" }, { id: "i3", label: "Calma", bucket: "ag" }, { id: "i4", label: "Enfado", bucket: "in" }, { id: "i5", label: "Cariño", bucket: "ag" }, { id: "i6", label: "Vergüenza", bucket: "in" }]),
        q("Calmarse", "Respirar ayuda.", "¿Qué ayuda a calmarse cuando hay enfado?", ["Romper algo", "Respirar profundo", "Gritar más fuerte", "Esconderse"], 1),
      ],
      experto: [
        q("Empatía", "Ponerse en el lugar de otro.", "Empatizar significa…", ["Reírse de alguien", "Sentir lo que siente otro", "Hacer siempre lo que quieras", "Estar en silencio"], 1),
        q("Resolver conflicto", "Hablar es la primera escalera.", "Si discutes con un amigo, primero…", ["Hablar tranquilamente", "Pegar", "Terminar la amistad", "Esconderte"], 0),
        m("Une situación con emoción", "Cada momento trae una emoción.", "Une cada situación",
          [{ left: "Examen sorpresa", right: "Nervios" }, { left: "Ganar el partido", right: "Alegría" }, { left: "Perder un juguete", right: "Tristeza" }, { left: "Caja sin abrir", right: "Curiosidad" }]),
      ],
    }, { status: "available", completion: 0 }),

    tiered("sr-c2", "Calmar la tormenta", "Trucos para los días difíciles.", {
      inicial: [
        q("Respirar ayuda", "Cuando estás nervioso, respira.", "¿Qué puedes hacer cuando te sientes muy enfadado?", ["Gritar muy fuerte", "Respirar profundo y contar hasta 10", "Tirar cosas", "Correr sin parar"], 1),
        m("Une emoción con su truco", "Cada emoción tiene su remedio.", "Une cada emoción con lo que ayuda",
          [{ left: "Enfado", right: "Respirar hondo" }, { left: "Tristeza", right: "Hablar con alguien" }, { left: "Nervios", right: "Contar hasta 10" }, { left: "Miedo", right: "Encender la luz" }]),
        v("¿Qué te calma?", "Cada uno tiene su refugio 🏠", "¿Cuál de estas cosas te puede calmar?",
          [{ emoji: "🎵", label: "Música suave" }, { emoji: "🔥", label: "Fuego" }, { emoji: "⚡", label: "Ruido fuerte" }, { emoji: "🌪️", label: "Tormenta" }], 0),
      ],
      avanzado: [
        q("Regulación emocional", "Podemos aprender a manejar cómo nos sentimos.", "¿Qué significa regular las emociones?", ["No sentir nada", "Aprender a manejar cómo nos sentimos", "Esconder los sentimientos", "Llorar siempre"], 1),
        d("Estrategia útil o no útil", "No todas las reacciones ayudan.", "Arrastra cada reacción",
          [{ id: "util", label: "Útil", emoji: "✅" }, { id: "noUtil", label: "No útil", emoji: "❌" }],
          [{ id: "i1", label: "Respirar profundo", bucket: "util" }, { id: "i2", label: "Gritar a todos", bucket: "noUtil" }, { id: "i3", label: "Dar un paseo", bucket: "util" }, { id: "i4", label: "Romper cosas", bucket: "noUtil" }, { id: "i5", label: "Hablar con un adulto", bucket: "util" }, { id: "i6", label: "Ignorar el problema siempre", bucket: "noUtil" }]),
        q("El cuerpo y las emociones", "El cuerpo también siente.", "¿Qué puede pasar en el cuerpo cuando tienes miedo?", ["Te creces más", "Se te acelera el corazón", "Te vuelves invisible", "Te da hambre siempre"], 1),
      ],
      experto: [
        q("Mindfulness", "Estar presente en el momento.", "¿Qué es el mindfulness?", ["Un deporte extremo", "Una técnica de atención plena al momento presente", "Un tipo de música", "Una forma de dormir"], 1),
        m("Técnica y su efecto", "Cada técnica tiene su resultado.", "Une cada técnica con su efecto",
          [{ left: "Respiración diafragmática", right: "Calma el sistema nervioso" }, { left: "Visualización positiva", right: "Reduce la ansiedad" }, { left: "Ejercicio físico", right: "Libera endorfinas" }, { left: "Escritura emocional", right: "Procesa los sentimientos" }]),
        q("Inteligencia emocional", "Reconocer y gestionar emociones propias y ajenas.", "¿Qué es la inteligencia emocional?", ["Ser muy listo en matemáticas", "Gestionar bien las emociones propias y ajenas", "No sentir emociones", "Tener muchos amigos"], 1),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("sr-c3", "Compartir el camino", "Convivir con otros.", {
      inicial: [
        q("¿Qué es un amigo?", "Los amigos se cuidan.", "¿Qué hace un buen amigo?", ["Te ignora", "Te ayuda cuando lo necesitas", "Te quita tus cosas", "Siempre gana"], 1),
        m("Acción amable o no amable", "Elegimos cómo tratar a los demás.", "Une cada acción con si es amable o no",
          [{ left: "Prestar un juguete", right: "Amable" }, { left: "Empujar a alguien", right: "No amable" }, { left: "Escuchar cuando hablan", right: "Amable" }, { left: "Burlarse de un error", right: "No amable" }]),
        v("¿Cómo te sientes cuando te ayudan?", "Recibir ayuda es bonito 💛", "¿Cómo te sientes cuando alguien te ayuda?",
          [{ emoji: "😀", label: "Feliz" }, { emoji: "😡", label: "Enfadado" }, { emoji: "😴", label: "Aburrido" }, { emoji: "😱", label: "Asustado" }], 0),
      ],
      avanzado: [
        q("Escucha activa", "Escuchar es más que oír.", "¿Qué es escuchar activamente?", ["Oír con los oídos solamente", "Prestar atención completa a quien habla", "Hablar al mismo tiempo", "Pensar en otra cosa"], 1),
        d("Conducta prosocial o antisocial", "Algunas acciones unen, otras separan.", "Arrastra cada conducta",
          [{ id: "pro", label: "Prosocial", emoji: "🤝" }, { id: "anti", label: "Antisocial", emoji: "🚫" }],
          [{ id: "i1", label: "Ayudar a alguien que se cayó", bucket: "pro" }, { id: "i2", label: "Excluir a alguien del juego", bucket: "anti" }, { id: "i3", label: "Compartir la merienda", bucket: "pro" }, { id: "i4", label: "Mentir para no meterse en problemas", bucket: "anti" }, { id: "i5", label: "Defender a quien lo molestan", bucket: "pro" }, { id: "i6", label: "Ignorar cuando alguien llora", bucket: "anti" }]),
        q("Resolución de conflictos", "Los conflictos se pueden resolver bien.", "¿Cuál es el primer paso para resolver un conflicto?", ["Ganar la pelea", "Escuchar al otro y hablar tranquilo", "Ignorar el problema", "Pedir que otro decida"], 1),
      ],
      experto: [
        q("Asertividad", "Ni agresivo ni pasivo — en el medio.", "¿Qué es ser asertivo?", ["Hacer siempre lo que los demás quieren", "Imponer siempre tu voluntad", "Expresar lo que piensas con respeto", "No opinar nunca"], 2),
        m("Estilo de comunicación", "Cada estilo tiene consecuencias.", "Une cada estilo con su descripción",
          [{ left: "Asertivo", right: "Expresa con respeto y firmeza" }, { left: "Agresivo", right: "Impone sin considerar al otro" }, { left: "Pasivo", right: "Cede siempre sin expresarse" }, { left: "Pasivo-agresivo", right: "Expresa indirectamente el malestar" }]),
        q("Trabajo en equipo", "Juntos se llega más lejos.", "¿Qué hace que un equipo funcione bien?", ["Que uno mande y todos obedezcan", "Comunicación, respeto y objetivo común", "Que cada uno trabaje solo", "Que el más listo haga todo"], 1),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("sr-c4", "Pedir y dar ayuda", "Subimos mejor en grupo.", {
      inicial: [
        q("Pedir ayuda", "Pedir ayuda es valiente.", "¿Cuándo está bien pedir ayuda?", ["Nunca, hay que hacerlo solo", "Cuando no puedes resolver algo solo", "Solo si eres pequeño", "Cuando quieres molestar"], 1),
        v("¿A quién pides ayuda?", "Hay personas de confianza 🧡", "Si te sientes triste, ¿a quién puedes hablar?",
          [{ emoji: "👨‍👩‍👧", label: "Familia" }, { emoji: "🌵", label: "Un cactus" }, { emoji: "📺", label: "La tele" }, { emoji: "🪨", label: "Una piedra" }], 0),
        m("¿Ayudar o no ayudar?", "A veces la ayuda tiene límites.", "Une cada situación con la respuesta correcta",
          [{ left: "Un amigo llora solo", right: "Le pregunto qué le pasa" }, { left: "Alguien me pide hacer trampa", right: "Digo que no" }, { left: "Un compañero no entiende algo", right: "Se lo explico" }, { left: "Me piden que mienta", right: "Me niego con respeto" }]),
      ],
      avanzado: [
        q("Límites saludables", "Ayudar sí, pero sin perder tu bienestar.", "¿Qué es un límite saludable?", ["Nunca hablar con nadie", "Saber hasta dónde puedo ayudar sin hacerme daño", "Hacer siempre lo que me piden", "Ignorar a los demás"], 1),
        d("Pedir ayuda o resolver solo", "Saber cuándo pedir ayuda es una habilidad.", "Arrastra cada situación",
          [{ id: "pedir", label: "Pide ayuda", emoji: "🤝" }, { id: "solo", label: "Puedes solo", emoji: "💪" }],
          [{ id: "i1", label: "No entiendes una tarea difícil", bucket: "pedir" }, { id: "i2", label: "Atar los cordones", bucket: "solo" }, { id: "i3", label: "Te sientes muy mal por mucho tiempo", bucket: "pedir" }, { id: "i4", label: "Elegir qué ropa ponerte", bucket: "solo" }, { id: "i5", label: "Un adulto te hace sentir incómodo", bucket: "pedir" }, { id: "i6", label: "Hacer tu cama", bucket: "solo" }]),
        q("Red de apoyo", "Tener personas de confianza es un tesoro.", "¿Qué es una red de apoyo?", ["Una red para pescar", "Personas de confianza a quienes acudir", "Solo tus padres", "Un grupo de estudio"], 1),
      ],
      experto: [
        q("Reciprocidad", "El dar y recibir va en dos sentidos.", "¿Qué es la reciprocidad en las relaciones?", ["Dar sin esperar nada", "Equilibrio entre dar y recibir", "Recibir sin dar", "Competir con los demás"], 1),
        m("Tipo de apoyo", "La ayuda tiene muchas formas.", "Une cada tipo de apoyo con su ejemplo",
          [{ left: "Apoyo emocional", right: "Escuchar cuando alguien está triste" }, { left: "Apoyo instrumental", right: "Ayudar a cargar algo pesado" }, { left: "Apoyo informativo", right: "Dar un consejo útil" }, { left: "Apoyo de valoración", right: "Decir que algo está bien hecho" }]),
        q("Dependencia vs interdependencia", "Hay diferencia entre necesitar y apoyarse.", "¿Qué es la interdependencia sana?", ["Depender de alguien para todo", "Ser completamente autónomo siempre", "Apoyarse mutuamente respetando la autonomía", "Evitar pedir ayuda"], 2),
      ],
    }, { status: "locked", completion: 0 }),

    tiered("sr-summit", "Cumbre del Refugio", "Tu corazón fuerte y tranquilo.", {
      inicial: [
        q("Reto emocional", "Confía en lo aprendido.", "¿Cuál es una emoción agradable?", ["Miedo", "Enfado", "Alegría", "Vergüenza"], 2),
        q("Reto de amistad", "Los amigos importan.", "¿Qué hace un buen amigo cuando estás triste?", ["Se ríe", "Te escucha", "Se va", "Te ignora"], 1),
        q("Reto de calma", "Respira y piensa.", "¿Qué ayuda más cuando estás muy nervioso?", ["Correr y gritar", "Respirar profundo", "Comer mucho", "Dormir en el suelo"], 1),
      ],
      avanzado: [
        q("Reto de empatía", "Ponte en su lugar.", "Tu amigo perdió su mascota. ¿Qué le dices?", ['"¡Qué torpe, debías cuidarla!"', '"Lo siento mucho, estoy aquí contigo"', '"No importa, ya tendrás otra"', '"Mejor así, las mascotas dan trabajo"'], 1),
        m("Reto de estrategias", "Cada situación tiene su respuesta.", "Une cada situación con la mejor estrategia",
          [{ left: "Estás muy enfadado", right: "Respira y cuenta hasta 10" }, { left: "Un amigo te excluye", right: "Habla con él con calma" }, { left: "No entiendes tus emociones", right: "Escríbelas en un diario" }, { left: "Te sientes solo", right: "Busca a alguien de confianza" }]),
        q("Reto de comunicación", "Las palabras construyen o destruyen.", "¿Qué es comunicarse asertivamente?", ["Gritar para que te escuchen", "Decir lo que piensas con respeto", "Callarse siempre", "Decir lo que el otro quiere oír"], 1),
      ],
      experto: [
        q("Reto de bienestar", "El bienestar se construye.", "¿Cuál de estas contribuye más al bienestar emocional?", ["Tener muchos juguetes", "Relaciones sanas y autoconocimiento", "Ganar siempre", "No tener problemas nunca"], 1),
        q("Reto de inteligencia emocional", "Las emociones son información.", "¿Por qué es útil identificar tus emociones?", ["Para ocultarlas mejor", "Para gestionarlas y comunicarlas bien", "Para no sentirlas", "Para tener razón siempre"], 1),
        m("Reto de habilidades sociales", "Cada habilidad abre una puerta.", "Une cada habilidad con su descripción",
          [{ left: "Empatía", right: "Entender cómo se siente otro" }, { left: "Asertividad", right: "Expresarse con respeto y firmeza" }, { left: "Escucha activa", right: "Atención plena al que habla" }, { left: "Resolución de conflictos", right: "Llegar a acuerdos respetando a todos" }]),
      ],
    }, { status: "locked", isBoss: true, completion: 0 }),
  ],
};

// =============================================================
// EXPORTED CATALOG
// =============================================================
const ALL_MOUNTAINS: Mountain[] = [
  letras,
  numeros,
  naturaleza,
  creativa,
  logica,
  social,
];

// -----------------------------------------------------------------
// Stable, deterministic challenge IDs.
//
// The previous module-level `uid()` counter could drift across HMR
// re-evaluations or import-order changes, producing IDs like `ch-7`
// that became invalid between sessions and broke deep-linked
// challenge URLs ("Desafío no encontrado").
//
// We now derive each challenge id from its mountain + module +
// tier-initial + 1-based index, e.g. `letras-peak-lp-c1-i-1`,
// `letras-peak-lp-c1-a-2`, etc. These are stable forever.
// -----------------------------------------------------------------
const TIER_INITIAL: Record<Tier, string> = {
  inicial: "i",
  avanzado: "a",
  experto: "e",
};
for (const mn of ALL_MOUNTAINS) {
  for (const mod of mn.modules) {
    if (!mod.byTier) continue;
    (Object.keys(mod.byTier) as Tier[]).forEach((tier) => {
      mod.byTier![tier].forEach((ch, idx) => {
        ch.id = `${mn.id}-${mod.id}-${TIER_INITIAL[tier]}-${idx + 1}`;
      });
    });
    // `mod.challenges` is the same array reference as `byTier.inicial`,
    // so its IDs are updated by the loop above too.
  }
}

export const mountains: Mountain[] = ALL_MOUNTAINS;

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
