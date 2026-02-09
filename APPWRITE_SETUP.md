# دليل إعداد Appwrite 🚀

تم تحديث المشروع ليستخدم **Appwrite** كبديل لـ Supabase - نظام مصادقة وقاعدة بيانات مفتوح المصدر يمكن استضافته ذاتياً.

---

## 🎯 لماذا Appwrite؟

- ✅ **مفتوح المصدر** - كود مفتوح 100%
- ✅ **استضافة ذاتية** - على Plesk أو أي VPS
- ✅ **مجاني تماماً** - لا حدود!
- ✅ **سهل الاستخدام** - واجهة رائعة
- ✅ **دعم OAuth** - Google, GitHub, Facebook, وأكثر
- ✅ **قاعدة بيانات** - NoSQL مدمجة
- ✅ **ملفات** - تخزين الملفات
- ✅ **Functions** - Serverless functions

---

## 📋 خياران للاستخدام

### الخيار الأول: Appwrite Cloud ☁️ (سريع - موصى به للمبتدئين)
- مجاني: 75,000 مستخدم + 2GB storage
- لا حاجة لخادم
- جاهز في 5 دقائق

### الخيار الثاني: Self-Hosted على Plesk 🖥️ (أقوى)
- غير محدود تماماً
- تحكم كامل بالبيانات
- يحتاج Docker على الخادم

---

## ☁️ الخيار 1: Appwrite Cloud (الأسرع)

### 1️⃣ إنشاء حساب

1. اذهب إلى: https://cloud.appwrite.io
2. اضغط **Sign Up**
3. سجل باستخدام:
   - Email
   - أو GitHub
   - أو Google

### 2️⃣ إنشاء مشروع جديد

1. بعد تسجيل الدخول، اضغط **Create Project**
2. املأ البيانات:
   - **Project Name**: Syrian Sales Pro AI
   - **Project ID**: سيتم توليده تلقائياً (احفظه!)
3. اضغط **Create**

### 3️⃣ نسخ بيانات الاتصال

في صفحة المشروع:
1. اذهب إلى **Settings** من القائمة الجانبية
2. انسخ:
   - **API Endpoint**: `https://cloud.appwrite.io/v1`
   - **Project ID**: (سيكون شيئاً مثل `65f3a2b8c9d1e`)

### 4️⃣ إعداد Authentication

1. من القائمة الجانبية، اذهب إلى **Auth**
2. اضغط على **Settings**
3. فعّل الخيارات التالية:
   - ✅ **Email/Password**
   - ✅ **Email confirmation** (اختياري)
   - ✅ **Password recovery**

### 5️⃣ إعداد OAuth (اختياري)

لتفعيل Google/GitHub Sign-In:

#### Google OAuth:
1. في Appwrite، اذهب **Auth > Settings > OAuth Providers**
2. اضغط على **Google**
3. احصل على:
   - Client ID
   - Client Secret
   من: https://console.cloud.google.com/apis/credentials
4. أضف Redirect URL:
   ```
   https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/YOUR_PROJECT_ID
   ```

#### GitHub OAuth:
1. في Appwrite، اضغط **GitHub** provider
2. احصل على:
   - Client ID
   - Client Secret
   من: https://github.com/settings/developers
3. أضف Callback URL:
   ```
   https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/YOUR_PROJECT_ID
   ```

### 6️⃣ إعداد Platforms

1. اذهب **Settings > Platforms**
2. اضغط **Add Platform** > **Web App**
3. املأ:
   - **Name**: Syrian Sales Pro
   - **Hostname**: `localhost` (للتطوير)
   - للإنتاج، أضف: `yourdomain.com`
4. اضغط **Create**

### 7️⃣ تحديث `.env.local`

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID_HERE  # من الخطوة 3
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
```

---

## 🖥️ الخيار 2: Self-Hosted على Plesk

### المتطلبات الأساسية

- ✅ VPS أو Dedicated Server
- ✅ Docker مثبت
- ✅ 2GB RAM على الأقل
- ✅ Plesk Control Panel

### 1️⃣ تثبيت Docker على Plesk

```bash
# SSH إلى الخادم
ssh root@your-server-ip

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# تثبيت Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2️⃣ تثبيت Appwrite

```bash
# إنشاء مجلد للمشروع
mkdir -p /var/appwrite
cd /var/appwrite

# تحميل Appwrite
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.5

# سيسألك عن:
# - HTTP Port: 80
# - HTTPS Port: 443
# - Hostname: yourdomain.com
```

### 3️⃣ تشغيل Appwrite

```bash
cd /var/appwrite
docker-compose up -d
```

### 4️⃣ الوصول إلى لوحة التحكم

افتح المتصفح:
```
https://yourdomain.com
```

- **Email**: admin@example.com (غيّره فوراً!)
- **Password**: (ستُطلب منك إنشاء واحدة)

### 5️⃣ إنشاء مشروع

اتبع نفس الخطوات من **الخيار 1 > الخطوة 2-6**

### 6️⃣ تحديث `.env.local`

```env
VITE_APPWRITE_ENDPOINT=https://yourdomain.com/v1  # ليس cloud.appwrite.io
VITE_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
```

### 7️⃣ إعداد SSL مع Plesk

1. في Plesk، اذهب **Domains > yourdomain.com**
2. اذهب **SSL/TLS Certificates**
3. استخدم **Let's Encrypt** (مجاني)
4. فعّل **Secure your connection**

---

## 🔧 تكوين المشروع

### تحديث package.json

تم تثبيت `appwrite` تلقائياً:
```json
{
  "dependencies": {
    "appwrite": "^14.0.1"
  }
}
```

### تحديث الكود

تم تحديث `lib/supabase.ts` ليستخدم Appwrite SDK.

الـ API متوافق - لن تحتاج تغييرات أخرى!

---

## ✅ اختبار التطبيق

### 1️⃣ تشغيل محلي

```bash
npm run dev
```

### 2️⃣ افتح المتصفح

```
http://localhost:3000
```

### 3️⃣ جرّب التسجيل

1. اضغط **إنشاء حساب**
2. أدخل بريد إلكتروني وكلمة مرور
3. يجب أن يعمل بدون مشاكل!

---

## 🗄️ قاعدة البيانات (اختياري)

إذا أردت حفظ بيانات الشركة/العملاء في Appwrite:

### 1️⃣ إنشاء Database

في لوحة التحكم:
1. اذهب **Databases**
2. اضغط **Create Database**
3. اسم: `sales_pro`

### 2️⃣ إنشاء Collections

#### Collection: companies
```json
{
  "name": "companies",
  "permissions": "document",
  "attributes": [
    { "key": "user_id", "type": "string", "size": 255, "required": true },
    { "key": "company_name", "type": "string", "size": 255 },
    { "key": "mission", "type": "string", "size": 5000 },
    { "key": "services", "type": "string", "size": 5000 }
  ]
}
```

#### Collection: customers
```json
{
  "name": "customers",
  "permissions": "document",
  "attributes": [
    { "key": "user_id", "type": "string", "size": 255, "required": true },
    { "key": "name", "type": "string", "size": 255 },
    { "key": "industry", "type": "string", "size": 255 },
    { "key": "notes", "type": "string", "size": 5000 }
  ]
}
```

### 3️⃣ إعداد Permissions

لكل Collection:
1. اذهب **Settings > Permissions**
2. أضف:
   - **Role**: Any
   - **Create**: ✅
   - **Read**: ✅ (Own documents)
   - **Update**: ✅ (Own documents)
   - **Delete**: ✅ (Own documents)

---

## 📊 API Usage مثال

```typescript
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID');

const databases = new Databases(client);

// Create document
await databases.createDocument(
    'sales_pro',      // Database ID
    'companies',      // Collection ID
    ID.unique(),      // Document ID
    {
        user_id: user.id,
        company_name: 'My Company',
        mission: 'Help businesses grow'
    }
);

// List documents
const docs = await databases.listDocuments(
    'sales_pro',
    'companies'
);
```

---

## 🔐 الأمان

### Best Practices

1. **لا تشارك Project ID علناً** - الكود الذي يستخدمه آمن
2. **استخدم HTTPS** في الإنتاج
3. **فعّل Email Verification** للأمان الإضافي
4. **استخدم Rate Limiting** في Appwrite
5. **راجع Permissions** بانتظام

### إعداد Rate Limiting

في Appwrite Dashboard:
1. **Settings > Security**
2. فعّل:
   - **Rate Limits**: 60 requests/minute
   - **Failed Login Attempts**: 5 max
   - **Session Length**: 30 days

---

## 🚀 النشر على Vercel

### 1️⃣ أضف Environment Variables

في Vercel Dashboard:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_OPENAI_API_KEY=your_key
VITE_GEMINI_API_KEY=your_key
```

### 2️⃣ أضف Platform في Appwrite

1. **Settings > Platforms > Add Platform**
2. **Hostname**: `your-app.vercel.app`
3. **Create**

### 3️⃣ Deploy

```bash
vercel --prod
```

---

## 🐛 Troubleshooting

### خطأ: Missing environment variables
```bash
# تحقق من .env.local
cat .env.local

# يجب أن يحتوي على:
VITE_APPWRITE_ENDPOINT=...
VITE_APPWRITE_PROJECT_ID=...
```

### خطأ: Account creation failed
- تحقق من تفعيل Email/Password في Appwrite Dashboard
- تأكد من Platform hostname صحيح

### خطأ: OAuth failed
- تحقق من Redirect URLs في Google/GitHub console
- تطابق Callback URL في Appwrite settings

### خطأ: CORS blocked
- أضف domain في **Platforms** في Appwrite
- تأكد من Hostname صحيح

---

## 📚 الموارد

- [Appwrite Docs](https://appwrite.io/docs)
- [Appwrite Cloud](https://cloud.appwrite.io)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)
- [Community Discord](https://appwrite.io/discord)

---

## 🎉 مقارنة: Appwrite vs Supabase

| الميزة | Appwrite | Supabase |
|--------|----------|----------|
| **السعر** | مجاني (self-hosted) | مجاني حتى 500MB |
| **Open Source** | ✅ نعم | ✅ نعم |
| **Self-Hosted** | ✅ سهل جداً | ⚠️ معقد |
| **Dashboard UI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **OAuth** | ✅ 30+ providers | ✅ 10+ providers |
| **Storage** | ✅ مدمج | ✅ مدمج |
| **Functions** | ✅ Serverless | ✅ Edge Functions |
| **Real-time** | ✅ نعم | ✅ نعم |
| **Database** | MongoDB (NoSQL) | PostgreSQL (SQL) |

---

**مبروك!** مشروعك الآن يعمل مع Appwrite! 🎉

**للدعم:** راجع [00-START-HERE.md](./00-START-HERE.md) و [EXAMPLES.md](./EXAMPLES.md)
