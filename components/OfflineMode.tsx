import React, { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { OFFLINE_DICTIONARY, OFFLINE_POLICE_DICTIONARY, LANGUAGES } from '../constants';
import { AppLanguage, DictionaryItem, UserProfile } from '../types';

interface Props {
  onBack: () => void;
  userProfile: UserProfile;
  initialCategory?: string;
}

type Step = 'CATEGORY' | 'SYMPTOM' | 'DISPLAY';

const OfflineMode: React.FC<Props> = ({ onBack, userProfile, initialCategory }) => {
  const [step, setStep] = useState<Step>('CATEGORY');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'chest');
  const [selectedItem, setSelectedItem] = useState<DictionaryItem | null>(null);
  
  // Default to English for the user interface, but this controls the "Source" language
  const [userNativeLang, setUserNativeLang] = useState<AppLanguage>(AppLanguage.EN);

  const categories = [
    { id: 'chest', label: '胸部 / 呼吸', sub: 'Chest / Breathing', color: 'from-red-400 to-red-600', icon: '🫁' },
    { id: 'stomach', label: '腹部 / 消化', sub: 'Stomach / Digestion', color: 'from-orange-400 to-orange-600', icon: '🤢' },
    { id: 'injury', label: '外伤 / 骨折', sub: 'Injury / Fracture', color: 'from-blue-400 to-blue-600', icon: '🤕' },
    { id: 'police_emergency', label: '警方求助', sub: 'Emergency / Police', color: 'from-indigo-500 to-purple-600', icon: '🚨' },
    { id: 'police_lost', label: '迷路 / 证件', sub: 'Lost / Passport', color: 'from-amber-400 to-orange-500', icon: '🧭' },
    { id: 'police_theft', label: '盗窃 / 抢夺', sub: 'Theft', color: 'from-slate-700 to-slate-900', icon: '🕵️' },
  ];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // FORCE Chinese output regardless of user language, as the goal is to talk to locals
      utterance.lang = 'zh-CN'; 
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderLanguageSelector = () => (
    <div className="glass-panel mx-4 mt-2 p-2 rounded-2xl flex items-center overflow-x-auto no-scrollbar gap-2 z-20 shadow-sm">
        <div className="text-[10px] font-bold text-slate-500 uppercase px-2 flex-shrink-0">
            I speak:
        </div>
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
      <div className="glass-card p-4 rounded-2xl text-slate-700 text-sm font-medium border-l-4 border-blue-500 bg-blue-50/50">
         Select your emergency type. The app will generate a Chinese card for local help.
      </div>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => {
            setSelectedCategory(cat.id);
            setStep('SYMPTOM');
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

  const renderSymptomSelection = () => {
    const unifiedDictionary: Record<string, DictionaryItem[]> = {
      ...OFFLINE_DICTIONARY,
      police_emergency: OFFLINE_POLICE_DICTIONARY.emergency,
      police_lost: OFFLINE_POLICE_DICTIONARY.lost,
      police_theft: OFFLINE_POLICE_DICTIONARY.theft,
    };
    const items = unifiedDictionary[selectedCategory] || [];
    return (
      <div className="grid gap-3 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-slate-500 font-bold ml-2 text-xs uppercase tracking-wider mb-1">Select Description</h2>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setStep('DISPLAY');
            }}
            className="glass-card bg-white/70 p-5 rounded-[1.5rem] shadow-sm flex flex-col items-start text-left active:scale-95 transition-transform hover:bg-white/90"
          >
            {/* Show User's Language Prominently */}
            <span className="text-lg font-bold text-slate-800">{item.term[userNativeLang] || item.term['en']}</span>
            {/* Preview Chinese */}
            <span className="text-slate-400 mt-1 text-xs font-medium">{item.term[AppLanguage.ZH]}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderDisplayCard = () => {
    if (!selectedItem) return null;
    
    // OUTPUT: Chinese (For Doctor)
    const chineseText = selectedItem.term[AppLanguage.ZH];
    // VERIFICATION: User's Language (For Foreigner)
    const userText = selectedItem.term[userNativeLang] || "Translation missing";
    
    const hasRelevance =
      userProfile.medicalConditions && (selectedCategory === 'chest' || selectedCategory === 'stomach');

    return (
      <div className="flex flex-col h-full p-4 animate-in zoom-in-95 duration-300">
        {/* Main Card */}
        <div className="glass-card bg-white/80 rounded-[2.5rem] shadow-2xl p-6 flex-1 flex flex-col items-center justify-center text-center relative border-2 border-white/50 backdrop-blur-xl">
             
             {/* Verification Text */}
             <div className="mb-8 bg-slate-100/50 px-4 py-1 rounded-full backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-slate-500">{userText}</h3>
             </div>
             
             {/* Target Chinese Text (HUGE) */}
             <div className="w-full mb-10 relative">
                <h1 className="text-5xl font-black text-slate-900 leading-tight drop-shadow-sm select-all">
                    {chineseText}
                </h1>
                <p className="text-slate-400 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">Show to Doctor</p>
             </div>

             {/* Speak Button */}
             <button 
                onClick={() => handleSpeak(chineseText)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-6 shadow-xl shadow-blue-500/30 active:scale-90 transition-transform flex items-center gap-3 px-10 border border-white/20"
             >
                <Volume2 size={32} />
                <span className="font-bold text-lg">Play Audio (CN)</span>
             </button>

             {/* Medical Alert Badge */}
             {hasRelevance && (
                 <div className="mt-8 bg-red-50/80 border border-red-100 p-4 rounded-2xl w-full text-left backdrop-blur-sm">
                     <div className="flex items-center gap-2 text-red-600 font-bold mb-1 text-sm">
                         <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                         我的病史 (My History)
                     </div>
                     <p className="text-slate-800 font-medium text-lg">
                         {userProfile.medicalConditions}
                     </p>
                 </div>
             )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full z-10 relative">
      {/* Navbar */}
      <div className="p-4 flex items-center gap-3 z-10">
        <button onClick={() => {
            if (step === 'DISPLAY') setStep('SYMPTOM');
            else if (step === 'SYMPTOM') setStep('CATEGORY');
            else onBack();
        }} className="glass-button p-3 rounded-full hover:bg-white/60 text-slate-700 shadow-sm">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 drop-shadow-sm">离线助手（医疗/警方）</h1>
      </div>
      
      {/* Hide Language Selector on Display Card to keep it clean for the doctor */}
      {step !== 'DISPLAY' && renderLanguageSelector()}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {step === 'CATEGORY' && renderCategorySelection()}
        {step === 'SYMPTOM' && renderSymptomSelection()}
        {step === 'DISPLAY' && renderDisplayCard()}
      </div>
    </div>
  );
};

export default OfflineMode;