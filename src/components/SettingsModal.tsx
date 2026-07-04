import { useState } from 'react'
import { DEFAULT_SETTINGS, type Settings } from '../types'
import IconBtn from './IconBtn'

interface Props {
  settings: Settings
  onChange: (s: Settings) => void
  onClose: () => void
}

const FIELDS: { key: keyof Settings; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: 'focus', label: '专注时长', min: 1, max: 90, step: 1, unit: '分钟' },
  { key: 'short', label: '短休时长', min: 1, max: 30, step: 1, unit: '分钟' },
  { key: 'long', label: '长休时长', min: 1, max: 60, step: 1, unit: '分钟' },
  { key: 'longEvery', label: '长休间隔', min: 2, max: 8, step: 1, unit: '次' },
  { key: 'volume', label: '音量', min: 0, max: 1, step: 0.1, unit: '' }
]

export default function SettingsModal({ settings, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<Settings>(settings)
  const update = (patch: Partial<Settings>) => setDraft((d) => ({ ...d, ...patch }))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal settings-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="设置">
        <header className="modal-head">
          <h2>设置</h2>
          <IconBtn icon="close" label="关闭" onClick={onClose} />
        </header>

        <div className="modal-body">
          {FIELDS.map((f) => (
            <label key={f.key} className="field">
              <span className="field-label">{f.label}</span>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={draft[f.key] as number}
                onChange={(e) => update({ [f.key]: Number(e.target.value) } as any)}
              />
              <span className="field-value">{draft[f.key]}{f.unit}</span>
            </label>
          ))}

          <div className="field toggles">
            <label className="toggle">
              <input type="checkbox" checked={draft.autoStart} onChange={(e) => update({ autoStart: e.target.checked })} />
              <span>自动开始下一阶段</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={draft.sound} onChange={(e) => update({ sound: e.target.checked })} />
              <span>结束铃声</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={draft.notify} onChange={(e) => update({ notify: e.target.checked })} />
              <span>桌面通知</span>
            </label>
          </div>
        </div>

        <footer className="modal-actions">
          <button className="btn ghost" onClick={() => setDraft(DEFAULT_SETTINGS)}>恢复默认</button>
          <button className="btn primary" onClick={() => { onChange(draft); onClose() }}>保存</button>
        </footer>
      </div>
    </div>
  )
}
