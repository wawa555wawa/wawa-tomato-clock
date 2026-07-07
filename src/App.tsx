import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MODES, DEFAULT_SETTINGS, type Mode, type Settings, type SessionRecord } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { fmtTime, todayKey } from './lib/format'
import { playChime, unlockAudio } from './lib/sound'
import { requestNotifyPermission, sendNotification } from './lib/notify'
import CircularProgress from './components/CircularProgress'
import ModeTabs from './components/ModeTabs'
import Controls from './components/Controls'
import SettingsModal from './components/SettingsModal'
import StatsModal from './components/StatsModal'
import IconBtn from './components/IconBtn'

const NEXT_LABEL: Record<Mode, string> = { focus: '专注', short: '短休', long: '长休' }

export default function App() {
  const [settings, setSettings] = useLocalStorage<Settings>('wawa.settings', DEFAULT_SETTINGS)
  const [history, setHistory] = useLocalStorage<SessionRecord[]>('wawa.history', [])
  const [mode, setMode] = useState<Mode>('focus')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(() => 25 * 60)
  const [completedFocus, setCompletedFocus] = useLocalStorage<number>('wawa.completedFocus', 0)
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [confirming, setConfirming] = useState<Mode | null>(null)
  const [editingTime, setEditingTime] = useState(false)
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>(
    'wawa.theme',
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  )
  const endAtRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)

  const totalSeconds = useMemo(() => settings[mode] * 60, [settings, mode])
  const progress = useMemo(() => 1 - remaining / totalSeconds, [remaining, totalSeconds])
  const modeCfg = MODES[mode]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!running) setRemaining(settings[mode] * 60)
  }, [mode, settings, running])

  const handleComplete = useCallback(() => {
    const endedAt = Date.now()
    const startedAt = endedAt - settings[mode] * 60 * 1000
    setHistory((h) => [...h, { startedAt, endedAt, mode, minutes: settings[mode], completed: true }])
    if (settings.sound) {
      const kind = mode === 'focus' ? 'focus' : mode === 'short' ? 'break' : 'long'
      playChime(kind as 'focus' | 'break' | 'long', settings.volume)
    }
    let nextFocused = completedFocus
    let nextMode: Mode
    if (mode === 'focus') {
      nextFocused = completedFocus + 1
      setCompletedFocus(nextFocused)
      nextMode = nextFocused % settings.longEvery === 0 ? 'long' : 'short'
    } else {
      nextMode = 'focus'
    }
    if (settings.notify) {
      sendNotification(`${modeCfg.label}结束`, `接下来：${NEXT_LABEL[nextMode]}`)
    }
    setMode(nextMode)
    setRemaining(settings[nextMode] * 60)
    if (settings.autoStart) window.setTimeout(() => setRunning(true), 350)
  }, [mode, settings, modeCfg, completedFocus, setHistory, setCompletedFocus])

  const tick = useCallback(() => {
    const remain = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
    setRemaining(remain)
    if (remain <= 0) {
      setRunning(false)
      handleComplete()
    }
  }, [handleComplete])

  useEffect(() => {
    if (!running) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      return
    }
    endAtRef.current = Date.now() + remaining * 1000
    timerRef.current = window.setInterval(tick, 250)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [running, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  const startTimer = useCallback(() => {
    unlockAudio()
    if (Notification.permission === 'default') requestNotifyPermission()
    setRunning(true)
  }, [])

  const pauseTimer = useCallback(() => setRunning(false), [])
  const resetTimer = useCallback(() => {
    setRunning(false)
    setRemaining(settings[mode] * 60)
  }, [settings, mode])
  const skip = useCallback(() => {
    setRunning(false)
    handleComplete()
  }, [handleComplete])

  const commitTime = useCallback((minutes: number) => {
    setSettings((s) => ({ ...s, [mode]: minutes }))
    setRemaining(minutes * 60)
    setEditingTime(false)
  }, [mode, setSettings])

  const switchMode = useCallback((m: Mode) => {
    if (running) {
      setConfirming(m)
      return
    }
    setMode(m)
    setRemaining(settings[m] * 60)
  }, [running, settings])

  const confirmSwitch = useCallback(() => {
    const m = confirming
    if (!m) return
    setRunning(false)
    setMode(m)
    setRemaining(settings[m] * 60)
    setConfirming(null)
  }, [confirming, settings])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showSettings || showStats) return
      if (e.code === 'Space') {
        e.preventDefault()
        setRunning((r) => {
          if (!r) unlockAudio()
          return !r
        })
      } else if (e.key === 'r' || e.key === 'R') resetTimer()
      else if (e.key === '1') switchMode('focus')
      else if (e.key === '2') switchMode('short')
      else if (e.key === '3') switchMode('long')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resetTimer, switchMode, showSettings, showStats])

  useEffect(() => {
    document.title = running ? `${fmtTime(remaining)} · ${modeCfg.label} · Wawa 番茄钟` : 'Wawa 番茄钟'
  }, [remaining, running, modeCfg])

  const todayStats = useMemo(() => {
    const key = todayKey()
    const todays = history.filter((r) => todayKey(new Date(r.endedAt)) === key && r.mode === 'focus')
    return { count: todays.length, minutes: todays.reduce((s, r) => s + r.minutes, 0) }
  }, [history])

  return (
    <div className="app" style={{ ['--mode-color' as any]: modeCfg.color, ['--mode-accent' as any]: modeCfg.accent }}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-text">Wawa · 番茄钟</span>
        </div>
        <div className="topbar-actions">
          <IconBtn icon={theme === 'light' ? 'moon' : 'sun'} label={theme === 'light' ? '切换深色' : '切换浅色'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <IconBtn icon="stats" label="统计" onClick={() => setShowStats(true)} />
          <IconBtn icon="gear" label="设置" onClick={() => setShowSettings(true)} />
        </div>
      </header>

      <main className="stage">
        <ModeTabs mode={mode} onSwitch={switchMode} completed={completedFocus} longEvery={settings.longEvery} />
        <CircularProgress
          progress={progress}
          remaining={remaining}
          modeLabel={modeCfg.label}
          running={running}
          editable
          editing={editingTime}
          onRequestEdit={() => setEditingTime(true)}
          onCommitTime={commitTime}
          onCancelEdit={() => setEditingTime(false)}
        />
        <Controls running={running} onStart={startTimer} onPause={pauseTimer} onReset={resetTimer} onSkip={skip} />
        <div className="today-strip">
          <span className="today-tomatoes" aria-hidden>
            {'🍅'.repeat(Math.min(todayStats.count, 8))}{todayStats.count > 8 ? ` ×${todayStats.count}` : ''}
          </span>
          <span className="today-text">今日 {todayStats.count} 个番茄 · {todayStats.minutes} 分钟</span>
        </div>
      </main>
      {showSettings && <SettingsModal settings={settings} onChange={setSettings} onClose={() => setShowSettings(false)} />}
      {showStats && <StatsModal history={history} onClose={() => setShowStats(false)} />}
      {confirming && (
        <div className="modal-backdrop" onClick={() => setConfirming(null)}>
          <div className="modal confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>正在计时中</h3>
            <p>切换到「{MODES[confirming].label}」会放弃当前计时，确定吗？</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setConfirming(null)}>取消</button>
              <button className="btn primary" onClick={confirmSwitch}>切换</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
