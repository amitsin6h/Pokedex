"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { gqlClient } from "@/lib/graphql-client";
import { GET_POKEMON_DETAIL } from "@/lib/queries";
import { STAT_LABELS, STAT_COLORS } from "@/lib/constants";
import {
  formatName,
  getArtworkUrl,
  getTypeColor,
  padId,
  totalBaseStats,
  formatHeight,
  formatWeight,
} from "@/lib/utils";
import type { PokemonDetail } from "@/lib/types";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [details, setDetails] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length === 0) {
      setDetails([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      compareList.map((p) =>
        gqlClient
          .request<{ pokemon_v2_pokemon: PokemonDetail[] }>(GET_POKEMON_DETAIL, {
            id: p.id,
          })
          .then((d) => d.pokemon_v2_pokemon[0])
      )
    )
      .then(setDetails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [compareList]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
      </div>
    );
  }

  if (compareList.length < 2) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <svg
          className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Select at least 2 Pokémon to compare
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Go back and click the + button on Pokémon cards
        </p>
        <Link
          href="/"
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          ← Browse Pokémon
        </Link>
      </div>
    );
  }

  const statNames = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
  ];

  // Find max stat for each stat across all pokemon for highlighting
  const maxStats: Record<string, number> = {};
  statNames.forEach((stat) => {
    maxStats[stat] = Math.max(
      ...details.map(
        (d) =>
          d.pokemon_v2_pokemonstats.find(
            (s) => s.pokemon_v2_stat.name === stat
          )?.base_stat ?? 0
      )
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            Compare Pokémon
          </h1>
        </div>
        <button
          onClick={clearCompare}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Clear all
        </button>
      </div>

      {/* Pokémon header cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${details.length}, 1fr)` }}>
        {details.map((p) => {
          const primaryType =
            p.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name ?? "normal";
          return (
            <div
              key={p.id}
              className="relative rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => removeFromCompare(p.id)}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <Link href={`/pokemon/${p.id}`}>
                <div className="relative mx-auto h-28 w-28">
                  <Image
                    src={getArtworkUrl(p.id)}
                    alt={p.name}
                    fill
                    sizes="112px"
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">#{padId(p.id)}</p>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {formatName(p.name)}
                </h3>
                <div className="mt-2 flex justify-center gap-1.5">
                  {p.pokemon_v2_pokemontypes.map(({ pokemon_v2_type: t }) => (
                    <span
                      key={t.name}
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                      style={{ backgroundColor: getTypeColor(t.name) }}
                    >
                      {formatName(t.name)}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Stat comparison bars */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Base Stats Comparison
        </h2>
        <div className="space-y-6">
          {statNames.map((stat) => (
            <div key={stat}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {STAT_LABELS[stat]}
                </span>
              </div>
              <div className="space-y-1.5">
                {details.map((p) => {
                  const value =
                    p.pokemon_v2_pokemonstats.find(
                      (s) => s.pokemon_v2_stat.name === stat
                    )?.base_stat ?? 0;
                  const isMax = value === maxStats[stat] && details.length > 1;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="w-20 truncate text-xs text-gray-500 dark:text-gray-400">
                        {formatName(p.name)}
                      </span>
                      <div className="flex-1">
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(value / 255) * 100}%`,
                              backgroundColor:
                                STAT_COLORS[stat] ?? "#6366f1",
                              opacity: isMax ? 1 : 0.5,
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className={
                          "w-8 text-right text-xs font-bold " +
                          (isMax
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-gray-500")
                        }
                      >
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Total
            </span>
            <div className="flex gap-6">
              {details.map((p) => (
                <span
                  key={p.id}
                  className="text-sm font-bold text-gray-800 dark:text-gray-100"
                >
                  {formatName(p.name)}: {totalBaseStats(p.pokemon_v2_pokemonstats)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Physical comparison */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Physical Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                  Attribute
                </th>
                {details.map((p) => (
                  <th
                    key={p.id}
                    className="py-2 text-center font-medium text-gray-700 dark:text-gray-200"
                  >
                    {formatName(p.name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-2 text-gray-500 dark:text-gray-400">Height</td>
                {details.map((p) => (
                  <td key={p.id} className="py-2 text-center text-gray-700 dark:text-gray-200">
                    {formatHeight(p.height).m} m
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-2 text-gray-500 dark:text-gray-400">Weight</td>
                {details.map((p) => (
                  <td key={p.id} className="py-2 text-center text-gray-700 dark:text-gray-200">
                    {formatWeight(p.weight).kg} kg
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-2 text-gray-500 dark:text-gray-400">Abilities</td>
                {details.map((p) => (
                  <td key={p.id} className="py-2 text-center text-gray-700 dark:text-gray-200">
                    {p.pokemon_v2_pokemonabilities
                      .map((a) => formatName(a.pokemon_v2_ability.name))
                      .join(", ")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-gray-500 dark:text-gray-400">
                  Catch Rate
                </td>
                {details.map((p) => (
                  <td key={p.id} className="py-2 text-center text-gray-700 dark:text-gray-200">
                    {p.pokemon_v2_pokemonspecy.capture_rate}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
