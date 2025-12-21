import React, { useState } from 'react';
import { ArrowLeft, Save, CreditCard } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onBack: () => void;
  currentProfile: UserProfile;
  onSave: (p: UserProfile) => void;
}

const Profile: React.FC<Props> = ({ onBack, currentProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(currentProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const qrData = JSON.stringify(formData);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="flex flex-col h-full relative z-10">
      {/* Header */}
      <div className="glass-panel m-2 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="glass-button p-2 rounded-full text-slate-700">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">个人档案 (The Vault)</h1>
        <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-indigo-600 font-bold text-sm px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
        >
            {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-20">
        
        {/* ID Card / QR Section */}
        <div className="glass-card bg-white/70 p-6 rounded-[2rem] shadow-xl flex flex-col items-center text-center border-white/60">
            {!isEditing ? (
                <>
                    <div className="bg-white p-3 rounded-2xl shadow-inner mb-4">
                        <img src={qrUrl} alt="Medical ID QR" className="w-40 h-40 mix-blend-multiply opacity-90" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Scan for Emergency Info</p>
                    <h2 className="text-2xl font-black text-slate-800">{formData.name || 'Set Name'}</h2>
                    <div className="mt-4 flex gap-3">
                        <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                            🩸 {formData.bloodType || 'Blood?'}
                        </span>
                        <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                            <CreditCard size={12} /> {formData.insuranceId || 'No Ins.'}
                        </span>
                    </div>
                </>
            ) : (
                <div className="text-slate-400 py-10">
                    <Save size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="font-medium">Save to regenerate QR</p>
                </div>
            )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
            <div className="glass-card bg-white/50 p-5 rounded-2xl shadow-sm">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-slate-800 font-bold disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="John Doe"
                />
            </div>

             <div className="flex gap-4">
                <div className="glass-card bg-white/50 p-5 rounded-2xl shadow-sm flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Type</label>
                    <input 
                        type="text" 
                        name="bloodType" 
                        value={formData.bloodType} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-slate-800 font-bold disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="O+"
                    />
                </div>
                <div className="glass-card bg-white/50 p-5 rounded-2xl shadow-sm flex-1">
                     <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Insurance ID</label>
                    <input 
                        type="text" 
                        name="insuranceId" 
                        value={formData.insuranceId} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-slate-800 font-bold disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="#123456"
                    />
                </div>
             </div>

            <div className="glass-card bg-white/50 p-5 rounded-2xl shadow-sm">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Emergency Contact</label>
                <input 
                    type="tel" 
                    name="emergencyContact" 
                    value={formData.emergencyContact} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-slate-800 font-bold disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="+1 234 567 890"
                />
            </div>

             <div className="glass-card bg-red-50/40 border border-red-100 p-5 rounded-2xl shadow-sm">
                <label className="block text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Medical Conditions / Allergies</label>
                <textarea 
                    name="medicalConditions" 
                    value={formData.medicalConditions} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-slate-800 font-medium disabled:opacity-70 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    placeholder="e.g. Peanut Allergy, Asthma..."
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;