import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, Loader2, Send, Sparkles } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { OpenAICompatService } from '../services/openaiCompatService';
import { LANGUAGES } from '../constants';
import { AppLanguage, ChatMessage } from '../types';

interface Props {
    onBack: () => void;
}

const AiAssistant: React.FC<Props> = ({ onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [targetLang, setTargetLang] = useState<string>(AppLanguage.ZH);

    const useOpenAIText = OpenAICompatService.isConfigured();
    const visionSupported = GeminiService.isConfigured() || OpenAICompatService.isVisionSupported();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputBarRef = useRef<HTMLDivElement>(null);

    const [inputBarHeight, setInputBarHeight] = useState<number>(0);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const keyboardEstimateRef = useRef<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Measure input bar height and listen to visualViewport (keyboard) changes
    useEffect(() => {
        const measure = () => setInputBarHeight(inputBarRef.current?.offsetHeight ?? 0);
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    useEffect(() => {
        const vv = (window as any).visualViewport;
        const KH_MIN = 80; // ignore small viewport changes (address bar / chrome hiding)
        if (vv) {
            const onResize = () => {
                // raw keyboard height approximation
                const raw = Math.max(0, window.innerHeight - vv.height - (vv.offsetTop || 0));
                // clamp to reasonable max (70% of viewport)
                const maxKh = Math.round(window.innerHeight * 0.7);
                const clamped = Math.min(raw, maxKh);

                // treat as keyboard only if it's meaningfully large
                const candidateKh = clamped >= KH_MIN ? clamped : 0;

                const inputFocused = inputRef.current && document.activeElement === inputRef.current;
                const wasOpen = keyboardEstimateRef.current != null && keyboardEstimateRef.current > 0;

                // Only update keyboard height when input is focused or keyboard was already open.
                if (inputFocused || wasOpen) {
                    setKeyboardHeight(candidateKh);
                    keyboardEstimateRef.current = candidateKh || null;
                    // allow layout settle then scroll
                    setTimeout(scrollToBottom, 60);
                } else {
                    // Ignore incidental viewport changes; ensure keyboard is considered closed.
                    if (candidateKh === 0 && keyboardEstimateRef.current) {
                        keyboardEstimateRef.current = null;
                        setKeyboardHeight(0);
                    }
                }
            };
            vv.addEventListener('resize', onResize);
            vv.addEventListener('scroll', onResize);
            // initial measure
            onResize();
            return () => {
                vv.removeEventListener('resize', onResize);
                vv.removeEventListener('scroll', onResize);
            };
        } else {
            // visualViewport not available: use focus/blur heuristic on input
            const inputEl = inputRef.current;
            if (!inputEl) return;
            const onFocus = () => {
                // conservative estimate
                const est = Math.round(window.innerHeight * 0.45);
                keyboardEstimateRef.current = est;
                setKeyboardHeight(est);
                setTimeout(scrollToBottom, 60);
            };
            const onBlur = () => {
                keyboardEstimateRef.current = null;
                setKeyboardHeight(0);
            };
            inputEl.addEventListener('focus', onFocus);
            inputEl.addEventListener('blur', onBlur);
            return () => {
                inputEl.removeEventListener('focus', onFocus);
                inputEl.removeEventListener('blur', onBlur);
            };
        }
    }, []);

    useEffect(scrollToBottom, [messages, keyboardHeight]);

    const appendSystemError = (text: string) => {
        const errorMsg: ChatMessage = {
            id: `${Date.now()}-error`,
            role: 'model',
            text,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMsg]);
    };

    const normalizeError = (e: unknown): string => {
        if (e instanceof Error) return e.message;
        if (typeof e === 'string') return e;
        try {
            return JSON.stringify(e);
        } catch {
            return 'Unknown error';
        }
    };

    const toUserFriendlyError = (raw: string): string => {
        const lower = raw.toLowerCase();
        if (lower.includes('missing api key') || lower.includes('vite_api_key')) {
            return 'AI 未配置：请设置 VITE_API_KEY 后重试。';
        }
        if (lower.includes('missing openai-compatible config') || lower.includes('vite_openai_api_key') || lower.includes('vite_api_url')) {
            return 'AI 未配置：请设置 VITE_API_URL 与 VITE_OPENAI_API_KEY 后重试。';
        }
        if (lower.includes('401') || lower.includes('unauthorized')) {
            return '鉴权失败：请检查 API Key 是否正确/是否已过期。';
        }
        if (lower.includes('network') || lower.includes('failed to fetch')) {
            return '网络错误：请检查网络连接后重试。';
        }
        if (lower.includes('quota') || lower.includes('rate')) {
            return '服务繁忙：请稍后再试。';
        }
        return raw;
    };

    const handleSendMessage = async () => {
        const text = inputText.trim();
        if (!text || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = useOpenAIText
                ? await OpenAICompatService.translateAndAdvise(userMsg.text, targetLang)
                : await GeminiService.translateAndAdvise(userMsg.text, targetLang);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: result.translation,
                medicalNote: result.medical_note,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            const msg = toUserFriendlyError(normalizeError(e));
            console.error('AI translate error:', e);
            setErrorMessage(msg);
            appendSystemError(`请求失败：${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (isLoading) {
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            setErrorMessage('仅支持图片文件（image/*）。');
            appendSystemError('上传失败：请选择图片文件。');
            e.target.value = '';
            return;
        }

        if (!visionSupported) {
            setErrorMessage('当前 AI 配置不支持图片分析。');
            appendSystemError('图片分析不可用：请配置 Gemini（VITE_API_KEY）或使用支持图片的模型。');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            const mimeType = base64String.slice(5, base64String.indexOf(';')) || file.type;

            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                text: '',
                tag: '图片分析',
                image: base64String,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, userMsg]);
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result = await GeminiService.analyzeImage(base64Data, targetLang, mimeType);
                const aiMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: result.translation,
                    medicalNote: result.medical_note,
                    timestamp: Date.now(),
                };
                setMessages(prev => [...prev, aiMsg]);
            } catch (err) {
                const msg = toUserFriendlyError(normalizeError(err));
                console.error('AI image analyze error:', err);
                setErrorMessage(msg);
                appendSystemError(`图片分析失败：${msg}`);
            } finally {
                setIsLoading(false);
                e.target.value = '';
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col h-full relative z-10">
            <div className="glass-panel border-b-0 m-2 rounded-2xl p-3 flex items-center justify-between shadow-sm z-20">
                <button onClick={onBack} className="p-2 hover:bg-white/40 rounded-full transition-colors" aria-label="返回">
                    <ArrowLeft className="text-slate-700" size={20} />
                </button>

                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-slate-800 flex items-center gap-1">
                        AI 智语通 <Sparkles size={14} className="text-indigo-500" />
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                        {useOpenAIText ? 'OpenAI Compatible • Smart Assistant' : 'Gemini 2.5 • Smart Assistant'}
                    </span>
                </div>

                <button
                    onClick={onBack}
                    className="px-3 py-1.5 text-xs font-bold rounded-full bg-white/40 border border-white/40 text-slate-700 hover:bg-white/60 transition-colors"
                    aria-label="退出智能中枢"
                >
                    退出
                </button>
            </div>

            {errorMessage && (
                <div className="mx-4 mt-1 mb-0 text-[11px] font-medium text-rose-700 bg-rose-50/70 border border-rose-200/60 rounded-xl px-3 py-2 backdrop-blur-sm">
                    {errorMessage}
                </div>
            )}

            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar items-center z-10">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-1 flex-shrink-0 shadow-sm">Translating to:</span>
                {LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setTargetLang(lang.code)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all flex-shrink-0 backdrop-blur-md ${targetLang === lang.code ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white/40 text-slate-600 border-white/40 hover:bg-white/60'}`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" style={{ paddingBottom: inputBarHeight ? `${inputBarHeight + keyboardHeight + 12}px` : undefined }}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                        <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Sparkles className="animate-pulse text-indigo-400" size={40} />
                        </div>
                        <p className="font-medium">描述你的情况</p>
                        <p className="text-xs mt-1">AI 会生成便于沟通的中文内容</p>
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 shadow-sm backdrop-blur-md ${
                                msg.role === 'user'
                                    ? 'bg-indigo-600/90 text-white rounded-br-sm shadow-indigo-500/20'
                                    : 'glass-card bg-white/80 text-slate-800 rounded-bl-sm border-white/50'
                            }`}
                        >
                            {msg.tag && (
                                <div className="mb-2">
                                    <span
                                        className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full border ${
                                            msg.role === 'user'
                                                ? 'bg-white/15 text-white border-white/20'
                                                : 'bg-slate-100/70 text-slate-700 border-white/50'
                                        }`}
                                    >
                                        {msg.tag}
                                    </span>
                                </div>
                            )}
                            {msg.image && (
                                <img src={msg.image} alt="Upload" className="rounded-xl mb-2 max-h-48 object-cover border border-white/20" />
                            )}
                            {msg.text && <p className="text-base leading-relaxed">{msg.text}</p>}

                            {msg.medicalNote && (
                                <div className="mt-3 bg-indigo-50/50 border-l-2 border-indigo-400 p-2 rounded text-indigo-900 text-xs font-medium backdrop-blur-sm">
                                    <span className="font-bold block text-[10px] uppercase opacity-70 mb-1">Doctor&apos;s Note</span>
                                    {msg.medicalNote}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="glass-card bg-white/60 rounded-2xl rounded-bl-sm p-3 shadow-sm flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-indigo-600" />
                            <span className="text-slate-500 text-xs font-medium">处理中...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div ref={inputBarRef} className="p-4 glass-panel border-x-0 border-b-0 rounded-t-3xl safe-area-bottom" style={{ position: 'fixed', left: 0, right: 0, bottom: `calc(env(safe-area-inset-bottom) + ${keyboardHeight}px)`, zIndex: 60 }}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 glass-button rounded-full text-slate-600 hover:text-indigo-600 shadow-sm"
                        aria-label="上传图片"
                        disabled={isLoading || !visionSupported}
                        title={visionSupported ? undefined : '图片分析不可用：请配置 Gemini（VITE_API_KEY）'}
                    >
                        <Camera size={22} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

                    <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center border border-white/40 shadow-inner">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            onFocus={() => setTimeout(scrollToBottom, 60)}
                            placeholder="输入需要翻译/说明的内容..."
                            className="bg-transparent w-full outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isLoading}
                        className={`p-3 rounded-full shadow-lg transition-all active:scale-90 ${
                            !inputText.trim() || isLoading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white shadow-indigo-500/30'
                        }`}
                        aria-label="发送"
                    >
                        <Send size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;