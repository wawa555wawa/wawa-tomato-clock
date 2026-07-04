import { MODES, MODE_ORDER, type Mode } from '../types'

interface Props {
  mode: Mode
  onSwitch: (m: Mode) => void
  completed: number
  longEvery: number
}

export default function ModeTabs({ mode, onSwitch, completed, longEvery }: Props) {
  return (
    <div className="mode-tabs" role="tablist">
      {MODE_ORDER.map((k) => {
        const cfg = MODES[k]
        const active = mode === k
        const showDots = k === 'long'
        return (
          <button
            key={k}
            role="tab"
            aria-selected={active}
            className={`mode-tab ${active ? 'active' : ''}`}
            onClick={() => onSwitch(k)}
          >
            <span className="mode-tab-label">{cfg.label}</span>
            {showDots && longEvery > 0 && (
              <span className="mode-progress" aria-hidden>
                {Array.from({ length: longEvery }, (_, i) => (
                  <span key={i} className={`dot ${i < completed % longEvery ? 'on' : ''}`} />
                ))}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
