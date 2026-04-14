import { useState } from 'react'
import './MycéliumCalc.css'

export default function MycéliumCalc({ currentPrice, color, onApply }) {
  const [petrifeuilles, setPetrifeuilles] = useState('')
  const [myceliumsProd, setMyceliumsProd] = useState('')

  const petrNum  = parseInt(petrifeuilles) || 0
  const mycNum   = parseInt(myceliumsProd)  || 0
  // 5 Pétrifeuilles = 1 équivalent-Mycélium (arrondi à l'entier inférieur)
  const equiv    = Math.floor(petrNum / 5)

  const hasValues = petrifeuilles !== '' || myceliumsProd !== ''

  // delta proportionnel : équivalents - production
  const delta = hasValues ? equiv - mycNum : 0

  let resultLabel = '— stable'
  let resultColor = '#636366'

  if (hasValues) {
    if (delta > 0) {
      resultLabel = `↑ +${delta} pt${delta > 1 ? 's' : ''}`
      resultColor = '#32d74b'
    } else if (delta < 0) {
      resultLabel = `↓ ${delta} pt${Math.abs(delta) > 1 ? 's' : ''}`
      resultColor = '#ff453a'
    } else {
      resultLabel = '= stable'
      resultColor = '#636366'
    }
  }

  const apply = () => {
    if (!hasValues) return
    onApply(delta)
    setPetrifeuilles('')
    setMyceliumsProd('')
  }

  return (
    <div className="myc-calc">
      <div className="myc-calc-title">
        <span className="myc-calc-icon">⚖️</span>
        Calculateur Mycélium
      </div>

      <div className="myc-inputs">
        <div className="myc-input-group">
          <label className="myc-label">Pétrifeuilles forgées</label>
          <div className="myc-input-row">
            <input
              className="myc-input"
              type="number"
              min="0"
              placeholder="0"
              value={petrifeuilles}
              onChange={e => setPetrifeuilles(e.target.value)}
            />
            <span className="myc-hint">÷ 5 = {petrNum > 0 ? `${equiv} éq.` : '—'}</span>
          </div>
        </div>

        <div className="myc-separator">vs</div>

        <div className="myc-input-group">
          <label className="myc-label">Mycéliums produits</label>
          <input
            className="myc-input"
            type="number"
            min="0"
            placeholder="0"
            value={myceliumsProd}
            onChange={e => setMyceliumsProd(e.target.value)}
          />
        </div>
      </div>

      <div className="myc-result-row">
        <span className="myc-result" style={{ color: resultColor }}>
          {resultLabel}
        </span>
        <button
          className="myc-apply-btn"
          onClick={apply}
          disabled={!hasValues || delta === 0}
          style={delta !== 0 && hasValues ? { backgroundColor: resultColor } : {}}
        >
          Appliquer
        </button>
      </div>
    </div>
  )
}
