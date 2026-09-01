import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, Lock, Award, CheckCircle2 } from 'lucide-react';

export const RolesAdminPage: React.FC = () => {
  const { isDark } = useTheme();

  const rolesList = [
    { title: 'SUPER_ADMIN', nameAr: 'مدير النظام الأعلى', desc: 'صلاحيات كاملة وغير محدودة لإدارة المنصة، التجار، والعملاء', count: 2, color: '#6366F1' },
    { title: 'ADMIN', nameAr: 'مدير المنصة', desc: 'إدارة العمليات والتقارير اليومية وتراخيص التجار', count: 5, color: '#3B82F6' },
    { title: 'MERCHANT_OWNER', nameAr: 'مالك المتجر', desc: 'إدارة الفروع، المنتجات، والعروض الترويجية الخاصة بالمتجر', count: 847, color: '#10B981' },
    { title: 'MERCHANT_EMPLOYEE', nameAr: 'موظف الكاشير', desc: 'مسح بطاقات العضوية بالـ QR وتفعيل الخصومات المباشرة', count: 1420, color: '#F59E0B' },
    { title: 'CUSTOMER', nameAr: 'عميل المنصة', desc: 'الوصول لبطاقة العضوية والتصفح والاستفادة من خصومات المتاجر', count: 1248, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <span>الرئيسية</span>
          <span>&gt;</span>
          <span className="text-indigo-500 font-bold">الأدوار والصلاحيات</span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          إدارة الأدوار وصلاحيات النظام
        </h1>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rolesList.map((r, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm ${
              isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {r.nameAr}
                </span>
                <span className="font-mono text-xs font-bold text-slate-400">{r.count} مستخدم</span>
              </div>

              <h3 className="font-mono font-bold text-xs text-indigo-400 mb-2">{r.title}</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-4">{r.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 size={14} />
                <span>مفعل ومعتمد</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
