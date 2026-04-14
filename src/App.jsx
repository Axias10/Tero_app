import { useState, useCallback } from 'react'
import AssetCard from './components/AssetCard'
import Timer from './components/Timer'
import Dice from './components/Dice'
import RoundControls from './components/RoundControls'
import './App.css'

const TOTAL_ROUNDS = 7

const INITIAL_ASSETS = [
  {
    id: 'tree1',
    name: 'Sève des Lumichênes',
    symbol: 'LUM',
    emoji: '🌿',
    color: '#32d74b',
    initialPrice: 1,
  },
  {
    id: 'tree2',
    name: 'Sève des Sirrococotier',
    symbol: 'SIR',
    emoji: '🌳',
    color: '#34c759',
    initialPrice: 1,
  },
  {
    id: 'sun',
    name: 'Petit Soleil',
    symbol: 'SOL',
    emoji: '☀️',
    color: '#ff9f0a',
    initialPrice: 3,
  },
  {
    id: 'water',
    name: 'Eau',
    symbol: 'EAU',
    emoji: '💧',
    color: '#0a84ff',
    initialPrice: 1,
  },
  {
    id: 'mycelium',
    name: 'Mycélium',
    symbol: 'MYC',
    emoji: '🍄',
    color: '#bf5af2',
    initialPrice: 5,
  },
]

const DEMO_HISTORIES = {
  tree1:    [10, 11, 13, 12, 15, 17, null],
  tree2:    [10, 12, 11, 13, 12, 14, null],
  sun:      [10,  9, 11, 10, 12, 11, null],
  water:    [10, 11, 12, 14, 13, 16, null],
  mycelium: [10,  9,  8, 10, 12, 14, null],
}

function buildInitialPriceHistory(initialPrice) {
  return Array(TOTAL_ROUNDS).fill(null).map((_, i) =>
    i === 0 ? initialPrice : null
  )
}

function initializeState(demo = false) {
  return INITIAL_ASSETS.map((asset) => ({
    ...asset,
    priceHistory: demo
      ? DEMO_HISTORIES[asset.id]
      : buildInitialPriceHistory(asset.initialPrice),
  }))
}

export default function App() {
  const [assets, setAssets] = useState(() => initializeState(false))
  const [currentRound, setCurrentRound] = useState(1)

  const updatePrice = useCallback((assetId, delta) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== assetId) return asset
        const newHistory = [...asset.priceHistory]
        const currentPrice = newHistory[currentRound - 1] ?? 0
        const newPrice = Math.max(1, currentPrice + delta)
        newHistory[currentRound - 1] = newPrice
        return { ...asset, priceHistory: newHistory }
      })
    )
  }, [currentRound])

  const goToRound = useCallback((round) => {
    if (round < 1 || round > TOTAL_ROUNDS) return
    setAssets((prev) =>
      prev.map((asset) => {
        const newHistory = [...asset.priceHistory]
        // Propagate last known price forward when advancing
        if (round > currentRound) {
          for (let r = currentRound; r < round; r++) {
            if (newHistory[r] === null) {
              newHistory[r] = newHistory[r - 1] ?? 0
            }
          }
          if (newHistory[round - 1] === null) {
            newHistory[round - 1] = newHistory[round - 2] ?? 0
          }
        }
        return { ...asset, priceHistory: newHistory }
      })
    )
    setCurrentRound(round)
  }, [currentRound])

  const resetAll = useCallback(() => {
    setAssets(initializeState())
    setCurrentRound(1)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Tero</h1>
          <p className="app-subtitle">Marchés</p>
        </div>
        <div className="header-right">
          <Dice />
          <Timer />
        </div>
      </header>

      <RoundControls
        currentRound={currentRound}
        totalRounds={TOTAL_ROUNDS}
        onRoundChange={goToRound}
        onReset={resetAll}
      />

      <main className="assets-grid">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            currentRound={currentRound}
            totalRounds={TOTAL_ROUNDS}
            onUpdatePrice={updatePrice}
          />
        ))}
      </main>

      <footer className="app-footer">
        <span>Tour {currentRound} / {TOTAL_ROUNDS}</span>
        <span>Tero Board Game Tracker</span>
      </footer>
    </div>
  )
}
