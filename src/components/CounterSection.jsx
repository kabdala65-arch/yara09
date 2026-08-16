import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import './CounterSection.css'

function getElapsed(startDate) {
  const now = new Date()
  const diffMs = Math.max(0, now - startDate)

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

export default function CounterSection() {
  const { content } = useSiteContent()
  const { counter } = content
  const startDate = new Date(counter.startDate)
  const [elapsed, setElapsed] = useState(() => getElapsed(startDate))

  useEffect(() => {
    const interval = setInterval(() => setElapsed(getElapsed(startDate)), 1000)
    return () => clearInterval(interval)
  }, [counter.startDate])

  const units = [
    { label: 'يوم', value: elapsed.days },
    { label: 'ساعة', value: elapsed.hours },
    { label: 'دقيقة', value: elapsed.minutes },
    { label: 'ثانية', value: elapsed.seconds },
  ]

  return (
    <section className="counter-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">{counter.tagText}</span>
        <h2 className="section-title">{counter.title}</h2>
        <p className="section-subtitle">{counter.subtitle}</p>
      </motion.div>

      <div className="counter-grid">
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            className="counter-card"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <span className="counter-value">{unit.value}</span>
            <span className="counter-label">{unit.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
