import { TYPE_COLORS } from "./constants";

/** Zero-pad a pokemon ID → "001", "025", etc. */
export function padId(id: number): string {
  return String(id).padStart(3, "0");
}

/** Capitalize first letter of each word, replace hyphens with spaces */
export function formatName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Official artwork URL from PokeAPI sprites repo */
export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** Sprite URL */
export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** Get hex colour for a Pokémon type */
export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? "#68A090";
}

/** Clean up flavor text (API returns \n \f chars) */
export function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r]/g, " ").replace(/\s+/g, " ").trim();
}

/** Total base stats */
export function totalBaseStats(
  stats: { base_stat: number }[]
): number {
  return stats.reduce((sum, s) => sum + s.base_stat, 0);
}

/** Gender ratio helpers – API returns -1 for genderless, 0-8 female eighths */
export function getGenderRatios(genderRate: number) {
  if (genderRate === -1) return { male: -1, female: -1, genderless: true };
  const female = (genderRate / 8) * 100;
  const male = 100 - female;
  return { male, female, genderless: false };
}

/** Convert hectograms → kg and lbs */
export function formatWeight(hectograms: number) {
  const kg = (hectograms / 10).toFixed(1);
  const lbs = (hectograms * 0.220462).toFixed(1);
  return { kg, lbs };
}

/** Convert decimetres → metres and feet */
export function formatHeight(decimetres: number) {
  const m = (decimetres / 10).toFixed(1);
  const ft = (decimetres * 0.328084).toFixed(1);
  return { m, ft };
}
