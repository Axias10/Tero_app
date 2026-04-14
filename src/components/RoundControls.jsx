import { useState } from 'react'
import './RoundControls.css'

export default function RoundControls({ currentRound, totalRounds, onRoundChange, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    if (confirmReset) {
      onReset()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
      // Auto-annule après 3s si pas confirmé
      setTimeout(() => setConfirmReset(false), 3000)
    }
  }

  const isLastRound = currentRound === totalRounds

  return (
    <div className="round-controls">
      <div className="round-pills">
        {Array.from({ length: totalRounds }, (_, i) => {
          const r = i + 1
          return (
            <button
              key={r}
              className={`round-pill ${r === currentRound ? 'active' : ''} ${r < currentRound ? 'past' : ''}`}
              onClick={() => onRoundChange(r)}
            >
              T{r}
            </button>
          )
        })}
      </div>

      <div className="round-actions">
        {!isLastRound && (
          <button
            className="next-round-btn"
            onClick={() => onRoundChange(currentRound + 1)}
          >
            T{currentRound + 1} →
          </button>
        )}
        <button
          className={`reset-btn ${confirmReset ? 'confirm' : ''}`}
          onClick={handleReset}
          title={confirmReset ? 'Cliquer encore pour confirmer' : 'Réinitialiser la partie'}
        >
          {confirmReset ? '⚠ Confirmer ?' : '↺ Reset'}
        </button>
      </div>
    </div>
  )
}
