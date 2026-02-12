"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getArtworkUrl, formatName } from "@/lib/utils";

interface EvolutionSpecies {
  name: string;
  id: number;
  evolves_from_species_id: number | null;
}

interface Props {
  chain: EvolutionSpecies[];
  currentId: number;
}

/**
 * Build evolution stages from the flat list.
 * Stage 0 = base (no evolves_from), Stage 1 = evolves from stage 0, etc.
 */
function buildStages(chain: EvolutionSpecies[]): EvolutionSpecies[][] {
  const stages: EvolutionSpecies[][] = [];
  // Find base forms (evolves_from_species_id === null)
  const bases = chain.filter((s) => s.evolves_from_species_id === null);
  stages.push(bases);

  let currentStage = bases;
  while (currentStage.length > 0) {
    const currentIds = new Set(currentStage.map((s) => s.id));
    const nextStage = chain.filter(
      (s) => s.evolves_from_species_id !== null && currentIds.has(s.evolves_from_species_id)
    );
    if (nextStage.length === 0) break;
    stages.push(nextStage);
    currentStage = nextStage;
  }

  return stages;
}

export default function EvolutionChain({ chain, currentId }: Props) {
  if (!chain || chain.length <= 1) return null;

  const stages = buildStages(chain);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {stages.map((stage, si) => (
        <React.Fragment key={si}>
          {si > 0 && (
            <svg
              className="mx-1 h-5 w-5 text-gray-300 dark:text-gray-600"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          <div className="flex gap-2">
            {stage.map((s) => (
              <Link
                key={s.id}
                href={`/pokemon/${s.id}`}
                className={`flex flex-col items-center rounded-xl p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  s.id === currentId
                    ? "ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-gray-900"
                    : ""
                }`}
              >
                <div className="relative h-16 w-16">
                  <Image
                    src={getArtworkUrl(s.id)}
                    alt={s.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {formatName(s.name)}
                </span>
              </Link>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
