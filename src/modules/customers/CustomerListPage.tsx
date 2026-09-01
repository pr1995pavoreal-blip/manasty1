import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Customer, MembershipType } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  Search,
  RefreshCw,
  UserPlus,
  Eye,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  CreditCard,
  X,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Award,
  Calendar,
  QrCode,
  Printer
} from 'lucide-react';

export const CustomerListPage: React.FC = () => {
  const { isDark } = useTheme();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [statusCounts, setStatusCounts] = useState<{ ALL: number; ACTIVE: number; INACTIVE: number }>({
    ALL: 0,
    ACTIVE: 0,
    INACTIVE: 0,
  });

  // Modal States
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Create Customer Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    city: 'الرياض',
    membershipTypeId: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchMembershipTypes();
  }, [activeTab]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers', {
        params: {
          search,
          status: activeTab,
          limit: 100,
        },
      });

      setCustomers(res.data.data.customers || []);
      if (res.data.data.statusCounts) {
        setStatusCounts(res.data.data.statusCounts);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipTypes = async () => {
    try {
      const res = await api.get('/memberships');
      setMembershipTypes(res.data.data.membershipTypes || res.data.data || []);
    } catch (error) {
      console.error('Failed to load membership types:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleToggleStatus = async (customer: Customer) => {
    try {
      await api.patch(`/customers/${customer.id}/toggle-status`);
      const newStatusText = customer.user.isActive ? 'تم إيقاف حساب العميل' : 'تم تفعيل حساب العميل بنجاح';
      setActionSuccess(newStatusText);
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCustomers();
    } catch (error) {
      alert('تعذر تحديث حالة الحساب');
    }
  };

  const handleOpenCardModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCardModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setFormError('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      password: '',
      city: 'الرياض',
      membershipTypeId: membershipTypes[0]?.id || '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName || !formData.phone) {
      setFormError('يرجى ملء الاسم الكامل ورقم الجوال');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/customers', formData);
      setIsCreateModalOpen(false);
      setActionSuccess('تم إضافة العميل الجديد وإصدار بطاقة العضوية بنجاح!');
      setTimeout(() => setActionSuccess(''), 3500);
      fetchCustomers();
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'فشل إضافة العميل');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]" dir="rtl">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">دليل العملاء والعضويات</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            إدارة العملاء والعضويات
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition cursor-pointer"
          >
            <UserPlus size={16} />
            <span>إضافة عميل جديد</span>
          </button>

          <button
            onClick={fetchCustomers}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              isDark
                ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
            }`}
          >
            <RefreshCw size={15} className={`text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      {/* Action Toast Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar Card */}
      <div
        className={`p-4 rounded-2xl border flex flex-col gap-4 shadow-sm ${
          isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>جميع العملاء</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.ALL || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>الحسابات النشطة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.ACTIVE || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('INACTIVE')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'INACTIVE'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <PauseCircle size={14} className="text-rose-400" />
            <span>الحسابات الموقوفة</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{statusCounts.INACTIVE || 0}</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="البحث باسم العميل، البريد، الجوال، أو رقم العضوية..."
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
              إجمالي العملاء المعروضين: <strong className="text-indigo-500">{customers.length}</strong>
            </span>
          </div>
        </form>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">جاري تحميل بيانات العملاء والعضويات...</p>
        </div>
      ) : customers.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <Users size={48} className="mx-auto text-slate-500 mb-3 opacity-50" />
          <p className="text-sm font-bold">لا يوجد عملاء مطابقين ضمن هاذه الفئة حالياً</p>
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
                  <th className="py-3.5 px-4">اسم العميل</th>
                  <th className="py-3.5 px-4">البريد الإلكتروني</th>
                  <th className="py-3.5 px-4">رقم الهاتف</th>
                  <th className="py-3.5 px-4">رقم العضوية</th>
                  <th className="py-3.5 px-4">بطاقة العضوية</th>
                  <th className="py-3.5 px-4">الفئة</th>
                  <th className="py-3.5 px-4">حالة الحساب</th>
                  <th className="py-3.5 px-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/40">
                {customers.map((c) => {
                  const card = c.membershipCard;
                  const tier = card?.membershipType;
                  const isActive = c.user.isActive;

                  return (
                    <tr key={c.id} className="hover:bg-slate-500/5 transition">
                      {/* Customer Name */}
                      <td className={`py-4 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-sm shrink-0">
                            {c.user.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="block font-bold">{c.user.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{c.city || 'الرياض'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-slate-400 font-medium ltr text-right">
                        {c.user.email}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-300 font-mono ltr text-right font-bold">
                        {c.user.phone || 'غير مسجل'}
                      </td>

                      {/* Card Number */}
                      <td className="py-4 px-4 font-mono font-bold text-indigo-500 dark:text-indigo-400">
                        {card?.cardNumber || 'بدون بطاقة'}
                      </td>

                      {/* Membership Card Column (Preview Button) */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleOpenCardModal(c)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          <CreditCard size={14} />
                          <span>معاينة البطاقة</span>
                        </button>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-4 px-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm"
                          style={{ backgroundColor: tier?.badgeColor || '#6366F1' }}
                        >
                          {tier?.nameAr || tier?.name || 'الفئة الفضية'}
                        </span>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {isActive ? <CheckCircle2 size={12} /> : <PauseCircle size={12} />}
                          <span>{isActive ? 'نشط' : 'موقوف'}</span>
                        </span>
                      </td>

                      {/* Action Controls */}
                      <td className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition ${
                            isActive
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-600 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title={isActive ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                        >
                          {isActive ? (
                            <>
                              <PauseCircle size={14} />
                              <span>إيقاف</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle size={14} />
                              <span>تفعيل</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 💳 CUSTOMER DIGITAL MEMBERSHIP CARD MODAL */}
      {isCardModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-['Cairo',sans-serif]" dir="rtl">
          <div className="bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-sm font-black">بطاقة العضوية الرقمية للعميل</h3>
              </div>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Render Card */}
            <div className="p-6 flex flex-col items-center space-y-6">
              {/* Digital Card Box */}
              <div
                className="w-full p-6 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] select-none"
                style={{
                  background: `linear-gradient(135deg, ${
                    selectedCustomer.membershipCard?.membershipType?.badgeColor || '#6366F1'
                  } 0%, #0F172A 100%)`,
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Row */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm tracking-tight text-white">منصتي</h4>
                      <p className="text-[9px] text-white/80 font-medium">بطاقة العضوية الموحدة</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
                    {selectedCustomer.membershipCard?.membershipType?.nameAr || 'العضوية الذهبية'}
                  </span>
                </div>

                {/* Card Middle: Customer Name & Number */}
                <div className="my-4 relative z-10">
                  <p className="text-[10px] text-white/70 font-semibold mb-0.5">حامل البطاقة</p>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    {selectedCustomer.user.fullName}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-xs font-mono font-bold tracking-widest text-white/90">
                    <span>{selectedCustomer.membershipCard?.cardNumber || 'CARD-99887766'}</span>
                    <span className="text-[10px] font-sans bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      {selectedCustomer.membershipCard?.membershipType?.discountPercent || 20}% خصم
                    </span>
                  </div>
                </div>

                {/* Card Bottom Row: Expiry */}
                <div className="flex items-center justify-between relative z-10 text-[10px] text-white/70 font-semibold pt-2 border-t border-white/10">
                  <span>تاريخ الصلاحية: {selectedCustomer.membershipCard?.expiresAt ? new Date(selectedCustomer.membershipCard.expiresAt).toLocaleDateString('ar-SA') : 'مفتوح'}</span>
                  <span>الحالة: {selectedCustomer.user.isActive ? 'نشطة' : 'موقوفة'}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-3 w-full">
                <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
                  <QRCodeSVG
                    value={selectedCustomer.membershipCard?.verificationToken || selectedCustomer.id}
                    size={130}
                    level="H"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">رمز الـ QR الخاص بالحساب</p>
                  <p className="text-[10px] text-slate-400 font-semibold">يستخدم المسح للتحقق والخصم المباشر في المتاجر</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>طباعة</span>
              </button>

              <button
                onClick={() => setIsCardModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👤 CREATE NEW CUSTOMER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-['Cairo',sans-serif]" dir="rtl">
          <div className="bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <UserPlus size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black">إضافة عميل جديد وإصدار عضوية</h3>
                  <p className="text-xs text-slate-500">أدخل بيانات العميل وفئة العضوية الأولى</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <XCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">
                  الاسم الكامل للعميل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: خالد محمد السالم"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">المدينة</label>
                  <div className="relative">
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="الخبر">الخبر</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <MapPin size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  كلمة المرور <span className="text-slate-400 font-normal">(افتراضي: Customer123!)</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </div>
                </div>
              </div>

              {/* Membership Tier Choice */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  اختر فئة العضوية للعميل <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {membershipTypes.length > 0 ? (
                    membershipTypes.map((mt) => (
                      <button
                        key={mt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, membershipTypeId: mt.id })}
                        className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                          formData.membershipTypeId === mt.id
                            ? 'border-indigo-600 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: mt.badgeColor || '#6366F1' }}
                          />
                          <span className="text-[10px] font-extrabold text-indigo-400 font-mono">
                            {mt.discountPercent}% خصم
                          </span>
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          {mt.nameAr || mt.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 text-xs text-slate-400 p-2">جاري استخدام الفئة الفضية الافتراضية</div>
                  )}
                </div>
              </div>

              {/* Actions */}
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
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  <Check size={16} />
                  <span>حفظ وإصدار العضوية</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
