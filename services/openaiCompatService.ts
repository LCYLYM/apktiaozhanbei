import { AppLanguage } from '../types';

interface TranslationResponse {
    translation: string;
    medical_note: string;
}

const resolveBaseUrl = (): string | undefined => {
    const raw = (import.meta.env as any)?.VITE_API_URL as string | undefined;
    const alt = (import.meta.env as any)?.VITE_OPENAI_BASE_URL as string | undefined;

    const urlRaw = (typeof raw === 'string' && raw.trim()) ? raw.trim() : undefined;
    const altRaw = (typeof alt === 'string' && alt.trim()) ? alt.trim() : undefined;

    const base = urlRaw ?? altRaw;
    if (!base) return undefined;
    return base.replace(/\/$/, '');
};

const resolveApiKey = (): string | undefined => {
    const raw = (import.meta.env as any)?.VITE_OPENAI_API_KEY as string | undefined;
    const key = (typeof raw === 'string' && raw.trim()) ? raw.trim() : undefined;
    return key || undefined;
};

const resolveModel = (): string => {
    const raw = (import.meta.env as any)?.VITE_OPENAI_MODEL as string | undefined;
    const model = (typeof raw === 'string' && raw.trim()) ? raw.trim() : undefined;
    return model ?? 'gpt-3.5-turbo-1106';
};

const SYSTEM_PROMPT = `
You are ZhiYuTong (智语通), an emergency crisis translation assistant designed for foreigners in China.
Your primary goal is to facilitate communication between a foreign user and local Chinese doctors, police, or helpers.

Output strictly in JSON format.

Guidelines:
1. 'translation': Provide a clear, natural translation in the target language (usually Chinese Simplified if the user is a foreigner in China).
2. 'medical_note': A very brief, professional note for the recipient explaining the context or urgency. Keep it under 20 words.
3. Keep the tone calm and urgent.
`;

const extractJsonObject = (text: string): string => {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;

    const first = trimmed.indexOf('{');
    const last = trimmed.lastIndexOf('}');
    if (first >= 0 && last > first) return trimmed.slice(first, last + 1);

    return trimmed;
};

const toErrorText = async (res: Response): Promise<string> => {
    try {
        const text = await res.text();
        return text || res.statusText;
    } catch {
        return res.statusText;
    }
};

export const OpenAICompatService = {
    isConfigured(): boolean {
        return Boolean(resolveBaseUrl() && resolveApiKey());
    },

    // 当前默认模型 gpt-3.5 不支持图片；如要启用，请改成支持 vision 的模型并扩展实现。
    isVisionSupported(): boolean {
        return false;
    },

    async translateAndAdvise(text: string, targetLang: string): Promise<TranslationResponse> {
        const baseUrl = resolveBaseUrl();
        const apiKey = resolveApiKey();
        const model = resolveModel();

        if (!baseUrl || !apiKey) {
            throw new Error('Missing OpenAI-compatible config: set VITE_API_URL and VITE_OPENAI_API_KEY');
        }

        const userPrompt = `User Input: "${text}"\nTarget Language Code: ${targetLang || AppLanguage.ZH}\n\nReturn JSON with keys: translation, medical_note.`;

        const res = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt },
                ],
                // Some OpenAI-compatible providers support JSON mode.
                response_format: { type: 'json_object' },
                temperature: 0.2,
            }),
        });

        if (!res.ok) {
            const detail = await toErrorText(res);
            throw new Error(`OpenAI API error ${res.status}: ${detail}`);
        }

        const data = (await res.json()) as any;
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim()) {
            throw new Error('Empty response from OpenAI-compatible API');
        }

        const jsonText = extractJsonObject(content);
        const parsed = JSON.parse(jsonText) as TranslationResponse;

        if (!parsed?.translation || !parsed?.medical_note) {
            throw new Error('Invalid JSON response: missing translation/medical_note');
        }

        return parsed;
    },
};
