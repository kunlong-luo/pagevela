import type { StylePreset } from './toolbar-presets';

const NAMED_COLORS: Record<string, string> = {
  blue: '#2563eb',
  emerald: '#059669',
  slate: '#334155',
  indigo: '#4f46e5',
  crimson: '#e11d48',
  amber: '#d97706',
  teal: '#0d9488',
  bronze: '#8d6037',
};

interface PresetResumeThumbnailProps {
  preset: StylePreset;
  isEn: boolean;
}

/** Lightweight schematic preview: intentionally contains no real resume data. */
export function PresetResumeThumbnail({ preset, isEn }: PresetResumeThumbnailProps) {
  const { settings } = preset;
  const accent = settings.themeColor === 'custom'
    ? settings.customColor || '#4f46e5'
    : NAMED_COLORS[settings.themeColor || 'indigo'] || '#4f46e5';
  const centered = settings.headerLayout === 'centered';
  const stacked = settings.headerLayout === 'stacked';
  const twoColumn = settings.templateLayout === 'two-column';
  const card = settings.templateLayout === 'modern-card';
  const serif = settings.fontFamily === 'serif';
  const sectionNames = isEn
    ? ['Education', 'Experience', 'Projects', 'Skills']
    : ['教育背景', '工作经历', '项目经历', '专业技能'];

  const section = (title: string, index: number) => (
    <div
      key={title}
      className={card ? 'rounded-sm border border-slate-100 bg-slate-50 px-1.5 py-1' : 'py-0.5'}
    >
      <div className="mb-1 flex items-center gap-1">
        <span className="whitespace-nowrap text-[6px] font-bold" style={{ color: accent }}>
          {title}
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: accent, opacity: 0.3 }} />
      </div>
      <div className="space-y-1">
        <div className="h-[3px] rounded-full bg-slate-300/70" style={{ width: index % 2 === 0 ? '84%' : '97%' }} />
        <div className="h-[3px] rounded-full bg-slate-200" style={{ width: index % 2 === 0 ? '95%' : '75%' }} />
        <div className="h-[3px] rounded-full bg-slate-200" style={{ width: index % 2 === 0 ? '70%' : '88%' }} />
      </div>
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[132px] overflow-hidden rounded-[5px] border border-slate-200 bg-white px-3 pb-3 pt-3.5 shadow-sm"
      style={{ aspectRatio: '210 / 297', fontFamily: serif ? 'Georgia, serif' : 'Arial, sans-serif' }}
    >
      {settings.topAccentLine && (
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: accent }} />
      )}
      <div className={centered ? 'border-b border-slate-200 pb-2 text-center' : 'border-b border-slate-200 pb-2'}>
        <div className="text-[10px] font-bold leading-tight text-slate-800">
          {isEn ? 'Alex Chen' : '李晓明'}
        </div>
        <div className="mt-0.5 text-[5.5px] font-semibold" style={{ color: accent }}>
          {isEn ? 'Software Engineer' : '求职意向 · 产品经理'}
        </div>
        <div className={centered ? 'mt-1 flex justify-center gap-1' : stacked ? 'mt-1 flex gap-1.5' : 'mt-1 flex gap-1'}>
          <div className="h-[2px] w-9 rounded-full bg-slate-300" />
          <div className="h-[2px] w-6 rounded-full bg-slate-200" />
        </div>
      </div>
      <div className={twoColumn ? 'mt-2 grid grid-cols-[0.85fr_1.4fr] gap-2' : 'mt-2 space-y-2'}>
        {twoColumn ? (
          <>
            <div className="space-y-2 border-r border-slate-200 pr-1">
              {section(sectionNames[0], 0)}
              {section(sectionNames[3], 3)}
            </div>
            <div className="space-y-2">
              {section(sectionNames[1], 1)}
              {section(sectionNames[2], 2)}
            </div>
          </>
        ) : sectionNames.map(section)}
      </div>
    </div>
  );
}
