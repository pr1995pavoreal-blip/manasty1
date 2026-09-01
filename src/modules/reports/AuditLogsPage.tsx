import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, Clock, User, RefreshCw, Search, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { isDark } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/audit-logs');
      setLogs(res.data.data.logs || []);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const term = search.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.entity && log.entity.toLowerCase().includes(term)) ||
      (log.user?.fullName && log.user.fullName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">سجل العمليات الإدارية</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            سجل التدقيق والعمليات الإدارية
          </h1>
        </div>

        <button
          onClick={fetchLogs}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
            isDark
              ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
          }`}
        >
          <RefreshCw size={15} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث السجل</span>
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
            placeholder="البحث بالعملية، الكيان، أو اسم المستخدم..."
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

        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
          <span>إجمالي السجلات: <strong className="text-indigo-500">{filteredLogs.length}</strong></span>
        </div>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل سجل التدقيق الأمني...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <ShieldAlert size={48} className="mx-auto text-slate-500 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد عمليات مطابقة للبحث</p>
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
                  <th className="py-3.5 px-4">نوع العملية</th>
                  <th className="py-3.5 px-4">الكيان (Entity)</th>
                  <th className="py-3.5 px-4">المستخدم</th>
                  <th className="py-3.5 px-4">عنوان IP</th>
                  <th className="py-3.5 px-4">التاريخ والوقت</th>
                  <th className="py-3.5 px-4">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-500/5 transition">
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        {log.action}
                      </span>
                    </td>
                    <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {log.entity}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">
                      {log.user?.fullName || log.userId || 'النظام الإداري'}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400 dir-ltr text-right">
                      {log.ip || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono dir-ltr text-right">
                      {new Date(log.createdAt).toLocaleString('ar-SA')}
                    </td>
                    <td className="py-4 px-4 text-slate-400 truncate max-w-[200px]">
                      {log.details || 'عملية إدارية مسجلة'}
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
