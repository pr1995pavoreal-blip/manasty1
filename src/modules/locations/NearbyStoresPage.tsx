import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MerchantBranch, DiscountRule, Offer, Product, BusinessCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  MapPin,
  Navigation,
  Phone,
  Store,
  Compass,
  RefreshCw,
  Tag,
  Percent,
  X,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Coffee,
  CupSoda,
  Utensils,
  Smartphone,
  Building2,
  Search,
  Maximize2,
  Package,
  Eye,
} from 'lucide-react';

export const NearbyStoresPage: React.FC = () => {
  const { isDark } = useTheme();
  const [branches, setBranches] = useState<MerchantBranch[]>([]);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [gpsStatus, setGpsStatus] = useState<string>('جاري تحديد موقعك الجغرافي...');
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});
  const [selectedBranch, setSelectedBranch] = useState<MerchantBranch | null>(null);
  const [activeTab, setActiveTab] = useState<'discounts' | 'products'>('discounts');
  const [modalSearch, setModalSearch] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    requestGPS();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/business-categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const requestGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setGpsStatus(`تم رصد موقعك بفاعلية (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
          fetchNearbyStores(pos.coords.latitude, pos.coords.longitude, selectedCategoryId);
        },
        (error) => {
          setGpsStatus('لم يتم منح الإذن بالوصول للموقع. استعراض كافة المتاجر المتاحة.');
          fetchNearbyStores(undefined, undefined, selectedCategoryId);
        }
      );
    } else {
      setGpsStatus('المتصفح لا يدعم تحديد الموقع. استعراض كافة المتاجر.');
      fetchNearbyStores(undefined, undefined, selectedCategoryId);
    }
  };

  const fetchNearbyStores = async (lat?: number, lon?: number, categoryId?: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (lat) params.lat = lat;
      if (lon) params.lon = lon;
      if (categoryId && categoryId !== 'ALL') params.businessCategoryId = categoryId;

      const res = await api.get('/locations/nearby', { params });
      setBranches(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategoryId(catId);
    fetchNearbyStores(coords.lat, coords.lon, catId);
  };

  const getItemCount = (branch: MerchantBranch) => {
    const offersCount = branch.merchant?.offers?.length || 0;
    const discountsCount = branch.merchant?.discounts?.length || 0;
    const productsCount = branch.merchant?.products?.length || 0;
    return offersCount + discountsCount + productsCount;
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className={`flex items-center gap-2 text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">المتاجر والفروع القريبة</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            المتاجر والفروع الشريكة القريبة
          </h1>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1.5">
            <Navigation size={14} />
            <span>{gpsStatus}</span>
          </p>
        </div>

        <button
          onClick={requestGPS}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
            isDark
              ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
          }`}
        >
          <RefreshCw size={15} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
          <span>إعادة تحديد الموقع GPS</span>
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            تصنيف الفئات والأنشطة التجارية:
          </span>
          {selectedCategoryId !== 'ALL' && (
            <button
              onClick={() => handleCategorySelect('ALL')}
              className="text-[11px] font-bold text-indigo-500 hover:underline flex items-center gap-1"
            >
              <X size={12} />
              <span>إلغاء التصفية</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-2 ${
              selectedCategoryId === 'ALL'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                : isDark
                ? 'bg-[#0B0F19] text-slate-300 border-slate-800 hover:bg-slate-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers size={15} />
            <span>كافة الأنشطة والأنواع</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                    : isDark
                    ? 'bg-[#0B0F19] text-slate-300 border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.nameAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearby Stores Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            جاري تتبع المتاجر القريبة منك...
          </p>
        </div>
      ) : branches.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <Compass size={48} className="mx-auto text-slate-400 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد متاجر قريبة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map((branch: MerchantBranch) => {
            const totalItems = getItemCount(branch);
            return (
              <div
                key={branch.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                  isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {branch.merchant?.logoUrl ? (
                        <img
                          src={branch.merchant.logoUrl}
                          alt={branch.merchant?.businessNameAr || branch.merchant?.businessName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-md shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center font-bold text-lg shrink-0 border border-indigo-500/20">
                          <Store size={22} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className={`text-base font-black truncate ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                          {branch.merchant?.businessNameAr || branch.merchant?.businessName || branch.name}
                        </h3>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                          فرع: {branch.nameAr || branch.name}
                        </p>
                      </div>
                    </div>

                    {branch.distanceKm !== null && branch.distanceKm !== undefined && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono shrink-0">
                        يبعد {branch.distanceKm} كم
                      </span>
                    )}
                  </div>

                  <div className={`space-y-2 text-xs font-semibold mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-slate-400 shrink-0" />
                      <span>{branch.address}، {branch.city}</span>
                    </div>
                    {branch.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span className="font-mono dir-ltr">{branch.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      setSelectedBranch(branch);
                      setActiveTab('discounts');
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
                      isDark
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    <Tag size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>عرض الخصومات والمنتجات</span>
                    {totalItems > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
                        {totalItems}
                      </span>
                    )}
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${branch.latitude},${branch.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition"
                  >
                    <Navigation size={16} />
                    <span>الخيارات والاتجاهات عبر Google Maps</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Store Discounts & Products */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isDark ? 'bg-[#0B0F19] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-center gap-3.5">
                {selectedBranch.merchant?.logoUrl ? (
                  <img
                    src={selectedBranch.merchant.logoUrl}
                    alt={selectedBranch.merchant?.businessNameAr || selectedBranch.merchant?.businessName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20 shrink-0">
                    <Store size={26} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {selectedBranch.merchant?.businessNameAr || selectedBranch.merchant?.businessName || selectedBranch.name}
                    </h2>
                    {selectedBranch.distanceKm !== null && selectedBranch.distanceKm !== undefined && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono">
                        يبعد {selectedBranch.distanceKm} كم
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                    فرع: {selectedBranch.nameAr || selectedBranch.name} ({selectedBranch.city})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBranch(null)}
                className={`p-2 rounded-xl border transition ${
                  isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className={`flex border-b px-6 ${isDark ? 'border-slate-800 bg-[#0B0F19]' : 'border-slate-200 bg-slate-50/50'}`}>
              <button
                onClick={() => setActiveTab('discounts')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'discounts'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Percent size={15} />
                <span>الخصومات والعروض المتاحة</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold">
                  {(selectedBranch.merchant?.discounts?.length || 0) + (selectedBranch.merchant?.offers?.length || 0)}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'products'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <ShoppingBag size={15} />
                <span>المنتجات والأسعار</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold">
                  {selectedBranch.merchant?.products?.length || 0}
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {activeTab === 'discounts' ? (
                <div className="space-y-5">
                  {/* Discounts Rules List */}
                  {selectedBranch.merchant?.discounts && selectedBranch.merchant.discounts.length > 0 && (
                    <div>
                      <h4 className={`text-xs font-bold mb-3 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                        <Sparkles size={14} className="text-amber-500" />
                        <span>قواعد الخصم الحصرية للمتجر</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedBranch.merchant.discounts.map((rule: any) => (
                          <div
                            key={rule.id}
                            className={`p-4 rounded-2xl border flex flex-col justify-between shadow-sm ${
                              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/90'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h5 className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                                  {rule.titleAr || rule.title}
                                </h5>
                                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500 text-slate-950 shrink-0 shadow-sm">
                                  {rule.discountType === 'PERCENTAGE'
                                    ? `خصم %${rule.discountValue}`
                                    : `خصم ${rule.discountValue} ريال`}
                                </span>
                              </div>

                              {rule.membershipType && (
                                <div className="mb-2">
                                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${
                                    isDark
                                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                                  }`}>
                                    مخصص لـ: {rule.membershipType.nameAr || rule.membershipType.name}
                                  </span>
                                </div>
                              )}

                              <p className={`text-[11px] font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {rule.minPurchaseAmount > 0
                                  ? `الحد الأدنى للشراء: ${rule.minPurchaseAmount} ريال`
                                  : 'بدون حد أدنى للشراء'}
                              </p>
                            </div>

                            <div className={`mt-3 pt-2 border-t flex items-center gap-1 text-[10px] font-bold ${
                              isDark ? 'border-slate-800/80 text-indigo-400' : 'border-slate-200 text-indigo-600'
                            }`}>
                              <CheckCircle2 size={12} />
                              <span>مفعل تلقائياً لحاملي العضوية</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offers List */}
                  {selectedBranch.merchant?.offers && selectedBranch.merchant.offers.length > 0 && (
                    <div>
                      <h4 className={`text-xs font-bold mb-3 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                        <Tag size={14} className="text-indigo-500" />
                        <span>العروض الموسمية والمباشرة</span>
                      </h4>
                      <div className="space-y-3">
                        {selectedBranch.merchant.offers.map((offer: any) => (
                          <div
                            key={offer.id}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/90'
                            }`}
                          >
                            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                              {offer.imageUrl ? (
                                <img
                                  src={offer.imageUrl}
                                  alt={offer.titleAr || offer.title}
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold shrink-0">
                                  <Tag size={22} />
                                </div>
                              )}
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className={`text-xs sm:text-sm font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                                    {offer.titleAr || offer.title}
                                  </h5>
                                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                    تخفيض %{offer.discountPercent}
                                  </span>
                                </div>
                                {offer.description && (
                                  <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {offer.description}
                                  </p>
                                )}
                                {(offer.category || offer.product) && (
                                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                                    {offer.category && <span>الفئة: {offer.category.nameAr || offer.category.name} </span>}
                                    {offer.product && <span>المنتج: {offer.product.nameAr || offer.product.name}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-mono shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              <Calendar size={13} className="text-slate-400" />
                              <span>حتى: {new Date(offer.endDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state for discounts */}
                  {(!selectedBranch.merchant?.discounts || selectedBranch.merchant.discounts.length === 0) &&
                    (!selectedBranch.merchant?.offers || selectedBranch.merchant.offers.length === 0) && (
                      <div className={`p-8 text-center rounded-2xl border ${isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                        <Sparkles size={36} className="mx-auto text-amber-500 mb-2 opacity-80" />
                        <p className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>خصم الشريك الأساسي مفعل</p>
                        <p className={`text-[11px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          يستفيد جميع أعضاء المنصة من خصومات المتجر المباشرة عند إبراز البطاقة الرقمية في الفرع.
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                /* Products Tab */
                <div className="space-y-4">
                  {/* Search inside Products Tab */}
                  {selectedBranch.merchant?.products && selectedBranch.merchant.products.length > 0 && (
                    <div className="relative">
                      <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="ابحث عن منتج بالاسم أو الوصف..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                        className={`w-full h-10 pr-10 pl-4 rounded-xl border text-xs font-semibold outline-none transition ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-[#0F172A] focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  )}

                  {(() => {
                    const allProducts = selectedBranch.merchant?.products || [];
                    const filtered = allProducts.filter((p) => {
                      if (!modalSearch.trim()) return true;
                      const q = modalSearch.toLowerCase();
                      return (
                        p.name?.toLowerCase().includes(q) ||
                        (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
                        (p.description && p.description.toLowerCase().includes(q))
                      );
                    });

                    if (allProducts.length === 0) {
                      return (
                        <div className={`p-8 text-center rounded-2xl border ${isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                          <ShoppingBag size={36} className="mx-auto text-slate-400 mb-2 opacity-70" />
                          <p className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>لا توجد منتجات محددة بالمركز حالياً</p>
                          <p className={`text-[11px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            يمكنك الاطلاع على قائمة الخدمات والخصومات المباشرة بالفرع.
                          </p>
                        </div>
                      );
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-8 text-xs font-bold text-slate-400">
                          لا توجد نتائج تطابق "{modalSearch}"
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {filtered.map((product: Product & { category?: any }) => {
                          const firstDiscount = selectedBranch.merchant?.discounts?.[0];
                          const discountVal = firstDiscount?.discountValue || 0;
                          const hasDiscount = discountVal > 0;
                          const finalPrice = hasDiscount
                            ? firstDiscount?.discountType === 'PERCENTAGE'
                              ? product.price * (1 - discountVal / 100)
                              : Math.max(0, product.price - discountVal)
                            : product.price;

                          return (
                            <div
                              key={product.id}
                              className={`p-4 rounded-2xl border flex flex-col justify-between transition hover:border-indigo-500/50 shadow-sm ${
                                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/90'
                              }`}
                            >
                              <div>
                                <div className={`w-full h-36 rounded-xl mb-3 overflow-hidden flex items-center justify-center relative border group ${
                                  isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-slate-200/60 border-slate-300/60'
                                }`}>
                                  {product.imageUrl ? (
                                    <>
                                      <img
                                        src={product.imageUrl}
                                        alt={product.nameAr || product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <button
                                        onClick={() => setPreviewImage(product.imageUrl!)}
                                        className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5"
                                      >
                                        <Maximize2 size={16} />
                                        <span>عرض الصورة بالكامل</span>
                                      </button>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                                      <ShoppingBag size={32} className="opacity-60" />
                                      <span className="text-[10px] font-bold">بدون صورة</span>
                                    </div>
                                  )}
                                  {hasDiscount && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-black bg-rose-500 text-white shadow">
                                      مخصوم %{firstDiscount?.discountValue}
                                    </span>
                                  )}
                                </div>

                                <h5 className={`text-xs font-black mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                                  {product.nameAr || product.name}
                                </h5>
                                {product.category && (
                                  <span className="inline-block text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mb-1.5">
                                    {product.category.nameAr || product.category.name}
                                  </span>
                                )}
                                {product.description && (
                                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {product.description}
                                  </p>
                                )}
                              </div>

                              <div className={`mt-3 pt-2 border-t flex items-center justify-between ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                                <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>السعر:</span>
                                <div className="flex items-center gap-1.5">
                                  {hasDiscount && (
                                    <span className="text-[11px] text-slate-400 line-through font-mono">
                                      {product.price} ر.س
                                    </span>
                                  )}
                                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                                    {finalPrice.toFixed(2)} ر.س
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 ${isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-100 bg-slate-50'}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <MapPin size={14} className="text-indigo-500" />
                <span>{selectedBranch.address}</span>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border border-slate-700/50">
            <img src={previewImage} alt="صورة المنتج" className="max-w-full max-h-[85vh] object-contain rounded-3xl" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
