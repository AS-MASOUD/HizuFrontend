"use client";

import React, { useState } from "react";
import { CompareItem } from "@/types";
import { RADAR_METRICS, calculateProductMetrics } from "@/lib/utils/comparisonEngine";
import { toPersianDigits } from "@/lib/utils/formatters";

interface RadarChartProps {
  products: CompareItem[];
  mode?: "single" | "overlay";
  activeProductId?: string;
}

const PALETTE = [
  { stroke: "#082719", fill: "rgba(8, 39, 25, 0.22)", dot: "#082719", name: "محصول اول" },
  { stroke: "#0284c7", fill: "rgba(2, 132, 199, 0.20)", dot: "#0284c7", name: "محصول دوم" },
  { stroke: "#8f6d2f", fill: "rgba(143, 109, 47, 0.22)", dot: "#8f6d2f", name: "محصول سوم" },
];

export default function RadarChart({ products, mode = "overlay", activeProductId }: RadarChartProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Chart geometry constants
  const size = 360;
  const center = size / 2;
  const radius = 115;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const numAxes = RADAR_METRICS.length;

  // Filter products if single mode with activeProductId
  const displayProducts =
    mode === "single" && activeProductId
      ? products.filter((p) => p.id === activeProductId)
      : products;

  // Calculate coordinates for an axis index at a given fraction (0 to 1)
  const getCoordinates = (index: number, fraction: number, rOffset = 0) => {
    // Start at -90deg (12 o'clock) and advance clockwise
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = radius * fraction + rOffset;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon grid points for background rings
  const getLevelPolygon = (fraction: number) => {
    return Array.from({ length: numAxes })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, fraction);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div className="flex flex-col items-center w-full select-none">
      <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible drop-shadow-xs"
        >
          <defs>
            {/* Subtle glow filter */}
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Concentric Grid Rings */}
          {levels.map((lvl, idx) => (
            <polygon
              key={`grid-${idx}`}
              points={getLevelPolygon(lvl)}
              fill={idx % 2 === 0 ? "#FAF7F0" : "#FFFFFF"}
              stroke="#1c211b"
              strokeOpacity={idx === levels.length - 1 ? 0.25 : 0.12}
              strokeWidth={idx === levels.length - 1 ? 1.5 : 1}
              strokeDasharray={idx < levels.length - 1 ? "2,2" : undefined}
            />
          ))}

          {/* Axis Spokes from center to outer ring */}
          {RADAR_METRICS.map((_, i) => {
            const outer = getCoordinates(i, 1.0);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#1c211b"
                strokeOpacity={0.15}
                strokeWidth={1}
              />
            );
          })}

          {/* Product Data Polygons */}
          {displayProducts.map((prod, prodIdx) => {
            const color = PALETTE[prodIdx % PALETTE.length];
            const metrics = calculateProductMetrics(prod);

            const points = RADAR_METRICS.map((m, mIdx) => {
              const score = metrics[m.key] || 5;
              const fraction = Math.min(Math.max(score / 10, 0.1), 1.0);
              const { x, y } = getCoordinates(mIdx, fraction);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(" ");

            return (
              <g key={prod.id} className="transition-all duration-300">
                {/* Filled Polygon */}
                <polygon
                  points={points}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  filter="url(#radar-glow)"
                  className="transition-all duration-300 hover:stroke-width-3"
                />

                {/* Vertex Dots */}
                {RADAR_METRICS.map((m, mIdx) => {
                  const score = metrics[m.key] || 5;
                  const fraction = Math.min(Math.max(score / 10, 0.1), 1.0);
                  const { x, y } = getCoordinates(mIdx, fraction);
                  const isHovered = hoveredMetric === `${prod.id}-${m.key}`;

                  return (
                    <g key={`dot-${prod.id}-${m.key}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 5.5 : 3.5}
                        fill="#FFFFFF"
                        stroke={color.stroke}
                        strokeWidth={2}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredMetric(`${prod.id}-${m.key}`)}
                        onMouseLeave={() => setHoveredMetric(null)}
                      />
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <g>
                          <rect
                            x={x - 28}
                            y={y - 24}
                            width={56}
                            height={20}
                            rx={4}
                            fill="#161A1D"
                            opacity={0.9}
                          />
                          <text
                            x={x}
                            y={y - 10}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {toPersianDigits(score)} / ۱۰
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Outer Axis Labels */}
          {RADAR_METRICS.map((metric, i) => {
            // Position label slightly outside the 1.0 radius
            const labelPos = getCoordinates(i, 1.0, 22);

            // Alignment tweaks based on quadrant
            let textAnchor: "start" | "middle" | "end" = "middle";
            if (labelPos.x > center + 10) textAnchor = "start";
            else if (labelPos.x < center - 10) textAnchor = "end";

            return (
              <text
                key={`label-${metric.key}`}
                x={labelPos.x}
                y={labelPos.y + 4}
                textAnchor={textAnchor}
                className="text-[11px] font-bold fill-[#161A1D] transition-colors"
                style={{ fontSize: "11px" }}
              >
                {metric.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend for products in overlay mode */}
      {mode === "overlay" && displayProducts.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 bg-[#FAF7F0] px-4 py-2 rounded-xl border border-[#1c211b]/10">
          {displayProducts.map((prod, idx) => {
            const color = PALETTE[idx % PALETTE.length];
            return (
              <div key={prod.id} className="flex items-center gap-2 text-xs font-bold text-[#161A1D]">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: color.stroke }}
                />
                <span className="line-clamp-1 max-w-[160px]">{prod.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
