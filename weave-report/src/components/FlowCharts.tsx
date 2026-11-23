import { Bar, BarChart, ResponsiveContainer, Sankey, XAxis, YAxis } from 'recharts'
import type { BarShapeProps } from 'recharts'
import { behaviorFlow, signupFunnel } from '../data/report'
import { ArrowButton, Card, CardTitle, VDivider } from './ui'

/* ---------------------------------------------------------------- Behavior flow */

type FlowNode = (typeof behaviorFlow.nodes)[number]

function FlowNodeShape(props: { x: number; y: number; width: number; height: number; payload: FlowNode & { dropOff?: boolean } }) {
  const { x, y, width, height, payload } = props
  const h = Math.max(height, 3)
  return (
    <g>
      <rect x={x} y={y} width={width} height={h} rx={Math.min(8, h / 2)} fill={payload.dropOff ? '#cdd5df' : '#b7f8e4'} />
      <text x={x} y={y - 30} fill="#121926" fontSize={14} fontWeight={500} letterSpacing={0.28}>
        {payload.name}
      </text>
      <text x={x} y={y - 12} fill="#9aa4b2" fontSize={12}>
        {payload.meta[0]}
        <tspan dx={8}>•</tspan>
        <tspan dx={8}>{payload.meta[1]}</tspan>
      </text>
    </g>
  )
}

function FlowLinkShape(props: {
  sourceX: number
  targetX: number
  sourceY: number
  targetY: number
  sourceControlX: number
  targetControlX: number
  linkWidth: number
  payload: { target: FlowNode & { dropOff?: boolean } }
}) {
  const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, payload } = props
  const toDropOff = Boolean(payload.target?.dropOff)
  return (
    <path
      d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
      fill="none"
      stroke={toDropOff ? '#e3e8ef' : '#b7f8e4'}
      strokeOpacity={toDropOff ? 0.55 : 0.35}
      strokeWidth={Math.max(linkWidth, 2)}
    />
  )
}

const FLOW_WIDTH = 1042
const COLUMN_X = [31, 316.5, 602, 887.5]

export function BehaviorFlowCard() {
  return (
    <Card label="Behavior flow" className="pt-[31px]">
      <div className="flex items-start justify-between gap-4 px-[31px]">
        <CardTitle className="text-ink-900">BEHAVIOR FLOW</CardTitle>
        <ArrowButton label="Open behavior flow report" />
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3 px-[31px]">
        <label className="pressable relative flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 py-2 shadow-control [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink-50">
          <span className="text-[14px] leading-[22px] font-medium tracking-[0.28px] text-ink-900">Homepage</span>
          <img src="/assets/icons/chevron-down-sm.svg" alt="" width={16} height={16} className="size-4" />
          <select aria-label="Starting page" defaultValue="home" className="absolute inset-0 cursor-pointer opacity-0">
            <option value="home">Homepage</option>
          </select>
        </label>
        <VDivider src="/assets/decor/divider-flow-v.svg" length={38} className="hidden sm:flex" />
        <p className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-[32px] leading-[1.2] font-medium text-ink-900 tabular-nums">{behaviorFlow.visitors}</span>
          <span className="text-[14px] text-ink-500">Users visited this month</span>
        </p>
      </div>

      <div className="thin-scroll mt-12 ml-[31px] overflow-x-auto pb-[15px]" tabIndex={0} aria-label="Behavior flow diagram, scroll horizontally">
        <div className="relative -ml-[31px]" style={{ width: FLOW_WIDTH }}>
          <div className="relative h-[17px]">
            {COLUMN_X.map((x) => (
              <span key={x} className="absolute top-0 text-[14px] text-ink-500" style={{ left: x }}>
                PAGE
              </span>
            ))}
          </div>
          <img src="/assets/decor/divider-flow-h.svg" alt="" width={901} height={1} className="mt-6 ml-[31px] block h-px w-[901px] max-w-none" />
          <div className="mt-6" role="img" aria-label="Sankey diagram of how visitors move from the homepage to other pages">
            <Sankey
              width={FLOW_WIDTH}
              height={360}
              data={behaviorFlow}
              nodeWidth={123}
              nodePadding={70}
              align="left"
              verticalAlign="top"
              sort={false}
              linkCurvature={0.5}
              margin={{ top: 46, right: 31, bottom: 4, left: 31 }}
              node={FlowNodeShape as never}
              link={FlowLinkShape as never}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------------- Sign-up funnel */

const FUNNEL_MAX = 117.3 // headroom so the first step fills 196 of the 230px plot, as drawn
const funnelData = signupFunnel.map((s) => ({ ...s, pad: (FUNNEL_MAX - s.value) / 2 }))

function FunnelStep(props: BarShapeProps & { index?: number }) {
  const x = Number(props.x)
  const y = Number(props.y)
  const width = Number(props.width)
  const height = Number(props.height)
  const index = Number(props.index ?? 0)
  const step = funnelData[index]
  const cy = y + height / 2

  let connector = null
  if (index === 0) {
    // One hatched ribbon from the first step's right edge to the last step's right edge, drawn behind steps 2–4.
    const pitch = width + 1
    const last = funnelData[funnelData.length - 1]
    const lastH = (height * last.value) / step.value
    const x0 = x + width
    const xL = x + pitch * (funnelData.length - 1) + width
    const L = xL - x0
    const top0 = y
    const bot0 = y + height
    const topL = cy - lastH / 2
    const botL = cy + lastH / 2
    const dT = topL - top0
    const dB = bot0 - botL
    const d = [
      `M${x0},${top0}`,
      `C${x0 + 0.329 * L},${top0 + 0.631 * dT} ${x0 + 0.435 * L},${top0 + 0.644 * dT} ${xL},${topL}`,
      `L${xL},${botL}`,
      `C${x0 + 0.379 * L},${botL + 0.309 * dB} ${x0 + 0.077 * L},${botL + 0.729 * dB} ${x0},${bot0}`,
      'Z',
    ].join(' ')
    connector = (
      <>
        <path d={d} fill="#defff1" />
        <path d={d} fill="url(#funnel-hatch)" />
      </>
    )
  }

  return (
    <g>
      {connector}
      <rect x={x} y={y} width={width} height={height} rx={8} fill={step.color} />
      <text x={x + width / 2} y={cy} textAnchor="middle" dominantBaseline="central" fill={step.ink} fontSize={14} fontWeight={500}>
        {step.value}%
      </text>
    </g>
  )
}

export function SignupFunnelCard() {
  return (
    <Card label="Sign-up funnels" className="pt-[31px] pb-[27px]">
      <div className="flex items-start justify-between gap-4 px-[31px]">
        <CardTitle className="text-ink-900">SIGN-UP FUNNELS</CardTitle>
        <ArrowButton label="Open sign-up funnels report" />
      </div>

      <div className="px-[31px]">
        <div className="relative mt-[19px]">
          {/* Column guides: the design's dashed rule, rotated. */}
          {[0, 25, 50, 75, 100].map((p) => (
            <span key={p} aria-hidden className="absolute top-0 flex h-[230px] w-0 items-center justify-center sm:h-[320px]" style={{ left: `${p}%` }}>
              <img src="/assets/decor/divider-funnel-dashed.svg" alt="" width={320} height={1} className="block h-px w-[230px] max-w-none -rotate-90 sm:w-[320px]" />
            </span>
          ))}

          <div className="relative h-[230px]" role="img" aria-label="Funnel: 100% sessions, 66% works page, 32% button, 18% form submitted">
            <svg width="0" height="0" className="absolute">
              <defs>
                <pattern id="funnel-hatch" width="5" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-34.2)">
                  <rect x="0" y="0" width="0.6" height="10" fill="#03ffa1" fillOpacity={0.2} />
                </pattern>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={1}>
                <XAxis dataKey="step" hide />
                <YAxis hide domain={[0, FUNNEL_MAX]} />
                <Bar dataKey="pad" stackId="f" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="value" stackId="f" shape={FunnelStep} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ol className="relative mt-[27px] grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-0">
            {signupFunnel.map((s) => (
              <li key={s.step} className="flex items-end justify-between gap-2 px-2 sm:px-4">
                <div className="flex flex-col gap-2">
                  <p className="text-[32px] leading-[1.2] font-medium text-ink-900 tabular-nums">{s.count}</p>
                  <p className="text-[14px] leading-[1.2] text-ink-500 sm:leading-normal">{s.step}</p>
                </div>
                <ArrowButton label={`Open ${s.step.toLowerCase()}`} className="mb-0.5" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  )
}
