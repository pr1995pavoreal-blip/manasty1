import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Store,
  Award,
  MapPin,
  Tag,
  History,
  FileText,
  ShieldAlert,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onOpenScanner?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenScanner }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  const roles = user.roles || [];
  const isAdmin = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
  const isMerchant = roles.includes('MERCHANT_OWNER') || roles.includes('MERCHANT_EMPLOYEE');
  const isCustomer = roles.includes('CUSTOMER');

  return (
    <div
      className="bg-slate-900/90 border-e border-slate-800 min-vh-100 p-4 d-flex flex-column"
      style={{ width: '270px', minWidth: '270px' }}
    >
      <div className="text-slate-400 extra-small fw-bold text-uppercase tracking-widest mb-3 px-2 font-mono">
        Enterprise Workspace
      </div>

      <ul className="nav nav-pills flex-column gap-2 mb-auto">
        {/* Common Dashboard */}
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>{t('dashboard')}</span>
          </NavLink>
        </li>

        {/* Customer Section */}
        {isCustomer && (
          <>
            <li className="nav-item mt-3">
              <span className="text-slate-500 extra-small font-mono text-uppercase px-2 d-block mb-1">
                Customer Services
              </span>
            </li>
            <li className="nav-item">
              <NavLink
                to="/my-card"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <CreditCard size={20} />
                <span>{t('myCard')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/nearby-stores"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <MapPin size={20} />
                <span>{t('nearbyStores')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/offers"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Tag size={20} />
                <span>{t('offers')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <History size={20} />
                <span>{t('transactions')}</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Merchant Section */}
        {isMerchant && (
          <>
            <li className="nav-item mt-3">
              <span className="text-slate-500 extra-small font-mono text-uppercase px-2 d-block mb-1">
                Merchant Operations
              </span>
            </li>
            {onOpenScanner && (
              <li className="nav-item my-2">
                <button
                  className="gold-btn btn w-100 d-flex align-items-center justify-content-center gap-2 font-black py-2.5 rounded-2xl shadow-lg border-0"
                  onClick={onOpenScanner}
                >
                  <QrCode size={20} />
                  <span>{t('scanQR')}</span>
                </button>
              </li>
            )}
            <li className="nav-item">
              <NavLink
                to="/merchant-portal"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Store size={20} />
                <span>{t('merchants')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/offers"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Tag size={20} />
                <span>{t('offers')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <History size={20} />
                <span>{t('transactions')}</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <li className="nav-item mt-3">
              <span className="text-slate-500 extra-small font-mono text-uppercase px-2 d-block mb-1">
                Platform Admin
              </span>
            </li>
            <li className="nav-item">
              <NavLink
                to="/customers-admin"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Users size={20} />
                <span>{t('customers')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/merchants-admin"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Store size={20} />
                <span>{t('merchants')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/memberships-admin"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Award size={20} />
                <span>{t('memberships')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reports-admin"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <FileText size={20} />
                <span>{t('reports')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/audit-logs"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 fw-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <ShieldAlert size={20} />
                <span>{t('auditLogs')}</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div className="border-t border-slate-800 pt-3 text-slate-400 text-center extra-small font-mono d-flex align-items-center justify-content-center gap-1">
        <Sparkles size={12} className="text-amber-400" />
        <span>Loyalty Platform SaaS v2.0</span>
      </div>
    </div>
  );
};
