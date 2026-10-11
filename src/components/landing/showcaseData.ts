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
    descZh: '告别多出几行溢出到下一页的尴尬，一键微调间距字号，锁死黄金单页。',
    descEn: 'Eliminate awkward multi-page spillovers by dynamically locking content to one page.'
  },
  {
    id: 'ats',
    icon: 'FileCheck',
    titleZh: 'ATS 规范与格式体检',
    titleEn: 'Strict ATS Rule Audit',
    descZh: '精准排查特殊符号、时间断层与层级缺陷，规避求职机选解析风险。',
    descEn: 'Scans for formatting pitfalls, broken date formats, and overseas privacy risks.'
  },
  {
    id: 'vector-pdf',
    icon: 'Download',
    titleZh: '真矢量无锯齿 PDF 导出',
    titleEn: 'Selectable Vector Text PDF',
    descZh: '原生浏览器打印引擎输出，文字可划选复制，无任何平台水印。',
    descEn: 'Crystal-clear vector PDF export with selectable text and zero watermarks.'
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
    enTraditional: 'Requires user accounts and stores personal data on third-party servers',
    zhCraft: '无需注册，简历全量安全保存在您的本地设备中',
    enCraft: 'No account needed; resume drafts are kept safely on your local device'
  },
  {
    zhTraditional: '部分功能收费，免费导出通常附带平台水印或画质压缩',
    enTraditional: 'Freemium model with watermarked exports or paid download paywalls',
    zhCraft: '100% 免费开源（MIT），永久无水印，支持完整 JSON 备份',
    enCraft: '100% free & open-source (MIT), zero watermarks, lossless JSON backup'
  },
  {
    zhTraditional: '数据存在泄露、转售或被抓取用于 AI 训练的模型风险',
    enTraditional: 'Data is subject to cloud breaches, vendor lock-in, and training scraping',
    zhCraft: '纯前端运行，无中心化数据库，仅在用户主动分享时生成端到端密文',
    enCraft: 'Client-side execution, zero central resume DB, end-to-end encryption on share'
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
    qZh: 'Resume Craft 真的完全免费且没有水印吗？',
    qEn: 'Is Resume Craft genuinely free with no watermarks?',
    aZh: '是的。Resume Craft 基于 MIT 协议开源，所有排版和矢量 PDF 导出功能全量免费开放，绝无任何隐藏付费或平台水印。',
    aEn: 'Yes. Resume Craft is open-source under the MIT license. All layout engines and vector PDF exports are free with zero watermarks.'
  },
  {
    qZh: '刷新或关闭浏览器后，已编写的简历会丢失吗？',
    qEn: 'Will my resume be preserved after refreshing or closing the browser?',
    aZh: '所有修改会自动实时保存在您的本机设备上。为防浏览器缓存被意外清理，建议在关键节点使用顶部“备份”导出 JSON 格式文件。',
    aEn: 'All edits are auto-saved directly on your device. We also provide one-click JSON backup/export for extra safety.'
  },
  {
    qZh: 'ATS 规范体检如何辅助提升简历通过率？',
    qEn: 'How does the ATS rule check improve resume pass rates?',
    aZh: '它对标主流招聘系统的解析规则，主动识别非法特殊字符、格式不规范的起止日期、标题层级及欧美投递的无头像隐私规范。',
    aEn: 'It validates against common ATS parser constraints: date standard formats, heading hierarchies, contact syntax, and privacy rules.'
  },
  {
    qZh: '支持在手机或平板设备上使用吗？',
    qEn: 'Can I use Resume Craft on mobile devices or tablets?',
    aZh: '完全支持。具备响应式适配与双指手势支持，同时支持作为 PWA 安装至 iOS/Android 桌面，断网也可随时离线编写。',
    aEn: 'Yes. Fully responsive with mobile gesture switching, plus PWA installation support for offline drafting anywhere.'
  }
];
