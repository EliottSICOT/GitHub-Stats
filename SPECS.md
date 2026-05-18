# GitHub Stats Dashboard — Spec Claude Code

## Vue d'ensemble

Un dashboard analytics GitHub public : l'utilisateur entre un username, et obtient une visualisation complète de son profil GitHub (repos, langages, activité, streak). Projet portfolio Next.js App Router + Tailwind + Recharts + GitHub API publique (pas d'auth requise).

---

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **Styling** : Tailwind CSS
- **Charts** : Recharts
- **API** : GitHub REST API v3 (publique, sans token — limité à 60 req/h)
- **Fonts** : `next/font` avec `Geist Mono` (display) + `Geist` (body)
- **Déploiement** : Vercel-ready (pas de config spéciale requise)

---

## Design & Aesthetic

**Direction** : Terminal / developer-core. Fond très sombre (`#0d1117`, comme GitHub lui-même), typographie monospace dominante, accents vert néon (`#39d353`, la couleur des contributions GitHub). Effet "code qui s'affiche" sur les stats. Pas de bordures arrondies excessives — angles nets, grille rigoureuse.

**Palette CSS variables** :
```css
--bg: #0d1117
--surface: #161b22
--border: #30363d
--accent: #39d353
--accent-dim: #26a641
--text: #e6edf3
--text-muted: #848d97
--danger: #f85149
```

**Animations** :
- Skeleton loading sur chaque carte pendant le fetch
- Compteurs animés (0 → valeur finale) sur les métriques clés
- Barre de langages qui se remplit de gauche à droite (CSS transition)
- Fade + slide-up sur l'apparition des cards (staggered, `animation-delay`)

---

## Structure des fichiers

```
github-stats-dashboard/
├── app/
│   ├── layout.tsx              # Layout global, fonts, metadata
│   ├── page.tsx                # Page principale (search + résultats)
│   ├── globals.css             # CSS variables + reset + animations
│   └── api/
│       └── github/
│           └── route.ts        # Route API Next.js → proxy GitHub API
├── components/
│   ├── SearchBar.tsx           # Input username + bouton
│   ├── ProfileCard.tsx         # Avatar, nom, bio, followers/following
│   ├── StatsRow.tsx            # 3 métriques clés (repos, stars, gists)
│   ├── LanguageChart.tsx       # Barre horizontale des langages dominants
│   ├── ActivityChart.tsx       # Recharts BarChart — commits 12 derniers mois
│   ├── RepoList.tsx            # Top 6 repos triés par stars
│   ├── RepoCard.tsx            # Card individuelle d'un repo
│   └── SkeletonCard.tsx        # Skeleton loader réutilisable
├── lib/
│   └── github.ts               # Fonctions fetch GitHub (getUser, getRepos, getLanguages)
├── types/
│   └── github.ts               # Types TypeScript (GitHubUser, GitHubRepo, etc.)
└── public/
    └── og-image.png            # (optionnel) image Open Graph
```

---

## Route API — `/app/api/github/route.ts`

Proxy vers GitHub API pour éviter les CORS et centraliser la gestion d'erreurs.

```ts
// GET /api/github?type=user&username=xxx
// GET /api/github?type=repos&username=xxx
// GET /api/github?type=events&username=xxx

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const username = searchParams.get('username')

  if (!username) return Response.json({ error: 'Username requis' }, { status: 400 })

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  // Ajouter le token si dispo (optionnel, pour augmenter la rate limit)
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const endpoints: Record<string, string> = {
    user: `https://api.github.com/users/${username}`,
    repos: `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    events: `https://api.github.com/users/${username}/events/public?per_page=100`,
  }

  const url = endpoints[type ?? '']
  if (!url) return Response.json({ error: 'Type invalide' }, { status: 400 })

  const res = await fetch(url, { headers, next: { revalidate: 300 } })

  if (!res.ok) {
    if (res.status === 404) return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    if (res.status === 403) return Response.json({ error: 'Rate limit GitHub atteinte' }, { status: 429 })
    return Response.json({ error: 'Erreur GitHub API' }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
```

---

## Types TypeScript — `/types/github.ts`

```ts
export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  public_gists: number
  html_url: string
  location: string | null
  company: string | null
  blog: string | null
  created_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  fork: boolean
}

export interface GitHubEvent {
  type: string
  created_at: string
  payload: {
    commits?: { message: string }[]
    size?: number
  }
}

export interface LanguageStat {
  name: string
  count: number
  percentage: number
  color: string
}

export interface MonthlyActivity {
  month: string      // format "Jan", "Feb", etc.
  commits: number
}

export interface DashboardData {
  user: GitHubUser
  repos: GitHubRepo[]
  languages: LanguageStat[]
  monthlyActivity: MonthlyActivity[]
  totalStars: number
  totalForks: number
  topRepos: GitHubRepo[]
}
```

---

## Lib — `/lib/github.ts`

```ts
import type { GitHubUser, GitHubRepo, GitHubEvent, LanguageStat, MonthlyActivity, DashboardData } from '@/types/github'

// Couleurs des langages (subset des couleurs officielles GitHub)
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  PHP: '#4F5D95',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  'C#': '#178600',
  'C++': '#f34b7d',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
}

const BASE = '/api/github'

async function fetchGitHub<T>(type: string, username: string): Promise<T> {
  const res = await fetch(`${BASE}?type=${type}&username=${encodeURIComponent(username)}`)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Erreur inconnue')
  }
  return res.json()
}

function computeLanguages(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {}
  repos.forEach(repo => {
    if (repo.language && !repo.fork) {
      counts[repo.language] = (counts[repo.language] || 0) + 1
    }
  })
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      color: LANGUAGE_COLORS[name] || '#8b949e',
    }))
}

function computeMonthlyActivity(events: GitHubEvent[]): MonthlyActivity[] {
  const months: Record<string, number> = {}
  const now = new Date()

  // Initialiser les 12 derniers mois à 0
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    months[key] = 0
  }

  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const d = new Date(event.created_at)
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      if (key in months) {
        months[key] += event.payload.size || event.payload.commits?.length || 1
      }
    }
  })

  return Object.entries(months).map(([month, commits]) => ({ month, commits }))
}

export async function fetchDashboard(username: string): Promise<DashboardData> {
  const [user, repos, events] = await Promise.all([
    fetchGitHub<GitHubUser>('user', username),
    fetchGitHub<GitHubRepo[]>('repos', username),
    fetchGitHub<GitHubEvent[]>('events', username),
  ])

  const languages = computeLanguages(repos)
  const monthlyActivity = computeMonthlyActivity(events)
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)
  const topRepos = [...repos]
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)

  return { user, repos, languages, monthlyActivity, totalStars, totalForks, topRepos }
}
```

---

## Page principale — `/app/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ProfileCard from '@/components/ProfileCard'
import StatsRow from '@/components/StatsRow'
import LanguageChart from '@/components/LanguageChart'
import ActivityChart from '@/components/ActivityChart'
import RepoList from '@/components/RepoList'
import SkeletonCard from '@/components/SkeletonCard'
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
    <main className="min-h-screen bg-[--bg] text-[--text] px-4 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <p className="text-[--accent] font-mono text-sm mb-2 tracking-widest uppercase">// github analytics</p>
        <h1 className="text-4xl font-mono font-bold tracking-tight">
          GitHub<span className="text-[--accent]">_</span>Stats
        </h1>
        <p className="text-[--text-muted] mt-2 font-mono text-sm">
          Visualise n'importe quel profil GitHub en quelques secondes.
        </p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="mt-6 p-4 border border-[--danger] bg-[--danger]/10 text-[--danger] font-mono text-sm rounded">
          ✗ {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 grid gap-4">
          <SkeletonCard height={120} />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
          </div>
          <SkeletonCard height={200} />
          <SkeletonCard height={200} />
        </div>
      )}

      {data && !loading && (
        <div className="mt-8 space-y-6 animate-fade-in">
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
        </div>
      )}
    </main>
  )
}
```

---

## Composants

### `SearchBar.tsx`
```tsx
'use client'
import { useState, KeyboardEvent } from 'react'

interface Props {
  onSearch: (username: string) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit() {
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex gap-2 max-w-lg mx-auto">
      <div className="flex-1 flex items-center border border-[--border] bg-[--surface] rounded px-3 gap-2 focus-within:border-[--accent] transition-colors">
        <span className="text-[--accent] font-mono text-sm select-none">$</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="username"
          className="flex-1 bg-transparent text-[--text] font-mono text-sm py-3 outline-none placeholder:text-[--text-muted]"
          autoFocus
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !value.trim()}
        className="px-5 py-3 bg-[--accent] text-black font-mono text-sm font-bold rounded hover:bg-[--accent-dim] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '...' : 'RUN'}
      </button>
    </div>
  )
}
```

### `ProfileCard.tsx`
```tsx
import Image from 'next/image'
import type { GitHubUser } from '@/types/github'

export default function ProfileCard({ user }: { user: GitHubUser }) {
  const joinYear = new Date(user.created_at).getFullYear()
  return (
    <div className="border border-[--border] bg-[--surface] rounded p-6 flex gap-5 items-start">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={72}
        height={72}
        className="rounded border border-[--border]"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h2 className="font-mono font-bold text-xl text-[--text]">{user.name || user.login}</h2>
          <span className="text-[--text-muted] font-mono text-sm">@{user.login}</span>
        </div>
        {user.bio && <p className="text-[--text-muted] text-sm mt-1 font-mono">{user.bio}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-mono text-[--text-muted]">
          {user.location && <span>📍 {user.location}</span>}
          {user.company && <span>🏢 {user.company}</span>}
          {user.blog && <a href={user.blog} target="_blank" rel="noopener" className="text-[--accent] hover:underline">🔗 {user.blog}</a>}
          <span>📅 depuis {joinYear}</span>
        </div>
      </div>
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener"
        className="text-[--accent] font-mono text-xs border border-[--accent] px-3 py-1.5 rounded hover:bg-[--accent] hover:text-black transition-colors"
      >
        VOIR PROFIL →
      </a>
    </div>
  )
}
```

### `StatsRow.tsx`
```tsx
interface Props { repos: number; stars: number; forks: number; followers: number }

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[--border] bg-[--surface] rounded p-4 text-center">
      <div className="text-2xl font-mono font-bold text-[--accent]">{value.toLocaleString()}</div>
      <div className="text-[--text-muted] font-mono text-xs mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function StatsRow({ repos, stars, forks, followers }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatBox label="Repos" value={repos} />
      <StatBox label="Stars" value={stars} />
      <StatBox label="Forks" value={forks} />
      <StatBox label="Followers" value={followers} />
    </div>
  )
}
```

### `LanguageChart.tsx`
```tsx
import type { LanguageStat } from '@/types/github'

export default function LanguageChart({ languages }: { languages: LanguageStat[] }) {
  if (!languages.length) return null
  return (
    <div className="border border-[--border] bg-[--surface] rounded p-6">
      <h3 className="font-mono text-sm text-[--text-muted] uppercase tracking-wider mb-4">// Langages</h3>
      {/* Barre composite */}
      <div className="flex rounded overflow-hidden h-3 mb-5">
        {languages.map(lang => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
            title={`${lang.name} — ${lang.percentage}%`}
          />
        ))}
      </div>
      {/* Légende */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {languages.map(lang => (
          <div key={lang.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: lang.color }} />
            <span className="font-mono text-xs text-[--text] truncate">{lang.name}</span>
            <span className="font-mono text-xs text-[--text-muted] ml-auto">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### `ActivityChart.tsx`
```tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { MonthlyActivity } from '@/types/github'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[--surface] border border-[--border] px-3 py-2 font-mono text-xs">
        <p className="text-[--text-muted]">{label}</p>
        <p className="text-[--accent]">{payload[0].value} commits</p>
      </div>
    )
  }
  return null
}

export default function ActivityChart({ data }: { data: MonthlyActivity[] }) {
  const max = Math.max(...data.map(d => d.commits))
  return (
    <div className="border border-[--border] bg-[--surface] rounded p-6">
      <h3 className="font-mono text-sm text-[--text-muted] uppercase tracking-wider mb-4">// Activité — 12 derniers mois</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={18}>
          <XAxis dataKey="month" tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="commits" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.commits === max ? '#39d353' : entry.commits > 0 ? '#26a641' : '#161b22'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### `RepoCard.tsx`
```tsx
import type { GitHubRepo } from '@/types/github'

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener"
      className="border border-[--border] bg-[--surface] rounded p-4 flex flex-col gap-2 hover:border-[--accent] transition-colors group"
    >
      <div className="font-mono font-bold text-sm text-[--text] group-hover:text-[--accent] transition-colors truncate">
        {repo.name}
      </div>
      {repo.description && (
        <p className="text-[--text-muted] text-xs font-mono line-clamp-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 mt-auto pt-2 border-t border-[--border] text-xs font-mono text-[--text-muted]">
        {repo.language && <span>◆ {repo.language}</span>}
        <span>★ {repo.stargazers_count}</span>
        <span>⑂ {repo.forks_count}</span>
      </div>
    </a>
  )
}
```

### `RepoList.tsx`
```tsx
import RepoCard from './RepoCard'
import type { GitHubRepo } from '@/types/github'

export default function RepoList({ repos }: { repos: GitHubRepo[] }) {
  if (!repos.length) return null
  return (
    <div>
      <h3 className="font-mono text-sm text-[--text-muted] uppercase tracking-wider mb-4">// Top repos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {repos.map(repo => <RepoCard key={repo.id} repo={repo} />)}
      </div>
    </div>
  )
}
```

### `SkeletonCard.tsx`
```tsx
export default function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="border border-[--border] bg-[--surface] rounded animate-pulse"
      style={{ height }}
    />
  )
}
```

---

## CSS Global — `/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0d1117;
  --surface: #161b22;
  --border: #30363d;
  --accent: #39d353;
  --accent-dim: #26a641;
  --text: #e6edf3;
  --text-muted: #848d97;
  --danger: #f85149;
}

body {
  background-color: var(--bg);
  color: var(--text);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.4s ease both;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
```

---

## Layout — `/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitHub Stats — Dashboard',
  description: 'Visualise les statistiques de n\'importe quel profil GitHub',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## `package.json` — dépendances clés

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "recharts": "^2.12.0",
    "geist": "^1.3.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

---

## Variables d'environnement — `.env.local`

```env
# Optionnel — augmente la rate limit GitHub de 60 à 5000 req/h
# Créer un token sur github.com/settings/tokens (scope public uniquement)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

---

## Instructions de démarrage pour Claude Code

1. Créer le projet : `npx create-next-app@latest github-stats --typescript --tailwind --app --no-src-dir`
2. Installer les dépendances supplémentaires : `npm install recharts geist`
3. Créer tous les fichiers listés ci-dessus dans l'ordre
4. Lancer : `npm run dev`
5. Tester avec des usernames connus : `torvalds`, `gaearon`, `sindresorhus`

## Déploiement Vercel

```bash
npx vercel --prod
```

Penser à ajouter `GITHUB_TOKEN` dans les variables d'environnement Vercel si besoin.