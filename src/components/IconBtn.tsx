interface Props {
  icon: 'gear' | 'stats' | 'close' | 'reset' | 'play' | 'pause' | 'skip' | 'sun' | 'moon'
  label: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

const PATHS: Record<Props['icon'], string> = {
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-3.5a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.1-1.2L14.6 3h-4l-.3 2.6a7.6 7.6 0 0 0-2.1 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1c.63.48 1.34.88 2.1 1.2l.3 2.6h4l.3-2.6a7.6 7.6 0 0 0 2.1-1.2l2.4 1 2-3.4-2-1.6c.07-.4.1-.8.1-1.2Z',
  stats: 'M4 20V10M10 20V4M16 20v-6M22 14v6',
  close: 'M6 6l12 12M18 6L6 18',
  reset: 'M3 12a9 9 0 1 0 3-6.7M3 4v4h4',
  sun: 'M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  play: 'M7 4v16l13-8z',
  pause: 'M8 4h3v16H8zM13 4h3v16h-3z',
  skip: 'M5 4l10 8-10 8zM17 5h2v14h-2z'
}

export default function IconBtn({ icon, label, onClick, className, disabled, type }: Props) {
  return (
    <button
      type={type ?? 'button'}
      className={`icon-btn ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        {(['reset', 'stats', 'sun', 'moon'] as readonly Props['icon'][]).includes(icon) ? (
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={PATHS[icon]} />
            {icon === 'sun' && <circle cx="12" cy="12" r="4" />}
          </g>
        ) : (
          <path d={PATHS[icon]} fill="currentColor" />
        )
        }
      </svg>
    </button>
  )
}
