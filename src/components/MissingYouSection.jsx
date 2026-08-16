import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import './MissingYouSection.css'

export default function MissingYouSection() {
  const { content } = useSiteContent()
  const { missingYou } = content
  const lines = missingYou.lines || []

  return (
    <section className="missing-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">{missingYou.tagText}</span>
        <h2 className="section-title">{missingYou.title}</h2>
        <p className="section-subtitle">
          {missingYou.subtitle}
        </p>
      </motion.div>

      <div className="missing-list">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="missing-line"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
          >
            <span className="missing-heart">♥</span>
            <span className="missing-word">وحشتيني</span>
            <span className="missing-text">{line}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="missing-closing"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {missingYou.closing}
      </motion.p>
    </section>
  )
}
