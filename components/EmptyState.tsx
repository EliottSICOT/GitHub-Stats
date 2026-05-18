'use client'

interface Props {
  onPick: (username: string) => void
}

const FEATURES = [
  {
    glyph: '◉',
    title: 'PROFIL',
    desc: 'Bio, localisation, followers et année d\'inscription.',
  },
  {
    glyph: '★',
    title: 'STATS',
    desc: 'Repos, étoiles, forks et followers agrégés en temps réel.',
  },
  {
    glyph: '◆',
    title: 'LANGAGES',
    desc: 'Répartition automatique sur les 100 derniers repos publics.',
  },
  {
    glyph: '▮',
    title: 'ACTIVITÉ',
    desc: '12 mois de commits publics visualisés en barres.',
  },
]

const TRENDING = [
  { user: 'torvalds', name: 'Linus Torvalds' },
  { user: 'gaearon', name: 'Dan Abramov' },
  { user: 'sindresorhus', name: 'Sindre Sorhus' },
  { user: 'tj', name: 'TJ Holowaychuk' },
  { user: 'yyx990803', name: 'Evan You' },
  { user: 'bradtraversy', name: 'Brad Traversy' },
]

export default function EmptyState({ onPick }: Props) {
  return (
    <div className="mt-12 space-y-8 animate-fade-in">
      {/* Features */}
      <section>
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
          // ce que tu obtiens
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border border-border bg-surface rounded p-4 hover:border-accent transition-colors group"
            >
              <div className="text-accent text-2xl font-mono mb-2 group-hover:scale-110 transition-transform origin-left">
                {f.glyph}
              </div>
              <div className="font-mono text-xs font-bold tracking-wider text-text">
                {f.title}
              </div>
              <p className="font-mono text-xs text-text-muted mt-1.5 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal demo */}
      <section>
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
          // exemple de sortie
        </h3>
        <div className="border border-border bg-surface rounded overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-black/30">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
            <span className="font-mono text-xs text-text-muted ml-2">~/github-stats</span>
          </div>
          <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed">
            <div>
              <span className="text-accent">$</span>{' '}
              <span className="text-text">github-stats</span>{' '}
              <span className="text-text-muted">--user</span>{' '}
              <span className="text-text">torvalds</span>
              <span className="terminal-cursor" />
            </div>
            <div className="mt-2 space-y-1 text-text-muted">
              <div>
                <span className="text-accent">✓</span> fetching{' '}
                <span className="text-text">user.json</span>
                <span className="text-text-muted"> ........ </span>
                <span className="text-accent">OK</span>
              </div>
              <div>
                <span className="text-accent">✓</span> fetching{' '}
                <span className="text-text">repos.json</span>
                <span className="text-text-muted"> ....... </span>
                <span className="text-accent">100 items</span>
              </div>
              <div>
                <span className="text-accent">✓</span> fetching{' '}
                <span className="text-text">events.json</span>
                <span className="text-text-muted"> ...... </span>
                <span className="text-accent">12 months</span>
              </div>
              <div className="border-t border-border my-3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-text">
                <div>
                  <span className="text-text-muted">repos</span> 12
                </div>
                <div>
                  <span className="text-text-muted">stars</span> 189k
                </div>
                <div>
                  <span className="text-text-muted">forks</span> 56k
                </div>
                <div>
                  <span className="text-text-muted">followers</span> 220k
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-text-muted">langs</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#555555]" />
                  <span className="text-text">C</span>
                  <span className="text-text-muted">68%</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#89e051]" />
                  <span className="text-text">Shell</span>
                  <span className="text-text-muted">14%</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f1e05a]" />
                  <span className="text-text">JS</span>
                  <span className="text-text-muted">9%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section>
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
          // profils populaires
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRENDING.map((p) => (
            <button
              key={p.user}
              onClick={() => onPick(p.user)}
              className="border border-border bg-surface rounded p-3 flex items-center gap-3 text-left hover:border-accent transition-colors group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github.com/${p.user}.png?size=80`}
                alt={p.user}
                width={40}
                height={40}
                className="rounded border border-border flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <div className="font-mono text-xs text-text-muted truncate">
                  @{p.user}
                </div>
                <div className="font-mono text-xs text-text group-hover:text-accent transition-colors truncate">
                  {p.name}
                </div>
              </div>
              <span className="ml-auto font-mono text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
