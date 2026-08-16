import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import './VoiceMessageSection.css'

// الرسالة الصوتية بتتحمل من لوحة التحكم (بترفع في Supabase Storage).
// لو لسه معملتش رفع، بيرجع تلقائي لملف public/voice/voice-message.mp3 لو موجود.

export default function VoiceMessageSection() {
  const { content, settings } = useSiteContent()
  const { voice } = content
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [voiceAvailable, setVoiceAvailable] = useState(true)
  const audioRef = useRef(null)

  const voiceSrc = settings?.voice_url || '/voice/voice-message.mp3'

  useEffect(() => {
    setVoiceAvailable(true)
  }, [voiceSrc])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }
    const setAudioDuration = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }
    const handleError = () => setVoiceAvailable(false)

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', setAudioDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', setAudioDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    if (!voiceAvailable) {
      setIsPlaying(!isPlaying)
      return
    }
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => setVoiceAvailable(false))
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const bars = Array.from({ length: 28 })

  return (
    <section className="voice-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">{voice.tagText}</span>
        <h2 className="section-title">{voice.title}</h2>
        <p className="section-subtitle">{voice.subtitle}</p>
      </motion.div>

      <motion.div
        className="voice-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
      >
        <audio ref={audioRef} src={voiceSrc} />

        <button
          className={`voice-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <div className="voice-waveform">
          {bars.map((_, i) => (
            <span
              key={i}
              className={`voice-bar ${isPlaying ? 'active' : ''}`}
              style={{
                height: `${18 + Math.abs(Math.sin(i * 0.7)) * 26}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        <div className="voice-time">
          {voiceAvailable ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'demo'}
        </div>
      </motion.div>

      {!voiceAvailable && (
        <p className="voice-hint">
          (لسه معملتش أبلود لملف الريكورد — حطيه في public/voice باسم voice-message.mp3)
        </p>
      )}
    </section>
  )
}
