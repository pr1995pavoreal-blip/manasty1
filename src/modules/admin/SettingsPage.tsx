import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Settings, Shield, Bell, Lock, Globe, Moon, Sun, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <span>الرئيسية</span>
          <span>&gt;</span>
          <span className="text-indigo-500 font-bold">إعدادات المنصة</span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          إعدادات وتخصيص المنصة
        </h1>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-fadeIn">
          تم حفظ الإعدادات والتفضيلات بنجاح!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div
          className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
          }`}
        >
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Globe size={18} className="text-indigo-500" />
            <span>الإعدادات العامة للواجهة والتفضيلات</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-700/40">
            <div>
              <h4 className="text-xs font-bold">الظهر والمظهر (Theme)</h4>
              <p className="text-[11px] text-slate-400 font-medium">التبديل بين الوضع الليلي والوضع النهاري</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-indigo-600'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? 'الوضع الليلي نشط' : 'الوضع النهاري نشط'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-700/40">
            <div>
              <h4 className="text-xs font-bold">إشعارات البريد والتنبيهات المباشرة</h4>
              <p className="text-[11px] text-slate-400 font-medium">تلقي التنبيهات والتقرير الأسبوعي للعمليات</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Save size={16} />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
