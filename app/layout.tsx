import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitHub Stats — Dashboard',
  description: "Visualise les statistiques de n'importe quel profil GitHub en quelques secondes.",
  metadataBase: new URL('https://github-stats.local'),
  openGraph: {
    title: 'GitHub Stats — Dashboard',
    description: "Visualise les statistiques de n'importe quel profil GitHub.",
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
