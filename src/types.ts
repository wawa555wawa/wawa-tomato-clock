export type Mode = 'focus' | 'short' | 'long'

export interface ModeConfig {
  key: Mode
  label: string
  short: string
  defaultMinutes: number
  color: string
  accent: string
}

export interface Settings {
  focus: number // minutes
  short: number
  long: number
  longEvery: number // 每完成几个专注触发一次长休
  autoStart: boolean // 当前阶段结束自动开始下一阶段
  sound: boolean
  notify: boolean
  volume: number // 0..1
}

export interface SessionRecord {
  startedAt: number // epoch ms
  endedAt: number
  mode: Mode
  minutes: number // 实际计入的分钟数（按完成度）
  completed: boolean
}

export const MODES: Record<Mode, ModeConfig> = {
  focus: { key: 'focus', label: '专注', short: 'FOCUS', defaultMinutes: 25, color: '#e84a3f', accent: '#ff6b5e' },
  short: { key: 'short', label: '短休', short: 'BREAK', defaultMinutes: 5, color: '#2fae6b', accent: '#4fd18f' },
  long:  { key: 'long',  label: '长休', short: 'REST ',  defaultMinutes: 15, color: '#3f7ad6', accent: '#6fa8ff' }
}

export const MODE_ORDER: Mode[] = ['focus', 'short', 'long']

export const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  autoStart: true,
  sound: true,
  notify: true,
  volume: 0.6
}
