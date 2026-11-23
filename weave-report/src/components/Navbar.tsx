import { useEffect, useRef } from 'react'
import { VDivider } from './ui'

const links = [
  { label: 'Overview' },
  { label: 'Report', current: true },
  { label: 'Heatmaps', badge: true },
  { label: 'Trends' },
  { label: 'Recordings' },
  { label: 'Survey' },
]

export function Navbar() {
  const searchRef = useRef<HTMLInputElement>(null)

  // ⌘K / Ctrl+K focuses search, as the shortcut hint in the field says.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 px-5 pt-3 sm:px-10 xl:h-[87px] xl:flex-nowrap xl:pt-0">
        <a href="#" className="order-1 flex size-12 shrink-0 items-center justify-center" aria-label="Weave home">
          <img src="/assets/icons/logo.svg" alt="" width={39.2727} height={27.1418} className="h-[27.1418px] w-[39.2727px]" />
        </a>

        <nav
          aria-label="Main"
          className="thin-scroll order-3 -mx-5 w-[calc(100%+40px)] overflow-x-auto px-5 sm:-mx-10 sm:w-[calc(100%+80px)] sm:px-10 xl:order-2 xl:mx-0 xl:ml-4 xl:w-auto xl:overflow-visible xl:px-0"
        >
          <ul className="flex h-12 items-stretch gap-8 xl:h-[87px]">
            {links.map((link) => (
              <li key={link.label} className="relative flex shrink-0 items-center">
                <a
                  href="#"
                  aria-current={link.current ? 'page' : undefined}
                  className={
                    link.current
                      ? 'text-[14px] leading-6 font-semibold tracking-[0.28px] text-base-900'
                      : 'text-[14px] leading-[22px] tracking-[0.28px] text-ink-500 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-base-900'
                  }
                >
                  {link.label}
                  {link.badge && (
                    <>
                      <img
                        src="/assets/icons/notification-dot.svg"
                        alt=""
                        width={6}
                        height={6}
                        className="absolute -right-1.5 top-1/2 size-1.5 -translate-y-[9px]"
                      />
                      <span className="sr-only"> (new activity)</span>
                    </>
                  )}
                </a>
                {link.current && (
                  <span aria-hidden className="absolute bottom-0 left-1/2 h-[5px] w-[52px] -translate-x-1/2 rounded-t-[10px] bg-forest-950" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-2 ml-auto flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-6 xl:order-3">
          <label className="pressable relative flex items-center gap-3 rounded-lg py-2">
            <span className="flex items-center gap-2">
              <img src="/assets/icons/globe.svg" alt="" width={20} height={20} className="size-5" />
              <span className="hidden text-[14px] leading-[22px] font-medium tracking-[0.28px] text-base-900 sm:inline">
                My Personal Website
              </span>
            </span>
            <img src="/assets/icons/chevron-down-nav.svg" alt="" width={20} height={20} className="size-5" />
            <select aria-label="Website" className="absolute inset-0 cursor-pointer opacity-0" defaultValue="personal">
              <option value="personal">My Personal Website</option>
            </select>
          </label>

          <VDivider src="/assets/decor/divider-28.svg" length={28} className="hidden md:flex" />

          <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-ink-50 py-2 pr-4 pl-3 md:max-w-[310px]">
            <img src="/assets/icons/search.svg" alt="" width={16} height={16} className="size-4 shrink-0" />
            <span className="sr-only">Search</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search here"
              className="w-0 min-w-0 flex-1 bg-transparent text-[14px] leading-[22px] tracking-[0.28px] text-ink-900 outline-none placeholder:text-ink-400 focus-visible:outline-none [@media(pointer:coarse)]:text-[16px]"
            />
            <span aria-hidden className="hidden items-center gap-1 text-[14px] leading-[22px] tracking-[0.28px] text-ink-400 md:flex">
              <span className="flex rounded-[3px] bg-white p-0.5 drop-shadow-[0px_0px_2px_rgba(0,0,0,0.1)]">
                <img src="/assets/icons/command-key.svg" alt="" width={12} height={12} className="size-3" />
              </span>
              <span>+</span>
              <span>k</span>
            </span>
          </label>

          <button type="button" aria-label="Account menu" className="pressable size-10 shrink-0 overflow-hidden rounded-full">
            <img src="/assets/decor/avatar.png" alt="" width={40} height={40} className="size-10" />
          </button>
        </div>
      </div>
    </header>
  )
}
