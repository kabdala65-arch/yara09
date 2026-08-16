import { useState } from 'react'

// ---------- قسم قابل للطي ----------
export function Accordion({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`acc ${open ? 'acc-open' : ''}`}>
      <button type="button" className="acc-header" onClick={() => setOpen((o) => !o)}>
        <span className="acc-header-text">
          <span className="acc-title">{title}</span>
          {subtitle && <span className="acc-subtitle">{subtitle}</span>}
        </span>
        <span className="acc-chevron">⌄</span>
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  )
}

// ---------- حقل نص عادي ----------
export function FieldRow({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="field-row">
      <span className="field-label">{label}</span>
      <input
        type={type}
        className="field-input"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

// ---------- منطقة نص طويلة (فقرات) ----------
export function TextAreaRow({ label, value, onChange, rows = 4, hint }) {
  return (
    <label className="field-row">
      <span className="field-label">{label}</span>
      {hint && <span className="field-hint">{hint}</span>}
      <textarea
        className="field-textarea"
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

// ---------- قائمة نصوص بسيطة (زي أسطر وحشتيني) ----------
export function StringListEditor({ label, items, onChange, addLabel = '+ إضافة سطر' }) {
  const list = items || []

  const update = (i, val) => {
    const next = [...list]
    next[i] = val
    onChange(next)
  }
  const remove = (i) => {
    onChange(list.filter((_, idx) => idx !== i))
  }
  const add = () => {
    onChange([...list, ''])
  }

  return (
    <div className="list-editor">
      {label && <span className="field-label">{label}</span>}
      {list.map((item, i) => (
        <div className="list-row" key={i}>
          <textarea
            className="field-textarea list-textarea"
            rows={2}
            value={item}
            onChange={(e) => update(i, e.target.value)}
          />
          <button type="button" className="list-remove-btn" onClick={() => remove(i)} aria-label="حذف">
            ×
          </button>
        </div>
      ))}
      <button type="button" className="list-add-btn" onClick={add}>
        {addLabel}
      </button>
    </div>
  )
}

// ---------- قائمة عناصر مركبة (زي الكروت أو معنى الحروف) ----------
// fields: [{ key, label, type: 'text' | 'textarea' }]
export function ObjectListEditor({ items, onChange, fields, addLabel = '+ إضافة عنصر', emptyItem }) {
  const list = items || []

  const update = (i, key, val) => {
    const next = [...list]
    next[i] = { ...next[i], [key]: val }
    onChange(next)
  }
  const remove = (i) => {
    onChange(list.filter((_, idx) => idx !== i))
  }
  const add = () => {
    onChange([...list, { ...emptyItem }])
  }

  return (
    <div className="object-list-editor">
      {list.map((item, i) => (
        <div className="object-list-card" key={i}>
          <div className="object-list-card-header">
            <span className="object-list-index">#{i + 1}</span>
            <button type="button" className="list-remove-btn" onClick={() => remove(i)} aria-label="حذف">
              ×
            </button>
          </div>
          {fields.map((f) => (
            <label className="field-row" key={f.key}>
              <span className="field-label">{f.label}</span>
              {f.type === 'textarea' ? (
                <textarea
                  className="field-textarea"
                  rows={2}
                  value={item[f.key] ?? ''}
                  onChange={(e) => update(i, f.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="field-input"
                  value={item[f.key] ?? ''}
                  onChange={(e) => update(i, f.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
      ))}
      <button type="button" className="list-add-btn" onClick={add}>
        {addLabel}
      </button>
    </div>
  )
}
