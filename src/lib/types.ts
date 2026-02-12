// ── Pokémon list item (grid card) ──
export interface PokemonListItem {
  id: number;
  name: string;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
      id: number;
    };
  }[];
  pokemon_v2_pokemonstats: {
    base_stat: number;
    pokemon_v2_stat: { name: string };
  }[];
  pokemon_v2_pokemonspecy: {
    pokemon_v2_generation: { name: string };
  } | null;
}

// ── Full Pokémon detail ──
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: { name: string; id: number };
  }[];
  pokemon_v2_pokemonstats: {
    base_stat: number;
    effort: number;
    pokemon_v2_stat: { name: string };
  }[];
  pokemon_v2_pokemonabilities: {
    pokemon_v2_ability: { name: string };
    is_hidden: boolean;
  }[];
  pokemon_v2_pokemonspecy: {
    base_happiness: number;
    capture_rate: number;
    gender_rate: number;
    growth_rate_id: number;
    hatch_counter: number;
    pokemon_v2_pokemonspeciesnames: { name: string; genus: string }[];
    pokemon_v2_pokemonspeciesflavortexts: { flavor_text: string }[];
    pokemon_v2_generation: { name: string };
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: {
        name: string;
        id: number;
        evolves_from_species_id: number | null;
      }[];
    };
  };
}

// ── Filter/Sort state ──
export type SortField = "id" | "name" | "base_stat_total";
export type SortOrder = "asc" | "desc";

export interface Filters {
  search: string;
  type: string;
  generation: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}
