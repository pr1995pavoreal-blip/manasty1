import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import {
  Users,
  Store,
  Tag,
  FileText,
  Activity,
  Calendar,
  Filter,
  ArrowUpLeft,
  ChevronDown,
  ShieldCheck,
  Bell,
  AlertTriangle,
  FileCheck,
  UserPlus,
  Clock,
  ExternalLink,
  CreditCard,
  MapPin,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface DashboardPageProps {
  onOpenScanner?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenScanner }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('آخر 7 أيام');

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = user?.roles || [];
  const isCustomerOnly = roles.includes('CUSTOMER') && !roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN') && !roles.includes('MERCHANT_OWNER') && !roles.includes('MERCHANT_EMPLOYEE');

  if (isCustomerOnly) {
    return (
      <div className="space-y-8 py-2 sm:py-4">
        {/* Welcome Header Banner */}
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
            isDark
              ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-900/40 text-white'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 border-indigo-500 text-white'
          }`}
        >
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-100 border border-white/20">
              <Sparkles size={14} className="text-amber-300" />
              <span>أهلاً بك في منصتك الموحدة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              مرحباً بك، {user?.fullName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              يسعدنا تواجدك معنا. يمكنك الوصول لجميع خدماتك وبطاقتك الرقمية والاستفادة من أفضل العروض المتاحة بسهولة.
            </p>
          </div>
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 2 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: My Digital Card */}
          <Link
            to="/my-card"
            className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl no-underline flex flex-col justify-between min-h-[230px] ${
              isDark
                ? 'bg-[#0B0F19] hover:bg-slate-900 border-slate-800 text-white'
                : 'bg-white hover:bg-indigo-50/50 border-slate-200 text-[#0F172A] shadow-md'
            }`}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <CreditCard size={28} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black mb-2 text-indigo-500">
                  بطاقتي الرقمية
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  عرض بطاقة العضوية الخاصة بك والرمز الكيو آر (QR Code) للحصول على الخصومات فوراً لدى التجار.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/20 flex items-center justify-between text-indigo-500 font-bold text-sm group-hover:text-indigo-400">
              <span>عرض البطاقة</span>
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Nearby Stores */}
          <Link
            to="/nearby-stores"
            className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl no-underline flex flex-col justify-between min-h-[230px] ${
              isDark
                ? 'bg-[#0B0F19] hover:bg-slate-900 border-slate-800 text-white'
                : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-[#0F172A] shadow-md'
            }`}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <MapPin size={28} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black mb-2 text-emerald-500">
                  المتاجر القريبة
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  استكشف الفروع والمتاجر القريبة منك للاستفادة من أقوى العروض والخصومات المتاحة حالياً.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/20 flex items-center justify-between text-emerald-500 font-bold text-sm group-hover:text-emerald-400">
              <span>استكشاف المتاجر</span>
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // Fallback defaults matching design if loading or empty
  const todayTransactions = stats?.todayTransactions ?? 128;
  const totalReports = stats?.totalReports ?? 532;
  const totalDiscounts = stats?.totalDiscounts ?? 2356;
  const totalMerchants = stats?.totalMerchants ?? 847;
  const totalCustomers = stats?.totalCustomers ?? 1248;

  const trendData = stats?.last7DaysTrend || [
    { date: '26 مايو', count: 400 },
    { date: '27 مايو', count: 300 },
    { date: '28 مايو', count: 380 },
    { date: '29 مايو', count: 230 },
    { date: '30 مايو', count: 410 },
    { date: '31 مايو', count: 250 },
    { date: '1 يونيو', count: 400 },
  ];

  const discountDistribution = stats?.discountDistribution || [
    { name: 'خصومات نسبية', percent: 35, color: '#6366F1' },
    { name: 'خصومات ثابتة', percent: 25, color: '#3B82F6' },
    { name: 'خصومات مالية', percent: 20, color: '#A855F7' },
    { name: 'خصومات قانونية', percent: 15, color: '#8B5CF6' },
    { name: 'أخرى', percent: 5, color: '#64748B' },
  ];

  const recentOperations = stats?.recentAuditLogs && stats.recentAuditLogs.length > 0
    ? stats.recentAuditLogs
    : [
        { id: '1', action: 'إنشاء عميل جديد', user: 'Ahmed Al Saud', date: '01 يونيو 2024 - 10:30 ص', status: 'مكتملة' },
        { id: '2', action: 'تحديث صلاحيات مستخدم', user: 'Sarah Al Harbi', date: '01 يونيو 2024 - 09:15 ص', status: 'مكتملة' },
        { id: '3', action: 'إضافة ضابط جديد', user: 'Mohammed Ali', date: '31 مايو 2024 - 04:45 م', status: 'مكتملة' },
        { id: '4', action: 'حذف متجر', user: 'Noura Fahad', date: '31 مايو 2024 - 02:20 م', status: 'مكتملة' },
        { id: '5', action: 'تصدير تقرير', user: 'Ahmed Al Saud', date: '31 مايو 2024 - 10:05 ص', status: 'مكتملة' },
      ];

  const recentAlerts = stats?.recentNotifications && stats.recentNotifications.length > 0
    ? stats.recentNotifications
    : [
        { id: '1', title: 'تم إنشاء عميل جديد', desc: 'تم إنشاء عميل جديد باسم شركة النور للتجارة', timeAgo: 'منذ 10 دقائق', icon: UserPlus, color: 'text-indigo-400 bg-indigo-500/10' },
        { id: '2', title: 'انتهاء صلاحية ضابط', desc: 'ضابط المعلومات سينتهي خلال 3 أيام', timeAgo: 'منذ 1 ساعة', icon: ShieldCheck, color: 'text-purple-400 bg-purple-500/10' },
        { id: '3', title: 'تقرير جديد متاح', desc: 'تم إنشاء تقرير الأداء الشهري', timeAgo: 'منذ 3 ساعات', icon: FileCheck, color: 'text-blue-400 bg-blue-500/10' },
        { id: '4', title: 'نشاط غير معتاد', desc: 'تم تسجيل دخول من جهاز جديد', timeAgo: 'منذ 5 ساعات', icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10' },
      ];

  return (
    <div className="space-y-6">
      {/* Top Header & Date Range Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span className="text-indigo-500 font-bold">لوحة التحكم</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            لوحة التحكم
          </h1>
        </div>

        {/* Date Selector & Filter Controls */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
              isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-[#0F172A]'
            }`}
          >
            <Calendar size={15} className="text-indigo-500" />
            <span>26 مايو - 1 يونيو 2024</span>
          </div>

          <button
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
              isDark
                ? 'bg-[#0B0F19] hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
            }`}
          >
            <Filter size={15} className="text-indigo-500" />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: العمليات اليوم */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">العمليات اليوم</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Activity size={18} />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {todayTransactions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpLeft size={14} />
            <span>+9.4% من أمس</span>
          </div>
        </div>

        {/* Card 2: إجمالي التقارير */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">إجمالي التقارير</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText size={18} />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {totalReports.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpLeft size={14} />
            <span>+6.1% من الشهر الماضي</span>
          </div>
        </div>

        {/* Card 3: إجمالي الخصومات */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">إجمالي الخصومات</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Tag size={18} />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {totalDiscounts.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpLeft size={14} />
            <span>+15.3% من الشهر الماضي</span>
          </div>
        </div>

        {/* Card 4: إجمالي المتاجر */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">إجمالي المتاجر</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Store size={18} />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {totalMerchants.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpLeft size={14} />
            <span>+8.7% من الشهر الماضي</span>
          </div>
        </div>

        {/* Card 5: إجمالي العملاء */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">إجمالي العملاء</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users size={18} />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {totalCustomers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpLeft size={14} />
            <span>+12.5% من الشهر الماضي</span>
          </div>
        </div>
      </div>

      {/* Middle Charts Section (Transactions Line Area Chart & Discounts Donut Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Wave Area Chart Container */}
        <div
          className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              العمليات
            </h3>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>{timeRange}</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Smooth Wave Area Chart */}
          <div className="relative h-64 w-full flex items-end pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="700" y2="190" stroke={isDark ? '#1E293B' : '#F1F5F9'} strokeDasharray="4 4" />

              {/* Area Gradient Path */}
              <path
                d="M 0 50 C 60 140, 120 160, 180 50 C 240 140, 300 170, 360 80 C 420 40, 480 130, 540 110 C 600 80, 660 50, 700 50 L 700 220 L 0 220 Z"
                fill="url(#chartGradient)"
              />

              {/* Main Wave Line */}
              <path
                d="M 0 50 C 60 140, 120 160, 180 50 C 240 140, 300 170, 360 80 C 420 40, 480 130, 540 110 C 600 80, 660 50, 700 50"
                fill="none"
                stroke="#6366F1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Data Points */}
              <circle cx="0" cy="50" r="5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="180" cy="50" r="5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="360" cy="80" r="5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="420" cy="40" r="5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="540" cy="110" r="5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="700" cy="50" r="5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>

          {/* X Axis Date Labels */}
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-3 border-t border-slate-800/40">
            {trendData.map((d: any, idx: number) => (
              <span key={idx}>{d.date}</span>
            ))}
          </div>
        </div>

        {/* Right Donut Chart Container */}
        <div
          className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="mb-4">
            <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              توزيع الخصومات حسب النوع
            </h3>
          </div>

          {/* Donut Visual */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={isDark ? '#1E293B' : '#E2E8F0'}
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3.8"
                  strokeDasharray="35, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3.8"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-35"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="3.8"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-60"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  {totalDiscounts.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400">إجمالي الخصومات</span>
              </div>
            </div>

            {/* Legend Item Breakdown List */}
            <div className="space-y-2.5 w-full text-xs font-bold">
              {discountDistribution.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/40 text-center">
            <a
              href="#all-types"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 inline-flex items-center gap-1.5 transition"
            >
              <span>عرض جميع الأنواع</span>
              <span>←</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section: Operations Table & Notifications Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Administrative Operations Table (7/12 width) */}
        <div
          className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                أحدث العمليات الإدارية
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className={`border-b text-slate-400 font-bold ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <th className="pb-3 pr-2">العملية</th>
                    <th className="pb-3 px-2">المستخدم</th>
                    <th className="pb-3 px-2">التاريخ والوقت</th>
                    <th className="pb-3 pl-2 text-left">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {recentOperations.map((op: any, idx: number) => (
                    <tr key={idx} className="group hover:bg-slate-500/5 transition">
                      <td className={`py-3.5 pr-2 font-bold ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                        {op.action}
                      </td>
                      <td className="py-3.5 px-2 text-slate-400 font-medium">{op.user}</td>
                      <td className="py-3.5 px-2 text-slate-400 font-mono dir-ltr text-right">{op.date}</td>
                      <td className="py-3.5 pl-2 text-left">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {op.status || 'مكتملة'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/40 text-right mt-4">
            <a
              href="#all-operations"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 inline-flex items-center gap-1.5 transition"
            >
              <span>عرض جميع العمليات</span>
              <span>←</span>
            </a>
          </div>
        </div>

        {/* Alerts & Notifications Widget (5/12 width) */}
        <div
          className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between shadow-sm ${
            isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                التنبيهات والإشعارات
              </h3>
            </div>

            <div className="space-y-4">
              {recentAlerts.map((alertItem: any, idx: number) => {
                const IconComponent = alertItem.icon || Bell;
                return (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-500/5 transition">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${alertItem.color || 'text-indigo-400 bg-indigo-500/10'}`}>
                      <IconComponent size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                          {alertItem.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {alertItem.timeAgo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {alertItem.desc || alertItem.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/40 text-right mt-4">
            <a
              href="#all-alerts"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 inline-flex items-center gap-1.5 transition"
            >
              <span>عرض جميع التنبيهات</span>
              <span>←</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
