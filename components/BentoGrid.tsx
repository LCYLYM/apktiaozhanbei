import React from 'react';
import { Activity, Shield, Zap, User, Crown, Signal, WifiOff } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  onNavigate: (view: ViewState) => void;
  isOnline: boolean;
  hasSubscription: boolean;
}

const BentoGrid: React.FC<Props> = ({ onNavigate, isOnline, hasSubscription }) => {
  return (
    <div className="flex flex-col h-full p-5 gap-5 animate-in fade-in duration-500 z-10 relative">
      {/* Header / Status Bar */}
      <div className="flex justify-between items-center px-1">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">智语通</h1>
            <p className="text-xs text-slate-600 font-semibold tracking-wide opacity-80">ZhiYuTong • Emergency Link</p>
        </div>
        <div className={`glass-button flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${isOnline ? 'text-green-700 bg-green-50/50' : 'text-slate-600 bg-slate-200/50'}`}>
          {isOnline ? <Signal size={14} /> : <WifiOff size={14} />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 grid-rows-6 gap-4 flex-1">
        
        {/* Medical SOS - Large Square */}
        <button 
          onClick={() => onNavigate(ViewState.OFFLINE_MEDICAL)}
          className="col-span-1 row-span-2 glass-card rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden group active:scale-95 transition-transform duration-200 border-white/40"
        >
          <div className="absolute -top-4 -right-4 p-4 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
             <Activity size={100} className="text-medical" />
          </div>
          <div className="z-10 bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
            <Activity size={24} strokeWidth={3} />
          </div>
          <div className="z-10 text-left">
            <h2 className="text-xl font-bold text-slate-800 leading-tight">急救医疗</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Medical SOS</p>
          </div>
          {/* Subtle Pulse Animation */}
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </button>

        {/* Police / Safety - Wide but constrained in grid */}
        <button 
          onClick={() => onNavigate(ViewState.OFFLINE_POLICE)}
            className="col-span-1 row-span-2 glass-card rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden group active:scale-95 transition-transform duration-200 border-white/40"
        >
           <div className="absolute -top-4 -right-4 p-4 opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform">
             <Shield size={100} className="text-police" />
          </div>
          <div className="z-10 bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Shield size={24} strokeWidth={3} />
          </div>
          <div className="z-10 text-left">
            <h2 className="text-xl font-bold text-slate-800 leading-tight">警方求助</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Police Help</p>
          </div>
        </button>

        {/* SOS Tools - Wide Bar */}
        <button 
          onClick={() => onNavigate(ViewState.SOS_TOOLS)}
          className="col-span-2 row-span-1 bg-gradient-to-r from-amber-400/90 to-orange-400/90 backdrop-blur-md border border-white/30 rounded-[2rem] shadow-lg p-5 flex items-center justify-between active:scale-95 transition-transform duration-200 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
               <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold leading-none shadow-black/5 drop-shadow-sm">灾害工具箱</h2>
              <p className="text-xs opacity-90 mt-1 font-medium">Flashlight & Alarm</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">OPEN</div>
        </button>

        {/* AI Assistant - Large if Online */}
        <button 
            onClick={() => onNavigate(hasSubscription ? ViewState.AI_CENTER : ViewState.PRICING)}
           disabled={!isOnline}
           className={`col-span-2 row-span-2 rounded-[2rem] shadow-lg p-5 flex flex-col justify-center items-center relative overflow-hidden active:scale-95 transition-transform duration-200 border border-white/40 ${isOnline ? 'glass-card bg-indigo-600/5' : 'bg-slate-200/50 grayscale opacity-80'}`}
        >
            {/* Dynamic AI Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-100 z-0" style={{ display: isOnline ? 'block' : 'none'}}></div>
            
            <div className="z-10 flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-3 shadow-lg ${isOnline ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white' : 'bg-slate-300 text-slate-500'}`}>
                    <Activity size={32} className={isOnline ? 'animate-pulse' : ''} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">AI 智能中枢</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {isOnline ? (hasSubscription ? 'Smart Translation & Vision' : '订阅解锁高级功能') : 'Connect to Internet'}
                </p>
            </div>
        </button>

        {/* Profile */}
        <button 
          onClick={() => onNavigate(ViewState.PROFILE)}
          className="col-span-1 row-span-1 glass-card rounded-[2rem] p-4 flex flex-col justify-center items-center active:scale-95 transition-transform duration-200"
        >
          <User size={24} className="text-slate-600 mb-1" />
          <span className="text-xs font-bold text-slate-600">个人档案</span>
        </button>

        {/* Settings (Placeholder) */}
        <button
          onClick={() => onNavigate(ViewState.PRICING)}
          className="col-span-1 row-span-1 glass-card bg-white/30 rounded-[2rem] p-4 flex flex-col justify-center items-center active:scale-95 transition-transform duration-200"
        >
          <Crown size={24} className={hasSubscription ? 'text-amber-500 mb-1' : 'text-slate-500 mb-1'} />
          <span className="text-xs font-bold text-slate-600">{hasSubscription ? '订阅管理' : '订阅开通'}</span>
        </button>

      </div>
      
      <div className="text-center text-[10px] text-slate-400 font-medium tracking-wider uppercase opacity-60">
        v3.1.0 ZhiYuTong • Glass UI
      </div>
    </div>
  );
};

export default BentoGrid;