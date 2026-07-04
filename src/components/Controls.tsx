import IconBtn from './IconBtn'

interface Props {
  running: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export default function Controls({ running, onStart, onPause, onReset, onSkip }: Props) {
  return (
    <div className="controls">
      <IconBtn icon="reset" label="重置" onClick={onReset} className="ctrl-side" />
      <button className="ctrl-main" onClick={running ? onPause : onStart} aria-label={running ? '暂停' : '开始'}>
        <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden>
          {running ? (
            <path d="M8 4h3v16H8zM13 4h3v16h-3z" fill="currentColor" />
          ) : (
            <path d="M7 4v16l13-8z" fill="currentColor" />
          )}
        </svg>
        <span>{running ? '暂停' : '开始'}</span>
      </button>
      <IconBtn icon="skip" label="跳过本阶段" onClick={onSkip} className="ctrl-side" />
    </div>
  )
}
