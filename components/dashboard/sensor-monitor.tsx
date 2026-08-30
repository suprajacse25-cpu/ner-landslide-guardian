'use client'

import { useMemo, useState } from 'react'
import { BatteryLow, BatteryMedium, Radio, Wifi, WifiOff } from 'lucide-react'
import type { GuardianData } from '@/lib/use-guardian-data'
import type { Sensor } from '@/lib/types'

type Filter = 'ALL' | 'ONLINE' | 'OFFLINE'

export function SensorMonitor({ data }: { data: GuardianData }) {
  const { sensors } = data
  const [filter, setFilter] = useState<Filter>('ALL')

  const online = sensors.filter((s) => s.status === 'ONLINE').length
  const offline = sensors.length - online
  const uptime = Math.round((online / sensors.length) * 100)

  const filtered = useMemo(() => {
    if (filter === 'ALL') return sensors
    return sensors.filter((s) => s.status === filter)
  }, [sensors, filter])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Sensor Network Monitoring</h2>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-panel p-1">
          {(['ALL', 'ONLINE', 'OFFLINE'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label="Online" value={`${online}`} tone="var(--risk-low)" />
        <Stat label="Offline" value={`${offline}`} tone="var(--destructive)" />
        <Stat label="Network uptime" value={`${uptime}%`} tone="var(--primary)" />
      </div>

      <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
        {filtered.map((sensor) => (
          <SensorRow key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3 text-center">
      <div className="font-mono text-xl font-semibold" style={{ color: tone }}>
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}

function SensorRow({ sensor }: { sensor: Sensor }) {
  const isOnline = sensor.status === 'ONLINE'
  const lowBattery = sensor.battery < 25
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-8 items-center justify-center rounded-lg ${
            isOnline ? 'bg-risk-low/12 text-risk-low' : 'bg-destructive/12 text-destructive'
          }`}
        >
          {isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold">{sensor.code}</span>
            <span className="text-[11px] text-muted-foreground">{sensor.type}</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {sensor.locationName} · {sensor.lastPing}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {lowBattery ? (
          <BatteryLow className="size-4 text-destructive" />
        ) : (
          <BatteryMedium className="size-4 text-muted-foreground" />
        )}
        <span
          className={`font-mono text-xs tabular-nums ${
            lowBattery ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          {sensor.battery}%
        </span>
      </div>
    </div>
  )
}
