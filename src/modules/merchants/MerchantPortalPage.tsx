import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Merchant } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { Store, Plus, MapPin, Package, Layers, CheckCircle2, RefreshCw, X, Sparkles, Edit2 } from 'lucide-react';

export const MerchantPortalPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const urlMerchantId = searchParams.get('merchantId');
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | undefined>(urlMerchantId || user?.merchantId);

  // Modals
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);

  // Forms
  const [editStoreData, setEditStoreData] = useState({
    businessName: '',
    businessNameAr: '',
    categoryName: '',
    commercialReg: '',
    description: '',
    logoUrl: '',
  });

  const [branchData, setBranchData] = useState({
    name: '',
    nameAr: '',
    address: '',
    city: 'الرياض',
    latitude: 24.7136,
    longitude: 46.6753,
    phone: '',
  });

  const [categoryData, setCategoryData] = useState({
    name: '',
    nameAr: '',
    icon: 'coffee',
  });

  const [productData, setProductData] = useState({
    name: '',
    nameAr: '',
    description: '',
    price: 25,
    categoryId: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchMerchantDetails();
  }, [user]);

  const fetchMerchantDetails = async () => {
    try {
      setLoading(true);
      // Strictly scope to logged-in merchant's own store ID if available
      let targetId = user?.merchantId || urlMerchantId;

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
        const m = res.data.data;
        setMerchant(m);
        setEditStoreData({
          businessName: m.businessName || '',
          businessNameAr: m.businessNameAr || '',
          categoryName: m.categoryName || '',
          commercialReg: m.commercialReg || '',
          description: m.description || '',
          logoUrl: m.logoUrl || '',
        });
      }
    } catch (error) {
      console.error('Failed to load merchant profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      await api.put(`/merchants/${merchantId}`, editStoreData);
      setShowEditStoreModal(false);
      fetchMerchantDetails();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر تحديث بيانات المتجر');
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      await api.post(`/merchants/${merchantId}/branches`, branchData);
      setShowBranchModal(false);
      fetchMerchantDetails();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر إضافة الفرع');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      await api.post(`/merchants/${merchantId}/categories`, categoryData);
      setShowCategoryModal(false);
      fetchMerchantDetails();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر إضافة التصنيف');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      await api.post(`/merchants/${merchantId}/products`, productData);
      setShowProductModal(false);
      fetchMerchantDetails();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر إضافة المنتج');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 font-['Cairo',sans-serif]">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400">جاري تحميل ملف المتجر والإعدادات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
        }`}
      >
        <div className="flex items-center gap-4">
          {merchant?.logoUrl ? (
            <img
              src={merchant.logoUrl}
              alt={merchant.businessNameAr || merchant.businessName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/30 shrink-0">
              <Store size={28} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{merchant?.businessNameAr || merchant?.businessName || 'المتجر الشريك'}</h1>
              <button
                onClick={() => setShowEditStoreModal(true)}
                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition"
                title="تعديل بيانات المتجر والشعار"
              >
                <Edit2 size={15} />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              نشاط المتجر: {merchant?.categoryName || 'مقهى ومأكولات'} • السجل التجاري: {merchant?.commercialReg || '1010889922'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditStoreModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-500/20"
          >
            <Edit2 size={14} />
            <span>تعديل الشعار والبيانات</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={14} />
            <span>متجر معتمد ونشط</span>
          </span>
        </div>
      </div>

      {/* Branches Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-extrabold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            <MapPin size={18} className="text-indigo-500" />
            <span>فروع المتجر ({merchant?.branches?.length || 0})</span>
          </h2>
          <button
            onClick={() => setShowBranchModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus size={14} />
            <span>إضافة فرع جديد</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {merchant?.branches?.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <h4 className={`text-sm font-black mb-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                {b.nameAr || b.name}
              </h4>
              <p className="text-xs text-slate-400 font-semibold">{b.address}، {b.city}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Catalog & Products Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-extrabold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            <Package size={18} className="text-indigo-500" />
            <span>كتالوج المنتجات والأصناف</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-[#0F172A]'
              }`}
            >
              <Layers size={14} className="inline ms-1" />
              <span>إضافة تصنيف</span>
            </button>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus size={14} />
              <span>إضافة منتج جديد</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {merchant?.products && merchant.products.length > 0 ? (
            merchant.products.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {p.nameAr || p.name}
                    </h4>
                    <span className="font-mono font-bold text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                      {p.price} ر.س
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{p.description || 'صنف خاص بالمتجر'}</p>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`col-span-full p-8 text-center rounded-2xl border ${
                isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              لا يوجد منتجات مضافة حالياً. انقر "+ إضافة منتج جديد" لإضافة الأصناف والكتالوج الخاص بك.
            </div>
          )}
        </div>
      </div>

      {/* Add Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-black">إضافة فرع جديد للمتجر</h3>
              <button onClick={() => setShowBranchModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateBranch} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">اسم الفرع (بالعربية)</label>
                <input
                  type="text"
                  required
                  placeholder="فرع العليا"
                  value={branchData.nameAr}
                  onChange={(e) => setBranchData({ ...branchData, nameAr: e.target.value, name: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">العنوان والشارع</label>
                <input
                  type="text"
                  required
                  placeholder="طريق الملك فهد"
                  value={branchData.address}
                  onChange={(e) => setBranchData({ ...branchData, address: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400">
                  إلغاء
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                  حفظ الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-black">إضافة صنف / منتج جديد</h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  placeholder="سبانيش لاتيه"
                  value={productData.nameAr}
                  onChange={(e) => setProductData({ ...productData, nameAr: e.target.value, name: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">السعر (ر.س)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: parseFloat(e.target.value) || 0 })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <ImageUploadInput
                  label="صورة المنتج (اختياري)"
                  value={productData.imageUrl}
                  onChange={(base64Url) => setProductData({ ...productData, imageUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400">
                  إلغاء
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                  حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Profile & Logo Modal */}
      {showEditStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Edit2 size={16} className="text-indigo-500" />
                <span>تعديل بيانات المتجر وشعار اللوجو</span>
              </h3>
              <button onClick={() => setShowEditStoreModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateStore} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">اسم المتجر (بالعربية)</label>
                  <input
                    type="text"
                    required
                    value={editStoreData.businessNameAr}
                    onChange={(e) => setEditStoreData({ ...editStoreData, businessNameAr: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">اسم المتجر (بالإنجليزية)</label>
                  <input
                    type="text"
                    required
                    value={editStoreData.businessName}
                    onChange={(e) => setEditStoreData({ ...editStoreData, businessName: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">فئة النشاط التجاري</label>
                <input
                  type="text"
                  value={editStoreData.categoryName}
                  onChange={(e) => setEditStoreData({ ...editStoreData, categoryName: e.target.value })}
                  placeholder="كافيهات ومطاعم"
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <ImageUploadInput
                  label="صورة شعار المتجر (Logo)"
                  value={editStoreData.logoUrl}
                  onChange={(base64Url) => setEditStoreData({ ...editStoreData, logoUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowEditStoreModal(false)} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400">
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md">
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
