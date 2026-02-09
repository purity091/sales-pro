#!/bin/bash
# Vercel Environment Variables Setup Script

echo "🚀 تكوين Vercel Environment Variables..."

# ملاحظة: تأكد من تثبيت Vercel CLI أولاً:
# npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع
vercel link

# إضافة المتغيرات البيئية
vercel env add VITE_APPWRITE_ENDPOINT production
# عند السؤال أدخل: https://fra.cloud.appwrite.io/v1

vercel env add VITE_APPWRITE_PROJECT_ID production
# عند السؤال أدخل: 698a5267000a7af7e0c9

vercel env add VITE_OPENAI_API_KEY production
# عند السؤال أدخل: مفتاح OpenAI الحقيقي

vercel env add VITE_GEMINI_API_KEY production
# عند السؤال أدخل: مفتاح Gemini الحقيقي

# إعادة النشر
vercel --prod

echo "✅ تم! افتح الموقع وسيعمل بشكل صحيح"
