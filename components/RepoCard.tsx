import type { GitHubRepo } from '@/types/github'

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-border bg-surface rounded p-4 flex flex-col gap-2 hover:border-accent transition-colors group"
    >
      <div className="font-mono font-bold text-sm text-text group-hover:text-accent transition-colors truncate">
        {repo.name}
      </div>
      {repo.description && (
        <p className="text-text-muted text-xs font-mono line-clamp-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border text-xs font-mono text-text-muted">
        {repo.language && <span>◆ {repo.language}</span>}
        <span>★ {repo.stargazers_count.toLocaleString()}</span>
        <span>⑂ {repo.forks_count.toLocaleString()}</span>
      </div>
    </a>
  )
}
