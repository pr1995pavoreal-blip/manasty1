import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { Offer, MembershipType, Product, Category } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import {
  Tag,
  Calendar,
  Clock,
  Store,
  Plus,
  Package,
  Search,
  Sparkles,
  RefreshCw,
  X,
  CheckCircle2,
  Layers,
  CheckSquare,
  Square,
  AlertCircle,
  Edit2,
  Trash2,
} from 'lucide-react';

export const OffersListPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [memberships, setMemberships] = useState<MembershipType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [merchantId, setMerchantId] = useState<string | undefined>(user?.merchantId);

  // Search & Filters inside Product Picker
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');

  const isMerchantOrAdmin = user?.roles.some((r) =>
    ['SUPER_ADMIN', 'ADMIN', 'MERCHANT_OWNER'].includes(r)
  );

  // Form State
  const [scopeType, setScopeType] = useState<'ALL' | 'CATEGORIES' | 'PRODUCTS'>('ALL');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Format default start/end ISO datetimes for datetime-local inputs
  const nowStr = new Date().toISOString().slice(0, 16);
  const in30DaysStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    imageUrl: '',
    discountPercent: 15,
    startDateTime: nowStr,
    endDateTime: in30DaysStr,
    membershipTypeIds: [] as string[],
  });

  useEffect(() => {
    initData();
  }, [user]);

  const initData = async () => {
    try {
      setLoading(true);
      let targetMerchantId = user?.merchantId;
      if (!targetMerchantId && isMerchantOrAdmin) {
        const merchRes = await api.get('/merchants');
        if (merchRes.data.data.merchants?.length > 0) {
          targetMerchantId = merchRes.data.data.merchants[0].id;
        }
      }

      setMerchantId(targetMerchantId);

      const [offersRes, memRes] = await Promise.all([
        api.get('/offers', { params: targetMerchantId ? { merchantId: targetMerchantId } : {} }),
        api.get('/memberships'),
      ]);

      setOffers(offersRes.data.data || []);
      setMemberships(memRes.data.data || []);

      if (targetMerchantId) {
        const merchDetails = await api.get(`/merchants/${targetMerchantId}`);
        if (merchDetails.data.data.products) {
          setProducts(merchDetails.data.data.products);
        }
        if (merchDetails.data.data.categories) {
          setCategories(merchDetails.data.data.categories);
        }
      }
    } catch (error) {
      console.error('Failed to load offers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !productSearch ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(productSearch));
      const matchCat = !productCategoryFilter || p.categoryId === productCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  const handleOpenModal = () => {
    setScopeType('ALL');
    setSelectedCategoryIds([]);
    setSelectedProductIds([]);
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      imageUrl: '',
      discountPercent: 15,
      startDateTime: new Date().toISOString().slice(0, 16),
      endDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      membershipTypeIds: memberships.map((m) => m.id), // select all by default
    });
    setShowModal(true);
  };

  const handleCategoryToggle = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleProductToggle = (prodId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  const handleSelectAllProducts = () => {
    const allFilteredIds = filteredProducts.map((p) => p.id);
    setSelectedProductIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
  };

  const handleClearProducts = () => {
    setSelectedProductIds([]);
  };

  const handleMembershipToggle = (memId: string) => {
    setFormData((prev) => {
      const exists = prev.membershipTypeIds.includes(memId);
      return {
        ...prev,
        membershipTypeIds: exists
          ? prev.membershipTypeIds.filter((id) => id !== memId)
          : [...prev.membershipTypeIds, memId],
      };
    });
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantId) {
      alert('تعذر تحديد المتجر لإطلاق العرض');
      return;
    }

    if (formData.membershipTypeIds.length === 0) {
      alert('يرجى تحديد فئة عضوية واحدة على الأقل مشمولة بالعرض');
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      alert('يرجى تحديد تاريخ ووقت البداية وتاريخ ووقت النهاية بشكل صحيح');
      return;
    }

    if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      alert('تاريخ ووقت النهاية يجب أن يكون بعد تاريخ ووقت البداية');
      return;
    }

    if (scopeType === 'CATEGORIES' && selectedCategoryIds.length === 0) {
      alert('يرجى اختيار تصنيف واحد على الأقل ينطبق عليه العرض');
      return;
    }

    if (scopeType === 'PRODUCTS' && selectedProductIds.length === 0) {
      alert('يرجى اختيار منتج واحد على الأقل ينطبق عليه العرض');
      return;
    }

    try {
      const payload = {
        merchantId,
        title: formData.title || formData.titleAr,
        titleAr: formData.titleAr,
        description: formData.description,
        discountPercent: formData.discountPercent,
        startDate: new Date(formData.startDateTime).toISOString(),
        endDate: new Date(formData.endDateTime).toISOString(),
        membershipTypeIds: formData.membershipTypeIds,
        categoryId: scopeType === 'CATEGORIES' && selectedCategoryIds.length > 0 ? selectedCategoryIds[0] : undefined,
        productIds: scopeType === 'PRODUCTS' ? selectedProductIds : undefined,
        productId: scopeType === 'PRODUCTS' && selectedProductIds.length > 0 ? selectedProductIds[0] : undefined,
      };

      await api.post('/offers', payload);
      setShowModal(false);
      initData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'تعذر إضافة العرض الترويجي');
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
            <span className="text-indigo-500 font-bold">دليل العروض والخصومات</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            العروض والخصومات الترويجية
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isMerchantOrAdmin && (
            <button
              onClick={handleOpenModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
            >
              <Plus size={16} />
              <span>إطلاق عرض ترويجي جديد</span>
            </button>
          )}

          <button
            onClick={initData}
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

      {/* Offers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل العروض الترويجية النشطة...</p>
        </div>
      ) : offers.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <Tag size={48} className="mx-auto text-slate-500 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد عروض ترويجية نشطة حالياً</p>
          {isMerchantOrAdmin && (
            <button
              onClick={handleOpenModal}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              + إطلاق عرض جديد
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer: any) => {
            const targetCategory = offer.category;
            const targetProduct = offer.product;
            const displayImage = offer.imageUrl || targetProduct?.imageUrl || offer.merchant?.logoUrl;

            return (
              <div
                key={offer.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                  isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  {displayImage ? (
                    <div className="relative w-full h-44 overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-slate-900">
                      <img
                        src={displayImage}
                        alt={offer.titleAr || offer.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white font-black text-xs shadow flex items-center gap-1.5 border border-indigo-400/30">
                        <span>🎉</span>
                        <span>خصم %{offer.discountPercent}</span>
                      </div>
                      {offer.merchant && (
                        <div className="absolute bottom-3 right-3 left-3 flex items-center gap-2 text-white text-xs font-bold bg-slate-900/60 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                          {offer.merchant.logoUrl ? (
                            <img src={offer.merchant.logoUrl} alt={offer.merchant.businessName} className="w-6 h-6 rounded-lg object-cover" />
                          ) : (
                            <Store size={16} className="text-indigo-400" />
                          )}
                          <span className="truncate">{offer.merchant?.businessNameAr || offer.merchant?.businessName}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="bg-indigo-600 p-3.5 text-center text-white font-black text-base flex items-center justify-center gap-2">
                        <span>🎉</span>
                        <span>خصم خاص {offer.discountPercent}%</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    {!displayImage && (
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                        <Store size={15} />
                        <span>{offer.merchant?.businessNameAr || offer.merchant?.businessName || 'المتجر الشريك'}</span>
                      </div>
                    )}

                    <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {offer.titleAr || offer.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Scope Indicators */}
                    <div className="space-y-1.5 pt-1">
                      {targetCategory && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Layers size={13} />
                          <span>التصنيف المشمول: {targetCategory.nameAr || targetCategory.name}</span>
                        </div>
                      )}

                      {targetProduct && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Package size={13} />
                          <span>المنتج المشمول: {targetProduct.nameAr || targetProduct.name} ({targetProduct.price} ر.س)</span>
                        </div>
                      )}

                      {!targetCategory && !targetProduct && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={13} />
                          <span>يشمل جميع منتجات المتجر</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-3.5 border-t text-xs font-semibold space-y-1 ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock size={13} className="text-indigo-400" />
                      <span>يبدأ: {new Date(offer.startDate).toLocaleString('ar-SA')}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar size={13} className="text-red-400" />
                      <span>ينتهي: {new Date(offer.endDate).toLocaleString('ar-SA')}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={12} />
                      <span>مفعل</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offer Creation Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 border-b border-slate-700/50 bg-inherit">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                <span>إطلاق عرض ترويجي مخصص جديد</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-6 space-y-5">
              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">عنوان العرض الترويجي</label>
                  <input
                    type="text"
                    required
                    placeholder="خصم أسبوع القهوة الفاخرة"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value, title: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
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
                <label className="block text-xs font-bold mb-1">تفاصيل واشتراطات العرض</label>
                <textarea
                  rows={2}
                  required
                  placeholder="خصم مباشر على الطلبات عبر مسح بطاقات العضوية بالـ QR..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <ImageUploadInput
                  label="صورة العرض الترويجي (اختياري)"
                  value={formData.imageUrl}
                  onChange={(base64Url) => setFormData({ ...formData, imageUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              {/* Scope Selector: Categories vs Products vs All */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-indigo-400">
                  نطاق وتحديد تطبيق العرض الترويجي:
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setScopeType('ALL')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      scopeType === 'ALL'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>كافة منتجات المتجر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeType('CATEGORIES')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      scopeType === 'CATEGORIES'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Layers size={16} />
                    <span>تطبيق على فئات محددة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeType('PRODUCTS')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      scopeType === 'PRODUCTS'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Package size={16} />
                    <span>تطبيق على منتجات محددة</span>
                  </button>
                </div>

                {/* Multi-Select Category Picker */}
                {scopeType === 'CATEGORIES' && (
                  <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-xs font-bold mb-2">اختر الفئات / التصنيفات المشمولة بالخصم:</label>
                    {categories.length === 0 ? (
                      <p className="text-xs text-slate-400 font-semibold">لا يوجد تصنيفات مضافة حتى الآن في المتجر.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categories.map((cat) => {
                          const isSelected = selectedCategoryIds.includes(cat.id);
                          return (
                            <div
                              key={cat.id}
                              onClick={() => handleCategoryToggle(cat.id)}
                              className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-bold transition ${
                                isSelected
                                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                                  : isDark
                                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>📁 {cat.nameAr || cat.name}</span>
                              {isSelected ? <CheckSquare size={16} className="text-indigo-500" /> : <Square size={16} className="text-slate-500" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Multi-Select Product Picker */}
                {scopeType === 'PRODUCTS' && (
                  <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold">
                        حدد المنتجات المشمولة ({selectedProductIds.length} محددة):
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllProducts}
                          className="text-[11px] font-bold text-indigo-400 hover:underline"
                        >
                          تحديد الكل
                        </button>
                        <button
                          type="button"
                          onClick={handleClearProducts}
                          className="text-[11px] font-bold text-slate-400 hover:underline"
                        >
                          إلغاء الكل
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="البحث باسم المنتج..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className={`w-full h-9 pr-9 pl-3 rounded-xl border text-xs font-semibold outline-none ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
                          }`}
                        />
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>

                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className={`h-9 px-3 rounded-xl border text-xs font-semibold outline-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
                        }`}
                      >
                        <option value="">جميع التصنيفات</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nameAr || cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pt-1">
                      {filteredProducts.length === 0 ? (
                        <p className="col-span-2 text-xs text-slate-400 text-center py-2 font-semibold">لا يوجد منتجات مطابقة للبحث</p>
                      ) : (
                        filteredProducts.map((prod) => {
                          const isSelected = selectedProductIds.includes(prod.id);
                          return (
                            <div
                              key={prod.id}
                              onClick={() => handleProductToggle(prod.id)}
                              className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-bold transition ${
                                isSelected
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                  : isDark
                                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="truncate">
                                <span>{prod.nameAr || prod.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono ms-1">({prod.price} ر.س)</span>
                              </div>
                              {isSelected ? <CheckSquare size={16} className="text-amber-400 shrink-0" /> : <Square size={16} className="text-slate-500 shrink-0" />}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mandatory Start Datetime & End Datetime Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-indigo-400 mb-1">
                    تاريخ ووقت بداية العرض (إجباري):
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDateTime}
                    onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-mono font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-red-400 mb-1">
                    تاريخ ووقت نهاية العرض (إجباري):
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDateTime}
                    onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-mono font-semibold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  />
                </div>
              </div>

              {/* Target Membership Tiers */}
              <div>
                <label className="block text-xs font-bold mb-2">فئات العضوية المشمولة بالخصم:</label>
                <div className="flex flex-wrap gap-2">
                  {memberships.map((m) => {
                    const isChecked = formData.membershipTypeIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleMembershipToggle(m.id)}
                        className={`px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-bold flex items-center gap-1.5 transition ${
                          isChecked
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {isChecked ? <CheckSquare size={14} /> : <Square size={14} />}
                        <span>{m.nameAr || m.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
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
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  إطلاق العرض الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
