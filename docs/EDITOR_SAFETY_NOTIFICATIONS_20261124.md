# Editor safety notification hooks / 编辑器安全通知边界

> **2026-11-24 代码与部署已验收：** `src/hooks/useEditorSafetyNotifications.ts` 从 `EditorWorkspace.tsx` 接管多标签页存在提醒和本地写入健康通知。[PR #310](https://github.com/kunlong-luo/pagevela/pull/310) 已合并为 [`16b11ff`](https://github.com/kunlong-luo/pagevela/commit/16b11ff2a6e713ab0567c6548406252c659dd5ff)，其 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 与 [同 SHA Pages 部署](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196) 均成功。**当前线上 main 已包含该拆分，但 v2.8.3 历史下载压缩包仍是旧 SHA `501ca26`。** 架构路线见 [#282](https://github.com/kunlong-luo/pagevela/issues/282)。

## 责任边界

- `EditorWorkspace.tsx` 只传入语言、`showToast` 与原有 `setStorageHealth`；不直接订阅 `BroadcastChannel` 或 `pagevela:storage-health`。
- Hook 用两组 `useEffect` 注册并清理：跨标签页的 `BroadcastChannel`（`hello` / `presence`）和存储健康事件监听。
- `classifyResumeTabMessage` 与 `describeStorageHealth` 是可独立测试的纯映射：忽略本标签页/未知消息；区分恢复、空间不足及其他写入失败，保持中英文 Toast 及持续时间。
- 通道名称读取既有 `RESUME_TABS_CHANNEL_NAME`，健康事件读取既有 `STORAGE_HEALTH_EVENT`，**不迁移/重命名历史 IndexedDB、Web Locks、跨标签页协议或用户本地数据**。

## 行为与隐私回归

| 事件 | 必须保持的行为 |
| --- | --- |
| 新标签页启动 | 发出 `hello`；其他编辑器收到后最多提醒一次并回复 `presence` |
| 收到 `presence` | 仅提醒一次，忽略同 sourceId，不触发互相循环广播 |
| 存储恢复 | `setStorageHealth('ok')`，显示约 3500 ms 成功通知 |
| 配额耗尽 | `setStorageHealth('error', true)`，提示关闭前导出 JSON 备份及释放空间，显示约 8000 ms |
| 其他写入错误 | `setStorageHealth('error', false)`，提示先导出备份，不误称为存储配额问题 |
| 卸载/语言切换 | 清理旧事件监听并关闭频道；继续使用原有语言/Toast 依赖方式 |

`src/tests/editor-safety-notifications.test.ts` 包含消息路由、错误/恢复/配额、英文及中文反馈回归。PR #310 的完整质量与浏览器 CI、合并后主分支全部浏览器分片及 Pages 已核实通过。**现有测试主要是纯函数消息映射；真实并行标签页编辑互相覆盖的冲突保护未实现**，仍属 #282 的后续问题。

## 本轮实际验收证据

- PR 代码最新头 `12e9198`：[#45303536765](https://github.com/kunlong-luo/pagevela/actions/runs/45303536765) 全部必需项目 success；CodeQL 和 Security Inventory success。
- 合并 main `16b11ff`：[#45305029314](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 包含 quality、Chromium 全量、Firefox 2/2、WebKit 2/2、cross-browser 汇总和最终 `build-and-test` 全部 success。
- 同 SHA Pages [#45307035196](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196)：build 和 deploy success。Release workflow 的 success 不意味着新的版本包已发布；正式 v2.8.3 tag 仍指向 `501ca26`。
- [更新至 2026-11-24 的主分支验收台账](./ENGINEERING_ACCEPTANCE_20261124.md)。

## 验收规则与非目标

必需通过 TypeScript、lint、Vitest、Chromium 全量、Firefox/WebKit 回归及最终 `build-and-test`；**这一项 #310 的新 main SHA CI 与 Pages 已完成核对**。这里没有新原生 `alert/confirm/select/tooltip`，也不新增后台同步、存储结构迁移、PDF 行为或人工设备验收。Android 系统 PDF 和安装后 PWA 仍属 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 的独立事项。

[文档索引](./README.md) · [状态](./PROJECT_STATUS.md) · [快捷键 Hook](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)
