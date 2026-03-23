import { useState, useEffect, useRef, useCallback } from 'react'
import './Timer.css'

const DURATION = 5 * 60 // 5 minutes in seconds

export default function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(DURATION)
  const [status, setStatus] = useState('idle') // 'idle' | 'running' | 'paused' | 'done'
  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (status === 'idle' || status === 'paused') {
      setStatus('running')
    }
  }, [status])

  const pause = useCallback(() => {
    if (status === 'running') {
      clearTimer()
      setStatus('paused')
    }
  }, [status, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setSecondsLeft(DURATION)
    setStatus('idle')
  }, [clearTimer])

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            setStatus('done')
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
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progress = 1 - secondsLeft / DURATION
  const circumference = 2 * Math.PI * 20 // r=20
  const strokeDashoffset = circumference * (1 - progress)

  const isDone = status === 'done'
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isIdle = status === 'idle'

  const timerColor = isDone
    ? '#ff453a'
    : secondsLeft < 60
    ? '#ff9f0a'
    : '#30d158'

  return (
    <div className={`timer-container ${isDone ? 'done' : ''}`}>
      <div className="timer-ring" title={`Phase de commercialisation — ${timeString}`}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          {/* Track */}
          <circle
            cx="26"
            cy="26"
            r="20"
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth="3"
          />
          {/* Progress */}
          <circle
            cx="26"
            cy="26"
            r="20"
            fill="none"
            stroke={timerColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 26 26)"
            style={{ transition: 'stroke-dashoffset 0.5s linear, stroke 0.3s ease' }}
          />
        </svg>
        <div className="timer-inner">
          <span className="timer-display" style={{ color: timerColor }}>
            {isDone ? '✓' : timeString}
          </span>
        </div>
      </div>

      <div className="timer-info">
        <div className="timer-label">
          {isDone ? 'Temps écoulé !' : 'Commercialisation'}
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
            <button className="timer-btn timer-btn-reset" onClick={reset}>
              ↺
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
