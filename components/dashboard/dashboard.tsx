'use client'

import { useGuardianData } from '@/lib/use-guardian-data'
import { DemoBadge } from '@/components/demo-badge'
import { AlertsPanel } from './alerts-panel'
import { HistoryCharts } from './history-charts'
import { LocationDetails } from './location-details'
import { RiskMap } from './risk-map'
import { RiskOverview } from './risk-overview'
import { SensorMonitor } from './sensor-monitor'

export function Dashboard() {
  const data = useGuardianData()

  return (
    <div className="topo-grid min-h-screen">
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Risk Monitoring Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time landslide risk across the North Eastern Region
            </p>
          </div>
          <DemoBadge />
        </div>

        <RiskOverview data={data} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RiskMap data={data} />
          </div>
          <div className="lg:col-span-1">
            <LocationDetails data={data} />
          </div>
        </div>

        <HistoryCharts data={data} />

        <div className="grid gap-4 lg:grid-cols-2">
          <AlertsPanel data={data} />
          <SensorMonitor data={data} />
        </div>
      </div>
    </div>
  )
}
