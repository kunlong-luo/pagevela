# Pagevela v2.8.4 发布验收 / Release acceptance

> **2026-11-24 · Release candidate, not a published acceptance report.** 本文明确区分已验证的底层改进与新版本正式验收。版本基于 [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3) 之后的开发代码、文档整理和主键/多标签页安全修复。

## 候选变更 / Candidate scope

- `package.json` 指定 `2.8.4`，全仓使用 Pagevela / 页帆；历史 IndexedDB、锁、跨标签通道、share AAD 和旧备份 ID **不重命名**。
- [#323](https://github.com/kunlong-luo/pagevela/pull/323)、[#325](https://github.com/kunlong-luo/pagevela/pull/325) 已在正式打包之前的 main `a8ec3ae` 通过 [完整 CI #45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) 和 [同 SHA Pages #45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806)，但**不是**这次 `2.8.4` 版本提交的验收结果。
- 新的 README、文档目录与历史版本归档由文档整理 PR 交付；`pnpm run docs:check` 必须加入 CI 并通过。

## 必需门禁 / Must pass before publication

- [ ] v2.8.4 版本 PR 最新头：quality（TypeScript、strict critical、ESLint、Vitest、docs:check、构建、性能预算）+ Chromium 全量 + Firefox/WebKit 关键测试 + 实际执行的 `build-and-test` 全 success。
- [ ] 版本 PR 经受保护分支合并，记录**完整** `main` SHA。
- [ ] 新 main SHA 的 `CI`：quality、完整 Chromium、Firefox 2/2、WebKit 2/2、cross-browser 和实际 `build-and-test` 全 success。
- [ ] **同一 SHA** 的 `Deploy Pages`：`build` 和 `deploy` 两个 job 成功。
- [ ] `Release` CI-gated 工作流成功，并按该 SHA 生成不可变的新 `v2.8.4` tag。
- [ ] GitHub Releases 中确实存在 `pagevela-2.8.4.zip`、`pagevela-2.8.4.tar.gz`、`SHA256SUMS.txt`；检查 tag 解析至 main 发布 SHA。
- [ ] 独立下载、解压并逐项复算两个归档 SHA256，符合清单（**如果无法完成，保持未勾选，禁止写为已验收**）。

## 不能从 CI 推断的事项

- Android 实际系统打印、保存/打开 PDF、不同 OEM 浏览器和已安装 PWA 的完整真机测试尚未按分项证据独立验收；负责人此前确认的 Android 微信整体通过仍保留。
- 旧版已打开浏览器标签页仍可能绕过新事务保护，照片/全部 Profile 元数据未纳入完整冲突恢复；跨设备同步未实现。
- 备份 JSON 不是加密文件；GitHub 私有安全告警 #298 和商标/外部媒体修改仍需另行确认。
- 本版本是稳定语义版本号，不保证已验证的浏览器产品支持矩阵以外的平台。禁用原生弹窗/Tooltip 的 UI 约束维持。

[RELEASING.md](../RELEASING.md) · [发布说明](../RELEASE_NOTES.md) · [CI/Pages 证据台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [88 分复评](./ASSESSMENT.md)
