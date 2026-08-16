import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import './MeaningSection.css'

export default function MeaningSection() {
  const { content } = useSiteContent()
  const { meaning } = content
  const letters = meaning.letters || []

  return (
    <section className="meaning-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">{meaning.tagText}</span>
        <h2 className="section-title">{meaning.title}</h2>
        <p className="section-subtitle">
          {meaning.subtitle}
        </p>
      </motion.div>

      <div className="meaning-grid">
        {letters.map((item, i) => (
          <motion.div
            key={i}
            className="meaning-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <span className="meaning-letter">{item.letter}</span>
            <span className="meaning-text">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
