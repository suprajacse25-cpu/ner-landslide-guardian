'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  buildStateSummary,
  deriveAlerts,
  escalateLocation,
  generateHistory,
  generateLocations,
  generateSensors,
  refreshLocation,
} from './mock-data'
import { computeRiskScore, riskLevelFromScore } from './risk-engine'
import type {
  Alert,
  HistoryPoint,
  Location,
  RiskLevel,
  Sensor,
  StateSummary,
} from './types'

export interface GuardianData {
  locations: Location[]
  selectedId: string
  selected: Location
  history: HistoryPoint[]
  alerts: Alert[]
  sensors: Sensor[]
  stateSummary: StateSummary[]
  emergency: boolean
  overall: {
    score: number
    level: RiskLevel
    onlineSensors: number
    totalSensors: number
    highRiskCount: number
    lastUpdated: string
    scanning: boolean
  }
  selectLocation: (id: string) => void
  checkRisk: () => void
  simulateEvent: () => void
}

function nowLabel(): string {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function useGuardianData(): GuardianData {
  const [locations, setLocations] = useState<Location[]>(() => generateLocations())
  const [sensors, setSensors] = useState<Sensor[]>(() => generateSensors())
  const [selectedId, setSelectedId] = useState<string>(() => {
    const seeded = generateLocations()
    return seeded[0]?.id ?? 'itanagar'
  })
  const [historyBySelection, setHistory] = useState<Record<string, HistoryPoint[]>>({})
  const [lastUpdated, setLastUpdated] = useState<string>(() => nowLabel())
  const [scanning, setScanning] = useState(false)
  const [emergency, setEmergency] = useState(false)

  const selected = useMemo(
    () => locations.find((l) => l.id === selectedId) ?? locations[0],
    [locations, selectedId],
  )

  const history = useMemo(() => {
    if (historyBySelection[selectedId]) return historyBySelection[selectedId]
    return generateHistory(selected)
  }, [historyBySelection, selectedId, selected])

  const overall = useMemo(() => {
    const online = sensors.filter((s) => s.status === 'ONLINE')
    // Overall score is the max of the top-3 hottest locations (worst-case bias).
    const sorted = [...locations].sort((a, b) => b.riskScore - a.riskScore)
    const top = sorted.slice(0, 3)
    const avgTop = top.reduce((sum, l) => sum + l.riskScore, 0) / (top.length || 1)
    const score = Math.round(avgTop)
    return {
      score,
      level: riskLevelFromScore(score),
      onlineSensors: online.length,
      totalSensors: sensors.length,
      highRiskCount: locations.filter(
        (l) => l.riskLevel === 'HIGH' || l.riskLevel === 'CRITICAL',
      ).length,
      lastUpdated,
      scanning,
    }
  }, [locations, sensors, lastUpdated, scanning])

  const alerts = useMemo(() => deriveAlerts(locations), [locations])

  const stateSummary = useMemo(() => buildStateSummary(locations), [locations])

  const selectLocation = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const checkRisk = useCallback(() => {
    setScanning(true)
    // A normal re-scan returns the region to baseline monitoring.
    setEmergency(false)
    // Simulate a short scan so the button feels like a real reading cycle.
    setTimeout(() => {
      setLocations((prev) => prev.map((l) => refreshLocation(l)))
      setHistory((prev) => {
        // Recompute history for the currently selected location on demand.
        const next = { ...prev }
        delete next[selectedId]
        return next
      })
      // Occasionally flip a random online sensor for realism.
      setSensors((prev) =>
        prev.map((s) => {
          if (Math.random() < 0.05) {
            return {
              ...s,
              status: s.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE',
            }
          }
          return s
        }),
      )
      setLastUpdated(nowLabel())
      setScanning(false)
    }, 850)
  }, [selectedId])

  const simulateEvent = useCallback(() => {
    setScanning(true)
    setTimeout(() => {
      // Push exposed mountainous sites (higher baseline intensity) into a
      // hazardous state to demonstrate the emergency response flow.
      setLocations((prev) =>
        prev.map((l) => (l.riskScore >= 45 ? escalateLocation(l) : refreshLocation(l))),
      )
      setHistory((prev) => {
        const next = { ...prev }
        delete next[selectedId]
        return next
      })
      setEmergency(true)
      setLastUpdated(nowLabel())
      setScanning(false)
    }, 850)
  }, [selectedId])

  return {
    locations,
    selectedId,
    selected,
    history,
    alerts,
    sensors,
    stateSummary,
    emergency,
    overall,
    selectLocation,
    checkRisk,
    simulateEvent,
  }
}

// Re-export for callers that recompute ad hoc.
export { computeRiskScore, riskLevelFromScore }
