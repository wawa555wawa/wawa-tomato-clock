import { fmtTime } from '../lib/format'

interface Props {
  progress: number // 0..1
  remaining: number // seconds
  modeLabel: string
  running: boolean
}

export default function CircularProgress({ progress, remaining, modeLabel, running }: Props) {
  const size = 300
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.max(0, Math.min(1, progress)))
  return (
    <div className={`ring ${running ? 'running' : ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring-svg">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ring-track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="ring-fill"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
      <div className="ring-center">
        <div className="ring-time">{fmtTime(remaining)}</div>
        <div className="ring-label">{modeLabel}{running ? '' : ' · 已暂停'}</div>
      </div>
    </div>
  )
}
