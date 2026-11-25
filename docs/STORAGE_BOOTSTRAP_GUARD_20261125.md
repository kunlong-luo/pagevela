# IndexedDB 启动读取失败保护 · 2026-11-25

> **候选 PR，未合并/未上线。** 本文描述已提交的防数据误展示逻辑；Android 私密模式、OEM 浏览器及关闭/恢复测试仍待独立验收。正式版本继续为 v2.8.4，不因为此候选修改工程 88/100 分。

## 问题

`src/main.tsx` 启动时依次迁移旧 localStorage 并读取 IndexedDB 的正文、档案和 JD。如果 IndexedDB 被浏览器禁用、损坏或读操作失败，旧逻辑仅记录异常、清空 bootstrap 交接状态，**仍继续创建 Zustand Store 并展示默认/旧简历**。虽然缺失持久化基线会阻止自动覆盖未知数据库，但用户仍可能误认为真实简历已丢失或正在编辑已保存的简历。

## 防护

- IndexedDB 迁移、读取有任一步失败时，不再创建/呈现可编辑的「默认简历」工作区。
- 抛出受控 `ResumeStorageUnavailableError`，使用项目已有的品牌化、可本地化启动恢复页面提示：数据未删除、编辑已暂停、检查浏览器存储权限、重新加载。
- 保持旧启动模块动态导入失败的独立提示，沿用已有 `showStartupRecovery`，不影响网络/缓存异常解释。
- 失败路径不调用 `localStorage.clear`、`Dexie.delete` 或重写核心 IndexedDB 数据。避免在无法核验写入基线时保存默认内容。
- 不更改现有 `resume-craft` 数据库名、跨标签协议、迁移版本、发布包和备份兼容性。

## 测试与验收

`e2e/runtime-recovery.e2e.ts` 增加浏览器存储被禁用的模拟：保留原有唯一简历数据；展示恢复屏而非 `#editor-pane`；按钮和中英文内容可访问。已有测试仍验证动态 chunk 加载失败，以及 ErrorBoundary 在运行时异常中的 Markdown 备份能力。

必须取得 PR 质量、Chromium、Firefox/WebKit、最终 `build-and-test` 以及合并后 main 同 SHA Pages 结果。浏览器模拟测试不等于 Android 实机故障完全复现。

## 后续

- 运行时错误页的「重置本地数据」目前仅清除 localStorage，未清除 IndexedDB；应与帮助中心的两层清理使用同一事务边界和显式失败提醒（**本 PR 不做破坏性数据操作**）。
- `pagehide` 的异步 `flush` 无法保证极快关页时提交成功；需要单独的关闭/重新打开耐久性验收。
- 全量工作区恢复、Android 系统打印与 PDF 低内存的证据仍是独立事项。

[工程状态](./PROJECT_STATUS.md) · [持久化架构](./PERSISTENCE_ARCHITECTURE_20261026.md) · [保存成功回执候选](./INDEXEDDB_SAVE_ACKNOWLEDGEMENT_20261125.md)
