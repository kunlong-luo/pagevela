export type ThemeColor = 'blue' | 'emerald' | 'slate' | 'indigo' | 'crimson' | 'amber' | 'teal' | 'bronze' | 'custom';
export type FontSize = 'compact' | 'standard' | 'relaxed';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type PaperMargin = 'compact' | 'standard' | 'relaxed';
export type LayoutMode = 'split' | 'editor' | 'preview';
export type ResumeHeaderLayout = 'split' | 'centered' | 'stacked';
export type H2Style = 'accent-line' | 'modern-badge' | 'minimal-clean' | 'academic-line' | 'bracket-tag';
export type TemplateLayout = 'single' | 'two-column' | 'academic' | 'modern-card';
export type Language = 'zh' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';
export type PaperSize = 'a4' | 'letter';
export type MarketRegion = 'cn' | 'us' | 'ca' | 'uk' | 'ie' | 'international';
export type DocumentNomenclature = 'resume' | 'cv';
export type DateStyle = 'cn-dot' | 'month-short' | 'month-long';
export type PersonalField = 'photo' | 'age' | 'gender' | 'marital' | 'nationality' | 'political' | 'hometown';

export interface ResumeSettings {
  themeColor: ThemeColor;
  customColor?: string;
  /** @deprecated App theme is global; kept only for legacy backup compatibility. */
  themeMode?: ThemeMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
  margin: PaperMargin;
  layoutMode: LayoutMode;
  h2Style: H2Style;
  topAccentLine: boolean;
  lineHeight: number;
  blockGap: number;
  letterSpacing: number;
  showPageBreakLine: boolean;
  templateLayout: TemplateLayout;
  /** Defaults to split for existing documents. */
  headerLayout?: ResumeHeaderLayout;
  /** Resume content language. UI language is stored globally. */
  lang?: Language;
  paperSize?: PaperSize;
  marketRegion?: MarketRegion;
  dateStyle?: DateStyle;
  isPrivacyMasked?: boolean;
  /** Optional, explicit photo visibility; defaults to China-market only. */
  showPhoto?: boolean;
}

export interface ResumeDraft {
  id: string;
  title: string;
  templateId?: string;
  markdown: string;
  settings: ResumeSettings;
  timestamp: string;
  isAutoSave?: boolean;
}

export interface ResumeProfile {
  id: string;
  name: string;
  targetRole?: string;
  /**
   * The content template this profile originated from.
   * Kept separately from markdown so edits do not erase template identity.
   */
  templateId?: string;
  markdown: string;
  settings: ResumeSettings;
  customFileName?: string;
  /** Locally cropped JPEG. Never embedded in Markdown or share URLs. */
  photoDataUrl?: string;
  updatedAt: string;
  createdAt: string;
  isDefault?: boolean;
}
