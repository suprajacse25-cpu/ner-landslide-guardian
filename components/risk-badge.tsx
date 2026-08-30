import { RISK_META } from '@/lib/risk-engine'
import type { RiskLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
  size?: 'sm' | 'md'
}

export function RiskBadge({ level, className, size = 'md' }: RiskBadgeProps) {
  const meta = RISK_META[level]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
      style={{
        color: meta.token,
        backgroundColor: `color-mix(in oklch, ${meta.token} 16%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${meta.token} 40%, transparent)`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: meta.token }}
        aria-hidden="true"
      />
      {level}
    </span>
  )
}
