import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MembershipType } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Tag, Plus, CheckCircle2, Award, Sparkles, RefreshCw, X } from 'lucide-react';

export const MembershipTypesPage: React.FC = () => {
  const { isDark } = useTheme();
  const [types, setTypes] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    code: '',
    badgeColor: '#6366F1',
    discountPercent: 15,
    minSpend: 0,
    perks: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/memberships');
      setTypes(res.data.data || []);
    } catch (error) {
      console.error('Failed to load membership types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/memberships', formData);
      setShowModal(false);
      fetchMemberships();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر إضافة الفئة');
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
            <span className="text-indigo-500 font-bold">أنواع الخصومات والعضويات</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            إدارة الفئات وأنواع الخصومات
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          <Plus size={16} />
          <span>إضافة فئة عضوية جديدة</span>
        </button>
      </div>

      {/* Tiers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل فئات الخصومات والعضويات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div
                  className="p-4 text-white text-center font-black text-base shadow-inner flex items-center justify-center gap-2"
                  style={{ backgroundColor: tier.badgeColor || '#6366F1' }}
                >
                  <Award size={20} />
                  <span>{tier.nameAr || tier.name}</span>
                </div>

                <div className="p-5 text-center">
                  <div className="text-4xl font-black text-indigo-500 mb-1">{tier.discountPercent}%</div>
                  <p className="text-xs font-bold text-slate-400 mb-4">نسبة الخصم الأساسية</p>

                  <div
                    className={`p-3 rounded-xl space-y-1.5 text-xs font-bold mb-4 ${
                      isDark ? 'bg-slate-900/80 text-slate-300' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">رمز الفئة:</span>
                      <span className="font-mono text-indigo-400">{tier.code}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الحد الأدنى للإنفاق:</span>
                      <span className="font-mono">{tier.minSpend} ر.س</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium mb-3">
                    {tier.perks || 'خصم مباشر وحصري على كافة المنتجات والمتاجر الشريكة'}
                  </p>
                </div>
              </div>

              {tier.isDefault && (
                <div className="p-3 bg-emerald-500/10 border-t border-emerald-500/20 text-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>الفئة الافتراضية للعملاء الجدد</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay for Adding New Tier */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                <span>إضافة فئة عضوية وخصم جديدة</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم الفئة (بالعربية)</label>
                <input
                  type="text"
                  required
                  placeholder="الفئة الماسية"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value, name: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">رمز الفئة</label>
                  <input
                    type="text"
                    required
                    placeholder="DIAMOND"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold uppercase outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">لون الشارة (Badge Color)</label>
                <input
                  type="color"
                  value={formData.badgeColor}
                  onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheck"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="isDefaultCheck" className="text-xs font-bold cursor-pointer">
                  تعيين كفئة افتراضية عند تسجيل العملاء الجدد
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  حفظ الفئة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
