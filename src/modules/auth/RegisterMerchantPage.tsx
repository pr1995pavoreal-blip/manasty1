import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LocationPickerModal } from '../../components/LocationPickerModal';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { Store, Mail, Lock, User, Phone, FileText, MapPin, CheckCircle2, AlertCircle, ChevronLeft, ArrowRight, ExternalLink } from 'lucide-react';

export const RegisterMerchantPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    businessNameAr: '',
    commercialReg: '',
    categoryName: 'مقاهي ومطاعم',
    logoUrl: '',
    city: 'الرياض',
    address: 'طريق الملك فهد',
    latitude: 24.7136,
    longitude: 46.6753,
    googleMapsUrl: 'https://www.google.com/maps?q=24.7136,46.6753',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.businessName || !formData.fullName || !formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register/merchant', formData);
      setSuccessMsg(res.data.message || 'تم إرسال طلب تسجيل متجرك بنجاح! الطلب قيد الانتظار لموافقة الإدارة.');
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر تسجيل المتجر. يرجى التأكد من البيانات وإعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between font-['Cairo',sans-serif] selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-slate-200 py-3 px-6 border-b border-slate-800 flex justify-between items-center text-xs">
        <Link to="/login" className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition">
          <ArrowRight size={16} />
          <span>العودة لشاشة تسجيل الدخول</span>
        </Link>
        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          انضم لتُجّار وشُركاء المنصة
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row">
          
          {/* Right Hero / Branding Section */}
          <div className="w-full lg:w-5/12 bg-gradient-to-bl from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <Store size={26} />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
                سجّل متجرك اليوم <br />
                <span className="text-emerald-400">واستقطب ملايين العملاء</span>
              </h2>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                أنشئ حساب الشريك الخاص بك، أضف فروعك وموقعك على خرائط قوقل، وأسس برامج الخصومات والعضويات بكل سهولة.
              </p>

              <div className="space-y-3 pt-4 border-t border-emerald-900/60">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>موافقة سريعة من لوحة تحكم الإدارة</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>تكامل مباشر مع موقعك على Google Maps</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>إدارة عروض وخصومات غير محدودة</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
              <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
              <span className="text-emerald-400 font-bold">منصتي SaaS</span>
            </div>
          </div>

          {/* Left Registration Form Section */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 bg-white">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-[#0F172A] mb-1">تسجيل حساب متجر جديد</h1>
              <p className="text-xs text-slate-500 font-medium">قم بإدخال بيانات المتجر والموقع الإلكتروني للانضمام</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-extrabold">{successMsg}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">جاري التحويل لصفحة تسجيل الدخول...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name (AR & EN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    اسم المتجر (بالعربي) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمصة ومقهى الذهب"
                    value={formData.businessNameAr}
                    onChange={(e) => setFormData({ ...formData, businessNameAr: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    اسم المتجر (بالإنجليزية) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Golden Coffee & Cafe"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Activity Category & Commercial Reg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    نشاط المتجر / الفئة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition cursor-pointer"
                  >
                    <option value="مقاهي ومطاعم">مقاهي ومطاعم (Coffee & Cafe)</option>
                    <option value="تجزئة وتسوق">تجزئة وتسوق (Retail & Shopping)</option>
                    <option value="مراكز تجميل وعناية">مراكز تجميل وعناية (Beauty & Spa)</option>
                    <option value="صحة ورياضة">صحة ورياضة (Health & Fitness)</option>
                    <option value="خدمات ترفيهية">خدمات ترفيهية (Entertainment)</option>
                    <option value="أنشطة أخرى">أنشطة أخرى (General Services)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">رقم السجل التجاري (CR)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1010889922"
                      value={formData.commercialReg}
                      onChange={(e) => setFormData({ ...formData, commercialReg: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <FileText size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Logo Image Upload */}
              <div>
                <ImageUploadInput
                  label="صورة شعار المتجر (Logo)"
                  value={formData.logoUrl}
                  onChange={(base64Url) => setFormData({ ...formData, logoUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              {/* Owner Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    اسم صاحب المتجر <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكامل"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">رقم الجوال</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+966500000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-mono font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    البريد الإلكتروني للتدشين <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="owner@store.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Location Section */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-600" />
                    <span className="text-xs font-black text-slate-800">موقع المتجر على خرائط قوقل (Google Maps)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <MapPin size={14} />
                    <span>حدد على الخريطة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400">المدينة والعنوان: </span>
                    <strong className="text-slate-800">{formData.city} - {formData.address}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">الإحداثيات: </span>
                    <strong className="font-mono text-emerald-700">{formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</strong>
                  </div>
                </div>

                {formData.googleMapsUrl && (
                  <a
                    href={formData.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <span>فتح رابط خرائط قوقل المباشر</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إرسال طلب تسجيل المتجر...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال طلب تسجيل المتجر للموافقة</span>
                    <ChevronLeft size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs">
              <span className="text-slate-500 font-medium">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-emerald-600 font-extrabold hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
        initialCity={formData.city}
        initialAddress={formData.address}
        initialMapsUrl={formData.googleMapsUrl}
        onSelectLocation={(data) => {
          setFormData((prev) => ({
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            address: data.address,
            googleMapsUrl: data.googleMapsUrl,
          }));
        }}
      />
    </div>
  );
};
