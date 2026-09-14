import React, { useState } from 'react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { KeyRound, Mail, Lock, Eye, EyeOff, X, CheckCircle2, AlertCircle, Phone, ArrowLeft } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPrefill?: (identifier: string, pass: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onSuccessPrefill }) => {
  const { isDark } = useTheme();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!emailOrPhone.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الجوال');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('كلمة المرور الجديدة يجب أن تحتوي على 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        emailOrPhone,
        newPassword,
      });

      const successText = res.data?.message || 'تم إعادة تعيين كلمة المرور بنجاح!';
      setSuccess(successText);

      if (onSuccessPrefill) {
        onSuccessPrefill(emailOrPhone, newPassword);
      }

      setTimeout(() => {
        setEmailOrPhone('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر إعادة تعيين كلمة المرور. يرجى التأكد من أن الحساب موجود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn dir-rtl font-['Cairo',sans-serif]">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all relative ${
          isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/40 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">استعادة كلمة المرور</h3>
              <p className="text-xs text-slate-400">للتجار والعملاء: أدخل جوالك أو إيميلك لتعيين كلمة مرور جديدة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-500/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Phone Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              رقم الجوال أو البريد الإلكتروني للحساب <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="مثال: merchant@loyalty.com أو 05xxxxxxxx"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className={`w-full h-11 pr-10 pl-4 rounded-xl border text-xs font-medium outline-none transition ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              />
              <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              كلمة المرور الجديدة <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full h-11 pr-10 pl-10 rounded-xl border text-xs font-medium outline-none transition ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              />
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="أعد كتابة كلمة المرور الجديدة"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-11 pr-10 pl-10 rounded-xl border text-xs font-medium outline-none transition ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              />
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'حفظ كلمة المرور الجديدة'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`h-11 px-4 rounded-xl border text-xs font-bold transition ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
