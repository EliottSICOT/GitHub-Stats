'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ProfileCard from '@/components/ProfileCard'
import StatsRow from '@/components/StatsRow'
import LanguageChart from '@/components/LanguageChart'
import ActivityChart from '@/components/ActivityChart'
import RepoList from '@/components/RepoList'
import SkeletonCard from '@/components/SkeletonCard'
import EmptyState from '@/components/EmptyState'
import Footer from '@/components/Footer'
import { fetchDashboard } from '@/lib/github'
import type { DashboardData } from '@/types/github'

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(username: string) {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await fetchDashboard(username)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text px-4 py-12 max-w-5xl mx-auto flex flex-col">
      <header className="mb-10 text-center">
        <p className="text-accent font-mono text-sm mb-3 tracking-widest uppercase">
          // github analytics
        </p>
        <h1 className="text-5xl sm:text-6xl font-mono font-bold tracking-tight">
          GitHub<span className="text-accent">_</span>Stats
          <span className="text-accent cursor-blink ml-1">▊</span>
        </h1>
        <p className="text-text-muted mt-4 font-mono text-sm max-w-md mx-auto">
          Visualise n&apos;importe quel profil GitHub en quelques secondes —
          repos, langages, activité, top stars.
        </p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="mt-6 p-4 border border-danger bg-danger/10 text-danger font-mono text-sm rounded animate-fade-in">
          <span className="opacity-70">$ error:</span> {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 grid gap-4">
          <SkeletonCard height={120} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
          </div>
          <SkeletonCard height={160} />
          <SkeletonCard height={240} />
          <SkeletonCard height={220} />
        </div>
      )}

      {data && !loading && (
        <div className="mt-8 space-y-6 stagger">
          <ProfileCard user={data.user} />
          <StatsRow
            repos={data.user.public_repos}
            stars={data.totalStars}
            forks={data.totalForks}
            followers={data.user.followers}
          />
          <LanguageChart languages={data.languages} />
          <ActivityChart data={data.monthlyActivity} />
          <RepoList repos={data.topRepos} />
          <p className="pt-2 text-center text-xs font-mono text-text-muted">
            <span className="text-accent">$</span> fetched data for{' '}
            <span className="text-text">@{data.user.login}</span> · cached 5 min
          </p>
        </div>
      )}

      {!data && !loading && !error && <EmptyState onPick={handleSearch} />}

      <div className="flex-1" />
      <Footer />
    </main>
  )
}
