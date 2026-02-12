"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { padId, formatName, getArtworkUrl, getTypeColor } from "@/lib/utils";
import type { PokemonListItem } from "@/lib/types";

interface Props {
  pokemon: PokemonListItem;
}

export default function PokemonCard({ pokemon }: Props) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(pokemon.id);
  const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name ?? "normal";
  const typeColor = getTypeColor(primaryType);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(pokemon.id);
    } else {
      addToCompare(pokemon);
    }
  };

  return (
    <Link href={`/pokemon/${pokemon.id}`} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600"
      >
        {/* Background gradient accent */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{ background: `linear-gradient(135deg, ${typeColor}, transparent 60%)` }}
        />

        {/* Compare button */}
        <button
          onClick={handleCompareClick}
          className={`absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
            inCompare
              ? "bg-indigo-500 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {inCompare ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </>
            )}
          </svg>
          {inCompare ? "Added" : "Compare"}
        </button>

        {/* Pokemon ID */}
        <span className="relative text-xs font-semibold text-gray-400 dark:text-gray-500">
          #{padId(pokemon.id)}
        </span>

        {/* Artwork */}
        <div className="relative mx-auto my-2 h-28 w-28">
          <Image
            src={getArtworkUrl(pokemon.id)}
            alt={pokemon.name}
            fill
            sizes="112px"
            className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
            priority={pokemon.id <= 20}
          />
        </div>

        {/* Name */}
        <h3 className="relative mb-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">
          {formatName(pokemon.name)}
        </h3>

        {/* Type badges */}
        <div className="relative flex items-center justify-center gap-1.5">
          {pokemon.pokemon_v2_pokemontypes.map(({ pokemon_v2_type: t }) => (
            <span
              key={t.name}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white shadow-sm"
              style={{ backgroundColor: getTypeColor(t.name) }}
            >
              {formatName(t.name)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
