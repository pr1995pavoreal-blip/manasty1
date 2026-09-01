import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, X, Check, Search } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  initialCity?: string;
  initialAddress?: string;
  initialMapsUrl?: string;
  onSelectLocation: (data: {
    latitude: number;
    longitude: number;
    city: string;
    address: string;
    googleMapsUrl: string;
  }) => void;
}

const PRESET_CITIES = [
  { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
  { name: 'جدة', lat: 21.5433, lng: 39.1728 },
  { name: 'الدمام', lat: 26.4207, lng: 50.0888 },
  { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579 },
  { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
  { name: 'الخبر', lat: 26.2172, lng: 50.1971 },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  initialLat = 24.7136,
  initialLng = 46.6753,
  initialCity = 'الرياض',
  initialAddress = '',
  initialMapsUrl = '',
  onSelectLocation,
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [city, setCity] = useState<string>(initialCity);
  const [address, setAddress] = useState<string>(initialAddress);
  const [mapsInputUrl, setMapsInputUrl] = useState<string>(initialMapsUrl);

  useEffect(() => {
    if (isOpen) {
      setLat(initialLat || 24.7136);
      setLng(initialLng || 46.6753);
      setCity(initialCity || 'الرياض');
      setAddress(initialAddress || '');
      setMapsInputUrl(initialMapsUrl || `https://www.google.com/maps?q=${initialLat || 24.7136},${initialLng || 46.6753}`);
    }
  }, [isOpen, initialLat, initialLng, initialCity, initialAddress, initialMapsUrl]);

  if (!isOpen) return null;

  // Extract coordinates if user pastes a Google Maps URL
  const handleParseMapsUrl = (url: string) => {
    setMapsInputUrl(url);
    if (!url) return;

    // Pattern matching for lat,lng in google maps URLs
    const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const regex2 = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const regex3 = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;

    const match = url.match(regex1) || url.match(regex2) || url.match(regex3);
    if (match && match[1] && match[2]) {
      const parsedLat = parseFloat(match[1]);
      const parsedLng = parseFloat(match[2]);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        setLat(parsedLat);
        setLng(parsedLng);
      }
    }
  };

  const handleCitySelect = (c: typeof PRESET_CITIES[0]) => {
    setCity(c.name);
    setLat(c.lat);
    setLng(c.lng);
    setMapsInputUrl(`https://www.google.com/maps?q=${c.lat},${c.lng}`);
  };

  const currentGoogleMapsUrl = mapsInputUrl || `https://www.google.com/maps?q=${lat},${lng}`;

  const handleSave = () => {
    onSelectLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      city: city || 'الرياض',
      address: address || 'الشارع الرئيسي',
      googleMapsUrl: currentGoogleMapsUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-['Cairo',sans-serif]" dir="rtl">
      <div className="bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black">موقع المتجر وخريطة جوجل</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">حدد موقع المتجر والإحداثيات أو الصق رابط خرائط Google</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick City Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              اختر المدينة أو حدد المكان:
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleCitySelect(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    city === c.name
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Navigation size={12} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* City & Detailed Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المدينة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثل: الرياض"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                العنوان والحي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثل: طريق الملك فهد - حي العليا"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Google Maps Link Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              رابط خرائط جوجل (Google Maps Link):
            </label>
            <div className="relative">
              <input
                type="url"
                value={mapsInputUrl}
                onChange={(e) => handleParseMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=24.7136,46.6753"
                className="w-full h-11 pr-10 pl-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-500 ltr"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <MapPin size={16} />
              </div>
              <a
                href={currentGoogleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute left-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
              >
                <span>معاينة</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">يمكنك إدراج رابط المشاركة من خرائط قوقل وسيقوم النظام باستخراج الإحداثيات تلقائياً.</p>
          </div>

          {/* Latitude & Longitude Coordinates */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Navigation size={14} className="text-indigo-500" />
                الإحداثيات الجغرافية الدقيقة (Latitude & Longitude)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">خط العرض (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => {
                    const newLat = parseFloat(e.target.value) || 0;
                    setLat(newLat);
                    setMapsInputUrl(`https://www.google.com/maps?q=${newLat},${lng}`);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">خط الطول (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => {
                    const newLng = parseFloat(e.target.value) || 0;
                    setLng(newLng);
                    setMapsInputUrl(`https://www.google.com/maps?q=${lat},${newLng}`);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/25"
          >
            <Check size={16} />
            <span>حفظ الموقع والاعتماد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
