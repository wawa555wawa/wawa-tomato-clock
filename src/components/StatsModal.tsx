import { useMemo } from 'react'
import { type SessionRecord } from '../types'
import { todayKey } from '../lib/format'
import IconBtn from './IconBtn'

interface Props {
  history: SessionRecord[]
  onClose: () => void
}

export default function StatsModal({ history, onClose }: Props) {
  const focusOnly = useMemo(() => history.filter((r) => r.mode === 'focus'), [history])

  const today = useMemo(() => {
    const k = todayKey()
    const t = focusOnly.filter((r) => todayKey(new Date(r.endedAt)) === k)
    return { count: t.length, minutes: t.reduce((s, r) => s + r.minutes, 0) }
  }, [focusOnly])

  const total = useMemo(
    () => ({ count: focusOnly.length, minutes: focusOnly.reduce((s, r) => s + r.minutes, 0) }),
    [focusOnly]
  )

  const days = useMemo(() => {
    const arr: { key: string; label: string; count: number; minutes: number }[] = []
    const names = ['日', '一', '二', '三', '四', '五', '六']
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const k = todayKey(d)
      const ts = focusOnly.filter((r) => todayKey(new Date(r.endedAt)) === k)
      arr.push({ key: k, label: names[d.getDay()], count: ts.length, minutes: ts.reduce((s, r) => s + r.minutes, 0) })
    }
    return arr
  }, [focusOnly])

  const maxCount = Math.max(1, ...days.map((d) => d.count))

  const clearHistory = () => {
    if (confirm('确定清空所有历史记录吗？此操作不可撤销。')) {
      localStorage.setItem('wawa.history', '[]')
      localStorage.setItem('wawa.completedFocus', '0')
      location.reload()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal stats-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="统计">
        <header className="modal-head">
          <h2>统计数据</h2>
          <IconBtn icon="close" label="关闭" onClick={onClose} />
        </header>

        <div className="modal-body">
          <div className="stats-totals">
            <div className="stat-card">
              <span className="stat-num">{today.count}</span>
              <span className="stat-cap">今日番茄</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{today.minutes}</span>
              <span className="stat-cap">今日分钟</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{total.count}</span>
              <span className="stat-cap">累计番茄</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{total.minutes}</span>
              <span className="stat-cap">累计分钟</span>
            </div>
          </div>

          <h3 className="stats-sub">近 7 天</h3>
          <div className="bars">
            {days.map((d) => (
              <div className="bar-col" key={d.key}>
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${(d.count / maxCount) * 100}%` }} title={`${d.count} 个`} />
                </div>
                <span className="bar-label">{d.label}</span>
                <span className="bar-val">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="modal-actions">
          <button className="btn ghost danger" onClick={clearHistory}>清空历史</button>
          <button className="btn primary" onClick={onClose}>完成</button>
        </footer>
      </div>
    </div>
  )
}
