import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from 'recharts'
import MycéliumCalc from './MycéliumCalc'
import SèveCalc from './SèveCalc'
import './AssetCard.css'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  if (val == null) return null
  return <div className="chart-tooltip">{val}</div>
}

// Convert hex color to rgba for gradient
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function AssetCard({ asset, currentRound, totalRounds, onUpdatePrice }) {
  const { id, name, symbol, emoji, color, priceHistory } = asset

  const currentPrice = priceHistory[currentRound - 1] ?? 0
  const prevPrice = currentRound > 1 ? (priceHistory[currentRound - 2] ?? 0) : null

  const absoluteChange = prevPrice !== null ? currentPrice - prevPrice : 0
  const percentChange =
    prevPrice !== null && prevPrice !== 0
      ? ((currentPrice - prevPrice) / prevPrice) * 100
      : 0

  const overallChange = currentPrice - (priceHistory[0] ?? 0)
  const changeClass = absoluteChange > 0 ? 'positive' : absoluteChange < 0 ? 'negative' : 'neutral'
  const trendColor = absoluteChange > 0
    ? '#32d74b'
    : absoluteChange < 0
    ? '#ff453a'
    : '#636366'

  const chartData = useMemo(() =>
    priceHistory.slice(0, currentRound).map((price, i) => ({
      round: i + 1,
      price: price ?? 0,
    })),
    [priceHistory, currentRound]
  )

  const hasChart = chartData.length >= 2

  const gradientId = `grad-${id}`

  return (
    <div
      className="asset-card"
      style={{
        '--asset-color': color,
        '--icon-bg': hexToRgba(color, 0.15),
      }}
    >
      {/* Top row */}
      <div className="card-top">
        <div className="card-identity">
          <div className="card-icon">
            {emoji}
          </div>
          <div>
            <div className="card-name">{name}</div>
            <div className="card-symbol">{symbol}</div>
          </div>
        </div>

        <div className="card-price-block">
          <div className="card-price">
            {currentPrice}
            <span className="card-price-unit">pts</span>
          </div>
          <div className={`card-change ${changeClass}`}>
            <span className="change-abs">
              {absoluteChange >= 0 ? '+' : ''}{absoluteChange}
            </span>
            <span
              className="change-badge"
              style={{ backgroundColor: trendColor }}
            >
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </span>
          </div>
          {currentRound > 1 && (
            <div
              className="card-overall"
              style={{ color: overallChange >= 0 ? '#32d74b' : '#ff453a' }}
            >
              {overallChange >= 0 ? '▲' : '▼'} {Math.abs(overallChange)} vs T1
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="card-chart">
        {hasChart ? (
          <ResponsiveContainer width="100%" height={72}>
            <AreaChart data={chartData} margin={{ top: 4, right: 2, left: 2, bottom: 4 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={trendColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={trendColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="price"
                stroke={trendColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: trendColor, strokeWidth: 0 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-placeholder">
            <span className="chart-placeholder-price" style={{ color }}>
              {currentPrice}
            </span>
            <span className="chart-placeholder-hint">Graphique dès le tour 2</span>
          </div>
        )}
      </div>

      {/* Round dots */}
      <div className="card-rounds">
        {Array.from({ length: totalRounds }, (_, i) => {
          const r = i + 1
          const isCurrent = r === currentRound
          const isFilled = priceHistory[i] !== null
          return (
            <div
              key={r}
              className={`round-dot ${isCurrent ? 'current' : ''} ${isFilled ? 'filled' : ''}`}
              style={isCurrent ? { background: color } : {}}
              title={`Tour ${r}: ${priceHistory[i] ?? '—'}`}
            >
              <span className="round-dot-label">{r}</span>
            </div>
          )
        })}
      </div>

      {/* Price controls */}
      <div className="card-controls">
        {id === 'mycelium' ? (
          <MycéliumCalc
            currentPrice={currentPrice}
            color={color}
            onApply={(delta) => onUpdatePrice(id, delta)}
          />
        ) : (id === 'tree1' || id === 'tree2') ? (
          <SèveCalc
            color={color}
            onApply={(delta) => onUpdatePrice(id, delta)}
          />
        ) : (
          <div className="controls-row">
            <button className="ctrl-btn ctrl-minus2" onClick={() => onUpdatePrice(id, -2)} aria-label="−2">−2</button>
            <button className="ctrl-btn ctrl-minus1" onClick={() => onUpdatePrice(id, -1)} aria-label="−1">−1</button>
            <div className="ctrl-price-display" style={{ color }}>{currentPrice}</div>
            <button className="ctrl-btn ctrl-plus1"  onClick={() => onUpdatePrice(id, +1)} aria-label="+1">+1</button>
            <button className="ctrl-btn ctrl-plus2"  onClick={() => onUpdatePrice(id, +2)} aria-label="+2">+2</button>
          </div>
        )}
      </div>
    </div>
  )
}
