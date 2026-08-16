import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import './PromiseSection.css'

export default function PromiseSection() {
  const { content } = useSiteContent()
  const { promise } = content

  return (
    <section className="promise-section">
      <motion.div
        className="promise-block"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <span className="section-tag">{promise.tagText}</span>
        <p className="promise-text">
          {promise.text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </motion.div>

      <motion.div
        className="poem-block"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <span className="section-tag">{promise.poemTagText}</span>
        <p className="poem-text">
          {promise.poemText.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </motion.div>
    </section>
  )
}
