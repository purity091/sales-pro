
import React from 'react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white rounded-xl border border-slate-200 shadow-sm" dir="rtl">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
          <i className="fa-regular fa-comments text-5xl mb-4"></i>
          <p className="text-lg font-medium">لا توجد رسائل بعد</p>
          <p className="text-sm text-center">أدخل استفسار العميل للبدء في توليد الردود الاحترافية</p>
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'customer' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'customer'
                ? 'bg-slate-100 text-slate-800 rounded-br-none border border-slate-200 text-right'
                : 'bg-indigo-600 text-white rounded-bl-none text-right'
              }`}
          >
            <div className="flex items-center gap-2 mb-1 justify-end">
              <span className="text-[10px] opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {msg.role === 'customer' ? 'العميل' : 'مندوب المبيعات'}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Optimize with React.memo to prevent unnecessary re-renders
export default React.memo(ChatWindow);

