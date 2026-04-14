import { useState } from 'react'
import './SèveCalc.css'

const PALIERS = [
  { min: 0,  max: 9,   delta: -1, label: 'Moins de 10',  desc: "L'entreprise est en difficulté" },
  { min: 10, max: 14,  delta: +1, label: '10 à 14',      desc: "L'entreprise est stable"        },
  { min: 15, max: 19,  delta: +2, label: '15 à 19',      desc: "L'entreprise prospère"          },
  { min: 20, max: 29,  delta: +3, label: '20 à 29',      desc: "L'entreprise est florissante"   },
  { min: 30, max: Infinity, delta: +3, label: '30+',     desc: "L'entreprise est florissante"   },
]

function getPalier(n) {
  return PALIERS.find(p => n >= p.min && n <= p.max) ?? null
}

export default function SèveCalc({ color, onApply }) {
  const [petrifeuilles, setPetrifeuilles] = useState('')

  const num    = parseInt(petrifeuilles) || 0
  const palier = petrifeuilles !== '' ? getPalier(num) : null
  const delta  = palier?.delta ?? 0

  const resultColor = delta > 0 ? '#32d74b' : delta < 0 ? '#ff453a' : '#636366'

  const apply = () => {
    if (!palier) return
    onApply(delta)
    setPetrifeuilles('')
  }

  return (
    <div className="seve-calc">
      <div className="seve-calc-title">
        <span>🍃</span> Pétrifeuilles de l'entreprise
      </div>

      <div className="seve-input-row">
        <input
          className="seve-input"
          type="number"
          min="0"
          placeholder="0"
          value={petrifeuilles}
          onChange={e => setPetrifeuilles(e.target.value)}
          style={{ borderColor: palier ? `${resultColor}44` : undefined }}
        />

        {palier ? (
          <div className="seve-palier">
            <span className="seve-palier-range">{palier.label}</span>
            <span className="seve-palier-desc">{palier.desc}</span>
          </div>
        ) : (
          <div className="seve-palier seve-palier-empty">
            Entrer un nombre
          </div>
        )}
      </div>

      <div className="seve-result-row">
        <span className="seve-result" style={{ color: palier ? resultColor : '#636366' }}>
          {palier
            ? delta > 0
              ? `↑ +${delta} pt${delta > 1 ? 's' : ''}`
              : delta < 0
              ? `↓ ${delta} pt`
              : '= stable'
            : '—'}
        </span>
        <button
          className="seve-apply-btn"
          onClick={apply}
          disabled={!palier}
          style={palier ? { backgroundColor: resultColor } : {}}
        >
          Appliquer
        </button>
      </div>
    </div>
  )
}
