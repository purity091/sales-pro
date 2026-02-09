# أمثلة على استخدام المكتبات 💡

هذا الملف يحتوي على أمثلة عملية لكيفية استخدام المكتبات المُدمجة في المشروع.

---

## 🔐 Supabase Authentication

### 1. تسجيل الدخول

```typescript
import { authHelpers } from './lib/supabase';

// تسجيل دخول بالبريد الإلكتروني
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await authHelpers.signIn(email, password);
  
  if (error) {
    console.error('Login error:', error);
    return;
  }
  
  console.log('Logged in user:', data.user);
};
```

### 2. إنشاء حساب جديد

```typescript
// تسجيل مع metadata إضافية
const handleSignup = async (email: string, password: string) => {
  const { data, error } = await authHelpers.signUp(
    email, 
    password,
    {
      full_name: 'أحمد محمد',
      company: 'شركتي'
    }
  );
  
  if (error) {
    console.error('Signup error:', error);
    return;
  }
  
  console.log('Account created:', data.user);
};
```

### 3. OAuth Sign In

```typescript
// تسجيل دخول بـ Google
const loginWithGoogle = async () => {
  const { data, error } = await authHelpers.signInWithOAuth('google');
  
  if (error) {
    console.error('OAuth error:', error);
  }
};

// تسجيل دخول بـ GitHub
const loginWithGitHub = async () => {
  const { data, error } = await authHelpers.signInWithOAuth('github');
  
  if (error) {
    console.error('OAuth error:', error);
  }
};
```

### 4. إدارة الجلسة

```typescript
// الحصول على المستخدم الحالي
const getCurrentUser = async () => {
  const { user, error } = await authHelpers.getCurrentUser();
  
  if (user) {
    console.log('Current user:', user.email);
  }
};

// الحصول على الجلسة
const getSession = async () => {
  const { session, error } = await authHelpers.getSession();
  
  if (session) {
    console.log('Session expires at:', session.expires_at);
  }
};

// تسجيل الخروج
const logout = async () => {
  const { error } = await authHelpers.signOut();
  
  if (!error) {
    console.log('Logged out successfully');
  }
};
```

### 5. مراقبة حالة المصادقة

```typescript
import { useEffect } from 'react';
import { authHelpers } from './lib/supabase';

const MyComponent = () => {
  useEffect(() => {
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        console.log('Session:', session);
        
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in');
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
```

---

## 🤖 OpenAI Integration

### 1. توليد محادثة بسيطة

```typescript
import { openAIHelpers } from './lib/openai';

const generateResponse = async () => {
  const messages = [
    {
      role: 'system',
      content: 'أنت مساعد مبيعات محترف'
    },
    {
      role: 'user',
      content: 'كيف أتعامل مع اعتراض: "السعر غالي"؟'
    }
  ];
  
  const { data, error } = await openAIHelpers.chat(messages);
  
  if (error) {
    console.error('OpenAI error:', error);
    return;
  }
  
  console.log('Response:', data.choices[0].message.content);
};
```

### 2. توليد اقتراحات مبيعات

```typescript
const getSalesSuggestions = async () => {
  const { data, error } = await openAIHelpers.generateSalesSuggestions(
    'نبيع برامج محاسبة للشركات الصغيرة',  // معلومات الشركة
    'صاحب محل تجزئة، يبحث عن حل للمخزون',  // معلومات العميل
    'initial_outreach',                        // وضع المبيعات
    'ar'                                       // اللغة
  );
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Suggestions:', data);
};
```

### 3. Streaming Responses

```typescript
const streamChat = async () => {
  const messages = [
    {
      role: 'user',
      content: 'اكتب لي رسالة بريد إلكتروني للتواصل مع عملاء محتملين'
    }
  ];
  
  let fullResponse = '';
  
  await openAIHelpers.chatStream(
    messages,
    (chunk) => {
      // هذه الدالة تُستدعى لكل جزء من النص
      fullResponse += chunk;
      console.log('Received chunk:', chunk);
      // يمكنك تحديث الواجهة هنا
    },
    {
      model: 'gpt-4o-mini',
      temperature: 0.7
    }
  );
  
  console.log('Full response:', fullResponse);
};
```

### 4. تحليل المشاعر

```typescript
const analyzeSentiment = async (text: string) => {
  const { data, error } = await openAIHelpers.analyzeSentiment(
    text,
    'ar'
  );
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Sentiment:', data.choices[0].message.content);
};

// مثال
analyzeSentiment('العميل يبدو غير مقتنع بالمنتج ويطلب خصم كبير');
```

### 5. تخصيص النموذج والخيارات

```typescript
const customChat = async () => {
  const messages = [
    {
      role: 'system',
      content: 'أنت مدرب مبيعات خبير'
    },
    {
      role: 'user',
      content: 'كيف أحسّن مهارات الإقناع؟'
    }
  ];
  
  const { data, error } = await openAIHelpers.chat(messages, {
    model: 'gpt-4',              // نموذج أقوى
    temperature: 0.9,             // إبداع أكثر
    maxTokens: 2000               // استجابة أطول
  });
  
  if (data) {
    console.log(data.choices[0].message.content);
  }
};
```

---

## 🎯 useAuth Hook

### استخدام في مكون React

```typescript
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { user, loading, authenticated, signOut } = useAuth();
  
  if (loading) {
    return <div>جاري التحميل...</div>;
  }
  
  if (!authenticated) {
    return <div>يرجى تسجيل الدخول</div>;
  }
  
  return (
    <div>
      <h1>مرحباً، {user?.email}</h1>
      <button onClick={signOut}>تسجيل الخروج</button>
    </div>
  );
};
```

### حماية صفحة Route

```typescript
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login');
    }
  }, [authenticated, loading, navigate]);
  
  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null;
  
  return (
    <div>محتوى محمي</div>
  );
};
```

---

## 🔄 أمثلة متقدمة

### 1. دمج Supabase + OpenAI

```typescript
import { authHelpers } from './lib/supabase';
import { openAIHelpers } from './lib/openai';

const personalizedSuggestion = async () => {
  // الحصول على معلومات المستخدم
  const { user } = await authHelpers.getCurrentUser();
  
  if (!user) return;
  
  // توليد اقتراح مخصص
  const messages = [
    {
      role: 'system',
      content: `أنت مساعد مبيعات للمستخدم: ${user.email}`
    },
    {
      role: 'user',
      content: 'أعطني نصيحة لليوم'
    }
  ];
  
  const { data } = await openAIHelpers.chat(messages);
  
  if (data) {
    console.log('نصيحة اليوم:', data.choices[0].message.content);
  }
};
```

### 2. Retry Logic

```typescript
const retryableChat = async (messages: any[], maxRetries = 3) => {
  let lastError = null;
  
  for (let i = 0; i < maxRetries; i++) {
    const { data, error } = await openAIHelpers.chat(messages);
    
    if (!error) {
      return data;
    }
    
    lastError = error;
    console.log(`Retry ${i + 1}/${maxRetries}...`);
    
    // انتظر قبل إعادة المحاولة
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
  
  throw new Error(`Failed after ${maxRetries} retries: ${lastError}`);
};
```

### 3. Rate Limiting

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private readonly delayMs: number;
  
  constructor(requestsPerMinute: number) {
    this.delayMs = 60000 / requestsPerMinute;
  }
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) await fn();
      await new Promise(resolve => setTimeout(resolve, this.delayMs));
    }
    
    this.processing = false;
  }
}

// الاستخدام
const limiter = new RateLimiter(10); // 10 requests per minute

const safeChatCall = async (messages: any[]) => {
  return limiter.add(() => openAIHelpers.chat(messages));
};
```

---

## 💾 حفظ البيانات في Supabase Database

```typescript
import { supabase } from './lib/supabase';

// إنشاء جدول (في Supabase Dashboard)
// CREATE TABLE conversations (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   user_id UUID REFERENCES auth.users(id),
//   message TEXT,
//   response TEXT,
//   created_at TIMESTAMP DEFAULT NOW()
// );

const saveConversation = async (message: string, response: string) => {
  const { user } = await authHelpers.getCurrentUser();
  
  if (!user) return;
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      message,
      response
    });
    
  if (error) {
    console.error('Error saving:', error);
  }
  
  return data;
};

const getMyConversations = async () => {
  const { user } = await authHelpers.getCurrentUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Error fetching:', error);
    return [];
  }
  
  return data;
};
```

---

## 🎨 أمثلة UI

### Loading Spinner

```typescript
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <svg 
      className="animate-spin h-8 w-8 text-blue-600" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);
```

### Error Message

```typescript
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  </div>
);
```

---

هذه مجرد أمثلة! يمكنك دمج هذه المكتبات بطرق لا حصر لها حسب احتياجات مشروعك. 🚀
