
import React, { useState, useEffect, useRef } from 'react';
import { SalesMode, Message, Suggestion, SalesContext, CustomerContext, Language, AppTab } from './types';
import { DEFAULT_CONTEXT, DEFAULT_CUSTOMER_CONTEXT, SALES_MODES_CONFIG } from './constants';
import { generateSalesSuggestions } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import SuggestionSection from './components/SuggestionSection';

const STORAGE_KEY_COMPANY = 'sales_pro_company_context';
const STORAGE_KEY_CUSTOMER = 'sales_pro_customer_context';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SALES);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<SalesMode>(SalesMode.INITIAL_OUTREACH);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.SYRIAN);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<SalesContext>(DEFAULT_CONTEXT);
  const [customerContext, setCustomerContext] = useState<CustomerContext>(DEFAULT_CUSTOMER_CONTEXT);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCompany = localStorage.getItem(STORAGE_KEY_COMPANY);
    const savedCustomer = localStorage.getItem(STORAGE_KEY_CUSTOMER);

    if (savedCompany) {
      try { setContext(JSON.parse(savedCompany)); } catch (e) { console.error("Error loading company context", e); }
    }
    if (savedCustomer) {
      try { setCustomerContext(JSON.parse(savedCustomer)); } catch (e) { console.error("Error loading customer context", e); }
    }
  }, []);

  // Debounced save to localStorage - runs after 1 second of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(context));
    }, 1000);
    return () => clearTimeout(timer);
  }, [context]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customerContext));
    }, 1000);
    return () => clearTimeout(timer);
  }, [customerContext]);

  const handleGenerate = async () => {
    if (selectedMode !== SalesMode.INITIAL_OUTREACH && !currentInput.trim()) return;

    setIsLoading(true);

    if (selectedMode !== SalesMode.ENHANCE && selectedMode !== SalesMode.INITIAL_OUTREACH && currentInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'customer',
        content: currentInput,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    }

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const newSuggestions = await generateSalesSuggestions(
      selectedMode,
      selectedLanguage,
      currentInput,
      history,
      context,
      customerContext
    );

    setSuggestions(newSuggestions);
    setIsLoading(false);

    if (selectedMode !== SalesMode.ENHANCE && selectedMode !== SalesMode.INITIAL_OUTREACH) {
      setCurrentInput('');
    }
  };

  const useSuggestion = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'rep',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    navigator.clipboard.writeText(text).catch(() => { });
  };

  const exportData = () => {
    const data = {
      company: context,
      customer: customerContext,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-pro-backup-${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (data.company) setContext(data.company);
        if (data.customer) setCustomerContext(data.customer);
        alert("تم استيراد البيانات بنجاح!");
      } catch (err) {
        alert("خطأ في قراءة ملف النسخ الاحتياطي.");
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في تصفير البيانات والعودة للقيم الافتراضية؟")) {
      setContext(DEFAULT_CONTEXT);
      setCustomerContext(DEFAULT_CUSTOMER_CONTEXT);
      localStorage.removeItem(STORAGE_KEY_COMPANY);
      localStorage.removeItem(STORAGE_KEY_CUSTOMER);
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={importData}
        accept=".json"
        className="hidden"
      />

      {/* Top Header & Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row items-center justify-between z-10 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-200 rotate-3 group hover:rotate-0 transition-transform cursor-pointer">
            <i className="fa-solid fa-brain text-white text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">سيريَن سيلز برو <span className="text-indigo-600">AI</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-right">خبير الإقناع السلوكي</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab(AppTab.SALES)}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === AppTab.SALES ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-comment-dots"></i>
            غرفة العمليات
          </button>
          <button
            onClick={() => setActiveTab(AppTab.CUSTOMER)}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === AppTab.CUSTOMER ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-user-tag"></i>
            ملف الزبون
          </button>
          <button
            onClick={() => setActiveTab(AppTab.PROFILE)}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === AppTab.PROFILE ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-database"></i>
            معرفة الشركة
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedLanguage(Language.SYRIAN)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLanguage === Language.SYRIAN ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              لهجة سورية
            </button>
            <button
              onClick={() => setSelectedLanguage(Language.GULF)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLanguage === Language.GULF ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              لهجة خليجية
            </button>
            <button
              onClick={() => setSelectedLanguage(Language.FORMAL)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLanguage === Language.FORMAL ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              فصحى بيعية
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {activeTab === AppTab.SALES ? (
          /* SALES WORKSPACE VIEW */
          <div className="flex-1 flex overflow-hidden bg-slate-50/30">
            {/* Suggestions SidePanel (Left) */}
            <div className="hidden md:flex flex-col w-[42%] bg-white overflow-hidden border-l border-slate-200 shadow-2xl z-0">
              <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200"></div>
                    الاقتراحات النفسية
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">بناءً على علم النفس السلوكي</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <i className="fa-solid fa-sparkles"></i>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20">
                <SuggestionSection
                  suggestions={suggestions}
                  onSelect={useSuggestion}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Chat Area (Right) */}
            <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden md:max-w-[58%]">
              <ChatWindow messages={messages} />

              {/* Input Workspace */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="mb-4 flex flex-wrap gap-2 justify-end">
                  {(Object.values(SalesMode) as SalesMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border-2 ${selectedMode === mode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                          : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <i className={`fa-solid ${SALES_MODES_CONFIG[mode].icon}`}></i>
                      {SALES_MODES_CONFIG[mode].label}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-end gap-4 flex-row-reverse">
                  <div className="flex-1">
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      dir="rtl"
                      placeholder={
                        selectedMode === SalesMode.INITIAL_OUTREACH
                          ? "أدخل نبذة عن العميل أو اترك الحقل فارغاً للتوليد من البروفايل..."
                          : "الصق نص محادثة العميل هنا لتحليل نفسيته والرد..."
                      }
                      className="w-full text-base border-2 border-slate-50 rounded-2xl focus:ring-0 focus:border-indigo-400 p-5 min-h-[120px] resize-none transition-all custom-scrollbar bg-slate-50/50 text-right font-medium placeholder:text-slate-300"
                    />
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="h-16 w-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white shadow-xl shadow-indigo-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0 group"
                  >
                    {isLoading ? (
                      <i className="fa-solid fa-circle-notch fa-spin text-2xl"></i>
                    ) : (
                      <i className="fa-solid fa-bolt-lightning text-2xl group-hover:animate-pulse"></i>
                    )}
                  </button>
                </div>
                <div className="mt-3 flex justify-between items-center px-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                    <i className="fa-solid fa-shield-check text-emerald-500"></i>
                    وضع آمن • مبيعات سورية
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold">Ctrl + Enter للارسال السريع</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === AppTab.CUSTOMER ? (
          /* CUSTOMER PROFILE VIEW */
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-10" dir="rtl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-right">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">معلومات الزبون <span className="text-indigo-600">الحالي</span></h2>
                  <p className="text-slate-500 mt-2 text-lg font-medium">أدخل تفاصيل الشخص الذي تحادثه الآن لتخصيص الردود باسمه وظروفه الخاصة.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl text-xs font-black border border-indigo-100 flex items-center gap-2 shadow-sm hover:bg-indigo-100 transition-colors"
                  >
                    <i className="fa-solid fa-upload"></i>
                    استيراد
                  </button>
                  <button
                    onClick={exportData}
                    className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black border border-emerald-100 flex items-center gap-2 shadow-sm hover:bg-emerald-100 transition-colors"
                  >
                    <i className="fa-solid fa-download"></i>
                    تصدير
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Customer Info */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-right hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4 justify-end mb-2">
                    <h3 className="text-xl font-black text-slate-800">البيانات الأساسية</h3>
                    <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                      <i className="fa-solid fa-id-card text-lg"></i>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">اسم الزبون</label>
                      <input
                        type="text"
                        value={customerContext.name}
                        onChange={(e) => setCustomerContext({ ...customerContext, name: e.target.value })}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 text-right font-bold transition-all"
                        placeholder="مثال: السيد أحمد"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">المجال / الوظيفة</label>
                      <input
                        type="text"
                        value={customerContext.industry}
                        onChange={(e) => setCustomerContext({ ...customerContext, industry: e.target.value })}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 text-right font-bold transition-all"
                        placeholder="مثال: صاحب معمل بلاستيك"
                      />
                    </div>
                  </div>
                </div>

                {/* Sales Logic Info */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-right hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4 justify-end mb-2">
                    <h3 className="text-xl font-black text-slate-800">الوضع المالي</h3>
                    <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                      <i className="fa-solid fa-coins text-lg"></i>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">الميزانية المتوقعة</label>
                      <input
                        type="text"
                        value={customerContext.budget}
                        onChange={(e) => setCustomerContext({ ...customerContext, budget: e.target.value })}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 text-right font-bold transition-all"
                        placeholder="مثال: يبحث عن أرخص عرض أو ميزانية مفتوحة"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">نقاط الألم (أكبر مشاكله)</label>
                      <textarea
                        value={customerContext.painPoints}
                        onChange={(e) => setCustomerContext({ ...customerContext, painPoints: e.target.value })}
                        rows={2}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 resize-none text-right font-medium transition-all"
                        placeholder="ما الذي يزعجه حالياً؟"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 justify-end">
                    ملاحظات إضافية عن العميل
                    <i className="fa-solid fa-sticky-note text-indigo-500"></i>
                  </h3>
                  <textarea
                    value={customerContext.notes}
                    onChange={(e) => setCustomerContext({ ...customerContext, notes: e.target.value })}
                    rows={4}
                    className="w-full text-base border-2 border-slate-50 rounded-2xl focus:border-indigo-400 p-5 bg-slate-50/50 text-right font-medium transition-all custom-scrollbar"
                    placeholder="أي تفاصيل أخرى تساعد في الإقناع (مثلاً: شخص متردد، يطلب الكثير من التفاصيل الفنية، الخ...)"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* COMPANY PROFILE MANAGEMENT VIEW (Full Width) */
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-10" dir="rtl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-right">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">هوية المشروع <span className="text-indigo-600">&</span> الخدمات</h2>
                  <p className="text-slate-500 mt-2 text-lg font-medium">كلما كانت البيانات أدق، كان المساعد أكثر إقناعاً وقدرة على إغلاق الصفقات.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={resetData}
                    className="bg-rose-50 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-black border border-rose-100 flex items-center gap-2 shadow-sm hover:bg-rose-100 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    تصفير
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl text-xs font-black border border-indigo-100 flex items-center gap-2 shadow-sm hover:bg-indigo-100 transition-colors"
                  >
                    <i className="fa-solid fa-upload"></i>
                    استيراد
                  </button>
                  <button
                    onClick={exportData}
                    className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black border border-emerald-100 flex items-center gap-2 shadow-sm hover:bg-emerald-100 transition-colors"
                  >
                    <i className="fa-solid fa-download"></i>
                    تصدير
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand Identity Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-right hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4 justify-end mb-2">
                    <h3 className="text-xl font-black text-slate-800">البراند والرسالة</h3>
                    <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                      <i className="fa-solid fa-fingerprint text-lg"></i>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">اسم البراند / الشركة</label>
                      <input
                        type="text"
                        value={context.companyName}
                        onChange={(e) => setContext({ ...context, companyName: e.target.value })}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 text-right font-bold transition-all"
                        placeholder="مثال: متجر شام للمفروشات"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">مهمة الشركة (الوعود البيعية)</label>
                      <textarea
                        value={context.mission}
                        onChange={(e) => setContext({ ...context, mission: e.target.value })}
                        rows={4}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 resize-none text-right font-medium transition-all"
                        placeholder="ما هو الوعد الذي تقدمه لعملائك؟"
                      />
                    </div>
                  </div>
                </div>

                {/* Audience & Strategy Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-right hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4 justify-end mb-2">
                    <h3 className="text-xl font-black text-slate-800">استراتيجية الاستهداف</h3>
                    <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                      <i className="fa-solid fa-bullseye text-lg"></i>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">الجمهور المستهدف (Pain Points)</label>
                      <textarea
                        value={context.targetAudience}
                        onChange={(e) => setContext({ ...context, targetAudience: e.target.value })}
                        rows={4}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 resize-none text-right font-medium transition-all"
                        placeholder="من هم عملاؤك؟ وما هي مشاكلهم التي تحلها؟"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">مرحلة قمع المبيعات الافتراضية</label>
                      <select
                        value={context.buyingStage}
                        onChange={(e) => setContext({ ...context, buyingStage: e.target.value })}
                        className="w-full text-base border-2 border-slate-50 rounded-xl focus:border-indigo-400 p-3.5 bg-slate-50/50 text-right font-bold transition-all"
                      >
                        <option value="Awareness">وعي بالعلامة (بارد)</option>
                        <option value="Interest">اهتمام (دافئ)</option>
                        <option value="Consideration">تفكير ومقارنة</option>
                        <option value="Negotiation">تفاوض نهائي</option>
                        <option value="Closing">إغلاق الصفقة (حار)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Full Width Sections */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 justify-end">
                      قائمة الخدمات والفوائد
                      <i className="fa-solid fa-rocket text-indigo-500"></i>
                    </h3>
                    <textarea
                      value={context.services}
                      onChange={(e) => setContext({ ...context, services: e.target.value })}
                      rows={8}
                      className="w-full text-base border-2 border-slate-50 rounded-2xl focus:border-indigo-400 p-5 bg-slate-50/50 text-right font-medium transition-all custom-scrollbar"
                      placeholder="اذكر الخدمات بالتفصيل مع التركيز على الميزات التنافسية..."
                    />
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm text-right space-y-4 bg-indigo-50/5">
                    <h3 className="text-xl font-black text-indigo-900 flex items-center gap-3 justify-end">
                      خريطة الأسعار والعروض
                      <i className="fa-solid fa-tags"></i>
                    </h3>
                    <textarea
                      value={context.pricingPolicy}
                      onChange={(e) => setContext({ ...context, pricingPolicy: e.target.value })}
                      rows={8}
                      className="w-full text-base border-2 border-indigo-50 rounded-2xl focus:border-indigo-400 p-5 bg-white text-right font-medium transition-all custom-scrollbar shadow-inner"
                      placeholder="اذكر الأسعار، الخصومات المتاحة، وسياستك في التفاوض..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Drawer */}
      {suggestions.length > 0 && activeTab === AppTab.SALES && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 h-[70vh] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] border-t border-slate-200 flex flex-col animate-in slide-in-from-bottom duration-500">
          <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto my-4"></div>
          <div className="flex-1 overflow-y-auto px-6 pb-12">
            <h3 className="text-xl font-black text-slate-900 mb-6 text-right">الاقتراحات الذكية</h3>
            <SuggestionSection
              suggestions={suggestions}
              onSelect={(text) => {
                useSuggestion(text);
                setSuggestions([]);
              }}
              isLoading={isLoading}
            />
          </div>
          <button
            onClick={() => setSuggestions([])}
            className="absolute top-6 left-6 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
