# Pagevela 文档索引 / Documentation index

> 这是 **文档导航页**，不是自动更新的 CI 面板。访问最新状态前请对照 [带日期的状态快照](./PROJECT_STATUS.md) 与 [GitHub Actions](https://github.com/kunlong-luo/pagevela/actions)。本文按用途区分现行说明与历史资料，避免把 10 月发布验收误当成今天的结果。
>
> This is the navigation entry for current guides and historical release records. Published assets, the main branch and deployed Pages may refer to different commits.

## 从这里开始 / Start here

| 需求 | 推荐入口 | 用途 |
| --- | --- | --- |
| 了解产品、功能、启动项目 | [English README](../README.md) · [中文 README](../README.zh-CN.md) | 产品概述、安装、主要功能 |
| 当前仓库与部署状态 | [PROJECT_STATUS.md](./PROJECT_STATUS.md) | 日期、提交 SHA、CI / Pages、开放事项 |
| 编辑器 Hook 2026-11-24 验收 | [PR #315](https://github.com/kunlong-luo/pagevela/pull/315) · [编辑器安全通知说明](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md) | 记录 #310 同 SHA CI/Pages；验收台账合并前以 PR 为准 |
| 最新发布与安全验收证据 | [RELEASE_SECURITY_ACCEPTANCE_20261123.md](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) | PR #300–308、同 SHA CI / Pages / Release、PWA、安全审计及未结门禁 |
| 项目评估和优先级 | [ASSESSMENT_20261123.md](./ASSESSMENT_20261123.md) · [11/22 历史 76 分](./ASSESSMENT_20261122.md) | 84/100 新复评、逐项证据、评分变化和未结风险 |
| 新人贡献和开发 | [CONTRIBUTING.md](../CONTRIBUTING.md) · [UI 组件规范](./BRANDED_UI_CONTRACT.md) | TypeScript、测试、PR 与设计系统 |
| 正式发布 | [RELEASING.md](../RELEASING.md) · [CHANGELOG.md](../CHANGELOG.md) · [RELEASE_NOTES.md](../RELEASE_NOTES.md) | 版本、历史变更、当前发布门禁 |
| v2.8.3 实际发布验收 | [V2_8_3_RELEASE_ACCEPTANCE_20261123.md](./V2_8_3_RELEASE_ACCEPTANCE_20261123.md) | 已发布 tag、同 SHA 交付证据、ZIP/TAR/SHA256SUMS 清单及独立校验未结项 |
| 依赖安全审计 | [SECURITY.md](../SECURITY.md) · [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml) · [#298](https://github.com/kunlong-luo/pagevela/issues/298) | 每周 npm 注册表审计、GHSA 证据与尚未核对的 GitHub 私有告警 |
| 数据导出和跨浏览器迁移 | [WORKSPACE_TRANSFER.md](./WORKSPACE_TRANSFER.md) | 本地备份、导入、隐私风险 |

## 架构与工程 / Engineering

- [持久化架构及历史协议兼容](./PERSISTENCE_ARCHITECTURE_20261026.md)：Zustand / IndexedDB / Web Locks / 草稿和并发，包含分栏 Hook 拆分的历史记录
- [v2.3 存储设计](./V2_3_STORAGE.md)、[v2.2 性能基线](./V2_2_PERFORMANCE.md)、[v2.1 UX/隐私](./V2_1_UX_PRIVACY.md)：**对应版本的技术设计**，不应被当作最新测试结论
- [产品分析与隐私边界](./PRODUCT_ANALYTICS.md)；[品牌 UI 组件契约](./BRANDED_UI_CONTRACT.md)：现行工程规范
- [架构路线图 #282](https://github.com/kunlong-luo/pagevela/issues/282)：编辑器拆分、存储安全、性能与 CI 回归
- [Quick PDF 空白输出与错误反馈防护（2026-11-24）](./PDF_EXPORT_FAILURE_SAFETY_20261124.md)：画布/上下文/零有效页保护、品牌化失败提示、CI 与真机验收边界
- [功能优化路线图（#311）](https://github.com/kunlong-luo/pagevela/pull/311)：Auto Fit、PDF、数据安全、移动端和性能优化优先级及未结门禁
- [编辑器安全通知 Hook 拆分（2026-11-24）](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md)：多标签页存在检测、存储错误/恢复通知的行为契约、单元测试和未发布门禁
- [编辑器快捷键 Hook 边界（2026-11-23）](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)：保存/打印/Auto Fit 的兼容契约与自动化回归

## 发布、品牌与宣传 / Release and brand

**仍用于后续发布的操作说明：** [RELEASING.md](../RELEASING.md)、[PROMOTION.md](../PROMOTION.md)、[PROMOTION_MEDIA.md](./PROMOTION_MEDIA.md)、[PUBLICATION_UPDATE_CHECKLIST.md](./PUBLICATION_UPDATE_CHECKLIST.md)。

**第三方平台推广包：** [channel-refresh/README.md](./channel-refresh/README.md)，包含平台逐项文案、事实边界、素材清单、`TRACKER.csv` 和中外平台文件。这里是**准备与人工跟踪资料**，仓库中的文案修改不等于第三方平台已经同步。

**品牌未结事项：** [#202](https://github.com/kunlong-luo/pagevela/issues/202) 商标与站外内容、[#262](https://github.com/kunlong-luo/pagevela/issues/262) Android 真实设备矩阵。

## 历史参考 / Historical — not current acceptance

- [2026-11-22 状态快照原件](./history/PROJECT_STATUS_20261122.md)：仅供追溯该日期的旧 CI 故障和发布判断，不再当作当前状态

下列文档按发布时的事实保留，**不删除旧记录、不重命名历史下载附件、不重新诠释旧的验收结论**：

- [v2.8.1 Android 发布验收](./V2_8_1_ANDROID_RELEASE_ACCEPTANCE.md)、[v2.8.0 中英发布包](./V2_8_0_RELEASE_KIT.md)、[v2.6.0 交付检查表](./RELEASE_V2_6_0_CHECKLIST.md)、[v2.6.0 社交发布包](./V2_6_0_SOCIAL_LAUNCH_KIT.md)
- [品牌迁移审计](./PAGEVELA_BRAND_MIGRATION_AUDIT_20261025.md)、[发布阶段记录](./PAGEVELA_STAGING.md)、[品牌实施规范](./PAGEVELA_BRAND_IMPLEMENTATION_CONTRACT.md)
- [国际品牌准备研究](./INTERNATIONAL_REBRAND_READINESS.md)、[品牌核验与启动门禁](./PAGEVELA_CLEARANCE_AND_LAUNCH_GATES.md)、[视觉发布计划](./VISUAL_LAUNCH_PLAN.md)
- [旧站跳转试验资料](./legacy-pages-redirect/README.md)：**未启用**。项目负责人选择旧 `/resume-craft/` 路径不跳转；勿擅自部署
- 旧版技术记录：`V2_1_*`、`V2_2_*`、`V2_3_*`，上方工程区可查

## 文档维护约定 / Maintenance rules

1. **唯一的实时事实来源：** GitHub 的最新 `main` commit、[Actions](https://github.com/kunlong-luo/pagevela/actions) 和 [Releases](https://github.com/kunlong-luo/pagevela/releases)。这三者必须分别核对。状态快照有日期，只描述核验时点。
2. **指南与历史分离：** README / CONTRIBUTING / RELEASING 描述当前使用方法；`V2_*`、发布包、试验稿描述原始背景。历史文档添加跳转/说明即可，不整篇改写历史事实。
3. **避免断链：** 已公开路径尽量保留；如必须移动，先修复仓库内部链接和外部入口，再核对。
4. **双语与安全：** 可见操作流程保持中英一致；图片、例子、E2E 仅用虚构简历。工作区 JSON 备份未加密，不能上传真实用户数据。
5. **验收证据：** 代码修改必须说明 Git SHA、PR、质量/浏览器测试和同 SHA 的 Pages 部署。未完成的真机、商标与站外任务要明确标为未验收。
