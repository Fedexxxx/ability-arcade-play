export interface MatchingPair {
  left: string;
  right: string;
}

export interface DragDropItem {
  id: string;
  label: string;
  bucket: string; // id of the correct bucket
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
  // Visual quiz: choose the correct emoji/picture
  visualOptions?: VisualOption[];
  // Matching: connect left items to right items
  pairs?: MatchingPair[];
  // Drag & drop: classify items into buckets
  dragItems?: DragDropItem[];
  buckets?: DragDropBucket[];
}

export interface PowerModule {
  id: string;
  title: string;
  description: string;
  completion: number;
  status: "locked" | "available" | "in-progress" | "completed";
  challenges: Challenge[];
  isBoss?: boolean;
}

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
  superpowersMastered: number;
  modulesCompleted: number;
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
  name: "Alex",
  avatar: "🧒",
  level: 7,
  xp: 2450,
  xpToNext: 3000,
  streak: 5,
  superpowersMastered: 2,
  modulesCompleted: 8,
  challengesCompleted: 34,
  coins: 580,
};

export const areas: Area[] = [
  { id: "math", title: "Matemáticas", subtitle: "El arte de no odiar los números todavía", icon: "🧠", color: "energy" },
  { id: "lang", title: "Lenguaje y Comunicación", subtitle: "Hablar sin sonar a cavernícola", icon: "📚", color: "power" },
  { id: "science", title: "Ciencias", subtitle: "Cómo funciona el mundo sin romperlo… demasiado", icon: "🔬", color: "xp" },
  { id: "art", title: "Creatividad y Arte", subtitle: "Donde no hay respuestas \"correctas\"… por suerte", icon: "🎨", color: "streak" },
  { id: "logic", title: "Lógica y Resolución", subtitle: "Pensar sin que duela demasiado", icon: "🧩", color: "energy" },
  { id: "social", title: "Habilidades Sociales y Emocionales", subtitle: "Sí, también hay que enseñar esto", icon: "🌍", color: "power" },
  { id: "tech", title: "Tecnología y Mundo Digital", subtitle: "Inevitable, mejor bien hecho", icon: "💻", color: "xp" },
  { id: "body", title: "Cuerpo y Movimiento", subtitle: "Porque no todo es pantalla… aunque cueste aceptarlo", icon: "🏃", color: "streak" },
];

export const categories = ["Todas", "Matemáticas", "Lenguaje", "Ciencias", "Arte", "Lógica", "Social", "Tecnología", "Cuerpo"];

// Helper to create quiz challenges
const q = (id: string, title: string, concept: string, question: string, options: string[], correctAnswer: number, status: "locked" | "available" | "completed" = "locked"): Challenge => ({
  id, title, type: "quiz", duration: "1 min", status, concept, question, options, correctAnswer,
});

// Helper: visual challenge (pick the right emoji/picture)
const v = (id: string, title: string, concept: string, question: string, visualOptions: VisualOption[], correctAnswer: number, status: "locked" | "available" | "completed" = "locked"): Challenge => ({
  id, title, type: "visual", duration: "1 min", status, concept, question, visualOptions, correctAnswer,
});

// Helper: matching pairs
const m = (id: string, title: string, concept: string, question: string, pairs: MatchingPair[], status: "locked" | "available" | "completed" = "locked"): Challenge => ({
  id, title, type: "matching", duration: "2 min", status, concept, question, pairs,
});

// Helper: drag & drop classify
const d = (id: string, title: string, concept: string, question: string, buckets: DragDropBucket[], dragItems: DragDropItem[], status: "locked" | "available" | "completed" = "locked"): Challenge => ({
  id, title, type: "drag-drop", duration: "2 min", status, concept, question, buckets, dragItems,
});

export const superpowers: Superpower[] = [
  // ===== MATEMÁTICAS =====
  {
    id: "mat-1", title: "Contar como un Maestro", description: "Reconocer números y secuencias como todo un pro.",
    category: "Matemáticas", icon: "🔢", color: "energy", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 65, status: "in-progress",
    modules: [
      {
        id: "mat1-m1", title: "Números del 1 al 20", description: "Conoce los números básicos y aprende a reconocerlos.",
        completion: 100, status: "completed",
        challenges: [
          q("mat1-c1", "¿Cuántos hay?", "Los números nos ayudan a contar cosas. ¡Desde 1 manzana hasta 20 estrellas! 🍎⭐", "¿Cuántas patas tiene un gato?", ["2", "3", "4", "6"], 2, "completed"),
          q("mat1-c2", "Número siguiente", "Después de cada número viene el siguiente. 1, 2, 3… ¡como una escalera! 🪜", "¿Qué número va después del 7?", ["6", "8", "9", "5"], 1, "completed"),
          q("mat1-c3", "Número anterior", "También podemos ir hacia atrás: 5, 4, 3, 2, 1… ¡despegue! 🚀", "¿Qué número va antes del 10?", ["11", "8", "9", "7"], 2, "completed"),
        ],
      },
      {
        id: "mat1-m2", title: "Secuencias numéricas", description: "Descubre patrones escondidos en los números.",
        completion: 33, status: "in-progress",
        challenges: [
          q("mat1-c4", "Patrón simple", "Los números pueden seguir un patrón: 2, 4, 6, 8… ¡van de dos en dos! 🎯", "¿Qué sigue en 2, 4, 6, __?", ["7", "8", "10", "9"], 1, "completed"),
          v("mat1-c5", "Cuenta los animales", "Contar es asociar cada cosa con un número 🐾", "¿Qué grupo tiene exactamente 5 elementos?",
            [
              { emoji: "🐶🐶🐶", label: "3 perros" },
              { emoji: "🐱🐱🐱🐱🐱", label: "5 gatos" },
              { emoji: "🐰🐰🐰🐰", label: "4 conejos" },
              { emoji: "🐭🐭🐭🐭🐭🐭", label: "6 ratones" },
            ], 1, "available"),
          m("mat1-c6", "Une cada número con su cantidad", "Cada número representa una cantidad. ¡Conéctalos!", "Une cada número con la cantidad correcta",
            [
              { left: "3", right: "🍎🍎🍎" },
              { left: "5", right: "⭐⭐⭐⭐⭐" },
              { left: "2", right: "🎈🎈" },
              { left: "4", right: "🌟🌟🌟🌟" },
            ]),
        ],
      },
      {
        id: "mat1-m3", title: "Números grandes", description: "Lánzate a contar más allá del 20.",
        completion: 0, status: "locked",
        challenges: [
          q("mat1-c7", "Decenas", "Una decena son 10 unidades. 30 son 3 decenas 🔟", "¿Cuántas decenas hay en 50?", ["3", "4", "5", "6"], 2),
          q("mat1-c8", "Centenas", "100 es una centena. ¡100 estrellas en el cielo! ✨", "¿Cuántas decenas hay en 100?", ["5", "10", "20", "100"], 1),
          q("mat1-c9", "Comparar", "Cuando comparamos, vemos cuál es mayor o menor: 8 > 5 ⚖️", "¿Qué número es mayor?", ["12", "21", "9", "15"], 1),
        ],
      },
      {
        id: "mat1-boss", title: "Prueba del Contador", description: "¡Demuestra que eres un maestro contando!",
        completion: 0, status: "locked", isBoss: true,
        challenges: [
          q("mat1-b1", "Reto final", "¡Hora de demostrar lo que sabes! 💪", "¿Cuántos dedos tienes en total?", ["8", "10", "12", "20"], 1),
          q("mat1-b2", "Reto de patrón", "Recuerda los patrones que aprendiste 🧠", "¿Qué sigue en 3, 6, 9, __?", ["10", "11", "12", "15"], 2),
          q("mat1-b3", "Reto de comparación", "Compara con cuidado", "¿Cuál es el número más grande?", ["45", "54", "44", "50"], 1),
        ],
      },
    ],
  },
  {
    id: "mat-2", title: "Sumas Ninja", description: "Domina las sumas simples y mentales como un verdadero ninja.",
    category: "Matemáticas", icon: "➕", color: "energy", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "available",
    modules: [
      {
        id: "mat2-m1", title: "Sumas hasta 10", description: "Empieza sumando números pequeños.",
        completion: 0, status: "available",
        challenges: [
          q("mat2-c1", "Primera suma", "Sumar es juntar cosas. 2 manzanas + 3 manzanas = 5 manzanas 🍎", "¿Cuánto es 3 + 4?", ["6", "7", "8", "5"], 1, "available"),
          q("mat2-c2", "Sumando con los dedos", "Puedes usar los dedos para sumar. ¡Es válido! 🖐️", "¿Cuánto es 5 + 2?", ["6", "7", "8", "9"], 1),
          d("mat2-c3", "Clasifica las sumas", "Algunas sumas dan menos de 10 y otras llegan hasta 20. ¡Ordénalas!", "Arrastra cada suma a su resultado",
            [
              { id: "lt10", label: "Menor que 10", emoji: "🐣" },
              { id: "eq10", label: "Igual a 10", emoji: "🎯" },
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
        id: "mat2-m2", title: "Sumas hasta 20", description: "Sube de nivel: ahora con números más grandes.",
        completion: 0, status: "locked",
        challenges: [
          q("mat2-c4", "Sumar pasando del 10", "Cuando pasas del 10, primero llega a 10 y luego suma el resto: 8+5 = 8+2+3 = 13 ✨", "¿Cuánto es 7 + 6?", ["12", "13", "14", "15"], 1),
          q("mat2-c5", "Sumar 9", "Para sumar 9, suma 10 y resta 1. ¡Truco ninja! 🥷", "¿Cuánto es 9 + 4?", ["12", "13", "14", "15"], 1),
          q("mat2-c6", "Tres números", "Puedes sumar más de dos números: 2+3+4 = 9", "¿Cuánto es 3 + 4 + 5?", ["10", "11", "12", "13"], 2),
        ],
      },
      {
        id: "mat2-m3", title: "Cálculo mental", description: "Suma sin papel ni dedos. Solo tu cerebro 🧠",
        completion: 0, status: "locked",
        challenges: [
          q("mat2-c7", "Sumas redondas", "Sumar números acabados en 0 es fácil: 20+30=50 🎯", "¿Cuánto es 30 + 40?", ["60", "70", "80", "90"], 1),
          q("mat2-c8", "Decenas y unidades", "Suma decenas con decenas y unidades con unidades: 23+15 = 38", "¿Cuánto es 12 + 25?", ["35", "37", "38", "40"], 1),
          q("mat2-c9", "Reto rápido", "¡Sin pensar mucho, confía en ti!", "¿Cuánto es 15 + 15?", ["20", "25", "30", "35"], 2),
        ],
      },
    ],
  },
  {
    id: "mat-3", title: "Restas Invisibles", description: "Aprende a quitar y comparar cantidades sin miedo.",
    category: "Matemáticas", icon: "➖", color: "energy", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "mat3-m1", title: "Restas hasta 10", description: "Quitar cosas también se vale.",
        completion: 0, status: "locked",
        challenges: [
          q("mat3-c1", "Primera resta", "Restar es quitar. Si tienes 5 galletas y te comes 2, te quedan 3 🍪", "¿Cuánto es 7 - 3?", ["3", "4", "5", "2"], 1),
          q("mat3-c2", "¿Cuántos quedan?", "Imagina que tienes 8 globos y se van volando 5. ¿Cuántos te quedan? 🎈", "8 - 5 = ?", ["2", "3", "4", "1"], 1),
          q("mat3-c3", "Restar 0", "Si no quitas nada, queda lo mismo. 6 - 0 = 6 ✨", "¿Cuánto es 9 - 0?", ["0", "1", "9", "10"], 2),
        ],
      },
      {
        id: "mat3-m2", title: "Restas hasta 20", description: "Resta números más grandes sin perderte.",
        completion: 0, status: "locked",
        challenges: [
          q("mat3-c4", "Restar dos cifras", "Resta unidades con unidades, decenas con decenas: 15-3=12", "¿Cuánto es 18 - 5?", ["12", "13", "14", "15"], 1),
          q("mat3-c5", "Restar pasando el 10", "A veces necesitas pedir prestado. ¡No es magia, es matemática!", "¿Cuánto es 14 - 6?", ["7", "8", "9", "10"], 1),
          q("mat3-c6", "Llegar a cero", "Si restas el mismo número, queda cero: 7 - 7 = 0", "¿Cuánto es 15 - 15?", ["0", "1", "15", "30"], 0),
        ],
      },
      {
        id: "mat3-m3", title: "Comparar cantidades", description: "¿Cuántos más? ¿Cuántos menos?",
        completion: 0, status: "locked",
        challenges: [
          q("mat3-c7", "Diferencia", "La diferencia entre dos números se halla restando: 8-3=5", "¿Cuántos más son 10 que 4?", ["4", "5", "6", "7"], 2),
          q("mat3-c8", "Quién tiene más", "Compara para saber quién gana 🏆", "Ana tiene 12 dulces y Luis 7. ¿Cuántos más tiene Ana?", ["3", "4", "5", "6"], 2),
          q("mat3-c9", "Resta mental", "¡Confía en tu cabeza, sin papel!", "¿Cuánto es 20 - 7?", ["12", "13", "14", "15"], 1),
        ],
      },
    ],
  },
  {
    id: "mat-4", title: "Multiplicación Mágica", description: "Las tablas de multiplicar como patrones, no como tortura.",
    category: "Matemáticas", icon: "✖️", color: "energy", duration: "30 min", difficulty: "intermediate", rewards: 500, progress: 0, status: "locked",
    modules: [
      {
        id: "mat4-m1", title: "Tabla del 2", description: "Todo empieza con los dobles.",
        completion: 0, status: "locked",
        challenges: [
          q("mat4-c1", "Dobles otra vez", "Multiplicar por 2 es como sumar el número consigo mismo: 3×2 = 3+3 = 6 ✨", "¿Cuánto es 4 × 2?", ["6", "8", "10", "4"], 1),
          q("mat4-c2", "Patrón del 2", "La tabla del 2 va: 2, 4, 6, 8, 10… ¡siempre par! 🔄", "¿Cuánto es 7 × 2?", ["12", "14", "16", "9"], 1),
          q("mat4-c3", "Tabla completa", "2, 4, 6, 8, 10, 12, 14, 16, 18, 20 — ¡memorízala!", "¿Cuánto es 9 × 2?", ["16", "17", "18", "19"], 2),
        ],
      },
      {
        id: "mat4-m2", title: "Tabla del 5 y del 10", description: "Las más fáciles: terminan en 0 o 5.",
        completion: 0, status: "locked",
        challenges: [
          q("mat4-c4", "Tabla del 5", "La tabla del 5 va: 5, 10, 15, 20… ¡todos terminan en 0 o 5! 🖐️", "¿Cuánto es 6 × 5?", ["25", "30", "35", "40"], 1),
          q("mat4-c5", "Tabla del 10", "Multiplicar por 10 es agregar un cero: 4×10=40 🎯", "¿Cuánto es 8 × 10?", ["18", "80", "108", "800"], 1),
          q("mat4-c6", "Mezcla", "¡A pensar rápido!", "¿Cuánto es 7 × 5?", ["30", "35", "40", "45"], 1),
        ],
      },
      {
        id: "mat4-m3", title: "Tabla del 3 y del 4", description: "Sube de nivel con estas dos tablas clave.",
        completion: 0, status: "locked",
        challenges: [
          q("mat4-c7", "Tabla del 3", "La tabla del 3: 3, 6, 9, 12, 15… ¡va de tres en tres!", "¿Cuánto es 5 × 3?", ["12", "15", "18", "21"], 1),
          q("mat4-c8", "Tabla del 4", "Multiplicar por 4 es como duplicar dos veces: 3×4 = 3×2×2 = 12", "¿Cuánto es 6 × 4?", ["20", "22", "24", "26"], 2),
          q("mat4-c9", "Reto combinado", "Las multiplicaciones son patrones, no tortura ✨", "¿Cuánto es 4 × 7?", ["24", "26", "28", "30"], 2),
        ],
      },
    ],
  },
  {
    id: "mat-5", title: "Geometría Detective", description: "Descubre formas, tamaños y el espacio que te rodea.",
    category: "Matemáticas", icon: "📐", color: "energy", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "mat5-m1", title: "Formas básicas", description: "Círculos, cuadrados, triángulos… ¡están en todas partes!",
        completion: 0, status: "locked",
        challenges: [
          q("mat5-c1", "¿Qué forma es?", "Las formas geométricas tienen nombres especiales. Un círculo es redondo ⭕", "¿Cuántos lados tiene un triángulo?", ["2", "3", "4", "5"], 1),
          q("mat5-c2", "Formas en la vida", "¡Las formas están en todas partes! Una puerta es un rectángulo 🚪", "¿Qué forma tiene una rueda?", ["Cuadrado", "Triángulo", "Círculo", "Rectángulo"], 2),
          q("mat5-c3", "Lados del cuadrado", "El cuadrado tiene 4 lados iguales 🟦", "¿Cuántos lados tiene un cuadrado?", ["3", "4", "5", "6"], 1),
        ],
      },
      {
        id: "mat5-m2", title: "Tamaños y comparaciones", description: "Grande, pequeño, alto, bajo… todo es relativo.",
        completion: 0, status: "locked",
        challenges: [
          q("mat5-c4", "Más grande", "Comparar tamaños te ayuda a entender el mundo 🐘🐭", "¿Qué es más grande?", ["Hormiga", "Elefante", "Mariposa", "Ratón"], 1),
          q("mat5-c5", "Más alto", "La altura es lo que mide algo de abajo a arriba 📏", "¿Qué es más alto?", ["Mesa", "Edificio", "Silla", "Lámpara"], 1),
          q("mat5-c6", "Más pesado", "El peso es lo que pesa una cosa al levantarla", "¿Qué es más pesado?", ["Pluma", "Coche", "Hoja", "Globo"], 1),
        ],
      },
      {
        id: "mat5-m3", title: "Espacio y posición", description: "Arriba, abajo, izquierda, derecha… orientarse es clave.",
        completion: 0, status: "locked",
        challenges: [
          q("mat5-c7", "Posiciones", "Saber dónde están las cosas te ayuda a moverte 🧭", "¿Dónde está el techo?", ["Abajo", "Arriba", "A un lado", "Atrás"], 1),
          q("mat5-c8", "Izquierda y derecha", "Tu mano de escribir suele ser tu lado dominante ✍️", "Si miras al frente, ¿dónde está tu mano izquierda?", ["Atrás", "A tu izquierda", "A tu derecha", "Arriba"], 1),
          q("mat5-c9", "Cerca y lejos", "Algo cerca está pegado a ti, algo lejos está alejado", "¿Qué está más lejos de ti normalmente?", ["Tus zapatos", "Las nubes", "Tu nariz", "Tu mano"], 1),
        ],
      },
    ],
  },
  {
    id: "mat-6", title: "Tiempo y Dinero Pro", description: "Domina el reloj, las monedas y el valor de las cosas.",
    category: "Matemáticas", icon: "⏰", color: "energy", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "mat6-m1", title: "Leer el reloj", description: "¿Qué hora es? ¡Aprende a leer el reloj!",
        completion: 0, status: "locked",
        challenges: [
          q("mat6-c1", "Las horas", "El reloj tiene dos manecillas. La corta marca la hora ⏰", "Si la manecilla corta está en el 3, ¿qué hora es?", ["1:00", "2:00", "3:00", "12:00"], 2),
          q("mat6-c2", "Los minutos", "La manecilla larga marca los minutos. Cada número son 5 minutos", "Si la larga está en el 6, ¿cuántos minutos pasaron?", ["15", "20", "30", "45"], 2),
          q("mat6-c3", "Hora y media", "Cuando la larga está en el 6, decimos 'y media' 🕝", "Si son las 4 y la larga está en el 6, son las…", ["4:00", "4:15", "4:30", "5:00"], 2),
        ],
      },
      {
        id: "mat6-m2", title: "Días y meses", description: "Organiza tu tiempo: días de la semana y meses del año.",
        completion: 0, status: "locked",
        challenges: [
          q("mat6-c4", "Días de la semana", "Hay 7 días: lunes, martes, miércoles, jueves, viernes, sábado y domingo 📅", "¿Cuántos días tiene una semana?", ["5", "6", "7", "8"], 2),
          q("mat6-c5", "Meses del año", "El año tiene 12 meses, desde enero hasta diciembre 🗓️", "¿Cuántos meses tiene un año?", ["10", "11", "12", "13"], 2),
          q("mat6-c6", "Después del lunes", "Los días siguen un orden", "¿Qué día viene después del lunes?", ["Domingo", "Martes", "Miércoles", "Viernes"], 1),
        ],
      },
      {
        id: "mat6-m3", title: "Monedas y dinero", description: "Aprende el valor de las monedas y a comprar con cabeza.",
        completion: 0, status: "locked",
        challenges: [
          q("mat6-c7", "Valor de monedas", "Cada moneda tiene un valor distinto. ¡No todas valen igual! 🪙", "Si tienes 2 monedas de 5, ¿cuánto tienes?", ["5", "7", "10", "15"], 2),
          q("mat6-c8", "Comprar", "Cuando compras, das dinero y te dan algo a cambio 🛒", "Si algo cuesta 8 y tienes 10, ¿cuánto te devuelven?", ["1", "2", "3", "8"], 1),
          q("mat6-c9", "Ahorrar", "Ahorrar es guardar dinero para después 💰", "Si ahorras 5 cada semana, ¿cuánto tendrás en 4 semanas?", ["10", "15", "20", "25"], 2),
        ],
      },
    ],
  },

  // ===== LENGUAJE =====
  {
    id: "lang-1", title: "Lector Imparable", description: "Lectura progresiva para convertirte en un devorador de libros.",
    category: "Lenguaje", icon: "📖", color: "power", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "available",
    modules: [
      {
        id: "lang1-m1", title: "Vocales y sílabas", description: "Todo empieza con las vocales: A, E, I, O, U.",
        completion: 0, status: "available",
        challenges: [
          q("lang1-c1", "Las vocales", "Las vocales son las letras más importantes: A, E, I, O, U 🔤", "¿Cuál de estas es una vocal?", ["B", "A", "C", "D"], 1, "available"),
          q("lang1-c2", "Formando sílabas", "Una sílaba es un golpe de voz: MA-MÁ tiene 2 sílabas 👄", "¿Cuántas sílabas tiene 'GATO'?", ["1", "2", "3", "4"], 1),
          q("lang1-c3", "Más sílabas", "Cuenta los golpes: ELE-FAN-TE = 3 sílabas 🐘", "¿Cuántas sílabas tiene 'CASA'?", ["1", "2", "3", "4"], 1),
        ],
      },
      {
        id: "lang1-m2", title: "Palabras y frases", description: "Junta palabras para formar ideas completas.",
        completion: 0, status: "locked",
        challenges: [
          q("lang1-c4", "¿Qué es una frase?", "Una frase tiene sentido completo: 'El perro corre' ✅", "¿Cuál es una frase completa?", ["Y rápido", "El sol brilla", "Pero", "Cuando"], 1),
          q("lang1-c5", "Mayúscula al inicio", "Las frases empiezan con mayúscula y terminan con punto 📝", "¿Cómo empieza una frase?", ["Con minúscula", "Con mayúscula", "Con número", "Con símbolo"], 1),
          q("lang1-c6", "Punto final", "Al terminar la idea, va un punto.", "¿Qué señala el final de una frase?", ["Una coma", "Un punto", "Un guion", "Nada"], 1),
        ],
      },
      {
        id: "lang1-m3", title: "Comprensión lectora", description: "Leer no es solo decir letras, es entender.",
        completion: 0, status: "locked",
        challenges: [
          q("lang1-c7", "¿De qué trata?", "Cuando lees, pregúntate: ¿de qué se habla? 🤔", "Si un texto habla de leones, monos y elefantes, ¿de qué trata?", ["Comida", "Animales", "Ropa", "Coches"], 1),
          q("lang1-c8", "Idea principal", "La idea principal es lo más importante del texto 💡", "¿Qué es la idea principal?", ["Un detalle", "Lo más importante", "El título", "Las imágenes"], 1),
          q("lang1-c9", "Personajes", "Los personajes son quienes aparecen en una historia 🎭", "En 'Caperucita Roja', ¿quién es un personaje?", ["Un coche", "El lobo", "Una casa", "Una nube"], 1),
        ],
      },
    ],
  },
  {
    id: "lang-2", title: "Creador de Historias", description: "Desata tu imaginación y crea narrativas increíbles.",
    category: "Lenguaje", icon: "✍️", color: "power", duration: "30 min", difficulty: "beginner", rewards: 400, progress: 0, status: "locked",
    modules: [
      {
        id: "lang2-m1", title: "Inicio, nudo y desenlace", description: "Toda historia tiene 3 partes mágicas.",
        completion: 0, status: "locked",
        challenges: [
          q("lang2-c1", "Partes de un cuento", "Un cuento tiene inicio (empieza), nudo (el problema) y desenlace (se resuelve) 📖", "¿Qué parte del cuento presenta el problema?", ["Inicio", "Nudo", "Desenlace", "Título"], 1),
          q("lang2-c2", "El inicio", "En el inicio se presentan los personajes y el lugar 🏰", "¿Qué se hace en el inicio?", ["Resolver", "Presentar", "Pelear", "Terminar"], 1),
          q("lang2-c3", "El final", "El desenlace es como termina la historia: feliz, triste o sorprendente ✨", "¿Qué pasa en el desenlace?", ["Empieza", "Se complica", "Se resuelve", "Se olvida"], 2),
        ],
      },
      {
        id: "lang2-m2", title: "Personajes inolvidables", description: "Crea héroes, villanos y compañeros divertidos.",
        completion: 0, status: "locked",
        challenges: [
          q("lang2-c4", "El protagonista", "El protagonista es el personaje principal de la historia 🦸", "¿Quién es el protagonista?", ["El malo", "El principal", "Un objeto", "Nadie"], 1),
          q("lang2-c5", "El villano", "El villano es quien causa los problemas. ¡Toda historia necesita uno! 😈", "¿Qué hace un villano?", ["Ayuda", "Causa problemas", "Duerme", "Cocina"], 1),
          q("lang2-c6", "Personajes únicos", "Los mejores personajes tienen rasgos especiales: valientes, divertidos, miedosos…", "¿Qué hace especial a un personaje?", ["Que sea normal", "Sus rasgos únicos", "Su nombre largo", "Que no hable"], 1),
        ],
      },
      {
        id: "lang2-m3", title: "Imaginación al máximo", description: "Inventa mundos, criaturas y aventuras increíbles.",
        completion: 0, status: "locked",
        challenges: [
          q("lang2-c7", "Lugares mágicos", "Las historias pueden pasar en cualquier lugar: castillos, espacio, océanos 🌌", "¿Dónde puede pasar una historia?", ["Solo en casa", "En cualquier lugar", "Solo en el cole", "En ningún sitio"], 1),
          q("lang2-c8", "Criaturas inventadas", "¡Puedes inventar dragones, unicornios o monstruos amigables! 🐉", "¿Qué criatura puedes inventar?", ["Solo perros", "Cualquier cosa", "Solo gatos", "Nada"], 1),
          q("lang2-c9", "El '¿Y si…?'", "Toda historia empieza con un '¿Y si…?': ¿Y si los gatos volaran? 🐱✈️", "¿Cómo empieza una buena idea?", ["Con un '¿Y si…?'", "Con un 'No'", "Con silencio", "Con un grito"], 0),
        ],
      },
    ],
  },
  {
    id: "lang-3", title: "Palabras Poderosas", description: "Amplía tu vocabulario y comunícate mejor.",
    category: "Lenguaje", icon: "💬", color: "power", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "lang3-m1", title: "Sinónimos", description: "Diferentes palabras, mismo significado.",
        completion: 0, status: "locked",
        challenges: [
          q("lang3-c1", "Palabras gemelas", "Los sinónimos son palabras que significan lo mismo: feliz = contento 😊", "¿Cuál es sinónimo de 'grande'?", ["Pequeño", "Enorme", "Rápido", "Bonito"], 1),
          q("lang3-c2", "Sinónimo de bonito", "Hay muchas formas de decir lo mismo: bonito, lindo, hermoso 🌸", "¿Cuál es sinónimo de 'bonito'?", ["Feo", "Lindo", "Triste", "Lento"], 1),
          q("lang3-c3", "Sinónimo de rápido", "Rápido, veloz, ligero… ¡todas significan lo mismo! 💨", "¿Cuál es sinónimo de 'rápido'?", ["Lento", "Veloz", "Quieto", "Pesado"], 1),
        ],
      },
      {
        id: "lang3-m2", title: "Antónimos", description: "Palabras que significan lo contrario.",
        completion: 0, status: "locked",
        challenges: [
          q("lang3-c4", "Lo contrario", "Los antónimos son palabras opuestas: alto ↔ bajo 📏", "¿Cuál es el antónimo de 'frío'?", ["Helado", "Fresco", "Caliente", "Tibio"], 2),
          q("lang3-c5", "Día y noche", "Día y noche son antónimos: opuestos pero amigos ☀️🌙", "¿Cuál es el antónimo de 'día'?", ["Mañana", "Noche", "Tarde", "Hora"], 1),
          q("lang3-c6", "Triste o…", "Triste tiene un opuesto súper claro 😢↔😄", "¿Cuál es el antónimo de 'triste'?", ["Aburrido", "Cansado", "Feliz", "Enojado"], 2),
        ],
      },
      {
        id: "lang3-m3", title: "Palabras nuevas", description: "Aprende vocabulario que te hará brillar.",
        completion: 0, status: "locked",
        challenges: [
          q("lang3-c7", "Asombroso", "Asombroso significa increíble, sorprendente. ¡Buena palabra para usar! ✨", "¿Qué significa 'asombroso'?", ["Aburrido", "Increíble", "Pequeño", "Lento"], 1),
          q("lang3-c8", "Diminuto", "Diminuto significa muy, muy pequeño 🐜", "¿Qué significa 'diminuto'?", ["Enorme", "Muy pequeño", "Mediano", "Largo"], 1),
          q("lang3-c9", "Veloz", "Veloz significa muy rápido. ¡Como un guepardo! 🐆", "¿Qué significa 'veloz'?", ["Lento", "Quieto", "Rápido", "Pesado"], 2),
        ],
      },
    ],
  },
  {
    id: "lang-4", title: "Ortografía Secreta", description: "Domina las reglas secretas de la escritura correcta.",
    category: "Lenguaje", icon: "🔍", color: "power", duration: "25 min", difficulty: "intermediate", rewards: 400, progress: 0, status: "locked",
    modules: [
      {
        id: "lang4-m1", title: "B y V", description: "¿Cuándo se usa B y cuándo V? ¡Descúbrelo!",
        completion: 0, status: "locked",
        challenges: [
          q("lang4-c1", "B o V", "Se escribe con B las palabras que empiezan con BU, BUR, BUS ✏️", "¿Cómo se escribe correctamente?", ["Bueno", "Vueno", "Bveno", "Wueno"], 0),
          q("lang4-c2", "Verbo con V", "Los verbos terminados en -ivir se escriben con V: vivir, escribir 📜", "¿Cómo se escribe?", ["Bivir", "Vivir", "Bibir", "Vibir"], 1),
          q("lang4-c3", "Cabeza", "Cabeza, caballo, cabaña… van con B 🐴", "¿Cómo se escribe?", ["Cabeza", "Caveza", "Cabesa", "Caveza"], 0),
        ],
      },
      {
        id: "lang4-m2", title: "Tildes y acentos", description: "La tilde cambia el significado. ¡No la olvides!",
        completion: 0, status: "locked",
        challenges: [
          q("lang4-c4", "¿Qué es la tilde?", "La tilde es la rayita que va sobre algunas vocales: á, é, í, ó, ú", "¿Cuál tiene tilde?", ["Casa", "Árbol", "Mesa", "Sol"], 1),
          q("lang4-c5", "Tilde y significado", "La tilde puede cambiar todo: 'papa' (tubérculo) vs 'papá' (padre) 👨", "¿Cuál palabra significa 'padre'?", ["papa", "papá", "popa", "pipa"], 1),
          q("lang4-c6", "Palabras con tilde", "Algunas palabras siempre llevan tilde: árbol, lápiz, fácil ✏️", "¿Cuál lleva tilde?", ["Pan", "Libro", "Lápiz", "Mano"], 2),
        ],
      },
      {
        id: "lang4-m3", title: "Mayúsculas", description: "Cuándo poner mayúsculas y cuándo no.",
        completion: 0, status: "locked",
        challenges: [
          q("lang4-c7", "Inicio de frase", "Toda frase empieza con mayúscula 📝", "¿Cómo empieza una frase?", ["minúscula", "Mayúscula", "número", "símbolo"], 1),
          q("lang4-c8", "Nombres propios", "Los nombres de personas y lugares van con mayúscula: María, Madrid 🌍", "¿Cuál se escribe con mayúscula?", ["perro", "ciudad", "Pedro", "casa"], 2),
          q("lang4-c9", "Después del punto", "Después de un punto, siempre mayúscula. ¡Es la regla! .✨", "¿Qué va después de un punto?", ["minúscula", "Mayúscula", "coma", "guion"], 1),
        ],
      },
    ],
  },
  {
    id: "lang-5", title: "Hablar con Confianza", description: "Exprésate con claridad y seguridad ante todos.",
    category: "Lenguaje", icon: "🎤", color: "power", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "lang5-m1", title: "Presentarme", description: "Aprende a hablar de ti con confianza.",
        completion: 0, status: "locked",
        challenges: [
          q("lang5-c1", "Mi presentación", "Cuando te presentas, dices tu nombre, edad y algo que te gusta 🙋", "¿Qué información das al presentarte?", ["Tu contraseña", "Tu nombre y edad", "Tu dirección", "Tu nota del examen"], 1),
          q("lang5-c2", "Saludar", "Un buen saludo abre puertas: 'Hola, mucho gusto' 🤝", "¿Cómo saludas al conocer a alguien?", ["Hola, mucho gusto", "Adiós", "Cállate", "Nada"], 0),
          q("lang5-c3", "Mirar a los ojos", "Mirar a los ojos muestra confianza y respeto 👀", "¿Qué muestra mirar a los ojos al hablar?", ["Miedo", "Confianza", "Cansancio", "Aburrimiento"], 1),
        ],
      },
      {
        id: "lang5-m2", title: "Hablar claro", description: "Habla despacio y con buena voz para que te entiendan.",
        completion: 0, status: "locked",
        challenges: [
          q("lang5-c4", "Volumen correcto", "Habla ni muy bajo ni muy alto. ¡Encuentra el equilibrio! 🔊", "¿Cómo se debe hablar para que te entiendan?", ["Muy bajo", "Gritando", "Con volumen normal", "Sin hablar"], 2),
          q("lang5-c5", "Vocalizar", "Vocalizar es pronunciar bien cada palabra. ¡No te comas las letras! 👄", "¿Qué es vocalizar?", ["Cantar", "Pronunciar bien", "Susurrar", "Gritar"], 1),
          q("lang5-c6", "Hablar despacio", "Si hablas muy rápido, no te entienden. ¡Tómate tu tiempo! ⏳", "¿Qué pasa si hablas muy rápido?", ["Te entienden mejor", "No te entienden", "Suenas inteligente", "Nada"], 1),
        ],
      },
      {
        id: "lang5-m3", title: "Hablar en público", description: "Pierde el miedo a hablar frente a otros.",
        completion: 0, status: "locked",
        challenges: [
          q("lang5-c7", "Respirar antes", "Antes de hablar en público, respira hondo. Te calma 🌬️", "¿Qué hacer antes de hablar en público?", ["Correr", "Respirar hondo", "Llorar", "Esconderte"], 1),
          q("lang5-c8", "Practicar", "Practicar lo que vas a decir te da seguridad 💪", "¿Cómo te preparas para hablar en público?", ["No pensar", "Practicando", "Dormir", "Comer mucho"], 1),
          q("lang5-c9", "Sonreír", "Una sonrisa rompe el hielo y te conecta con el público 😊", "¿Qué ayuda al hablar en público?", ["Estar serio", "Sonreír", "Mirar al suelo", "Hablar bajito"], 1),
        ],
      },
    ],
  },
  {
    id: "lang-6", title: "Escucha de Detective", description: "Entrena tu oído para comprender mejor todo lo que escuchas.",
    category: "Lenguaje", icon: "👂", color: "power", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "lang6-m1", title: "Escuchar con atención", description: "Escuchar no es solo oír, es entender.",
        completion: 0, status: "locked",
        challenges: [
          q("lang6-c1", "¿Qué dijeron?", "Escuchar bien significa prestar atención a las palabras y su significado 🎧", "¿Qué haces para escuchar mejor?", ["Hablar al mismo tiempo", "Prestar atención", "Mirar el celular", "Pensar en otra cosa"], 1),
          q("lang6-c2", "No interrumpir", "Deja que la otra persona termine antes de hablar tú 🤐", "¿Qué NO debes hacer al escuchar?", ["Mirar", "Asentir", "Interrumpir", "Pensar"], 2),
          q("lang6-c3", "Mostrar interés", "Asentir con la cabeza muestra que estás escuchando 🙂", "¿Cómo muestras que escuchas?", ["Mirando otro lado", "Asintiendo", "Bostezando", "Hablando"], 1),
        ],
      },
      {
        id: "lang6-m2", title: "Captar detalles", description: "Los detectives escuchan TODO, hasta lo pequeño.",
        completion: 0, status: "locked",
        challenges: [
          q("lang6-c4", "Detalles importantes", "Las palabras 'siempre', 'nunca', 'a veces' cambian el significado 🔍", "Si dicen 'siempre llueve los lunes', ¿qué significa?", ["A veces llueve", "Todos los lunes llueve", "Nunca llueve", "Llueve mañana"], 1),
          q("lang6-c5", "Tono de voz", "El tono dice mucho: enojado, alegre, triste 🎭", "¿Qué nos dice el tono de voz?", ["Nada", "La emoción", "La hora", "El día"], 1),
          q("lang6-c6", "Recordar", "Después de escuchar, intenta recordar lo importante 🧠", "¿Qué haces después de escuchar?", ["Olvidar todo", "Recordar lo importante", "Pelear", "Salir"], 1),
        ],
      },
      {
        id: "lang6-m3", title: "Comprender órdenes", description: "Entiende instrucciones de varios pasos sin perderte.",
        completion: 0, status: "locked",
        challenges: [
          q("lang6-c7", "Seguir pasos", "Cuando te dan instrucciones, hazlas en orden 📋", "Si te dicen 'guarda los libros y luego barre', ¿qué haces primero?", ["Barrer", "Guardar libros", "Las dos a la vez", "Nada"], 1),
          q("lang6-c8", "Preguntar dudas", "Si no entiendes algo, ¡pregunta! No es malo ❓", "¿Qué haces si no entiendes una instrucción?", ["Te quedas callado", "Preguntas", "Adivinas", "Te vas"], 1),
          q("lang6-c9", "Repetir", "Repetir lo que escuchaste te ayuda a recordarlo 🔁", "¿Cómo confirmas que entendiste?", ["Sin decir nada", "Repitiéndolo", "Llorando", "Riéndote"], 1),
        ],
      },
    ],
  },

  // ===== CIENCIAS =====
  {
    id: "sci-1", title: "Explorador del Mundo", description: "Descubre la naturaleza y el entorno que te rodea.",
    category: "Ciencias", icon: "🌿", color: "xp", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "available",
    modules: [
      {
        id: "sci1-m1", title: "Seres vivos", description: "¿Qué está vivo y qué no? ¡Descúbrelo!",
        completion: 0, status: "available",
        challenges: [
          q("sci1-c1", "¿Está vivo?", "Los seres vivos nacen, crecen, se reproducen y mueren 🌱", "¿Cuál es un ser vivo?", ["Piedra", "Árbol", "Mesa", "Agua"], 1, "available"),
          q("sci1-c2", "Necesidades", "Los seres vivos necesitan agua, alimento y aire para vivir 💧", "¿Qué necesita una planta para vivir?", ["WiFi", "Agua y sol", "Juguetes", "Televisión"], 1),
          q("sci1-c3", "Crecer", "Todos los seres vivos crecen con el tiempo 🌳", "¿Qué hacen los seres vivos con el tiempo?", ["Encogen", "Crecen", "Desaparecen", "Nada"], 1),
        ],
      },
      {
        id: "sci1-m2", title: "Plantas y árboles", description: "Las plantas son el pulmón verde del planeta 🌳",
        completion: 0, status: "locked",
        challenges: [
          q("sci1-c4", "Partes de una planta", "Una planta tiene raíz, tallo, hojas y a veces flores 🌻", "¿Qué parte de la planta está bajo tierra?", ["Hojas", "Tallo", "Raíz", "Flor"], 2),
          q("sci1-c5", "Fotosíntesis", "Las plantas hacen su comida con luz del sol. ¡Mágico! ☀️", "¿Qué necesitan las plantas para hacer su comida?", ["Carne", "Luz del sol", "Pizza", "Refrescos"], 1),
          q("sci1-c6", "Oxígeno", "Las plantas nos dan oxígeno para respirar 🌬️", "¿Qué nos dan las plantas?", ["Veneno", "Oxígeno", "Humo", "Ruido"], 1),
        ],
      },
      {
        id: "sci1-m3", title: "Clima y estaciones", description: "Primavera, verano, otoño, invierno: el ciclo de la naturaleza.",
        completion: 0, status: "locked",
        challenges: [
          q("sci1-c7", "Las 4 estaciones", "El año tiene 4 estaciones que se repiten siempre 🍂❄️🌸☀️", "¿Cuántas estaciones hay?", ["2", "3", "4", "5"], 2),
          q("sci1-c8", "Verano e invierno", "En verano hace calor y en invierno hace frío 🌡️", "¿En qué estación hace más frío?", ["Verano", "Invierno", "Primavera", "Otoño"], 1),
          q("sci1-c9", "Primavera", "En primavera las flores nacen y los árboles se llenan de hojas 🌸", "¿Qué pasa en primavera?", ["Cae nieve", "Nacen flores", "Caen hojas", "Hace mucho calor"], 1),
        ],
      },
    ],
  },
  {
    id: "sci-2", title: "Mini Científico", description: "Haz experimentos simples y piensa como un científico.",
    category: "Ciencias", icon: "🧪", color: "xp", duration: "30 min", difficulty: "beginner", rewards: 400, progress: 0, status: "locked",
    modules: [
      {
        id: "sci2-m1", title: "El método científico", description: "Observar, preguntar, experimentar, concluir.",
        completion: 0, status: "locked",
        challenges: [
          q("sci2-c1", "Pasos del científico", "Un científico primero observa, luego pregunta, experimenta y saca conclusiones 🔬", "¿Qué hace primero un científico?", ["Concluir", "Experimentar", "Observar", "Adivinar"], 2),
          q("sci2-c2", "Hipótesis", "Una hipótesis es una idea que crees que puede ser cierta. Hay que probarla 💡", "¿Qué es una hipótesis?", ["Una verdad", "Una idea por probar", "Una mentira", "Un experimento"], 1),
          q("sci2-c3", "Conclusión", "Después del experimento, sacas una conclusión: lo que aprendiste ✅", "¿Cuándo sacas una conclusión?", ["Antes de empezar", "Después del experimento", "Nunca", "En cualquier momento"], 1),
        ],
      },
      {
        id: "sci2-m2", title: "Estados de la materia", description: "Sólido, líquido, gaseoso. ¡Todo cambia!",
        completion: 0, status: "locked",
        challenges: [
          q("sci2-c4", "Tres estados", "La materia puede estar en 3 estados: sólido, líquido o gaseoso 💧", "¿En qué estado está el hielo?", ["Líquido", "Sólido", "Gaseoso", "Ninguno"], 1),
          q("sci2-c5", "El agua", "El agua puede ser hielo, agua líquida o vapor. ¡La misma cosa, distintas formas! 💨", "¿En qué estado está el vapor?", ["Sólido", "Líquido", "Gaseoso", "Ninguno"], 2),
          q("sci2-c6", "Cambio de estado", "Si calientas hielo, se vuelve agua. ¡Cambio de estado! 🔥", "¿Qué pasa con el hielo al calentarlo?", ["Se hace más duro", "Se vuelve agua", "Desaparece", "Cambia de color"], 1),
        ],
      },
      {
        id: "sci2-m3", title: "Experimentos seguros", description: "Diviértete con la ciencia sin romper nada.",
        completion: 0, status: "locked",
        challenges: [
          q("sci2-c7", "Seguridad primero", "Antes de un experimento, siempre piensa en la seguridad 🦺", "¿Qué es lo primero al experimentar?", ["Correr", "Pensar en seguridad", "Gritar", "Romper cosas"], 1),
          q("sci2-c8", "Pedir ayuda", "Algunos experimentos necesitan a un adulto cerca 👨‍🔬", "¿Cuándo pides ayuda a un adulto?", ["Nunca", "Para cosas peligrosas", "Solo si te aburres", "Para todo"], 1),
          q("sci2-c9", "Anotar resultados", "Apunta lo que ves para no olvidarlo 📓", "¿Por qué se anotan los resultados?", ["Por aburrimiento", "Para recordarlos", "Para borrarlos", "No se anotan"], 1),
        ],
      },
    ],
  },
  {
    id: "sci-3", title: "Cazador de Animales", description: "Conoce la fauna básica y sus características.",
    category: "Ciencias", icon: "🦁", color: "xp", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "sci3-m1", title: "Mamíferos", description: "Animales con pelo que dan leche a sus crías.",
        completion: 0, status: "locked",
        challenges: [
          q("sci3-c1", "¿Qué es un mamífero?", "Los mamíferos tienen pelo y alimentan a sus crías con leche 🐄", "¿Cuál es un mamífero?", ["Serpiente", "Pez", "Perro", "Rana"], 2),
          q("sci3-c2", "Mamíferos del agua", "¡Hay mamíferos en el agua también! Como las ballenas y delfines 🐋", "¿Cuál es un mamífero acuático?", ["Tiburón", "Delfín", "Pulpo", "Cangrejo"], 1),
          q("sci3-c3", "Mamífero volador", "El murciélago es el único mamífero que vuela 🦇", "¿Qué mamífero vuela?", ["Águila", "Murciélago", "Mariposa", "Loro"], 1),
        ],
      },
      {
        id: "sci3-m2", title: "Aves, peces y reptiles", description: "Cada grupo tiene su superpoder.",
        completion: 0, status: "locked",
        challenges: [
          q("sci3-c4", "Las aves", "Las aves tienen plumas, ponen huevos y la mayoría vuela 🦅", "¿Qué tienen las aves?", ["Pelo", "Escamas", "Plumas", "Pelaje"], 2),
          q("sci3-c5", "Los peces", "Los peces viven en el agua y respiran por branquias 🐟", "¿Cómo respiran los peces?", ["Con pulmones", "Con branquias", "Con nariz", "No respiran"], 1),
          q("sci3-c6", "Los reptiles", "Los reptiles tienen escamas. Como las serpientes y lagartos 🦎", "¿Cuál es un reptil?", ["Pato", "Lagarto", "Caballo", "Pez"], 1),
        ],
      },
      {
        id: "sci3-m3", title: "Hábitats", description: "Cada animal vive donde mejor le va.",
        completion: 0, status: "locked",
        challenges: [
          q("sci3-c7", "El desierto", "En el desierto hace mucho calor y poca agua. Solo viven los más fuertes 🏜️", "¿Qué animal vive en el desierto?", ["Pingüino", "Camello", "Oso polar", "Foca"], 1),
          q("sci3-c8", "Polo Norte", "En el Polo Norte hace mucho frío. Allí viven los osos polares ❄️", "¿Qué animal vive en el Polo Norte?", ["León", "Oso polar", "Mono", "Tucán"], 1),
          q("sci3-c9", "La selva", "La selva es húmeda y verde, llena de animales exóticos 🌴", "¿Qué animal vive en la selva?", ["Pingüino", "Tucán", "Camello", "Foca"], 1),
        ],
      },
    ],
  },
  {
    id: "sci-4", title: "Guardianes del Planeta", description: "Cuida el medio ambiente y conviértete en héroe ecológico.",
    category: "Ciencias", icon: "🌍", color: "xp", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "sci4-m1", title: "Las 3 R", description: "Reducir, Reutilizar, Reciclar.",
        completion: 0, status: "locked",
        challenges: [
          q("sci4-c1", "Reciclar", "Reciclar es transformar basura en algo nuevo. ¡El papel se puede reciclar! ♻️", "¿Qué significa reciclar?", ["Tirar todo", "Transformar basura en algo nuevo", "Quemar basura", "Esconder basura"], 1),
          q("sci4-c2", "Reducir", "Reducir es usar menos cosas. Menos basura = mejor planeta 🌱", "¿Qué significa reducir?", ["Usar más", "Usar menos", "No usar", "Comprar mucho"], 1),
          q("sci4-c3", "Reutilizar", "Reutilizar es darle otra vida a algo. ¡Una botella vacía puede ser un florero! 🌸", "¿Qué es reutilizar?", ["Tirar", "Comprar nuevo", "Usar de otra forma", "Romper"], 2),
        ],
      },
      {
        id: "sci4-m2", title: "Ahorro de agua y luz", description: "Cuidar los recursos también salva el planeta.",
        completion: 0, status: "locked",
        challenges: [
          q("sci4-c4", "Cerrar el grifo", "No dejes el grifo abierto al lavarte los dientes. ¡Ahorra agua! 🚰", "¿Qué hacer al lavarte los dientes?", ["Dejar grifo abierto", "Cerrar el grifo", "No lavarte", "Llenar el lavabo"], 1),
          q("sci4-c5", "Apagar luces", "Apaga las luces cuando salgas de un cuarto 💡", "¿Qué haces al salir de un cuarto?", ["Dejar luz", "Apagarla", "Romper la lámpara", "Nada"], 1),
          q("sci4-c6", "Ducha corta", "Una ducha corta usa mucha menos agua que una larga 🚿", "¿Qué tipo de ducha ahorra agua?", ["Larga", "Corta", "Doble", "Triple"], 1),
        ],
      },
      {
        id: "sci4-m3", title: "Contaminación", description: "Conoce al enemigo del planeta para vencerlo.",
        completion: 0, status: "locked",
        challenges: [
          q("sci4-c7", "Basura en el suelo", "Tirar basura al suelo contamina y mata animales 😢", "¿Qué pasa si tiras basura al suelo?", ["Nada", "Contaminas", "Ayudas", "Crece una planta"], 1),
          q("sci4-c8", "Aire sucio", "Los coches y fábricas ensucian el aire. ¡Camina si puedes! 🚶", "¿Qué ensucia el aire?", ["Las flores", "Los coches", "Los árboles", "El sol"], 1),
          q("sci4-c9", "Plásticos", "El plástico tarda cientos de años en desaparecer. ¡Úsalo poco! 🥤", "¿Qué problema tiene el plástico?", ["Es bonito", "Tarda mucho en desaparecer", "Es comestible", "No hay problema"], 1),
        ],
      },
    ],
  },
  {
    id: "sci-5", title: "Física Divertida", description: "Fuerzas, movimiento y energía explicados sin aburrirte.",
    category: "Ciencias", icon: "⚡", color: "xp", duration: "30 min", difficulty: "intermediate", rewards: 450, progress: 0, status: "locked",
    modules: [
      {
        id: "sci5-m1", title: "Fuerzas", description: "Empujar, jalar… ¡todo es fuerza!",
        completion: 0, status: "locked",
        challenges: [
          q("sci5-c1", "¿Qué es una fuerza?", "Una fuerza es un empujón o un jalón que mueve las cosas 💪", "¿Qué pasa cuando empujas una pelota?", ["Desaparece", "Se mueve", "Se encoge", "Se derrite"], 1),
          q("sci5-c2", "Gravedad", "La gravedad es la fuerza que tira las cosas hacia abajo 🍎", "¿Por qué cae una manzana?", ["Por la gravedad", "Por el viento", "Porque quiere", "Por magia"], 0),
          q("sci5-c3", "Fricción", "La fricción frena los objetos. Por eso no resbalas siempre 👟", "¿Qué hace la fricción?", ["Acelera", "Frena", "Desaparece", "Nada"], 1),
        ],
      },
      {
        id: "sci5-m2", title: "Movimiento", description: "Todo se mueve, hasta lo que parece quieto.",
        completion: 0, status: "locked",
        challenges: [
          q("sci5-c4", "Velocidad", "La velocidad es qué tan rápido se mueve algo 🏃", "¿Quién va más rápido?", ["Una tortuga", "Un coche", "Un caracol", "Una piedra"], 1),
          q("sci5-c5", "Reposo", "Algo está en reposo cuando no se mueve 🪑", "¿Qué significa estar en reposo?", ["Correr", "Saltar", "No moverse", "Volar"], 2),
          q("sci5-c6", "Empujar para mover", "Para mover algo en reposo, hay que empujarlo o jalarlo", "¿Cómo se mueve una caja quieta?", ["Sola", "Empujándola", "Mirándola", "Cantando"], 1),
        ],
      },
      {
        id: "sci5-m3", title: "Energía", description: "Energía está en todas partes: luz, sonido, calor, movimiento.",
        completion: 0, status: "locked",
        challenges: [
          q("sci5-c7", "Tipos de energía", "Hay energía solar, eólica (viento), eléctrica… ¡muchas! ⚡", "¿De dónde viene la energía solar?", ["Del viento", "Del sol", "Del agua", "Del fuego"], 1),
          q("sci5-c8", "Calor", "El calor es una forma de energía. ¡El sol nos da calor! 🌡️", "¿De qué tipo de energía es el calor?", ["No es energía", "Es energía", "Es magia", "Es sonido"], 1),
          q("sci5-c9", "Energía limpia", "La energía solar y eólica son limpias: no contaminan 🌬️☀️", "¿Cuál es energía limpia?", ["Petróleo", "Carbón", "Solar", "Humo"], 2),
        ],
      },
    ],
  },
  {
    id: "sci-6", title: "El Cuerpo Humano", description: "Conoce cómo funciona tu cuerpo por dentro.",
    category: "Ciencias", icon: "🫀", color: "xp", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "sci6-m1", title: "Los sentidos", description: "Vista, oído, olfato, gusto y tacto.",
        completion: 0, status: "locked",
        challenges: [
          q("sci6-c1", "Los 5 sentidos", "Tenemos 5 sentidos para conocer el mundo: ver, oír, oler, gustar y tocar 👁️", "¿Con qué sentido hueles las flores?", ["Vista", "Tacto", "Olfato", "Gusto"], 2),
          q("sci6-c2", "El gusto", "El sentido del gusto está en la lengua. Distingue dulce, salado, ácido y amargo 👅", "¿Dónde está el sentido del gusto?", ["En los ojos", "En la lengua", "En las manos", "En las orejas"], 1),
          q("sci6-c3", "El tacto", "El tacto está en la piel. Te dice si algo es suave, áspero, frío o caliente ✋", "¿Dónde está el sentido del tacto?", ["En la piel", "En los dientes", "En el pelo", "En los huesos"], 0),
        ],
      },
      {
        id: "sci6-m2", title: "Órganos clave", description: "Corazón, pulmones, cerebro: tus máquinas internas.",
        completion: 0, status: "locked",
        challenges: [
          q("sci6-c4", "El corazón", "El corazón bombea sangre por todo el cuerpo. ¡Nunca para! 🫀", "¿Qué hace el corazón?", ["Pensar", "Bombear sangre", "Respirar", "Digerir"], 1),
          q("sci6-c5", "Los pulmones", "Los pulmones te ayudan a respirar oxígeno 🫁", "¿Qué hacen los pulmones?", ["Caminan", "Respiran", "Comen", "Duermen"], 1),
          q("sci6-c6", "El cerebro", "El cerebro es el jefe del cuerpo: piensa, recuerda y manda órdenes 🧠", "¿Qué hace el cerebro?", ["Bombear sangre", "Pensar", "Digerir", "Respirar"], 1),
        ],
      },
      {
        id: "sci6-m3", title: "Hábitos saludables", description: "Cuida tu cuerpo y te durará toda la vida.",
        completion: 0, status: "locked",
        challenges: [
          q("sci6-c7", "Lavarse las manos", "Lavarse las manos elimina gérmenes y evita enfermedades 🧼", "¿Cuándo lavarse las manos?", ["Nunca", "Antes de comer", "Solo el lunes", "Solo en piscinas"], 1),
          q("sci6-c8", "Dormir bien", "Dormir 8-10 horas te ayuda a crecer y estar de buen humor 😴", "¿Cuántas horas debe dormir un niño?", ["2", "4", "6", "8-10"], 3),
          q("sci6-c9", "Hacer ejercicio", "Mover el cuerpo te mantiene fuerte y saludable 🏃", "¿Por qué hacer ejercicio?", ["Para aburrirte", "Para estar fuerte y sano", "Por castigo", "Sin razón"], 1),
        ],
      },
    ],
  },

  // ===== CREATIVIDAD =====
  {
    id: "art-1", title: "Artista Total", description: "Dibujo, colores y técnicas para expresarte.",
    category: "Arte", icon: "🖌️", color: "streak", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "available",
    modules: [
      {
        id: "art1-m1", title: "Colores primarios", description: "Rojo, azul y amarillo: los padres de todos los colores.",
        completion: 0, status: "available",
        challenges: [
          q("art1-c1", "Mezcla de colores", "Si mezclas rojo + amarillo obtienes naranja. ¡Magia de colores! 🎨", "¿Qué color sale de mezclar azul + amarillo?", ["Rojo", "Verde", "Naranja", "Morado"], 1, "available"),
          q("art1-c2", "Colores primarios", "Rojo, azul y amarillo son los 3 colores primarios 🔴🔵🟡", "¿Cuál NO es un color primario?", ["Rojo", "Verde", "Azul", "Amarillo"], 1),
          q("art1-c3", "Rojo + azul", "Rojo y azul juntos hacen morado, el color de los reyes 👑", "¿Qué sale de mezclar rojo + azul?", ["Verde", "Naranja", "Morado", "Rosa"], 2),
        ],
      },
      {
        id: "art1-m2", title: "Colores cálidos y fríos", description: "Cada color tiene una temperatura. ¡Y una emoción!",
        completion: 0, status: "locked",
        challenges: [
          q("art1-c4", "Cálidos", "Rojo, naranja y amarillo son cálidos. Recuerdan al fuego 🔥", "¿Qué color es cálido?", ["Azul", "Rojo", "Verde", "Morado"], 1),
          q("art1-c5", "Fríos", "Azul, verde y morado son fríos. Recuerdan al hielo y al mar 🧊", "¿Qué color es frío?", ["Naranja", "Amarillo", "Azul", "Rojo"], 2),
          q("art1-c6", "Color y emoción", "El amarillo da alegría, el azul calma. ¡Los colores tienen poder!", "¿Qué color suele dar calma?", ["Rojo", "Azul", "Naranja", "Negro"], 1),
        ],
      },
      {
        id: "art1-m3", title: "Técnicas de dibujo", description: "Trazos básicos para empezar a dibujar lo que quieras.",
        completion: 0, status: "locked",
        challenges: [
          q("art1-c7", "Líneas", "Todo dibujo empieza con líneas: rectas, curvas, onduladas ✏️", "¿Con qué empieza un dibujo?", ["Colores", "Líneas", "Sombras", "Borrar"], 1),
          q("art1-c8", "Formas básicas", "Casi todo se puede dibujar con círculos, cuadrados y triángulos ⚪🟦🔺", "¿Con qué formas se hacen muchos dibujos?", ["Solo cuadrados", "Solo círculos", "Formas básicas", "Solo líneas"], 2),
          q("art1-c9", "Borrar y mejorar", "Borrar no es fracasar, es mejorar. ¡Los artistas borran mucho! 🧽", "¿Está mal borrar al dibujar?", ["Sí, está mal", "No, mejora", "Solo a veces", "Nunca"], 1),
        ],
      },
    ],
  },
  {
    id: "art-2", title: "Creador de Ideas", description: "Libera tu creatividad sin límites.",
    category: "Arte", icon: "💡", color: "streak", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "art2-m1", title: "Lluvia de ideas", description: "No hay ideas malas, solo ideas que aún no brillan.",
        completion: 0, status: "locked",
        challenges: [
          q("art2-c1", "Pensar diferente", "La creatividad es ver las cosas de formas nuevas. ¡No hay respuestas malas! 🌈", "¿Qué es la creatividad?", ["Copiar a otros", "Pensar de formas nuevas", "Hacer lo mismo siempre", "No pensar"], 1),
          q("art2-c2", "Cantidad importa", "En lluvia de ideas, ¡cuantas más, mejor! Después se eligen las mejores 🧠", "¿Qué es importante en una lluvia de ideas?", ["Tener muchas ideas", "Tener una sola", "No tener ideas", "Copiar"], 0),
          q("art2-c3", "No juzgar", "No critiques las ideas al inicio. Primero suéltalas, luego elige 💭", "¿Qué NO hacer al lluvia de ideas?", ["Pensar mucho", "Juzgar al inicio", "Apuntar todo", "Imaginar"], 1),
        ],
      },
      {
        id: "art2-m2", title: "Combinar ideas raras", description: "Las mejores ideas nacen de combinar cosas extrañas.",
        completion: 0, status: "locked",
        challenges: [
          q("art2-c4", "Mezclar conceptos", "Pizza + helado = ¿algo nuevo? La creatividad mezcla cosas raras 🍕🍦", "¿Qué hacer para tener ideas nuevas?", ["Copiar", "Mezclar cosas distintas", "Repetir lo de siempre", "No pensar"], 1),
          q("art2-c5", "Cambiar el uso", "¿Y si una silla fuera una mesa? Cambia el uso normal de algo 🪑", "¿Qué es pensar diferente?", ["Hacer lo normal", "Darle otro uso a las cosas", "No usar nada", "Romper todo"], 1),
          q("art2-c6", "Imaginar lo imposible", "Si todo fuera posible, ¿qué inventarías? 🦄", "¿Qué pasa cuando imaginas lo imposible?", ["Nada", "Nacen ideas geniales", "Te aburres", "Te equivocas"], 1),
        ],
      },
      {
        id: "art2-m3", title: "De la idea a la acción", description: "Tener ideas es genial, hacerlas realidad es mejor.",
        completion: 0, status: "locked",
        challenges: [
          q("art2-c7", "Empezar pequeño", "No esperes a tener todo listo. Empieza con poco y mejora ✨", "¿Cómo empezar un proyecto nuevo?", ["Esperando años", "Con algo pequeño", "Sin empezar nunca", "Solo pensando"], 1),
          q("art2-c8", "Equivocarse está bien", "Equivocarse es parte de crear. ¡Cada error te enseña! 🛠️", "¿Qué pasa si te equivocas creando?", ["Eres malo", "Aprendes", "Hay que rendirse", "Es el fin"], 1),
          q("art2-c9", "Compartir", "Cuando creas algo, compártelo. ¡Inspira a otros! 🎁", "¿Qué hacer con lo que creas?", ["Esconderlo", "Compartirlo", "Romperlo", "Olvidarlo"], 1),
        ],
      },
    ],
  },
  {
    id: "art-3", title: "Música en Movimiento", description: "Ritmo, sonidos y mucha diversión musical.",
    category: "Arte", icon: "🎵", color: "streak", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "art3-m1", title: "El ritmo", description: "Todo tiene ritmo: tu corazón, las canciones, tus pasos.",
        completion: 0, status: "locked",
        challenges: [
          q("art3-c1", "¿Qué es el ritmo?", "El ritmo es un patrón de sonidos que se repite. ¡Tu corazón tiene ritmo! 💓", "¿Qué tiene ritmo?", ["Una piedra", "El latido del corazón", "Un libro cerrado", "Una silla"], 1),
          q("art3-c2", "Marcar el ritmo", "Puedes marcar el ritmo con palmas, pies o golpes en la mesa 👏", "¿Con qué marcar el ritmo?", ["Solo con tambor", "Palmas o pies", "Solo cantando", "En silencio"], 1),
          q("art3-c3", "Rápido y lento", "El ritmo puede ser rápido (alegre) o lento (calmado) 🎶", "¿Cómo suele ser el ritmo de una canción alegre?", ["Lento", "Rápido", "Sin sonido", "Triste"], 1),
        ],
      },
      {
        id: "art3-m2", title: "Instrumentos", description: "Cuerda, viento, percusión: cada uno suena distinto.",
        completion: 0, status: "locked",
        challenges: [
          q("art3-c4", "Cuerda", "Guitarra, violín, piano… son instrumentos de cuerda 🎸", "¿Cuál es de cuerda?", ["Tambor", "Guitarra", "Flauta", "Trompeta"], 1),
          q("art3-c5", "Viento", "Flauta, trompeta y saxofón se tocan soplando 🎺", "¿Cuál es de viento?", ["Piano", "Tambor", "Flauta", "Maracas"], 2),
          q("art3-c6", "Percusión", "Tambores, maracas y panderetas se tocan golpeando 🥁", "¿Cuál es de percusión?", ["Violín", "Tambor", "Flauta", "Guitarra"], 1),
        ],
      },
      {
        id: "art3-m3", title: "Cantar y moverse", description: "La música es para vivirla con todo el cuerpo.",
        completion: 0, status: "locked",
        challenges: [
          q("art3-c7", "Cantar suelta emociones", "Cantar te alegra y libera estrés 🎤", "¿Para qué sirve cantar?", ["Para nada", "Liberar emociones", "Aburrirte", "Cansarte"], 1),
          q("art3-c8", "Bailar", "Bailar es mover el cuerpo con la música. ¡No importa si lo haces 'bien'! 💃", "¿Hay una sola forma de bailar?", ["Sí", "No, hay muchas", "Solo una", "Nadie sabe"], 1),
          q("art3-c9", "Música y emoción", "La música puede ponerte alegre, triste o emocionado 🎶", "¿Qué provoca la música?", ["Nada", "Emociones", "Hambre", "Sueño"], 1),
        ],
      },
    ],
  },
  {
    id: "art-4", title: "Actor Imparable", description: "Expresión corporal y teatral para brillar en escena.",
    category: "Arte", icon: "🎭", color: "streak", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "art4-m1", title: "Expresar emociones", description: "Tu cuerpo y cara pueden decir mucho sin palabras.",
        completion: 0, status: "locked",
        challenges: [
          q("art4-c1", "Lenguaje corporal", "Puedes mostrar alegría, tristeza o sorpresa solo con tu cara y cuerpo 🎭", "¿Cómo muestras que estás feliz?", ["Llorando", "Sonriendo", "Gritando", "Durmiendo"], 1),
          q("art4-c2", "Cara de sorpresa", "La sorpresa abre los ojos y la boca: '¡Oh!' 😲", "¿Cómo se ve una cara de sorpresa?", ["Cerrada", "Ojos y boca abiertos", "Triste", "Aburrida"], 1),
          q("art4-c3", "Enfado", "El enfado frunce el ceño y aprieta la boca 😠", "¿Cómo se ve enojado?", ["Sonriendo", "Llorando", "Ceño fruncido", "Bostezando"], 2),
        ],
      },
      {
        id: "art4-m2", title: "Imitar personajes", description: "Conviértete en otra persona, animal o cosa.",
        completion: 0, status: "locked",
        challenges: [
          q("art4-c4", "Imitar animales", "Imitar a un león o un mono es divertido y desarrolla la creatividad 🦁", "¿Para qué sirve imitar animales?", ["Para nada", "Para ser creativo", "Para asustarte", "Para dormir"], 1),
          q("art4-c5", "Personaje fuerte", "Un personaje fuerte camina derecho y habla con voz firme 💪", "¿Cómo camina un personaje fuerte?", ["Encorvado", "Derecho", "Saltando", "Acostado"], 1),
          q("art4-c6", "Personaje miedoso", "Un personaje miedoso encoge los hombros y habla bajito 😨", "¿Cómo habla un personaje miedoso?", ["Gritando", "Bajito", "Cantando", "Riendo"], 1),
        ],
      },
      {
        id: "art4-m3", title: "Improvisar", description: "Actuar sin guion: la magia de inventar en el momento.",
        completion: 0, status: "locked",
        challenges: [
          q("art4-c7", "Decir 'sí, y…'", "Para improvisar, acepta lo que el otro propone y añade algo: 'sí, y…' 🎬", "¿Qué decir al improvisar con otro?", ["No", "Sí, y…", "Cállate", "Adiós"], 1),
          q("art4-c8", "No tener miedo", "Improvisar es divertirse. Si te equivocas, sigue actuando 🎉", "¿Qué hacer si te equivocas improvisando?", ["Llorar", "Salir corriendo", "Seguir actuando", "Pedir perdón mil veces"], 2),
          q("art4-c9", "Escuchar al otro", "Para improvisar bien, escucha mucho a tu compañero 👂", "¿Qué es clave al improvisar con alguien?", ["Hablar mucho", "Escuchar", "Ignorarlo", "Irte"], 1),
        ],
      },
    ],
  },
  {
    id: "art-5", title: "Diseñador Creativo", description: "Composición, formas y diseño visual.",
    category: "Arte", icon: "🎨", color: "streak", duration: "25 min", difficulty: "intermediate", rewards: 400, progress: 0, status: "locked",
    modules: [
      {
        id: "art5-m1", title: "Composición", description: "Aprende a organizar elementos de forma armoniosa.",
        completion: 0, status: "locked",
        challenges: [
          q("art5-c1", "Equilibrio visual", "En un buen diseño, los elementos están bien distribuidos, no todo amontonado 🖼️", "¿Qué es importante en un buen diseño?", ["Poner todo junto", "Equilibrio y orden", "Usar solo negro", "No pensar"], 1),
          q("art5-c2", "Centro de atención", "Todo diseño debe tener un punto que llame la atención 👁️", "¿Qué tiene un buen diseño?", ["Nada destacado", "Un punto que destaca", "Todo igual", "Solo texto"], 1),
          q("art5-c3", "Espacio en blanco", "El espacio vacío también es parte del diseño. ¡Deja respirar! 🫁", "¿Qué hace el espacio en blanco?", ["Estorba", "Deja respirar", "Es feo", "No sirve"], 1),
        ],
      },
      {
        id: "art5-m2", title: "Tipografía", description: "Las letras también son diseño.",
        completion: 0, status: "locked",
        challenges: [
          q("art5-c4", "Letra legible", "Una buena letra se lee fácil. Sin trucos raros 📖", "¿Cómo debe ser una letra para leerse?", ["Muy adornada", "Legible", "Pequeña", "Borrosa"], 1),
          q("art5-c5", "Tamaño importa", "Las cosas importantes van más grandes 🔠", "¿Qué letras son más grandes?", ["Las que no importan", "Las importantes", "Todas iguales", "Las pequeñas"], 1),
          q("art5-c6", "No usar muchas fuentes", "Mezclar muchas tipografías es un caos. Usa 1-2 máximo ✏️", "¿Cuántas tipografías usar?", ["10", "1-2", "Todas", "Ninguna"], 1),
        ],
      },
      {
        id: "art5-m3", title: "Color en el diseño", description: "Elige colores que comuniquen lo que quieres.",
        completion: 0, status: "locked",
        challenges: [
          q("art5-c7", "Paleta limitada", "Es mejor usar pocos colores bien elegidos que muchos al azar 🎨", "¿Cómo elegir colores en un diseño?", ["Todos a la vez", "Pocos y bien elegidos", "Solo blanco y negro", "Al azar"], 1),
          q("art5-c8", "Contraste", "El contraste hace que destaquen las cosas. Negro sobre blanco resalta ⚫⚪", "¿Para qué sirve el contraste?", ["Esconder", "Hacer destacar", "Confundir", "Aburrir"], 1),
          q("art5-c9", "Color y emoción", "Los colores transmiten emociones. Rojo = pasión, azul = calma 💙❤️", "¿Qué color transmite calma?", ["Rojo", "Azul", "Naranja", "Negro"], 1),
        ],
      },
    ],
  },

  // ===== LÓGICA =====
  {
    id: "log-1", title: "Detective de Problemas", description: "Resuelve situaciones simples paso a paso.",
    category: "Lógica", icon: "🔎", color: "energy", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "available",
    modules: [
      {
        id: "log1-m1", title: "Pensar paso a paso", description: "Todo problema se resuelve mejor si lo divides en pasos.",
        completion: 0, status: "available",
        challenges: [
          q("log1-c1", "Paso a paso", "Para resolver un problema, primero entiéndelo, luego piensa opciones y elige la mejor 🧩", "¿Qué haces primero para resolver un problema?", ["Gritar", "Entenderlo", "Ignorarlo", "Llorar"], 1, "available"),
          q("log1-c2", "Causa y efecto", "Si llueve, el suelo se moja. Cada acción tiene un efecto ☔", "Si no riegas una planta, ¿qué pasa?", ["Crece más", "Se seca", "Florece", "Nada"], 1),
          q("log1-c3", "Dividir el problema", "Un problema grande se vuelve fácil si lo divides en partes pequeñas 🧠", "¿Cómo se vuelve fácil un problema grande?", ["No pensándolo", "Dividiéndolo", "Ignorándolo", "Llorando"], 1),
        ],
      },
      {
        id: "log1-m2", title: "Buscar pistas", description: "Como un detective, observa los detalles 🕵️",
        completion: 0, status: "locked",
        challenges: [
          q("log1-c4", "Observar bien", "Mirar con atención te da pistas que otros no ven 🔍", "¿Qué hacen los detectives?", ["Adivinan", "Observan con atención", "Cierran los ojos", "Corren"], 1),
          q("log1-c5", "Hacer preguntas", "Las preguntas son la herramienta del detective: ¿quién, qué, cuándo, dónde, por qué? ❓", "¿Qué hace un buen detective?", ["No habla", "Hace preguntas", "Adivina", "Inventa"], 1),
          q("log1-c6", "Conectar pistas", "Cada pista es parte del rompecabezas. Únelas para resolver 🧩", "¿Qué hacer con las pistas?", ["Olvidarlas", "Conectarlas", "Tirarlas", "Esconderlas"], 1),
        ],
      },
      {
        id: "log1-m3", title: "Evaluar soluciones", description: "No siempre la primera idea es la mejor.",
        completion: 0, status: "locked",
        challenges: [
          q("log1-c7", "Pensar varias opciones", "Antes de actuar, piensa varias soluciones posibles 💭", "¿Qué hacer antes de elegir una solución?", ["Pensar varias opciones", "Hacer la primera", "No pensar", "Adivinar"], 0),
          q("log1-c8", "La mejor opción", "Elige la opción que resuelva mejor sin causar otros problemas ✅", "¿Cómo elegir la mejor solución?", ["Al azar", "La que resuelve sin crear problemas", "La más rara", "Ninguna"], 1),
          q("log1-c9", "Aprender del error", "Si una solución no funciona, aprende y prueba otra 🔄", "¿Qué hacer si tu solución no funciona?", ["Rendirte", "Aprender y probar otra", "Llorar", "Echar la culpa"], 1),
        ],
      },
    ],
  },
  {
    id: "log-2", title: "Maestro de Patrones", description: "Descubre secuencias ocultas en todo.",
    category: "Lógica", icon: "🔄", color: "energy", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "log2-m1", title: "Patrones visuales", description: "🔴🔵🔴🔵… ¿qué sigue?",
        completion: 0, status: "locked",
        challenges: [
          q("log2-c1", "¿Qué sigue?", "Un patrón es algo que se repite: 🔴🔵🔴🔵… ¡es predecible! 🧠", "En 🔴🔵🔴🔵🔴__, ¿qué sigue?", ["🔴", "🔵", "🟢", "🟡"], 1),
          q("log2-c2", "Patrón de 3", "Los patrones pueden ser de 3 elementos: ⭐🌙☀️⭐🌙☀️…", "En ⭐🌙☀️⭐🌙__, ¿qué sigue?", ["⭐", "🌙", "☀️", "🌍"], 2),
          q("log2-c3", "Tamaños", "Los patrones también pueden ser de tamaños: pequeño, mediano, grande 🔼", "En pequeño-mediano-grande-pequeño-__, ¿qué sigue?", ["Pequeño", "Mediano", "Grande", "Nada"], 1),
        ],
      },
      {
        id: "log2-m2", title: "Patrones numéricos", description: "Los números también siguen patrones.",
        completion: 0, status: "locked",
        challenges: [
          q("log2-c4", "Sumar 2", "2, 4, 6, 8 va sumando 2 cada vez 🔢", "¿Qué sigue en 2, 4, 6, 8, __?", ["9", "10", "11", "12"], 1),
          q("log2-c5", "Multiplicar por 2", "1, 2, 4, 8, 16 se multiplica por 2 cada vez ✨", "¿Qué sigue en 1, 2, 4, 8, __?", ["10", "12", "16", "20"], 2),
          q("log2-c6", "Restar 5", "100, 95, 90, 85 va restando 5 ⬇️", "¿Qué sigue en 100, 95, 90, __?", ["80", "85", "75", "100"], 1),
        ],
      },
      {
        id: "log2-m3", title: "Patrones en la vida", description: "Los patrones están por todas partes.",
        completion: 0, status: "locked",
        challenges: [
          q("log2-c7", "Las estaciones", "Las estaciones siguen un patrón: primavera, verano, otoño, invierno… y vuelven 🍂", "¿Las estaciones siguen un patrón?", ["No", "Sí", "Solo a veces", "Nunca"], 1),
          q("log2-c8", "Los días", "Lunes a domingo es un patrón semanal que se repite 📅", "¿Los días de la semana son un patrón?", ["No", "Sí", "Es magia", "No se sabe"], 1),
          q("log2-c9", "Los relojes", "El reloj sigue un patrón de 12 horas que se repite 🕐", "¿Después de las 12, qué hora viene?", ["13", "1", "0", "24"], 1),
        ],
      },
    ],
  },
  {
    id: "log-3", title: "Estratega Junior", description: "Toma decisiones básicas y aprende a elegir bien.",
    category: "Lógica", icon: "♟️", color: "energy", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "log3-m1", title: "Tomar decisiones", description: "A veces hay que elegir. ¿Cómo elegir bien?",
        completion: 0, status: "locked",
        challenges: [
          q("log3-c1", "Mejor opción", "Para decidir bien, piensa en las consecuencias de cada opción ⚖️", "Tienes que elegir entre estudiar o jugar antes del examen. ¿Qué es mejor?", ["Jugar todo el día", "Estudiar un rato y luego jugar", "No hacer nada", "Dormir"], 1),
          q("log3-c2", "Pensar antes", "No actúes sin pensar. Espera unos segundos antes de decidir 🛑", "¿Qué hacer antes de decidir?", ["Actuar rápido", "Pensar", "Adivinar", "Cerrar los ojos"], 1),
          q("log3-c3", "Pros y contras", "Apunta lo bueno y lo malo de cada opción para elegir mejor ⚖️", "¿Cómo evaluar opciones?", ["Solo lo bueno", "Solo lo malo", "Ambas cosas", "Nada"], 2),
        ],
      },
      {
        id: "log3-m2", title: "Planear", description: "Tener un plan es ir un paso adelante.",
        completion: 0, status: "locked",
        challenges: [
          q("log3-c4", "¿Qué es un plan?", "Un plan es decidir qué hacer y cómo, antes de empezar 📝", "¿Qué es planear?", ["Improvisar", "Pensar antes qué hacer", "Hacer todo a la vez", "No hacer nada"], 1),
          q("log3-c5", "Anticipar", "Si te preparas para lo que viene, te sale mejor 🎯", "¿Por qué es bueno anticipar?", ["Es perder tiempo", "Te preparas mejor", "No sirve", "Te confunde"], 1),
          q("log3-c6", "Plan B", "Siempre ten un plan B por si el primero falla 🅱️", "¿Por qué tener un plan B?", ["Para nada", "Por si el A falla", "Por aburrimiento", "Es opcional"], 1),
        ],
      },
      {
        id: "log3-m3", title: "Estrategia básica", description: "Pensar como un jugador de ajedrez.",
        completion: 0, status: "locked",
        challenges: [
          q("log3-c7", "Pensar 2 jugadas adelante", "Los buenos estrategas piensan en lo que hará el otro ♟️", "¿Qué hace un buen estratega?", ["Solo piensa en él", "Piensa en lo que hará el otro", "No piensa", "Improvisa"], 1),
          q("log3-c8", "Defender y atacar", "Hay que saber cuándo atacar y cuándo defender 🛡️", "¿Qué hay que saber en estrategia?", ["Solo atacar", "Solo defender", "Cuándo hacer cada uno", "Rendirse"], 2),
          q("log3-c9", "Paciencia", "A veces ganar requiere esperar el momento adecuado ⏳", "¿Qué necesita un estratega?", ["Prisa", "Paciencia", "Gritos", "Llorar"], 1),
        ],
      },
    ],
  },
  {
    id: "log-4", title: "Rompecabezas Mental", description: "Lógica visual para mentes curiosas.",
    category: "Lógica", icon: "🧩", color: "energy", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "log4-m1", title: "Figuras lógicas", description: "Encuentra la pieza que falta.",
        completion: 0, status: "locked",
        challenges: [
          q("log4-c1", "La pieza faltante", "Observa bien la imagen y encuentra qué pieza completa el rompecabezas 🧩", "Si un cuadrado tiene 4 lados iguales, ¿cuántos lados tiene un triángulo?", ["2", "3", "4", "5"], 1),
          q("log4-c2", "El intruso", "Encuentra el elemento que no encaja con los demás 🔍", "¿Qué NO va con los demás?: perro, gato, conejo, sofá", ["perro", "gato", "conejo", "sofá"], 3),
          q("log4-c3", "Lo que sigue", "Sigue la lógica para predecir lo siguiente 🧠", "Si un triángulo crece y crece, ¿cómo será el siguiente?", ["Más pequeño", "Igual", "Más grande", "Desaparece"], 2),
        ],
      },
      {
        id: "log4-m2", title: "Acertijos", description: "Pequeños retos para hacer pensar al cerebro.",
        completion: 0, status: "locked",
        challenges: [
          q("log4-c4", "Acertijo simple", "Tengo manecillas y marco las horas. ¿Qué soy? ⏰", "¿Qué es?", ["Un libro", "Un reloj", "Una silla", "Un libro"], 1),
          q("log4-c5", "Acertijo de animales", "Soy el rey de la selva, tengo melena. ¿Quién soy? 🦁", "¿Qué animal es?", ["Tigre", "León", "Mono", "Elefante"], 1),
          q("log4-c6", "Acertijo de objetos", "Sirvo para escribir y soy delgado y largo. ¿Qué soy? ✏️", "¿Qué es?", ["Borrador", "Lápiz", "Goma", "Regla"], 1),
        ],
      },
      {
        id: "log4-m3", title: "Laberintos mentales", description: "Encuentra el camino correcto.",
        completion: 0, status: "locked",
        challenges: [
          q("log4-c7", "Caminos", "Para resolver un laberinto, mira primero el camino completo 🗺️", "¿Cómo resolver un laberinto?", ["Adivinando", "Mirando el camino", "Corriendo", "Cerrando los ojos"], 1),
          q("log4-c8", "Volver atrás", "Si te equivocas en un laberinto, vuelve atrás y prueba otro camino 🔁", "¿Qué hacer si te equivocas en un laberinto?", ["Rendirte", "Volver atrás", "Romperlo", "Llorar"], 1),
          q("log4-c9", "Empezar por el final", "A veces es más fácil resolver un laberinto al revés ⏪", "¿Por dónde se puede empezar un laberinto?", ["Solo el inicio", "También por el final", "Por la mitad", "Por ningún lado"], 1),
        ],
      },
    ],
  },
  {
    id: "log-5", title: "Código Secreto", description: "Intro a programación y pensamiento computacional.",
    category: "Lógica", icon: "🤖", color: "energy", duration: "30 min", difficulty: "intermediate", rewards: 450, progress: 0, status: "locked",
    modules: [
      {
        id: "log5-m1", title: "Instrucciones", description: "Programar es dar instrucciones claras.",
        completion: 0, status: "locked",
        challenges: [
          q("log5-c1", "Instrucciones claras", "Un programa es una lista de instrucciones que la computadora sigue en orden 💻", "¿Qué es un programa?", ["Un dibujo", "Una lista de instrucciones", "Un juego de mesa", "Un libro"], 1),
          q("log5-c2", "Orden importa", "Si te pones primero los zapatos y luego los calcetines, no funciona 🧦👟", "¿Qué importa en las instrucciones?", ["Nada", "El orden", "El color", "El idioma"], 1),
          q("log5-c3", "Ser específico", "'Da un paso adelante' es mejor que 'muévete' al programar ➡️", "¿Cómo deben ser las instrucciones?", ["Vagas", "Específicas", "Largas", "Confusas"], 1),
        ],
      },
      {
        id: "log5-m2", title: "Bucles y repeticiones", description: "Hacer lo mismo muchas veces sin escribirlo todo.",
        completion: 0, status: "locked",
        challenges: [
          q("log5-c4", "Repetir", "En programación, los bucles repiten acciones: 'Salta 5 veces' 🔁", "¿Qué hace un bucle?", ["Solo una cosa", "Repite acciones", "Borra todo", "No hace nada"], 1),
          q("log5-c5", "Cuántas veces", "Le dices al programa cuántas veces repetir: 3, 10, 100… 🔢", "¿Qué le dices al bucle?", ["Nada", "Cuántas veces repetir", "Su nombre", "Su edad"], 1),
          q("log5-c6", "Ahorrar trabajo", "Los bucles ahorran trabajo: en lugar de escribir 'salta' 100 veces, usas un bucle ⚡", "¿Para qué sirven los bucles?", ["Aburrirse", "Ahorrar trabajo", "Romper código", "Confundir"], 1),
        ],
      },
      {
        id: "log5-m3", title: "Condiciones (Si...)", description: "Tomar decisiones en el código: si pasa esto, haz aquello.",
        completion: 0, status: "locked",
        challenges: [
          q("log5-c7", "Si... entonces...", "Si llueve, llevo paraguas. Si no, no. ¡Esto son condiciones! ☔", "¿Qué es una condición?", ["Un dibujo", "Un 'si...entonces'", "Un bucle", "Un nombre"], 1),
          q("log5-c8", "Verdadero o falso", "Las condiciones se evalúan: o son verdaderas o falsas ✅❌", "¿Qué puede ser una condición?", ["Solo verdadera", "Verdadera o falsa", "Solo falsa", "Ninguna"], 1),
          q("log5-c9", "Caminos diferentes", "Las condiciones permiten que el programa elija caminos distintos 🛣️", "¿Para qué sirven las condiciones?", ["Para nada", "Para elegir caminos", "Para borrar", "Para repetir"], 1),
        ],
      },
    ],
  },

  // ===== SOCIAL =====
  {
    id: "soc-1", title: "Amigo Pro", description: "Aprende a compartir, escuchar y ser empático.",
    category: "Social", icon: "🤝", color: "power", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "available",
    modules: [
      {
        id: "soc1-m1", title: "Compartir", description: "Compartir no es perder, es ganar amigos.",
        completion: 0, status: "available",
        challenges: [
          q("soc1-c1", "Compartir es genial", "Cuando compartes, los demás se sienten felices y tú también 🎁", "¿Qué pasa cuando compartes con un amigo?", ["Se enoja", "Se pone feliz", "Se va", "Nada"], 1, "available"),
          q("soc1-c2", "Tu turno", "Esperar tu turno también es compartir: el tiempo, el espacio, los juegos 🎮", "¿Esperar tu turno es compartir?", ["No", "Sí", "Solo a veces", "Nunca"], 1),
          q("soc1-c3", "Compartir no es perder", "Si compartes tu juguete, no pierdes nada: ganas un amigo feliz 😊", "¿Qué ganas al compartir?", ["Pierdes todo", "Ganas amigos", "Te quedas solo", "Nada"], 1),
        ],
      },
      {
        id: "soc1-m2", title: "Empatía", description: "Ponte en los zapatos del otro.",
        completion: 0, status: "locked",
        challenges: [
          q("soc1-c4", "¿Qué es la empatía?", "Empatía es entender cómo se siente otra persona 💞", "¿Qué es la empatía?", ["Pelearse", "Entender al otro", "Ignorar", "Reírse"], 1),
          q("soc1-c5", "Si está triste", "Si un amigo está triste, escúchalo o abrázalo. ¡Ayuda mucho! 🤗", "¿Qué hacer si un amigo está triste?", ["Ignorarlo", "Escucharlo", "Reírse", "Irse"], 1),
          q("soc1-c6", "Pensar en el otro", "Antes de hacer algo, piensa cómo se sentirá el otro 🧠", "¿Qué hacer antes de actuar?", ["Pensar cómo se sentirá el otro", "Solo en ti", "Nada", "Reírse"], 0),
        ],
      },
      {
        id: "soc1-m3", title: "Amistad sólida", description: "Las buenas amistades duran y crecen.",
        completion: 0, status: "locked",
        challenges: [
          q("soc1-c7", "Decir la verdad", "Un buen amigo te dice la verdad, aunque cueste 💎", "¿Qué hace un buen amigo?", ["Mentir siempre", "Decir la verdad", "Ignorarte", "Reírse de ti"], 1),
          q("soc1-c8", "Apoyar", "Un buen amigo te apoya en lo bueno y lo malo 🌟", "¿Cuándo apoya un buen amigo?", ["Solo cuando ganas", "En todo momento", "Solo si quiere", "Nunca"], 1),
          q("soc1-c9", "Respetar diferencias", "Cada amigo es distinto y eso está bien. ¡Respetar las diferencias une! 🌈", "¿Qué hacer con las diferencias?", ["Burlarse", "Respetarlas", "Ignorarlas", "Pelear"], 1),
        ],
      },
    ],
  },
  {
    id: "soc-2", title: "Control de Emociones", description: "Reconoce y gestiona lo que sientes.",
    category: "Social", icon: "🧘", color: "power", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "soc2-m1", title: "Nombrar emociones", description: "El primer paso es saber qué sientes.",
        completion: 0, status: "locked",
        challenges: [
          q("soc2-c1", "¿Qué siento?", "Las emociones básicas son: alegría, tristeza, enojo, miedo y sorpresa 😊😢😡😨😲", "¿Cuál es una emoción?", ["Mesa", "Alegría", "Zapato", "Lápiz"], 1),
          q("soc2-c2", "Identificar", "Si sabes qué sientes, puedes manejarlo mejor 🧠", "¿Por qué nombrar las emociones?", ["Para nada", "Para manejarlas mejor", "Por aburrimiento", "Por castigo"], 1),
          q("soc2-c3", "Todo es válido", "Sentir tristeza o enojo es normal. ¡Las emociones no son buenas ni malas! 💭", "¿Está mal sentir enojo?", ["Sí, muy mal", "No, es normal", "Solo a veces", "Siempre mal"], 1),
        ],
      },
      {
        id: "soc2-m2", title: "Calmar el enojo", description: "El enojo es normal, pero hay que manejarlo bien.",
        completion: 0, status: "locked",
        challenges: [
          q("soc2-c4", "Respirar profundo", "Cuando te enojas, respira hondo 5 veces. ¡Ayuda mucho! 🌬️", "¿Qué hacer cuando te enojas?", ["Gritar", "Respirar profundo", "Pegar", "Romper cosas"], 1),
          q("soc2-c5", "Contar hasta 10", "Antes de reaccionar al enojo, cuenta hasta 10 lentamente 🔟", "¿Para qué contar hasta 10?", ["Por aburrimiento", "Para calmarse", "Para olvidar", "Para nada"], 1),
          q("soc2-c6", "No pegar", "Aunque estés muy enojado, nunca pegues. Habla mejor 🚫", "¿Está bien pegar cuando te enojas?", ["Sí, claro", "No, nunca", "A veces", "Solo si te enojas mucho"], 1),
        ],
      },
      {
        id: "soc2-m3", title: "Buscar la calma", description: "Técnicas para volver al equilibrio.",
        completion: 0, status: "locked",
        challenges: [
          q("soc2-c7", "Respirar lento", "Respirar lento y profundo activa la calma del cuerpo 🧘", "¿Qué tipo de respiración calma?", ["Rápida", "Lenta y profunda", "Sin respirar", "Gritada"], 1),
          q("soc2-c8", "Hablar de lo que sientes", "Decirle a alguien cómo te sientes te alivia mucho 💬", "¿Qué ayuda cuando estás mal?", ["Esconderte", "Hablar con alguien", "Pelear", "Llorar solo"], 1),
          q("soc2-c9", "Tiempo fuera", "A veces necesitas un momento solo para volver a la calma 🛋️", "¿Qué es un 'tiempo fuera'?", ["Castigo", "Momento para calmarte", "Premio", "Pelea"], 1),
        ],
      },
    ],
  },
  {
    id: "soc-3", title: "Trabajo en Equipo", description: "Colaborar es un superpoder.",
    category: "Social", icon: "👥", color: "power", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "soc3-m1", title: "Juntos es mejor", description: "Dos cabezas piensan más que una.",
        completion: 0, status: "locked",
        challenges: [
          q("soc3-c1", "En equipo", "Trabajar en equipo significa escuchar a todos y aportar ideas 🤜🤛", "¿Qué es importante en un equipo?", ["Que solo uno decida", "Escuchar a todos", "No hablar", "Hacer todo solo"], 1),
          q("soc3-c2", "Repartir tareas", "Cada uno hace una parte. Así el trabajo es más rápido y mejor ⚡", "¿Cómo se trabaja en equipo?", ["Uno hace todo", "Repartiendo tareas", "Sin hacer nada", "Peleando"], 1),
          q("soc3-c3", "Ayudar al compañero", "Si un compañero termina antes, ayuda a otro. ¡Equipo! 🤝", "¿Qué hacer si terminas tu tarea antes?", ["Burlarte", "Ayudar a otro", "Irte", "Esconderte"], 1),
        ],
      },
      {
        id: "soc3-m2", title: "Comunicación", description: "Sin hablar y escuchar, no hay equipo.",
        completion: 0, status: "locked",
        challenges: [
          q("soc3-c4", "Hablar y escuchar", "En equipo, todos hablan y todos escuchan por igual 🗣️👂", "¿Qué hace un buen equipo?", ["Solo uno habla", "Todos hablan y escuchan", "Nadie habla", "Pelean"], 1),
          q("soc3-c5", "Decir tu idea", "Si tienes una idea, dila. ¡Puede ser la solución! 💡", "¿Qué hacer con tus ideas en equipo?", ["Esconderlas", "Decirlas", "Olvidarlas", "Reírte"], 1),
          q("soc3-c6", "Respetar opiniones", "Si alguien piensa diferente, respétalo. La diversidad enriquece 🌈", "¿Qué hacer si alguien opina distinto?", ["Pelear", "Respetar", "Ignorar", "Burlarse"], 1),
        ],
      },
      {
        id: "soc3-m3", title: "Liderazgo amable", description: "Liderar no es mandar, es guiar.",
        completion: 0, status: "locked",
        challenges: [
          q("soc3-c7", "Buen líder", "Un buen líder escucha, anima y reparte tareas con justicia 👑", "¿Cómo es un buen líder?", ["Manda y grita", "Escucha y guía", "No hace nada", "Solo manda"], 1),
          q("soc3-c8", "Animar al equipo", "Si tu equipo se desanima, anímalo. ¡Tú puedes ser el motor! 🔥", "¿Qué hacer si el equipo se desanima?", ["Rendirte", "Animarlos", "Irte", "Burlarte"], 1),
          q("soc3-c9", "Compartir el éxito", "Si ganan, ganan todos. El líder no se queda con la gloria 🏆", "¿De quién es el éxito de un equipo?", ["Solo del líder", "De todos", "De nadie", "Del más fuerte"], 1),
        ],
      },
    ],
  },
  {
    id: "soc-4", title: "Resolución de Conflictos", description: "Negocia y resuelve problemas sin drama.",
    category: "Social", icon: "🕊️", color: "power", duration: "25 min", difficulty: "intermediate", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "soc4-m1", title: "Hablar, no pelear", description: "Las palabras resuelven más que los gritos.",
        completion: 0, status: "locked",
        challenges: [
          q("soc4-c1", "Resolver sin pelear", "Cuando hay un conflicto, lo mejor es hablar con calma y buscar una solución justa 🗣️", "¿Qué haces si un amigo toma tu juguete?", ["Le pegas", "Le hablas con calma", "Lloras", "Lo ignoras para siempre"], 1),
          q("soc4-c2", "Bajar la voz", "Hablar bajo y con calma resuelve más que gritar 🤫", "¿Cómo hablar al resolver un conflicto?", ["Gritando", "Con calma", "Llorando", "Susurrando"], 1),
          q("soc4-c3", "Escuchar al otro", "Antes de defenderte, escucha qué dice la otra persona 👂", "¿Qué hacer primero en un conflicto?", ["Atacar", "Escuchar", "Llorar", "Irte"], 1),
        ],
      },
      {
        id: "soc4-m2", title: "Negociar", description: "Llegar a un acuerdo donde todos ganen un poco.",
        completion: 0, status: "locked",
        challenges: [
          q("soc4-c4", "Acuerdo justo", "Negociar es buscar una solución donde ambos ganen algo ⚖️", "¿Qué es negociar?", ["Pelear", "Buscar un acuerdo justo", "Ganar tú", "Perder"], 1),
          q("soc4-c5", "Ceder un poco", "Si tú cedes algo y el otro también, todos quedan contentos 🤝", "¿Qué hacer al negociar?", ["Solo ganar yo", "Ceder un poco", "Pelear", "Irse"], 1),
          q("soc4-c6", "Buscar lo común", "Encuentra qué quieren ambos. Eso une 🎯", "¿Qué buscar al negociar?", ["Diferencias", "Lo que tienen en común", "Pelea", "Nada"], 1),
        ],
      },
      {
        id: "soc4-m3", title: "Pedir disculpas", description: "Reconocer el error es de valientes.",
        completion: 0, status: "locked",
        challenges: [
          q("soc4-c7", "Decir 'lo siento'", "Cuando te equivocas, di 'lo siento' de corazón 💖", "¿Qué decir cuando te equivocas?", ["Nada", "Lo siento", "Tu culpa", "Adiós"], 1),
          q("soc4-c8", "Disculpa sincera", "No basta con decirlo, hay que sentirlo de verdad 💯", "¿Cómo debe ser una disculpa?", ["Falsa", "Sincera", "Rápida", "A gritos"], 1),
          q("soc4-c9", "Cambiar el comportamiento", "Pedir perdón sin cambiar no sirve. Aprende del error 🌱", "¿Qué hacer después de pedir perdón?", ["Repetir el error", "Cambiar el comportamiento", "Olvidar", "Burlarse"], 1),
        ],
      },
    ],
  },
  {
    id: "soc-5", title: "Confianza Total", description: "Construye tu autoestima y cree en ti.",
    category: "Social", icon: "💪", color: "power", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "soc5-m1", title: "Yo soy capaz", description: "Todos tenemos talentos y fortalezas.",
        completion: 0, status: "locked",
        challenges: [
          q("soc5-c1", "Creer en ti", "La autoestima es sentirte bien contigo mismo y saber que eres valioso 🌟", "¿Qué es la autoestima?", ["Ser el mejor en todo", "Sentirte bien contigo mismo", "No tener miedo nunca", "Ganar siempre"], 1),
          q("soc5-c2", "Tus talentos", "Todos tenemos algo en lo que somos buenos. ¡Encuentra el tuyo! 🎯", "¿Tienes talentos?", ["No, ninguno", "Sí, todos los tenemos", "Solo unos pocos los tienen", "Nadie sabe"], 1),
          q("soc5-c3", "Yo puedo", "Decirte 'yo puedo' te da fuerza para intentarlo 💪", "¿Qué decirte cuando algo es difícil?", ["No puedo", "Yo puedo", "Es imposible", "Renuncio"], 1),
        ],
      },
      {
        id: "soc5-m2", title: "Aprender de errores", description: "Equivocarse es parte de crecer.",
        completion: 0, status: "locked",
        challenges: [
          q("soc5-c4", "Errores normales", "Todos nos equivocamos. ¡Hasta los grandes inventores! 🛠️", "¿Está mal equivocarse?", ["Sí, muy mal", "No, es normal", "A veces", "Siempre mal"], 1),
          q("soc5-c5", "Aprender", "Cada error es una lección. Pregúntate: ¿qué aprendí? 🧠", "¿Qué hacer con un error?", ["Olvidarlo", "Aprender de él", "Esconderlo", "Llorar"], 1),
          q("soc5-c6", "Volver a intentar", "Después de un error, ¡inténtalo de nuevo! 🔁", "¿Qué hacer después de fallar?", ["Rendirte", "Intentar otra vez", "Llorar", "Esconderte"], 1),
        ],
      },
      {
        id: "soc5-m3", title: "Hablar con amabilidad de ti", description: "Cómo te hablas a ti mismo importa mucho.",
        completion: 0, status: "locked",
        challenges: [
          q("soc5-c7", "Voz interior amable", "No te insultes ni en tu cabeza. Háblate como a un amigo 💛", "¿Cómo hablarte a ti mismo?", ["Insultándote", "Con amabilidad", "Gritándote", "Ignorándote"], 1),
          q("soc5-c8", "Reconocer logros", "Cuando logras algo, ¡celébralo! Por pequeño que sea 🎉", "¿Qué hacer cuando logras algo?", ["Ignorarlo", "Celebrarlo", "Esconderlo", "Quitarle valor"], 1),
          q("soc5-c9", "Compararse menos", "No te compares con otros. Cada uno es único 🌈", "¿Es bueno compararse mucho?", ["Sí", "No, cada uno es único", "Siempre", "A veces sí"], 1),
        ],
      },
    ],
  },

  // ===== TECNOLOGÍA =====
  {
    id: "tech-1", title: "Mini Programador", description: "Lógica tipo bloques para pensar como un coder.",
    category: "Tecnología", icon: "🧱", color: "xp", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "available",
    modules: [
      {
        id: "tech1-m1", title: "Bloques de código", description: "Programar es como armar con bloques de LEGO.",
        completion: 0, status: "available",
        challenges: [
          q("tech1-c1", "Bloques básicos", "Programar con bloques es como armar un rompecabezas: cada pieza hace algo 🧱", "¿Qué haces al programar con bloques?", ["Dibujar", "Conectar instrucciones", "Escribir un cuento", "Cantar"], 1, "available"),
          q("tech1-c2", "Bloques de movimiento", "Hay bloques para moverse: 'Avanzar 10 pasos', 'Girar 90°' 🚶", "¿Para qué sirven los bloques de movimiento?", ["Para mover el personaje", "Para cantar", "Para borrar", "Para nada"], 0),
          q("tech1-c3", "Encajar bloques", "Los bloques solo encajan si tienen sentido juntos. Como las piezas de LEGO 🔗", "¿Cómo se conectan los bloques?", ["Al azar", "Si tienen sentido", "Solo verticales", "No se conectan"], 1),
        ],
      },
      {
        id: "tech1-m2", title: "Secuencias", description: "El orden importa: A → B → C.",
        completion: 0, status: "locked",
        challenges: [
          q("tech1-c4", "Orden correcto", "Si quieres pintar, primero coge el pincel, luego mójalo, luego pinta 🎨", "¿Importa el orden en programación?", ["No", "Sí, mucho", "A veces", "Nunca"], 1),
          q("tech1-c5", "Paso a paso", "Una secuencia es una lista de pasos en orden 📋", "¿Qué es una secuencia?", ["Pasos en orden", "Pasos al azar", "Un dibujo", "Un sonido"], 0),
          q("tech1-c6", "Probar y corregir", "Si la secuencia no funciona, busca el error y cámbialo 🔧", "¿Qué hacer si tu programa falla?", ["Rendirse", "Buscar el error", "Borrarlo todo", "Llorar"], 1),
        ],
      },
      {
        id: "tech1-m3", title: "Eventos", description: "Cuando pasa algo, hago otra cosa.",
        completion: 0, status: "locked",
        challenges: [
          q("tech1-c7", "Al hacer clic", "'Cuando hago clic, mi personaje salta'. ¡Eso es un evento! 🖱️", "¿Qué es un evento?", ["Algo que dispara una acción", "Un dibujo", "Un sonido", "Nada"], 0),
          q("tech1-c8", "Tecla pulsada", "'Cuando aprieto la flecha derecha, avanzo'. ¡Otro evento! ⌨️", "¿Las teclas pueden ser un evento?", ["No", "Sí", "Solo a veces", "Nunca"], 1),
          q("tech1-c9", "Reaccionar", "Los programas reaccionan a eventos del usuario o del mundo 🌍", "¿Para qué sirven los eventos?", ["Para que el programa reaccione", "Para nada", "Para borrar", "Para confundir"], 0),
        ],
      },
    ],
  },
  {
    id: "tech-2", title: "Explorador Digital", description: "Uso básico de tecnología para el día a día.",
    category: "Tecnología", icon: "🖥️", color: "xp", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "tech2-m1", title: "Partes de una computadora", description: "Pantalla, teclado, mouse… ¿qué hace cada cosa?",
        completion: 0, status: "locked",
        challenges: [
          q("tech2-c1", "El teclado", "El teclado sirve para escribir letras, números y símbolos ⌨️", "¿Para qué sirve el teclado?", ["Para escuchar música", "Para escribir", "Para ver videos", "Para pintar"], 1),
          q("tech2-c2", "El mouse", "El mouse mueve el cursor por la pantalla y hace clic 🖱️", "¿Para qué sirve el mouse?", ["Para escribir", "Para mover el cursor", "Para apagar", "Para enchufar"], 1),
          q("tech2-c3", "La pantalla", "La pantalla muestra todo lo que hace la computadora 🖥️", "¿Qué hace la pantalla?", ["Muestra info", "Hace ruido", "Imprime", "Nada"], 0),
        ],
      },
      {
        id: "tech2-m2", title: "Apps y programas", description: "Cada app sirve para algo distinto.",
        completion: 0, status: "locked",
        challenges: [
          q("tech2-c4", "¿Qué es una app?", "Una app es un programa que hace algo: editar fotos, jugar, escribir 📱", "¿Qué es una app?", ["Un programa con un propósito", "Una galleta", "Un juguete", "Una mascota"], 0),
          q("tech2-c5", "Abrir y cerrar", "Las apps se abren para usarlas y se cierran cuando terminas ❌", "¿Qué hacer cuando terminas con una app?", ["Cerrarla", "Dejarla abierta siempre", "Romperla", "Nada"], 0),
          q("tech2-c6", "Cuál usar", "Para escribir uso un editor, para dibujar un editor de imágenes 🎨", "¿Sirve cualquier app para todo?", ["Sí", "No, cada una para algo", "A veces", "Solo unas"], 1),
        ],
      },
      {
        id: "tech2-m3", title: "Guardar tu trabajo", description: "Si no guardas, lo pierdes.",
        completion: 0, status: "locked",
        challenges: [
          q("tech2-c7", "Guardar", "Después de trabajar, siempre guarda para no perder nada 💾", "¿Qué hacer después de trabajar?", ["Cerrar sin guardar", "Guardar", "Apagar", "Borrar"], 1),
          q("tech2-c8", "Nombre de archivo", "Pon nombres claros: 'tarea_mate' es mejor que 'aaaa' 📝", "¿Cómo nombrar un archivo?", ["Con un nombre claro", "Con cualquier letra", "Sin nombre", "Con un número"], 0),
          q("tech2-c9", "Copia de seguridad", "Tener copias en otro lugar te salva si pierdes el original 🔄", "¿Por qué hacer copias?", ["Por aburrimiento", "Por si pierdes el original", "Para llenar espacio", "Sin razón"], 1),
        ],
      },
    ],
  },
  {
    id: "tech-3", title: "Internet Seguro", description: "Navega seguro y protege tu identidad online.",
    category: "Tecnología", icon: "🛡️", color: "xp", duration: "25 min", difficulty: "beginner", rewards: 350, progress: 0, status: "locked",
    modules: [
      {
        id: "tech3-m1", title: "Contraseñas seguras", description: "Tu contraseña es tu escudo digital.",
        completion: 0, status: "locked",
        challenges: [
          q("tech3-c1", "Buena contraseña", "Una contraseña segura mezcla letras, números y símbolos. ¡No uses '1234'! 🔐", "¿Cuál es una contraseña segura?", ["1234", "MiGato#2024", "password", "aaaa"], 1),
          q("tech3-c2", "No compartirla", "No le des tu contraseña a NADIE, ni a tu mejor amigo 🤐", "¿A quién darle tu contraseña?", ["A todos", "A nadie", "Solo a amigos", "A desconocidos"], 1),
          q("tech3-c3", "Contraseñas distintas", "Usa una contraseña diferente para cada cuenta. Si una cae, las otras se salvan 🔑", "¿Usar la misma contraseña para todo?", ["Sí", "No", "A veces", "Siempre"], 1),
        ],
      },
      {
        id: "tech3-m2", title: "No hablar con desconocidos", description: "En internet hay buenas y malas personas. Cuidado.",
        completion: 0, status: "locked",
        challenges: [
          q("tech3-c4", "Desconocidos online", "Si alguien que no conoces te escribe, no le respondas. Avisa a un adulto 🚫", "¿Qué hacer si un desconocido te escribe?", ["Responder", "Avisar a un adulto", "Darle tus datos", "Ignorar y seguir"], 1),
          q("tech3-c5", "No dar datos", "Nunca des tu nombre completo, dirección o teléfono a desconocidos 📵", "¿Qué NO dar a desconocidos online?", ["Saludos", "Tus datos personales", "Emojis", "Risas"], 1),
          q("tech3-c6", "No quedar en persona", "Nunca quedes con alguien que conociste solo por internet ⚠️", "¿Quedar con un desconocido de internet?", ["Sí", "No, nunca", "A veces", "Solo si te invita"], 1),
        ],
      },
      {
        id: "tech3-m3", title: "Pensar antes de publicar", description: "Lo que subes a internet, ahí se queda.",
        completion: 0, status: "locked",
        challenges: [
          q("tech3-c7", "Internet no olvida", "Una foto subida puede quedarse para siempre. Piénsalo bien 🤔", "¿Lo que subes a internet se borra fácil?", ["Sí, fácil", "No, queda para siempre", "Solo a veces", "Nunca queda"], 1),
          q("tech3-c8", "No insultar", "Lo que escribes online te define. No insultes ni te burles 🙅", "¿Insultar online está bien?", ["Sí, no se nota", "No, está mal", "A veces", "Solo en bromas"], 1),
          q("tech3-c9", "Pedir permiso", "No subas fotos de otros sin pedir permiso 📸", "¿Subir fotos de otros sin permiso?", ["Sí", "No, pide permiso", "A veces", "Solo en redes"], 1),
        ],
      },
    ],
  },
  {
    id: "tech-4", title: "Creador de Juegos", description: "Lógica + creatividad para diseñar tus propios juegos.",
    category: "Tecnología", icon: "🎮", color: "xp", duration: "30 min", difficulty: "intermediate", rewards: 450, progress: 0, status: "locked",
    modules: [
      {
        id: "tech4-m1", title: "Diseñar un nivel", description: "Todo juego empieza con una idea y un mapa.",
        completion: 0, status: "locked",
        challenges: [
          q("tech4-c1", "Elementos del juego", "Un juego necesita: personaje, objetivo, obstáculos y reglas 🎮", "¿Qué necesita un juego?", ["Solo gráficos bonitos", "Personaje, objetivo y reglas", "Solo música", "Nada"], 1),
          q("tech4-c2", "El objetivo", "Todo juego tiene un objetivo: rescatar, llegar, ganar puntos 🎯", "¿Qué es el objetivo de un juego?", ["Lo que hay que lograr", "Solo el inicio", "Nada", "El final triste"], 0),
          q("tech4-c3", "Obstáculos", "Los obstáculos hacen el juego divertido: enemigos, trampas, retos 🚧", "¿Para qué sirven los obstáculos?", ["Aburrir", "Hacer divertido el juego", "Confundir", "Nada"], 1),
        ],
      },
      {
        id: "tech4-m2", title: "Personajes", description: "Tu protagonista necesita personalidad.",
        completion: 0, status: "locked",
        challenges: [
          q("tech4-c4", "Apariencia", "Un personaje memorable tiene un look único: colores, ropa, accesorios 🦸", "¿Qué hace memorable a un personaje?", ["Su look único", "Que sea normal", "No tener nombre", "Ser invisible"], 0),
          q("tech4-c5", "Habilidades", "Da poderes a tu personaje: saltar más, correr rápido, lanzar bolas ✨", "¿Qué dar a un personaje?", ["Habilidades", "Nada", "Solo un nombre", "Aburrimiento"], 0),
          q("tech4-c6", "Historia", "Una buena historia hace que el jugador se enganche 📖", "¿Qué hace que un juego enganche?", ["Solo gráficos", "Una buena historia", "Música", "Botones"], 1),
        ],
      },
      {
        id: "tech4-m3", title: "Reglas y dificultad", description: "Equilibra el reto: ni muy fácil, ni imposible.",
        completion: 0, status: "locked",
        challenges: [
          q("tech4-c7", "Reglas claras", "Las reglas deben ser claras desde el inicio. Si no, el jugador se pierde 📜", "¿Cómo deben ser las reglas?", ["Confusas", "Claras", "Cambiantes", "Secretas"], 1),
          q("tech4-c8", "Subir dificultad", "El juego debe empezar fácil y subir poco a poco la dificultad 📈", "¿Cómo debe subir la dificultad?", ["De golpe", "Poco a poco", "Nunca", "Al revés"], 1),
          q("tech4-c9", "Recompensar", "Da puntos, premios o niveles nuevos cuando el jugador logra algo 🏆", "¿Qué hacer cuando el jugador logra algo?", ["Castigarlo", "Recompensarlo", "Ignorarlo", "Quitarle vidas"], 1),
        ],
      },
    ],
  },

  // ===== CUERPO =====
  {
    id: "body-1", title: "Movimiento Ninja", description: "Coordinación y agilidad para moverte como un ninja.",
    category: "Cuerpo", icon: "🥷", color: "streak", duration: "15 min", difficulty: "beginner", rewards: 250, progress: 0, status: "available",
    modules: [
      {
        id: "body1-m1", title: "Coordinación", description: "Mover brazos, piernas y cuerpo en armonía.",
        completion: 0, status: "available",
        challenges: [
          q("body1-c1", "Mover el cuerpo", "La coordinación es usar diferentes partes del cuerpo al mismo tiempo 🤸", "¿Qué es la coordinación?", ["Quedarse quieto", "Mover partes del cuerpo juntas", "Dormir bien", "Comer sano"], 1, "available"),
          q("body1-c2", "Manos y pies", "Saltar y aplaudir a la vez es coordinación 🙌🦶", "¿Qué es coordinarse?", ["Hacer una cosa", "Hacer varias a la vez", "Estar quieto", "Caerse"], 1),
          q("body1-c3", "Práctica", "La coordinación mejora con práctica. ¡Un poco cada día! 💪", "¿Cómo se mejora la coordinación?", ["Con magia", "Practicando", "Sin moverse", "Comiendo"], 1),
        ],
      },
      {
        id: "body1-m2", title: "Agilidad", description: "Moverte rápido y con control.",
        completion: 0, status: "locked",
        challenges: [
          q("body1-c4", "¿Qué es agilidad?", "Agilidad es moverte rápido sin caerte ni perder el control ⚡", "¿Qué es agilidad?", ["Ser lento", "Moverse rápido y con control", "No moverse", "Caerse"], 1),
          q("body1-c5", "Cambiar de dirección", "Un ninja puede cambiar de dirección al instante 🥷", "¿Qué hacen los ninjas?", ["Quedarse quietos", "Cambiar de dirección rápido", "Caminar lento", "Dormir"], 1),
          q("body1-c6", "Reflejos", "Los reflejos son reaccionar rápido a algo que pasa de pronto 🤺", "¿Qué son los reflejos?", ["Reaccionar rápido", "Pensar mucho", "Quedarse quieto", "Llorar"], 0),
        ],
      },
      {
        id: "body1-m3", title: "Saltar y rodar", description: "Movimientos divertidos y útiles.",
        completion: 0, status: "locked",
        challenges: [
          q("body1-c7", "Saltar bien", "Para saltar bien, dobla las rodillas antes y aterriza suave 🦘", "¿Cómo saltar bien?", ["Sin doblar rodillas", "Doblando rodillas", "Cayendo duro", "Sin pensar"], 1),
          q("body1-c8", "Rodar seguro", "Rodar te ayuda a no lastimarte si te caes 🤸", "¿Para qué sirve rodar?", ["Por nada", "Para no lastimarte al caer", "Para ensuciarte", "Para dormir"], 1),
          q("body1-c9", "Calentar antes", "Antes de movimientos fuertes, calienta tus músculos 🔥", "¿Por qué calentar antes de moverte mucho?", ["Por nada", "Para evitar lesiones", "Para cansarte", "Por aburrimiento"], 1),
        ],
      },
    ],
  },
  {
    id: "body-2", title: "Equilibrio Maestro", description: "Control corporal para no caerte (casi nunca).",
    category: "Cuerpo", icon: "⚖️", color: "streak", duration: "15 min", difficulty: "beginner", rewards: 250, progress: 0, status: "locked",
    modules: [
      {
        id: "body2-m1", title: "Un pie", description: "¿Puedes mantenerte en un pie sin caerte?",
        completion: 0, status: "locked",
        challenges: [
          q("body2-c1", "Equilibrio", "El equilibrio es mantener tu cuerpo estable sin caerte ⚖️", "¿Qué necesitas para tener buen equilibrio?", ["Ser muy alto", "Concentración y práctica", "Zapatos grandes", "Correr rápido"], 1),
          q("body2-c2", "En un pie", "Pararte en un pie 30 segundos entrena tu equilibrio 🦩", "¿Cómo entrenar equilibrio?", ["Acostado", "Pararse en un pie", "Corriendo", "Comiendo"], 1),
          q("body2-c3", "Mirar fijo", "Mirar un punto fijo te ayuda a no perder el equilibrio 👁️", "¿Qué ayuda a no caer?", ["Mirar a todos lados", "Mirar un punto fijo", "Cerrar ojos", "Reír"], 1),
        ],
      },
      {
        id: "body2-m2", title: "Postura correcta", description: "Estar derecho te da fuerza y energía.",
        completion: 0, status: "locked",
        challenges: [
          q("body2-c4", "Espalda recta", "Caminar y sentarse con la espalda recta evita dolores 🪑", "¿Cómo debe ir la espalda?", ["Encorvada", "Recta", "Torcida", "No importa"], 1),
          q("body2-c5", "Hombros atrás", "Hombros echados atrás dan postura segura 💪", "¿Hacia dónde van los hombros para buena postura?", ["Adelante", "Atrás", "Arriba", "Abajo"], 1),
          q("body2-c6", "Mirada al frente", "Mirar al frente, no al suelo, mejora tu postura 👀", "¿Hacia dónde mirar al caminar?", ["Al suelo siempre", "Al frente", "Al cielo", "Atrás"], 1),
        ],
      },
      {
        id: "body2-m3", title: "Estiramientos", description: "Estirar te hace flexible y previene lesiones.",
        completion: 0, status: "locked",
        challenges: [
          q("body2-c7", "Por qué estirar", "Estirar mantiene tus músculos flexibles y sanos 🧘", "¿Por qué estirar?", ["Por nada", "Para estar flexible", "Por aburrimiento", "Por castigo"], 1),
          q("body2-c8", "Sin rebotar", "Estira despacio y mantén la postura. ¡No rebotes! ⏳", "¿Cómo estirar bien?", ["Rebotando", "Despacio y manteniendo", "Rapidísimo", "Sin sentir"], 1),
          q("body2-c9", "Diariamente", "Estirar un poco cada día es mejor que mucho un solo día 📅", "¿Cuándo es mejor estirar?", ["Una vez al mes", "Un poco cada día", "Solo si duele", "Nunca"], 1),
        ],
      },
    ],
  },
  {
    id: "body-3", title: "Energía Saludable", description: "Hábitos saludables para tener energía todo el día.",
    category: "Cuerpo", icon: "🍎", color: "streak", duration: "20 min", difficulty: "beginner", rewards: 300, progress: 0, status: "locked",
    modules: [
      {
        id: "body3-m1", title: "Alimentación", description: "Comer bien = sentirte bien.",
        completion: 0, status: "locked",
        challenges: [
          q("body3-c1", "Comida saludable", "Las frutas y verduras te dan vitaminas y energía para todo el día 🥗", "¿Qué alimento es más saludable?", ["Papas fritas", "Manzana", "Refresco", "Dulces"], 1),
          q("body3-c2", "Variedad", "Come de todo: proteína, carbohidratos, frutas, verduras 🍽️", "¿Cómo es una dieta sana?", ["Solo dulces", "Variada", "Solo carne", "Solo pan"], 1),
          q("body3-c3", "Azúcar con cuidado", "Mucha azúcar te da energía rápida pero después te bajonea 🍭", "¿Qué pasa con mucha azúcar?", ["Nada", "Te bajonea después", "Te hace fuerte", "Te hace alto"], 1),
        ],
      },
      {
        id: "body3-m2", title: "Hidratación", description: "Tu cuerpo es 70% agua. ¡Bébela!",
        completion: 0, status: "locked",
        challenges: [
          q("body3-c4", "Beber agua", "Hay que beber agua varias veces al día para estar bien 💧", "¿Cuánto beber?", ["Nada", "Varias veces al día", "Solo si tienes sed", "Solo el lunes"], 1),
          q("body3-c5", "Agua mejor que refresco", "El agua hidrata, el refresco no. ¡Elige agua! 🥤", "¿Qué hidrata mejor?", ["Refresco", "Agua", "Helado", "Jugo en polvo"], 1),
          q("body3-c6", "Sin sed", "No esperes a tener sed para beber. ¡Adelántate! 🚰", "¿Esperar a tener sed para beber?", ["Sí", "No, beber antes", "Solo a veces", "Nunca"], 1),
        ],
      },
      {
        id: "body3-m3", title: "Sueño", description: "Dormir bien es tu superpoder secreto.",
        completion: 0, status: "locked",
        challenges: [
          q("body3-c7", "Dormir suficiente", "Los niños necesitan 9-10 horas de sueño para crecer y aprender 😴", "¿Cuánto debe dormir un niño?", ["3 horas", "9-10 horas", "1 hora", "20 horas"], 1),
          q("body3-c8", "Apagar pantallas", "Apaga el celular y la TV antes de dormir. Te ayuda a descansar mejor 📵", "¿Qué hacer antes de dormir?", ["Ver TV", "Apagar pantallas", "Comer mucho", "Correr"], 1),
          q("body3-c9", "Misma hora", "Dormirte siempre a la misma hora ayuda a tu cuerpo 🕘", "¿Cuándo es bueno acostarse?", ["A cualquier hora", "Siempre a la misma hora", "Tarde", "Nunca dormir"], 1),
        ],
      },
    ],
  },
  {
    id: "body-4", title: "Respiración Poderosa", description: "Calma, foco y control a través de la respiración.",
    category: "Cuerpo", icon: "🌬️", color: "streak", duration: "15 min", difficulty: "beginner", rewards: 250, progress: 0, status: "locked",
    modules: [
      {
        id: "body4-m1", title: "Respirar despacio", description: "Respirar bien te ayuda a calmarte.",
        completion: 0, status: "locked",
        challenges: [
          q("body4-c1", "Respiración calmada", "Respirar lento y profundo te ayuda a relajarte cuando estás nervioso 🧘", "¿Qué pasa cuando respiras lento y profundo?", ["Te mareas", "Te calmas", "Te duermes", "Te enojas"], 1),
          q("body4-c2", "Por la nariz", "Respira por la nariz, no por la boca. Es más sano 👃", "¿Por dónde respirar?", ["Boca", "Nariz", "Oídos", "Ojos"], 1),
          q("body4-c3", "4-7-8", "Inhala 4 segundos, mantén 7, exhala 8. Truco para calmarte 🌬️", "¿Para qué sirve respirar 4-7-8?", ["Cansarte", "Calmarte", "Acelerarte", "Dormir mal"], 1),
        ],
      },
      {
        id: "body4-m2", title: "Concentración", description: "Respirar bien también ayuda a concentrarte.",
        completion: 0, status: "locked",
        challenges: [
          q("body4-c4", "Foco", "Respirar profundo antes de estudiar te ayuda a concentrarte 🎯", "¿Qué hacer antes de concentrarte?", ["Correr", "Respirar profundo", "Gritar", "Comer dulce"], 1),
          q("body4-c5", "Quitar pensamientos", "Cuando respiras enfocado, los pensamientos se calman 💭", "¿Qué pasa al respirar concentrado?", ["Te aceleras", "Calmas pensamientos", "Te enojas", "Te mareas"], 1),
          q("body4-c6", "Antes de un examen", "Respira profundo antes de un examen. Te baja los nervios 📝", "¿Cuándo respirar profundo?", ["Nunca", "Antes de algo importante", "Solo en la cama", "Comiendo"], 1),
        ],
      },
      {
        id: "body4-m3", title: "Mindfulness básico", description: "Estar presente en el aquí y ahora.",
        completion: 0, status: "locked",
        challenges: [
          q("body4-c7", "Aquí y ahora", "Mindfulness es enfocarte en este momento, sin pensar en el pasado o futuro 🧘", "¿Qué es mindfulness?", ["Pensar en el ayer", "Estar en el ahora", "Soñar despierto", "Dormirse"], 1),
          q("body4-c8", "Notar el cuerpo", "Siente cómo entran y salen el aire. ¡Conéctate con tu cuerpo! 💨", "¿Cómo conectarse con el cuerpo?", ["Sintiendo la respiración", "Ignorándolo", "Comiendo", "Hablando"], 0),
          q("body4-c9", "5 minutos al día", "Solo 5 minutos de mindfulness al día te dan mucha calma ⏱️", "¿Cuánto practicar mindfulness?", ["Horas", "5 minutos al día", "Una vez al año", "Nunca"], 1),
        ],
      },
    ],
  },
];

export const missions: Mission[] = [
  { id: "d-1", title: "Completa 1 Desafío", description: "Termina cualquier desafío hoy", type: "daily", progress: 0, target: 1, xpReward: 50, completed: false },
  { id: "d-2", title: "Entrena 5 Minutos", description: "Dedica 5 minutos a aprender", type: "daily", progress: 3, target: 5, xpReward: 30, completed: false },
  { id: "d-3", title: "Abre tu Recompensa", description: "Reclama tu cofre diario", type: "daily", progress: 1, target: 1, xpReward: 20, completed: true },
  { id: "w-1", title: "Completa 5 Desafíos", description: "Termina 5 desafíos esta semana", type: "weekly", progress: 3, target: 5, xpReward: 150, completed: false },
  { id: "w-2", title: "Termina 1 Módulo", description: "Completa un módulo entero", type: "weekly", progress: 0, target: 1, xpReward: 200, completed: false },
  { id: "w-3", title: "Racha de 7 Días", description: "Entrena cada día durante una semana", type: "weekly", progress: 5, target: 7, xpReward: 300, completed: false },
];

export const achievements: Achievement[] = [
  { id: "a-1", title: "Primer Paso", description: "Completa tu primer desafío", category: "exploración", icon: "👣", unlocked: true },
  { id: "a-2", title: "Maestro de Módulo", description: "Completa un módulo entero", category: "constancia", icon: "⚡", unlocked: true },
  { id: "a-3", title: "Guerrero Semanal", description: "Mantén una racha de 7 días", category: "constancia", icon: "🔥", unlocked: false },
  { id: "a-4", title: "Puntuación Perfecta", description: "Obtén 100% en un desafío", category: "precisión", icon: "💎", unlocked: true },
  { id: "a-5", title: "Buscador de Poderes", description: "Desbloquea 3 Superpoderes", category: "exploración", icon: "🔮", unlocked: false },
  { id: "a-6", title: "Cerebro Maestro", description: "Domina un Superpoder", category: "precisión", icon: "🧬", unlocked: true },
  { id: "a-7", title: "Velocidad Relámpago", description: "Completa 3 desafíos en menos de 3 minutos", category: "precisión", icon: "⚡", unlocked: false },
  { id: "a-8", title: "Explorador", description: "Prueba desafíos en 3 áreas diferentes", category: "exploración", icon: "🗺️", unlocked: false },
];
