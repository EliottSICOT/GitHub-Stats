import type { LanguageStat } from '@/types/github'

export default function LanguageChart({ languages }: { languages: LanguageStat[] }) {
  if (!languages.length) return null
  return (
    <div className="border border-border bg-surface rounded p-6">
      <h3 className="font-mono text-sm text-text-muted uppercase tracking-wider mb-4">
        // Langages
      </h3>
      <div className="flex rounded overflow-hidden h-3 mb-5 lang-grow">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
            title={`${lang.name} — ${lang.percentage}%`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="font-mono text-xs text-text truncate">{lang.name}</span>
            <span className="font-mono text-xs text-text-muted ml-auto tabular-nums">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
