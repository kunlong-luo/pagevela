# Pagevela 文档目录 / Documentation index

> 唯一文档导航：英文主指南 [README.md](../README.md) · 中文主指南 [README.zh-CN.md](../README.zh-CN.md)。最新已验收 main `349d94f`：[完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45559458566) · [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45560942223)；[v2.8.4 正式发布](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，其发行附件已由 [独立校验工作流](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) 成功核验。当前工程评分 [88/100](./ASSESSMENT.md)。修复 PR 尚未合并时不视为线上交付。

## 从哪里开始 / Start here

| 目的 | 唯一推荐入口 |
| --- | --- |
| 产品介绍、功能、运行命令 | [English README](../README.md) · [中文 README](../README.zh-CN.md) |
| 最新 main、部署、开放风险 | [PROJECT_STATUS.md](./PROJECT_STATUS.md) |
| 七维度工程评分与扣分证据 | [ASSESSMENT.md](./ASSESSMENT.md) |
| CI / Pages / Release 按 SHA 验收台账 | [ENGINEERING_ACCEPTANCE_20261124.md](./ENGINEERING_ACCEPTANCE_20261124.md) |
| 发布包 ZIP/TAR/SHA256 独立验证 | [RELEASE_ARCHIVE_INTEGRITY_20261125.md](./RELEASE_ARCHIVE_INTEGRITY_20261125.md)（新流程 PR 候选） |
| 版本历史和变更 | [CHANGELOG](../CHANGELOG.md) · [RELEASE_NOTES](../RELEASE_NOTES.md) |
| 如何发布、开发及审查 | [RELEASING](../RELEASING.md) · [CONTRIBUTING](../CONTRIBUTING.md) · [SECURITY](../SECURITY.md) |
| 备份、导入和隐私边界 | [WORKSPACE_TRANSFER](./WORKSPACE_TRANSFER.md) · [PRODUCT_ANALYTICS](./PRODUCT_ANALYTICS.md) |
| 内容丢失、导入替换与模板直链防护（PR 候选） | [RESUME_CONTENT_INTEGRITY_20261125.md](./RESUME_CONTENT_INTEGRITY_20261125.md) |
| 完整历史资料 | [history/README.md](./history/README.md) |
| 各平台运营素材（与技术文档分离） | [channel-refresh/README.md](./channel-refresh/README.md) |

## 现行技术与质量 / Current engineering

- **数据可靠性：** [持久化架构](./PERSISTENCE_ARCHITECTURE_20261026.md) · [跨标签冲突防护 #323](./CROSS_TAB_CONFLICT_GUARD_20261124.md) · [档案 ID 唯一性 #325](./PROFILE_ID_UNIQUENESS_20261124.md) · [设置清洗纯函数 #322](./PROFILE_SETTINGS_SANITIZER_20261124.md)。
- **编辑器和排版：** [Auto Fit 测量](./MEASURED_AUTO_FIT_20261124.md) · [恢复前布局](./AUTO_FIT_RESTORE_20261124.md) · [快捷键 Hook](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md) · [存储通知 Hook](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md) · [品牌 UI 组件契约](./BRANDED_UI_CONTRACT.md)。
- **导出、性能、路线图：** [Quick PDF 异常防护](./PDF_EXPORT_FAILURE_SAFETY_20261124.md) · [优化路线图（原始 2026-11-24 审查）](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md) · [工程架构长期任务 #282](https://github.com/kunlong-luo/pagevela/issues/282)。
- **发布/品牌：** [v2.8.4 发布核验](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md) · [发布归档独立完整性流程](./RELEASE_ARCHIVE_INTEGRITY_20261125.md) · [供应链历史台账](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) · [品牌兼容协议](./PAGEVELA_BRAND_IMPLEMENTATION_CONTRACT.md) · [品牌迁移完成范围](./PAGEVELA_BRAND_MIGRATION_AUDIT_20261025.md)。

## 目录结构 / Directory structure

```text
README.md / README.zh-CN.md   Product & developer entry points
CHANGELOG.md / RELEASE_NOTES.md
docs/
  README.md                  Single documentation index
  PROJECT_STATUS.md          Current verified status and open gates
  ASSESSMENT.md              Current 88/100 assessment
  ENGINEERING_ACCEPTANCE_20261124.md   Git SHA / CI / Pages evidence
  [technical notes]          Active design, storage, UI and release contracts
  history/
    README.md                Historical snapshots and old-version index
    versions/                Retired v2.1, v2.2, v2.3, v2.6 source notes
  channel-refresh/           Platform copy, assets, facts and posting tracker
```

## 历史和维护规则 / Archive & maintenance policy

- **当前事实与历史快照分开：** 2026-11-22 的 76 分、11-23 的 84 分、11-24 的 86/87 分报告保留原结论；详见 [历史索引](./history/README.md)，不可用其待验收描述覆盖 88 分当前状态。
- **不修改已发布资产：** v2.8.3/v2.8.4 ZIP、TAR.GZ 与 SHA256SUMS 清单不会被源代码/文档清理追溯改动；缺少独立哈希证据必须写明。
- **保留长期协议：** 原有 IndexedDB、加密分享 AAD、Web Lock 和 BroadcastChannel 是历史兼容标识，不是公用品牌文案；禁止全局搜索替换。
- **旧页面决策：** 用户已经选择**不维护或部署**旧 `/resume-craft/` Pages 跳转，因此移除未启用的独立跳转试验包及其测试；历史决策仍留在 Git/Issue 记录中。
- **不混入站外发布：** [平台宣传包](./channel-refresh/README.md) 和素材登记是人工执行材料，不代表 YouTube、Product Hunt 等平台已经自动改完。
- **本地链接检查：** `pnpm run docs:check` 会检查 README/文档/发布资料中本地 Markdown 链接指向存在的仓库文件，质量 CI 同步运行。外部 URL、历史商标、真机测试仍需人工或单独验收。
