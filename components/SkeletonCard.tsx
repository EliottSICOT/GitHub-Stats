export default function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="border border-border bg-surface rounded animate-pulse"
      style={{ height }}
    />
  )
}
