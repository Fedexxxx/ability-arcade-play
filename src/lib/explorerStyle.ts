// Layered SVG Explorer style — visual identity persisted in localStorage.
// All visual layers are recolorable. No item gates progression — pure expression.

const KEY = "sherpa.explorerStyle.v1";
const EVENT = "sherpa:explorer-style-changed";

export type SkinTone = "porcelain" | "honey" | "tan" | "cocoa" | "espresso";
export type HairStyle = "short" | "wavy" | "bun" | "buzz" | "long";
export type OutfitStyle = "explorer" | "alpine" | "summit" | "trail";

export interface ExplorerStyle {
  skin: SkinTone;
  hair: HairStyle;
  hairColor: string;       // hex
  jacketColor: string;     // hex
  pantsColor: string;      // hex
  bootsColor: string;      // hex
  outfit: OutfitStyle;
}

export const SKIN_PALETTE: Record<SkinTone, { base: string; shade: string; label: string }> = {
  porcelain: { base: "#F6D9C2", shade: "#E5BFA0", label: "Porcelana" },
  honey:     { base: "#E8B98A", shade: "#C9986A", label: "Miel" },
  tan:       { base: "#C68E63", shade: "#A06F49", label: "Bronce" },
  cocoa:     { base: "#8E5A3C", shade: "#6E4128", label: "Cacao" },
  espresso:  { base: "#5C3A24", shade: "#3F2614", label: "Espresso" },
};

export const HAIR_COLORS: { id: string; hex: string; label: string }[] = [
  { id: "raven",    hex: "#1F1A18", label: "Cuervo" },
  { id: "chestnut", hex: "#5A2F1B", label: "Castaño" },
  { id: "honey",    hex: "#9C6A2A", label: "Miel" },
  { id: "sand",     hex: "#D4A65A", label: "Arena" },
  { id: "carrot",   hex: "#D6622B", label: "Zanahoria" },
  { id: "ash",      hex: "#9AA0A6", label: "Ceniza" },
  { id: "mint",     hex: "#3FB59A", label: "Menta" },
  { id: "berry",    hex: "#A23E7A", label: "Mora" },
];

export const JACKET_COLORS: { hex: string; label: string }[] = [
  { hex: "#2F6FE0", label: "Azul cielo" },
  { hex: "#E0712F", label: "Naranja sherpa" },
  { hex: "#2EA86F", label: "Verde valle" },
  { hex: "#B23A48", label: "Rojo cumbre" },
  { hex: "#7A4FD1", label: "Morado nieve" },
  { hex: "#1F2A44", label: "Azul noche" },
  { hex: "#E5C04A", label: "Amarillo sol" },
  { hex: "#3D3A36", label: "Carbón" },
];

export const PANTS_COLORS: { hex: string; label: string }[] = [
  { hex: "#3D3A36", label: "Carbón" },
  { hex: "#5C4A33", label: "Cuero" },
  { hex: "#1F2A44", label: "Azul noche" },
  { hex: "#6C7A4D", label: "Verde musgo" },
  { hex: "#7A6A55", label: "Arena" },
  { hex: "#243B2E", label: "Bosque" },
];

export const BOOTS_COLORS: { hex: string; label: string }[] = [
  { hex: "#3F2613", label: "Suela tierra" },
  { hex: "#1F1A18", label: "Negro" },
  { hex: "#7A4A24", label: "Cuero claro" },
  { hex: "#A04324", label: "Rojizo" },
];

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: "short", label: "Corto" },
  { id: "wavy",  label: "Ondulado" },
  { id: "bun",   label: "Moño" },
  { id: "buzz",  label: "Rapado" },
  { id: "long",  label: "Largo" },
];

export const OUTFIT_STYLES: { id: OutfitStyle; label: string }[] = [
  { id: "explorer", label: "Explorador" },
  { id: "alpine",   label: "Alpino" },
  { id: "summit",   label: "Cumbre" },
  { id: "trail",    label: "Sendero" },
];

export const DEFAULT_STYLE: ExplorerStyle = {
  skin: "honey",
  hair: "short",
  hairColor: "#5A2F1B",
  jacketColor: "#2F6FE0",
  pantsColor: "#3D3A36",
  bootsColor: "#3F2613",
  outfit: "explorer",
};

/** Pick a fun starter style based on the legacy avatar emoji (onboarding). */
export function styleFromLegacyAvatar(avatar: string): ExplorerStyle {
  const map: Record<string, Partial<ExplorerStyle>> = {
    "🧗": { jacketColor: "#E0712F", hairColor: "#1F1A18" },
    "🦊": { jacketColor: "#E0712F", hairColor: "#D6622B", skin: "porcelain" },
    "🐻": { jacketColor: "#5C4A33", hairColor: "#5A2F1B", skin: "tan" },
    "🦉": { jacketColor: "#7A6A55", hairColor: "#9C6A2A" },
    "🐧": { jacketColor: "#1F2A44", hairColor: "#1F1A18", skin: "porcelain" },
    "🦁": { jacketColor: "#E5C04A", hairColor: "#D4A65A", skin: "honey" },
    "🐰": { jacketColor: "#7A4FD1", hairColor: "#9AA0A6", skin: "porcelain" },
    "🐸": { jacketColor: "#2EA86F", hairColor: "#3FB59A", skin: "honey" },
  };
  return { ...DEFAULT_STYLE, ...(map[avatar] ?? {}) };
}

function read(): ExplorerStyle {
  if (typeof window === "undefined") return { ...DEFAULT_STYLE };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STYLE };
    const parsed = JSON.parse(raw) as Partial<ExplorerStyle>;
    return { ...DEFAULT_STYLE, ...parsed };
  } catch {
    return { ...DEFAULT_STYLE };
  }
}

function write(style: ExplorerStyle) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(style));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

export function getExplorerStyle(): ExplorerStyle {
  return read();
}

export function saveExplorerStyle(patch: Partial<ExplorerStyle>) {
  const next = { ...read(), ...patch };
  write(next);
}

export function clearExplorerStyle() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

export const EXPLORER_STYLE_EVENT = EVENT;
