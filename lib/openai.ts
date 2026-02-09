import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
    console.warn('OpenAI API key is not set. Please add VITE_OPENAI_API_KEY to your .env.local file.');
}

export const openai = new OpenAI({
    apiKey: apiKey || '',
    dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const openAIHelpers = {
    // Generate chat completion
    async chat(
        messages: ChatMessage[],
        options?: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
            stream?: boolean;
        }
    ) {
        try {
            const completion = await openai.chat.completions.create({
                model: options?.model || 'gpt-4o-mini',
                messages,
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens,
                stream: options?.stream ?? false,
            });

            return {
                data: completion,
                error: null,
            };
        } catch (error: any) {
            return {
                data: null,
                error: error.message || 'OpenAI API error',
            };
        }
    },

    // Generate sales suggestions using OpenAI
    async generateSalesSuggestions(
        context: string,
        customerInfo: string,
        salesMode: string,
        language: string
    ) {
        const systemPrompt = `أنت مساعد مبيعات محترف ومتخصص. مهمتك هي تقديم اقتراحات مبيعات ذكية ومخصصة.
اللغة المطلوبة: ${language === 'ar' ? 'العربية' : 'English'}
نوع المبيعات: ${salesMode}`;

        const userPrompt = `معلومات الشركة/المنتج:
${context}

معلومات العميل:
${customerInfo}

قدم اقتراحات مبيعات محددة وعملية تناسب هذا السياق.`;

        const messages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ];

        return this.chat(messages, {
            temperature: 0.8,
            maxTokens: 1000,
        });
    },

    // Generate streaming response
    async chatStream(
        messages: ChatMessage[],
        onChunk: (chunk: string) => void,
        options?: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
        }
    ) {
        try {
            const stream = await openai.chat.completions.create({
                model: options?.model || 'gpt-4o-mini',
                messages,
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    onChunk(content);
                }
            }

            return { error: null };
        } catch (error: any) {
            return { error: error.message || 'OpenAI streaming error' };
        }
    },

    // Generate embeddings
    async createEmbedding(text: string) {
        try {
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
            });

            return {
                data: response.data[0].embedding,
                error: null,
            };
        } catch (error: any) {
            return {
                data: null,
                error: error.message || 'Embedding generation error',
            };
        }
    },

    // Analyze sentiment
    async analyzeSentiment(text: string, language: string = 'ar') {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `أنت محلل مشاعر متخصص. قم بتحليل النص وإرجاع التقييم: (إيجابي/سلبي/محايد) مع درجة الثقة.${language === 'ar' ? ' أجب بالعربية.' : ' Answer in English.'
                    }`,
            },
            { role: 'user', content: text },
        ];

        return this.chat(messages, {
            temperature: 0.3,
            maxTokens: 200,
        });
    },
};
