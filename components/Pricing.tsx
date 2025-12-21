import React from 'react';
import { ArrowLeft, Crown, Check, Trash2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionPlanId, SubscriptionState } from '../types';

interface Props {
  onBack: () => void;
  onSelectPlan: (planId: SubscriptionPlanId) => void;
  subscription: SubscriptionState;
  onCancelSubscription: () => void;
}

const Pricing: React.FC<Props> = ({ onBack, onSelectPlan, subscription, onCancelSubscription }) => {
  return (
    <div className="flex flex-col h-full relative z-10">
      <div className="glass-panel m-2 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="glass-button p-2 rounded-full text-slate-700" aria-label="返回">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
            订阅开通 <Crown size={16} className="text-amber-500" />
          </span>
          <span className="text-[10px] text-slate-500 font-medium">基础功能免费，高级能力订阅解锁</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-16">
        {subscription.status === 'active' ? (
          <div className="glass-card bg-white/70 p-5 rounded-[2rem] border-white/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-800">当前订阅（本地）</div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  已开通：{subscription.planName ?? subscription.planId ?? '订阅'}
                </div>
              </div>
              <button
                onClick={onCancelSubscription}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50/70 text-rose-700 border border-rose-200/60 hover:bg-rose-50 transition-colors flex items-center gap-2"
                aria-label="取消订阅"
              >
                <Trash2 size={14} /> 取消
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-500 font-medium">
              你仍可使用基础功能（离线助手、工具箱等）。如需更换套餐，可直接选择新套餐并模拟付款。
            </div>
          </div>
        ) : (
          <div className="glass-card bg-white/70 p-4 rounded-2xl border-white/60">
            <div className="text-sm font-bold text-slate-800">高级功能（订阅解锁）</div>
            <div className="text-xs text-slate-500 font-medium mt-1">AI 对话翻译、图片/药品识别等</div>
          </div>
        )}

        {SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id} className="glass-card bg-white/70 p-5 rounded-[2rem] shadow-sm border-white/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-black text-slate-800 tracking-tight">{plan.name}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">{plan.description}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-800">{plan.priceText}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SUBSCRIBE</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {plan.features.map((f: string) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/20">
                    <Check size={14} />
                  </span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectPlan(plan.id)}
              className="mt-5 w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 active:scale-[0.99] transition-transform"
            >
              {subscription.status === 'active' ? '更换/升级并前往付款' : '选择并前往付款'}
            </button>
          </div>
        ))}

        <div className="text-center text-[10px] text-slate-400 font-medium tracking-wider uppercase opacity-70">
          付款为模拟流程（本地存储）
        </div>
      </div>
    </div>
  );
};

export default Pricing;
