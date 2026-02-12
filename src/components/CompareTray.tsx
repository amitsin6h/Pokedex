"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { formatName, getSpriteUrl } from "@/lib/utils";

export default function CompareTray() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Compare ({compareList.length}/4):
          </span>
          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-1 pr-2.5 dark:bg-gray-800"
              >
                <Image
                  src={getSpriteUrl(p.id)}
                  alt={p.name}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {formatName(p.name)}
                </span>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  className="ml-0.5 text-gray-400 hover:text-red-500"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearCompare}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Clear
          </button>
          {compareList.length >= 2 && (
            <Link
              href="/compare"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Compare →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
