# Pagevela 跨标签页主动保存冲突防护 / Active-snapshot conflict guard

> 2026-11-24 **PR 候选说明，不代表已通过浏览器 CI 或已经上线**。相关架构跟踪：[Issue #282](https://github.com/kunlong-luo/pagevela/issues/282)。现有正式下载包仍为 v2.8.3；不得追溯包含本次修复或自行提高工程评分。

## 之前的实际风险

- `src/lib/resume-persistence.ts` 已用 FIFO 和保留的 `resume-craft:indexeddb-write` Web Lock 顺序提交，但第二个标签页可在读取旧数据后离线编辑，再于第一标签页提交新正文之后覆盖掉第一份内容。
- `BroadcastChannel` 仅显示“另一标签页正在编辑”的提醒，并没有阻止过期写入；Web Locks 单独也不具备读版本比较语义。
- 用户数据以 IndexedDB 为准。不能把不同标签页的稿件自动拼接或悄悄选择最后一个写入者。

## 本次候选实现

1. 页面在 `src/main.tsx` 从 IndexedDB 完成迁移与读取后，把 **原始** `markdown / profiles / jdText` 交给唯一的 `activeResumePersistence.setBaseline`；Zustand 仍在此后异步导入，避免启动时丢草稿。
2. `persistActiveResumeIfUnchanged` 在 **一个 Dexie `rw` 事务** 内读取已提交的全部活跃正文、档案和 JD，与标签页编辑基线比较：
   - 与基线相同：原子写入正文/档案/JD，并更新本标签页下次使用的基线。
   - 与本次待保存内容已完全相同：视为另一个标签页已完成相同写入，避免误报。
   - 与二者均不同：**不动已提交的正文/档案/JD**；以现有 `drafts` 表的独立手动草稿追加旧标签页的各 Profile 的文字、样式、模板，以及不一致的活动正文和非空 JD 的文本副本。
3. 检测到冲突且恢复草稿已成功落盘后，`discardConflictingProfileSettings` 仅移除**时间戳与设置值都匹配被拒绝快照**的本地轻量设置日志，避免刷新后将过期排版再次覆盖新版本；其他标签页更新的日志不被无条件清除。
4. 遇到冲突后，`src/hooks/useEditorSafetyNotifications.ts` 通过现有存储健康事件显示品牌化中英警告。用户进入**备份 → 草稿**即可查看/恢复文本与布局，核对后重新打开旧标签页。失效基线不能偷偷“自愈”为最新并覆盖另一个标签页。
5. 只有用户明确确认的**整工作区导入**可在成功写入后显式更新本标签页的保存基线；其原有覆盖确认、FIFO 清空、草稿互斥及 Web Lock 仍在。
6. 迁移/引导读取失败时**拒绝在未知基线上写入**，比盲写更安全。正常存储故障仍提示用户导出本地 JSON 备份。

### 不变契约

- **没有 IndexedDB schema 升级**，不更名 `resume-craft` DB、`resume-craft:indexeddb-write` 锁、`resume-craft:tabs:v1` 通道。
- 不新增在 localStorage 中存放简历正文、照片或用户草稿的副本；冲突恢复记录直接保存在原 IndexedDB `drafts`，与现有手动草稿同等保留。
- 不改变 UI 原生禁用规则、Markdown 格式、ATS/Quick PDF、PWA/分享链接加密格式或历史发布附件。

## 验收标准与自动化

- `src/tests/resume-active-conflict.test.ts`：测试写入放行、相同版本去重、正文/其他档案/JD 冲突、可恢复草稿内容及对源快照无修改。
- `src/tests/editor-safety-notifications.test.ts`：核验中英冲突反馈与存储配额错误分流。
- `src/tests/pending-profile-settings.test.ts`：核验清除被拒绝快照所对应的设置日志，但保留另一标签页的较新设置日志。
- `e2e/cross-tab-active-conflict.e2e.ts`：真实共享 IndexedDB 的两个 Chromium 标签页同时编辑虚构简历，断言**A 的已提交正文不会被 B 的过期修改覆盖**、**B 的正文可在 Drafts 中找到且不是自动轮替草稿**、B 刷新后加载 A 的最新版本。
- 必须通过**最新 PR 头**质量/TypeScript/单元测试、Chromium 全量、Firefox/WebKit 关键回归及实际执行的 `build-and-test`，合并后另需完整 **main CI + 同 SHA Pages**；不以测试代码的存在本身宣称通过。

## 仍有边界，不能声称“全量多标签无损同步”

- 本 PR 保留 Markdown、排版设置、模板和非空 JD 文本。现有 `ResumeDraft` 结构**不保存证件照、所有档案元数据或完整可自动重建的工作区 JSON**；冲突时较旧标签页中尚未保存的这部分修改可能无法由草稿直接恢复。提示并鼓励手动导出完整 JSON，仍需后续独立设计更完整的冲突快照能力。
- **旧版已打开的 Web 标签页**、不走活跃快照 Coordinator 的旧版客户端以及后台服务工作者仍可能绕过这次事务检查；正式升级后的跨版本兼容需要另测，不要宣称已防护所有历史客户端。
- 不能自动合并两标签页的编辑，不能将本保护等同于多设备同步，也没有替代 Android Chrome/OEM、微信系统打印及安装后 PWA 的真机验收。
- 备份导入/手动清除本地数据是用户明确授权的独立操作；它们仍可能更改草稿历史。
- 大型/复杂工作区的性能、冲突过多产生的草稿空间开销与弱网真机表现还需单独测试；若发生 quota failure，回退为既有“本地保存失败/先导出 JSON”提示。

## 下阶段

在 [#282](https://github.com/kunlong-luo/pagevela/issues/282) 中补充照片及完整 Profile 元信息的冲突恢复、跨版本标签页和不同设备矩阵；每一步作为独立 PR 验收，**不提前提高 86/100**。

[现行存储架构](./PERSISTENCE_ARCHITECTURE_20261026.md) · [存储安全 Hook](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md) · [状态快照](./PROJECT_STATUS.md)
