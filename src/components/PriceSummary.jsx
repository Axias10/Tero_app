import './PriceSummary.css'

export default function PriceSummary({ assets, currentRound }) {
  return (
    <div className="price-summary">
      <div className="summary-label">Tour {currentRound} — Prix actuels</div>
      <div className="summary-table">
        {assets.map((asset) => {
          const current = asset.priceHistory[currentRound - 1] ?? 0
          const prev    = currentRound > 1 ? (asset.priceHistory[currentRound - 2] ?? 0) : null
          const delta   = prev !== null ? current - prev : 0
          const isUp    = delta > 0
          const isDown  = delta < 0

          return (
            <div key={asset.id} className="summary-row">
              <div className="summary-left">
                <span className="summary-emoji">{asset.emoji}</span>
                <span className="summary-name">{asset.name}</span>
              </div>
              <div className="summary-right">
                <span
                  className="summary-delta"
                  style={{ color: isUp ? '#32d74b' : isDown ? '#ff453a' : '#636366' }}
                >
                  {delta > 0 ? `+${delta}` : delta < 0 ? delta : '—'}
                </span>
                <span
                  className="summary-price"
                  style={{ color: asset.color }}
                >
                  {current}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
