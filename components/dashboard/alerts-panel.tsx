'use client'

import { BellRing, MapPin, ShieldCheck } from 'lucide-react'
import { RISK_META } from '@/lib/risk-engine'
import type { GuardianData } from '@/lib/use-guardian-data'
import { RiskBadge } from '@/components/risk-badge'

export function AlertsPanel({ data }: { data: GuardianData }) {
  const { alerts, selectLocation } = data

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Early Warning Alerts</h2>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          {alerts.length} active
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
          <ShieldCheck className="size-8 text-risk-low" />
          <p className="text-sm font-medium">No active warnings</p>
          <p className="text-xs text-muted-foreground">All monitored sites are within safe ranges.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const meta = RISK_META[alert.level]
            return (
              <li
                key={alert.id}
                className="rounded-lg border border-border p-4"
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: meta.token,
                  backgroundColor: `color-mix(in oklch, ${meta.token} 6%, transparent)`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => selectLocation(alert.locationId)}
                    className="flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  >
                    <MapPin className="size-3.5 text-muted-foreground" />
                    {alert.locationName}
                  </button>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={alert.level} size="sm" />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {alert.issuedAt}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Reason: </span>
                  {alert.reason}
                </p>
                <p className="mt-1.5 text-xs">
                  <span className="font-medium" style={{ color: meta.token }}>
                    Recommended action:{' '}
                  </span>
                  <span className="text-muted-foreground">{alert.action}</span>
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
