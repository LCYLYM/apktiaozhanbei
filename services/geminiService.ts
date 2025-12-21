import { GoogleGenAI, Type } from "@google/genai";
import { AppLanguage } from '../types';

const resolveApiKey = (): string | undefined => {
    // Vite exposes env vars on import.meta.env.* (and only VITE_ prefixed by default)
    const viteKeyRaw = import.meta.env.VITE_API_KEY as string | undefined;
    const viteKey = typeof viteKeyRaw === 'string' ? viteKeyRaw.trim() : undefined;
    if (viteKey) return viteKey;

    // Back-compat fallback (some environments inject API_KEY)
    const legacyKeyRaw = (import.meta.env as any)?.API_KEY as string | undefined;
    const legacyKey = typeof legacyKeyRaw === 'string' ? legacyKeyRaw.trim() : undefined;
    if (legacyKey) return legacyKey;

    return undefined;
};

// Initialize Gemini Client
const apiKey = resolveApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey ?? '' });

const SYSTEM_PROMPT = `
You are ZhiYuTong (智语通), an emergency crisis translation assistant designed for foreigners in China.
Your primary goal is to facilitate communication between a foreign user and local Chinese doctors, police, or helpers.

Output strictly in JSON format.

Guidelines:
1. 'translation': Provide a clear, natural translation in the target language (usually Chinese Simplified if the user is a foreigner in China).
2. 'medical_note': A very brief, professional note for the *recipient* (e.g., the doctor) explaining the context or urgency. Keep it under 20 words.
3. Keep the tone calm and urgent.
`;

interface TranslationResponse {
  translation: string;
  medical_note: string;
}

export const GeminiService = {
    isConfigured(): boolean {
        return Boolean(apiKey);
    },
  /**
   * Translates text and provides emergency context.
   */
  async translateAndAdvise(text: string, targetLang: string): Promise<TranslationResponse> {
    try {
                if (!apiKey) {
                    throw new Error('Missing API key: set VITE_API_KEY');
                }
        const prompt = `
        User Input: "${text}"
        Target Language Code: ${targetLang}
        
        Translate the input to the target language.
        If the input describes a symptom or emergency, add a very brief medical/safety note in the target language.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        translation: { type: Type.STRING },
                        medical_note: { type: Type.STRING }
                    },
                    required: ["translation", "medical_note"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as TranslationResponse;
        }
        throw new Error("Empty response from AI");
    } catch (error) {
        console.error("Gemini Translation Error:", error);
        throw error;
    }
  },

  /**
   * Analyzes an image (e.g., medicine, injury) and provides insight.
   */
    async analyzeImage(base64Data: string, targetLang: string, mimeType?: string): Promise<TranslationResponse> {
    try {
                if (!apiKey) {
                    throw new Error('Missing API key: set VITE_API_KEY');
                }
        const prompt = `
        Analyze this image. It is likely a medical situation (injury, medication, or document) encountered by a foreigner in China.
        Target Language Code: ${targetLang}

        1. In 'translation', describe what you see (e.g., "Nitroglycerin bottle" or "Laceration on arm") in the target language so a local can understand.
        2. In 'medical_note', provide immediate first-aid advice or context in the target language.
        `;

        const imagePart = {
            inlineData: {
                mimeType: mimeType || 'image/jpeg', 
                data: base64Data
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Supports vision
            contents: {
                parts: [
                    imagePart,
                    { text: prompt }
                ]
            },
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        translation: { type: Type.STRING },
                        medical_note: { type: Type.STRING }
                    },
                    required: ["translation", "medical_note"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as TranslationResponse;
        }
        throw new Error("Empty response from Vision AI");

    } catch (error) {
        console.error("Gemini Vision Error:", error);
        throw error;
    }
  }
};