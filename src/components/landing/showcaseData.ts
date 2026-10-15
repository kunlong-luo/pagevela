export interface ShowcaseResumeData {
  name: string;
  headline: string;
  contacts: string;
  summaryTitle: string;
  summaryItems: string[];
  experienceTitle: string;
  companyRoleDate: string;
  experienceItems: string[];
}

export const SHOWCASE_DATA: Record<'zh' | 'en', ShowcaseResumeData> = {
  zh: {
    name: '钟晨杰',
    headline: 'AI 后端开发工程师 ｜ 智能体网关架构 ｜ 分布式系统',
    contacts: '+86 100 0000 0000 · chenjie.zhong@example.com · 杭州 · 随时到岗',
    summaryTitle: '个人优势',
    summaryItems: [
      '7 年高并发 Java/Go 后端与大模型应用工程化实战经验。',
      '精通 Spring AI, Model Context Protocol (MCP) 与多智能体路由网关架构。'
    ],
    experienceTitle: '工作经历',
    companyRoleDate: '北京星河智联科技有限公司　资深 AI 架构师　2024.03 — 至今',
    experienceItems: [
      '主导新一代 AI 智能路由网关系统架构设计，支撑日均千万级调用。',
      '研发 MCP 工具调度中心，工具调用时延下降 40%，准确率 94%。',
      '采用 HNSW 多路召回优化向量检索，语义检索平均耗时低于 80ms。'
    ]
  },
  en: {
    name: 'Alex Morgan',
    headline: 'Senior Backend Engineer | API Architecture | Distributed Systems',
    contacts: 'alex.morgan@example.com · github.com/alex-demo · Remote / US',
    summaryTitle: 'Professional Summary',
    summaryItems: [
      '7+ years architecting scalable cloud backends and production AI integrations.',
      'Proficient in Spring AI, Model Context Protocol (MCP), and distributed messaging.'
    ],
    experienceTitle: 'Work Experience',
    companyRoleDate: 'Example Labs — Senior Backend Engineer — 2024–Present',
    experienceItems: [
      'Architected high-throughput AI gateway routing tens of millions of calls daily.',
      'Designed MCP orchestration pipeline, cutting tool latency by 40% with 94% accuracy.',
      'Optimized pgvector retrieval with HNSW indexing, keeping query latency under 80ms.'
    ]
  }
};

export interface FeatureItem {
  id: string;
  icon: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}

export const CORE_FEATURES: FeatureItem[] = [
  {
    id: 'sync',
    icon: 'FileText',
    titleZh: '表单填写与 Markdown 录入',
    titleEn: 'Form & Markdown Input',
    descZh: '可视化表单清晰易填，同时支持 Markdown 自由排版，改动即刻无损呈现。',
    descEn: 'Intuitive structured form fields alongside flexible Markdown editing.'
  },
  {
    id: 'autofit',
    icon: 'Minimize2',
    titleZh: 'Auto Fit 智能单页自适应',
    titleEn: 'Smart Auto Fit Single-Page',
    descZh: '微调行高、边距与字号，帮助减少简历内容溢页。',
    descEn: 'Adjust spacing and typography to help reduce page overflow.'
  },
  {
    id: 'ats',
    icon: 'FileCheck',
    titleZh: 'ATS 规范与格式体检',
    titleEn: 'ATS-Oriented Format Checks',
    descZh: '辅助检查常见格式、日期和联系方式问题，不保证通过特定 ATS。',
    descEn: 'Checks common formatting, dates, and contact details; not an ATS acceptance guarantee.'
  },
  {
    id: 'vector-pdf',
    icon: 'Download',
    titleZh: '真矢量无锯齿 PDF 导出',
    titleEn: 'Browser Print PDF with Selectable Text',
    descZh: '优先使用浏览器打印保存可选择文字的 PDF（取决于浏览器）；快速导出为图片型 PDF。',
    descEn: 'Use browser print / Save as PDF for selectable text when supported; quick PDF export is image-based.'
  },
  {
    id: 'archive',
    icon: 'Layers',
    titleZh: '多岗位独立档案管理',
    titleEn: 'Multi-Profile Archive Vault',
    descZh: '为技术岗、管理岗或外企全英岗位建立专属版本，一键切换互不干扰。',
    descEn: 'Manage tailored variations for distinct roles and switch instantly.'
  },
  {
    id: 'privacy',
    icon: 'Share2',
    titleZh: 'AES 加密分享与离线 PWA',
    titleEn: 'Encrypted Share & Offline PWA',
    descZh: '支持端到端密码加密分享；支持离线安装为独立桌面及移动 App。',
    descEn: 'Client-side AES encrypted share links and offline installable PWA support.'
  }
];

export interface PrivacyComparisonItem {
  zhTraditional: string;
  enTraditional: string;
  zhCraft: string;
  enCraft: string;
}

export const PRIVACY_COMPARISONS: PrivacyComparisonItem[] = [
  {
    zhTraditional: '强制注册账号，个人简历保存在第三方云端服务器',
    enTraditional: 'Some services require an account or store drafts on remote servers',
    zhCraft: '无需注册，简历全量安全保存在您的本地设备中',
    enCraft: 'No account needed; resume drafts are stored in this browser'
  },
  {
    zhTraditional: '部分功能收费，免费导出通常附带平台水印或画质压缩',
    enTraditional: 'Some services charge for exports or apply watermarks',
    zhCraft: '100% 免费开源（MIT），永久无水印，支持完整 JSON 备份',
    enCraft: 'Free and open source (MIT), watermark-free exports and JSON backup'
  },
  {
    zhTraditional: '数据存在泄露、转售或被抓取用于 AI 训练的模型风险',
    enTraditional: 'Cloud-hosted drafts require trusting a third-party data provider',
    zhCraft: '主要使用浏览器本地存储；可选择公开或密码加密分享链接',
    enCraft: 'Browser-first storage; optional password-protected share links are encrypted locally'
  }
];

export interface FaqItem {
  qZh: string;
  qEn: string;
  aZh: string;
  aEn: string;
}

export const FAQS: FaqItem[] = [
  {
    qZh: 'Pagevela 真的完全免费且没有水印吗？',
    qEn: 'Is Pagevela genuinely free with no watermarks?',
    aZh: '是的，Pagevela 基于 MIT 协议开源，两种 PDF 导出方式均免费且无水印；浏览器打印通常可保留可选择文字，快速导出为图片型 PDF。',
    aEn: 'Yes. Both PDF export paths are free and watermark-free. Browser print can preserve selectable text; the quick export is image-based.'
  },
  {
    qZh: '刷新或关闭浏览器后，已编写的简历会丢失吗？',
    qEn: 'Will my resume be preserved after refreshing or closing the browser?',
    aZh: '所有修改会自动实时保存在您的本机设备上。为防浏览器缓存被意外清理，建议在关键节点使用顶部“备份”导出 JSON 格式文件。',
    aEn: 'Edits are normally saved in this browser. Clearing browser data can remove them, so export a JSON backup for important work.'
  },
  {
    qZh: 'ATS 规范体检如何辅助提升简历通过率？',
    qEn: 'How does the ATS rule check improve resume pass rates?',
    aZh: '辅助检查常见格式问题、日期、联系方式和标题结构，但不能保证特定 ATS 的解析或筛选结果。',
    aEn: 'It flags common formatting, date, contact, and heading issues. This does not guarantee outcomes with any particular ATS.'
  },
  {
    qZh: '支持在手机或平板设备上使用吗？',
    qEn: 'Can I use Pagevela on mobile devices or tablets?',
    aZh: '完全支持。具备响应式适配与双指手势支持，同时支持作为 PWA 安装至 iOS/Android 桌面，断网也可随时离线编写。',
    aEn: 'Yes. Fully responsive with mobile gesture switching, plus PWA installation support for offline drafting anywhere.'
  }
];
