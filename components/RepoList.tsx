import RepoCard from './RepoCard'
import type { GitHubRepo } from '@/types/github'

export default function RepoList({ repos }: { repos: GitHubRepo[] }) {
  if (!repos.length) {
    return (
      <div className="border border-border bg-surface rounded p-6 text-center">
        <h3 className="font-mono text-sm text-text-muted uppercase tracking-wider mb-2">
          // Top repos
        </h3>
        <p className="text-text-muted text-xs font-mono">Aucun repo public à afficher.</p>
      </div>
    )
  }
  return (
    <div>
      <h3 className="font-mono text-sm text-text-muted uppercase tracking-wider mb-4">
        // Top repos
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  )
}
