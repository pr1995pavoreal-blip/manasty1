import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { UserPlus, Mail, Lock, User, Phone, MapPin, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';

export const RegisterCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: 'الرياض',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Field Touched States
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Helper Validations
  const isPhoneValid = formData.phone ? /^(05|9665|\+9665)[0-9]{8}$/.test(formData.phone.replace(/\s+/g, '')) : false;
  const isPasswordMatch = formData.password && formData.confirmPassword ? formData.password === formData.confirmPassword : false;
  const isPasswordValid = formData.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.fullName || !formData.phone || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!isPasswordValid) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف');
      return;
    }

    if (!isPasswordMatch) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register/customer', {
        fullName: formData.fullName,
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        password: formData.password,
        city: formData.city,
      });

      setSuccessMsg('تم إنشاء حساب العميل وإصدار بطاقة العضوية الرقمية بنجاح!');
      setTimeout(() => {
        login(res.data.data);
        navigate('/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر إنشاء الحساب. يرجى التأكد من رقم الجوال والبيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between font-['Cairo',sans-serif] selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-slate-200 py-3 px-6 border-b border-slate-800 flex justify-between items-center text-xs">
        <Link to="/login" className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition">
          <ArrowRight size={16} />
          <span>العودة لشاشة تسجيل الدخول</span>
        </Link>
        <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1">
          <Sparkles size={13} />
          <span>بطاقة عضوية رقمية مجانية عند التسجيل</span>
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Right Hero Section */}
          <div className="w-full lg:w-5/12 bg-gradient-to-bl from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                <UserPlus size={26} />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
                انضم الآن واكتشف <br />
                <span className="text-indigo-400">عالم الخصومات والعضويات</span>
              </h2>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                سجّل حسابك برقم جوالك واحصل فورياً على بطاقة العضوية الرقمية، واستمتع بخصومات المتاجر الشريكة والتحقق عبر QR.
              </p>

              <div className="space-y-3 pt-4 border-t border-indigo-900/60">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span>بطاقة عضوية تفاعلية برمز QR خاص بك</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span>خصومات فورية لدى آلاف المتاجر والمقاهي</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span>تنبيهات بالعروض الحصرية القريبة منك</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
              <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
              <span className="text-indigo-400 font-bold">منصتي الرقمية</span>
            </div>
          </div>

          {/* Left Form Section */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 bg-white">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-[#0F172A] mb-1">حساب عميل جديد</h1>
              <p className="text-xs text-slate-500 font-medium">أدخل رقم جوالك وبياناتك لإنشاء الحساب والحصول على بطاقتك الرقمية</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-shake">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-extrabold">{successMsg}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">جاري فتح لوحة التحكم وبطاقتك العضوية...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: سامي العتيبي"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#0F172A] placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </div>
                </div>
              </div>

              {/* Phone Number with Duplicate Check & Flag */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setError('');
                    }}
                    onBlur={() => setPhoneTouched(true)}
                    className={`w-full h-11 pr-10 pl-16 rounded-xl border text-xs font-mono font-bold transition outline-none ${
                      phoneTouched && formData.phone && !isPhoneValid
                        ? 'border-amber-400 bg-amber-50/30 text-amber-900'
                        : phoneTouched && isPhoneValid
                        ? 'border-emerald-400 bg-emerald-50/20 text-slate-900'
                        : 'border-slate-200 bg-white text-[#0F172A] placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={18} />
                  </div>
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 ltr">
                    🇸🇦 +966
                  </span>
                </div>
                {phoneTouched && formData.phone && !isPhoneValid && (
                  <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> صيغة رقم الجوال المفضلة: 05xxxxxxxx
                  </p>
                )}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setError('');
                      }}
                      className="w-full h-11 pr-10 pl-10 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#0F172A] outline-none focus:border-indigo-600 transition"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setError('');
                      }}
                      onBlur={() => setConfirmTouched(true)}
                      className={`w-full h-11 pr-10 pl-10 rounded-xl border text-xs font-semibold transition outline-none ${
                        confirmTouched && formData.confirmPassword && !isPasswordMatch
                          ? 'border-red-400 bg-red-50/30 text-red-900'
                          : confirmTouched && isPasswordMatch
                          ? 'border-emerald-400 bg-emerald-50/20 text-slate-900'
                          : 'border-slate-200 bg-white text-[#0F172A] focus:border-indigo-600'
                      }`}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Match Status Indicator */}
              {confirmTouched && formData.confirmPassword && (
                <div className="text-[11px] font-bold">
                  {isPasswordMatch ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> كلمتا المرور متطابقتان
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle size={13} /> كلمتا المرور غير متطابقتين
                    </span>
                  )}
                </div>
              )}

              {/* Email (Optional) & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#0F172A] outline-none focus:border-indigo-600 transition"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">المدينة</label>
                  <div className="relative">
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-bold bg-white text-[#0F172A] outline-none focus:border-indigo-600 transition cursor-pointer"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="الخبر">الخبر</option>
                      <option value="أخرى">مدينة أخرى</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <MapPin size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-4 bg-[#6366F1] hover:bg-indigo-600 active:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إنشاء الحساب وإصدار البطاقة...</span>
                  </>
                ) : (
                  <>
                    <span>إنشاء الحساب واستلام بطاقة العضوية</span>
                    <ChevronLeft size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs">
              <span className="text-slate-500 font-medium">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-indigo-600 font-extrabold hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
