# دليل النشر السريع على Vercel 🚀

هذا دليل مختصر للنشر السريع على Vercel في 5 دقائق فقط.

## الطريقة الأولى: النشر من GitHub (الأسهل)

### 1. رفع الكود إلى GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/syrian-sales-pro-ai.git
git push -u origin main
```

### 2. النشر على Vercel

1. اذهب إلى **[vercel.com](https://vercel.com)**
2. اضغط **"Log in"** واختر **"Continue with GitHub"**
3. اضغط **"New Project"**
4. اختر repository الخاص بك
5. اضغط **"Import"**

### 3. إضافة المتغيرات البيئية

في صفحة Deploy، اضغط على **"Environment Variables"** وأضف:

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = ey...
VITE_OPENAI_API_KEY = sk-...
VITE_GEMINI_API_KEY = AI...
```

### 4. النشر

اضغط **"Deploy"** وانتظر 1-2 دقيقة.

✅ تم! سيعطيك Vercel رابط مثل: `https://syrian-sales-pro-ai.vercel.app`

---

## الطريقة الثانية: النشر من CLI

### 1. تثبيت Vercel CLI

```bash
npm install -g vercel
```

### 2. تسجيل الدخول

```bash
vercel login
```

### 3. النشر

```bash
vercel
```

اتبع التعليمات:
- Set up and deploy? **Y**
- Which scope? اختر اسم المستخدم
- Link to existing project? **N**
- What's your project's name? **syrian-sales-pro-ai**
- In which directory is your code located? **./**

### 4. إضافة المتغيرات البيئية

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_OPENAI_API_KEY
vercel env add VITE_GEMINI_API_KEY
```

لكل متغير، اختر:
- Environment: **Production**
- أدخل القيمة

### 5. نشر الإصدار النهائي

```bash
vercel --prod
```

---

## إعداد Supabase للنطاق الجديد

بعد النشر، يجب إضافة نطاق Vercel إلى Supabase:

1. اذهب إلى **Supabase Dashboard**
2. اختر مشروعك
3. اذهب إلى **Authentication > URL Configuration**
4. في **Redirect URLs**، أضف:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/**
   ```
5. اضغط **Save**

---

## التحديثات المستقبلية

### إذا استخدمت GitHub:

كل push جديد سيتم نشره تلقائياً:

```bash
git add .
git commit -m "Update features"
git push
```

### إذا استخدمت CLI:

```bash
vercel --prod
```

---

## نطاق مخصص (Custom Domain)

### 1. في Vercel Dashboard:

1. اذهب إلى مشروعك
2. اضغط **Settings > Domains**
3. أضف نطاقك مثل: `sales.yourdomain.com`

### 2. في إعدادات DNS:

أضف CNAME record:
```
Type: CNAME
Name: sales (أو @ للنطاق الرئيسي)
Value: cname.vercel-dns.com
```

### 3. تحديث Supabase:

أضف النطاق الجديد في **Redirect URLs** في Supabase.

---

## نصائح إضافية

### مراقبة الأداء

- في Vercel Dashboard: **Analytics** لمراقبة الزيارات
- **Speed Insights** لتحليل الأداء

### تصحيح الأخطاء

إذا واجهت مشاكل:

1. تحقق من **Vercel Logs** في Dashboard
2. تأكد من صحة المتغيرات البيئية
3. تحقق من Supabase redirect URLs

### التكلفة

- **Vercel**: مجاني حتى 100GB bandwidth شهرياً
- **Supabase**: مجاني حتى 500MB database
- **OpenAI**: حسب الاستخدام (gpt-4o-mini رخيص جداً)

---

## الدعم

للمساعدة:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com)

---

تهانينا! 🎉 مشروعك الآن على الإنترنت!
