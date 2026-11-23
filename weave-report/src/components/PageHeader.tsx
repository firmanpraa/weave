import { summaryStats } from '../data/report'
import { VDivider } from './ui'

export function PageHeader() {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-[34px] leading-[1.2] font-medium text-base-900 sm:text-[42px]">Report</h1>
        <p className="text-[16px] leading-[1.5] tracking-[0.32px] text-ink-700">An aggregated view of all your website data.</p>
      </div>

      <div
        role="group"
        aria-label="Summary"
        className="grid grid-cols-2 gap-4 rounded-2xl border border-cream-edge bg-cream p-4 sm:grid-cols-3 sm:gap-6 lg:flex lg:items-center lg:gap-8 lg:p-[5px] lg:pr-6 xl:w-[785px] xl:justify-between xl:pr-[15px]"
      >
        <div className="col-span-2 flex items-center gap-4 sm:col-span-3 lg:col-span-1 lg:gap-6">
          <span className="hidden size-[66px] shrink-0 items-center justify-center rounded-xl bg-cream-tile shadow-[0px_1px_7px_0px_rgba(144,139,102,0.05)] lg:flex">
            <img src="/assets/icons/bar-chart-04.svg" alt="" width={32} height={32} className="size-8" />
          </span>
          <p className="flex items-baseline gap-3 whitespace-nowrap">
            <span className="text-[32px] leading-[1.2] font-medium text-ink-900 tabular-nums">{summaryStats.bounceRate}</span>
            <span className="text-[14px] leading-[22px] tracking-[0.28px] text-ink-500">Bounce rate</span>
          </p>
        </div>
        {summaryStats.items.map((item) => (
          <div key={item.label} className="flex items-center gap-8">
            <VDivider src="/assets/decor/divider-38.svg" length={38} className="hidden lg:flex" />
            <p className="flex flex-col whitespace-nowrap">
              <span className="text-[24px] leading-8 font-medium tracking-[-0.24px] text-ink-900 tabular-nums">{item.value}</span>
              <span className="text-[14px] leading-[22px] tracking-[0.28px] text-ink-500">{item.label}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
