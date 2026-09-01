import React, { useState } from 'react';
import { Upload, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ImageUploadInputProps {
  label: string;
  value?: string;
  onChange: (base64Url: string) => void;
  maxSizeKb?: number;
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  maxSizeKb = 500,
  className = '',
}) => {
  const { isDark } = useTheme();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Check size limit (< 500KB)
    const maxSizeBytes = maxSizeKb * 1024;
    if (file.size > maxSizeBytes) {
      const actualKb = Math.round(file.size / 1024);
      setError(`حجم الصورة (${actualKb}KB) يتجاوز الحد المسموح به (${maxSizeKb}KB). يرجى اختيار صورة أصغر.`);
      return;
    }

    // Convert file to Base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setError(null);
    onChange('');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label} <span className="text-slate-400 font-normal">(حد أقصى {maxSizeKb}KB)</span>
      </label>

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-indigo-500/30 p-2 bg-indigo-500/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={value}
              alt="صورة مرفوعة"
              className="w-12 h-12 rounded-xl object-cover border border-slate-700/20 shrink-0 shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">تم تحميل الصورة بنجاح</p>
              <p className="text-[10px] text-slate-400">جاهزة للحفظ والتعديل</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <label className="cursor-pointer p-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition">
              <span>تغيير</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
              title="إزالة الصورة"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition text-center ${
            error
              ? 'border-rose-500 bg-rose-500/5'
              : isDark
              ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500 hover:bg-indigo-500/5'
              : 'border-slate-200 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/50'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 mb-2">
            <Upload size={20} />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">انقر لاختيار صورة من جهازك</p>
          <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP • بحجم أقل من 500KB</p>

          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold mt-1 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
