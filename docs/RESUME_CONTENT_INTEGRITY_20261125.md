# 简历内容完整性与安全替换验收 · 2026-11-25

> **状态：[#334](https://github.com/kunlong-luo/pagevela/pull/334) 已合并为 `07368d64`，并由 [main 完整 CI #45588914443](https://github.com/kunlong-luo/pagevela/actions/runs/45588914443) 与 [同 SHA Pages #45590609387](https://github.com/kunlong-luo/pagevela/actions/runs/45590609387) 验收成功。** 本文记录修复范围、可运行回归及尚未验收的事项，不能以提交代码替代 Chromium/Firefox/WebKit CI 或 Android 真机证据。

## 故障路径与修复

| 原有路径 | 风险 | 修复策略 / 防护边界 |
| --- | --- | --- |
| `/?page=editor&template=...` | 初次访问会直接应用模板；URL 保留参数，刷新时会再次覆盖活动简历 | 将模板参数当作一次性操作，先 `history.replaceState` 清理参数；在真实保存工作区存在时要求品牌确认，取消保持原文 |
| 欢迎页选择模板 | 仅依赖 localStorage 的首次访问标记判定是否需要确认 | `hasExistingResumeWork` 使用活动 Markdown、档案数量及未编辑默认档案判断，标记丢失不会自动放行 |
| Markdown → 表单 → Markdown | 含 `###` 条目的章节介绍文字 `textValue` 在输出时被忽略 | `parseFormToMarkdown` 在条目前保留原介绍，不静默丢弃 |
| 表单章节「文本 ⇄ 条目」 | 文本转条目可能直接清空 `textValue`；条目转文本可能隐藏旧条目或造成重复 | `convertFormSectionType` 保留自由文本，将条目完整转写为可编辑文本并清理隐藏条目 |
| 普通文本、PDF、MD、JSON 导入 | `replaceDocument` 直接替换并清空撤销记录 | 检测已有用户工作后执行品牌确认，确认后先将旧内容持久化为手动恢复草稿；草稿写入失败则中止替换 |
| 通过通用导入载入备份 | 已验证备份证件照未传递；导入另一人简历可能沿用旧头像 | 传递已校验的 JPEG `photoDataUrl`，否则清理旧证件照，避免跨简历错配；导入前恢复草稿包含原照片，可通过草稿恢复 |

## 自动化覆盖

- `src/tests/resume-content-protection.test.ts`：未编辑初始档案、编辑过的档案、多个档案、无首次标记和空白内容。
- `src/tests/form-section-conversion.test.ts`：自由正文、教育字段、章节前言、模式切换及 Markdown 往返保留。
- `src/tests/portable-workspace-backup.test.ts`：恢复草稿的 JPEG 照片完整往返，拒绝外部和不安全照片 URL。
- `e2e/resume-data-integrity.e2e.ts`：模板直链清理与刷新保留、已有简历拒绝 URL 覆盖、导入前同意并保存手动恢复草稿。
- 相关已有回归：`src/tests/markdown-parser.test.ts`、`e2e/onboarding.e2e.ts`、`e2e/template-center.e2e.ts`、`e2e/pdf-import.e2e.ts`。

**验收门槛：** PR 的质量检查、Chromium 全量、Firefox/WebKit 关键回归和最终 `build-and-test` 均成功，合并后再校验同 SHA main CI 和 Pages。若移动端导出/导入真机缺失，不填写通过。

## 需要继续处理（不是本次已修完）

- `saveStatus` 仍没有严格等待 IndexedDB 事务确认，可能过早显示「已保存」。
- `pagehide` 中的异步 flush 不保证关闭窗口前事务完成。
- 低内存 Android 下完整 PDF raster canvas 与大型工作区 JSON 的容量压力需实际测试。
- IndexedDB 启动失败时需要明确可恢复、禁止假工作区污染的用户体验。
- Auto Fit 真实打印分页及 Android 系统打印、OEM/安装 PWA 仍须分别验证。

## 兼容性原则

不修改旧 `resume-craft` IndexedDB 名称、既有 Local Storage 键、分享密钥/加密参数或 v2.8.4 已发布附件；导入草稿与模板修改继续通过现有 Zustand → IndexedDB 写入流程。所有破坏性操作使用自定义确认组件，不调用原生 `window.confirm`。
