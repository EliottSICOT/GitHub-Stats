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
      <div className="flex-1 flex items-center border border-border bg-surface rounded px-3 gap-2 focus-within:border-accent transition-colors">
        <span className="text-accent font-mono text-sm select-none">$</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="username"
          aria-label="GitHub username"
          className="flex-1 bg-transparent text-text font-mono text-sm py-3 outline-none placeholder:text-text-muted"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !value.trim()}
        className="px-5 py-3 bg-accent text-black font-mono text-sm font-bold rounded hover:bg-accent-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '...' : 'RUN'}
      </button>
    </div>
  )
}
