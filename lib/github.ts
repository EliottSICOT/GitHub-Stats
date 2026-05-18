import type {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  LanguageStat,
  MonthlyActivity,
  DashboardData,
} from '@/types/github'

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
  C: '#555555',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198CE7',
  Perl: '#0298c3',
  ObjectiveC: '#438eff',
  'Jupyter Notebook': '#DA5B0B',
  MDX: '#fcb32c',
  TeX: '#3D6117',
}

const BASE = '/api/github'

async function fetchGitHub<T>(type: string, username: string): Promise<T> {
  const res = await fetch(`${BASE}?type=${type}&username=${encodeURIComponent(username)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur inconnue' }))
    throw new Error(err.error || 'Erreur inconnue')
  }
  return res.json()
}

function computeLanguages(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {}
  repos.forEach((repo) => {
    if (repo.language && !repo.fork) {
      counts[repo.language] = (counts[repo.language] || 0) + 1
    }
  })
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) return []
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
  const order: string[] = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    months[key] = 0
    order.push(key)
  }

  events.forEach((event) => {
    if (event.type === 'PushEvent') {
      const d = new Date(event.created_at)
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      if (key in months) {
        months[key] += event.payload.size || event.payload.commits?.length || 1
      }
    }
  })

  return order.map((month) => ({ month, commits: months[month] }))
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
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)

  return { user, repos, languages, monthlyActivity, totalStars, totalForks, topRepos }
}
