import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

interface Props {
    onBack: () => void;
    onRegister: (email: string, password: string, name: string) => void;
}

const Register: React.FC<Props> = ({ onBack, onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name || !email || !password || !confirmPassword) {
            setError('请填写所有必填项');
            return;
        }

        if (!email.includes('@')) {
            setError('请输入有效的邮箱地址');
            return;
        }

        if (password.length < 6) {
            setError('密码至少需要6个字符');
            return;
        }

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        setIsLoading(true);
        try {
            await onRegister(email, password, name);
        } catch (err) {
            setError('注册失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-6">
                <button
                    onClick={onBack}
                    className="glass-button p-3 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm"
                    aria-label="返回"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">创建账户</h1>
                    <p className="text-sm text-slate-600 font-medium">开启智能翻译之旅</p>
                </div>

                {/* Register form */}
                <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/50">
                    {error && (
                        <div className="mb-4 text-xs font-medium text-rose-700 bg-rose-50/70 border border-rose-200/60 rounded-xl px-3 py-2.5 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name input */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase px-1">姓名</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="请输入您的姓名"
                                    className="w-full bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 pl-10 outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium border border-white/40 focus:border-indigo-400 focus:bg-white/80 transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email input */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase px-1">邮箱</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="请输入邮箱地址"
                                    className="w-full bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 pl-10 outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium border border-white/40 focus:border-indigo-400 focus:bg-white/80 transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password input */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase px-1">密码</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="至少6个字符"
                                    className="w-full bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 pl-10 pr-10 outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium border border-white/40 focus:border-indigo-400 focus:bg-white/80 transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password input */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase px-1">确认密码</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="再次输入密码"
                                    className="w-full bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 pl-10 pr-20 outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium border border-white/40 focus:border-indigo-400 focus:bg-white/80 transition-all"
                                    disabled={isLoading}
                                />
                                {confirmPassword && password === confirmPassword && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500">
                                        <Check size={18} />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Register button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    注册中...
                                </>
                            ) : (
                                <>
                                    立即注册
                                    <Check size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                    注册即表示同意{' '}
                    <a href="#" className="text-indigo-600 hover:underline">服务条款</a>
                    {' '}和{' '}
                    <a href="#" className="text-indigo-600 hover:underline">隐私政策</a>
                </p>
            </div>
        </div>
    );
};

export default Register;