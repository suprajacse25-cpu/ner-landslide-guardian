'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  /** 0-100 fill for the mini bar */
  fill: number
  hint?: string
  tone?: string
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  fill,
  hint,
  tone = 'var(--primary)',
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{
            color: tone,
            backgroundColor: `color-mix(in oklch, ${tone} 14%, transparent)`,
          }}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold tabular-nums">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full rounded-full transition-all duration-700')}
          style={{ width: `${Math.min(100, Math.max(0, fill))}%`, backgroundColor: tone }}
        />
      </div>
      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}
