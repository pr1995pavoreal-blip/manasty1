import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Globe, LogOut, QrCode, User, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenScanner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScanner }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const isMerchantOrAdmin = user?.roles.some((r) =>
    ['SUPER_ADMIN', 'ADMIN', 'MERCHANT_OWNER', 'MERCHANT_EMPLOYEE'].includes(r)
  );

  return (
    <nav className="saas-gradient-header sticky-top py-2 px-4 shadow-xl z-50">
      <div className="d-flex align-items-center justify-content-between">
        <Link className="d-flex align-items-center gap-3 text-white text-decoration-none" to="/">
          <div className="p-2.5 rounded-2xl gold-btn shadow-lg d-flex align-items-center justify-content-center">
            <ShieldCheck size={26} strokeWidth={2.5} />
          </div>
          <div>
            <span className="fw-black fs-5 tracking-tight font-sans text-white d-block leading-tight">
              {t('appName')}
            </span>
            <span className="extra-small text-amber-400 font-mono tracking-widest text-uppercase d-flex align-items-center gap-1">
              <Sparkles size={11} className="text-amber-400" />
              SaaS Enterprise Platform v2.0
            </span>
          </div>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {/* Scanner Button for Merchant & Admin */}
          {user && isMerchantOrAdmin && onOpenScanner && (
            <button
              className="gold-btn btn btn-sm d-flex align-items-center gap-2 px-3 py-2 border-0"
              onClick={onOpenScanner}
            >
              <QrCode size={18} />
              <span>{t('scanQR')}</span>
            </button>
          )}

          {/* Language Toggle Button */}
          <button
            className="btn saas-input btn-sm d-flex align-items-center gap-2 border-slate-700 text-slate-200"
            onClick={toggleLanguage}
          >
            <Globe size={16} className="text-amber-400" />
            <span className="fw-semibold">{i18n.language.startsWith('ar') ? 'English' : 'العربية'}</span>
          </button>

          {/* User Profile & Logout */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn saas-input btn-sm dropdown-toggle d-flex align-items-center gap-2 text-white"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="p-1 rounded-circle bg-amber-500/20 text-amber-400">
                  <User size={16} />
                </div>
                <span className="fw-bold">{user.fullName}</span>
                <span className="badge-amber ms-1">
                  {user.roles[0]}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-0 bg-slate-900 text-white p-2 rounded-2xl">
                <li>
                  <button className="dropdown-item text-rose-400 d-flex align-items-center gap-2 rounded-xl p-2 font-bold" onClick={logout}>
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn saas-input text-amber-400 border-amber-400/40 btn-sm font-bold">
                {t('login')}
              </Link>
              <Link to="/register-customer" className="gold-btn btn btn-sm border-0">
                {t('registerCustomer')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
