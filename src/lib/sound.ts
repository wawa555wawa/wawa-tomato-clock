// 用 WebAudio 合成铃声，无需任何音频资源文件
let ctx: AudioContext | null = null

function ensureCtx(): AudioContext | null {
  if (ctx) return ctx
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  return ctx
}

// 首次用户交互后解锁音频（移动端 autoplay 策略）
export function unlockAudio() {
  const c = ensureCtx()
  if (c && c.state === 'suspended') c.resume()
}

interface Tone {
  freq: number
  start: number
  dur: number
  type?: OscillatorType
}

function playSequence(tones: Tone[], volume: number) {
  const c = ensureCtx()
  if (!c) return
  const now = c.currentTime
  const master = c.createGain()
  master.gain.value = volume
  master.connect(c.destination)
  for (const t of tones) {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = t.type ?? 'sine'
    osc.frequency.value = t.freq
    const startAt = now + t.start
    g.gain.setValueAtTime(0, startAt)
    g.gain.linearRampToValueAtTime(1, startAt + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, startAt + t.dur)
    osc.connect(g)
    g.connect(master)
    osc.start(startAt)
    osc.stop(startAt + t.dur + 0.02)
  }
}

const CHIMES: Record<string, Tone[]> = {
  focus: [
    { freq: 880, start: 0, dur: 0.25 },
    { freq: 1175, start: 0.18, dur: 0.25 },
    { freq: 1568, start: 0.36, dur: 0.5 }
  ],
  break: [
    { freq: 660, start: 0, dur: 0.3 },
    { freq: 440, start: 0.2, dur: 0.5 }
  ],
  long: [
    { freq: 523, start: 0, dur: 0.3 },
    { freq: 659, start: 0.2, dur: 0.3 },
    { freq: 784, start: 0.4, dur: 0.3 },
    { freq: 1047, start: 0.6, dur: 0.6 }
  ]
}

export function playChime(kind: 'focus' | 'break' | 'long', volume: number) {
  playSequence(CHIMES[kind], volume)
}
