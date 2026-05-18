import Image from 'next/image'
import type { GitHubUser } from '@/types/github'

export default function ProfileCard({ user }: { user: GitHubUser }) {
  const joinYear = new Date(user.created_at).getFullYear()
  const blogHref = user.blog?.startsWith('http') ? user.blog : user.blog ? `https://${user.blog}` : null

  return (
    <div className="border border-border bg-surface rounded p-6 flex flex-col sm:flex-row gap-5 items-start">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={72}
        height={72}
        className="rounded border border-border"
        unoptimized
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h2 className="font-mono font-bold text-xl text-text">{user.name || user.login}</h2>
          <span className="text-text-muted font-mono text-sm">@{user.login}</span>
        </div>
        {user.bio && <p className="text-text-muted text-sm mt-1 font-mono">{user.bio}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-mono text-text-muted">
          {user.location && <span>📍 {user.location}</span>}
          {user.company && <span>🏢 {user.company}</span>}
          {blogHref && (
            <a
              href={blogHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              🔗 {user.blog}
            </a>
          )}
          <span>📅 depuis {joinYear}</span>
          <span>
            👥 {user.followers.toLocaleString()} followers · {user.following.toLocaleString()} following
          </span>
        </div>
      </div>
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="self-stretch sm:self-start text-accent font-mono text-xs border border-accent px-3 py-1.5 rounded hover:bg-accent hover:text-black transition-colors whitespace-nowrap text-center"
      >
        VOIR PROFIL →
      </a>
    </div>
  )
}
