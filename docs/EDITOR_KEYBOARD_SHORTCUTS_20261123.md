# Editor keyboard shortcuts / 编辑器快捷键边界

> **2026-11-23 合并状态：** [PR #307](https://github.com/kunlong-luo/pagevela/pull/307) 已合并为 [主分支 `ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed)；其 [最新头完整 PR CI #45172316902](https://github.com/kunlong-luo/pagevela/actions/runs/45172316902) 通过（质量、Chromium、Firefox/WebKit 关键回归及 `build-and-test`）。**合并后的 [main CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889) 正在执行，本次记录时没有同 SHA Pages/Release 确认**。本文讲解代码契约，不代替生产验收。后续模块拆分见 [#282](https://github.com/kunlong-luo/pagevela/issues/282)。

## 模块职责

- `src/components/EditorWorkspace.tsx`：仅将 `uiLanguage`、PDF 打印回调、存储健康回调和通知传给 Hook，不直接注册 `window.keydown`。
- `src/hooks/useEditorKeyboardShortcuts.ts`：集中管理 `keydown` 监听及清理、读取最新 Zustand 状态、调用 `activeResumePersistence.saveNow`、手动保存反馈、Auto Fit 与 PDF 打印入口。
- `dispatchEditorKeyboardShortcut`：可单元测试的无副作用路由函数；除了 `preventDefault` 和调用传入回调，不读 DOM、浏览器存储或外部状态。
- `src/tests/editor-keyboard-shortcuts.test.ts`：覆盖 Ctrl/Cmd 大小写、Shift 修饰键及不应拦截的组合。
- `e2e/critical-flows.e2e.ts`：验证用户输入 Markdown 后 `Ctrl+S` 仍显示本地保存提示，且可从 IndexedDB 读取刚才的内容。

## 行为兼容契约

| 组合键 | 与调整前保持一致的动作 |
| --- | --- |
| `Ctrl/Cmd+S`，包括原有 `Shift+S` 变体 | 阻止默认浏览器另存为；从当前 Store 取 `markdown`、`profiles`、`jdText`，通过现有串行存储协调器 `saveNow` 提交，成功后显示时间和提示，失败时设置存储错误 |
| `Ctrl/Cmd+P`（不带 Shift） | 阻止默认打印快捷键，进入现有 ATS 文本保真打印 / PDF 导出流程 |
| `Ctrl/Cmd+Shift+F` | 执行 `smartAutoFit`，保留埋点和中英文通知 |
| 其他组合 | 不改变默认行为，不触发编辑器回调 |

**数据与 UI 不变项：** 不改 IndexedDB 名称、持久化写入队列、备份/分享格式、事件名、PDF 输出方式或任何原生弹窗策略。此阶段只移动代码边界，不改变触发条件，也不新增后台任务。

## 回归与后续

验收需要 `pnpm run typecheck`、`typecheck:critical`、`lint`、`test`、生产 `build`、Chromium 全量与 Firefox/WebKit 关键 E2E；合并后需再次核对相同 SHA 的完整 CI 与 Pages 部署。任何真实 Android 系统打印/离线能力仍由 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 独立跟踪，不以 Playwright 代替。
