import './RoundControls.css'

export default function RoundControls({ currentRound, totalRounds, onRoundChange, onReset }) {
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
      <button className="reset-btn" onClick={onReset} title="Réinitialiser la partie">
        ↺ Reset
      </button>
    </div>
  )
}
