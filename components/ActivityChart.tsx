'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { MonthlyActivity } from '@/types/github'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload?.length) {
    return (
      <div className="bg-surface border border-border px-3 py-2 font-mono text-xs">
        <p className="text-text-muted">{label}</p>
        <p className="text-accent">{payload[0].value} commits</p>
      </div>
    )
  }
  return null
}

export default function ActivityChart({ data }: { data: MonthlyActivity[] }) {
  const max = Math.max(...data.map((d) => d.commits), 0)
  const total = data.reduce((sum, d) => sum + d.commits, 0)

  return (
    <div className="border border-border bg-surface rounded p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-mono text-sm text-text-muted uppercase tracking-wider">
          // Activité — 12 derniers mois
        </h3>
        <p className="font-mono text-xs text-text-muted">
          <span className="text-accent">{total}</span> commits publics
        </p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={18} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#848d97' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="commits" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.commits === 0
                    ? '#21262d'
                    : entry.commits === max
                    ? '#39d353'
                    : '#26a641'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {total === 0 && (
        <p className="text-center text-xs font-mono text-text-muted mt-2">
          Aucune activité publique récente.
        </p>
      )}
    </div>
  )
}
