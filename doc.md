pokedex/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout with providers
│   │   ├── globals.css         ← Tailwind + dark mode + custom scrollbar
│   │   ├── page.tsx            ← Home: grid + search + filter + pagination
│   │   ├── pokemon/[id]/page.tsx  ← Detail: stats, profile, evolution
│   │   └── compare/page.tsx    ← Side-by-side stat comparison
│   ├── components/
│   │   ├── Header.tsx          ← Sticky header with Pokéball logo + dark toggle
│   │   ├── PokemonCard.tsx     ← Card with artwork, types, compare button
│   │   ├── PokemonCardSkeleton.tsx  ← Loading skeleton
│   │   ├── SearchFilterBar.tsx ← Debounced search, type/gen filters, sorting
│   │   ├── StatsRadar.tsx      ← Recharts radar chart + horizontal bars
│   │   ├── EvolutionChain.tsx  ← Multi-stage evolution with sprites
│   │   └── CompareTray.tsx     ← Floating bottom bar for selected Pokémon
│   ├── context/
│   │   ├── CompareContext.tsx   ← Compare cart state (up to 4 Pokémon)
│   └── lib/
│       ├── graphql-client.ts    ← graphql-request client
│       ├── queries.ts           ← All GraphQL queries
│       ├── types.ts             ← TypeScript interfaces
│       ├── constants.ts         ← Type colors, stat labels, generation labels
│       └── utils.ts             ← Formatting helpers


