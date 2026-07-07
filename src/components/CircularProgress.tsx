import { useEffect, useRef, useState } from 'react'
import { fmtTime } from '../lib/format'

interface Props {
  progress: number // 0..1
  remaining: number // seconds
  modeLabel: string
  running: boolean
  editable?: boolean
  editing?: boolean
  onRequestEdit?: () => void
  onCommitTime?: (minutes: number) => void
  onCancelEdit?: () => void
}

export default function CircularProgress({ progress, remaining, modeLabel, running, editable, editing, onRequestEdit, onCommitTime, onCancelEdit }: Props) {
  const size = 300
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.max(0, Math.min(1, progress)))
  const [draft, setDraft] = useState(String(Math.max(1, Math.ceil(remaining / 60))))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(String(Math.max(1, Math.ceil(remaining / 60))))
      const t = setTimeout(() => inputRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps

  const commit = () => {
    const m = Math.max(1, Math.min(180, Math.round(Number(draft) || 1)))
    onCommitTime?.(m)
  }

  return (
    <div className={`ring ${running ? 'running' : ''}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="ring-svg">
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
        {editing ? (
          <div className="ring-edit">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              min={1}
              max={180}
              aria-label="自定义时长（分钟）"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') onCancelEdit?.()
              }}
              onBlur={commit}
            />
            <span className="ring-edit-unit">分钟</span>
          </div>
        ) : editable && !running ? (
          <button type="button" className="ring-time editable" onClick={onRequestEdit} title="点击修改时长">
            {fmtTime(remaining)}
          </button>
        ) : (
          <div className="ring-time">{fmtTime(remaining)}</div>
        )}
        <div className="ring-label">{modeLabel}{running ? '' : ' · 已暂停'}</div>
      </div>
    </div>
  )
}
