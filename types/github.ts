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
  month: string
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
