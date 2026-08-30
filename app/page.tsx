'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'
import { LandingPage } from '@/components/landing-page'
import { SiteHeader } from '@/components/site-header'

type View = 'landing' | 'dashboard'

export default function Page() {
  const [view, setView] = useState<View>('landing')

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader view={view} onNavigate={setView} />
      {view === 'landing' ? (
        <LandingPage onLaunch={() => setView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </main>
  )
}
