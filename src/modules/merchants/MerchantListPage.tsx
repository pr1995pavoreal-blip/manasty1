import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Merchant } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { LocationPickerModal } from '../../components/LocationPickerModal';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import {
  Store,
  MapPin,
  Search,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
  Plus,
  Clock,
  PauseCircle,
  XCircle,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Building2,
  X,
  Check,
  User,
  Mail,
  Phone,
  FileText
} from 'lucide-react';

export const MerchantListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'SUSPENDED' | 'REJECTED'>('ALL');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    ALL: 0,
    APPROVED: 0,
    PENDING: 0,
    SUSPENDED: 0,
    REJECTED: 0,
  });

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    businessName: '',
    businessNameAr: '',
    categoryName: 'مقاهي ومطاعم',
    commercialReg: '',
    description: '',
    logoUrl: '',
    status: 'APPROVED' as 'APPROVED' | 'PENDING' | 'SUSPENDED' | 'REJECTED',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPassword: '',
    address: 'الشارع الرئيسي',
    city: 'الرياض',
    latitude: 24.7136,
    longitude: 46.6753,
    googleMapsUrl: 'https://www.google.com/maps?q=24.7136,46.6753',
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const isAdmin = user?.roles?.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN');

  useEffect(() => {
    fetchMerchants();
  }, [activeTab]);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const res = await api.get('/merchants', {
        params: {
          search,
          status: activeTab,
          limit: 100,
        },
      });

      setMerchants(res.data.data.merchants || []);
      if (res.data.data.statusCounts) {
        setStatusCounts(res.data.data.statusCounts);
      }
    } catch (error) {
      console.error('Failed to load merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMerchants();
  };

  // Status Change Handler (Approve, Reject, Suspend, Activate)
  const handleUpdateStatus = async (merchantId: string, status: 'APPROVED' | 'SUSPENDED' | 'REJECTED' | 'PENDING') => {
    try {
      await api.patch(`/merchants/${merchantId}/status`, { status });
      setActionSuccess(
        status === 'APPROVED'
          ? 'تم تمكين واعتماد المتجر بنجاح!'
          : status === 'SUSPENDED'
          ? 'تم إيقاف المتجر مؤقتاً'
          : status === 'REJECTED'
          ? 'تم رفض طلب المتجر'
          : 'تم تحديث حالة المتجر'
      );
      setTimeout(() => setActionSuccess(''), 3000);
      fetchMerchants();
    } catch (error) {
      alert('تعذر تحديث حالة المتجر');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      businessName: '',
      businessNameAr: '',
      categoryName: 'مقاهي ومطاعم',
      commercialReg: '',
      description: '',
      logoUrl: '',
      status: 'APPROVED',
      ownerName: '',
      ownerEmail: '',
      ownerPhone: '',
      ownerPassword: '',
      address: 'طريق الملك فهد',
      city: 'الرياض',
      latitude: 24.7136,
      longitude: 46.6753,
      googleMapsUrl: 'https://www.google.com/maps?q=24.7136,46.6753',
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (m: Merchant) => {
    setSelectedMerchant(m);
    const mainBranch = m.branches && m.branches.length > 0 ? m.branches[0] : null;

    setFormData({
      businessName: m.businessName || '',
      businessNameAr: m.businessNameAr || '',
      categoryName: m.categoryName || 'عام',
      commercialReg: m.commercialReg || '',
      description: m.description || '',
      logoUrl: m.logoUrl || '',
      status: m.status || (m.isActive ? 'APPROVED' : 'SUSPENDED'),
      ownerName: m.owner?.fullName || '',
      ownerEmail: m.owner?.email || '',
      ownerPhone: m.owner?.phone || '',
      ownerPassword: '',
      address: mainBranch?.address || 'الشارع الرئيسي',
      city: mainBranch?.city || 'الرياض',
      latitude: mainBranch?.latitude || 24.7136,
      longitude: mainBranch?.longitude || 46.6753,
      googleMapsUrl: mainBranch?.googleMapsUrl || `https://www.google.com/maps?q=${mainBranch?.latitude || 24.7136},${mainBranch?.longitude || 46.6753}`,
    });
    setIsEditModalOpen(true);
  };

  // Create Merchant Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/merchants', formData);
      setIsCreateModalOpen(false);
      setActionSuccess('تم إنشاء وإضافة المتجر بنجاح!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchMerchants();
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إنشاء المتجر');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Merchant Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant) return;
    try {
      setSubmitting(true);
      await api.put(`/merchants/${selectedMerchant.id}`, formData);
      setIsEditModalOpen(false);
      setActionSuccess('تم تعديل بيانات المتجر بنجاح!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchMerchants();
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل تعديل المتجر');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered list client-side if needed
  const filteredMerchants = merchants.filter((m) => {
    const term = search.toLowerCase();
    const matchSearch =
      (m.businessNameAr && m.businessNameAr.toLowerCase().includes(term)) ||
      (m.businessName && m.businessName.toLowerCase().includes(term)) ||
      (m.categoryName && m.categoryName.toLowerCase().includes(term)) ||
      (m.commercialReg && m.commercialReg.includes(term));
    return matchSearch;
  });

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">دليل التجار والمتاجر</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            التجار والمتاجر المسجلة
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <Plus size={16} />
              <span>إضافة متجر جديد</span>
            </button>
          )}

          <button
            onClick={fetchMerchants}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              isDark
                ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
            }`}
          >
            <RefreshCw size={15} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث القائمة</span>
          </button>
        </div>
      </div>

      {/* Action Success Toast Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Tabs & Search Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col gap-4 shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>جميع المتاجر</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.ALL || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>المتاجر المعتمدة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.APPROVED || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
              activeTab === 'PENDING'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Clock size={14} className="text-amber-400" />
            <span>بانتظار الموافقة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/30 text-amber-200 text-[10px] font-mono font-bold">
              {statusCounts.PENDING || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('SUSPENDED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'SUSPENDED'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <PauseCircle size={14} className="text-rose-400" />
            <span>المتوقفة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.SUSPENDED || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'REJECTED'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <XCircle size={14} className="text-slate-400" />
            <span>المرفوضة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.REJECTED || 0}</span>
          </button>
        </div>

        {/* Search Input & Total Counter */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="البحث باسم المتجر أو النشاط أو السجل التجاري..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full h-11 pr-10 pl-4 rounded-xl border text-xs font-semibold transition outline-none ${
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
            <span>
              إجمالي المتاجر المعروضة: <strong className="text-indigo-500">{filteredMerchants.length}</strong>
            </span>
          </div>
        </form>
      </div>

      {/* Grid of Merchant Store Cards */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل دليل المتاجر والتجار...</p>
        </div>
      ) : filteredMerchants.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <Store size={48} className="mx-auto text-slate-500 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد متاجر مسجلة ضمن هاذه الفئة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMerchants.map((m) => {
            const currentStatus = m.status || (m.isActive ? 'APPROVED' : 'SUSPENDED');
            const mainBranch = m.branches && m.branches.length > 0 ? m.branches[0] : null;

            return (
              <div
                key={m.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm relative ${
                  isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  {/* Store Header & Status Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xl shrink-0 overflow-hidden">
                      {m.logoUrl ? (
                        <img src={m.logoUrl} alt={m.businessName} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Store size={24} />
                      )}
                    </div>

                    {/* Status Badge Rendering */}
                    {currentStatus === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 size={12} />
                        <span>متجر معتمد</span>
                      </span>
                    )}

                    {currentStatus === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                        <Clock size={12} />
                        <span>بانتظار الموافقة</span>
                      </span>
                    )}

                    {currentStatus === 'SUSPENDED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        <PauseCircle size={12} />
                        <span>متجر متوقف</span>
                      </span>
                    )}

                    {currentStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-500/15 text-slate-500 border border-slate-500/30">
                        <XCircle size={12} />
                        <span>طلب مرفوض</span>
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    {m.businessNameAr || m.businessName}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-400 mb-4">
                    {m.categoryName || 'مقهى ومطعم مختص'}
                  </p>

                  <div
                    className={`p-3.5 rounded-xl space-y-2 text-xs font-semibold mb-4 ${
                      isDark ? 'bg-slate-900/80 text-slate-300' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">عدد الفروع النشطة:</span>
                      <span className="font-bold font-mono text-indigo-400">{m.branches?.length || 1} فروع</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">السجل التجاري:</span>
                      <span className="font-mono">{m.commercialReg || '1010889922'}</span>
                    </div>

                    {mainBranch && (
                      <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800 pt-2 mt-2">
                        <span className="text-slate-400">موقع الخريطة:</span>
                        <a
                          href={mainBranch.googleMapsUrl || `https://www.google.com/maps?q=${mainBranch.latitude},${mainBranch.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <MapPin size={12} />
                          <span>Google Maps</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Quick Action Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  {isAdmin && currentStatus === 'PENDING' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(m.id, 'APPROVED')}
                        className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1 transition shadow-md shadow-emerald-500/20"
                      >
                        <Check size={14} />
                        <span>قبول واعتماد</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(m.id, 'REJECTED')}
                        className="py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <X size={14} />
                        <span>رفض الطلب</span>
                      </button>
                    </div>
                  )}

                  {isAdmin && currentStatus !== 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(m.id, currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED')}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition ${
                          currentStatus === 'APPROVED'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500 hover:text-white'
                            : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {currentStatus === 'APPROVED' ? (
                          <>
                            <PauseCircle size={14} />
                            <span>توقف المتجر</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            <span>تفعيل المتجر</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(m)}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition text-xs font-bold flex items-center gap-1"
                        title="تعديل بيانات المتجر"
                      >
                        <Edit size={14} />
                        <span>تعديل</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/merchant-portal?merchantId=${m.id}`)}
                    className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isDark
                        ? 'bg-slate-900 hover:bg-indigo-600 hover:border-indigo-600 border-slate-700 text-slate-200'
                        : 'bg-slate-100 hover:bg-indigo-600 hover:text-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>استعراض الفروع والعروض</span>
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE STORE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-['Cairo',sans-serif]" dir="rtl">
          <div className="bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Plus size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black">إضافة متجر جديد مباشر</h3>
                  <p className="text-xs text-slate-500">إدخال بيانات المتجر، صاحب المتجر، وتحديد خرائط قوقل</p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">اسم المتجر (بالعربي) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.businessNameAr}
                    onChange={(e) => setFormData({ ...formData, businessNameAr: e.target.value })}
                    placeholder="مثال: محمصة الذهب"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">اسم المتجر (بالإنجليزية) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Golden Roastery"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">نشاط المتجر / الفئة</label>
                  <input
                    type="text"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    placeholder="مقاهي ومطاعم"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">السجل التجاري</label>
                  <input
                    type="text"
                    value={formData.commercialReg}
                    onChange={(e) => setFormData({ ...formData, commercialReg: e.target.value })}
                    placeholder="1010889922"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="صورة شعار المتجر (Logo)"
                  value={formData.logoUrl}
                  onChange={(base64Url) => setFormData({ ...formData, logoUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              {/* Location Picker Quick Block */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <MapPin size={16} />
                    موقع المتجر وخرائط Google Maps
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                  >
                    تحديد الخريطة
                  </button>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap gap-4 font-semibold">
                  <span>المدينة: <strong>{formData.city}</strong></span>
                  <span>العنوان: <strong>{formData.address}</strong></span>
                  <span className="font-mono text-indigo-400">{formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
                </div>
              </div>

              {/* Owner details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold mb-1">بريد صاحب المتجر الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="owner@merchant.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    placeholder="+966500000000"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Check size={16} />
                  <span>إضافة المتجر فوراً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STORE MODAL */}
      {isEditModalOpen && selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-['Cairo',sans-serif]" dir="rtl">
          <div className="bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Edit size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black">تعديل بيانات المتجر والموقع</h3>
                  <p className="text-xs text-slate-500">{selectedMerchant.businessNameAr || selectedMerchant.businessName}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">اسم المتجر (بالعربي)</label>
                  <input
                    type="text"
                    required
                    value={formData.businessNameAr}
                    onChange={(e) => setFormData({ ...formData, businessNameAr: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">اسم المتجر (بالإنجليزية)</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">نشاط المتجر</label>
                  <input
                    type="text"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">السجل التجاري</label>
                  <input
                    type="text"
                    value={formData.commercialReg}
                    onChange={(e) => setFormData({ ...formData, commercialReg: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="صورة شعار المتجر (Logo)"
                  value={formData.logoUrl}
                  onChange={(base64Url) => setFormData({ ...formData, logoUrl: base64Url })}
                  maxSizeKb={500}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">حالة المتجر</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-indigo-500"
                >
                  <option value="APPROVED">معتمد ونشط (Approved)</option>
                  <option value="PENDING">بانتظار الموافقة (Pending)</option>
                  <option value="SUSPENDED">متوقف (Suspended)</option>
                  <option value="REJECTED">مرفوض (Rejected)</option>
                </select>
              </div>

              {/* Location Picker */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <MapPin size={16} />
                    تحديث موقع الخريطة و Google Maps
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                  >
                    تعديل الموقع
                  </button>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap gap-4 font-semibold">
                  <span>المدينة: <strong>{formData.city}</strong></span>
                  <span>العنوان: <strong>{formData.address}</strong></span>
                  <span className="font-mono text-indigo-400">{formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Check size={16} />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Maps Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
        initialCity={formData.city}
        initialAddress={formData.address}
        initialMapsUrl={formData.googleMapsUrl}
        onSelectLocation={(data) => {
          setFormData((prev) => ({
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            address: data.address,
            googleMapsUrl: data.googleMapsUrl,
          }));
        }}
      />
    </div>
  );
};
