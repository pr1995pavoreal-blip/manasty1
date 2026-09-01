import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BusinessCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  FolderPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Coffee,
  CupSoda,
  ShoppingBag,
  Store,
  Utensils,
  Smartphone,
  Sparkles,
  Building2,
  Tag,
  Search,
  Plus,
  RefreshCw,
  Layers,
  Check,
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Coffee', label: 'كافيهات', Icon: Coffee },
  { name: 'CupSoda', label: 'مقاهي مختصة', Icon: CupSoda },
  { name: 'ShoppingBag', label: 'ملابس وأزياء', Icon: ShoppingBag },
  { name: 'Store', label: 'تموينات ومواد غذائية', Icon: Store },
  { name: 'Utensils', label: 'مطاعم وجبات', Icon: Utensils },
  { name: 'Smartphone', label: 'إلكترونيات وهواتف', Icon: Smartphone },
  { name: 'Sparkles', label: 'عطور وتجميل', Icon: Sparkles },
  { name: 'Building2', label: 'أنشطة تجارية عامة', Icon: Building2 },
];

export const BusinessCategoriesPage: React.FC = () => {
  const { isDark } = useTheme();
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BusinessCategory | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    icon: 'Store',
    description: '',
    isActive: true,
    sortOrder: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/business-categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameAr: '',
      icon: 'Store',
      description: '',
      isActive: true,
      sortOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: BusinessCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      nameAr: cat.nameAr,
      icon: cat.icon || 'Store',
      description: cat.description || '',
      isActive: cat.isActive,
      sortOrder: cat.sortOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr && !formData.name) {
      alert('يرجى كتابة اسم الفئة بالعربية أو الإنجليزية');
      return;
    }

    const payload = {
      ...formData,
      name: formData.name || formData.nameAr,
      nameAr: formData.nameAr || formData.name,
    };

    try {
      setSubmitting(true);
      if (editingCategory) {
        await api.put(`/business-categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/business-categories', payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'حدث خطأ أثناء حفظ الفئة';
      alert(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nameAr: string) => {
    if (!window.confirm(`هل أنت تأكد من إزالة فئة "${nameAr}"؟`)) return;
    try {
      await api.delete(`/business-categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'تعذر حذف الفئة');
    }
  };

  const renderIcon = (iconName?: string) => {
    const found = ICON_OPTIONS.find((item) => item.name === iconName);
    const IconComp = found ? found.Icon : Tag;
    return <IconComp size={20} className="text-indigo-500" />;
  };

  const filteredCategories = categories.filter((c) =>
    c.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className={`flex items-center gap-2 text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>لوحة التحكم الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">فئات الأنشطة التجارية</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            إدارة فئات الأنشطة التجارية
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            تحديد وتصنيف فئات الأعمال والمتاجر المتاحة في المنصة لسهولة الوصول إليها من قبل العملاء.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
        >
          <Plus size={16} />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Layers size={24} />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>إجمالي الفئات</p>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{categories.length}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>الفئات النشطة</p>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              {categories.filter((c) => c.isActive).length}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
            <Store size={24} />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>المتاجر المرتبطة</p>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              {categories.reduce((acc, curr) => acc + (curr.merchantCount || 0), 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم الفئة..."
            className={`w-full pr-10 pl-4 py-2 rounded-xl text-xs font-semibold outline-none border transition ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
            }`}
          />
        </div>

        <button
          onClick={fetchCategories}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
            isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
          }`}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>جاري تحميل الفئات...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
          <Layers size={48} className="mx-auto mb-3 opacity-40 text-indigo-500" />
          <h3 className="text-sm font-bold">لا يوجد فئات أنشطة مطابقة</h3>
          <p className="text-xs text-slate-500 mt-1">يمكنك إضافة فئة نشاط تجاري جديدة باستخدام الزر العلوي.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                isDark ? 'bg-[#0B0F19] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/20 flex items-center justify-center">
                    {renderIcon(cat.icon)}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      cat.isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {cat.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>{cat.isActive ? 'نشط' : 'معطل'}</span>
                  </span>
                </div>

                <h3 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  {cat.nameAr}
                </h3>
                <p className="text-xs font-mono text-indigo-500 font-semibold mb-2">{cat.name}</p>

                {cat.description && (
                  <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {cat.description}
                  </p>
                )}
              </div>

              <div className={`pt-4 border-t flex items-center justify-between mt-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Store size={13} className="text-indigo-400" />
                  <span>{cat.merchantCount || 0} متجر مرتبط</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-indigo-500 transition"
                    title="تعديل الفئة"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.nameAr)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition"
                    title="حذف الفئة"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 ${isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <FolderPlus size={20} />
                </div>
                <h3 className="text-lg font-black">
                  {editingCategory ? 'تعديل فئة النشاط التجاري' : 'إضافة فئة نشاط جديدة'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">اسم الفئة (بالعربية) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: كافيهات"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border transition ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">اسم الفئة (بالإنجليزية) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: Cafes"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border transition ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">اختر الأيقونة المناسبة</label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const SelectedIcon = item.Icon;
                    const isSelected = formData.icon === item.name;
                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <SelectedIcon size={18} />
                        <span className="text-[10px] font-bold line-clamp-1">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">وصف الفئة (اختياري)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر للأنشطة المندرجة تحت هذه الفئة..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold">تفعيل الفئة في المنصة</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">ترتيب العرض:</span>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className={`w-16 px-2 py-1 rounded-lg text-xs font-bold border text-center outline-none ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ...' : editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
