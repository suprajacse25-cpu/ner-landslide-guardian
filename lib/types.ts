export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

export type SensorStatus = 'ONLINE' | 'OFFLINE'

export type RiskTrend = 'INCREASING' | 'STABLE' | 'DECREASING'

export interface SensorReadings {
  /** Cumulative rainfall over the last 24h in mm */
  rainfall: number
  /** Volumetric soil moisture in percent */
  soilMoisture: number
  /** Terrain slope in degrees */
  slope: number
  /** Ground movement / displacement in mm over the monitoring window */
  groundMovement: number
}

export interface Location {
  id: string
  name: string
  state: string
  /** Percentage coordinates within the map viewbox (0-100) */
  x: number
  y: number
  elevation: number
  sensorStatus: SensorStatus
  readings: SensorReadings
  riskScore: number
  /** Previous score before the latest reading — used to derive the trend */
  prevScore: number
  riskLevel: RiskLevel
  trend: RiskTrend
  /** Human-readable time the readings were last refreshed */
  updatedAt: string
}

export interface StateSummary {
  state: string
  score: number
  level: RiskLevel
  siteCount: number
  highRiskCount: number
  trend: RiskTrend
}

export interface HistoryPoint {
  time: string
  rainfall: number
  soilMoisture: number
  groundMovement: number
  riskScore: number
}

export interface Alert {
  id: string
  locationId: string
  locationName: string
  level: RiskLevel
  reason: string
  action: string
  issuedAt: string
}

export interface Sensor {
  id: string
  code: string
  locationName: string
  type: 'Rain Gauge' | 'Soil Probe' | 'Inclinometer' | 'GNSS Station'
  status: SensorStatus
  battery: number
  lastPing: string
}
