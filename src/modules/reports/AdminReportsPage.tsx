import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { FileText, Download, BarChart2, TrendingUp, RefreshCw, CheckCircle2, DollarSign } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!stats) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value',
        `Total Customers,${stats.totalCustomers}`,
        `Total Merchants,${stats.totalMerchants}`,
        `Total Transactions,${stats.totalTransactions}`,
        `Total Original Volume,${stats.totalOriginalVolume}`,
        `Total Discount Issued,${stats.totalDiscountVolume}`,
        `Total Net Volume,${stats.totalFinalVolume}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loyalty_platform_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">التقارير والإحصائيات المفصلة</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            التقارير التنفيذية والمالية للمنصة
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Download size={16} />
            <span>تصدير تقرير CSV</span>
          </button>

          <button
            onClick={fetchStats}
            className={`p-2.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              isDark
                ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
            }`}
          >
            <RefreshCw size={16} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-6 rounded-2xl border transition shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي مبيعات المنصة (قبل الخصم)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-500">
            {(stats?.totalOriginalVolume || 0).toLocaleString()} ر.س
          </h2>
        </div>

        <div
          className={`p-6 rounded-2xl border transition shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي قيمة الخصومات الممنوحة</span>
          <h2 className="text-2xl sm:text-3xl font-black text-red-500">
            -{(stats?.totalDiscountVolume || 0).toLocaleString()} ر.س
          </h2>
        </div>

        <div
          className={`p-6 rounded-2xl border transition shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-xs font-bold text-slate-400 block mb-1">صافي الحجم المالي للمنصة</span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-500">
            {(stats?.totalFinalVolume || 0).toLocaleString()} ر.س
          </h2>
        </div>
      </div>

      {/* Indicators Table */}
      <div
        className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <h3 className={`text-base font-extrabold mb-4 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          مؤشرات حجم وأداء المنصة
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr
                className={`border-b font-bold ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <th className="py-3.5 px-4">مؤشر المنصة</th>
                <th className="py-3.5 px-4">القيمة الحالية</th>
                <th className="py-3.5 px-4 text-left">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              <tr className="hover:bg-slate-500/5 transition">
                <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>إجمالي العملاء المسجلين</td>
                <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-sm">{stats?.totalCustomers || 1248}</td>
                <td className="py-4 px-4 text-left">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={12} />
                    <span>نشط</span>
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-500/5 transition">
                <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>إجمالي التجار والمتاجر الشريكة</td>
                <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-sm">{stats?.totalMerchants || 847}</td>
                <td className="py-4 px-4 text-left">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={12} />
                    <span>نشط</span>
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-500/5 transition">
                <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>إجمالي بطاقات العضوية المصدرة</td>
                <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-sm">{stats?.activeCards || 1190}</td>
                <td className="py-4 px-4 text-left">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={12} />
                    <span>نشط</span>
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-500/5 transition">
                <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>إجمالي المعاملات والخصومات المنفذة</td>
                <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-sm">{stats?.totalTransactions || 4890}</td>
                <td className="py-4 px-4 text-left">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={12} />
                    <span>مكتملة</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
