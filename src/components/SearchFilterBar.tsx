"use client";

import React, { useEffect, useState } from "react";
import { gqlClient } from "@/lib/graphql-client";
import { GET_TYPES_AND_GENERATIONS } from "@/lib/queries";
import { GENERATION_LABELS } from "@/lib/constants";
import type { Filters, SortField, SortOrder } from "@/lib/types";
import { formatName } from "@/lib/utils";

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

interface FilterData {
  types: { id: number; name: string }[];
  generations: { id: number; name: string }[];
}

export default function SearchFilterBar({ filters, onFiltersChange }: Props) {
  const [filterData, setFilterData] = useState<FilterData>({ types: [], generations: [] });

  useEffect(() => {
    gqlClient
      .request<{
        pokemon_v2_type: { id: number; name: string }[];
        pokemon_v2_generation: { id: number; name: string }[];
      }>(GET_TYPES_AND_GENERATIONS)
      .then((data) => {
        setFilterData({
          types: data.pokemon_v2_type,
          generations: data.pokemon_v2_generation,
        });
      });
  }, []);

  const update = (partial: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
        />
        {filters.search && (
          <button
            onClick={() => update({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filter */}
        <select
          value={filters.type}
          onChange={(e) => update({ type: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition-colors focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          <option value="">All Types</option>
          {filterData.types.map((t) => (
            <option key={t.id} value={t.name}>
              {formatName(t.name)}
            </option>
          ))}
        </select>

        {/* Generation filter */}
        <select
          value={filters.generation}
          onChange={(e) => update({ generation: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition-colors focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          <option value="">All Generations</option>
          {filterData.generations.map((g) => (
            <option key={g.id} value={g.name}>
              {GENERATION_LABELS[g.name] ?? g.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => update({ sortBy: e.target.value as SortField })}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition-colors focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          <option value="id">Sort by #</option>
          <option value="name">Sort by Name</option>
          <option value="base_stat_total">Sort by Base Stats</option>
        </select>

        {/* Sort order toggle */}
        <button
          onClick={() => update({ sortOrder: (filters.sortOrder === "asc" ? "desc" : "asc") as SortOrder })}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          title={filters.sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${filters.sortOrder === "desc" ? "rotate-180" : ""}`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        {/* Clear filters */}
        {(filters.search || filters.type || filters.generation) && (
          <button
            onClick={() => update({ search: "", type: "", generation: "" })}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
