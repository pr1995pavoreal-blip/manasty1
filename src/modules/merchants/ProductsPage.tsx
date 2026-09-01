import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { Product, Category, Merchant } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Layers,
  RefreshCw,
  X,
  Sparkles,
  Tag,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | undefined>(user?.merchantId);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    price: 25,
    categoryId: '',
    imageUrl: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameAr: '',
  });

  useEffect(() => {
    fetchMerchantCatalog();
  }, [user]);

  const fetchMerchantCatalog = async () => {
    try {
      setLoading(true);
      let targetId = user?.merchantId;

      if (!targetId) {
        const resList = await api.get('/merchants');
        const merchants = resList.data.data.merchants;
        if (merchants && merchants.length > 0) {
          targetId = merchants[0].id;
        }
      }

      if (targetId) {
        setMerchantId(targetId);
        const res = await api.get(`/merchants/${targetId}`);
        setProducts(res.data.data.products || []);
        setCategories(res.data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load merchant catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        (p.nameAr && p.nameAr.toLowerCase().includes(search.toLowerCase())) ||
        (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = !selectedCategory || p.categoryId === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      nameAr: '',
      description: '',
      price: 25,
      categoryId: categories.length > 0 ? categories[0].id : '',
      imageUrl: '',
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      nameAr: prod.nameAr || prod.name,
      description: prod.description || '',
      price: prod.price,
      categoryId: prod.categoryId || '',
      imageUrl: prod.imageUrl || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      const payload = {
        ...productForm,
        name: productForm.name || productForm.nameAr,
        categoryId: productForm.categoryId ? productForm.categoryId : undefined,
      };

      if (editingProduct) {
        await api.put(`/merchants/${merchantId}/products/${editingProduct.id}`, payload);
      } else {
        await api.post(`/merchants/${merchantId}/products`, payload);
      }

      setShowProductModal(false);
      fetchMerchantCatalog();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر حفظ بيانات المنتج');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!merchantId) return;
    if (!window.confirm(`هل أنت تأكد من رغبتك في حذف المنتج (${productName})؟`)) return;

    try {
      await api.delete(`/merchants/${merchantId}/products/${productId}`);
      fetchMerchantCatalog();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر حذف المنتج');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      const payload = {
        name: categoryForm.name || categoryForm.nameAr,
        nameAr: categoryForm.nameAr,
      };
      await api.post(`/merchants/${merchantId}/categories`, payload);
      setShowCategoryModal(false);
      setCategoryForm({ name: '', nameAr: '' });
      fetchMerchantCatalog();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر إضافة التصنيف');
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
            <span className="text-indigo-500 font-bold">إدارة المنتجات والأصناف</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            دليل وكتالوج المنتجات والأصناف
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            <Layers size={15} className="text-indigo-500" />
            <span>إضافة تصنيف جديد</span>
          </button>

          <button
            onClick={handleOpenAddProduct}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Plus size={16} />
            <span>إضافة منتج جديد</span>
          </button>

          <button
            onClick={fetchMerchantCatalog}
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

      {/* Filter & Search Controls */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="البحث باسم المنتج أو الوصف..."
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

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`h-10 px-3 rounded-xl border text-xs font-semibold outline-none w-full sm:w-56 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-slate-50 border-slate-200 text-[#0F172A]'
            }`}
          >
            <option value="">جميع التصنيفات ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                📁 {cat.nameAr || cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-slate-400">
          إجمالي الأصناف: <strong className="text-indigo-500">{filteredProducts.length}</strong>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل كتالوج الأصناف...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <Package size={48} className="mx-auto text-slate-500 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد منتجات مطابقة للبحث</p>
          <button
            onClick={handleOpenAddProduct}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            + إضافة منتج جديد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const categoryObj = categories.find((c) => c.id === prod.categoryId);

            return (
              <div
                key={prod.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                  isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
                }`}
              >
                <div className="p-5 space-y-3">
                  {prod.imageUrl ? (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-2">
                      <img src={prod.imageUrl} alt={prod.nameAr || prod.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                        <Package size={22} />
                      </div>
                      <span className="font-mono font-black text-indigo-400 text-sm bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/20">
                        {prod.price} ر.س
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        {prod.nameAr || prod.name}
                      </h3>
                      {prod.imageUrl && (
                        <span className="font-mono font-black text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                          {prod.price} ر.س
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed line-clamp-2">
                      {prod.description || 'صنف ممتاز خاص بقائمة المتجر'}
                    </p>
                  </div>

                  {categoryObj && (
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                      📁 {categoryObj.nameAr || categoryObj.name}
                    </span>
                  )}
                </div>

                <div className={`p-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <button
                    onClick={() => handleOpenEditProduct(prod)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-indigo-500/10 transition"
                  >
                    <Edit2 size={14} />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id, prod.nameAr || prod.name)}
                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal Overlay */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                <span>{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للكتالوج'}</span>
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المنتج (بالعربية)</label>
                <input
                  type="text"
                  required
                  placeholder="سبانيش لاتيه بارد"
                  value={productForm.nameAr}
                  onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value, name: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">التصنيف</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  >
                    <option value="">عام / غير مصنف</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">وصف المنتج</label>
                <textarea
                  rows={2}
                  placeholder="تفاصيل الصنف والمكونات..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <ImageUploadInput
                  label="صورة المنتج"
                  value={productForm.imageUrl}
                  onChange={(base64Url) => setProductForm({ ...productForm, imageUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal Overlay */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Layers size={18} className="text-indigo-500" />
                <span>إضافة تصنيف أصناف جديد</span>
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم التصنيف (بالعربية)</label>
                <input
                  type="text"
                  required
                  placeholder="المشروبات والقهوة المختصة"
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value, name: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  حفظ التصنيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
