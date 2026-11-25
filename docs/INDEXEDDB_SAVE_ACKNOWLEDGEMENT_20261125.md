# IndexedDB 真正落盘回执 / Accurate resume save acknowledgement

> **2026-11-25 · 候选修复，尚未合并/上线；评分保持 88/100。** 只有完整 PR CI 和合并后同 SHA main CI + Pages 验收成功，才能将这一阶段标为交付。

## 背景

此前 `useResumeStore.handleMarkdownChange` 在编辑后的 350ms + 400ms 定时器结束时，直接将 `saveStatus` 标记为 `saved` 并更新 `lastSaved`；**该计时器与 IndexedDB 事务完成无关**。即使存储写入仍在队列中、失败或遭遇跨标签页冲突，用户也可能短暂看到绿色「已保存」，形成数据安全误导。

Ctrl/Cmd+S 虽然等待手动保存 promise，但保存等待期间若又继续编辑，旧快照的成功回调还可能弹出「已保存」提示，而当前编辑尚未落盘。

## 修复合同

- `src/lib/resume-persistence.ts`：每次 `schedule` / `saveNow` 分配单调递增修订序号，暴露 `subscribeProgress` 状态流（`idle/saving/saved/failed`）；订阅者立即收到最后状态。**只有最新修订对应的 IndexedDB 写入、共享锁及设置 journal 回执全部完成，才发出 `saved`**。旧修订先完成不能使更新的编辑误显「已保存」。
- `src/store/useResumeStore.ts`：去掉「打字后自动变已保存」的计时器。新增 `acknowledgePersistence`，由真实回执更新 `lastSaved`，失败时显示 `failed`，保留撤销/重做的即时历史提交语义。
- `src/components/EditorWorkspace.tsx`：在懒加载编辑器内订阅回执，卸载自动取消；不会将 IndexedDB/Dexie 引入欢迎页入口包。晚订阅会收到当前真实状态。
- `src/components/layout/Header.tsx`：写入失败使用现有品牌状态/提示，不再掉入绿色「已保存」默认分支。
- `src/hooks/useEditorKeyboardShortcuts.ts`：Ctrl/Cmd+S 完成时再次比较当前 markdown、profile 引用和 JD；新编辑已出现时，不显示旧快照保存成功的误导性 toast。
- 保留旧 `resume-craft` IndexedDB 名称、写锁、BroadcastChannel、存储健康事件、数据格式和完整工作区备份协议；不新增任何原生浏览器弹窗。

## 自动回归

- `src/tests/resume-persistence.test.ts`：延迟写入时保持 `saving`；旧事务先完成时不发 `saved`；写失败再恢复；后挂载订阅读取真实状态；手动保存过时快照对比。
- `src/tests/resume-store.test.ts`：超出原 350/400ms 计时后仍不伪造 `saved`；收到真实失败/成功回执才改变状态。
- 现存 `src/tests/resume-active-conflict.test.ts` / `resume-repository.test.ts` / `resume-draft-persistence.test.ts`：继续保证跨标签并发、恢复草稿、事务边界不回退。

**正式验收要求：** typecheck、lint、单测、性能预算、生产构建、Chromium 全套、Firefox/WebKit 关键回归、聚合 `build-and-test` 全绿；合并后 main 同 SHA CI + Pages 成功并记录链接。Android 真实设备和关闭标签页极短时序需单独测试，不以 CI 取代。

## 尚未解决的风险

1. **启动数据库故障保护：** 初次 IndexedDB 读取失败时，`main.tsx` 仍可能继续呈现默认工作区，应该改为明确的重试/导出恢复界面，禁止误把默认内容视为用户数据。
2. **网页关闭时的异步 flush：** `pagehide` 后浏览器不保证异步事务能够完成；应单独做关闭/重开耐久性验证，并明确风险提示。
3. **写入失败与偏好设置故障的分域：** `STORAGE_HEALTH_EVENT` 目前同时承载 localStorage 和 IndexedDB，成功写入一个 UI 偏好不一定意味着简历数据库恢复；未来应区分故障源。
4. **已有存储重置逻辑：** ErrorBoundary 和帮助中心应使用一致的非破坏性恢复/全清确认流程，避免出现「重置完成」却残留 IndexedDB 的误导。
5. **移动端性能：** 极长 PDF 的整页 canvas 捕获、大工作区 JSON 解析和 Android 系统打印等尚无完整真机内存证据。

[持久化架构](./PERSISTENCE_ARCHITECTURE_20261026.md) · [工程状态](./PROJECT_STATUS.md) · [评分](./ASSESSMENT.md)
