import React, { useEffect, useState } from 'react';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Download,
  CheckCircle2,
  Lock,
  Zap,
  Globe2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Moon,
  Sun,
  Layout,
  Layers,
  FileCheck,
  Share2,
  Check,
  Cpu,
  GraduationCap,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES } from '../../data';
import { ThemeMode } from '../../types';
import { getTemplatePresentation } from '../../lib/template-presentation';
import { storage, STORAGE_KEYS } from '../../lib/storage';
import { useConfirm } from '../../context/ConfirmContext';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

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

  const [interactiveTab, setInteractiveTab] = useState<'markdown' | 'form' | 'autofit' | 'ats'>('markdown');

  const toggleLanguage = () => {
    setUiLanguage(uiLanguage === 'zh' ? 'en' : 'zh');
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  // Check if there is already customized resume content saved
  // Starter Markdown and lastSaved exist even on a fresh first visit.
  const hasExistingResume = storage.getString(STORAGE_KEYS.ONBOARDING_COMPLETE) === '1' && Boolean(markdown.trim());

  const templatesToShow = TEMPLATES.filter((template) => template.suggestedLang === uiLanguage).slice(0, 4);

  const handleSelectTemplate = async (templateId: string) => {
    if (hasExistingResume) {
      const approved = await confirm({
        title: isEn ? 'Replace the current resume?' : '替换当前简历？',
        message: isEn
          ? 'Using this template replaces the content of your active resume. Export a backup first if you want to keep your current draft.'
          : '使用此模板会替换当前简历内容。如需保留现有草稿，请先导出备份。',
        confirmText: isEn ? 'Replace and continue' : '确认替换并继续',
        cancelText: isEn ? 'Cancel' : '取消',
        type: 'warning',
      });
      if (!approved) return;
    }
    if (onSelectTemplate) onSelectTemplate(templateId);
    else onOpenEditor();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-[#070a13]/85 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
              RC
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {isEn ? 'Resume Craft' : '简匠 Resume Craft'}
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  v2.5
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isEn ? 'Local-First Markdown Resume Builder' : '本地优先 · Markdown 简历构建工具'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isEn ? 'Features' : '核心功能'}
            </a>
            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isEn ? 'Interactive Demo' : '界面预览'}
            </a>
            <a href="#templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isEn ? 'Templates' : '精选模板'}
            </a>
            <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isEn ? 'Privacy & Security' : '隐私说明'}
            </a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isEn ? 'FAQ' : '常见问题'}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
            >
              <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isEn ? '中文' : 'EN'}</span>
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* GitHub Repo */}
            <a
              href="https://github.com/kunlong-luo/resume-craft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            {/* Enter Editor CTA */}
            <button
              type="button"
              onClick={onOpenEditor}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>{isEn ? 'Open Editor' : '进入编辑器'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>
              {isEn
                ? 'Local-First · Zero Cloud Database · No Sign-Up Required'
                : '纯净本地优先 · 零服务器数据库 · 无需注册开箱即用'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            {isEn ? (
              <>
                Craft ATS-Optimized Resumes with <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">Markdown Simplicity</span>.
              </>
            ) : (
              <>
                打造专业求职简历，从未如此
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">纯粹高效</span>。
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'Switch between Markdown and forms, preview every change, adjust layout with Auto Fit, check common resume rules, and export PDFs. Resume drafts are stored in your browser.'
              : 'Markdown 与表单双向编辑，实时预览、Auto Fit、ATS 规则辅助检查与 PDF 导出。简历主要保存在浏览器本地，分享链接由用户主动生成。'}
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onOpenEditor}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isEn ? 'Start Building Your Resume' : '立即开始制作简历 (免费)'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {hasExistingResume && (
              <button
                type="button"
                onClick={onOpenEditor}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  {isEn
                    ? 'Resume where you left off'
                    : `继续编辑现有简历 ${lastSaved ? `(保存于 ${lastSaved})` : ''}`}
                </span>
              </button>
            )}

            <a
              href="#templates"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all flex items-center justify-center gap-2"
            >
              <Layout className="w-4 h-4 text-indigo-500" />
              <span>{isEn ? 'Browse Templates' : '浏览内置模板'}</span>
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {isEn ? 'Browser-local resume storage (IndexedDB)' : '简历正文主要保存在 IndexedDB'}
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500" />
              {isEn ? 'No account required · Privacy-conscious analytics' : '无需注册 · 仅收集匿名汇总使用数据'}
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-500" />
              {isEn ? 'Standard A4 & US Letter Layout' : '严谨 A4 / US Letter 单页排版'}
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-blue-500" />
              {isEn ? 'Selectable Vector Text PDF' : '文字可复制矢量 PDF 导出'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product Showcase (真实产品体验与展示) */}
      <section id="showcase" className="py-12 sm:py-16 bg-white/50 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Designed for High-Impact Job Applications' : '精心打造的专业简历工作台'}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {isEn
                ? 'See what makes Resume Craft lightning-fast and trustworthy. Seamless split workspace with real-time feedback.'
                : '左右分栏所见即所得，支持纯 Markdown 快速录入或可视化表单微调，实时诊断排版与 ATS 评分。'}
            </p>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Illustrative preview using fictional resume data — try the editor for actual results.' : '以下为虚构简历的示意预览，实际操作与结果请进入编辑器体验。'}
            </p>

            {/* Feature tab selector for the interactive frame */}
            <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700 max-w-full overflow-x-auto">
              <button
                type="button"
                aria-pressed={interactiveTab === 'markdown'}
                onClick={() => setInteractiveTab('markdown')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  interactiveTab === 'markdown'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isEn ? 'Markdown Sync' : 'Markdown 双向流转'}
              </button>
              <button
                type="button"
                aria-pressed={interactiveTab === 'form'}
                onClick={() => setInteractiveTab('form')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  interactiveTab === 'form'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isEn ? 'Structured Form' : '模块化表单填写'}
              </button>
              <button
                type="button"
                aria-pressed={interactiveTab === 'autofit'}
                onClick={() => setInteractiveTab('autofit')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  interactiveTab === 'autofit'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isEn ? 'Auto Fit Pagination' : 'Auto Fit 智能单页'}
              </button>
              <button
                type="button"
                aria-pressed={interactiveTab === 'ats'}
                onClick={() => setInteractiveTab('ats')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  interactiveTab === 'ats'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isEn ? 'ATS Rule Audit' : 'ATS 规范体检'}
              </button>
            </div>
          </div>

          {/* Illustrative mock workspace: fictional sample content, not a real product screenshot */}
          <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
            {/* Top Window Bar */}
            <div className="h-10 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  resume-craft / workspace / {interactiveTab}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/50 dark:border-emerald-800/50">
                  {isEn ? '● Auto-saved to IndexedDB' : '● 已自动保存至浏览器本地'}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  A4 · 1 Page
                </span>
              </div>
            </div>

            {/* Split Screen Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 min-h-[420px]">
              {/* Left Pane: Editor */}
              <div className="p-5 font-mono text-xs bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between overflow-hidden">
                {interactiveTab === 'markdown' && (
                  <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed overflow-hidden">
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold"># 钟晨杰</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">AI后端开发工程师 ｜ 智能体网关架构 ｜ 分布式系统</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">+86 100 0000 0000 · chenjie.zhong@example.com · GitHub: chenjie-ai</p>
                    <div className="pt-2 text-indigo-600 dark:text-indigo-400 font-bold">## 个人优势</div>
                    <p>- 7年高并发 Java/Go 后端开发与 AI 大模型应用工程化实战经验。</p>
                    <p>- 深度掌握大模型工程化体系，精通 Spring AI, Model Context Protocol (MCP)。</p>
                    <div className="pt-2 text-indigo-600 dark:text-indigo-400 font-bold">## 工作经历</div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold">### 北京星河智联科技有限公司　资深AI架构师　*2024.03 — 至今*</p>
                    <p>- 主导新一代 AI 智能路由网关系统的架构设计，支撑日均千万级调用。</p>
                    <p>- 采用 HNSW 多路召回，语义检索平均耗时低于 80ms。</p>
                  </div>
                )}

                {interactiveTab === 'form' && (
                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">基本信息 (Basic Info)</span>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">钟晨杰</div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">AI后端开发工程师</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">工作经历 (Work Experience)</span>
                        <span className="text-[10px] text-emerald-600 font-bold">STAR 法则模板可用</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                        北京星河智联 · 资深AI架构师 · 2024.03 - 至今
                      </div>
                    </div>
                  </div>
                )}

                {interactiveTab === 'autofit' && (
                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Auto Fit 智能单页排版计算中</span>
                      </div>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                        检测到原有内容溢出第 1 页共 4 行。已自动微调段落间距（-1.5px）、行高（1.45）与字体比例，完美锁定单页。
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px]">优化前页面高度</span>
                        <span className="font-bold text-rose-500">108% (超出一页)</span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Auto Fit 优化后</span>
                        <span className="font-bold text-emerald-500">99.2% (黄金单页)</span>
                      </div>
                    </div>
                  </div>
                )}

                {interactiveTab === 'ats' && (
                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ATS 机器解析评分: 98 / 100
                        </span>
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">优秀</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                        未包含非标准特殊字符或图形表格；时间段格式符合标准规范；标题层级清晰。
                      </p>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>联系方式 (电话、邮箱、GitHub) 解析正常</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>多段经历时间范围均包含有效年月</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>高频技术关键字（Java, Spring AI, MCP）清晰突出</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <span>{isEn ? 'Two-way synchronized' : '双向同步 · 实时渲染'}</span>
                  <button
                    type="button"
                    onClick={onOpenEditor}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isEn ? 'Open in full editor' : '在完整编辑器中体验'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right Pane: A4 Preview Mockup */}
              <div className="p-6 bg-slate-200/50 dark:bg-slate-900/90 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-[340px] bg-white text-slate-900 rounded-sm shadow-xl p-5 text-[10px] leading-snug border border-slate-300/80">
                  {/* Resume Header */}
                  <div className="border-b border-indigo-600 pb-2 mb-2.5">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">钟晨杰</h3>
                    <p className="text-[11px] font-bold text-indigo-600 mt-0.5">AI后端开发工程师 ｜ 智能体网关架构</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      +86 100 0000 0000 · chenjie.zhong@example.com · 杭州 · 随时到岗
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="mb-2.5">
                    <h4 className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-xs inline-block" />
                      个人优势
                    </h4>
                    <p className="text-[9px] text-slate-700 leading-normal">
                      7年高并发后端与 AI 大模型应用工程化实战经验。精通 Spring AI, MCP 协议与多智能体路由网关架构搭建。
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-2">
                    <h4 className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-xs inline-block" />
                      工作经历
                    </h4>
                    <div className="flex justify-between items-baseline font-bold text-[9.5px]">
                      <span>北京星河智联科技有限公司</span>
                      <span className="text-[8.5px] text-slate-500">2024.03 - 至今</span>
                    </div>
                    <div className="text-[9px] text-indigo-600 font-semibold mb-1">资深 AI 架构师</div>
                    <ul className="list-disc list-inside text-[8.5px] text-slate-700 space-y-0.5">
                      <li>主导新一代 AI 智能路由网关系统架构设计，承载日均千万级调用。</li>
                      <li>研发 MCP 工具调度中心，工具调用时延下降 40%，准确率 94%。</li>
                      <li>优化 pgvector 向量检索系统，召回耗时低于 80ms。</li>
                    </ul>
                  </div>

                  {/* Badges / Export proof */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400">
                    <span>A4 Standard (210 × 297 mm)</span>
                    <span className="text-emerald-600 font-bold">ATS Checks Available · Example</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {isEn ? 'Engineered for Perfection' : '专为求职者量身打造'}
            </span>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Six Pillars of Resume Craft' : '六大核心特色，让简历告别平庸'}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {isEn
                ? 'Every tool is built around one clear goal: helping you land more interviews with less friction.'
                : '每一个功能都经过反复打磨，消除繁琐排版阻碍，专注呈现最高价值的求职内容。'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {isEn ? 'Markdown + Form Dual Mode' : 'Markdown 与结构化表单双向同步'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Write naturally with Markdown syntax or tweak precise fields with structured forms. Changes reflect instantaneously without loss of format.'
                  : '技术人员可尽情使用 Markdown 极速敲出经历；初学者也可用直观表单拖拽排序。双向即时无损同步。'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {isEn ? 'Smart Auto Fit Single-Page' : 'Auto Fit 智能单页自适应'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Eliminate the frustrating "two lines spilled onto page 2". Our algorithm dynamically adjusts margins, line-height, and padding to lock into a single page.'
                  : '告别“多出两三行挤到第二页”的排版噩梦。一键智能计算字号、段落间距与边距微调，牢牢锁定黄金单页。'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {isEn ? 'Strict ATS Parsing Verification' : 'ATS 格式与规范辅助检查'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Reviews structure, dates, contact details, and common formatting issues. This is guidance, not a guarantee of compatibility or success with a particular ATS.'
                  : '内置求职系统规则检测，自动排查非法字符、缺失日期与不规范标题，支持针对国内及海外欧美市场的隐私无头像合规。'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {isEn ? 'Pixel-Perfect Vector PDF' : '真矢量无锯齿 PDF 导出'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Exports high-fidelity PDFs with selectable, searchable text, intact hyperlinks, and standard A4 or US Letter dimensions. Zero pixelation.'
                  : '导出文字原生可选、可搜索的矢量 PDF，杜绝低质截图式位图渲染，保留超链接，HR 放大十倍依旧锋利清晰。'}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {isEn ? 'Multi-Profile Archive Vault' : '多版本档案库独立隔离'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Create targeted resume variations for different job positions (e.g. Frontend vs Full-Stack vs Management). Switch instantly in one click.'
                  : '求职投递不可千篇一律。为不同公司、不同技术侧重（如前端、后端架构、外企全英文）创建专属档案，一秒切换互不干扰。'}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {isEn ? 'Encrypted Share & Offline PWA' : '端到端加密分享与离线 PWA'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Create optional public or password-protected share links. Password-protected links encrypt content locally; public links are readable by recipients. Offline PWA use is supported after installation.'
                  : '支持 AES-GCM 密码加密分享链接，只有知晓密码者可解密查看。支持离线作为桌面或手机 App 安装，断网亦可安心写简历。'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Privacy & Security Section */}
      <section id="privacy" className="py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Your Resume Data Belongs Exclusively to You' : '本地优先：简历由你管理'}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {isEn
                ? 'Resume content is stored in your browser. No account is needed; privacy-conscious aggregate usage analytics help us improve the app. Sharing a link is optional.'
                : '简历正文保存在当前浏览器，无需注册。我们使用尊重隐私的汇总使用统计；仅在您主动生成分享链接时才会分享内容。'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conventional Cloud Builders */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">
                {isEn ? 'Traditional Online Resume Builders' : '常见商业在线简历平台'}
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>强制手机号/微信注册登录，索取过多无关权限</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>简历信息上传至中心化服务器，存在数据泄露与被售卖风险</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>导出加水印、按月扣费或锁死下载格式</span>
                </li>
              </ul>
            </div>

            {/* Resume Craft */}
            <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                {isEn ? 'Resume Craft (Local-First Architecture)' : 'Resume Craft 简匠原则'}
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>零注册免登录</strong>：即开即用，关闭页面自动保存在浏览器 IndexedDB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>零服务器数据库</strong>：无任何中心化个人数据存储，代码完全开源可审计</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>永久免费开源</strong>：无导出限制，无水印，自由导出 JSON 备份</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Built-in Templates Showcase */}
      <section id="templates" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {isEn ? 'Industry Proven Styles' : '精选开箱即用模板'}
            </span>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Start with Real-World Industry Samples' : '来自一线大厂与跨国名企的成熟排版'}
            </h2>
            <p className="mt-2.5 text-slate-600 dark:text-slate-400 text-sm">
              {isEn
                ? 'Select any template to immediately load it into your editor and customize with your own story.'
                : '涵盖国内校招、社招技术骨干、运营增长及欧美外企标准简历，点击即可直接载入编辑。'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {templatesToShow.map((tmpl) => {
              const isTech = tmpl.id.includes('swe') || tmpl.id === 'backend' || tmpl.id === 'custom';
              const isCampus = tmpl.id === 'campus' || tmpl.id === 'us_new_grad';
              const Icon = isCampus ? GraduationCap : isTech ? Cpu : tmpl.id === 'operations' ? TrendingUp : Briefcase;
              const presentation = getTemplatePresentation(tmpl, uiLanguage);

              return (
                <div
                  key={tmpl.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-xs group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {presentation.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 mb-2 line-clamp-1">
                      {presentation.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {presentation.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tmpl.defaultPaperSize === 'letter' ? 'US Letter' : 'A4'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { void handleSelectTemplate(tmpl.id); }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isEn ? 'Use Template' : '使用该模板'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 bg-white/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Frequently Asked Questions' : '常见问题解答'}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
              {isEn ? 'Everything you need to know about using Resume Craft.' : '快速了解数据安全、格式兼容与导出细节。'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                {isEn ? 'Is Resume Craft really free and without watermark?' : 'Resume Craft 真的完全免费且没有水印吗？'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Yes, 100% free and open-source under the MIT license. You can export as many clean, watermark-free PDFs as you want without paying a dime.'
                  : '是的。Resume Craft 是一款在 GitHub 开源的完全免费工具（遵循 MIT 开源协议）。导出的 PDF 绝无任何水印、没有任何广告植入或隐藏付费项目。'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                {isEn ? 'Will my resume be lost if I refresh or close my browser?' : '刷新或关闭浏览器后，写好的简历会丢失吗？'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Edits are normally saved to IndexedDB in this browser, while lightweight preferences use localStorage. Browser data can be cleared, so export a JSON backup for important work.'
                  : '通常会自动保存至当前浏览器的 IndexedDB，但浏览器数据可能被清理。重要简历建议额外导出 JSON 备份。'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                {isEn ? 'How does the ATS rule check work?' : 'ATS 自检功能是如何帮助我提高简历通过率的？'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'It scans for common formatting pitfalls that break corporate applicant parsing: invalid date notations, inconsistent headers, missing contact info, and overseas privacy risks (e.g. photos on US resumes).'
                  : '基于常见简历规范检查时间范围、联系方式、标题层级与市场适配提示，但不保证任何特定 ATS 系统的解析或筛选结果。'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                {isEn ? 'Can I use it on mobile or tablet devices?' : '支持手机或平板移动端使用吗？'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Yes. Resume Craft is responsive and works as an installable PWA on iOS, Android, macOS, and Windows. You can edit and preview smoothly on mobile devices.'
                  : '完全支持。移动端配备专属快捷操作底栏与手势切换，并支持 PWA 一键安装至手机桌面，随时随地审阅与修改简历。'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            {isEn ? 'Ready to Build Your Winning Resume?' : '开启你的全新求职里程'}
          </h2>
          <p className="text-sm sm:text-base text-indigo-200/90 max-w-xl mx-auto mb-8">
            {isEn
              ? 'Create and export a clear, professional resume with flexible Markdown and form editing.'
              : '无需注册，直接进入编辑器，使用 Markdown 或表单打造清晰、专业的简历。'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenEditor}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-indigo-950 hover:bg-slate-100 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>{isEn ? 'Open Resume Craft Editor' : '立即进入简历编辑器'}</span>
              <ArrowRight className="w-4 h-4 ml-1 text-indigo-600" />
            </button>
            <a
              href="https://github.com/kunlong-luo/resume-craft"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-4 h-4" />
              <span>{isEn ? 'Star on GitHub' : '在 GitHub 给我们一颗 Star'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg text-white flex items-center justify-center font-black text-[10px]">
              RC
            </div>
            <span className="font-bold text-slate-200">Resume Craft 简匠</span>
            <span>· MIT License · Open Source</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button
              type="button"
              onClick={onOpenEditor}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isEn ? 'Editor' : '简历编辑器'}
            </button>
            <a
              href="https://github.com/kunlong-luo/resume-craft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/kunlong-luo/resume-craft/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {isEn ? 'Issues & Feedback' : '反馈建议'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
