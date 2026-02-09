
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../constants";
import { SalesMode, Suggestion, Language, SalesContext, CustomerContext } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Gemini API key not found. Gemini AI features will be disabled.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const getLanguageName = (lang: Language): string => {
  switch (lang) {
    case Language.SYRIAN: return 'لهجة سورية محكية احترافية';
    case Language.GULF: return 'لهجة خليجية مهذبة واحترافية';
    case Language.FORMAL: return 'لغة عربية فصحى بيعية';
    default: return 'لغة عربية بيعية';
  }
};

export const generateSalesSuggestions = async (
  mode: SalesMode,
  language: Language,
  input: string,
  history: { role: string; content: string }[],
  context: SalesContext,
  customerContext: CustomerContext
): Promise<Suggestion[]> => {
  try {
    // Check if Gemini API is available
    if (!ai) {
      console.warn('⚠️ Gemini API not configured. Returning empty suggestions.');
      return [];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
بناءً على المعلومات التالية، قم بتوليد ردود بيعية خارقة:

اللغة المطلوبة: ${getLanguageName(language)}
الوضع: ${mode}

ملف الشركة (المرجع الأساسي):
- الاسم: ${context.companyName}
- المهمة: ${context.mission}
- الخدمات: ${context.services}
- الأسعار: ${context.pricingPolicy}

ملف العميل (لتخصيص الرد):
- اسم العميل: ${customerContext.name || 'غير معروف'}
- المجال: ${customerContext.industry || 'غير معروف'}
- نقاط الألم: ${customerContext.painPoints || 'غير معروفة'}
- الميزانية المتوقعة: ${customerContext.budget || 'غير معروفة'}
- ملاحظات: ${customerContext.notes || 'لا يوجد'}

المطلوب:
1. تحليل نية العميل وحالته النفسية من المدخلات: "${input || 'تواصل أولي'}"
2. اختيار أقوى تقنية نفسية (مثل: Social Proof, Urgency, PAS) لتوليد ردين مقنعين جداً.
3. دمج اسم العميل أو تفاصيل مجاله في الرد إن أمكن لجعله يبدو شخصياً وليس آلياً.
4. التأكد من أن الرد يدفع العميل للخطوة التالية.

سجل المحادثة: ${JSON.stringify(history.slice(-3))}

يرجى الالتزام بتنسيق JSON المطلوب.`
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "text", "explanation"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"suggestions":[]}');
    return result.suggestions;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
