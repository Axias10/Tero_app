import { useState } from 'react'
import './MycéliumCalc.css'

export default function MycéliumCalc({ currentPrice, color, onApply }) {
  const [petrifeuilles, setPetrifeuilles] = useState('')
  const [myceliumsProd, setMyceliumsProd] = useState('')

  const petrNum  = parseFloat(petrifeuilles) || 0
  const mycNum   = parseFloat(myceliumsProd)  || 0
  const equiv    = petrNum / 5

  let delta = 0
  let resultLabel = '— stable'
  let resultColor = '#636366'

  const hasValues = petrifeuilles !== '' || myceliumsProd !== ''

  if (hasValues) {
    if (equiv > mycNum)      { delta = +1; resultLabel = '↑ +1 pt'; resultColor = '#32d74b' }
    else if (mycNum > equiv) { delta = -1; resultLabel = '↓ −1 pt'; resultColor = '#ff453a' }
    else                     { delta =  0; resultLabel = '= stable'; resultColor = '#636366' }
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
            <span className="myc-hint">÷ 5 = {petrNum > 0 ? (equiv % 1 === 0 ? equiv : equiv.toFixed(1)) : '—'}</span>
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
