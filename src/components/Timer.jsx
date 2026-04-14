import { useState, useEffect, useRef, useCallback } from 'react'
import './Timer.css'

const DURATION = 5 * 60

export default function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(DURATION)
  const [status, setStatus] = useState('idle') // idle | running | paused | done
  const [showAlert, setShowAlert] = useState(false)
  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (status === 'idle' || status === 'paused') setStatus('running')
  }, [status])

  const pause = useCallback(() => {
    if (status === 'running') { clearTimer(); setStatus('paused') }
  }, [status, clearTimer])

  const reset = useCallback(() => {
    clearTimer(); setSecondsLeft(DURATION); setStatus('idle'); setShowAlert(false)
  }, [clearTimer])

  const dismissAlert = useCallback(() => setShowAlert(false), [])

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            setStatus('done')
            setShowAlert(true)
            // Vibration bonus (Android + some iOS)
            if (navigator.vibrate) navigator.vibrate([400, 100, 400, 100, 600])
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return clearTimer
  }, [status, clearTimer])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progress = 1 - secondsLeft / DURATION
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - progress)

  const isDone    = status === 'done'
  const isRunning = status === 'running'
  const isPaused  = status === 'paused'
  const isIdle    = status === 'idle'
  const isWarning = secondsLeft < 60 && !isDone

  const ringColor = isDone ? '#ff453a' : isWarning ? '#ff9f0a' : '#32d74b'

  return (
    <>
      {/* ── Fullscreen alert overlay ── */}
      {showAlert && (
        <div className="timer-alert-overlay" onClick={dismissAlert}>
          <div className="timer-alert-box" onClick={e => e.stopPropagation()}>
            <div className="timer-alert-icon">⏱</div>
            <div className="timer-alert-title">Temps écoulé !</div>
            <div className="timer-alert-sub">La phase de commercialisation est terminée.</div>
            <button className="timer-alert-btn" onClick={dismissAlert}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ── Widget ── */}
      <div className={`timer-widget ${isRunning ? 'running' : ''} ${isDone ? 'done' : ''}`}>
        <div className="timer-ring">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 24 24)"
              style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.4s ease' }}
            />
          </svg>
          <div className="timer-inner">
            {isDone
              ? <span className="timer-display timer-display-done" style={{ color: ringColor }}>✓</span>
              : <span className="timer-display" style={{ color: ringColor }}>{timeStr}</span>
            }
          </div>
        </div>

        <div className="timer-info">
          <div className="timer-label">
            {isDone ? 'Temps écoulé !' : isRunning ? 'Phase de comm. en cours' : 'Commercialisation'}
          </div>
          <div className="timer-buttons">
            {(isIdle || isPaused) && !isDone && (
              <button className="timer-btn timer-btn-start" onClick={start}>
                {isPaused ? '▶ Reprendre' : '▶ Démarrer'}
              </button>
            )}
            {isRunning && (
              <button className="timer-btn timer-btn-pause" onClick={pause}>
                ⏸ Pause
              </button>
            )}
            {!isIdle && (
              <button className="timer-btn timer-btn-reset" onClick={reset} title="Réinitialiser">↺</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
