import React, { useState } from 'react';
import { ArrowLeft, Volume2, Shield } from 'lucide-react';
import { LANGUAGES, OFFLINE_POLICE_DICTIONARY } from '../constants';
import { AppLanguage, DictionaryItem } from '../types';

interface Props {
  onBack: () => void;
}

type Step = 'CATEGORY' | 'PHRASE' | 'DISPLAY';

const OfflinePolice: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('CATEGORY');
  const [selectedCategory, setSelectedCategory] = useState<string>('emergency');
  const [selectedItem, setSelectedItem] = useState<DictionaryItem | null>(null);

  // UI language (source language for verification)
  const [userNativeLang, setUserNativeLang] = useState<AppLanguage>(AppLanguage.EN);

  const categories = [
    { id: 'emergency', label: '紧急求助', sub: 'Emergency', color: 'from-blue-500 to-indigo-600', icon: '🚨' },
    { id: 'lost', label: '迷路/证件', sub: 'Lost / Passport', color: 'from-amber-400 to-orange-500', icon: '🧭' },
    { id: 'theft', label: '盗窃/抢夺', sub: 'Theft', color: 'from-slate-700 to-slate-900', icon: '🕵️' },
  ];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderLanguageSelector = () => (
    <div className="glass-panel mx-4 mt-2 p-2 rounded-2xl flex items-center overflow-x-auto no-scrollbar gap-2 z-20 shadow-sm">
      <div className="text-[10px] font-bold text-slate-500 uppercase px-2 flex-shrink-0">I speak:</div>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => setUserNativeLang(lang.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1 ${userNativeLang === lang.code ? 'bg-slate-800 text-white shadow-md transform scale-105' : 'bg-white/50 text-slate-600 hover:bg-white/80'}`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );

  const renderCategorySelection = () => (
    <div className="grid gap-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="glass-card p-4 rounded-2xl text-slate-700 text-sm font-medium border-l-4 border-blue-600 bg-blue-50/50 flex items-start gap-3">
        <div className="mt-0.5 text-blue-700">
          <Shield size={18} />
        </div>
        <div>
          Select police scenario. App will generate Chinese cards for seeking help from police/passersby.
        </div>
      </div>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => {
            setSelectedCategory(cat.id);
            setStep('PHRASE');
          }}
          className={`bg-gradient-to-r ${cat.color} text-white p-6 rounded-[2rem] shadow-lg shadow-gray-200/50 flex flex-col items-start active:scale-95 transition-transform border border-white/20 relative overflow-hidden group`}
        >
          <div className="absolute right-[-10px] top-[-10px] text-8xl opacity-20 group-hover:scale-110 transition-transform select-none">
            {cat.icon}
          </div>
          <span className="text-2xl font-bold relative z-10 text-shadow-sm">{cat.label}</span>
          <span className="opacity-90 text-sm mt-1 font-medium relative z-10 bg-black/10 px-2 py-0.5 rounded-lg backdrop-blur-sm">{cat.sub}</span>
        </button>
      ))}
    </div>
  );

  const renderPhraseSelection = () => {
    const items = OFFLINE_POLICE_DICTIONARY[selectedCategory] || [];
    return (
      <div className="grid gap-3 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-slate-500 font-bold ml-2 text-xs uppercase tracking-wider mb-1">Select Phrase</h2>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setStep('DISPLAY');
            }}
            className="glass-card bg-white/70 p-5 rounded-[1.5rem] shadow-sm flex flex-col items-start text-left active:scale-95 transition-transform hover:bg-white/90"
          >
            <span className="text-lg font-bold text-slate-800">{item.term[userNativeLang] || item.term['en']}</span>
            <span className="text-slate-400 mt-1 text-xs font-medium">{item.term[AppLanguage.ZH]}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderDisplayCard = () => {
    if (!selectedItem) return null;

    const chineseText = selectedItem.term[AppLanguage.ZH];
    const userText = selectedItem.term[userNativeLang] || selectedItem.term['en'] || 'Translation missing';

    return (
      <div className="flex flex-col h-full p-4 animate-in zoom-in-95 duration-300">
        <div className="glass-card bg-white/80 rounded-[2.5rem] shadow-2xl p-6 flex-1 flex flex-col items-center justify-center text-center relative border-2 border-white/50 backdrop-blur-xl">
          <div className="mb-8 bg-slate-100/50 px-4 py-1 rounded-full backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-slate-500">{userText}</h3>
          </div>

          <div className="w-full mb-10 relative">
            <h1 className="text-5xl font-black text-slate-900 leading-tight drop-shadow-sm select-all">{chineseText}</h1>
            <p className="text-slate-400 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">Show to Police</p>
          </div>

          <button
            onClick={() => handleSpeak(chineseText)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-6 shadow-xl shadow-blue-500/30 active:scale-90 transition-transform flex items-center gap-3 px-10 border border-white/20"
          >
            <Volume2 size={32} />
            <span className="font-bold text-lg">Play Audio (CN)</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full z-10 relative">
      <div className="p-4 flex items-center gap-3 z-10">
        <button
          onClick={() => {
            if (step === 'DISPLAY') setStep('PHRASE');
            else if (step === 'PHRASE') setStep('CATEGORY');
            else onBack();
          }}
          className="glass-button p-3 rounded-full hover:bg-white/60 text-slate-700 shadow-sm"
          aria-label="返回"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 drop-shadow-sm">警方求助（离线）</h1>
      </div>

      {step !== 'DISPLAY' && renderLanguageSelector()}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {step === 'CATEGORY' && renderCategorySelection()}
        {step === 'PHRASE' && renderPhraseSelection()}
        {step === 'DISPLAY' && renderDisplayCard()}
      </div>
    </div>
  );
};

export default OfflinePolice;
