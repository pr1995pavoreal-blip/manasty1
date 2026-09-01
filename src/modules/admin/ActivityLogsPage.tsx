import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Activity, Clock, ShieldCheck, User } from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const { isDark } = useTheme();

  const activities = [
    { title: 'تسجيل دخول ناجح', user: 'admin@loyalty.com', time: 'منذ 5 دقائق', ip: '192.168.1.10' },
    { title: 'مسح واستخدام بطاقة عضوية QR', user: 'employee@loyalty.com', time: 'منذ 15 دقيقة', ip: '192.168.1.45' },
    { title: 'إضافة خصم ترويجي جديد', user: 'merchant@loyalty.com', time: 'منذ 45 دقيقة', ip: '192.168.1.88' },
    { title: 'تسجيل عميل جديد بالمنصة', user: 'customer@loyalty.com', time: 'منذ ساعتين', ip: '192.168.1.92' },
  ];

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <span>الرئيسية</span>
          <span>&gt;</span>
          <span className="text-indigo-500 font-bold">سجل النشاطات الحية</span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          سجل النشاطات والأحداث المباشرة
        </h1>
      </div>

      {/* Activity Timeline Box */}
      <div
        className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
        }`}
      >
        <div className="space-y-3">
          {activities.map((act, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-700/40 hover:bg-slate-500/5 transition text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <Activity size={16} />
                </div>
                <div>
                  <h4 className="font-bold">{act.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{act.user} • IP: {act.ip}</p>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
