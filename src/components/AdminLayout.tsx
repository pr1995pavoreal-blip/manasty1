import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  Store,
  Tag,
  FileText,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  Settings,
  Activity,
  Globe,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  CreditCard,
  History,
  MapPin,
  QrCode,
  Award,
  Package,
  Layers,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onOpenScanner?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onOpenScanner }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close sidebar on mobile when navigating pages
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return <>{children}</>;

  const roles = user.roles || [];
  const isAdmin = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
  const isMerchant = roles.includes('MERCHANT_OWNER') || roles.includes('MERCHANT_EMPLOYEE');
  const isCustomer = roles.includes('CUSTOMER');

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Cairo',sans-serif] antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
      dir="rtl"
    >
      {/* Top Navigation Header */}
      <header
        className={`h-16 border-b backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 transition-colors ${
          isDark
            ? 'bg-[#0B0F19]/90 border-slate-800/80 text-white'
            : 'bg-white/90 border-slate-200 text-[#0F172A] shadow-sm'
        }`}
      >
        {/* Right Side Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="القائمة"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2 sm:gap-3 no-underline min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30 shrink-0">
              <ShieldCheck size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div className="min-w-0">
              <span
                className={`font-black text-xs sm:text-base block leading-tight tracking-tight truncate max-w-[130px] min-[380px]:max-w-[200px] sm:max-w-none ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}
              >
                المنصة الموحدة للعضويات والخصومات
              </span>
              <span className="text-[8px] sm:text-[9px] text-indigo-400 font-mono tracking-widest uppercase block font-semibold truncate">
                ENTERPRISE SAAS PORTAL
              </span>
            </div>
          </Link>
        </div>

        {/* Left Side Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Scanner Button for Merchants */}
          {isMerchant && onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <QrCode size={16} />
              <span className="hidden md:inline">مسح العضوية</span>
            </button>
          )}

          {/* Theme Mode Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-400 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-200'
            }`}
            title={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Globe size={15} className="text-indigo-400" />
            <span>{i18n.language.startsWith('ar') ? 'العربية' : 'English'}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              className={`p-2 rounded-xl border relative transition ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                <User size={15} />
              </div>
              <div className="text-right hidden sm:block">
                <span className={`text-xs font-bold block leading-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  {user.fullName}
                </span>
                <span className="text-[10px] text-indigo-400 font-mono block leading-tight font-semibold">
                  {user.roles[0]}
                </span>
              </div>
            </button>

            {userDropdownOpen && (
              <div
                className={`absolute left-0 mt-2 w-52 border rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn ${
                  isDark ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
                }`}
              >
                <div className="px-3 py-2 border-b border-slate-700/50">
                  <p className="text-xs font-bold m-0">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 font-mono m-0 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-1 text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <LogOut size={15} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          />
        )}

        {/* Right Sidebar */}
        <aside
          className={`transition-all duration-300 flex flex-col shrink-0 border-l ${
            sidebarOpen
              ? 'fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] shadow-2xl md:static md:w-64 md:shadow-none'
              : 'hidden md:flex md:static md:w-20'
          } ${
            isDark
              ? 'bg-[#0B0F19] border-slate-800/80'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Mobile Drawer Top Header */}
          <div className="p-4 flex items-center justify-between border-b md:hidden border-slate-800/40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-indigo-500" />
              <span className="font-bold text-sm">القائمة الرئيسية</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-xl transition ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-[11px] font-bold text-slate-400 mb-3 px-2 hidden md:block">
              {sidebarOpen ? 'القائمة الرئيسية' : '•'}
            </p>

            <nav className="flex flex-col gap-1">
              {/* Dashboard Link */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                    isActive
                      ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <LayoutDashboard size={18} />
                {sidebarOpen && <span>{isCustomer ? 'الرئيسية' : 'لوحة التحكم'}</span>}
              </NavLink>

              {/* Customer Links */}
              {isCustomer && (
                <>
                  <NavLink
                    to="/my-card"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <CreditCard size={18} />
                    {sidebarOpen && <span>بطاقتي الرقمية</span>}
                  </NavLink>

                  <NavLink
                    to="/nearby-stores"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <MapPin size={18} />
                    {sidebarOpen && <span>المتاجر القريبة</span>}
                  </NavLink>
                </>
              )}

              {/* Merchant Specific Links */}
              {isMerchant && (
                <>
                  <NavLink
                    to="/merchant-portal"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Store size={18} />
                    {sidebarOpen && <span>إدارة متجري والفروع</span>}
                  </NavLink>

                  <NavLink
                    to="/products-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Package size={18} />
                    {sidebarOpen && <span>إدارة المنتجات والأصناف</span>}
                  </NavLink>

                  <NavLink
                    to="/offers"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Tag size={18} />
                    {sidebarOpen && <span>إدارة العروض والخصومات</span>}
                  </NavLink>

                  <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <History size={18} />
                    {sidebarOpen && <span>سجل المعاملات والخصومات</span>}
                  </NavLink>
                </>
              )}

              {/* Admin Menu Items */}
              {isAdmin && (
                <>
                  <NavLink
                    to="/business-categories-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Layers size={18} />
                    {sidebarOpen && <span>فئات الأنشطة التجارية</span>}
                  </NavLink>

                  <NavLink
                    to="/customers-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Users size={18} />
                    {sidebarOpen && <span>العملاء</span>}
                  </NavLink>

                  <NavLink
                    to="/merchants-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Store size={18} />
                    {sidebarOpen && <span>التجار والمتاجر</span>}
                  </NavLink>

                  <NavLink
                    to="/memberships-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Tag size={18} />
                    {sidebarOpen && <span>أنواع الخصومات</span>}
                  </NavLink>

                  <NavLink
                    to="/reports-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <FileText size={18} />
                    {sidebarOpen && <span>التقارير والإحصائيات</span>}
                  </NavLink>

                  <NavLink
                    to="/audit-logs"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <ShieldAlert size={18} />
                    {sidebarOpen && <span>سجل العمليات الإدارية</span>}
                  </NavLink>

                  <NavLink
                    to="/users-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <UserCheck size={18} />
                    {sidebarOpen && <span>إدارة المستخدمين</span>}
                  </NavLink>

                  <NavLink
                    to="/roles-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Award size={18} />
                    {sidebarOpen && <span>الأدوار والصلاحيات</span>}
                  </NavLink>

                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Settings size={18} />
                    {sidebarOpen && <span>الإعدادات</span>}
                  </NavLink>

                  <NavLink
                    to="/activity-logs"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition no-underline ${
                        isActive
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Activity size={18} />
                    {sidebarOpen && <span>سجل النشاطات</span>}
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* User Info & Logout Footer */}
          {sidebarOpen && (
            <div
              className={`p-3 border-t m-3 rounded-2xl flex flex-col gap-2 ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div className="overflow-hidden">
                  <div className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-indigo-400 font-mono font-semibold uppercase">
                    {user.roles[0]}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-red-500 hover:bg-red-500/10 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-red-500/20"
              >
                <LogOut size={14} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors ${
            isDark ? 'bg-[#090D16]' : 'bg-[#F8FAFC]'
          }`}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
