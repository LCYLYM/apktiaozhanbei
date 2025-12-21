import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Volume2, AlertTriangle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const SosTools: React.FC<Props> = ({ onBack }) => {
  const [isStrobeOn, setIsStrobeOn] = useState(false);
  const [isAlarmOn, setIsAlarmOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Strobe Logic
  useEffect(() => {
    let interval: number;
    const root = document.getElementById('root');
    
    if (isStrobeOn) {
      let white = true;
      interval = window.setInterval(() => {
        if (root) {
            root.style.backgroundColor = white ? '#000000' : '#FFFFFF';
            // Simple way to flash the screen without complex overlays
            document.body.style.backgroundColor = white ? '#000000' : '#FFFFFF';
            white = !white;
        }
      }, 100);
    } else {
       if (root) root.style.backgroundColor = '';
       document.body.style.backgroundColor = '';
    }

    return () => {
        clearInterval(interval);
        if (root) root.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
    };
  }, [isStrobeOn]);

  // Alarm Logic
  const toggleAlarm = () => {
    if (isAlarmOn) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsAlarmOn(false);
    } else {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; 
      osc.frequency.setValueAtTime(3000, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Siren effect
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(3000, now + 0.1);
      osc.frequency.linearRampToValueAtTime(800, now + 0.2);

      osc.start();
      oscillatorRef.current = osc;
      setIsAlarmOn(true);
    }
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 relative z-50 ${isStrobeOn ? 'bg-transparent' : ''}`}>
      
      {/* Header */}
      <div className={`p-4 flex items-center z-50 ${isStrobeOn ? 'opacity-30' : 'opacity-100'}`}>
        <button onClick={() => { setIsStrobeOn(false); if(isAlarmOn) toggleAlarm(); onBack(); }} className="glass-button p-3 rounded-full bg-slate-800/80 text-white border-slate-600">
            <ArrowLeft size={20} />
        </button>
        <span className="ml-4 font-black text-amber-500 tracking-wider text-xl drop-shadow-md">SOS TOOLKIT</span>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center gap-6 p-6 z-10 ${isStrobeOn ? 'opacity-20' : 'opacity-100'}`}>
        
        {/* Strobe Button */}
        <button 
            onClick={() => setIsStrobeOn(!isStrobeOn)}
            className={`w-full py-10 rounded-[2.5rem] flex flex-col items-center justify-center transition-all active:scale-95 border backdrop-blur-xl shadow-2xl ${isStrobeOn ? 'bg-white text-black border-white shadow-[0_0_80px_rgba(255,255,255,0.8)]' : 'glass-card bg-slate-900/80 text-white border-slate-700'}`}
        >
            <Zap size={56} className={isStrobeOn ? 'animate-pulse' : 'text-yellow-400'} fill={isStrobeOn ? "currentColor" : "none"} />
            <h2 className="text-2xl font-bold mt-4 tracking-tight">{isStrobeOn ? 'STOP FLASH' : 'SCREEN FLASH'}</h2>
            <p className="text-xs opacity-60 mt-2 font-medium uppercase tracking-widest">Visual Signal</p>
        </button>

        {/* Alarm Button */}
        <button 
            onClick={toggleAlarm}
            className={`w-full py-10 rounded-[2.5rem] flex flex-col items-center justify-center transition-all active:scale-95 border backdrop-blur-xl shadow-2xl ${isAlarmOn ? 'bg-red-600 text-white border-red-500 shadow-[0_0_80px_rgba(220,38,38,0.8)] animate-pulse' : 'glass-card bg-slate-900/80 text-white border-slate-700'}`}
        >
            <Volume2 size={56} className={isAlarmOn ? '' : 'text-red-400'} />
            <h2 className="text-2xl font-bold mt-4 tracking-tight">{isAlarmOn ? 'SILENCE ALARM' : 'LOUD ALARM'}</h2>
            <p className="text-xs opacity-60 mt-2 font-medium uppercase tracking-widest">3000Hz Siren</p>
        </button>
      </div>

      {!isStrobeOn && (
        <div className="p-6 text-center text-slate-500 text-xs font-medium glass-panel m-4 rounded-xl bg-amber-50/50 border-amber-200/50 text-amber-800">
             <AlertTriangle size={14} className="inline mb-1 mr-1" /> Use only in extreme emergencies.
        </div>
      )}
    </div>
  );
};

export default SosTools;