export interface MatchingPair {
  left: string;
  right: string;
}

export interface DragDropItem {
  id: string;
  label: string;
  bucket: string;
}

export interface DragDropBucket {
  id: string;
  label: string;
  emoji?: string;
}

export interface VisualOption {
  emoji: string;
  label: string;
}

export interface Challenge {
  id: string;
  title: string;
  type: "quiz" | "visual" | "matching" | "drag-drop";
  duration: string;
  status: "locked" | "available" | "completed";
  question?: string;
  options?: string[];
  correctAnswer?: number;
  concept?: string;
  visual?: string;
  visualOptions?: VisualOption[];
  pairs?: MatchingPair[];
  dragItems?: DragDropItem[];
  buckets?: DragDropBucket[];
}

/** A "module" in code = a CHECKPOINT on the mountain in UX language */
export interface PowerModule {
  id: string;
  title: string;
  description: string;
  completion: number;
  status: "locked" | "available" | "in-progress" | "completed";
  challenges: Challenge[];
  /** The summit of this mountain — the master test */
  isBoss?: boolean;
}

/** A "superpower" in code = a MOUNTAIN to climb in UX language */
export interface Superpower {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  rewards: number;
  progress: number;
  status: "locked" | "available" | "in-progress" | "completed";
  modules: PowerModule[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
  category?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "constancia" | "precisión" | "exploración";
  icon: string;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  /** Mountains conquered */
  superpowersMastered: number;
  /** Checkpoints reached */
  modulesCompleted: number;
  /** Climbs completed */
  challengesCompleted: number;
  coins: number;
}

export interface Area {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export const userProfile: UserProfile = {
  name: "Lía",
  avatar: "🧗",
  level: 3,
  xp: 240,
  xpToNext: 400,
  streak: 4,
  superpowersMastered: 0,
  modulesCompleted: 2,
  challengesCompleted: 9,
  coins: 120,
};

// "Areas" are now MOUNTAIN RANGES — themes of climb
export const areas: Area[] = [
  { id: "letras",    title: "Cordillera de Letras",   subtitle: "Donde las palabras nacen",        icon: "📖", color: "primary" },
  { id: "numeros",   title: "Cresta de Números",      subtitle: "Sumar, contar y descubrir",       icon: "🔢", color: "secondary" },
  { id: "naturaleza",title: "Sendero Natural",        subtitle: "Animales, plantas y planeta",     icon: "🌿", color: "accent" },
  { id: "creativa",  title: "Mirador Creativo",       subtitle: "Imaginar y crear",                 icon: "🎨", color: "primary" },
  { id: "logica",    title: "Paso de la Lógica",      subtitle: "Pensar paso a paso",              icon: "🧩", color: "secondary" },
  { id: "social",    title: "Refugio Emocional",      subtitle: "Sentir y convivir",               icon: "💛", color: "accent" },
];

export const categories = ["Todas", "Letras", "Números", "Naturaleza", "Creativa", "Lógica", "Social"];

// ---------- Helpers ----------
const q = (
  id: string, title: string, concept: string, question: string,
  options: string[], correctAnswer: number,
  status: "locked" | "available" | "completed" = "locked",
): Challenge => ({
  id, title, type: "quiz", duration: "1 min", status, concept, question, options, correctAnswer,
});

const v = (
  id: string, title: string, concept: string, question: string,
  visualOptions: VisualOption[], correctAnswer: number,
  status: "locked" | "available" | "completed" = "locked",
): Challenge => ({
  id, title, type: "visual", duration: "1 min", status, concept, question, visualOptions, correctAnswer,
});

const m = (
  id: string, title: string, concept: string, question: string,
  pairs: MatchingPair[],
  status: "locked" | "available" | "completed" = "locked",
): Challenge => ({
  id, title, type: "matching", duration: "2 min", status, concept, question, pairs,
});

const d = (
  id: string, title: string, concept: string, question: string,
  buckets: DragDropBucket[], dragItems: DragDropItem[],
  status: "locked" | "available" | "completed" = "locked",
): Challenge => ({
  id, title, type: "drag-drop", duration: "2 min", status, concept, question, buckets, dragItems,
});

// =====================================================
// THE MOUNTAINS — three age-appropriate climbs (4–10)
// =====================================================
// Legacy seed — kept private. The exported `superpowers` is now derived from
// the slice-3 catalog in `./mountains.ts`, which carries 6 ranges × 5
// checkpoints with three difficulty tiers per module.
const _legacySuperpowers: Superpower[] = [

  // ============ MOUNTAIN 1 — LETRAS PEAK ============
  {
    id: "letras-peak",
    title: "Pico de las Letras",
    description: "El primer ascenso. Descubre las letras y las palabras que te rodean.",
    category: "Letras",
    icon: "📖",
    color: "primary",
    duration: "15 min",
    difficulty: "beginner",
    rewards: 250,
    progress: 35,
    status: "in-progress",
    modules: [
      {
        id: "lp-c1",
        title: "Las primeras letras",
        description: "Reconoce las vocales que abren todo camino.",
        completion: 100,
        status: "completed",
        challenges: [
          v("lp-c1-ch1", "¿Qué empieza con A?", "La letra A es la primera de muchas aventuras 🐝", "¿Qué palabra empieza con A?",
            [
              { emoji: "🍎", label: "Manzana" },
              { emoji: "🐝", label: "Abeja" },
              { emoji: "🌳", label: "Árbol" },
              { emoji: "🚗", label: "Coche" },
            ], 1, "completed"),
          q("lp-c1-ch2", "Vocal escondida", "Las vocales son: A, E, I, O, U.", "¿Cuál NO es una vocal?",
            ["A", "E", "M", "O"], 2, "completed"),
          v("lp-c1-ch3", "Empieza con O", "La O es redonda como el sol 🌞", "¿Qué empieza con la letra O?",
            [
              { emoji: "🐻", label: "Oso" },
              { emoji: "🌸", label: "Flor" },
              { emoji: "🦋", label: "Mariposa" },
              { emoji: "🐠", label: "Pez" },
            ], 0, "completed"),
        ],
      },
      {
        id: "lp-c2",
        title: "Sílabas en el camino",
        description: "Junta sonidos para formar palabras.",
        completion: 33,
        status: "in-progress",
        challenges: [
          q("lp-c2-ch1", "Une las sílabas", "MA + MÁ = MAMÁ. ¡Las palabras se forman juntando sílabas!", "¿Qué palabra forman PA + PÁ?",
            ["PAPA", "PAPÁ", "PIPA", "POPÓ"], 1, "completed"),
          m("lp-c2-ch2", "Une cada sílaba con su pareja", "Cada palabra tiene su música.", "Une las sílabas para formar una palabra",
            [
              { left: "CA",  right: "SA" },
              { left: "SOL", right: "🌞" },
              { left: "LU",  right: "NA" },
              { left: "PE",  right: "RRO" },
            ]),
          q("lp-c2-ch3", "¿Cuántas sílabas?", "Aplaude la palabra: GA-TO son dos sílabas 👏👏", "¿Cuántas sílabas tiene MA-RI-PO-SA?",
            ["2", "3", "4", "5"], 2),
        ],
      },
      {
        id: "lp-c3",
        title: "Palabras que conozco",
        description: "Une palabras con lo que ves.",
        completion: 0,
        status: "locked",
        challenges: [
          v("lp-c3-ch1", "¿Qué es?", "Cada palabra tiene una imagen en tu mente 🧠", "¿Cuál es un PERRO?",
            [
              { emoji: "🐱", label: "Gato" },
              { emoji: "🐶", label: "Perro" },
              { emoji: "🐰", label: "Conejo" },
              { emoji: "🐦", label: "Pájaro" },
            ], 1),
          d("lp-c3-ch2", "Clasifica las palabras", "Algunas palabras son animales y otras son cosas.", "Arrastra cada palabra a su grupo",
            [
              { id: "ani", label: "Animales", emoji: "🐾" },
              { id: "cos", label: "Cosas",    emoji: "📦" },
            ],
            [
              { id: "i1", label: "Gato",   bucket: "ani" },
              { id: "i2", label: "Mesa",   bucket: "cos" },
              { id: "i3", label: "Pez",    bucket: "ani" },
              { id: "i4", label: "Silla",  bucket: "cos" },
              { id: "i5", label: "Rana",   bucket: "ani" },
              { id: "i6", label: "Lápiz",  bucket: "cos" },
            ]),
          q("lp-c3-ch3", "La palabra escondida", "Lee con calma, paso a paso 🪜", "¿Qué palabra significa lo mismo que CASA?",
            ["Hogar", "Coche", "Mesa", "Sol"], 0),
        ],
      },
      {
        id: "lp-summit",
        title: "Cumbre del Pico de las Letras",
        description: "Demuestra que ya eres un explorador de palabras.",
        completion: 0,
        status: "locked",
        isBoss: true,
        challenges: [
          q("lp-s-ch1", "Reto del lector", "¡Confía en lo que aprendiste!", "¿Cuántas vocales hay en CARAMELO?",
            ["2", "3", "4", "5"], 1),
          v("lp-s-ch2", "Reto visual", "Mira con atención 👀", "¿Qué empieza con la letra L?",
            [
              { emoji: "🦁", label: "León" },
              { emoji: "🐯", label: "Tigre" },
              { emoji: "🐘", label: "Elefante" },
              { emoji: "🦒", label: "Jirafa" },
            ], 0),
          q("lp-s-ch3", "Reto final", "Has llegado muy alto 🏔️", "¿Cuántas sílabas tiene EX-PLO-RA-DOR?",
            ["2", "3", "4", "5"], 2),
        ],
      },
    ],
  },

  // ============ MOUNTAIN 2 — NÚMEROS RIDGE ============
  {
    id: "numeros-ridge",
    title: "Cresta de los Números",
    description: "Sube contando, sumando y descubriendo patrones.",
    category: "Números",
    icon: "🔢",
    color: "secondary",
    duration: "20 min",
    difficulty: "beginner",
    rewards: 300,
    progress: 0,
    status: "available",
    modules: [
      {
        id: "nr-c1",
        title: "Contar hasta 10",
        description: "Cada paso es un número.",
        completion: 0,
        status: "available",
        challenges: [
          v("nr-c1-ch1", "Cuenta los animales", "Asocia cada cosa con un número 🐾", "¿Qué grupo tiene exactamente 5?",
            [
              { emoji: "🐶🐶🐶", label: "3 perros" },
              { emoji: "🐱🐱🐱🐱🐱", label: "5 gatos" },
              { emoji: "🐰🐰🐰🐰", label: "4 conejos" },
              { emoji: "🐭🐭🐭🐭🐭🐭", label: "6 ratones" },
            ], 1, "available"),
          q("nr-c1-ch2", "Número siguiente", "Después del 4 viene el 5, como un escalón más 🪜", "¿Qué número va después del 7?",
            ["6", "8", "9", "5"], 1),
          q("nr-c1-ch3", "Número anterior", "También podemos bajar: 5, 4, 3…", "¿Qué número va antes del 10?",
            ["11", "8", "9", "7"], 2),
        ],
      },
      {
        id: "nr-c2",
        title: "Sumar pasos",
        description: "Cada suma te lleva más arriba.",
        completion: 0,
        status: "locked",
        challenges: [
          q("nr-c2-ch1", "Primera suma", "Sumar es juntar: 2 piedras + 3 piedras = 5 piedras 🪨", "¿Cuánto es 3 + 4?",
            ["6", "7", "8", "5"], 1),
          q("nr-c2-ch2", "Suma con los dedos", "Tus dedos también ayudan a contar 🖐️", "¿Cuánto es 5 + 2?",
            ["6", "7", "8", "9"], 1),
          d("nr-c2-ch3", "Clasifica las sumas", "Algunas sumas dan menos de 10, otras justo 10.", "Arrastra cada suma a su resultado",
            [
              { id: "lt10", label: "Menor que 10", emoji: "🐣" },
              { id: "eq10", label: "Igual a 10",   emoji: "🎯" },
              { id: "gt10", label: "Mayor que 10", emoji: "🚀" },
            ],
            [
              { id: "i1", label: "3 + 4", bucket: "lt10" },
              { id: "i2", label: "6 + 4", bucket: "eq10" },
              { id: "i3", label: "8 + 5", bucket: "gt10" },
              { id: "i4", label: "2 + 5", bucket: "lt10" },
              { id: "i5", label: "7 + 3", bucket: "eq10" },
              { id: "i6", label: "9 + 6", bucket: "gt10" },
            ]),
        ],
      },
      {
        id: "nr-c3",
        title: "Patrones del camino",
        description: "Los números también tienen ritmo.",
        completion: 0,
        status: "locked",
        challenges: [
          q("nr-c3-ch1", "Patrón simple", "2, 4, 6, 8… ¡van de dos en dos!", "¿Qué sigue: 2, 4, 6, __?",
            ["7", "8", "10", "9"], 1),
          m("nr-c3-ch2", "Une número y cantidad", "Cada número representa una cantidad.", "Une cada número con la cantidad correcta",
            [
              { left: "3", right: "🍎🍎🍎" },
              { left: "5", right: "⭐⭐⭐⭐⭐" },
              { left: "2", right: "🎈🎈" },
              { left: "4", right: "🌟🌟🌟🌟" },
            ]),
          q("nr-c3-ch3", "Patrón saltarín", "3, 6, 9… van de tres en tres 🦘", "¿Qué sigue: 3, 6, 9, __?",
            ["10", "11", "12", "15"], 2),
        ],
      },
      {
        id: "nr-summit",
        title: "Cumbre de la Cresta",
        description: "Demuestra que dominas los números.",
        completion: 0,
        status: "locked",
        isBoss: true,
        challenges: [
          q("nr-s-ch1", "Reto contador", "Recuerda: cuenta despacio.", "¿Cuántos dedos tienes en total?",
            ["8", "10", "12", "20"], 1),
          q("nr-s-ch2", "Reto sumador", "Suma con calma 🧘", "¿Cuánto es 6 + 5?",
            ["10", "11", "12", "13"], 1),
          q("nr-s-ch3", "Reto del patrón", "Busca el ritmo.", "¿Qué sigue: 5, 10, 15, __?",
            ["18", "19", "20", "25"], 2),
        ],
      },
    ],
  },

  // ============ MOUNTAIN 3 — SENDERO NATURAL ============
  {
    id: "naturaleza-trail",
    title: "Sendero de la Naturaleza",
    description: "Descubre animales, plantas y los secretos del planeta.",
    category: "Naturaleza",
    icon: "🌿",
    color: "accent",
    duration: "20 min",
    difficulty: "beginner",
    rewards: 300,
    progress: 0,
    status: "locked",
    modules: [
      {
        id: "nt-c1",
        title: "Animales del bosque",
        description: "Conoce a los habitantes del camino.",
        completion: 0,
        status: "locked",
        challenges: [
          v("nt-c1-ch1", "¿Quién vive aquí?", "Algunos animales viven en el bosque 🌲", "¿Cuál vive en el bosque?",
            [
              { emoji: "🐠", label: "Pez" },
              { emoji: "🦊", label: "Zorro" },
              { emoji: "🐳", label: "Ballena" },
              { emoji: "🐧", label: "Pingüino" },
            ], 1),
          d("nt-c1-ch2", "¿Dónde vive cada uno?", "Cada animal tiene su hogar.", "Arrastra cada animal a su hogar",
            [
              { id: "agua",  label: "Agua",   emoji: "🌊" },
              { id: "tierra",label: "Tierra", emoji: "🌳" },
              { id: "aire",  label: "Aire",   emoji: "☁️" },
            ],
            [
              { id: "i1", label: "Pez",      bucket: "agua" },
              { id: "i2", label: "Águila",   bucket: "aire" },
              { id: "i3", label: "Conejo",   bucket: "tierra" },
              { id: "i4", label: "Tortuga",  bucket: "agua" },
              { id: "i5", label: "Pájaro",   bucket: "aire" },
              { id: "i6", label: "Zorro",    bucket: "tierra" },
            ]),
          q("nt-c1-ch3", "Sonido del bosque", "Cada animal hace un sonido distinto.", "¿Qué animal dice 'guau'?",
            ["Gato", "Perro", "Vaca", "Pato"], 1),
        ],
      },
      {
        id: "nt-c2",
        title: "Las plantas crecen",
        description: "Mira cómo nacen las cosas que respiran.",
        completion: 0,
        status: "locked",
        challenges: [
          q("nt-c2-ch1", "Las plantas necesitan…", "Las plantas necesitan agua, sol y tierra para crecer.", "¿Qué necesita una planta para crecer?",
            ["Solo agua", "Solo sol", "Agua, sol y tierra", "Nada"], 2),
          m("nt-c2-ch2", "Une cada parte de la planta", "Cada parte tiene un trabajo.", "Une la parte con su función",
            [
              { left: "Raíz",  right: "Bebe agua" },
              { left: "Hoja",  right: "Atrapa el sol" },
              { left: "Flor",  right: "Hace semillas" },
              { left: "Tallo", right: "Sostiene todo" },
            ]),
          v("nt-c2-ch3", "¿Qué crece de una semilla?", "Todo gran árbol fue una pequeña semilla 🌱", "¿Qué crece de una semilla?",
            [
              { emoji: "🌳", label: "Árbol" },
              { emoji: "🪨", label: "Piedra" },
              { emoji: "💧", label: "Gota" },
              { emoji: "☁️", label: "Nube" },
            ], 0),
        ],
      },
      {
        id: "nt-c3",
        title: "Cuida el planeta",
        description: "Pequeños pasos, gran montaña.",
        completion: 0,
        status: "locked",
        challenges: [
          q("nt-c3-ch1", "¿Qué cuida la naturaleza?", "Cada acción cuenta 💚", "¿Qué ayuda a cuidar la naturaleza?",
            ["Tirar basura", "Reciclar", "Talar árboles", "Gritar"], 1),
          d("nt-c3-ch2", "Reciclar bien", "Cada cosa va a su contenedor.", "Arrastra cada objeto a su contenedor",
            [
              { id: "papel",   label: "Papel",   emoji: "📄" },
              { id: "plast",   label: "Plástico",emoji: "♻️" },
              { id: "organic", label: "Orgánico",emoji: "🍂" },
            ],
            [
              { id: "i1", label: "Periódico",     bucket: "papel" },
              { id: "i2", label: "Botella",       bucket: "plast" },
              { id: "i3", label: "Cáscara",       bucket: "organic" },
              { id: "i4", label: "Caja de cartón",bucket: "papel" },
              { id: "i5", label: "Bolsa",         bucket: "plast" },
              { id: "i6", label: "Manzana vieja", bucket: "organic" },
            ]),
          q("nt-c3-ch3", "Ahorrar agua", "El agua es vida 💧", "¿Cuándo gastamos menos agua?",
            ["Dejando el grifo abierto", "Cerrando el grifo al cepillarte", "Usando la manguera siempre", "No bebiendo"], 1),
        ],
      },
      {
        id: "nt-summit",
        title: "Cumbre del Sendero",
        description: "Eres guardián de la naturaleza.",
        completion: 0,
        status: "locked",
        isBoss: true,
        challenges: [
          q("nt-s-ch1", "Reto del bosque", "Recuerda lo que viste.", "¿Qué animal vive en el agua?",
            ["Águila", "Pez", "Zorro", "Ratón"], 1),
          q("nt-s-ch2", "Reto verde", "Las plantas son vida.", "¿Qué parte de la planta bebe agua?",
            ["Hoja", "Flor", "Raíz", "Tallo"], 2),
          q("nt-s-ch3", "Reto del planeta", "Cada gesto cuenta.", "¿Cuál es la mejor opción?",
            ["Reciclar", "Tirar al suelo", "Quemar plástico", "Romper árboles"], 0),
        ],
      },
    ],
  },
];

// =====================================================
// Daily missions — small climbs to do today
// =====================================================
export const missions: Mission[] = [
  { id: "m1", title: "Sube un escalón hoy", description: "Completa una climb (cualquiera).", type: "daily",
    progress: 1, target: 1, xpReward: 30, completed: true, category: "Diaria" },
  { id: "m2", title: "Tres pasos en el sendero", description: "Completa 3 climbs hoy.", type: "daily",
    progress: 1, target: 3, xpReward: 60, completed: false, category: "Diaria" },
  { id: "m3", title: "Llega a un nuevo checkpoint", description: "Termina un checkpoint completo.", type: "weekly",
    progress: 2, target: 3, xpReward: 200, completed: false, category: "Semanal" },
  { id: "m4", title: "Mantén el ritmo", description: "Mantén una racha de 5 días.", type: "weekly",
    progress: 4, target: 5, xpReward: 250, completed: false, category: "Semanal" },
];

// =====================================================
// Achievements — flags planted on the journey
// =====================================================
export const achievements: Achievement[] = [
  { id: "a1", title: "Primer paso",         description: "Completaste tu primera climb.",
    category: "exploración", icon: "👣", unlocked: true },
  { id: "a2", title: "Bandera plantada",    description: "Llegaste a tu primer checkpoint.",
    category: "exploración", icon: "🚩", unlocked: true },
  { id: "a3", title: "Racha de 3 días",     description: "3 días seguidos en el sendero.",
    category: "constancia",  icon: "🔥", unlocked: true },
  { id: "a4", title: "Ojo de águila",       description: "5 climbs sin un solo error.",
    category: "precisión",   icon: "🦅", unlocked: false },
  { id: "a5", title: "Conquistador",        description: "Llega a la cumbre de una montaña.",
    category: "exploración", icon: "🏔️", unlocked: false },
  { id: "a6", title: "Explorador veterano", description: "Conquista 3 montañas distintas.",
    category: "exploración", icon: "🧭", unlocked: false },
];

// =====================================================
// Slice-3 derived catalog
// `superpowers` is the public, legacy-compatible view of the new
// mountains catalog. Each module exposes its `inicial` tier as the
// default `challenges[]` so legacy pages keep rendering. Pages that
// care about adaptive difficulty use `findChallenge()` from
// `./mountains.ts` directly to pick the correct tier set.
// =====================================================
import { mountains as _mountains, type Mountain } from "./mountains";

export const superpowers: Superpower[] = _mountains.map((mn: Mountain) => ({
  id: mn.id,
  title: mn.title,
  description: mn.description,
  category: mn.category,
  icon: mn.icon,
  color: mn.color,
  duration: mn.duration,
  difficulty: mn.difficulty,
  rewards: mn.rewards,
  progress: mn.progress,
  status: mn.status,
  modules: mn.modules.map((mo) => ({
    id: mo.id,
    title: mo.title,
    description: mo.description,
    completion: mo.completion,
    status: mo.status,
    isBoss: mo.isBoss,
    challenges: mo.challenges,
  })),
}));
