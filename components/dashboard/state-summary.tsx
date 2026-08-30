'use client'

import { Map } from 'lucide-react'
import { RISK_META } from '@/lib/risk-engine'
import type { GuardianData } from '@/lib/use-guardian-data'
import { RiskBadge } from '@/components/risk-badge'
import { TrendIndicator } from '@/components/trend-indicator'

export function StateSummary({ data }: { data: GuardianData }) {
  const { stateSummary } = data

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">State-wise Risk Summary</h2>
        </div>
        <span className="text-[11px] text-muted-foreground">{stateSummary.length} states</span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {stateSummary.map((s) => {
          const meta = RISK_META[s.level]
          return (
            <div
              key={s.state}
              className="rounded-lg border border-border bg-panel p-3"
              style={{
                boxShadow: `inset 3px 0 0 0 ${meta.token}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold" title={s.state}>
                    {s.state}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {s.siteCount} site{s.siteCount > 1 ? 's' : ''}
                    {s.highRiskCount > 0 && ` · ${s.highRiskCount} at risk`}
                  </p>
                </div>
                <span className="font-mono text-lg font-semibold" style={{ color: meta.token }}>
                  {s.score}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <RiskBadge level={s.level} size="sm" />
                <TrendIndicator trend={s.trend} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
