import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { newVsReturning, topCountries, topPages } from '../data/report'
import { Flag } from './Flag'
import { ArrowButton, Card, CardTitle, Legend, Trend, VDivider } from './ui'

function CardHead({ title }: { title: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <CardTitle>{title}</CardTitle>
      <ArrowButton label={`Open ${title.toLowerCase()}`} />
    </div>
  )
}

function HeadlineMetric({ value, change, label, changeLabel }: { value: string; change: string; label: string; changeLabel: string }) {
  return (
    <div className="mt-5 flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <p className="min-w-[83px] text-[32px] leading-[1.2] font-medium text-black-soft tabular-nums">{value}</p>
        <div className="pb-0.5">
          <Trend value={change} label={changeLabel} />
        </div>
      </div>
      <p className="text-[14px] leading-[22px] text-ink-500">{label}</p>
    </div>
  )
}

export function TopCountriesCard() {
  return (
    <Card label="Top countries" className="p-[31px]">
      <CardHead title="TOP COUNTRIES" />
      <HeadlineMetric value={topCountries.total} change={topCountries.change} label="Total Visits" changeLabel="up versus last period" />
      <ul className="mt-8 flex flex-col gap-6">
        {topCountries.rows.map((row) => (
          <li key={row.code} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-4">
              <Flag code={row.code} />
              <span className="text-[14px] leading-6 font-semibold tracking-[0.28px] text-base-900">{row.name}</span>
            </span>
            <span className="text-[14px] leading-[22px] text-ink-900 tabular-nums">{row.share}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function NewVsReturningCard() {
  const share = newVsReturning[0]
  return (
    <Card label="New versus returning users" className="p-[31px]">
      <CardHead title="NEW VS RETURNING" />
      <div className="relative mx-auto mt-[35px] size-[264px]">
        <img src="/assets/decor/donut-tick-ring.png" alt="" width={264} height={264} className="absolute inset-0 size-[264px]" />
        <div className="absolute top-1/2 left-1/2 size-[231px] -translate-x-1/2 -translate-y-1/2">
          <PieChart width={231} height={231} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            {/* Returning users draw as the thinner outer ring, new users as the full-width ring, as in the design. */}
            <Pie
              data={newVsReturning}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={101.5}
              outerRadius={115}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
              tooltipType="none"
            >
              {newVsReturning.map((d, i) => (
                <Cell key={d.name} fill={i === 0 ? 'transparent' : d.color} />
              ))}
            </Pie>
            <Pie
              data={newVsReturning}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={88}
              outerRadius={115}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {newVsReturning.map((d, i) => (
                <Cell key={d.name} fill={i === 0 ? d.color : 'transparent'} />
              ))}
            </Pie>
            <Tooltip
              isAnimationActive={false}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="rounded-md bg-ink-800 px-2 py-1 text-[12px] leading-4 text-white shadow-lg">
                    {payload[0].name}: {payload[0].value}%
                  </div>
                ) : null
              }
            />
          </PieChart>
        </div>
        <img
          src="/assets/decor/donut-center.svg"
          alt=""
          width={172}
          height={172}
          className="pointer-events-none absolute top-1/2 left-1/2 size-[172px] -translate-x-1/2 -translate-y-1/2"
        />
        <p className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center whitespace-nowrap">
          <span className="text-[32px] leading-[1.2] font-medium text-black-soft tabular-nums">{share.value}%</span>
          <span className="text-[14px] leading-[22px] text-ink-500">{share.name}</span>
        </p>
      </div>
      <Legend
        className="mt-[42px] justify-center"
        items={[
          { label: 'New Users', color: '#03ffa1' },
          { label: 'Returning Users', color: '#f8cf80' },
        ]}
      />
    </Card>
  )
}

export function TopPagesCard() {
  return (
    <Card label="Top pages" className="p-[31px]">
      <CardHead title="TOP PAGES" />
      <HeadlineMetric value={topPages.total} change={topPages.change} label="Total Sessions" changeLabel="up versus last period" />
      <ul className="mt-8 flex flex-col gap-8">
        {topPages.rows.map((row) => (
          <li key={row.path} className="flex items-center gap-4">
            <span className="flex shrink-0 items-start rounded-lg bg-ink-50 p-3">
              <img src="/assets/icons/monitor.svg" alt="" width={20} height={20} className="size-5" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <p className="flex min-w-0 text-[14px] leading-[22px] tracking-[0.28px] text-ink-400">
                <span className="truncate">www.firmannoor.com/</span>
                <span className="shrink-0 font-medium text-ink-900">{row.path}</span>
              </p>
              {/* Fill scale: a 50% share fills the track. */}
              <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-[2px]" aria-hidden>
                <span className="h-full shrink-0 bg-forest-950" style={{ width: `${Math.min(row.share * 2, 100)}%` }} />
                <span className="h-full flex-1 bg-ink-100" />
              </div>
            </div>
            <VDivider src="/assets/decor/divider-46.svg" length={46} />
            <p className="w-7 shrink-0 text-right text-[14px] leading-[22px] text-ink-900 tabular-nums">{row.share}%</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

const upgradeBars = [45.486, 1.378, 34.459, 1.378, 17.919, 1.378, 48.243, 34.459, 34.459, 17.919, 34.459, 24.811, 24.811, 51, 34.459, 24.811, 44.108]

export function UpgradeCard() {
  return (
    <section
      aria-label="Upgrade your plan"
      className="relative min-h-[196px] overflow-hidden rounded-2xl border border-cream-edge p-[23px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.04)]"
      style={{ backgroundImage: 'linear-gradient(-51.55deg, rgb(255,251,236) 14.16%, rgb(211,248,234) 113.43%)' }}
    >
      {/* Decorative mini bar strip, mirrored as in the design. */}
      <div aria-hidden className="absolute top-[152px] left-[223px] flex h-[51px] w-[442.459px] -scale-x-100 items-end justify-between">
        {upgradeBars.map((h, i) => (
          <div key={i} className="flex w-[13.784px] flex-col gap-[2.757px] overflow-hidden rounded-[2.757px]" style={{ height: h }}>
            {h > 2 && <div className="h-[4.135px] w-full shrink-0 bg-[#e5d9ac]" />}
            <div className="w-full flex-1 bg-[#e5d9ac] opacity-20" />
          </div>
        ))}
      </div>
      <img
        src="/assets/decor/upgrade-padlock.png"
        alt=""
        width={246}
        height={246}
        className="pointer-events-none absolute top-[-32px] left-[220px] size-[246.304px] max-w-none -rotate-[5.18deg] object-cover max-[400px]:left-auto max-[400px]:right-[-110px]"
      />
      <div className="relative flex w-[240px] flex-col gap-1">
        <h2 className="text-[18px] leading-7 font-semibold text-black-soft">UPGRADE YOUR PLAN</h2>
        <p className="text-[14px] leading-[22px] tracking-[0.28px] text-ink-500">Upgrade your plan to enjoy our powerful features.</p>
      </div>
      <button
        type="button"
        className="pressable relative mt-[24px] flex items-center justify-center overflow-hidden rounded-xl border border-white bg-forest-900 px-5 py-[11px] text-[14px] leading-6 font-semibold tracking-[0.28px] text-white shadow-primary [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#0b5544]"
      >
        Upgrade Plan
      </button>
    </section>
  )
}
