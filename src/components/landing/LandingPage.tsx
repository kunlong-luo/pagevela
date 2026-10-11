import React, { useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ThemeMode } from '../../types';
import { storage, STORAGE_KEYS } from '../../lib/storage';
import { useConfirm } from '../../context/ConfirmContext';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingShowcase } from './LandingShowcase';
import { LandingFeatures } from './LandingFeatures';
import { LandingPrivacy } from './LandingPrivacy';
import { LandingTemplates } from './LandingTemplates';
import { LandingFaq } from './LandingFaq';
import { LandingBottomCta } from './LandingBottomCta';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onOpenEditor: () => void;
  onSelectTemplate?: (templateId: string) => void;
}

export function LandingPage({ onOpenEditor, onSelectTemplate }: LandingPageProps) {
  const { uiLanguage, setUiLanguage, themeMode, setThemeMode, lastSaved, markdown } = useResumeStore();
  const isEn = uiLanguage === 'en';
  const { confirm } = useConfirm();

  useEffect(() => {
    document.documentElement.lang = uiLanguage === 'zh' ? 'zh-CN' : 'en';
  }, [uiLanguage]);

  const toggleLanguage = () => {
    setUiLanguage(uiLanguage === 'zh' ? 'en' : 'zh');
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const hasExistingResume = storage.getString(STORAGE_KEYS.ONBOARDING_COMPLETE) === '1' && Boolean(markdown.trim());

  const handleSelectTemplate = async (templateId: string) => {
    if (hasExistingResume) {
      const approved = await confirm({
        title: isEn ? 'Replace active resume?' : '替换当前简历？',
        message: isEn
          ? 'Loading this template replaces your active draft. Export a backup first if you want to keep current work.'
          : '载入此模板将替换当前正在编辑的简历内容。如需保留当前草稿，请先导出备份。',
        confirmText: isEn ? 'Replace and continue' : '确认替换并继续',
        cancelText: isEn ? 'Cancel' : '取消',
        type: 'warning',
      });
      if (!approved) return;
    }
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      onOpenEditor();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white animate-fadeIn">
      {/* 1. Header / Top Navigation */}
      <LandingNavbar
        isEn={isEn}
        themeMode={themeMode}
        onToggleLanguage={toggleLanguage}
        onToggleTheme={toggleTheme}
        onOpenEditor={onOpenEditor}
      />

      {/* 2. Hero Section */}
      <LandingHero
        isEn={isEn}
        hasExistingResume={hasExistingResume}
        lastSaved={lastSaved}
        onOpenEditor={onOpenEditor}
      />

      {/* 3. Interactive Split Showcase */}
      <LandingShowcase
        isEn={isEn}
        onOpenEditor={onOpenEditor}
      />

      {/* 4. Core Features Grid */}
      <LandingFeatures
        isEn={isEn}
      />

      {/* 5. Privacy & Security Section */}
      <LandingPrivacy
        isEn={isEn}
      />

      {/* 6. Built-in Templates Showcase */}
      <LandingTemplates
        isEn={isEn}
        uiLanguage={uiLanguage}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* 7. FAQ Section */}
      <LandingFaq
        isEn={isEn}
      />

      {/* 8. Bottom CTA Banner */}
      <LandingBottomCta
        isEn={isEn}
        onOpenEditor={onOpenEditor}
      />

      {/* 9. Footer */}
      <LandingFooter
        isEn={isEn}
        onOpenEditor={onOpenEditor}
      />
    </div>
  );
}
