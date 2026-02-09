# دليل الحصول على API Keys 🔑

هذا دليل خطوة بخطوة للحصول على جميع مفاتيح API المطلوبة.

---

## 1. Supabase API Keys

### الخطوات:

1. **إنشاء حساب**
   - اذهب إلى: https://supabase.com
   - اضغط **"Start your project"**
   - سجل باستخدام GitHub (الأسهل)

2. **إنشاء مشروع جديد**
   - اضغط **"New Project"**
   - اختر Organization (أنشئ واحدة جديدة إذا لزم الأمر)
   - املأ البيانات:
     - **Name**: syrian-sales-pro-ai
     - **Database Password**: احفظ كلمة المرور في مكان آمن
     - **Region**: اختر الأقرب (مثل: Frankfurt لأوروبا)
   - اضغط **"Create new project"**
   - انتظر 1-2 دقيقة للإعداد

3. **الحصول على المفاتيح**
   - في لوحة التحكم، اذهب إلى **Settings** (الإعدادات)
   - اضغط على **API** من القائمة الجانبية
   - ستجد:
     - **Project URL**: انسخه (سيكون مثل: `https://xxxxx.supabase.co`)
     - **anon public**: انسخه (سيبدأ بـ `eyJ...`)
   
4. **النسخ للمتغيرات البيئية**
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 💡 نصيحة:
الحساب المجاني يوفر:
- 500MB database
- 2GB file storage  
- 50,000 monthly active users
- كافي جداً للبداية!

---

## 2. OpenAI API Key

### الخطوات:

1. **إنشاء حساب**
   - اذهب إلى: https://platform.openai.com
   - اضغط **"Sign up"**
   - سجل باستخدام email أو Google

2. **تفعيل Billing** (مطلوب)
   - اذهب إلى: https://platform.openai.com/account/billing
   - اضغط **"Add payment method"**
   - أضف بطاقة ائتمانية
   - اشحن برصيد (5$ كافية للبداية)

3. **إنشاء API Key**
   - اذهب إلى: https://platform.openai.com/api-keys
   - اضغط **"Create new secret key"**
   - **Name**: Syrian Sales Pro AI
   - **Permissions**: All (أو اختر ما تحتاج)
   - اضغط **"Create secret key"**
   - **⚠️ مهم**: انسخ المفتاح فوراً (لن تتمكن من رؤيته مرة أخرى!)

4. **النسخ للمتغيرات البيئية**
   ```env
   VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 💰 التكلفة:
- **gpt-4o-mini**: ~$0.15 لكل مليون token (رخيص جداً!)
- **gpt-4o**: ~$5 لكل مليون token
- مثال: 1000 محادثة مع gpt-4o-mini ≈ $1-2

### 💡 نصيحة:
- ضع حد للإنفاق في **Usage limits** لتجنب المفاجآت
- استخدم gpt-4o-mini للتطوير (أسرع وأرخص)

---

## 3. Google Gemini API Key (اختياري)

### الخطوات:

1. **إنشاء حساب Google Cloud**
   - اذهب إلى: https://aistudio.google.com/app/apikey
   - سجل الدخول بحساب Google

2. **إنشاء API Key**
   - اضغط **"Create API Key"**
   - اختر **"Create API key in new project"**
   - أو اختر مشروع موجود إذا كان لديك
   - انسخ المفتاح

3. **النسخ للمتغيرات البيئية**
   ```env
   VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 💰 التكلفة:
- **مجاني تماماً** حتى الآن!
- 60 requests per minute
- 1500 requests per day
- كافي جداً للاستخدام الشخصي

### 💡 نصيحة:
- Gemini 1.5 Flash سريع جداً ومجاني
- يدعم اللغة العربية بشكل ممتاز

---

## 4. تفعيل OAuth Providers (اختياري)

### Google OAuth

1. **Google Cloud Console**
   - اذهب إلى: https://console.cloud.google.com
   - أنشئ مشروع جديد أو اختر موجود
   - **APIs & Services > Credentials**
   - **Create Credentials > OAuth client ID**
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
   - انسخ **Client ID** و **Client Secret**

2. **في Supabase**
   - **Authentication > Providers > Google**
   - فعّل Google
   - الصق Client ID و Client Secret
   - احفظ

### GitHub OAuth

1. **GitHub Settings**
   - اذهب إلى: https://github.com/settings/developers
   - **OAuth Apps > New OAuth App**
   - **Application name**: Syrian Sales Pro AI
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
   - اضغط **Register application**
   - انسخ **Client ID**
   - اضغط **Generate a new client secret** وانسخه

2. **في Supabase**
   - **Authentication > Providers > GitHub**
   - فعّل GitHub
   - الصق Client ID و Client Secret
   - احفظ

---

## ملف .env.local النهائي

بعد الحصول على جميع المفاتيح، يجب أن يبدو ملفك هكذا:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjI0MjAwMCwiZXhwIjoxOTMxODE4MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini (اختياري)
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## التحقق من صحة المفاتيح

### اختبار Supabase:
```bash
npm run dev
```
افتح المتصفح وحاول التسجيل. إذا لم تظهر أخطاء، المفاتيح صحيحة.

### اختبار OpenAI:
افتح Developer Console (F12) وابحث عن أخطاء تتعلق بـ OpenAI.

---

## الأمان ⚠️

**مهم جداً:**
- ❌ لا تشارك هذه المفاتيح أبداً
- ❌ لا ترفعها على GitHub
- ✅ احفظها في `.env.local` فقط
- ✅ أضف `.env.local` إلى `.gitignore`
- ✅ في Vercel، أضفها في Environment Variables

---

## المساعدة

إذا واجهت مشاكل:

### Supabase
- [Documentation](https://supabase.com/docs)
- [Discord](https://discord.supabase.com)

### OpenAI
- [Documentation](https://platform.openai.com/docs)
- [Community Forum](https://community.openai.com)

### Gemini
- [Documentation](https://ai.google.dev/docs)

---

تهانينا! 🎉 الآن لديك جميع المفاتيح المطلوبة!
