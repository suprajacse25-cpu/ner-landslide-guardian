'use client'

import { Mountain } from 'lucide-react'
import { DemoBadge } from './demo-badge'

interface SiteHeaderProps {
  view: 'landing' | 'dashboard'
  onNavigate: (view: 'landing' | 'dashboard') => void
}

export function SiteHeader({ view, onNavigate }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <Mountain className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">NER Landslide Guardian</span>
            <span className="text-[11px] text-muted-foreground">AI Early Warning · Northeast India</span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <DemoBadge className="hidden sm:inline-flex" />
          <nav className="flex items-center gap-1 rounded-lg border border-border bg-panel p-1">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className={navClass(view === 'landing')}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={navClass(view === 'dashboard')}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function navClass(active: boolean): string {
  return [
    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
    active
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:text-foreground',
  ].join(' ')
}
