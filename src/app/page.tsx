"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { gqlClient } from "@/lib/graphql-client";
import { GET_POKEMON_LIST } from "@/lib/queries";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { totalBaseStats } from "@/lib/utils";
import type { PokemonListItem, Filters } from "@/lib/types";
import PokemonCard from "@/components/PokemonCard";
import PokemonCardSkeleton from "@/components/PokemonCardSkeleton";
import SearchFilterBar from "@/components/SearchFilterBar";

interface QueryResult {
  pokemon_v2_pokemon: PokemonListItem[];
  pokemon_v2_pokemon_aggregate: { aggregate: { count: number } };
}

export default function HomePage() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "",
    generation: "",
    sortBy: "id",
    sortOrder: "asc",
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const buildWhere = useCallback((f: Filters) => {
    const conditions: Record<string, unknown>[] = [{ id: { _lte: 1025 } }];
    if (f.search) {
      conditions.push({
        name: { _ilike: "%" + f.search.toLowerCase() + "%" },
      });
    }
    if (f.type) {
      conditions.push({
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _eq: f.type } },
        },
      });
    }
    if (f.generation) {
      conditions.push({
        pokemon_v2_pokemonspecy: {
          pokemon_v2_generation: { name: { _eq: f.generation } },
        },
      });
    }
    return { _and: conditions };
  }, []);

  const buildOrderBy = useCallback((f: Filters) => {
    const dir = f.sortOrder;
    if (f.sortBy === "name") return [{ name: dir }];
    return [{ id: dir }];
  }, []);

  const fetchPokemon = useCallback(
    async (f: Filters, pageNum: number) => {
      setLoading(true);
      try {
        const data = await gqlClient.request<QueryResult>(GET_POKEMON_LIST, {
          limit: ITEMS_PER_PAGE,
          offset: pageNum * ITEMS_PER_PAGE,
          where: buildWhere(f),
          order_by: buildOrderBy(f),
        });

        let results = data.pokemon_v2_pokemon;

        if (f.sortBy === "base_stat_total") {
          results = [...results].sort((a, b) => {
            const diff =
              totalBaseStats(a.pokemon_v2_pokemonstats) -
              totalBaseStats(b.pokemon_v2_pokemonstats);
            return f.sortOrder === "asc" ? diff : -diff;
          });
        }

        setPokemon(results);
        setTotalCount(data.pokemon_v2_pokemon_aggregate.aggregate.count);
      } catch (error) {
        console.error("Failed to fetch Pokemon:", error);
      } finally {
        setLoading(false);
      }
    },
    [buildWhere, buildOrderBy]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => {
        setPage(0);
        fetchPokemon(filters, 0);
      },
      filters.search ? 300 : 0
    );
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, fetchPokemon]);

  useEffect(() => {
    if (page > 0) fetchPokemon(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pokédex
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Browse, search, and compare{" "}
          {totalCount > 0 ? `${totalCount} ` : ""}Pokémon
        </p>
      </div>

      <SearchFilterBar filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      ) : pokemon.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            No Pokémon found
          </h3>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {pokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            ← Prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i;
              } else if (page < 4) {
                pageNum = i;
              } else if (page > totalPages - 5) {
                pageNum = totalPages - 7 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors " +
                    (page === pageNum
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800")
                  }
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
