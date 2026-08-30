'use client'

import { Activity, CloudRain, Layers, MapPin, Mountain, Wifi, WifiOff } from 'lucide-react'
import { RISK_META } from '@/lib/risk-engine'
import type { GuardianData } from '@/lib/use-guardian-data'
import { RiskBadge } from '@/components/risk-badge'

export function LocationDetails({ data }: { data: GuardianData }) {
  const { selected, locations, selectLocation } = data
  const meta = RISK_META[selected.riskLevel]
  const r = selected.readings

  const rows = [
    { icon: CloudRain, label: 'Rainfall', value: `${r.rainfall} mm/24h` },
    { icon: Layers, label: 'Soil Moisture', value: `${r.soilMoisture} %` },
    { icon: Mountain, label: 'Slope', value: `${r.slope}°` },
    { icon: Activity, label: 'Ground Movement', value: `${r.groundMovement} mm` },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Location Details</h2>
        <RiskBadge level={selected.riskLevel} />
      </div>

      <div
        className="rounded-lg border border-border p-4"
        style={{ backgroundColor: `color-mix(in oklch, ${meta.token} 8%, transparent)` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              <h3 className="text-base font-semibold">{selected.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{selected.state}</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl font-semibold" style={{ color: meta.token }}>
              {selected.riskScore}
            </div>
            <div className="text-[11px] text-muted-foreground">risk score</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{selected.elevation} m elevation</span>
          <span className="flex items-center gap-1">
            {selected.sensorStatus === 'ONLINE' ? (
              <>
                <Wifi className="size-3.5 text-risk-low" />
                Sensor online
              </>
            ) : (
              <>
                <WifiOff className="size-3.5 text-destructive" />
                Sensor offline
              </>
            )}
          </span>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <row.icon className="size-4" />
              {row.label}
            </dt>
            <dd className="font-mono text-sm font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold text-muted-foreground">All monitored sites</h4>
        <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
          {[...locations]
            .sort((a, b) => b.riskScore - a.riskScore)
            .map((loc) => {
              const active = loc.id === selected.id
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => selectLocation(loc.id)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                    active
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-transparent hover:bg-accent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: RISK_META[loc.riskLevel].token }}
                    />
                    <span className="font-medium">{loc.name}</span>
                    <span className="text-muted-foreground">{loc.state}</span>
                  </span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {loc.riskScore}
                  </span>
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
