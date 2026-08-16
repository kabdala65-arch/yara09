import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { useSiteContent } from '../lib/SiteContentContext'
import './PasswordGate.css'

const FALLBACK_PASSWORD = '123'

export default function PasswordGate({ onUnlock }) {
  const { content } = useSiteContent()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [correctPassword, setCorrectPassword] = useState(FALLBACK_PASSWORD)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('gate_password')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data?.gate_password) setCorrectPassword(data.gate_password)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === correctPassword.toLowerCase()) {
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="gate-screen">
      <motion.div
        className="gate-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span className="gate-heart">♥</span>
        <h1 className="gate-title">{content.gate.title}</h1>
        <p className="gate-subtitle">{content.gate.subtitle}</p>

        <form className="gate-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className={`gate-input ${error ? 'gate-input-error' : ''}`}
            placeholder="الباسورد"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <button type="submit" className="gate-button">{content.gate.buttonText}</button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              className="gate-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              الباسورد مش صح.. جربي تاني ♥
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
