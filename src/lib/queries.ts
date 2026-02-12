import { gql } from "graphql-request";

export const GET_POKEMON_LIST = gql`
  query GetPokemonList(
    $limit: Int!
    $offset: Int!
    $where: pokemon_v2_pokemon_bool_exp
    $order_by: [pokemon_v2_pokemon_order_by!]
  ) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $order_by
    ) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_generation {
          name
        }
      }
    }
    pokemon_v2_pokemon_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_POKEMON_DETAIL = gql`
  query GetPokemonDetail($id: Int!) {
    pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        effort
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
        }
        is_hidden
      }
      pokemon_v2_pokemonspecy {
        base_happiness
        capture_rate
        gender_rate
        growth_rate_id
        hatch_counter
        pokemon_v2_pokemonspeciesnames(
          where: { language_id: { _eq: 9 } }
        ) {
          name
          genus
        }
        pokemon_v2_pokemonspeciesflavortexts(
          where: { language_id: { _eq: 9 } }
          limit: 1
          order_by: { id: desc }
        ) {
          flavor_text
        }
        pokemon_v2_generation {
          name
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies(order_by: { id: asc }) {
            name
            id
            evolves_from_species_id
          }
        }
      }
    }
  }
`;

export const GET_TYPES_AND_GENERATIONS = gql`
  query GetTypesAndGenerations {
    pokemon_v2_type(where: { id: { _lt: 10000 } }, order_by: { name: asc }) {
      id
      name
    }
    pokemon_v2_generation(order_by: { id: asc }) {
      id
      name
    }
  }
`;
