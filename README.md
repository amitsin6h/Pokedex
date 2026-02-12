# Pokédex

A modern Pokédex built with **Next.js**, **TypeScript**, **Tailwind CSS**, and the **PokéAPI GraphQL** endpoint.

## Features

- **Browse** — Paginated grid of 1025 Pokémon with official artwork
- **Search** — Debounced name search
- **Filter** — By type (18 types) and generation (Gen I–IX)
- **Sort** — By Pokédex #, name, or base stat total (asc/desc)
- **Detail Page** — Stats bars + radar chart, abilities, profile info, evolution chain
- **Compare** — Select up to 4 Pokémon for side-by-side stat comparison

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | PokéAPI GraphQL (`beta.pokeapi.co/graphql/v1beta`) |
| GraphQL Client | graphql-request |
| Charts | Recharts |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                ← Home grid with search/filter/sort
│   ├── pokemon/[id]/page.tsx   ← Detail page
│   └── compare/page.tsx        ← Comparison page
├── components/                 ← PokemonCard, SearchFilterBar, StatsRadar, EvolutionChain, etc.
├── context/
│   └── CompareContext.tsx      ← Compare cart state (up to 4)
└── lib/
    ├── graphql-client.ts       ← GraphQL client
    ├── queries.ts              ← All GraphQL queries
    ├── types.ts                ← TypeScript interfaces
    ├── constants.ts            ← Type colors, stat labels
    └── utils.ts                ← Formatting helpers
```
