import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'NER Landslide Guardian — AI Early Warning for Northeast India',
  description:
    'AI-based early warning and landslide risk monitoring system for the North Eastern Region of India. Real-time risk scoring, geospatial monitoring, and early alerts.',
  generator: 'v0.app',
  keywords: [
    'landslide',
    'early warning',
    'Northeast India',
    'disaster management',
    'risk monitoring',
    'Smart India Hackathon',
  ],
}

export const viewport: Viewport = {
  themeColor: '#0b1f22',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
