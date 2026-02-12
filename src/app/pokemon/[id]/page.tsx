"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { gqlClient } from "@/lib/graphql-client";
import { GET_POKEMON_DETAIL } from "@/lib/queries";
import { STAT_LABELS, STAT_COLORS, GROWTH_RATES, GENERATION_LABELS } from "@/lib/constants";
import {
  padId,
  formatName,
  getArtworkUrl,
  getTypeColor,
  cleanFlavorText,
  totalBaseStats,
  getGenderRatios,
  formatWeight,
  formatHeight,
} from "@/lib/utils";
import type { PokemonDetail } from "@/lib/types";
import StatsRadar, { StatBars } from "@/components/StatsRadar";
import EvolutionChain from "@/components/EvolutionChain";

export default function PokemonDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    gqlClient
      .request<{ pokemon_v2_pokemon: PokemonDetail[] }>(GET_POKEMON_DETAIL, { id })
      .then((data) => {
        setPokemon(data.pokemon_v2_pokemon[0] ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Pokémon not found
        </h2>
        <Link href="/" className="mt-4 text-indigo-600 hover:underline dark:text-indigo-400">
          ← Back to Pokédex
        </Link>
      </div>
    );
  }

  const species = pokemon.pokemon_v2_pokemonspecy;
  const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name ?? "normal";
  const typeColor = getTypeColor(primaryType);
  const speciesName =
    species.pokemon_v2_pokemonspeciesnames[0]?.name ?? formatName(pokemon.name);
  const genus = species.pokemon_v2_pokemonspeciesnames[0]?.genus ?? "";
  const flavorText = species.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text ?? "";
  const gender = getGenderRatios(species.gender_rate);
  const weight = formatWeight(pokemon.weight);
  const height = formatHeight(pokemon.height);
  const evolutionChain = species.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies ?? [];

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Pokédex
      </Link>

      {/* Hero section */}
      <div
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: `linear-gradient(135deg, ${typeColor}22, ${typeColor}08)`,
        }}
      >
        <div className="flex flex-col items-center gap-8 md:flex-row">
          {/* Artwork */}
          <div className="relative h-64 w-64 shrink-0">
            <Image
              src={getArtworkUrl(pokemon.id)}
              alt={pokemon.name}
              fill
              sizes="256px"
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
              #{padId(pokemon.id)}
            </span>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {speciesName}
            </h1>
            {genus && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {genus}
              </p>
            )}

            {/* Type badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {pokemon.pokemon_v2_pokemontypes.map(({ pokemon_v2_type: t }) => (
                <span
                  key={t.name}
                  className="rounded-full px-4 py-1 text-sm font-medium text-white shadow-sm"
                  style={{ backgroundColor: getTypeColor(t.name) }}
                >
                  {formatName(t.name)}
                </span>
              ))}
            </div>

            {/* Description */}
            {flavorText && (
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {cleanFlavorText(flavorText)}
              </p>
            )}

            {/* Quick stats */}
            <div className="mt-4 flex flex-wrap justify-center gap-6 md:justify-start">
              <div>
                <span className="text-xs text-gray-400">Height</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {height.m} m ({height.ft} ft)
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Weight</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {weight.kg} kg ({weight.lbs} lbs)
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Base Stat Total</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {totalBaseStats(pokemon.pokemon_v2_pokemonstats)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Profile grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Base Stats */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Base Stats
          </h2>
          <StatBars stats={pokemon.pokemon_v2_pokemonstats} />
        </div>

        {/* Radar Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Stats Radar
          </h2>
          <StatsRadar stats={pokemon.pokemon_v2_pokemonstats} color={typeColor} />
        </div>
      </div>

      {/* Profile section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile info */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Profile
          </h2>
          <div className="space-y-3">
            <ProfileRow label="Generation" value={GENERATION_LABELS[species.pokemon_v2_generation.name] ?? species.pokemon_v2_generation.name} />
            <ProfileRow label="Catch Rate" value={`${species.capture_rate}`} />
            <ProfileRow label="Base Happiness" value={`${species.base_happiness}`} />
            <ProfileRow label="Growth Rate" value={GROWTH_RATES[species.growth_rate_id] ?? "Unknown"} />
            <ProfileRow label="Hatch Steps" value={`${255 * (species.hatch_counter + 1)}`} />
            <ProfileRow
              label="Gender"
              value={
                gender.genderless
                  ? "Genderless"
                  : `♂ ${gender.male.toFixed(1)}%  ♀ ${gender.female.toFixed(1)}%`
              }
            />
          </div>
        </div>

        {/* Abilities */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Abilities
          </h2>
          <div className="space-y-3">
            {pokemon.pokemon_v2_pokemonabilities.map((a) => (
              <div
                key={a.pokemon_v2_ability.name}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-gray-800"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {formatName(a.pokemon_v2_ability.name)}
                </span>
                {a.is_hidden && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                    Hidden
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Effort Values */}
          <h3 className="mb-2 mt-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Effort Values (EVs)
          </h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.pokemon_v2_pokemonstats
              .filter((s) => s.effort > 0)
              .map((s) => (
                <span
                  key={s.pokemon_v2_stat.name}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{
                    backgroundColor:
                      STAT_COLORS[s.pokemon_v2_stat.name] ?? "#6366f1",
                  }}
                >
                  {s.effort} {STAT_LABELS[s.pokemon_v2_stat.name]}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      {evolutionChain.length > 1 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Evolution Chain
          </h2>
          <EvolutionChain chain={evolutionChain} currentId={pokemon.id} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {pokemon.id > 1 ? (
          <Link
            href={`/pokemon/${pokemon.id - 1}`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            #{padId(pokemon.id - 1)}
          </Link>
        ) : (
          <div />
        )}
        {pokemon.id < 1025 && (
          <Link
            href={`/pokemon/${pokemon.id + 1}`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            #{padId(pokemon.id + 1)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {value}
      </span>
    </div>
  );
}
