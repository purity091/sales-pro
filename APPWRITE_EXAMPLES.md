# أمثلة استخدام Appwrite 💡

هذا الدليل يحتوي على أمثلة عملية لاستخدام Appwrite في المشروع.

---

## 🔐 المصادقة (Authentication)

### 1. تسجيل حساب جديد

```typescript
import { authHelpers } from './lib/supabase'; // التسمية القديمة - يعمل مع Appwrite

const handleSignup = async (email: string, password: string) => {
  const { data, error } = await authHelpers.signUp(email, password, {
    full_name: 'أحمد محمد',
    company: 'شركة المبيعات'
  });
  
  if (error) {
    console.error('خطأ في التسجيل:', error.message);
    return;
  }
  
  console.log('تم إنشاء الحساب:', data.user);
};
```

### 2. تسجيل الدخول

```typescript
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await authHelpers.signIn(email, password);
  
  if (error) {
    console.error('خطأ في تسجيل الدخول:', error.message);
    return;
  }
  
  console.log('تم تسجيل الدخول:', data.user);
  console.log('الجلسة:', data.session);
};
```

### 3. تسجيل الدخول بـ Google

```typescript
const loginWithGoogle = async () => {
  const { error } = await authHelpers.signInWithOAuth('google');
  
  if (error) {
    console.error('خطأ:', error.message);
  }
  // سيتم إعادة التوجيه تلقائياً لصفحة Google
};
```

### 4. تسجيل الدخول بـ GitHub

```typescript
const loginWithGitHub = async () => {
  await authHelpers.signInWithOAuth('github');
  // سيتم إعادة التوجيه تلقائياً
};
```

### 5. الحصول على المستخدم الحالي

```typescript
const getCurrentUser = async () => {
  const { user, error } = await authHelpers.getCurrentUser();
  
  if (user) {
    console.log('المستخدم:', user.email);
    console.log('الاسم:', user.name);
    console.log('ID:', user.id);
  } else {
    console.log('لم يسجل دخول');
  }
};
```

### 6. إعادة تعيين كلمة المرور

```typescript
const resetPassword = async (email: string) => {
  const { data, error } = await authHelpers.resetPassword(email);
  
  if (error) {
    console.error('خطأ:', error.message);
    return;
  }
  
  console.log('تم إرسال رابط إعادة التعيين');
};
```

### 7. تحديث كلمة المرور

```typescript
// للمستخدم المسجل دخوله
const updateMyPassword = async (newPassword: string) => {
  const { error } = await authHelpers.updatePassword(newPassword);
  
  if (error) {
    console.error('خطأ:', error.message);
    return;
  }
  
  console.log('تم تحديث كلمة المرور');
};

// من رابط إعادة التعيين
const completePasswordReset = async (
  userId: string,
  secret: string,
  newPassword: string
) => {
  const { error } = await authHelpers.updatePassword(
    newPassword,
    userId,
    secret
  );
  
  if (!error) {
    console.log('تم إعادة تعيين كلمة المرور');
  }
};
```

### 8. تسجيل الخروج

```typescript
const logout = async () => {
  const { error } = await authHelpers.signOut();
  
  if (!error) {
    console.log('تم تسجيل الخروج');
  }
};
```

---

## 🗄️ قاعدة البيانات (Databases)

### إعداد Client

```typescript
import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DATABASE_ID = 'sales_pro';
const COMPANIES_COLLECTION = 'companies';
const CUSTOMERS_COLLECTION = 'customers';
```

### 1. إنشاء مستند (Create Document)

```typescript
const createCompany = async (userId: string, companyData: any) => {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      COMPANIES_COLLECTION,
      ID.unique(),
      {
        user_id: userId,
        company_name: companyData.name,
        mission: companyData.mission,
        services: JSON.stringify(companyData.services),
        created_at: new Date().toISOString()
      }
    );
    
    console.log('تم إنشاء الشركة:', document);
    return document;
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### 2. قراءة مستند (Get Document)

```typescript
const getCompany = async (documentId: string) => {
  try {
    const document = await databases.getDocument(
      DATABASE_ID,
      COMPANIES_COLLECTION,
      documentId
    );
    
    return document;
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### 3. قراءة جميع المستندات (List Documents)

```typescript
const getAllCompanies = async (userId: string) => {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      COMPANIES_COLLECTION,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(25)
      ]
    );
    
    console.log(`وُجد ${documents.total} شركة`);
    return documents.documents;
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### 4. البحث في المستندات (Search)

```typescript
const searchCompanies = async (userId: string, searchTerm: string) => {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      COMPANIES_COLLECTION,
      [
        Query.equal('user_id', userId),
        Query.search('company_name', searchTerm)
      ]
    );
    
    return documents.documents;
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### 5. تحديث مستند (Update Document)

```typescript
const updateCompany = async (documentId: string, updates: any) => {
  try {
    const document = await databases.updateDocument(
      DATABASE_ID,
      COMPANIES_COLLECTION,
      documentId,
      updates
    );
    
    console.log('تم التحديث:', document);
    return document;
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### 6. حذف مستند (Delete Document)

```typescript
const deleteCompany = async (documentId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COMPANIES_COLLECTION,
      documentId
    );
    
    console.log('تم الحذف');
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

---

## 📁 تخزين الملفات (Storage)

### إعداد Storage

```typescript
import { Storage, ID } from 'appwrite';

const storage = new Storage(client);
const BUCKET_ID = 'documents'; // أنشئه في Appwrite Dashboard
```

### 1. رفع ملف (Upload File)

```typescript
const uploadFile = async (file: File) => {
  try {
    const response = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file
    );
    
    console.log('تم رفع الملف:', response);
    return response;
  } catch (error) {
    console.error('خطأ:', error);
  }
};

// مثال في React
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    await uploadFile(file);
  }
};
```

### 2. الحصول على رابط الملف (Get File URL)

```typescript
const getFileUrl = (fileId: string) => {
  const url = storage.getFileView(BUCKET_ID, fileId);
  return url;
};

// استخدامه في img tag:
// <img src={getFileUrl(fileId)} alt="صورة" />
```

### 3. تحميل ملف (Download File)

```typescript
const downloadFile = (fileId: string, filename: string) => {
  const url = storage.getFileDownload(BUCKET_ID, fileId);
  
  // فتح في نافذة جديدة
  window.open(url.toString(), '_blank');
};
```

### 4. حذف ملف (Delete File)

```typescript
const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
    console.log('تم حذف الملف');
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

---

## 🔔 Real-time Subscriptions

### الاشتراك في التحديثات

```typescript
import { appwriteClient } from './lib/supabase';

// الاشتراك في تحديثات collection معين
const subscribeToCompanies = () => {
  const unsubscribe = appwriteClient.subscribe(
    `databases.${DATABASE_ID}.collections.${COMPANIES_COLLECTION}.documents`,
    (response) => {
      console.log('حدث جديد:', response);
      
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        console.log('تم إنشاء مستند جديد');
      }
      
      if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        console.log('تم تحديث مستند');
      }
      
      if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
        console.log('تم حذف مستند');
      }
    }
  );
  
  // للإلغاء:
  // unsubscribe();
  
  return unsubscribe;
};

// في React Component
useEffect(() => {
  const unsubscribe = subscribeToCompanies();
  
  return () => {
    unsubscribe();
  };
}, []);
```

---

## 🎯 أمثلة متقدمة

### 1. دمج Auth مع Database

```typescript
const saveUserProfile = async () => {
  // الحصول على المستخدم الحالي
  const { user } = await authHelpers.getCurrentUser();
  
  if (!user) {
    console.log('يجب تسجيل الدخول أولاً');
    return;
  }
  
  // حفظ البيانات
  const profile = await databases.createDocument(
    DATABASE_ID,
    'profiles',
    user.id, // استخدام user ID كـ document ID
    {
      user_id: user.id,
      email: user.email,
      name: user.name,
      settings: {
        language: 'ar',
        theme: 'light'
      }
    }
  );
  
  return profile;
};
```

### 2. Pagination

```typescript
const getCompaniesPaginated = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const offset = (page - 1) * pageSize;
  
  const documents = await databases.listDocuments(
    DATABASE_ID,
    COMPANIES_COLLECTION,
    [
      Query.equal('user_id', userId),
      Query.limit(pageSize),
      Query.offset(offset),
      Query.orderDesc('$createdAt')
    ]
  );
  
  return {
    data: documents.documents,
    total: documents.total,
    page,
    totalPages: Math.ceil(documents.total / pageSize)
  };
};
```

### 3. Batch Operations

```typescript
const createMultipleCustomers = async (
  userId: string,
  customers: any[]
) => {
  const promises = customers.map(customer =>
    databases.createDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION,
      ID.unique(),
      {
        user_id: userId,
        ...customer
      }
    )
  );
  
  const results = await Promise.allSettled(promises);
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`نجح: ${successful}, فشل: ${failed}`);
  return results;
};
```

### 4. Error Handling

```typescript
const safeOperation = async (operation: () => Promise<any>) => {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error: any) {
    console.error('خطأ:', error);
    
    // تحليل أنواع الأخطاء
    if (error.code === 401) {
      return { success: false, error: 'غير مصرح' };
    } else if (error.code === 404) {
      return { success: false, error: 'غير موجود' };
    } else if (error.code === 409) {
      return { success: false, error: 'موجود مسبقاً' };
    }
    
    return { success: false, error: error.message };
  }
};

// الاستخدام
const result = await safeOperation(() => 
  databases.getDocument(DATABASE_ID, COMPANIES_COLLECTION, 'doc_id')
);

if (result.success) {
  console.log('البيانات:', result.data);
} else {
  console.error('الخطأ:', result.error);
}
```

---

## 🎨 أمثلة React Hooks

### useAuth Hook

```typescript
import { useState, useEffect } from 'react';
import { authHelpers } from './lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // التحقق من الجلسة الحالية
    authHelpers.getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });
    
    // الاشتراك في تغييرات الحالة
    const { data } = authHelpers.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user);
      } else if (event === 'SIGNED_OUT') {
setUser(null);
      }
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  
  return { user, loading, authenticated: !!user };
};
```

### useDatabase Hook

```typescript
import { useState, useEffect } from 'react';
import { databases } from './lib/appwrite';

export const useCollection = (
  databaseId: string,
  collectionId: string,
  queries: string[] = []
) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          collectionId,
          queries
        );
        setDocuments(response.documents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [databaseId, collectionId, JSON.stringify(queries)]);
  
  return { documents, loading, error };
};
```

---

هذه مجرد أمثلة! Appwrite قوي جداً ويدعم الكثير من الميزات الأخرى 🚀

**للمزيد:** راجع [APPWRITE_SETUP.md](./APPWRITE_SETUP.md)
