import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api';
import { MembershipCard } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Calendar, CheckCircle2, ShieldCheck, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export const DigitalCardView: React.FC = () => {
  const { isDark } = useTheme();
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cards/my-card');
      setCard(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر تحميل بطاقة العضوية');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 font-['Cairo',sans-serif]">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400">جاري تجهيز بطاقتك الرقمية التفاعلية...</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center my-6">
        {error || 'لم يتم العثور على بطاقة عضوية رقمية مسجلة لهذا الحساب'}
      </div>
    );
  }

  const verifyUrl = `${window.location.origin}/verify/${card.verificationToken}`;
  const badgeColor = card.membershipType?.badgeColor || '#6366F1';

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">بطاقتي الرقمية</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            بطاقة العضوية الرقمية التفاعلية
          </h1>
        </div>

        <button
          onClick={fetchCard}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
            isDark
              ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
          }`}
        >
          <RefreshCw size={15} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث البطاقة</span>
        </button>
      </div>

      {/* Main Digital Pass Card Container */}
      <div className="flex justify-center py-4">
        <div
          className="w-full max-w-[440px] rounded-3xl p-6 shadow-2xl relative overflow-hidden text-white border border-indigo-500/30 flex flex-col justify-between min-h-[520px]"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          }}
        >
          {/* Holographic Gloss Effect */}
          <div
            className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-25"
            style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 60%)',
            }}
          />

          {/* Card Top Branding Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="font-extrabold text-base text-white block leading-tight">منصتي</span>
                <span className="text-[10px] text-indigo-300 font-mono tracking-widest uppercase block font-semibold">
                  DIGITAL PASS
                </span>
              </div>
            </div>

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-md text-white"
              style={{ backgroundColor: badgeColor }}
            >
              <Sparkles size={14} />
              <span>{card.membershipType?.nameAr || card.membershipType?.name} ({card.membershipType?.discountPercent}% خصم)</span>
            </span>
          </div>

          {/* EMV Chip & NFC */}
          <div className="relative z-10 flex items-center justify-between my-4">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              <Cpu size={32} />
            </div>
            <span className="text-[10px] font-mono text-slate-400 tracking-widest">NFC / QR ENABLED</span>
          </div>

          {/* Cardholder Info */}
          <div className="relative z-10 mb-4">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">اسم حامل العضوية</span>
            <h3 className="text-xl font-black text-white">{card.customer?.user?.fullName || 'حامل البطاقة'}</h3>
          </div>

          {/* Card Number & Expiry */}
          <div className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 mb-5">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">رقم البطاقة</span>
              <span className="text-sm font-mono font-black text-indigo-300 tracking-wider">{card.cardNumber}</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">تاريخ الانتهاء</span>
              <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1">
                <Calendar size={13} className="text-indigo-400" />
                <span>{new Date(card.expiresAt).toLocaleDateString('ar-SA')}</span>
              </span>
            </div>
          </div>

          {/* Secure QR Code Pass Box */}
          <div className="relative z-10 bg-white p-4 rounded-2xl text-center shadow-xl border-2 border-indigo-400/50">
            <div className="flex justify-center">
              <QRCodeSVG value={verifyUrl} size={180} level="H" includeMargin={true} />
            </div>
            <p className="text-[#0F172A] text-[11px] font-bold mt-2.5">
              امسح الرمز لدى جهاز الكاشير لتفعيل الخصم المباشر
            </p>
          </div>

          {/* Footer Status */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3 mt-4">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCircle2 size={15} />
              <span>الحالة: نشط</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              Token: {card.verificationToken.substring(0, 10)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
