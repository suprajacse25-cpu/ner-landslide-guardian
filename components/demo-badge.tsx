import { cn } from '@/lib/utils'

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary',
        className,
      )}
    >
      <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
      Demo Mode · Mock Data
    </span>
  )
}
