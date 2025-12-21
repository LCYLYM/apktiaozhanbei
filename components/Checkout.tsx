import React, { useMemo, useState } from 'react';
import { ArrowLeft, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionPlanId } from '../types';

interface Props {
  planId: SubscriptionPlanId;
  onBack: () => void;
  onSuccess: (planId: SubscriptionPlanId) => void;
}

const Checkout: React.FC<Props> = ({ planId, onBack, onSuccess }) => {
  const plan = useMemo(() => SUBSCRIPTION_PLANS.find(p => p.id === planId), [planId]);
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    if (isPaying) return;
    setErrorMessage(null);
    setIsPaying(true);

    try {
      // 模拟支付：点击即成功（保留异步形态，便于未来替换真实支付）
      await new Promise(resolve => setTimeout(resolve, 700));
      setIsSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 350));
      onSuccess(planId);
    } catch (e) {
      console.error('Checkout error:', e);
      setErrorMessage('支付失败：请稍后重试');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10">
      <div className="glass-panel m-2 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="glass-button p-2 rounded-full text-slate-700" aria-label="返回">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
            模拟付款 <Lock size={16} className="text-slate-600" />
          </span>
          <span className="text-[10px] text-slate-500 font-medium">订阅成功后将解锁 AI 高级功能</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-20">
        <div className="glass-card bg-white/70 p-5 rounded-[2rem] shadow-sm border-white/60">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">订单信息</div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <div className="text-xl font-black text-slate-800">{plan?.name ?? '订阅'}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{plan?.description ?? ''}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-slate-800">{plan?.priceText ?? ''}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LOCAL</div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="text-[11px] font-medium text-rose-700 bg-rose-50/70 border border-rose-200/60 rounded-xl px-3 py-2 backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        <div className="glass-card bg-white/70 p-5 rounded-[2rem] shadow-sm border-white/60">
          <div className="text-sm font-bold text-slate-800">支付说明</div>
          <div className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            这是“模拟支付”流程：点击按钮后会在浏览器本地写入订阅状态（localStorage），用于解锁 AI 高级功能。
          </div>

          <button
            onClick={handlePay}
            disabled={isPaying || isSuccess}
            className={`mt-5 w-full py-3 rounded-2xl font-bold shadow-lg active:scale-[0.99] transition-transform ${
              isSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : isPaying
                  ? 'bg-slate-300 text-slate-600'
                  : 'bg-indigo-600 text-white shadow-indigo-500/30'
            }`}
          >
            {isSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> 支付成功
              </span>
            ) : isPaying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" /> 处理中...
              </span>
            ) : (
              '立即支付（模拟）'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
