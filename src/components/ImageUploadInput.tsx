import React, { useState } from 'react';
import { Upload, X, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
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
  const [compressing, setCompressing] = useState<boolean>(false);

  const compressImage = (file: File, maxKb: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const maxDimension = 1000;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.85;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          const getKb = (str: string) => Math.round((str.length * 3) / 4 / 1024);

          while (getKb(dataUrl) > maxKb && quality > 0.15) {
            quality -= 0.15;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    try {
      setCompressing(true);
      const compressedBase64 = await compressImage(file, maxSizeKb);
      onChange(compressedBase64);
    } catch (err) {
      console.error('Image compression failed:', err);
      setError('تعذر قراءة وضغط الصورة. يرجى اختيار ملف صورة صالح.');
    } finally {
      setCompressing(false);
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange('');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label} <span className="text-emerald-500 font-bold">(يتم الضغط أوتوماتيكياً لأقل من {maxSizeKb}KB)</span>
      </label>

      {compressing ? (
        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 text-center flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">جاري ضغط وتقليص الصورة تلقائياً...</span>
        </div>
      ) : value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-emerald-500/30 p-2 bg-emerald-500/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={value}
              alt="صورة مرفوعة"
              className="w-12 h-12 rounded-xl object-cover border border-slate-700/20 shrink-0 shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} />
                <span>تم معالجة وضغط الصورة بنجاح</span>
              </p>
              <p className="text-[10px] text-slate-400">جاهزة للحفظ والتعديل بحجم ممتاز</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition">
              <span>تغيير</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
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
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">انقر لاختيار صورة الشعار من جهازك</p>
          <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP • سيتم ضغط الصورة تلقائياً لأقل من 500KB</p>

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
