import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { UserCheck, Search, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';

export const UsersAdminPage: React.FC = () => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers');
      // Extract user profiles
      const list = res.data.data.customers?.map((c: any) => c.user) || [];
      setUsers(list);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">إدارة المستخدمين</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            دليل وإدارة حسابات المستخدمين
          </h1>
        </div>

        <button
          onClick={fetchUsers}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
            isDark
              ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
          }`}
        >
          <RefreshCw size={15} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث الحسابات</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="البحث باسم المستخدم أو البريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full h-10 pr-10 pl-4 rounded-xl border text-xs font-semibold transition outline-none ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                : 'bg-slate-50 border-slate-200 text-[#0F172A] placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل قائمة المستخدمين...</p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr
                  className={`border-b font-bold ${
                    isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <th className="py-3.5 px-4">اسم المستخدم</th>
                  <th className="py-3.5 px-4">البريد الإلكتروني</th>
                  <th className="py-3.5 px-4">رقم الهاتف</th>
                  <th className="py-3.5 px-4">تاريخ الإنشاء</th>
                  <th className="py-3.5 px-4 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((u: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-500/5 transition">
                    <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {u.fullName || 'مستخدم المنصة'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium dir-ltr text-right">
                      {u.email}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono dir-ltr text-right">
                      {u.phone || 'غير مسجل'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono dir-ltr text-right">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-4 px-4 text-left">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 size={12} />
                        <span>نشط</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
