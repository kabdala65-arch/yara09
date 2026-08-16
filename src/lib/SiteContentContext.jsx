import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import { DEFAULT_CONTENT, mergeContent } from './defaultContent'

const SiteContentContext = createContext({
  content: DEFAULT_CONTENT,
  settings: null,
  loading: true,
  refresh: () => {},
})

export function SiteContentProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    setSettings(data || null)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const content = useMemo(() => mergeContent(settings?.content), [settings])

  const value = useMemo(
    () => ({ content, settings, loading, refresh: load }),
    [content, settings, loading, load]
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

// بيستخدمها أي كومبوننت في الموقع عشان ياخد النصوص الحالية
export function useSiteContent() {
  return useContext(SiteContentContext)
}
