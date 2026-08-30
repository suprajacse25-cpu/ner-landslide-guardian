'use client'

import { RISK_META } from '@/lib/risk-engine'
import type { RiskLevel } from '@/lib/types'

interface RiskGaugeProps {
  score: number
  level: RiskLevel
  size?: number
}

export function RiskGauge({ score, level, size = 176 }: RiskGaugeProps) {
  const meta = RISK_META[level]
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  // 270-degree arc (three quarters) for a speedometer feel.
  const arc = 0.75
  const dash = circumference * arc
  const progress = dash * (score / 100)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(135deg)' }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={meta.token}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold tabular-nums" style={{ color: meta.token }}>
          {score}
        </span>
        <span className="text-[11px] text-muted-foreground">/ 100</span>
        <span
          className="mt-1 text-sm font-semibold uppercase tracking-wide"
          style={{ color: meta.token }}
        >
          {level}
        </span>
      </div>
      <span className="sr-only">
        Overall risk score {score} out of 100, level {level}
      </span>
    </div>
  )
}
