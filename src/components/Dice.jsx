import { useState, useRef } from 'react'
import './Dice.css'

// Pip positions for each face (in a 3x3 grid: tl, tc, tr, ml, mc, mr, bl, bc, br)
const PIPS = {
  1: ['mc'],
  2: ['tr', 'bl'],
  3: ['tr', 'mc', 'bl'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'mc', 'bl', 'br'],
  6: ['tl', 'ml', 'bl', 'tr', 'mr', 'br'],
}

const PIP_POS = {
  tl: { top: '18%',  left: '18%'  },
  tc: { top: '18%',  left: '50%'  },
  tr: { top: '18%',  left: '82%'  },
  ml: { top: '50%',  left: '18%'  },
  mc: { top: '50%',  left: '50%'  },
  mr: { top: '50%',  left: '82%'  },
  bl: { top: '82%',  left: '18%'  },
  bc: { top: '82%',  left: '50%'  },
  br: { top: '82%',  left: '82%'  },
}

function DiceFace({ value, rolling }) {
  const pips = PIPS[value] || []
  return (
    <div className={`dice-face ${rolling ? 'rolling' : ''}`}>
      {pips.map((pos, i) => (
        <span
          key={i}
          className="pip"
          style={{
            top: PIP_POS[pos].top,
            left: PIP_POS[pos].left,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}

export default function Dice() {
  const [value, setValue] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)

  const roll = () => {
    if (rolling) return
    setRolling(true)

    let ticks = 0
    const totalTicks = 18
    intervalRef.current = setInterval(() => {
      setValue(Math.ceil(Math.random() * 6))
      ticks++
      if (ticks >= totalTicks) {
        clearInterval(intervalRef.current)
        const final = Math.ceil(Math.random() * 6)
        setValue(final)
        setHistory(prev => [final, ...prev].slice(0, 5))
        setRolling(false)
      }
    }, 60)
  }

  return (
    <div className="dice-widget">
      <div className="dice-left">
        <button
          className={`dice-btn ${rolling ? 'rolling-btn' : ''} ${value !== null ? 'has-value' : ''}`}
          onClick={roll}
          disabled={rolling}
          aria-label="Lancer le dé"
        >
          {value === null ? (
            <span className="dice-placeholder">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9"  cy="9"  r="2" fill="currentColor"/>
                <circle cx="19" cy="9"  r="2" fill="currentColor"/>
                <circle cx="14" cy="14" r="2" fill="currentColor"/>
                <circle cx="9"  cy="19" r="2" fill="currentColor"/>
                <circle cx="19" cy="19" r="2" fill="currentColor"/>
              </svg>
            </span>
          ) : (
            <DiceFace value={value} rolling={rolling} />
          )}
        </button>

        <div className="dice-label">
          {rolling
            ? 'En cours…'
            : value === null
            ? 'Lancer le dé'
            : `Résultat : ${value}`}
        </div>
      </div>

      {history.length > 0 && (
        <div className="dice-history">
          {history.map((v, i) => (
            <span
              key={i}
              className="history-dot"
              style={{ opacity: 1 - i * 0.18 }}
              title={`Tour précédent : ${v}`}
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
