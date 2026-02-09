# 🚀 Syrian Sales Pro AI

مساعد مبيعات ذكي مدعوم بالذكاء الاصطناعي مع مصادقة Appwrite وتكامل OpenAI.

---

## ✨ الميزات

- 🔐 **مصادقة كاملة** مع Appwrite (Email/Password + OAuth)
- 🤖 **ذكاء اصطناعي** من OpenAI و Google Gemini
- 🌍 **دعم اللغة العربية** (سوري، خليجي، فصحى)
- 💬 **أوضاع مبيعات** متعددة (تواصل أولي، معالجة اعتراضات، إغلاق صفقة)
- 📊 **تخزين السياق** (معلومات الشركة والعملاء)
- 💾 **تصدير/استيراد** البيانات
- 🎨 **واجهة حديثة** و responsive

---

## 🛠️ التقنيات المستخدمة

- **Frontend**: React 19 + TypeScript + Vite
- **Authentication**: Appwrite
- **AI**: OpenAI GPT-4o-mini + Google Gemini
- **Styling**: Tailwind CSS
- **Deployment**: Vercel / Plesk

---

## 🚀 البداية السريعة

### 1️⃣ تثبيت الحزم

```bash
npm install
```

### 2️⃣ إعداد المتغيرات البيئية

انسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

ثم حدّث القيم:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3️⃣ تشغيل المشروع

```bash
npm run dev
```

افتح: **http://localhost:3000**

---

## 📖 التوثيق الكامل

### للإعداد:
- **[00-START-HERE.md](./00-START-HERE.md)** - نظرة شاملة على المشروع
- **[START.md](./START.md)** - دليل البداية السريعة (3 دقائق)
- **[APPWRITE_SETUP.md](./APPWRITE_SETUP.md)** - إعداد Appwrite (Cloud + Self-hosted)
- **[API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)** - الحصول على المفاتيح

### للتطوير:
- **[APPWRITE_EXAMPLES.md](./APPWRITE_EXAMPLES.md)** - أمثلة عملية
- **[EXAMPLES.md](./EXAMPLES.md)** - أمثلة الكود

### للنشر:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - النشر على Vercel
- **[PLESK_SETUP.md](./PLESK_SETUP.md)** - النشر على Plesk
- **[CHECKLIST.md](./CHECKLIST.md)** - قائمة التحقق

### أخرى:
- **[APPWRITE_MIGRATION.md](./APPWRITE_MIGRATION.md)** - تفاصيل الترحيل من Supabase
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - ملخص المشروع (EN)
- **[SUMMARY.md](./SUMMARY.md)** - ملخص ما تم إنجازه

---

## 🔑 الحصول على API Keys

### Appwrite (مجاني):
1. اذهب: https://cloud.appwrite.io
2. أنشئ حساب ومشروع
3. انسخ Project ID

**أو** استخدم Self-hosted: راجع `APPWRITE_SETUP.md`

### OpenAI (مدفوع ~$5/شهر):
1. اذهب: https://platform.openai.com
2. أنشئ API Key
3. أضف بطاقة ائتمانية

### Gemini (مجاني - اختياري):
1. اذهب: https://aistudio.google.com/app/apikey
2. أنشئ API Key

**دليل مفصل:** `API_KEYS_GUIDE.md`

---

## 🗄️ هيكل المشروع

```
syrian-sales-pro-ai/
├── components/           # مكونات React
│   ├── AuthForm.tsx
│   ├── ChatWindow.tsx
│   └── ...
├── lib/                  # المكتبات
│   ├── supabase.ts      # Appwrite client (اسم قديم)
│   └── openai.ts
├── hooks/                # React Hooks
│   └── useAuth.ts
├── services/             # الخدمات
│   └── geminiService.ts
├── App.tsx               # التطبيق الرئيسي
├── AppWithAuth.tsx       # التطبيق مع المصادقة
└── api/                  # PHP Backend (اختياري)
```

---

## 🎯 الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير

# البناء
npm run build            # بناء للإنتاج
npm run build:check      # بناء + تحقق

# المعاينة
npm run preview          # معاينة النسخة المبنية
```

---

## 📦 الحزم المثبتة

### Production:
- `react` - المكتبة الأساسية
- `appwrite` - المصادقة وقاعدة البيانات
- `openai` - الذكاء الاصطناعي من OpenAI
- `@google/genai` - الذكاء الاصطناعي من Google

### Development:
- `vite` - أداة البناء
- `typescript` - للكتابة الآمنة
- `@vitejs/plugin-react` - دعم React

---

## 🌐 النشر

### على Vercel (موصى به):

```bash
npm i -g vercel
vercel
```

أو اربط GitHub repo مع Vercel Dashboard.

**دليل كامل:** `DEPLOYMENT.md`

### على Plesk:

راجع `PLESK_SETUP.md` للتعليمات الكاملة.

---

## 💰 التكلفة المتوقعة

- **Appwrite Cloud**: مجاني (75K users + 2GB)
- **Appwrite Self-hosted**: مجاني 100%
- **Vercel**: مجاني (100 GB/month)
- **OpenAI**: ~$1-5/month (استخدام خفيف)
- **Gemini**: مجاني

**المجموع: مجاني إلى $5/شهر** 🎉

---

## 🔐 الأمان

- ✅ المتغيرات البيئية منفصلة عن الكود
- ✅ `.env.local` في `.gitignore`
- ✅ HTTPS على Vercel
- ✅ JWT sessions مع Appwrite
- ✅ OAuth آمن

---

## 🆘 المساعدة

### تواجه مشكلة؟

1. راجع `CHECKLIST.md` للتحقق من الإعداد
2. راجع `TROUBLESHOOTING` في `APPWRITE_SETUP.md`
3. تحقق من [Appwrite Discord](https://appwrite.io/discord)

### للتوثيق:
- **Appwrite**: https://appwrite.io/docs
- **OpenAI**: https://platform.openai.com/docs
- **Vercel**: https://vercel.com/docs

---

## 🤝 المساهمة

المشروع مفتوح للتطوير والتحسين!

---

## 📄 الترخيص

MIT License - استخدمه كما تشاء!

---

## 🙏 شكر خاص

- [Appwrite](https://appwrite.io) - نظام مصادقة رائع
- [OpenAI](https://openai.com) - GPT-4
- [Google](https://ai.google.dev) - Gemini
- [Vercel](https://vercel.com) - استضافة سريعة

---

**صُنع بـ ❤️ للمبيعين المحترفين**

**ابدأ البيع مثل المحترفين!** 💪🚀
