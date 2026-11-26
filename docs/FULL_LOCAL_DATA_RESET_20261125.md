# Pagevela 本地数据完整清理与错误恢复 / 2026-11-25

> **已上线验收：[#337](https://github.com/kunlong-luo/pagevela/pull/337) 合并为 `bb347487`，通过 [完整 CI #45591475788](https://github.com/kunlong-luo/pagevela/actions/runs/45591475788) 和 [同 SHA Pages #45593665011](https://github.com/kunlong-luo/pagevela/actions/runs/45593665011)。** 正式 Release 仍为 v2.8.4；原 88/100 工程评分不因本文件提高。实际验证依照 [PROJECT_STATUS](./PROJECT_STATUS.md)。

## 问题与根因

- `src/components/ui/ErrorBoundary.tsx` 的「重置页帆本地简历数据」原先只调用 `storage.clearAllResumeData()`，也就是清理 localStorage；**IndexedDB 中仍有简历、照片、档案和草稿**，重载后这些数据可能重新出现，按钮文字与实际效果不符。
- 帮助中心已有 IndexedDB 删除，但与异常页是两条不同代码路径，删除失败只写 console，不向用户说明。
- 清理时自动保存的延迟计时器、活动快照保存队列和草稿轮转队列可能继续执行，**在 IndexedDB 删除后重新创建数据**。

## 当前实现（已合并）

1. 两个已有的**自定义确认 UI** 共用 `src/lib/resume-full-reset.ts`：`clearPagevelaLocalData()`。
2. 用户主动确认后先暂停 `activeResumePersistence` 和 `activeDraftHistoryPersistence` 的新操作，清除自动保存延迟任务并等待已进入数据库的事务完成；失败则不开始删除。
3. 再删除既有 `resume-craft` IndexedDB（包含正文、档案、草稿和迁移元数据），最后只清理 `STORAGE_KEYS` 列出的 Pagevela localStorage 键，**不使用 `localStorage.clear()`，保留同源其他应用的数据**。
4. 只有上述步骤全部成功才执行刷新和 `local_data_cleared` 统计事件。失败始终保留 UI，明确报告阶段：
   - `suspend`：队列无法排空，尚未执行数据库/偏好删除；
   - `database`：IndexedDB 删除失败，**不执行**偏好清理；
   - `preferences`：数据库**可能已被删除**，但偏好清理未完全成功；以「部分清除」提示，不能宣称完成。
5. 开始清理后本页持久化协调器保持暂停，直到页面重新加载，防止删库过程中重建默认简历。如果失败，用户应通过现有重载按钮重试，而非继续编辑不可靠的旧工作区。
6. 仍保留运行时异常页面的「复制简历文本备份」，建议删除前另导出 **完整工作区 JSON**；纯文本备份不包含所有档案/照片/草稿。

## 自动化回归与证据边界

- `src/tests/resume-full-reset.test.ts`：双写入队列完成后才删库；排空失败、数据库失败、偏好拒绝/异常时的准确阶段与不中断原有数据优先级。
- `src/tests/resume-persistence.test.ts`：待执行自动保存被取消、重置后不能重新排队写库、在途事务真正结束后才允许删除。
- `src/tests/resume-draft-persistence.test.ts`：排队中的草稿更新不准在重置后复活，新读写被拒绝。
- `e2e/full-data-reset.e2e.ts`：在真实 Runtime ErrorBoundary 中确认清理，并验证浏览器重载后敏感简历/草稿已清除而同源其他应用 localStorage 不变。
- `e2e/storage-migration.e2e.ts` 既有帮助中心清理回归继续保留。

**限制：** IndexedDB 与 localStorage 属于两类浏览器存储，清理过程**不是一个跨存储原子事务**。另一个已打开的旧版 Pagevela 标签页、安装 PWA、其他网站来源不在本页暂停机制控制范围内，可能阻塞删除或再次写入。清理前需关闭其他 Pagevela 标签页，并可选择先导出完整备份。浏览器测试不等于所有 Android OEM/微信真机验证。

## 交付门槛与待办

[#337](https://github.com/kunlong-luo/pagevela/pull/337) 的 typecheck、lint、单元测试、Chromium 全套、Firefox/WebKit 分片、最终 `build-and-test` 已通过；合并后 main `bb347487` 的 [完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45591475788) 和 [Pages build/deploy](https://github.com/kunlong-luo/pagevela/actions/runs/45593665011) 也成功。**不等于**全部 Android 真机或跨标签旧客户端都已验证。

尚未解决：急速关闭页面的 `pagehide` flush 耐久性、长 PDF Canvas 内存、Auto Fit/系统打印、剪贴板权限失败提示（下方为待验收修复候选）、GitHub 私有安全告警与 Android 真实设备矩阵。

[持久化架构](./PERSISTENCE_ARCHITECTURE_20261026.md) · [工作区跨浏览器备份](./WORKSPACE_TRANSFER.md) · [项目状态](./PROJECT_STATUS.md)

## 故障恢复补充

清理失败后，异常页的「复制简历文本备份」仍应可用（操作进行中除外），尽可能从尚未丢失的内存状态保存原文；不能因为部分清除失败而禁用最后的备份入口。


## 2026-11-26 紧急备份剪贴板回退（#344 原 HEAD CI 已通过，集成验收待完成）

源码复核发现 ErrorBoundary 的备份按钮遇到 clipboard API 不存在或拒绝授权时只记录控制台错误，用户看不到失败原因，可能在未备份的情况下重载或删除本地数据。

- 保持活动内存正文 → IndexedDB → 历史本地键的既有恢复顺序。剪贴板写入成功才显示「已复制」。
- 读取到正文但写入失败：显示中英文失败说明及品牌 CustomTextarea 只读文本，允许用户手动选择复制。临时文本仅在 React 内存中，不上传、不新增持久化记录、不进入统计。
- 未取得正文：明确提示暂无可复制文本，不能冒充成功。复制读取期间禁止重复复制及开始清除；原有清除确认、阶段错误和持久化暂停机制不变。手动文本仅为当前简历，不等于完整工作区备份。
- 在 `e2e/runtime-recovery.e2e.ts` 用虚构简历模拟剪贴板 NotAllowedError，分别验证中英文可见、只读、完整正文、无虚假成功及 IndexedDB 不变；原成功复制用例继续保留。将该文件纳入 PR Firefox/WebKit 关键回归。
- 本变更需要当前 HEAD 的 quality、完整 Chromium、关键 Firefox/WebKit 与 build-and-test；合并后完整 main CI 和同 SHA Pages 独立核验。当前评分 88/100；未经真实浏览器验收不加分，不宣称所有微信/OEM 剪贴板场景已解决。

**2026-11-26 验收快照：** 原 PR CI #45743859794 与 [集成 PR CI #45746913427](https://github.com/kunlong-luo/pagevela/actions/runs/45746913427) 均成功；现同步已合并 #343 的 `54102021093732e0ff2c79be89f03ae4880774d3`，新 HEAD 须重新测试；未合并，不计入线上能力。
