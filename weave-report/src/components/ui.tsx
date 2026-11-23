import type { ReactNode } from 'react'

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ')

export function Card({ className, children, label }: { className?: string; children: ReactNode; label: string }) {
  return (
    <section
      aria-label={label}
      className={cx(
        'relative overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx('text-[18px] leading-7 font-semibold text-black-soft', className)}>{children}</h2>
}

export function ArrowButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        'pressable relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-ink-300 bg-white shadow-control',
        'after:absolute after:-inset-1.5 after:content-[""] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink-50',
        className,
      )}
    >
      <img src="/assets/icons/arrow-narrow-right.svg" alt="" width={16} height={16} className="block size-4" />
    </button>
  )
}

export function Trend({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex items-center gap-1 text-[16px] leading-6 font-medium text-mint-text">
      <span>{value}</span>
      <span className="sr-only">{label}</span>
      <img src="/assets/icons/trending-up.svg" alt="" width={20} height={20} className="size-5" />
    </p>
  )
}

export function Legend({ items, className }: { items: Array<{ label: string; color: string }>; className?: string }) {
  return (
    <ul className={cx('flex flex-wrap items-start gap-x-8 gap-y-2', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span aria-hidden className="h-[3px] w-6 shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-[14px] leading-[22px] text-ink-500">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}

export function Metric({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cx('flex flex-col items-start gap-2', className)}>
      <p className="text-[32px] leading-[1.2] font-medium text-black-soft tabular-nums">{value}</p>
      <p className="text-[14px] leading-[22px] text-ink-500">{label}</p>
    </div>
  )
}

/* Vertical rule drawn with the design's own 1px line asset, rotated as in Figma. */
export function VDivider({ src, length, className }: { src: string; length: number; className?: string }) {
  return (
    <span aria-hidden className={cx('flex w-0 shrink-0 items-center justify-center', className)} style={{ height: length }}>
      <img src={src} alt="" width={length} height={1} className="block h-px max-w-none rotate-90" style={{ width: length }} />
    </span>
  )
}

/* Dark tooltip bubble with the design's pointer on its right edge. */
export function TooltipBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center drop-shadow-[0px_4px_4px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-1 rounded-md bg-ink-800 p-2">{children}</div>
      <img
        src="/assets/icons/tooltip-pointer.svg"
        alt=""
        width={12}
        height={5.17157}
        className="-ml-[3px] block h-[5.17157px] w-3 -rotate-90"
      />
    </div>
  )
}
