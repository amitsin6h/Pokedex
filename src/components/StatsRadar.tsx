"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { STAT_LABELS, STAT_COLORS } from "@/lib/constants";

interface StatItem {
  base_stat: number;
  pokemon_v2_stat: { name: string };
}

interface Props {
  stats: StatItem[];
  color?: string;
}

export default function StatsRadar({ stats, color = "#6366f1" }: Props) {
  const data = stats.map((s) => ({
    stat: STAT_LABELS[s.pokemon_v2_stat.name] ?? s.pokemon_v2_stat.name,
    value: s.base_stat,
    fullMark: 255,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="stat"
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 255]}
          tick={false}
          axisLine={false}
        />
        <Radar
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/** Horizontal stat bars for the detail page */
export function StatBars({ stats }: Props) {
  const maxStat = 255;

  return (
    <div className="space-y-3">
      {stats.map((s) => {
        const name = s.pokemon_v2_stat.name;
        const pct = (s.base_stat / maxStat) * 100;
        return (
          <div key={name} className="flex items-center gap-3">
            <span className="w-16 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
              {STAT_LABELS[name] ?? name}
            </span>
            <span className="w-8 text-right text-xs font-bold text-gray-700 dark:text-gray-200">
              {s.base_stat}
            </span>
            <div className="flex-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: STAT_COLORS[name] ?? "#6366f1",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
