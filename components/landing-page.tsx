'use client'

import {
  Activity,
  ArrowRight,
  BellRing,
  CloudRain,
  Gauge,
  Layers,
  MapPin,
  Radio,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { DemoBadge } from './demo-badge'

const FEATURES = [
  {
    icon: Gauge,
    title: 'Composite Risk Scoring',
    body: 'A transparent weighted model fuses rainfall, soil moisture, slope and ground movement into a single 0–100 risk score and LOW→CRITICAL level.',
  },
  {
    icon: MapPin,
    title: 'Geospatial Risk Map',
    body: 'An interactive map of the eight NER states with colour-coded markers surfaces the most threatened locations at a glance.',
  },
  {
    icon: TrendingUp,
    title: 'Historical Trends',
    body: 'Hourly time-series for rainfall, saturation, displacement and risk reveal building events before they become disasters.',
  },
  {
    icon: BellRing,
    title: 'Early Warning Alerts',
    body: 'Automatic alerts carry severity, location, the triggering reason and a recommended action for responders.',
  },
  {
    icon: Radio,
    title: 'Sensor Health',
    body: 'Live online/offline status and battery levels across rain gauges, soil probes, inclinometers and GNSS stations.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero-Cost & Offline-Ready',
    body: 'Runs entirely on mock data with no paid APIs, SMS, auth or external databases — ideal for a hackathon prototype.',
  },
]

const FACTORS = [
  { icon: CloudRain, label: 'Rainfall', hint: 'Antecedent + intensity' },
  { icon: Layers, label: 'Soil Moisture', hint: 'Saturation %' },
  { icon: Activity, label: 'Ground Movement', hint: 'Displacement mm' },
  { icon: Gauge, label: 'Slope', hint: 'Terrain gradient' },
]

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="topo-grid">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/ner-terrain.png"
            alt=""
            className="size-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <DemoBadge />
              <span className="rounded-full border border-border bg-panel px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                Smart India Hackathon Prototype
              </span>
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              AI early warning for landslides across{' '}
              <span className="text-primary">Northeast India</span>
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              NER Landslide Guardian continuously scores terrain risk from rainfall, soil
              saturation, slope and ground movement — turning noisy sensor data into clear,
              actionable warnings for disaster-management teams.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onLaunch}
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Open Live Dashboard
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Factor strip */}
      <section className="border-y border-border bg-panel/50">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 lg:grid-cols-4">
          {FACTORS.map((f) => (
            <div key={f.label} className="flex items-center gap-3 py-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.hint}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            A complete monitoring loop, from sensor to siren
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Every module is modular and easy to extend — swap the mock feed for real IMD rainfall,
            InSAR displacement or IoT soil probes without touching the risk logic.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How the score works */}
      <section className="border-t border-border bg-panel/40">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Transparent, tunable risk model
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              No black-box ML required. Each factor is normalised against a danger threshold, then
              combined with physically-motivated weights. The result is explainable to any district
              disaster official.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ['Rainfall', '32%'],
                ['Ground Movement', '28%'],
                ['Soil Moisture', '24%'],
                ['Slope', '16%'],
              ].map(([label, weight]) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="w-32 text-muted-foreground">{label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: weight }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-foreground">{weight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'LOW', range: '0 – 34', token: 'var(--risk-low)' },
                { label: 'MODERATE', range: '35 – 59', token: 'var(--risk-moderate)' },
                { label: 'HIGH', range: '60 – 79', token: 'var(--risk-high)' },
                { label: 'CRITICAL', range: '80 – 100', token: 'var(--risk-critical)' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="rounded-lg border border-border p-4"
                  style={{ backgroundColor: `color-mix(in oklch, ${r.token} 12%, transparent)` }}
                >
                  <div
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: r.token }}
                  >
                    {r.label}
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold">{r.range}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onLaunch}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
            >
              Try the Check Risk demo
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
          <p>NER Landslide Guardian — SIH prototype. All data shown is simulated mock data.</p>
          <DemoBadge />
        </div>
      </footer>
    </div>
  )
}
