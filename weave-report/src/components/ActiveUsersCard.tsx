import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { BarShapeProps } from 'recharts'
import { activeUsers } from '../data/report'

// Each bar is a faint column with a solid 3px cap, as drawn in the design; empty minutes keep a 2px stub.
function CappedBar({ x, y, width, height, value }: BarShapeProps) {
  const v = Number(value ?? 0)
  const h = Math.max(Number(height), 2)
  const top = Number(y) + Number(height) - h
  if (v === 0) {
    return <rect x={x} y={top} width={width} height={2} rx={1} fill="#03ffa1" fillOpacity={0.2} />
  }
  return (
    <g>
      <rect x={x} y={top + 5} width={width} height={Math.max(h - 5, 0)} rx={2} fill="#03ffa1" fillOpacity={0.2} />
      <rect x={x} y={top} width={width} height={3} fill="#03ffa1" />
    </g>
  )
}

export function ActiveUsersCard() {
  return (
    <section
      aria-label="Active users"
      className="relative overflow-hidden rounded-2xl bg-forest-900 drop-shadow-[0px_0px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="relative rounded-2xl bg-forest-950 px-8 pt-8 pb-[33px]">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[18px] leading-7 font-semibold whitespace-nowrap text-white">ACTIVE USERS</h2>
          <label className="pressable relative flex shrink-0 items-center gap-1 rounded-lg bg-white/7 px-3 py-2 text-[14px] whitespace-nowrap text-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/12">
            <span>Last 30 minutes</span>
            <img src="/assets/icons/chevron-down-white.svg" alt="" width={20} height={20} className="size-5" />
            <select aria-label="Time range" defaultValue="30m" className="absolute inset-0 cursor-pointer opacity-0">
              <option value="30m">Last 30 minutes</option>
            </select>
          </label>
        </div>
        <p className="mt-[15px] -ml-0.5 text-[72px] leading-[1.2] font-medium text-white tabular-nums">{activeUsers.total}</p>
        <p className="mt-2 text-[16px] leading-[1.5] tracking-[0.32px] text-[#fafafa]">Number of visits per minute</p>
      </div>

      <div className="px-8 pt-[22px] pb-[17px]">
        <div className="h-[93px]" role="img" aria-label="Bar chart of visits per minute over the last 30 minutes">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeUsers.series} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={0}>
              <XAxis dataKey="minute" hide />
              <YAxis hide domain={[0, 93]} />
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="rounded-md bg-ink-800 px-2 py-1 text-[12px] leading-4 text-white shadow-lg">
                      {payload[0].value} visits
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="value" barSize={10} minPointSize={2} shape={CappedBar} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 -mx-0.5 flex justify-between text-[12px] leading-4 text-ink-0">
          {activeUsers.ticks.map((t) => (
            <span key={t} className="opacity-40">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
