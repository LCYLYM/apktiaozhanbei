import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Camera, Loader2, Sparkles } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { ChatMessage, AppLanguage } from '../types';
import { LANGUAGES } from '../constants';

interface Props {
  onBack: () => void;
}

const AiAssistant: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Default to Chinese (ZH) as the user is a foreigner in China
  const [targetLang, setTargetLang] = useState<string>(AppLanguage.ZH);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
        const result = await GeminiService.translateAndAdvise(userMsg.text, targetLang);
        
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: result.translation, 
            medicalNote: result.medical_note,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1]; 

          const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: "Image Analysis Request",
            image: base64String,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, userMsg]);
          setIsLoading(true);

          try {
              const result = await GeminiService.analyzeImage(base64Data, targetLang);
              const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: result.translation,
                medicalNote: result.medical_note,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
          } catch (e) {
               // handle error
          } finally {
              setIsLoading(false);
          }
      };
      reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full relative z-10">
      {/* Glass Header */}
      <div className="glass-panel border-b-0 m-2 rounded-2xl p-3 flex items-center justify-between shadow-sm z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/40 rounded-full transition-colors">
            <ArrowLeft className="text-slate-700" size={20} />
        </button>
        <div className="flex flex-col items-center">
            <span className="font-bold text-lg text-slate-800 flex items-center gap-1">
                AI 智语通 <Sparkles size={14} className="text-indigo-500" />
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
                Gemini 2.5 • Smart Assistant
            </span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Target Language Selector */}
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

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Sparkles className="animate-pulse text-indigo-400" size={40} />
                </div>
                <p className="font-medium">Describe your emergency</p>
                <p className="text-xs mt-1">AI will translate for the local doctor</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm backdrop-blur-md ${
                msg.role === 'user' 
                ? 'bg-indigo-600/90 text-white rounded-br-sm shadow-indigo-500/20' 
                : 'glass-card bg-white/80 text-slate-800 rounded-bl-sm border-white/50'
            }`}>
               {msg.image && (
                   <img src={msg.image} alt="Upload" className="rounded-xl mb-2 max-h-48 object-cover border border-white/20" />
               )}
               {msg.text && <p className="text-base leading-relaxed">{msg.text}</p>}
               
               {/* Medical Note Card */}
               {msg.medicalNote && (
                   <div className="mt-3 bg-indigo-50/50 border-l-2 border-indigo-400 p-2 rounded text-indigo-900 text-xs font-medium backdrop-blur-sm">
                       <span className="font-bold block text-[10px] uppercase opacity-70 mb-1">Doctor's Note</span>
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
                    <span className="text-slate-500 text-xs font-medium">Translating...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 glass-panel border-x-0 border-b-0 rounded-t-3xl safe-area-bottom">
        <div className="flex items-center gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 glass-button rounded-full text-slate-600 hover:text-indigo-600 shadow-sm"
            >
                <Camera size={22} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
            />
            
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center border border-white/40 shadow-inner">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type or speak..."
                    className="bg-transparent w-full outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium"
                />
            </div>

            <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() && !isLoading}
                className={`p-3 rounded-full shadow-lg transition-all active:scale-90 ${inputText.trim() ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-slate-200 text-slate-400'}`}
            >
                <Send size={22} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;