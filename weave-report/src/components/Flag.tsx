import type { CSSProperties } from 'react'

type Code = 'id' | 'fr' | 'es' | 'it' | 'be'

// Per-flag geometry copied from the Figma layers (clip insets, mask sizes, shine offsets).
const geometry: Record<
  Code,
  { clip: string; maskSize: string; maskPos?: string; baseInset?: string; overlay: string; frame: string; shine: [string, string] }
> = {
  id: { clip: '0.92% 0 0.92% 0.62%', maskSize: '39.435px 26.502px', overlay: '0.92% 0.79% 0.92% 0.62%', frame: '0 0.18% -0.13% 0', shine: ['-5.753px 10.249px', '-11.753px 7.249px'] },
  fr: { clip: '0.92% 0.62% 1.02% 0.62%', maskSize: '39.505px 26.502px', baseInset: '-0.21% -0.14%', overlay: '0.92% 0.62%', frame: '0 -0.02% 0 0', shine: ['-5.752px 10.249px', '-11.752px 7.249px'] },
  es: { clip: '0', maskSize: '39.236px 26.484px', maskPos: '0.378px 0.258px', baseInset: '0 -44.58% 0 0', overlay: '0.96% 0.97% 0.96% 0.94%', frame: '0.03% 0.35% 0 0.35%', shine: ['-5.622px 10.258px', '-11.622px 7.258px'] },
  it: { clip: '0.92% 0.62%', maskSize: '39.505px 26.502px', overlay: '0.92% 0.62%', frame: '0 -0.02% 0 0', shine: ['-5.752px 10.249px', '-11.752px 7.249px'] },
  be: { clip: '0.92% 0.62%', maskSize: '39.505px 26.502px', maskPos: '0px -0.009px', overlay: '0.92% 0.62%', frame: '0', shine: ['-5.752px 10.249px', '-11.752px 7.249px'] },
}

const shineBoxes = ['-37.04% -11.09% -55.33% 15%', '-25.93% -26.09% -66.44% 30%']

export function Flag({ code }: { code: Code }) {
  const g = geometry[code]
  const base = `/assets/flags/${code}`
  const mask = (url: string, size: string, pos = '0 0'): CSSProperties => ({
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: size,
    WebkitMaskSize: size,
    maskPosition: pos,
    WebkitMaskPosition: pos,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskMode: 'alpha',
  })

  return (
    <span aria-hidden className="relative block h-[27px] w-10 shrink-0 overflow-hidden">
      <span className="absolute" style={{ inset: g.clip, ...mask(`${base}-mask.svg`, g.maskSize, g.maskPos) }}>
        <span className="absolute" style={{ inset: g.baseInset ?? 0 }}>
          <img src={`${base}-base.svg`} alt="" className="absolute inset-0 block size-full max-w-none" />
        </span>
      </span>
      <span className="absolute mix-blend-overlay" style={{ inset: g.overlay }}>
        <img src={`${base}-overlay.svg`} alt="" className="absolute inset-0 block size-full max-w-none" />
      </span>
      {shineBoxes.map((box, i) => (
        <span key={box} className="absolute flex items-center justify-center [container-type:size]" style={{ inset: box }}>
          <span
            className="block flex-none rotate-[29.66deg]"
            style={{
              width: 'hypot(34.0988cqw, 14.3713cqh)',
              height: 'hypot(-65.9012cqw, 85.6287cqh)',
              backgroundImage: 'linear-gradient(89.36deg, rgb(255,255,255) 0.22%, rgba(255,255,255,0) 91.98%)',
              ...mask(`${base}-shine-mask.svg`, g.maskSize, g.shine[i]),
            }}
          />
        </span>
      ))}
      <span className="absolute" style={{ inset: g.frame }}>
        <img src={`${base}-frame.svg`} alt="" className="absolute inset-0 block size-full max-w-none" />
      </span>
    </span>
  )
}
