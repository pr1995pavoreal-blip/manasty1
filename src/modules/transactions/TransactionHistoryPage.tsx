import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Transaction } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { History, Search, RefreshCw, CheckCircle2, TrendingUp, Percent, Store, CreditCard } from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const { isDark } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions/history');
      setTransactions(res.data.data.transactions || []);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTxs = transactions.filter((tx: any) => {
    const term = search.toLowerCase();
    return (
      (tx.transactionNo && tx.transactionNo.toLowerCase().includes(term)) ||
      (tx.customer?.user?.fullName && tx.customer.user.fullName.toLowerCase().includes(term)) ||
      (tx.merchant?.businessName && tx.merchant.businessName.toLowerCase().includes(term))
    );
  });

  // Calculate totals
  const totalVolume = filteredTxs.reduce((acc, t: any) => acc + (t.originalAmount || 0), 0);
  const totalDiscounts = filteredTxs.reduce((acc, t: any) => acc + (t.discountAmount || 0), 0);
  const netRevenue = filteredTxs.reduce((acc, t: any) => acc + (t.finalAmount || 0), 0);

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">سجل المعاملات والخصومات</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            سجل التدقيق المالي والمعاملات
          </h1>
        </div>

        <button
          onClick={fetchHistory}
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

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border transition shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">إجمالي المبيعات قبل الخصم</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {totalVolume.toLocaleString()} ر.س
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">إجمالي الخصومات الممنوحة</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Percent size={18} />
            </div>
          </div>
          <div className="text-xl font-black text-red-500">
            -{totalDiscounts.toLocaleString()} ر.س
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">صافي الإيرادات المحصلة</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Store size={18} />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-500">
            {netRevenue.toLocaleString()} ر.س
          </div>
        </div>
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
            placeholder="البحث برقم المعاملة، العميل، أو اسم المتجر..."
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
          <span>عدد المعاملات المسجلة: <strong className="text-indigo-500">{filteredTxs.length}</strong></span>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل سجل المعاملات المالية...</p>
        </div>
      ) : filteredTxs.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <History size={48} className="mx-auto text-slate-500 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد سجل معاملات حالياً</p>
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
                  <th className="py-3.5 px-4">رقم المعاملة</th>
                  <th className="py-3.5 px-4">العميل</th>
                  <th className="py-3.5 px-4">المتجر / الشريك</th>
                  <th className="py-3.5 px-4">فئة العضوية</th>
                  <th className="py-3.5 px-4">المبلغ الأصلي</th>
                  <th className="py-3.5 px-4">الخصم الممنوح</th>
                  <th className="py-3.5 px-4">المبلغ النهائي</th>
                  <th className="py-3.5 px-4">التاريخ والوقت</th>
                  <th className="py-3.5 px-4 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredTxs.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-500/5 transition">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-400">
                      {tx.transactionNo}
                    </td>
                    <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {tx.customer?.user?.fullName || 'عميل'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-semibold">
                      {tx.merchant?.businessNameAr || tx.merchant?.businessName || 'متجر شريك'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white"
                        style={{ backgroundColor: tx.card?.membershipType?.badgeColor || '#6366F1' }}
                      >
                        {tx.card?.membershipType?.nameAr || tx.card?.membershipType?.name || 'الفئة الفضية'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-400">
                      {tx.originalAmount} ر.س
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-red-500">
                      -{tx.discountAmount} ر.س
                    </td>
                    <td className="py-4 px-4 font-mono font-black text-emerald-500 text-sm">
                      {tx.finalAmount} ر.س
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono dir-ltr text-right">
                      {new Date(tx.createdAt).toLocaleString('ar-SA')}
                    </td>
                    <td className="py-4 px-4 text-left">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 size={12} />
                        <span>مكتملة</span>
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
