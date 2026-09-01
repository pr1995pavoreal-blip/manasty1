import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, User, Shield, Store, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginIdentifier || !password) {
      setError('يرجى إدخال رقم الجوال أو البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: loginIdentifier,
        phone: loginIdentifier,
        loginIdentifier,
        password,
      });
      setSuccessMsg('تم التحقق بنجاح! جاري التوجيه...');
      setTimeout(() => {
        login(res.data.data);
        navigate('/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر تسجيل الدخول. يرجى التأكد من صحة رقم الجوال/البريد الإلكتروني وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoIdentifier: string, demoPass: string) => {
    setLoginIdentifier(demoIdentifier);
    setPassword(demoPass);
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: demoIdentifier,
        phone: demoIdentifier,
        loginIdentifier: demoIdentifier,
        password: demoPass,
      });
      setSuccessMsg('تم تسجيل الدخول بالحساب التجريبي بنجاح!');
      setTimeout(() => {
        login(res.data.data);
        navigate('/dashboard');
      }, 400);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول التجريبي');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between font-['Cairo',sans-serif] selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Top Banner / Demo Accounts Drawer */}
      <div className="bg-[#0F172A] text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold text-[11px]">
              <Sparkles size={12} className="text-indigo-400" />
              حسابات للتجربة السريعة
            </span>
            <span className="text-slate-400 hidden sm:inline">اختر أي حساب لتسجيل الدخول الفوري</span>
          </div>

          <button
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors py-0.5 px-2 rounded-lg hover:bg-slate-800"
          >
            <span>عرض الحسابات الفورية</span>
            {showDemoAccounts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Demo Drawer */}
        {showDemoAccounts && (
          <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-right animate-fadeIn">
            <button
              onClick={() => handleQuickDemoLogin('admin@loyalty.com', 'admin123')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-right transition-all group"
            >
              <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Shield size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-200 truncate">مدير النظام (Admin)</div>
                <div className="text-[10px] text-slate-400 truncate">admin@loyalty.com</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('merchant@loyalty.com', 'merchant123')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-right transition-all group"
            >
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Store size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-200 truncate">مالك المتجر (Merchant)</div>
                <div className="text-[10px] text-slate-400 truncate">merchant@loyalty.com</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('employee@loyalty.com', 'employee123')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-right transition-all group"
            >
              <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Building2 size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-200 truncate">موظف كاشير (Employee)</div>
                <div className="text-[10px] text-slate-400 truncate">employee@loyalty.com</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('customer@loyalty.com', 'customer123')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-right transition-all group"
            >
              <div className="w-8 h-8 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-200 truncate">عميل (Customer)</div>
                <div className="text-[10px] text-slate-400 truncate">customer@loyalty.com</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Main Login Split View Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row min-h-[620px]">
          
          {/* Left Decorative Branding Section (Hidden on small mobile) */}
          <div className="hidden lg:flex lg:w-5/12 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-10 text-white select-none">
            {/* Background Geometric / Architecture Overlay */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center mix-blend-overlay"
              style={{ 
                backgroundImage: `radial-gradient(circle at 20% 20%, #6366F1 0%, transparent 40%), radial-gradient(circle at 80% 80%, #3B82F6 0%, transparent 40%)` 
              }}
            />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-xl tracking-tight text-white">منصتي</h3>
                  <p className="text-[11px] text-slate-400 font-medium">منصة احترافية لإدارة أعمالك</p>
                </div>
              </div>
            </div>

            {/* Middle Feature Cards Preview */}
            <div className="relative z-10 space-y-4 my-8">
              <h2 className="text-2xl font-bold leading-snug text-white">
                حلول رقمية متكاملة <br />
                <span className="text-indigo-400">لإدارة العضويات والخصومات</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                انضم إلى آلاف المنشآت والعملاء واستمتع بتجربة بطاقات العضوية الرقمية، التحقق عبر QR، والخصومات المباشرة.
              </p>

              <div className="pt-4 space-y-2.5">
                <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-md p-3 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">✓</div>
                  <span className="text-xs text-slate-200 font-medium">بطاقات عضوية تفاعلية بترميز أمان QR</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-md p-3 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span className="text-xs text-slate-200 font-medium">نظام خصومات وعروض فورية مخصص</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Credits */}
            <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-4">
              <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
              <span className="text-indigo-400 font-semibold">إصدار 2.5</span>
            </div>
          </div>

          {/* Right Main Form Section */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
            
            {/* Header / Brand */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/20">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">منصتي</h1>
                    <p className="text-xs text-[#64748B] font-medium">منصة احترافية لإدارة أعمالك</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-1.5">مرحباً بك مجدداً</h2>
                <p className="text-[#64748B] text-sm">سجّل دخولك للوصول إلى حسابك</p>
              </div>

              {/* Status Notifications */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Phone / Email Input Field */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    رقم الجوال أو البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="أدخل رقم الجوال (05xxxxxxx) أو البريد الإلكتروني"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        setError('');
                      }}
                      className="w-full h-12 pr-11 pl-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] transition-all outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <User size={18} />
                    </div>
                  </div>
                </div>

                {/* Password Input Field */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="w-full h-12 pr-11 pl-11 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] transition-all outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1"
                      title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[#64748B] hover:text-[#0F172A] transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#E2E8F0] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-[#6366F1]"
                    />
                    <span className="font-semibold">تذكرني</span>
                  </label>

                  <a 
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('يمكنك التواصل مع الدعم الفني لإعادة تعيين كلمة المرور، أو استخدام حسابات التجربة السريعة أعلاه.');
                    }}
                    className="text-[#6366F1] hover:text-indigo-700 font-bold transition-colors hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 bg-[#6366F1] hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري تسجيل الدخول...</span>
                    </div>
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <LogIn size={18} className="group-hover:translate-x-[-2px] transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]" />
                </div>
                <span className="relative bg-white px-4 text-xs font-semibold text-[#94A3B8]">
                  أو
                </span>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert('تسجيل الدخول عبر Google سيتوفر قريباً')}
                  className="h-11 rounded-xl border border-[#E2E8F0] hover:border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>تسجيل عبر Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('تسجيل الدخول عبر Microsoft سيتوفر قريباً')}
                  className="h-11 rounded-xl border border-[#E2E8F0] hover:border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>تسجيل عبر Microsoft</span>
                </button>
              </div>

              {/* Permanent Quick Demo Accounts Block */}
              <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <span className="text-[11px] font-extrabold text-[#0F172A] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    حسابات للتجربة السريعة
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">دخول فوري بضغطة زر</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin@loyalty.com', 'admin123')}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-right shadow-sm group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                      <Shield size={15} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-[#0F172A] text-[11px] truncate">مدير النظام</div>
                      <div className="text-[9px] text-slate-500 truncate">admin@loyalty.com</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('merchant@loyalty.com', 'merchant123')}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-right shadow-sm group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                      <Store size={15} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-[#0F172A] text-[11px] truncate">مالك المتجر</div>
                      <div className="text-[9px] text-slate-500 truncate">merchant@loyalty.com</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('employee@loyalty.com', 'employee123')}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-right shadow-sm group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                      <Building2 size={15} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-[#0F172A] text-[11px] truncate">موظف الكاشير</div>
                      <div className="text-[9px] text-slate-500 truncate">employee@loyalty.com</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('customer@loyalty.com', 'customer123')}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-right shadow-sm group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                      <User size={15} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-[#0F172A] text-[11px] truncate">حساب عميل</div>
                      <div className="text-[9px] text-slate-500 truncate">customer@loyalty.com</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Registration Options */}
            <div className="pt-6 mt-6 border-t border-[#E2E8F0] text-center text-xs">
              <span className="text-[#64748B] font-medium">ليس لديك حساب؟ </span>
              <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-1 sm:mt-0">
                <Link 
                  to="/register-customer" 
                  className="text-[#6366F1] hover:text-indigo-800 font-bold transition-colors hover:underline"
                >
                  حساب عميل جديد
                </Link>
                <span className="text-[#CBD5E1]">•</span>
                <Link 
                  to="/register-merchant" 
                  className="text-emerald-600 hover:text-emerald-800 font-bold transition-colors hover:underline"
                >
                  حساب متجر/شريك
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center py-3 text-[11px] text-slate-400 bg-slate-100/50 border-t border-slate-200/60">
        جميع الحقوق محفوظة © {new Date().getFullYear()} منصتي - منصة العضويات والخصومات الموحدة
      </footer>
    </div>
  );
};
