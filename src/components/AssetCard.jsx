import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import './AssetCard.css'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  if (val == null) return null
  return (
    <div className="chart-tooltip">
      <span>{val}</span>
    </div>
  )
}

export default function AssetCard({ asset, currentRound, totalRounds, onUpdatePrice }) {
  const { id, name, symbol, emoji, color, priceHistory } = asset

  const currentPrice = priceHistory[currentRound - 1] ?? 0
  const prevPrice = currentRound > 1 ? (priceHistory[currentRound - 2] ?? 0) : null
  const firstPrice = priceHistory[0] ?? 0

  const absoluteChange = prevPrice !== null ? currentPrice - prevPrice : 0
  const percentChange =
    prevPrice !== null && prevPrice !== 0
      ? ((currentPrice - prevPrice) / prevPrice) * 100
      : 0

  const overallChange = currentPrice - firstPrice
  const isPositive = absoluteChange >= 0
  const trendColor = absoluteChange > 0 ? '#30d158' : absoluteChange < 0 ? '#ff453a' : '#8e8e93'

  // Build chart data — only show rounds up to current
  const chartData = useMemo(() => {
    return priceHistory.slice(0, currentRound).map((price, i) => ({
      round: i + 1,
      price: price ?? 0,
    }))
  }, [priceHistory, currentRound])

  const hasMultiplePoints = chartData.filter((d) => d.price != null).length > 1

  return (
    <div className="asset-card">
      <div className="card-top">
        <div className="card-identity">
          <span className="card-emoji" style={{ color }}>{emoji}</span>
          <div>
            <div className="card-name">{name}</div>
            <div className="card-symbol">{symbol}</div>
          </div>
        </div>

        <div className="card-price-block">
          <div className="card-price">{currentPrice}</div>
          <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-abs">
              {absoluteChange >= 0 ? '+' : ''}{absoluteChange}
            </span>
            <span className="change-badge" style={{ backgroundColor: trendColor }}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </span>
          </div>
          {currentRound > 1 && (
            <div className="card-overall" style={{ color: overallChange >= 0 ? '#30d158' : '#ff453a' }}>
              {overallChange >= 0 ? '▲' : '▼'} {Math.abs(overallChange)} depuis T1
            </div>
          )}
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="card-chart">
        {hasMultiplePoints ? (
          <ResponsiveContainer width="100%" height={70}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={trendColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: trendColor, strokeWidth: 0 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-placeholder">
            <span style={{ color: trendColor, fontSize: 28, fontWeight: 700 }}>{currentPrice}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 2 }}>
              Données dès le tour 2
            </span>
          </div>
        )}
      </div>

      {/* Round dots */}
      <div className="card-rounds">
        {Array.from({ length: totalRounds }, (_, i) => {
          const r = i + 1
          const val = priceHistory[i]
          const isCurrent = r === currentRound
          const isFilled = val !== null
          return (
            <div
              key={r}
              className={`round-dot ${isCurrent ? 'current' : ''} ${isFilled ? 'filled' : ''}`}
              style={isCurrent ? { backgroundColor: color } : {}}
              title={`Tour ${r}: ${val ?? '—'}`}
            >
              <span className="round-dot-label">{r}</span>
            </div>
          )
        })}
      </div>

      {/* Price controls */}
      <div className="card-controls">
        <div className="controls-row">
          <button
            className="ctrl-btn ctrl-minus2"
            onClick={() => onUpdatePrice(id, -2)}
            aria-label="Diminuer de 2"
          >
            −2
          </button>
          <button
            className="ctrl-btn ctrl-minus1"
            onClick={() => onUpdatePrice(id, -1)}
            aria-label="Diminuer de 1"
          >
            −1
          </button>

          <div className="ctrl-price-display" style={{ color }}>
            {currentPrice}
          </div>

          <button
            className="ctrl-btn ctrl-plus1"
            onClick={() => onUpdatePrice(id, +1)}
            aria-label="Augmenter de 1"
          >
            +1
          </button>
          <button
            className="ctrl-btn ctrl-plus2"
            onClick={() => onUpdatePrice(id, +2)}
            aria-label="Augmenter de 2"
          >
            +2
          </button>
        </div>
      </div>
    </div>
  )
}
