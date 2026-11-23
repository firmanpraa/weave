import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { bounceRate, trends } from '../data/report'
import { ArrowButton, Card, CardTitle, Legend, TooltipBubble, Trend } from './ui'
import { useMediaQuery } from './useMediaQuery'

const axisTick = { fill: '#9aa4b2', fontSize: 14, fontFamily: 'inherit' }
const axisTickSmall = { ...axisTick, fontSize: 12 }

/* Axis geometry: the design's values on wide screens, a compact axis on phones. */
function useAxis() {
  const wide = useMediaQuery('(min-width: 640px)')
  return wide
    ? { wide, tick: axisTick, yWidth: 67, yMargin: 36 }
    : { wide, tick: axisTickSmall, yWidth: 36, yMargin: 6 }
}
const GRID = '#e3e8ef'

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const addDays = (base: Date, days: number) => new Date(base.getTime() + days * 86_400_000)

type HoverState = { activeTooltipIndex?: number | string | null }

/* Keeps the design's highlighted point as the resting state; mouse hover moves it via Recharts,
   touch (tap or drag) via pointer position mapped to the nearest sample. */
function useActiveIndex(initial: number, xs: number[], domainMax: number, plotLeft: number) {
  const [index, setIndex] = useState(initial)
  const fromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left - plotLeft) / (rect.width - plotLeft)) * domainMax
    let best = 0
    xs.forEach((v, i) => {
      if (Math.abs(v - x) < Math.abs(xs[best] - x)) best = i
    })
    setIndex(best)
  }
  return {
    index,
    handlers: {
      onMouseMove: (s: HoverState) => {
        const i = Number(s?.activeTooltipIndex)
        if (Number.isFinite(i) && s?.activeTooltipIndex != null) setIndex(i)
      },
      onMouseLeave: () => setIndex(initial),
    },
    pointer: { onPointerDown: fromPointer, onPointerMove: fromPointer },
  }
}

/* SVG-anchored tooltip: bubble sits `gap` px left of the point, flips right when it would cross the y-axis. */
function AnchoredTooltip({
  cx,
  cy,
  gap,
  width,
  bubbleWidth,
  minX,
  height,
  children,
}: {
  cx?: number
  cy?: number
  gap: number
  width: number
  bubbleWidth: number
  minX: number
  height: number
  children: React.ReactNode
}) {
  if (cx == null || cy == null) return null
  const flip = cx - gap - bubbleWidth < minX
  const x = flip ? cx + 16 : cx - gap - width
  return (
    <g pointerEvents="none">
      <line x1={flip ? cx : x + width - 20} x2={flip ? x : cx} y1={cy} y2={cy} stroke="#202939" strokeWidth={0.5} />
      <foreignObject x={x} y={cy - height / 2} width={width} height={height} overflow="visible">
        <div className={`flex h-full items-center ${flip ? 'justify-start' : 'justify-end'}`}>
          <TooltipBubble>{children}</TooltipBubble>
        </div>
      </foreignObject>
    </g>
  )
}

const Dot = ({ cx, cy }: { cx?: number; cy?: number }) =>
  cx == null || cy == null ? <g /> : <circle cx={cx} cy={cy} r={5} fill="#010101" stroke="#ffffff" strokeWidth={2} />

/* ---------------------------------------------------------------- Bounce rate */

const bounceAnchor = new Date(2024, 5, 5) // column 7.75 = Jun 5, the point the design highlights
const bounceDate = (g: number, year: number) => {
  const d = addDays(bounceAnchor, Math.round((g - 7.75) * 7))
  d.setFullYear(year)
  return fmt(d)
}

export function BounceRateCard() {
  const axis = useAxis()
  const { index, handlers, pointer } = useActiveIndex(
    bounceRate.activeIndex,
    bounceRate.series.map((d) => d.g),
    12,
    axis.yWidth,
  )
  const point = bounceRate.series[index] ?? bounceRate.series[bounceRate.activeIndex]
  const isDesignPoint = index === bounceRate.activeIndex
  const labels = isDesignPoint
    ? bounceRate.activeLabel
    : { current: bounceDate(point.g, 2024), last: bounceDate(point.g, 2023) }
  const values = isDesignPoint ? bounceRate.activeValues : { current: point.current, last: point.last }

  return (
    <Card label="Bounce rate" className="pt-[31px]">
      <div className="flex items-start justify-between gap-4 px-[31px]">
        <CardTitle className="text-ink-900">BOUNCE RATE</CardTitle>
        <div className="flex items-center gap-6">
          <Trend value={bounceRate.change} label="up versus last year" />
          <ArrowButton label="Open bounce rate report" />
        </div>
      </div>
      <Legend
        className="mt-5 px-[31px]"
        items={[
          { label: 'Current year', color: '#03ffa1' },
          { label: 'Last year', color: '#f8cf80' },
        ]}
      />
      <div className="mt-8 px-3 pb-[27px] sm:mt-[59px] sm:pr-0 sm:pl-[31px]">
        <div className="h-[324px] touch-pan-y sm:-mr-[11px]" {...pointer}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={bounceRate.series} margin={{ top: 9, right: 0, bottom: 0, left: 0 }} {...handlers}>
              <defs>
                <linearGradient id="bounce-band" x1="0" y1="0.6" x2="1" y2="0.4">
                  <stop offset="25%" stopColor="#03ffa1" stopOpacity={0.36} />
                  <stop offset="100%" stopColor="#c9fbe8" stopOpacity={0.14} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke={GRID}
                strokeDasharray="2 2"
                verticalCoordinatesGenerator={({ offset }) =>
                  Array.from({ length: 13 }, (_, i) => (offset?.left ?? 0) + i * (((offset?.width ?? 0) as number) / 12))
                }
              />
              <XAxis
                dataKey="g"
                type="number"
                domain={[0, 12]}
                ticks={bounceRate.xTicks.map((t) => t.at)}
                tickFormatter={(v: number) => bounceRate.xTicks.find((t) => t.at === v)?.label ?? ''}
                tick={axis.tick}
                tickLine={false}
                axisLine={false}
                tickMargin={18}
                height={41}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={axis.tick}
                tickLine={false}
                axisLine={false}
                tickSize={0}
                tickMargin={axis.yMargin}
                width={axis.yWidth}
                allowDataOverflow
              />
              <Tooltip content={() => null} cursor={false} isAnimationActive={false} />
              <Area dataKey="band" type="monotone" stroke="none" fill="url(#bounce-band)" isAnimationActive={false} activeDot={false} />
              <Line dataKey="last" type="monotone" stroke="#e5d9ac" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
              <Line dataKey="current" type="monotone" stroke="#25ef85" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
              <ReferenceLine
                segment={[
                  { x: point.g, y: point.current },
                  { x: point.g, y: 0 },
                ]}
                stroke="#202939"
                strokeWidth={0.5}
                ifOverflow="hidden"
              />
              <ReferenceDot x={point.g} y={point.last} shape={Dot} ifOverflow="visible" />
              <ReferenceDot
                x={point.g}
                y={point.current}
                ifOverflow="visible"
                shape={(p: { cx?: number; cy?: number }) => (
                  <g>
                    <AnchoredTooltip cx={p.cx} cy={p.cy} gap={axis.wide ? 118 : 16} width={180} bubbleWidth={146} minX={axis.yWidth} height={54}>
                      {[
                        [labels.current, values.current],
                        [labels.last, values.last],
                      ].map(([label, value]) => (
                        <p key={String(label)} className="flex items-center gap-1 whitespace-nowrap">
                          <span className="w-[72px] text-[12px] leading-4 text-tooltip-muted">{label}:</span>
                          <span className="text-[14px] leading-[22px] font-medium tracking-[0.28px] text-white tabular-nums">
                            {Number(value).toFixed(2)}%
                          </span>
                        </p>
                      ))}
                    </AnchoredTooltip>
                    <Dot cx={p.cx} cy={p.cy} />
                  </g>
                )}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------------- Trends */

const trendsStart = new Date(2023, 4, 7) // day 0 = May 7, 2023

export function TrendsCard() {
  const axis = useAxis()
  const { index, handlers, pointer } = useActiveIndex(
    trends.activeDay,
    trends.series.map((d) => d.day),
    50.8,
    axis.yWidth,
  )
  const xTicks = axis.wide ? trends.xTicks : trends.xTicks.filter((_, k) => k % 2 === 0)
  const row = trends.series[index] ?? trends.series[trends.activeDay]
  const value = row.views ?? row.projected
  const shown = value == null ? trends.series[trends.activeDay] : row
  const shownValue = (shown.views ?? shown.projected) as number

  return (
    <Card label="Trends" className="pt-[31px]">
      <div className="flex items-start justify-between gap-4 px-[31px]">
        <CardTitle className="text-ink-900">TRENDS</CardTitle>
        <ArrowButton label="Open trends report" />
      </div>
      <Legend
        className="mt-5 px-[31px]"
        items={[
          { label: 'Page Views/ Visits [Page: Home]', color: '#004737' },
          { label: 'Occurrences [Page: Home]', color: '#03ffa1' },
          { label: 'Occurrences [Page: Home; Works]', color: '#f8cf80' },
        ]}
      />
      <div className="mt-8 px-3 pb-[27px] sm:mt-[59px] sm:pr-0 sm:pl-[31px]">
        <div className="h-[324px] touch-pan-y sm:-mr-[11px]" {...pointer}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trends.series} margin={{ top: 9, right: 0, bottom: 0, left: 0 }} {...handlers}>
              <defs>
                <linearGradient id="trends-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#29a27d" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#1b7a5d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} strokeDasharray="2 2" vertical={false} />
              <XAxis
                dataKey="day"
                type="number"
                domain={[0, 50.8]}
                ticks={xTicks.map((t) => t.at)}
                tickFormatter={(v: number) => xTicks.find((t) => t.at === v)?.label ?? ''}
                tick={axis.tick}
                tickLine={false}
                axisLine={false}
                tickMargin={18}
                height={41}
                interval={0}
              />
              <YAxis
                domain={[0, 1000]}
                ticks={[0, 250, 500, 750, 1000]}
                tick={axis.tick}
                tickLine={false}
                axisLine={false}
                tickSize={0}
                tickMargin={axis.yMargin}
                width={axis.yWidth}
              />
              <Tooltip content={() => null} cursor={false} isAnimationActive={false} />
              <Area dataKey="views" type="monotone" stroke="#004737" strokeWidth={2} fill="url(#trends-fill)" dot={false} activeDot={false} isAnimationActive={false} connectNulls={false} />
              <Line dataKey="projected" type="monotone" stroke="#b0b0b0" strokeWidth={1} dot={false} activeDot={false} isAnimationActive={false} />
              <Line dataKey="home" type="linear" stroke="#03ffa1" strokeWidth={1} dot={false} activeDot={false} isAnimationActive={false} />
              <Line dataKey="works" type="linear" stroke="#f8cf80" strokeWidth={1} dot={false} activeDot={false} isAnimationActive={false} />
              <ReferenceLine
                segment={[
                  { x: shown.day, y: shownValue },
                  { x: shown.day, y: 0 },
                ]}
                stroke="#202939"
                strokeWidth={0.5}
              />
              <ReferenceDot
                x={shown.day}
                y={shownValue}
                ifOverflow="visible"
                shape={(p: { cx?: number; cy?: number }) => (
                  <g>
                    <AnchoredTooltip cx={p.cx} cy={p.cy} gap={axis.wide ? 183 : 16} width={120} bubbleWidth={90} minX={axis.yWidth} height={54}>
                      <p className="text-[14px] leading-[22px] font-medium tracking-[0.28px] text-white tabular-nums">{shownValue}</p>
                      <p className="-mt-1 text-[12px] leading-4 whitespace-nowrap text-white">
                        {shown.day === trends.activeDay ? trends.activeLabel : fmt(addDays(trendsStart, shown.day))}
                      </p>
                    </AnchoredTooltip>
                    <Dot cx={p.cx} cy={p.cy} />
                  </g>
                )}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
