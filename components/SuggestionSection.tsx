
import React from 'react';
import { Suggestion } from '../types';

interface SuggestionSectionProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
  isLoading: boolean;
}

const SuggestionSection: React.FC<SuggestionSectionProps> = ({ suggestions, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-slate-200 rounded w-1/4 self-end"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-10 bg-slate-50 rounded-lg w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center" dir="rtl">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <i className="fa-solid fa-brain text-indigo-400 text-3xl"></i>
        </div>
        <p className="font-bold text-slate-700 text-lg">مستعد للإقناع؟</p>
        <p className="text-sm mt-2 text-slate-500 leading-relaxed">
          اختر وضع البيع المناسب وسأقوم بتحليل نفسية العميل لتوليد الرد الأمثل.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6" dir="rtl">
      {suggestions.map((s) => (
        <div
          key={s.id}
          className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 cursor-pointer text-right overflow-hidden shadow-sm"
          onClick={() => onSelect(s.text)}
        >
          {/* Badge for Psychology Tech */}
          <div className="flex justify-between items-center mb-4 flex-row-reverse">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                رد عالي التأثير
              </span>
            </div>
            <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <i className="fa-regular fa-copy text-sm"></i>
            </button>
          </div>

          <p className="text-slate-900 font-bold mb-4 leading-relaxed text-lg tracking-tight">
            {s.text}
          </p>
          
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
            <div className="flex items-center gap-2 mb-1 text-indigo-600">
              <i className="fa-solid fa-lightbulb text-[10px]"></i>
              <span className="text-[10px] font-bold uppercase">الاستراتيجية النفسية</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {s.explanation}
            </p>
          </div>
          
          {/* Subtle decorative element */}
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionSection;
