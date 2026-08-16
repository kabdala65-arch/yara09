import { Accordion, FieldRow, TextAreaRow, StringListEditor, ObjectListEditor } from './ContentEditors'

// بيحول تاريخ ISO لصيغة تتحط في input[type=datetime-local]
function toLocalInputValue(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ContentTab({ content, setField }) {
  const set = (section, key) => (val) =>
    setField(section, { ...content[section], [key]: val })

  return (
    <div className="content-tab">
      <Accordion title="الصفحة الرئيسية" subtitle="الاسم، التاريخ، والكلام اللي بيظهر أول ما الموقع يفتح" defaultOpen>
        <FieldRow label="نص الشارة العلوية" value={content.hero.badgeText} onChange={set('hero', 'badgeText')} />
        <FieldRow label="الاسم" value={content.hero.name} onChange={set('hero', 'name')} />
        <FieldRow label="نص التاريخ (زي: 30 / 5 / 2026)" value={content.hero.dateText} onChange={set('hero', 'dateText')} />
        <TextAreaRow label="الرسالة الأولى" value={content.hero.quote} onChange={set('hero', 'quote')} rows={6} hint="كل سطر يتحط لوحده هيظهر منفصل" />
        <FieldRow label="نص زرار الاستكشاف تحت" value={content.hero.scrollText} onChange={set('hero', 'scrollText')} />
      </Accordion>

      <Accordion title="عداد أول كلمة بينكم" subtitle="من يوم أول ما اتكلمتوا فيه">
        <label className="field-row">
          <span className="field-label">تاريخ ووقت أول كلام</span>
          <input
            type="datetime-local"
            className="field-input"
            value={toLocalInputValue(content.firstTalk.startDate)}
            onChange={(e) => set('firstTalk', 'startDate')(new Date(e.target.value).toISOString())}
          />
        </label>
        <FieldRow label="نص صغير فوق العنوان" value={content.firstTalk.tagText} onChange={set('firstTalk', 'tagText')} />
        <FieldRow label="العنوان" value={content.firstTalk.title} onChange={set('firstTalk', 'title')} />
        <FieldRow label="السطر تحت العنوان" value={content.firstTalk.subtitle} onChange={set('firstTalk', 'subtitle')} />
      </Accordion>

      <Accordion title="عداد بقالنا مع بعض" subtitle="تاريخ بداية العلاقة">
        <label className="field-row">
          <span className="field-label">تاريخ ووقت البداية</span>
          <input
            type="datetime-local"
            className="field-input"
            value={toLocalInputValue(content.counter.startDate)}
            onChange={(e) => set('counter', 'startDate')(new Date(e.target.value).toISOString())}
          />
        </label>
        <FieldRow label="نص صغير فوق العنوان" value={content.counter.tagText} onChange={set('counter', 'tagText')} />
        <FieldRow label="العنوان" value={content.counter.title} onChange={set('counter', 'title')} />
        <FieldRow label="السطر تحت العنوان" value={content.counter.subtitle} onChange={set('counter', 'subtitle')} />
      </Accordion>

      <Accordion title="معنى الاسم" subtitle="كل حرف من الاسم وله معنى">
        <FieldRow label="نص صغير فوق العنوان" value={content.meaning.tagText} onChange={set('meaning', 'tagText')} />
        <FieldRow label="العنوان" value={content.meaning.title} onChange={set('meaning', 'title')} />
        <FieldRow label="السطر تحت العنوان" value={content.meaning.subtitle} onChange={set('meaning', 'subtitle')} />
        <ObjectListEditor
          items={content.meaning.letters}
          onChange={set('meaning', 'letters')}
          addLabel="+ إضافة حرف"
          emptyItem={{ letter: '', text: '' }}
          fields={[
            { key: 'letter', label: 'الحرف', type: 'text' },
            { key: 'text', label: 'المعنى', type: 'textarea' },
          ]}
        />
      </Accordion>

      <Accordion title="وحشتيني" subtitle="قائمة الأسطر اللي بتوصف الوحشة">
        <FieldRow label="نص صغير فوق العنوان" value={content.missingYou.tagText} onChange={set('missingYou', 'tagText')} />
        <FieldRow label="العنوان" value={content.missingYou.title} onChange={set('missingYou', 'title')} />
        <FieldRow label="السطر تحت العنوان" value={content.missingYou.subtitle} onChange={set('missingYou', 'subtitle')} />
        <StringListEditor
          items={content.missingYou.lines}
          onChange={set('missingYou', 'lines')}
          addLabel="+ إضافة سطر وحشتيني"
        />
        <FieldRow label="جملة الختام" value={content.missingYou.closing} onChange={set('missingYou', 'closing')} />
      </Accordion>

      <Accordion title="كروت الحب" subtitle="الكروت اللي بتتفتح لما تدوسي عليها">
        <FieldRow label="نص صغير فوق العنوان" value={content.cards.tagText} onChange={set('cards', 'tagText')} />
        <FieldRow label="العنوان" value={content.cards.title} onChange={set('cards', 'title')} />
        <FieldRow label="السطر تحت العنوان" value={content.cards.subtitle} onChange={set('cards', 'subtitle')} />
        <ObjectListEditor
          items={content.cards.items}
          onChange={set('cards', 'items')}
          addLabel="+ إضافة كارت"
          emptyItem={{ icon: '♥', title: '', message: '' }}
          fields={[
            { key: 'icon', label: 'الرمز (إيموجي أو حرف)', type: 'text' },
            { key: 'title', label: 'عنوان الكارت', type: 'text' },
            { key: 'message', label: 'الرسالة جوه الكارت', type: 'textarea' },
          ]}
        />
      </Accordion>

      <Accordion title="الوعد والقصيدة">
        <FieldRow label="نص صغير فوق فقرة الوعد" value={content.promise.tagText} onChange={set('promise', 'tagText')} />
        <TextAreaRow label="نص الوعد" value={content.promise.text} onChange={set('promise', 'text')} rows={4} />
        <FieldRow label="نص صغير فوق القصيدة" value={content.promise.poemTagText} onChange={set('promise', 'poemTagText')} />
        <TextAreaRow label="نص القصيدة" value={content.promise.poemText} onChange={set('promise', 'poemText')} rows={10} hint="كل سطر يتحط لوحده هيظهر منفصل" />
      </Accordion>

      <Accordion title="الرسالة الصوتية" subtitle="العنوان بس — الملف الصوتي بيترفع من تبويب الصوت">
        <FieldRow label="نص صغير فوق العنوان" value={content.voice.tagText} onChange={set('voice', 'tagText')} />
        <FieldRow label="العنوان" value={content.voice.title} onChange={set('voice', 'title')} />
        <FieldRow label="السطر تحت العنوان" value={content.voice.subtitle} onChange={set('voice', 'subtitle')} />
      </Accordion>

      <Accordion title="الرسالة الأخيرة" subtitle="آخر رسالة في الصفحة">
        <FieldRow label="أول سطر" value={content.message.lead} onChange={set('message', 'lead')} />
        <FieldRow label="التوقيع جنب أول سطر" value={content.message.signature} onChange={set('message', 'signature')} />
        <TextAreaRow label="نص الرسالة" value={content.message.body} onChange={set('message', 'body')} rows={8} hint="كل سطر يتحط لوحده هيظهر منفصل" />
        <FieldRow label="السطر الأخير" value={content.message.from} onChange={set('message', 'from')} />
      </Accordion>

      <Accordion title="الفوتر وصفحة الدخول">
        <FieldRow label="الاسم في الفوتر" value={content.footer.name} onChange={set('footer', 'name')} />
        <FieldRow label="السنة" value={content.footer.year} onChange={set('footer', 'year')} />
        <FieldRow label="عنوان صفحة كلمة السر" value={content.gate.title} onChange={set('gate', 'title')} />
        <FieldRow label="السطر تحت عنوان صفحة كلمة السر" value={content.gate.subtitle} onChange={set('gate', 'subtitle')} />
        <FieldRow label="نص زرار الدخول" value={content.gate.buttonText} onChange={set('gate', 'buttonText')} />
      </Accordion>
    </div>
  )
}
