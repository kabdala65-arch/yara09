# 💖 موقع يارا — Love Website

موقع رومانسي عصري بـ React + Vite + Framer Motion.

---

## 🚀 طريقة التشغيل (خطوة بخطوة)

### الخطوة 1: تثبيت Node.js
لازم يكون عندك **Node.js** على جهازك. لو مش متثبت:
- نزّليه من: https://nodejs.org (اختاري نسخة LTS)

### الخطوة 2: فتح المشروع في VS Code
```bash
code .
```
أو افتحي VS Code → File → Open Folder → اختاري مجلد `sara-love-website`

### الخطوة 3: تثبيت المكتبات
افتحي الترمنال في VS Code (Ctrl + `) واكتبي:
```bash
npm install
```
استني شوية لحد ما يخلص (هياخد دقيقة أو اتنين أول مرة).

### الخطوة 4: تشغيل الموقع
```bash
npm run dev
```
هيفتح الموقع تلقائياً على: **http://localhost:3000**

---

## 📸 إضافة الصور

1. حطّي صورك في مجلد: `src/assets/images/`
2. افتحي ملف: `src/components/GallerySection.jsx`
3. شيلي التعليق من السطور دي في الأعلى:
   ```jsx
   import img1 from '../assets/images/photo1.jpg'
   import img2 from '../assets/images/photo2.jpg'
   ```
4. في الـ array بتاع `photos`، عدّلي كل عنصر زي كده:
   ```jsx
   { id: 1, src: img1, caption: 'أول يوم شفتك فيه' },
   ```
5. وفي الـ JSX استبدلي السطر:
   ```jsx
   <span className="placeholder-icon">{photo.placeholder}</span>
   ```
   بـ:
   ```jsx
   <img src={photo.src} alt={photo.caption} />
   ```

---

## 🎵 إضافة الموسيقى

1. حطّي ملف الأغنية (mp3) في: `src/assets/music/`
2. افتحي ملف: `src/components/MusicPlayer.jsx`
3. شيلي التعليق من السطر:
   ```jsx
   import song from '../assets/music/our-song.mp3'
   ```
4. غيّري السطر:
   ```jsx
   const songSrc = null
   ```
   إلى:
   ```jsx
   const songSrc = song
   ```

---

## ✏️ تخصيص الكلام والمحتوى

| الملف | المحتوى |
|------|---------|
| `HeroSection.jsx` | الاسم الكبير + الجملة الأولى |
| `LoveCardsSection.jsx` | الكروت التفاعلية ورسايلها |
| `MessageSection.jsx` | الرسالة الكبيرة |
| `GallerySection.jsx` | تسميات الصور |
| `MusicPlayer.jsx` | اسم الأغنية |

---

## 🎨 تخصيص الألوان

افتحي أي ملف CSS وغيّري الألوان دي:
- `#ec4899` → الوردي الأساسي
- `#a855f7` → البنفسجي
- `#f472b6` → الوردي الفاتح
- `#0a0a14` → خلفية سوداء غامقة

---

## 📦 رفع الموقع على الإنترنت

⚠️ **مهم:** متعمليش build يدوي وترفعي مجلد `dist` بس — ده اللي بيسبب مشكلة إن صفحة `/admin` بتديلك 404. لازم ترفعي **المشروع كله** (فيه ملف `vercel.json` أو `netlify.toml` اللي بيخلي الراوتس زي `/admin` تشتغل)، وسيبي المنصة هي اللي تعمل الـ build.

### الطريقة الموصى بيها: Vercel أو Netlify + GitHub
1. ادفعي المشروع كله (كل الملفات ما عدا `node_modules` و `dist`) لريبو على GitHub.
2. في [vercel.com](https://vercel.com) أو [netlify.com](https://netlify.com): New Project → اختاري الريبو.
3. المنصة هتكتشف إنه مشروع Vite تلقائي، وهتشغل `npm run build` وتاخد `vercel.json` / `netlify.toml` معاها.
4. أي تعديل بعد كده وادفعيه (push) لـ GitHub هيعمل ديبلوي جديد تلقائي.

### أو عن طريق الـ CLI (من غير GitHub)
```bash
npm install -g vercel
cd sara-love-website   # من جوه مجلد المشروع نفسه، مش جوه dist
vercel --prod
```

لو استخدمتي طريقة تانية (سحب وإفلات على الموقع مثلاً) لازم تسحبي **مجلد المشروع كله**، مش مجلد `dist` وحده.

---

ربنا يخليكوا لبعض ♥
