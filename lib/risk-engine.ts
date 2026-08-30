import type { RiskLevel, RiskTrend, SensorReadings } from './types'

/**
 * Demo weighted risk model.
 *
 * Each factor is normalised to a 0-100 sub-score against a plausible danger
 * threshold for the Northeast Indian terrain, then combined with weights that
 * reflect landslide triggering physics: antecedent rainfall + saturated soil on
 * steep slopes with measurable ground movement.
 *
 * This is intentionally transparent and tunable for a hackathon prototype — no
 * external API or ML model is required.
 */
const WEIGHTS = {
  rainfall: 0.32,
  soilMoisture: 0.24,
  slope: 0.16,
  groundMovement: 0.28,
} as const

/** Danger thresholds — the reading value that maps to a 100 sub-score. */
const THRESHOLDS = {
  rainfall: 220, // mm / 24h
  soilMoisture: 100, // % (already a percentage)
  slope: 55, // degrees
  groundMovement: 30, // mm displacement
} as const

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

export function computeRiskScore(readings: SensorReadings): number {
  const rainfallScore = clamp((readings.rainfall / THRESHOLDS.rainfall) * 100)
  const soilScore = clamp((readings.soilMoisture / THRESHOLDS.soilMoisture) * 100)
  const slopeScore = clamp((readings.slope / THRESHOLDS.slope) * 100)
  const movementScore = clamp((readings.groundMovement / THRESHOLDS.groundMovement) * 100)

  const score =
    rainfallScore * WEIGHTS.rainfall +
    soilScore * WEIGHTS.soilMoisture +
    slopeScore * WEIGHTS.slope +
    movementScore * WEIGHTS.groundMovement

  return Math.round(clamp(score))
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 35) return 'MODERATE'
  return 'LOW'
}

/** Classify the direction of change between two risk scores. */
export function trendFromScores(prev: number, curr: number): RiskTrend {
  const delta = curr - prev
  if (delta > 4) return 'INCREASING'
  if (delta < -4) return 'DECREASING'
  return 'STABLE'
}

export const TREND_META: Record<
  RiskTrend,
  { label: string; token: string; direction: 'up' | 'down' | 'flat' }
> = {
  INCREASING: { label: 'Increasing', token: 'var(--risk-high)', direction: 'up' },
  STABLE: { label: 'Stable', token: 'var(--muted-foreground)', direction: 'flat' },
  DECREASING: { label: 'Decreasing', token: 'var(--risk-low)', direction: 'down' },
}

/** Recommended safety actions surfaced to responders for each risk level. */
export const SAFETY_ACTIONS: Record<RiskLevel, string[]> = {
  LOW: [
    'Continue routine automated monitoring.',
    'Keep drainage channels and slope catchments clear.',
    'Maintain community awareness of reporting channels.',
  ],
  MODERATE: [
    'Increase sensor polling to 15-minute intervals.',
    'Notify the district disaster management cell.',
    'Advise residents on steep slopes to stay alert to warnings.',
  ],
  HIGH: [
    'Issue a public early warning for the affected area.',
    'Pre-position NDRF/SDRF response teams.',
    'Restrict movement along slope-adjacent roads and trails.',
    'Ready shelters and identify vulnerable households.',
  ],
  CRITICAL: [
    'Order immediate evacuation of downslope settlements.',
    'Close national-highway stretches crossing the hazard zone.',
    'Activate NDRF/SDRF and district emergency operations centre.',
    'Broadcast emergency alerts on all available channels.',
  ],
}

export interface RiskFactorBreakdown {
  key: keyof SensorReadings
  label: string
  score: number
  weight: number
}

export function riskBreakdown(readings: SensorReadings): RiskFactorBreakdown[] {
  return [
    {
      key: 'rainfall',
      label: 'Rainfall',
      score: Math.round(clamp((readings.rainfall / THRESHOLDS.rainfall) * 100)),
      weight: WEIGHTS.rainfall,
    },
    {
      key: 'soilMoisture',
      label: 'Soil Moisture',
      score: Math.round(clamp((readings.soilMoisture / THRESHOLDS.soilMoisture) * 100)),
      weight: WEIGHTS.soilMoisture,
    },
    {
      key: 'slope',
      label: 'Slope',
      score: Math.round(clamp((readings.slope / THRESHOLDS.slope) * 100)),
      weight: WEIGHTS.slope,
    },
    {
      key: 'groundMovement',
      label: 'Ground Movement',
      score: Math.round(clamp((readings.groundMovement / THRESHOLDS.groundMovement) * 100)),
      weight: WEIGHTS.groundMovement,
    },
  ]
}

export const RISK_META: Record<
  RiskLevel,
  { label: string; token: string; textToken: string; description: string }
> = {
  LOW: {
    label: 'Low',
    token: 'var(--risk-low)',
    textToken: 'var(--risk-low)',
    description: 'Conditions stable. Routine monitoring.',
  },
  MODERATE: {
    label: 'Moderate',
    token: 'var(--risk-moderate)',
    textToken: 'var(--risk-moderate)',
    description: 'Elevated factors. Increase observation frequency.',
  },
  HIGH: {
    label: 'High',
    token: 'var(--risk-high)',
    textToken: 'var(--risk-high)',
    description: 'Dangerous combination. Prepare for possible action.',
  },
  CRITICAL: {
    label: 'Critical',
    token: 'var(--risk-critical)',
    textToken: 'var(--risk-critical)',
    description: 'Failure likely. Issue warnings and consider evacuation.',
  },
}
