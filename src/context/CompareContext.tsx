"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { PokemonListItem } from "@/lib/types";

interface CompareContextType {
  compareList: PokemonListItem[];
  addToCompare: (pokemon: PokemonListItem) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<PokemonListItem[]>([]);

  const addToCompare = useCallback((pokemon: PokemonListItem) => {
    setCompareList((prev) => {
      if (prev.length >= 4) return prev;
      if (prev.find((p) => p.id === pokemon.id)) return prev;
      return [...prev, pokemon];
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback(
    (id: number) => compareList.some((p) => p.id === id),
    [compareList]
  );

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
