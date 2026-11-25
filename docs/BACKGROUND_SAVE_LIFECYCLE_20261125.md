# 页签切后台 / 页面退出时的简历保存 / 2026-11-25

> **下一阶段修复候选，尚未合并或部署。** 正式 GitHub Release 仍为 v2.8.4；当前验收源代码的确切 SHA、CI 与 Pages 见 [项目状态](./PROJECT_STATUS.md)。这是本地浏览器保存的可靠性增强，不是云同步或数据绝对不丢失的保证。

## 发现的问题

原始 `src/main.tsx` 只在 `window.pagehide` 启动 `activeResumePersistence.flush()`；用户在 Android/微信切到另一个 App、锁屏、浏览器切后台时，网页可被**冻结或终止**，不一定会先获得 `pagehide` 或有足够时间完成异步 IndexedDB 事务。待提交的 350ms 自动保存因此可能仍停在计时器内。原来的 `beforeunload` 监听还会在事件发生时取消 Zustand store 订阅；Firefox 等浏览器对使用 `beforeunload` 的页面可能限制 BFCache，从后退恢复时也不应在缓存页面上解除正常保存订阅。

## 代码变更

- 新的 `src/lib/resume-lifecycle.ts` 从 `main.tsx` 隔离浏览器生命周期监听及 Promise 异常处理：当 `document.visibilityState === 'hidden'` 时**立即请求**协调器 `flush()`，把延迟保存提前进入现有 IndexedDB FIFO/跨标签防覆盖事务；`pagehide` 保留为独立兜底。
- 不在 `visible` 时重复 flush，不使用同步 XHR、`sendBeacon`、`localStorage` 明文简历、原生对话框或阻塞式 `beforeunload`。去掉 `beforeunload` 监听与在退出时取消 store 订阅的动作：订阅随页面生命周期自然销毁，BFCache 恢复时仍可继续响应内容变更。
- 写入状态仍由 `resume-persistence.ts` 的最新 revision 与真实事务提交决定：请求触发不等于「Saved」；失败继续产生 `failed` 存储状态，异步拒绝由生命周期模块显式记录，无未处理的 Promise 拒绝。
- 保留旧 `resume-craft` IndexedDB 名称、Web Lock、冲突手动草稿、用户简历与所有备份格式，不修改迁移和删除逻辑。

## 自动化验收

`src/tests/resume-lifecycle.test.ts` 新增针对：

1. 后台 `visibilitychange` 在长防抖计时结束前提交真实快照；
2. `pagehide` 在没有 `visibilitychange` 时仍会触发；两事件连续时不重复提交已有快照；
3. `visible` 和 `beforeunload` 不触发保存；移除监听后不再执行回调；
4. 在异步事务未完成时绝不报告 `saved`；提交后才报告；
5. IndexedDB 拒绝写入时记录失败，进度为 `failed`，不产生未处理的 Promise。

现有 `src/tests/resume-persistence.test.ts` 继续验证并发写入、版本回执、失败恢复以及完整清理时禁止数据库复活。保留完整 PR CI（typecheck、lint、unit、Chromium、Firefox/WebKit、`build-and-test`）以及合并后 main 的同 SHA CI/Pages 两层门禁。若某项失败，不宣称已部署。

## 无法由此承诺的事项

浏览器隐藏、退出时启动的 IndexedDB 写入**不会延长**系统给予页面的执行时间；设备直接断电、浏览器强制结束、内存不足、隐私模式禁止存储、旧标签页冲突，以及其他标签页仍存在的清除阻塞，仍可能造成尚未提交的最新修改丢失。此方案只是把请求**提前**发起，而非保证后台落盘。

### 后续建议的真实设备用例（尚未验证）

在 Android Chrome、微信内置浏览器、厂商浏览器与已安装 PWA 中分别测试：连续输入后 100ms 内切后台、锁屏 1–5 秒再恢复、切后台后系统杀进程、低存储配额、重新进入同一简历并比较新增段落与保存状态。记录机型/Android 版本/浏览器版本/实际运行 SHA/输入文本是否恢复；绝不把桌面合成测试当成真机通过。

[持久化架构](./PERSISTENCE_ARCHITECTURE_20261026.md) · [下一阶段路线图](./NEXT_PHASE_ROADMAP_20261125.md) · [项目状态](./PROJECT_STATUS.md)
