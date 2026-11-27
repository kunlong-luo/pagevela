# Pagevela v2.8.5

**Release preparation / 待发布。** [Expected v2.8.5 release page / 预期发布地址](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.5) is not publication evidence; use the live Release and acceptance records to confirm availability.

**中文名称：页帆 v2.8.5。** This is the version PR's release preparation, not publication evidence. 正式发布、同 SHA CI/Pages、tag 与独立下载归档验收跟踪于 [Issue #349](https://github.com/kunlong-luo/pagevela/issues/349)；现有 v2.8.4 资产不修改。

## Highlights / 更新重点

- **Data integrity / 数据安全：** [#334](https://github.com/kunlong-luo/pagevela/pull/334) protects existing resume content during import and editor-mode changes; [#335](https://github.com/kunlong-luo/pagevela/pull/335) shows Saved only after the latest IndexedDB revision commits; [#336](https://github.com/kunlong-luo/pagevela/pull/336) and [#338](https://github.com/kunlong-luo/pagevela/pull/338) strengthen startup failure recovery. 防止静默覆盖、虚假保存成功与启动读取失败后的误操作。
- **Recovery / 故障恢复：** [#337](https://github.com/kunlong-luo/pagevela/pull/337) coordinates complete local reset and reports partial failures; [#344](https://github.com/kunlong-luo/pagevela/pull/344) adds a bilingual read-only emergency text backup when clipboard access fails. 清理仅限 Pagevela 数据；纯文本不是完整工作区备份。
- **Background save / 切后台保存：** [#339](https://github.com/kunlong-luo/pagevela/pull/339) starts queued writes when a tab becomes hidden, with pagehide fallback. 异步写入为尽力而为，不保证系统强杀后仍保存成功。
- **Quick PDF / 导出保护：** [#340](https://github.com/kunlong-luo/pagevela/pull/340) bounds raster memory and reuses a page canvas; [#341](https://github.com/kunlong-luo/pagevela/pull/341) and [#342](https://github.com/kunlong-luo/pagevela/pull/342) scan full pixel bands to protect trailing and page-gap content. 超出预算时提示使用保留文字的打印方式，不静默降清晰度。
- **Onboarding / 引导：** [#332](https://github.com/kunlong-luo/pagevela/pull/332) and [#343](https://github.com/kunlong-luo/pagevela/pull/343) strengthen startup recovery, replay and bilingual text regression coverage.
- **Delivery / 交付：** [#346](https://github.com/kunlong-luo/pagevela/pull/346) establishes AGENTS.md and repository-first handoff. Published archive verification checks SHA256, ZIP CRC, safe paths and ZIP/TAR file equality.

## Compatibility & acceptance / 兼容与验收

Existing IndexedDB, Web Lock, BroadcastChannel and encrypted-share identifiers stay compatible. No new dependencies, native UI or data protocol changes in the version PR. 工作区 JSON 仍为明文；旧标签页、系统强杀、低端 Android 内存峰值、真实打印/OEM/PWA、私有安全告警与严格独立交接盲测未全部验收。自动化通过不等于实机认证；工程评分保持 88/100。

Verified pre-release source baseline: `0f1abfa3529610fa051f5218268829340ad9a757` ([main CI #45813838172](https://github.com/kunlong-luo/pagevela/actions/runs/45813838172) / [Pages #45815666191](https://github.com/kunlong-luo/pagevela/actions/runs/45815666191), success). Expected new release assets: `pagevela-2.8.5.zip`, `pagevela-2.8.5.tar.gz`, `SHA256SUMS.txt`. Do not claim publication until the new version merge's own main CI, same-SHA Pages and GitHub Release complete; independently download and verify the published assets before closing [Issue #349](https://github.com/kunlong-luo/pagevela/issues/349).

[发布指南](./RELEASING.md) · [项目状态](./docs/PROJECT_STATUS.md) · [工程验收](./docs/ENGINEERING_ACCEPTANCE_20261124.md) · [评分](./docs/ASSESSMENT.md)

---

# Pagevela v2.8.4

**中文名称：页帆 v2.8.4。**  
**发布核验 / Release verification:** [v2.8.4 GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 于 2026-11-24 正式发布，annotated tag `ea2a65b`，[main CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722)、[同 SHA Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138)、[Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) 均成功。三个资产已存在；2026-11-25 已由 [Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) 实际下载并完成 SHA256、ZIP/TAR 内容 49 文件一致性验收，见[发布验收](./docs/V2_8_4_RELEASE_ACCEPTANCE_20261124.md)。

## Highlights / 更新重点

- **跨标签页数据防覆盖 / Cross-tab persistence safety：** [#323](https://github.com/kunlong-luo/pagevela/pull/323) 在同一 IndexedDB 事务中比较写入基线，阻止过时标签页把已提交的 Markdown/档案/JD 静默覆盖。冲突内容转为可以从“备份 → 草稿”找回的手动草稿；常驻双语安全提醒不遮挡操作。保留现有 Web Lock、IndexedDB 和加密分享兼容协议。
- **档案 ID 防碰撞 / Unique profile IDs：** [#325](https://github.com/kunlong-luo/pagevela/pull/325) 给新建/复制操作使用 UUID 或包含进程序列的回退 ID，防止同毫秒时间戳产生重复主键；**不重写任何旧 ID**、不改数据库 schema 或备份格式。
- **Auto Fit 与排版反馈 / Auto Fit & layout feedback：** [#316](https://github.com/kunlong-luo/pagevela/pull/316) 增加基于实际测量的 1/2/3 页目标，[#319](https://github.com/kunlong-luo/pagevela/pull/319) 提供一键恢复适配前排版，[#321](https://github.com/kunlong-luo/pagevela/pull/321) 增加纸张/语言/页数回归与准确的 `Estimated Fit` 提示。实际打印或 PDF 分页可能与预估不同。
- **编辑器/导出可靠性 / Editor & export stability：** [#310](https://github.com/kunlong-luo/pagevela/pull/310) 将安全提示与多标签页检测提取为 Hook，[#311](https://github.com/kunlong-luo/pagevela/pull/311) 防止反复 Auto Fit 反向扩大间距，[#314](https://github.com/kunlong-luo/pagevela/pull/314) 为 Quick PDF 空白/失败输出提供安全反馈，[#322](https://github.com/kunlong-luo/pagevela/pull/322) 抽离可单独测试的设置清洗函数。
- **工程、测试及文档 / Engineering and documentation：** [#317](https://github.com/kunlong-luo/pagevela/pull/317) 修复失败检查被 skipped 汇总任务绕过的 CI 风险，扩展 Chromium/Firefox/WebKit 回归；文档整理统一英文/中文 README、最新状态、88/100 七维度复评和按 SHA 的独立工程验收台账，并加入 `pnpm run docs:check`。

## Compatibility & privacy / 兼容及隐私边界

- 旧版 `resume-craft` IndexedDB/锁/BroadcastChannel 名称是**必须保留的数据协议标识**，不是当前公开品牌。旧版本工作区 JSON 与原加密分享格式的兼容性维持不变；不提供旧 `/resume-craft/` Pages 路径的跳转。
- JSON 工作区备份是**未加密**的；无需注册不等于端到端云同步。旧代码仍打开的标签页、未保存照片/完整 Profile 元信息冲突恢复及跨设备同步**尚未全部解决**。
- Android 微信真机总体通过的负责人确认不等于 Android 系统 Print/Save-as-PDF、全部 OEM 浏览器、安装 PWA 离线模式逐项验收；品牌商标和私有 GitHub 安全告警亦需另外核对。
- 正式 Release 预期附件：`pagevela-2.8.4.zip`、`pagevela-2.8.4.tar.gz`、`SHA256SUMS.txt`。**只有发布工作流真实成功、确认附件出现后才能宣称已交付**；独立下载、解压、重新计算 SHA256 需要单独记录。既有 v2.8.3 及更早 Release、tags 和资产不可覆盖。

**Changes since v2.8.3:** https://github.com/kunlong-luo/pagevela/compare/v2.8.3...v2.8.4

[发布指南](./RELEASING.md) · [v2.8.4 验收](./docs/V2_8_4_RELEASE_ACCEPTANCE_20261124.md) · [当前工程评分](./docs/ASSESSMENT.md) · [Android #262](https://github.com/kunlong-luo/pagevela/issues/262) · [数据安全 #282](https://github.com/kunlong-luo/pagevela/issues/282)

---

# Pagevela v2.8.3

**中文名称：** 页帆 v2.8.3

**Release verification (updated 2026-11-24):** [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3) was published on 2026-11-23 from `501ca26`. Its [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125), [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) and [Release run](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) succeeded. ZIP/TAR.GZ and `SHA256SUMS.txt` are present. This review did **not independently extract archives or verify downloaded SHA256 hashes**; those checks remain pending.

## Changes / 主要改进

- **Draft reliability / 草稿可靠性：** Serial IndexedDB writes, periodic history coordination and split-pane reliability with legacy storage, sharing and workspace backups preserved.
- **Editor architecture / 编辑器架构：** Dedicated tested hooks for split pane, periodic draft history and global keyboard shortcuts. Ctrl/Cmd+S continues to save locally, Ctrl/Cmd+P opens the ATS-friendly browser print flow, Ctrl/Cmd+Shift+F uses Auto Fit.
- **PDF and offline / 导出与离线：** Chromium PDF parse/geometry and post-export draft regression, production Workbox precache and offline editor navigation smoke tests.
- **Cross-browser quality / 跨浏览器：** Full Chromium, Firefox and WebKit CI with TypeScript, lint, i18n, tests and performance budget; exact-SHA Pages deployment required before Release.
- **Supply chain and documentation / 供应链与文档：** A report-only npm registry Security Inventory, 84/100 dated engineering review, bilingual documentation index and release-security evidence.

## Compatibility / 兼容与边界

- Existing IndexedDB database and cross-tab channel names are deliberate compatibility identifiers, not public brand text. Historical workspace backups and v2/v3 protected links remain readable; original v2.8.2 archives cannot be replaced.
- ATS browser print is text-preserving; raster Quick PDF is a different export method. Automated browser tests do not certify actual Android system Print/Save as PDF.
- Owner-reported Android WeChat real-device PASS remains separately recorded; other devices, installed PWA offline, private GitHub Dependabot alerts, trademark clearance and third-party posts have not been independently certified.
- No new account sync, irreversible data migration, native browser tooltip/dialog implementation or former-site redirect is introduced.

**Compare:** https://github.com/kunlong-luo/pagevela/compare/v2.8.2...v2.8.3

[Release checklist](./docs/V2_8_3_RELEASE_ACCEPTANCE_20261123.md) · [Project status](./docs/PROJECT_STATUS.md) · [Android #262](https://github.com/kunlong-luo/pagevela/issues/262) · [Supply chain #298](https://github.com/kunlong-luo/pagevela/issues/298)

---

# Pagevela v2.8.2

**中文名称：** 页帆 v2.8.2

**Release verification:** The [v2.8.2 GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2) must have a tag pointing to the tested production commit, branded ZIP/TAR.GZ and SHA256 checksums. Require a successful main-push CI and a successful Pages build and deployment on the same SHA. Draft documentation is not proof of publication.

## Unified identity / 品牌统一
- Public product, npm package metadata, current release packaging, promotion capture outputs, issue templates, internal editor action events and official-site support/analytics paths use **Pagevela**.
- New assets are named `pagevela-2.8.2.zip`, `pagevela-2.8.2.tar.gz` and `SHA256SUMS.txt`. Older published release packages are preserved, not silently replaced.
- New workspace exports use `pagevela-workspace-v1`. Existing portable workspace backups continue to import.
- New encrypted v3 share links use Pagevela authentication context. Existing password-protected v2/v3 links still decrypt using their original authenticated context.
- Current support-prompt preference keys use Pagevela branding while respecting prior prompt state.

## Compatibility / 兼容
- Historic IndexedDB identity, shared write lock and cross-tab identity remain deliberately stable so previously saved local resumes and existing sessions are not orphaned. These are **legacy data/protocol identifiers, not public brand names**.
- No remote account sync, irreversible storage migration, new Android native print implementation or third-party branding/trademark clearance is asserted.
- Android WeChat owner-reported PASS from v2.8.1 remains documented; no extra device matrix cases are newly certified. See [#262](https://github.com/kunlong-luo/pagevela/issues/262) and [#202](https://github.com/kunlong-luo/pagevela/issues/202).

**Compare:** https://github.com/kunlong-luo/pagevela/compare/v2.8.1...v2.8.2

---

# Pagevela v2.8.1

**中文名称：** 页帆 v2.8.1

**Release verification:** Refer to the [v2.8.1 GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.1) for the published tag and release artifacts; the website deployment must independently show a successful main-push CI followed by a same-SHA Pages build and deploy. This document alone is not deployment evidence.

## Reliability / 可靠性
- Downloaded Quick PDF is now opened by a genuine PDF parser during full Chromium E2E. Tests validate parseability, positive drawing-operator lists on all pages, valid page geometry and preservation of the existing fictional draft after reload.
- International market E2E fixtures no longer reseed default region settings on reload, so the US Letter persistence check tests actual saved state without weakened assertions.
- The existing separate ATS/print PDF E2E checks selectable Chinese/English text and A4 geometry. These automated checks are not substitutes for Android's native print/save dialog.
- The product owner reported successfully testing Pagevela on **real Android + WeChat** (2026-10-25); recorded as **owner-reported PASS**, not simulated or independently reproduced. Individual Android PDF/Downloads/PWA flows and Android Chrome, Samsung/OEM testing remain scoped in [#262](https://github.com/kunlong-luo/pagevela/issues/262). These are not presented as passing; because this patch does not modify those runtime paths, repeat hardware testing is not required for this patch.

## Pagevela identity / 品牌与兼容
- Records implemented Pagevela branding and canonical site, deliberately retired old-site redirect, retained legacy encrypted-share AAD, workspace backup and archive naming conventions.
- Current trademark/near-mark legal review is **not finished**. The product name's public use should not be presented as formal trademark clearance or exclusive rights; see [#202](https://github.com/kunlong-luo/pagevela/issues/202).
- Public GitHub Pages remains the only approved hosting origin. There was no Tencent EdgeOne/DNS switch, account service, external media publication, or real-resume upload.

## Downloads / 下载
The original v2.8.1 archives remain available under their historically published filenames with `SHA256SUMS.txt`. **Starting with v2.8.2**, newly built archives use the Pagevela naming convention. The v2.8.1 release display title is **Pagevela v2.8.1**.

**References:** [Device QA](./docs/V2_8_1_ANDROID_RELEASE_ACCEPTANCE.md) · [Migration audit](./docs/PAGEVELA_BRAND_MIGRATION_AUDIT_20261025.md) · [v2.8.1 target release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.1) · [Diff from v2.8.0](https://github.com/kunlong-luo/pagevela/compare/v2.8.0...v2.8.1)

---

# Pagevela v2.8.0

**中文名称：** 页帆 v2.8.0

**Release date:** 2026-10-24 · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.0) · [Live website](https://kunlong-luo.github.io/pagevela/) · [Announcement kit](./docs/V2_8_0_RELEASE_KIT.md)

## Highlights / 本次更新

- **Welcome / 欢迎页：** Show useful welcome content before heavier editor initialization. Add the consistently styled QR code button immediately left of Start, opening a branded modal for phone scanning.
- **Mobile editing / 移动端：** More reliable Form / Code / Preview controls, unified touch-friendly actions without duplicate Fit/Check entries, visible toolbar actions and menus above the bottom dock.
- **Preview and keyboard / 预览与键盘：** Ensure resume's bottom text and focused inputs remain clear of mobile action controls; improve 320–767px layout and tablet behavior.
- **Branded UI / 自定义组件：** Consistent English/Chinese labels, shared language switch near Theme, custom modals and menus, thin capsule scrollbars, automated bans on visible native popup/select widgets.
- **Export / 导出：** Stronger A4 multi-page print, PDF and profile-photo regression checks. Use ATS/browser-print for selectable PDF text; quick PDF can be rasterized.
- **Release safety / 发布安全：** Full Chromium and two Firefox/two WebKit shards, headed Firefox proof, and a strict final CI summary; Pages publishing is gated on success of the exact main-push CI commit.
- **Stable dependencies / 依赖：** React / React DOM 19.3.1, Motion 14.4, Lucide 1.59, ESLint 10.13, Vitest 5.0.5.

## Privacy, limits and migration / 隐私与迁移

Pagevela remains local-first; there is no account-based automatic browser/device sync. Full-workspace backups are **unencrypted** and should be handled privately. The old `/resume-craft/` URL is not redirected; [manual export/import](./docs/WORKSPACE_TRANSFER.md) is required to move data across devices or origins.

ATS checks are heuristic guidance, not guaranteed acceptance by any particular employer. Automated browser tests do **not** constitute physical Android handset verification. Existing media captures may be outdated; new screenshots and external media posts require a separate visual review.

## Assets / 发布文件

New v2.8.0 assets retain historical compatible archive filenames: `resume-craft-2.8.0.zip`, `resume-craft-2.8.0.tar.gz`, `SHA256SUMS.txt`. Older `resume-craft-*` release archives and internal storage identifiers are deliberately retained unchanged.

**Full compare:** https://github.com/kunlong-luo/pagevela/compare/v2.7.0...v2.8.0

---

# Pagevela v2.7.0

**Release date:** 2026-10-17 · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.7.0) · [Live demo](https://kunlong-luo.github.io/pagevela/) · [Product video](https://youtu.be/z3RNFD4s-kk)

## Highlights / 更新亮点

- **Brand / 品牌：** Complete public rename from Resume Craft to **Pagevela**; Chinese UI uses **页帆**. Official site and repository now use the `/pagevela/` path.
- **First-run flow / 快速开始：** A simpler welcome-to-editor flow, two-click entry, and no redundant tutorial when a template has already been selected.
- **Mobile PDF / 移动端导出：** Easier access to the primary ATS/browser-print PDF action on mobile.
- **Product imagery / 真实界面展示：** Automated English and Chinese captures of the welcome page and editor for honest product demonstrations.
- **Dependencies / 依赖：** Tested maintenance updates to production and development packages, including Vite, Playwright and Vitest.

## Compatibility and privacy / 兼容与隐私

- Resume content remains primarily **local to each browser origin**. The new Pages path does not automatically carry over drafts from the old `/resume-craft/` origin. Back up and verify imports before retiring any old browser data.
- Existing workspace JSON formats, application data keys, and historical release archives are preserved for compatibility; do not rename those internal identifiers just to match the new marketing name.
- Full workspace JSON exports are **not encrypted** and can include personally identifying résumé content, so handle them privately.
- The ATS/browser-print PDF route supports selectable text; the alternative quick-download PDF may be rasterized depending on the chosen mode.

Read [workspace transfer](./docs/WORKSPACE_TRANSFER.md), [promotion media](./docs/PROMOTION_MEDIA.md) and the [full changelog](./CHANGELOG.md).

---

# Resume Craft v2.6.0

> **Current project name (2026-10-16): Pagevela.** This is the archived October 14 release record under the former brand. For the current product visit [Pagevela](https://kunlong-luo.github.io/pagevela/) or [GitHub](https://github.com/kunlong-luo/pagevela). The retired `/resume-craft/` Pages path is not redirected. Existing v2.6.0 binaries, artifact filenames, version tags and checksums are unchanged.

**Published:** 2026-10-14 · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0) · [Live Demo](https://kunlong-luo.github.io/pagevela/)

## Highlights / 本次更新

- **Chinese-market portrait support / 国内简历证件照**: Optional local PNG, JPEG or WebP upload, 3:4 crop and JPEG downscaling. Displays the portrait in the top-right résumé header for supported Chinese-market layouts; international résumés remain photo-free by default.
- **Complete portable workspace / 完整工作区备份**: Export and restore all resume profiles, drafts and job-description text as a versioned `.json` file, including photos associated with their original profiles. Restores require explicit confirmation and replace destination workspace data.
- **Interrupted-save settings recovery / 刷新恢复**: Recover pending per-profile layout/market changes if a browser reload interrupts the IndexedDB autosave debounce. Recovery markers contain settings only, never resume text or portraits, and are cleared after matching successful writes.
- **Regression coverage**: Chromium, Firefox/WebKit critical flows, cross-origin workspace transfer, multi-profile portrait isolation, PDF download smoke tests and restore/cancel behavior.

## Important privacy and compatibility notes / 隐私与兼容说明

- **No account or cloud migration.** All résumé content remains local to the browser. Moving to another browser, device or hostname requires the **manual** workspace JSON export/import flow.
- The exported workspace file is **not encrypted** and can contain personal details, drafts, job descriptions and photos. Keep it private, and do not delete the original data until the import is verified.
- Existing single-resume JSON backups remain supported independently of the new full-workspace format. The stable internal workspace file version is `resume-craft-workspace-v1`.
- **At the time v2.6.0 was published (2026-10-14)** the public product still used the Resume Craft name and old Pages path. The product was **subsequently renamed to Pagevela**; the current website URL is above. Historical share protocol formats remain compatible, but an old URL pointing at `/resume-craft/` is not redirected.
- The **ATS PDF** print-to-PDF flow uses browser printing for selectable text. The **Quick PDF** direct-download option is rasterized; choose ATS PDF for online job systems.

Read the bilingual [workspace transfer guide](./docs/WORKSPACE_TRANSFER.md) before migrating between browser origins.

---

## Previous Releases

### Resume Craft v2.5.0

## Highlights

- **Independent Product Landing Page (欢迎页)**: Added an accessible, responsive, full-featured product landing page with bilingual support (中 / EN) and dark/light themes.
  - **Hero & Value Proposition**: Clearly showcases the Local-First philosophy (100% browser IndexedDB storage, zero server database, no sign-up, zero tracking).
  - **Interactive Workspace Showcase**: Live split-pane demo highlighting Markdown dual-way sync, modular structured form, Auto Fit single-page optimization, and ATS parsing rule audit.
  - **Six Feature Pillars**: Markdown AST synchronization, smart single-page auto fit, strict ATS checklist, crisp vector PDF export, multi-profile vault, and encrypted share links.
  - **Built-in Templates**: Direct 1-click loading of industry-standard templates (AI Backend, Campus New Grad, Product Operations, US Software Engineer).
- **Universal Dual-Route Architecture**:
  - Seamless navigation between the Landing Page (`/`, `?page=landing`, `#/landing`) and the Editor Workspace (`/editor`, `?page=editor`, `#/editor`).
  - Full browser history synchronization (`popstate`, `hashchange`, `history.pushState`) supporting smooth back/forward navigation and bookmarking.
  - Editor header provides direct return-to-home navigation via the RC brand mark and More Actions menu.
- **First-Time User Onboarding Guarantee**:
  - When entering the editor from the welcome page for the first time, automatically triggers the 3-step beginner tutorial tour.
  - Preserves first-visit state reliably; once completed or dismissed, returning users proceed directly to the workspace without interruptions.
- **Data Protection & Share Continuity**:
  - Existing user resume drafts, multi-profiles, and IndexedDB snapshots remain completely untouched and safe.
  - Direct encrypted share links (`getSharePayloadFromLocation`) continue to open `SharedResumePage` with priority.

## Language Behavior

- The top `中 / EN` control switches the application interface and landing page language.
- `Layout → Resume language` remains dedicated to standard resume content headings (`Summary`, `Skills`, `Work Experience`, etc.).

## Release Status

v2.5.0 is a feature release introducing the independent product landing page, dual-route navigation, and seamless first-visit onboarding activation.

Release: https://github.com/kunlong-luo/pagevela/releases/tag/v2.5.0

---

#### Earlier history

### Resume Craft v2.4.1

- Sanitized all built-in demo contact identities with explicit placeholders.
- Added regression test suite preventing accidental inclusion of realistic third-party contacts.
- Verified US contact line parsing without orphaned punctuation.
- Release: https://github.com/kunlong-luo/pagevela/releases/tag/v2.4.1
