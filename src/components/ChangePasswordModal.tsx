import React, { useState } from 'react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Key, Lock, Eye, EyeOff, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
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
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccess(res.data?.message || 'تم تحديث كلمة المرور بنجاح!');
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر تغيير كلمة المرور. يرجى التأكد من صحة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn dir-rtl">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all relative ${
          isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/40 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">تغيير كلمة المرور</h3>
              <p className="text-xs text-slate-400">تحديث كلمة المرور لحسابك للحفاظ على الأمان</p>
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
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              كلمة المرور الحالية <span className="text-slate-500 font-normal">(اختياري للتحقق)</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور الحالية"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full h-11 pr-10 pl-10 rounded-xl border text-xs font-medium outline-none transition ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              />
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'حفظ وتحديث كلمة المرور'}
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
