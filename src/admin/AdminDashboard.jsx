import { useEffect, useState } from 'react'
import { supabase, BUCKETS } from '../lib/supabaseClient'
import { useSiteContent } from '../lib/SiteContentContext'
import AdminLogin from './AdminLogin'
import ContentTab from './ContentTab'
import './AdminDashboard.css'

function useSession() {
  const [session, setSession] = useState(undefined) // undefined = لسه بيتحقق

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  return session
}

const TABS = [
  { id: 'content', label: 'المحتوى', icon: '✎' },
  { id: 'media', label: 'الصوت', icon: '🎵' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙' },
]

export default function AdminDashboard() {
  const session = useSession()

  if (session === undefined) {
    return <div className="admin-loading">جاري التحميل...</div>
  }

  if (!session) {
    return <AdminLogin onLoggedIn={() => {}} />
  }

  return <DashboardContent />
}

function DashboardContent() {
  const { content, settings, loading: contentLoading, refresh } = useSiteContent()

  const [activeTab, setActiveTab] = useState('content')
  const [draft, setDraft] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  // مزامنة المسودة المحلية مع المحتوى الجاي من قاعدة البيانات أول ما يتحمل
  useEffect(() => {
    if (!contentLoading && !draft) {
      setDraft(content)
    }
  }, [contentLoading, content, draft])

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  // ---------- المحتوى ----------
  const setField = (section, value) => {
    setDraft((prev) => ({ ...prev, [section]: value }))
    setDirty(true)
  }

  const handleSaveContent = async () => {
    setSaving(true)
    const { error } = await supabase.from('site_settings').update({ content: draft }).eq('id', 1)
    setSaving(false)
    if (error) {
      showMessage('حصل خطأ في الحفظ: ' + error.message)
    } else {
      showMessage('اتحفظ كل حاجة بنجاح ♥')
      setDirty(false)
      await refresh()
    }
  }

  // ---------- الأغنية والرسالة الصوتية ----------
  const handleSongUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `song-${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from(BUCKETS.music).upload(fileName, file)

    if (uploadError) {
      showMessage('حصل خطأ في رفع الأغنية: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKETS.music).getPublicUrl(fileName)
    const { error: updateError } = await supabase.from('site_settings').update({ song_url: publicUrlData.publicUrl }).eq('id', 1)

    if (updateError) {
      showMessage('حصل خطأ في حفظ الأغنية: ' + updateError.message)
    } else {
      showMessage('اتضافت الأغنية بنجاح ♥')
      await refresh()
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleVoiceUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `voice-${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from(BUCKETS.voice).upload(fileName, file)

    if (uploadError) {
      showMessage('حصل خطأ في رفع الرسالة الصوتية: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKETS.voice).getPublicUrl(fileName)
    const { error: updateError } = await supabase.from('site_settings').update({ voice_url: publicUrlData.publicUrl }).eq('id', 1)

    if (updateError) {
      showMessage('حصل خطأ في حفظ الرسالة الصوتية: ' + updateError.message)
    } else {
      showMessage('اتضافت الرسالة الصوتية بنجاح ♥')
      await refresh()
    }
    setUploading(false)
    e.target.value = ''
  }

  // ---------- الباسورد ----------
  const [newPassword, setNewPassword] = useState('')
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!newPassword.trim()) return
    const { error } = await supabase.from('site_settings').update({ gate_password: newPassword.trim() }).eq('id', 1)
    if (error) {
      showMessage('حصل خطأ في تغيير الباسورد: ' + error.message)
    } else {
      showMessage('اتغير الباسورد بنجاح ♥')
      setNewPassword('')
      await refresh()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (contentLoading || !draft) {
    return <div className="admin-loading">جاري التحميل...</div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>لوحة تحكم موقع {draft.hero.name} ♥</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          تسجيل خروج
        </button>
      </header>

      <nav className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="admin-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {message && <div className="admin-toast">{message}</div>}

      {activeTab === 'content' && (
        <>
          <div className="admin-save-bar">
            <span className={`admin-save-status ${dirty ? 'dirty' : ''}`}>
              {dirty ? 'في تعديلات لسه معملتلهاش حفظ' : 'كل حاجة متحفظة ♥'}
            </span>
            <button className="admin-save-btn" onClick={handleSaveContent} disabled={!dirty || saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ كل التعديلات'}
            </button>
          </div>
          <ContentTab content={draft} setField={setField} />
        </>
      )}

      {activeTab === 'media' && (
        <>
          <section className="admin-section">
            <h2>أغنيتنا</h2>
            {settings?.song_url ? (
              <audio controls src={settings.song_url} className="admin-audio-preview" />
            ) : (
              <p className="admin-empty">لسه مفيش أغنية مرفوعة</p>
            )}
            <label className="admin-upload-btn">
              {uploading ? 'جاري الرفع...' : 'رفع / تغيير الأغنية'}
              <input type="file" accept="audio/*" onChange={handleSongUpload} disabled={uploading} hidden />
            </label>
          </section>

          <section className="admin-section">
            <h2>الرسالة الصوتية</h2>
            {settings?.voice_url ? (
              <audio controls src={settings.voice_url} className="admin-audio-preview" />
            ) : (
              <p className="admin-empty">لسه مفيش رسالة صوتية مرفوعة (بيظهر بدلها ملف تجريبي)</p>
            )}
            <label className="admin-upload-btn">
              {uploading ? 'جاري الرفع...' : 'رفع / تغيير الرسالة الصوتية'}
              <input type="file" accept="audio/*" onChange={handleVoiceUpload} disabled={uploading} hidden />
            </label>
          </section>
        </>
      )}

      {activeTab === 'settings' && (
        <section className="admin-section">
          <h2>باسورد دخول الموقع</h2>
          <p className="admin-current-password">
            الباسورد الحالي: <strong>{settings?.gate_password}</strong>
          </p>
          <form className="admin-password-form" onSubmit={handlePasswordChange}>
            <input
              type="text"
              placeholder="اكتب الباسورد الجديد"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">حفظ الباسورد</button>
          </form>
        </section>
      )}
    </div>
  )
}
