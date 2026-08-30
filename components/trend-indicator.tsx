import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { TREND_META } from '@/lib/risk-engine'
import type { RiskTrend } from '@/lib/types'
import { cn } from '@/lib/utils'

const ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const

interface TrendIndicatorProps {
  trend: RiskTrend
  className?: string
  showLabel?: boolean
}

export function TrendIndicator({ trend, className, showLabel = true }: TrendIndicatorProps) {
  const meta = TREND_META[trend]
  const Icon = ICONS[meta.direction]
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-[11px] font-medium', className)}
      style={{ color: meta.token }}
      title={`Risk trend: ${meta.label}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {showLabel && <span>{meta.label}</span>}
    </span>
  )
}
