'use client'

import {
  Activity,
  CloudRain,
  Layers,
  Mountain,
  RadioTower,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react'
import { RISK_META } from '@/lib/risk-engine'
import type { GuardianData } from '@/lib/use-guardian-data'
import { cn } from '@/lib/utils'
import { MetricCard } from './metric-card'
import { RiskGauge } from './risk-gauge'

export function RiskOverview({ data }: { data: GuardianData }) {
  const { selected, overall, checkRisk } = data
  const r = selected.readings
  const meta = RISK_META[overall.level]

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {/* Overall risk + check button */}
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Overall Regional Risk</h2>
            <p className="text-[11px] text-muted-foreground">
              Worst-case of top 3 sites · updated {overall.lastUpdated}
            </p>
          </div>
          <TriangleAlert className="size-4 text-muted-foreground" />
        </div>

        <div className="mt-3 flex flex-col items-center">
          <RiskGauge score={overall.score} level={overall.level} />
          <p className="mt-2 max-w-[15rem] text-center text-xs text-muted-foreground">
            {meta.description}
          </p>
        </div>

        <button
          type="button"
          onClick={checkRisk}
          disabled={overall.scanning}
          className={cn(
            'mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform',
            overall.scanning ? 'opacity-80' : 'hover:scale-[1.01]',
          )}
        >
          <RefreshCw className={cn('size-4', overall.scanning && 'animate-spin')} />
          {overall.scanning ? 'Scanning sensors…' : 'Check Risk'}
        </button>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg border border-border bg-panel p-2.5">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <RadioTower className="size-3.5" />
              <span className="text-[11px]">Sensors online</span>
            </div>
            <div className="mt-1 font-mono text-sm font-semibold">
              {overall.onlineSensors}
              <span className="text-muted-foreground">/{overall.totalSensors}</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-panel p-2.5">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <TriangleAlert className="size-3.5" />
              <span className="text-[11px]">High-risk sites</span>
            </div>
            <div className="mt-1 font-mono text-sm font-semibold">{overall.highRiskCount}</div>
          </div>
        </div>
      </div>

      {/* Selected-location metrics */}
      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">{selected.name} — Live Readings</h2>
            <p className="text-[11px] text-muted-foreground">
              {selected.state} · {selected.elevation} m elevation · sensor {selected.sensorStatus.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            icon={CloudRain}
            label="Rainfall"
            value={r.rainfall.toFixed(0)}
            unit="mm/24h"
            fill={(r.rainfall / 220) * 100}
            tone="var(--chart-2)"
          />
          <MetricCard
            icon={Layers}
            label="Soil Moisture"
            value={r.soilMoisture.toFixed(0)}
            unit="%"
            fill={r.soilMoisture}
            tone="var(--chart-3)"
          />
          <MetricCard
            icon={Mountain}
            label="Slope"
            value={r.slope.toFixed(0)}
            unit="°"
            fill={(r.slope / 55) * 100}
            tone="var(--chart-4)"
          />
          <MetricCard
            icon={Activity}
            label="Ground Movement"
            value={r.groundMovement.toFixed(1)}
            unit="mm"
            fill={(r.groundMovement / 30) * 100}
            tone="var(--chart-5)"
          />
          <MetricCard
            icon={TriangleAlert}
            label="Site Risk Score"
            value={selected.riskScore.toFixed(0)}
            unit="/100"
            fill={selected.riskScore}
            tone={RISK_META[selected.riskLevel].token}
            hint={`Level: ${selected.riskLevel}`}
          />
        </div>

        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          <FactorBars data={data} />
        </div>
      </div>
    </section>
  )
}

function FactorBars({ data }: { data: GuardianData }) {
  const { selected } = data
  const r = selected.readings
  const factors = [
    { label: 'Rainfall', pct: Math.min(100, (r.rainfall / 220) * 100), weight: '32%' },
    { label: 'Ground Movement', pct: Math.min(100, (r.groundMovement / 30) * 100), weight: '28%' },
    { label: 'Soil Moisture', pct: Math.min(100, r.soilMoisture), weight: '24%' },
    { label: 'Slope', pct: Math.min(100, (r.slope / 55) * 100), weight: '16%' },
  ]
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground">Risk factor contribution</h3>
        <span className="font-mono text-[11px] text-muted-foreground">weighted model</span>
      </div>
      <div className="space-y-2.5">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs text-muted-foreground">{f.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${f.pct}%` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
              {f.weight}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
