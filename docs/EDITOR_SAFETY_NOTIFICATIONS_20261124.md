# Editor safety notification hooks / 编辑器安全通知边界

> **2026-11-24 开发记录（非发布声明）：** `src/hooks/useEditorSafetyNotifications.ts` 从 `EditorWorkspace.tsx` 接管多标签页存在提醒和浏览器本地写入健康通知。此变更不属于已发布的 v2.8.3；合并 PR 后还需重新核对 main 新 SHA 的 CI/Pages。架构总路线见 [#282](https://github.com/kunlong-luo/pagevela/issues/282)。

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

`src/tests/editor-safety-notifications.test.ts` 包含消息路由、错误/恢复/配额、英文及中文反馈回归。通过质量/浏览器 CI 前不能宣称发布；后续还可增加 BroadcastChannel 生命周期的浏览器级实测。

## 验收规则与非目标

必需通过 TypeScript、lint、Vitest、Chromium 全量、Firefox/WebKit 回归及最终 `build-and-test`；合并后核对**新 main SHA** 的 CI 与 Pages。这里没有新原生 `alert/confirm/select/tooltip`，也不新增后台同步、存储结构迁移、PDF 行为或人工设备验收。Android 系统 PDF 和安装后 PWA 仍属 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 的独立事项。

[文档索引](./README.md) · [状态](./PROJECT_STATUS.md) · [快捷键 Hook](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)
