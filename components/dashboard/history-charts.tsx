'use client'

import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GuardianData } from '@/lib/use-guardian-data'
import type { HistoryPoint } from '@/lib/types'

type SeriesKey = 'rainfall' | 'soilMoisture' | 'groundMovement' | 'riskScore'

const SERIES: Record<
  SeriesKey,
  { label: string; unit: string; color: string; kind: 'area' | 'line' }
> = {
  riskScore: { label: 'Risk Score', unit: '/100', color: 'var(--chart-1)', kind: 'area' },
  rainfall: { label: 'Rainfall', unit: 'mm', color: 'var(--chart-2)', kind: 'area' },
  soilMoisture: { label: 'Soil Moisture', unit: '%', color: 'var(--chart-3)', kind: 'area' },
  groundMovement: { label: 'Ground Movement', unit: 'mm', color: 'var(--chart-5)', kind: 'line' },
}

const ORDER: SeriesKey[] = ['riskScore', 'rainfall', 'soilMoisture', 'groundMovement']

function ChartTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-mono text-muted-foreground">{label}</div>
      <div className="font-semibold text-popover-foreground">
        {payload[0].value}
        <span className="ml-0.5 font-normal text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

export function HistoryCharts({ data }: { data: GuardianData }) {
  const [active, setActive] = useState<SeriesKey>('riskScore')
  const history: HistoryPoint[] = data.history
  const cfg = SERIES[active]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Historical Trends — {data.selected.name}</h2>
          <p className="text-[11px] text-muted-foreground">Last 24 hours · hourly samples</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-panel p-1">
          {ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {SERIES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {cfg.kind === 'area' ? (
            <AreaChart data={history} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id={`fill-${active}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cfg.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={cfg.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip unit={cfg.unit} />} cursor={{ stroke: 'var(--border)' }} />
              <Area
                type="monotone"
                dataKey={active}
                stroke={cfg.color}
                strokeWidth={2}
                fill={`url(#fill-${active})`}
                dot={false}
                activeDot={{ r: 4, fill: cfg.color }}
              />
            </AreaChart>
          ) : (
            <LineChart data={history} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip unit={cfg.unit} />} cursor={{ stroke: 'var(--border)' }} />
              <Line
                type="monotone"
                dataKey={active}
                stroke={cfg.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: cfg.color }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
