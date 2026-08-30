'use client'

import { RISK_META } from '@/lib/risk-engine'
import type { GuardianData } from '@/lib/use-guardian-data'
import type { RiskLevel } from '@/lib/types'

const LEVELS: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

export function RiskMap({ data }: { data: GuardianData }) {
  const { locations, selectedId, selectLocation } = data

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Northeast India Risk Map</h2>
          <p className="text-[11px] text-muted-foreground">
            Select a location marker to inspect its readings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {LEVELS.map((lvl) => (
            <span key={lvl} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: RISK_META[lvl].token }}
              />
              {RISK_META[lvl].label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-panel">
        <svg
          viewBox="0 0 100 100"
          className="h-auto w-full"
          role="img"
          aria-label="Interactive risk map of Northeast India"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* contour backdrop */}
          <defs>
            <radialGradient id="terrainGlow" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#terrainGlow)" />

          {/* stylized ridge contours */}
          {[18, 30, 42, 54, 66, 78].map((y, i) => (
            <path
              key={y}
              d={`M -5 ${y} Q 25 ${y - 8 - i}, 50 ${y} T 105 ${y - 4}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.3"
              opacity="0.5"
            />
          ))}
          {/* river */}
          <path
            d="M 30 40 Q 45 46, 55 44 T 88 34"
            fill="none"
            stroke="var(--chart-2)"
            strokeWidth="0.6"
            opacity="0.4"
          />

          {/* markers */}
          {locations.map((loc) => {
            const meta = RISK_META[loc.riskLevel]
            const isSelected = loc.id === selectedId
            const isCritical = loc.riskLevel === 'CRITICAL'
            return (
              <g
                key={loc.id}
                transform={`translate(${loc.x} ${loc.y})`}
                className="cursor-pointer"
                onClick={() => selectLocation(loc.id)}
                role="button"
                aria-label={`${loc.name}, ${loc.state}. Risk ${loc.riskLevel}, score ${loc.riskScore}`}
              >
                {(isCritical || isSelected) && (
                  <circle r="3.6" fill={meta.token} opacity="0.25">
                    <animate
                      attributeName="r"
                      values="2.4;4.4;2.4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.35;0;0.35"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  r={isSelected ? 2.4 : 1.9}
                  fill={meta.token}
                  stroke={isSelected ? 'var(--foreground)' : 'var(--background)'}
                  strokeWidth={isSelected ? 0.7 : 0.4}
                />
                <text
                  x="0"
                  y="-3"
                  textAnchor="middle"
                  fontSize="2.4"
                  fill="var(--foreground)"
                  className="pointer-events-none select-none font-medium"
                  opacity={isSelected ? 1 : 0.72}
                >
                  {loc.name}
                </text>
              </g>
            )
          })}
        </svg>
        <span className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Schematic · not to scale
        </span>
      </div>
    </div>
  )
}
