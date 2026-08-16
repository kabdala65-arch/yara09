import { useMemo } from 'react'
import './FloatingHearts.css'

export default function FloatingHearts({ count = 25 }) {
  const hearts = useMemo(() => {
    const symbols = ['♥', '♥', '♥', '✦', '♡']
    const colors = ['#ec4899', '#f472b6', '#fb7185', '#ffffff', '#fbbf24']
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      size: 14 + Math.random() * 22,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 10,
      drift: Math.random() * 100 - 50,
    }))
  }, [count])

  const sparkles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 4,
    }))
  }, [])

  return (
    <div className="floating-layer" aria-hidden="true">
      {hearts.map(h => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            color: h.color,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--drift': `${h.drift}px`,
          }}
        >
          {h.symbol}
        </span>
      ))}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="spark"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
