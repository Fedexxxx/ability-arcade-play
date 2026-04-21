// Climbing-themed cosmetic shop catalog.
// All items are purely cosmetic. Rarity affects price and visual treatment only.

import type { CosmeticSlot } from "@/lib/wallet";

export type Rarity = "common" | "rare" | "epic";

export interface ShopItem {
  id: string;
  slot: CosmeticSlot;
  name: string;
  description: string;
  /** Single emoji glyph used as the visual representation in the MVP avatar. */
  glyph: string;
  rarity: Rarity;
  price: number;
}

export const RARITY_META: Record<Rarity, { label: string; ring: string; chip: string }> = {
  common: {
    label: "Común",
    ring: "ring-1 ring-border",
    chip: "bg-muted text-muted-foreground",
  },
  rare: {
    label: "Raro",
    ring: "ring-2 ring-primary/40",
    chip: "bg-primary-soft text-primary",
  },
  epic: {
    label: "Épico",
    ring: "ring-2 ring-secondary/60 shadow-summit",
    chip: "bg-secondary-soft text-secondary",
  },
};

export const SLOT_META: Record<CosmeticSlot, { label: string; emoji: string }> = {
  hat:      { label: "Gorras y cascos", emoji: "🧢" },
  scarf:    { label: "Bufandas",        emoji: "🧣" },
  backpack: { label: "Mochilas",        emoji: "🎒" },
  boots:    { label: "Botas",           emoji: "🥾" },
  badge:    { label: "Insignias",       emoji: "🎖️" },
};

export const SHOP_ITEMS: ShopItem[] = [
  // Hats / helmets
  { id: "hat-cap-base",     slot: "hat",      name: "Gorra de campamento", description: "Para los días de sol largo.",           glyph: "🧢", rarity: "common", price: 60 },
  { id: "hat-helmet-climb", slot: "hat",      name: "Casco de escalador",  description: "Protege la cabeza en cumbres altas.",   glyph: "⛑️",  rarity: "rare",   price: 180 },
  { id: "hat-crown-summit", slot: "hat",      name: "Corona de la cima",   description: "Solo para grandes maestros.",           glyph: "👑", rarity: "epic",   price: 600 },

  // Scarves
  { id: "scarf-wool",       slot: "scarf",    name: "Bufanda de lana",     description: "Calientita para el frío de la base.",   glyph: "🧣", rarity: "common", price: 60 },
  { id: "scarf-aurora",     slot: "scarf",    name: "Bufanda aurora",      description: "Brilla como el cielo del norte.",       glyph: "🌈", rarity: "rare",   price: 180 },

  // Backpacks
  { id: "bp-day",           slot: "backpack", name: "Mochila de día",      description: "Lo justo para una caminata corta.",     glyph: "🎒", rarity: "common", price: 80 },
  { id: "bp-expedition",    slot: "backpack", name: "Mochila de expedición", description: "Para subidas de varios días.",       glyph: "🧳", rarity: "rare",   price: 220 },

  // Boots
  { id: "boots-trail",      slot: "boots",    name: "Botas de sendero",    description: "Buen agarre en piedra y barro.",        glyph: "🥾", rarity: "common", price: 70 },
  { id: "boots-snow",       slot: "boots",    name: "Botas de nieve",      description: "Aisladas para cumbres heladas.",        glyph: "🎿", rarity: "rare",   price: 200 },

  // Badges (purely decorative pin)
  { id: "badge-compass",    slot: "badge",    name: "Insignia brújula",    description: "Para los que nunca pierden el norte.",  glyph: "🧭", rarity: "common", price: 50 },
  { id: "badge-flag",       slot: "badge",    name: "Insignia bandera",    description: "Marca cada cumbre alcanzada.",          glyph: "🚩", rarity: "rare",   price: 160 },
  { id: "badge-summit",     slot: "badge",    name: "Insignia cumbre",     description: "Solo para los que tocan la cima.",      glyph: "🏔️", rarity: "epic",   price: 500 },
];

export function getItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export function itemsBySlot(slot: CosmeticSlot): ShopItem[] {
  return SHOP_ITEMS.filter((i) => i.slot === slot);
}
