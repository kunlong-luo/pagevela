import React, { useEffect, useMemo, useState } from 'react';
import { Phone } from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js/min';
import { useResumeStore } from '../../store/useResumeStore';
import { storage, STORAGE_KEYS } from '../../lib/storage';
import { CustomSelect } from '../ui/CustomSelect';
import {
  formatPhoneDraft,
  getPhoneRegionOptions,
  inferPhoneRegion,
  normalizePhoneForResume,
  reformatPhoneForCountry,
  type PhoneRegionCode,
} from '../../lib/phone-utils';

function getSavedRegion(profileId: string): PhoneRegionCode {
  const saved = storage.get<Record<string, PhoneRegionCode>>(
    STORAGE_KEYS.PHONE_REGIONS,
    {},
  );
  return saved[profileId] || '';
}

function saveRegion(profileId: string, nextRegion: PhoneRegionCode) {
  const saved = storage.get<Record<string, PhoneRegionCode>>(
    STORAGE_KEYS.PHONE_REGIONS,
    {},
  );
  storage.set(STORAGE_KEYS.PHONE_REGIONS, {
    ...saved,
    [profileId]: nextRegion,
  });
}

interface InternationalPhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  lang: 'zh' | 'en';
  label: string;
  placeholder: string;
}

export function InternationalPhoneField({
  value,
  onChange,
  lang,
  label,
  placeholder,
}: InternationalPhoneFieldProps) {
  const activeProfileId = useResumeStore((state) => state.activeProfileId);
  const detectedRegion = inferPhoneRegion(value);
  const [region, setRegion] = useState<PhoneRegionCode>(
    detectedRegion || getSavedRegion(activeProfileId) || '',
  );

  useEffect(() => {
    const detected = inferPhoneRegion(value);
    if (detected) {
      setRegion(detected);
      saveRegion(activeProfileId, detected);
      return;
    }

    setRegion(getSavedRegion(activeProfileId) || '');
  }, [activeProfileId, value]);

  useEffect(() => {
    const detected = inferPhoneRegion(value);
    if (detected && detected !== region) {
      setRegion(detected);
      saveRegion(activeProfileId, detected);
    }
  }, [activeProfileId, region, value]);

  const options = useMemo(() => getPhoneRegionOptions(lang), [lang]);
  const regionOptions = useMemo(() => [
    { value: '', label: lang === 'en' ? 'Country / region' : '国家 / 地区' },
    ...options.map(option => ({
      value: option.code,
      label: `${option.name} +${option.callingCode}`,
      group: option.priority
        ? (lang === 'en' ? 'Popular' : '常用地区')
        : (lang === 'en' ? 'All countries & regions' : '全部国家与地区'),
    })),
  ], [lang, options]);

  const handleRegionChange = (next: string) => {
    const nextRegion = next as PhoneRegionCode;
    setRegion(nextRegion);
    saveRegion(activeProfileId, nextRegion);

    if (nextRegion && value.trim()) {
      onChange(reformatPhoneForCountry(value, nextRegion as CountryCode));
    }
  };

  const handlePhoneChange = (next: string) => {
    const formatted = formatPhoneDraft(next, region);
    onChange(formatted);

    const detected = inferPhoneRegion(formatted);
    if (detected) {
      setRegion(detected);
      saveRegion(activeProfileId, detected);
    }
  };

  const handleBlur = () => {
    if (!value.trim()) return;
    onChange(normalizePhoneForResume(value, region));
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </label>

      <div className="grid grid-cols-[minmax(118px,0.8fr)_minmax(0,1.7fr)] gap-2">
        <CustomSelect
          value={region}
          onChange={handleRegionChange}
          ariaLabel={lang === 'en' ? 'Country or region' : '国家或地区'}
          placeholder={lang === 'en' ? 'Country / region' : '国家 / 地区'}
          options={regionOptions}
          className="w-full min-w-0"
          triggerClassName="w-full min-w-0 !h-auto min-h-10"
          maxMenuHeight="max-h-72"
          size="md"
        />

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Phone className="w-4 h-4" />
          </span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value}
            onChange={(event) => handlePhoneChange(event.target.value)}
            onBlur={handleBlur}
            className="w-full pl-9 pr-3 py-2 text-sm tactile-input font-mono text-slate-800 dark:text-slate-100"
            placeholder={placeholder}
            aria-label={label}
          />
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
        {lang === 'en'
          ? 'Choose a region for local numbers, or paste a full international number starting with +.'
          : '本地号码可先选择国家/地区；也可以直接粘贴以 + 开头的完整国际号码。'}
      </p>
    </div>
  );
}
