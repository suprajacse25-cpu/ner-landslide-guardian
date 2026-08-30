import { computeRiskScore, riskLevelFromScore } from './risk-engine'
import type {
  Alert,
  HistoryPoint,
  Location,
  Sensor,
  SensorReadings,
} from './types'

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function round(value: number, dp = 1): number {
  const f = 10 ** dp
  return Math.round(value * f) / f
}

/**
 * Generate a fresh set of realistic sensor readings for a location.
 * `intensity` (0-1) biases the location toward calmer or more dangerous values,
 * so mountainous, high-elevation sites read hotter than valley towns.
 */
export function generateReadings(intensity: number): SensorReadings {
  return {
    rainfall: round(rand(10, 60) + intensity * rand(60, 190)),
    soilMoisture: round(Math.min(98, rand(28, 55) + intensity * rand(15, 45))),
    slope: round(rand(12, 30) + intensity * rand(10, 28)),
    groundMovement: round(rand(0.5, 4) + intensity * rand(3, 26)),
  }
}

interface Seed {
  id: string
  name: string
  state: string
  x: number
  y: number
  elevation: number
  intensity: number
  offline?: boolean
}

/** Approximate relative positions across the eight NER states (0-100 viewbox). */
const SEEDS: Seed[] = [
  { id: 'itanagar', name: 'Itanagar', state: 'Arunachal Pradesh', x: 74, y: 20, elevation: 750, intensity: 0.82 },
  { id: 'tawang', name: 'Tawang', state: 'Arunachal Pradesh', x: 55, y: 12, elevation: 3048, intensity: 0.9 },
  { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', x: 20, y: 22, elevation: 1650, intensity: 0.88 },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', x: 40, y: 58, elevation: 1496, intensity: 0.7 },
  { id: 'cherrapunji', name: 'Cherrapunji', state: 'Meghalaya', x: 44, y: 66, elevation: 1430, intensity: 0.95 },
  { id: 'aizawl', name: 'Aizawl', state: 'Mizoram', x: 55, y: 82, elevation: 1132, intensity: 0.78 },
  { id: 'kohima', name: 'Kohima', state: 'Nagaland', x: 78, y: 52, elevation: 1444, intensity: 0.72 },
  { id: 'imphal', name: 'Imphal', state: 'Manipur', x: 74, y: 66, elevation: 786, intensity: 0.55 },
  { id: 'agartala', name: 'Agartala', state: 'Tripura', x: 48, y: 84, elevation: 13, intensity: 0.3, offline: true },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', x: 46, y: 44, elevation: 55, intensity: 0.35 },
  { id: 'dibrugarh', name: 'Dibrugarh', state: 'Assam', x: 82, y: 34, elevation: 108, intensity: 0.4 },
]

export function buildLocation(seed: Seed): Location {
  const readings = generateReadings(seed.intensity)
  const riskScore = computeRiskScore(readings)
  return {
    id: seed.id,
    name: seed.name,
    state: seed.state,
    x: seed.x,
    y: seed.y,
    elevation: seed.elevation,
    sensorStatus: seed.offline ? 'OFFLINE' : 'ONLINE',
    readings,
    riskScore,
    riskLevel: riskLevelFromScore(riskScore),
  }
}

export function generateLocations(): Location[] {
  return SEEDS.map(buildLocation)
}

/** Re-roll readings for a location, keeping its identity and position. */
export function refreshLocation(location: Location): Location {
  const seed = SEEDS.find((s) => s.id === location.id)
  const intensity = seed?.intensity ?? 0.5
  if (location.sensorStatus === 'OFFLINE') {
    return location
  }
  const readings = generateReadings(intensity)
  const riskScore = computeRiskScore(readings)
  return {
    ...location,
    readings,
    riskScore,
    riskLevel: riskLevelFromScore(riskScore),
  }
}

/** Build a 24-point history series (hourly) ending at "now" for a location. */
export function generateHistory(location: Location): HistoryPoint[] {
  const points: HistoryPoint[] = []
  const seed = SEEDS.find((s) => s.id === location.id)
  const baseIntensity = seed?.intensity ?? 0.5
  let movement = Math.max(1, location.readings.groundMovement * 0.4)

  for (let i = 23; i >= 0; i--) {
    // Intensity ramps up toward the present to mimic a building event.
    const ramp = baseIntensity * (0.55 + (23 - i) / 40)
    const rainfall = round(rand(5, 30) + ramp * rand(40, 150))
    const soilMoisture = round(Math.min(98, rand(30, 45) + ramp * rand(15, 45)))
    movement = round(Math.min(35, movement + rand(-0.6, 1.6) + ramp * 0.6))
    const riskScore = computeRiskScore({
      rainfall,
      soilMoisture,
      slope: location.readings.slope,
      groundMovement: movement,
    })
    const hour = ((new Date().getHours() - i + 24) % 24).toString().padStart(2, '0')
    points.push({
      time: `${hour}:00`,
      rainfall,
      soilMoisture,
      groundMovement: movement,
      riskScore,
    })
  }
  return points
}

export function generateSensors(): Sensor[] {
  const types: Sensor['type'][] = ['Rain Gauge', 'Soil Probe', 'Inclinometer', 'GNSS Station']
  const sensors: Sensor[] = []
  SEEDS.forEach((seed, si) => {
    types.forEach((type, ti) => {
      // A couple of sensors are deliberately offline for the demo.
      const forcedOffline = seed.offline && ti % 2 === 0
      const randomOffline = !seed.offline && Math.random() < 0.08
      const status: Sensor['status'] = forcedOffline || randomOffline ? 'OFFLINE' : 'ONLINE'
      sensors.push({
        id: `${seed.id}-${ti}`,
        code: `${seed.name.slice(0, 3).toUpperCase()}-${type.split(' ')[0].slice(0, 2).toUpperCase()}${si}${ti}`,
        locationName: seed.name,
        type,
        status,
        battery: status === 'OFFLINE' ? Math.round(rand(0, 14)) : Math.round(rand(46, 100)),
        lastPing:
          status === 'OFFLINE'
            ? `${Math.round(rand(3, 41))}h ago`
            : `${Math.round(rand(1, 9))}m ago`,
      })
    })
  })
  return sensors
}

const ACTIONS: Record<string, string> = {
  CRITICAL:
    'Trigger evacuation of downslope settlements. Close NH stretch and alert SDRF/NDRF teams immediately.',
  HIGH: 'Issue public early warning. Pre-position response teams and restrict slope-adjacent movement.',
  MODERATE: 'Raise monitoring frequency to 15-min intervals and notify district disaster cell.',
}

export function deriveAlerts(locations: Location[]): Alert[] {
  const now = new Date()
  return locations
    .filter((l) => l.riskLevel === 'HIGH' || l.riskLevel === 'CRITICAL' || l.riskLevel === 'MODERATE')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6)
    .map((l, i) => {
      const reasons: string[] = []
      if (l.readings.rainfall > 120) reasons.push(`${l.readings.rainfall}mm/24h rainfall`)
      if (l.readings.soilMoisture > 70) reasons.push(`${l.readings.soilMoisture}% soil saturation`)
      if (l.readings.groundMovement > 12) reasons.push(`${l.readings.groundMovement}mm ground displacement`)
      if (l.readings.slope > 40) reasons.push(`steep ${l.readings.slope}° slope`)
      if (reasons.length === 0) reasons.push('combined elevated risk factors')

      const issued = new Date(now.getTime() - i * 1000 * 60 * Math.round(rand(4, 40)))
      return {
        id: `alert-${l.id}`,
        locationId: l.id,
        locationName: `${l.name}, ${l.state}`,
        level: l.riskLevel,
        reason: reasons.join(' · '),
        action: ACTIONS[l.riskLevel] ?? ACTIONS.MODERATE,
        issuedAt: issued.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }
    })
}
