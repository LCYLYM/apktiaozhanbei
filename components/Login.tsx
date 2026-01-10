import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react';

interface Props {
    onLogin: (email: string, password: string) => void;
    onRegister: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('请填写所有必填项');
            return;
        }

        if (!email.includes('@')) {
            setError('请输入有效的邮箱地址');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin(email, password);
        } catch (err) {
            setError('登录失败，请检查邮箱和密码');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-sm">
                {/* Logo and title */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Sparkles className="text-indigo-600" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">智语通</h1>
                    <p className="text-sm text-slate-600 font-medium">ZhiYuTong • 智能翻译助手</p>
                </div>

                {/* Login form */}
                <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/50">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">欢迎回来</h2>

                    {error && (
                        <div className="mb-4 text-xs font-medium text-rose-700 bg-rose-50/70 border border-rose-200/60 rounded-xl px-3 py-2.5 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="请输入密码"
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

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    登录中...
                                </>
                            ) : (
                                <>
                                    登录
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                        <span className="text-xs text-slate-500 font-medium">或</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    </div>

                    {/* Register button */}
                    <button
                        onClick={onRegister}
                        className="w-full glass-button text-slate-700 font-bold py-3.5 rounded-xl hover:bg-white/70 active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                        <UserPlus size={20} />
                        立即注册
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                    登录即表示同意{' '}
                    <a href="#" className="text-indigo-600 hover:underline">服务条款</a>
                    {' '}和{' '}
                    <a href="#" className="text-indigo-600 hover:underline">隐私政策</a>
                </p>
            </div>
        </div>
    );
};

export default Login;