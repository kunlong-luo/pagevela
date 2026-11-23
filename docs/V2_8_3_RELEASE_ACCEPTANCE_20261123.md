# Pagevela v2.8.3 发布验收表 / 2026-11-23

> **状态：候选；首次新版本附件尚未验收。** 本页清单不是 GitHub 发布成功的证明；最终以同 SHA CI/Pages 和 GitHub Release 资产为准。

## 目标

- 唯一版本源：`package.json` = `2.8.3`，运行时通过 Vite `__APP_VERSION__` 注入。
- 官方网站：`https://kunlong-luo.github.io/pagevela/`；预期归档：`pagevela-2.8.3.zip`、`pagevela-2.8.3.tar.gz`、`SHA256SUMS.txt`。
- 更新内容：草稿历史协调和存储可靠性、分栏修复、编辑器快捷键 Hook、生产 PWA 离线、PDF 解析/草稿保留、Chromium/Firefox/WebKit 跨浏览器质量及发布门禁。
- 不修改已有 IndexedDB 标识、跨标签页通道、旧备份和加密分享协议，不恢复旧站自动跳转，不加入原生弹窗。

## 已验证的上一版源码

- [#307](https://github.com/kunlong-luo/pagevela/pull/307) 合并为 [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed)：[CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889) 完整质量/浏览器/生产离线/final `build-and-test` **success**。
- [Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398) build+deploy **success**，[Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214) 校验两层门禁后安全跳过现有 v2.8.2；**这是上游源码的验收，不是 v2.8.3 首次打包成功**。
- 正式已打包版本仍为 [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)。

## v2.8.3 必需发版门槛

- [ ] [#309](https://github.com/kunlong-luo/pagevela/pull/309) 最终头：TypeScript 标准/严格、i18n、ESLint、Vitest、构建、PWA app-shell、性能预算；Chromium 全量+生产离线、Firefox/WebKit 关键 E2E；CodeQL 和 registry 审计、最终 `build-and-test` 均通过。
- [ ] 合并到 main 后记录新的精确 SHA，再确认 push CI 的 quality、Chromium、Firefox/WebKit 四个完整分片及最终 `build-and-test` 全绿。
- [ ] 同 SHA Pages 的实际 `build` 和 `deploy` **success**；拒绝旧 SHA 的过期构建，不能只看 PR 绿灯。
- [ ] Release 检查同 SHA 的 main CI 和 Pages 均成功，实际创建 `v2.8.3` tag，且指向该 SHA。
- [ ] GitHub Release 有 `pagevela-2.8.3.zip`、`pagevela-2.8.3.tar.gz` 和 `SHA256SUMS.txt`，实际可下载解压，使用 `sha256sum -c SHA256SUMS.txt` 或等效逐项比对成功。
- [ ] 发布后同步更新 [项目状态](./PROJECT_STATUS.md)、[发行台账](./RELEASE_SECURITY_ACCEPTANCE_20261123.md)、[发布指南](../RELEASING.md) 中的实际新 SHA、Release ID 与证据。

## 尚未完成的独立事项

- [Android 真实设备 #262](https://github.com/kunlong-luo/pagevela/issues/262)：用户报告微信真机总体 PASS；系统 Print/Save-as-PDF、其他 Android 浏览器、安装后离线 PWA 和具体设备矩阵不能由桌面自动化代替。
- [私有 GitHub 安全告警 #298](https://github.com/kunlong-luo/pagevela/issues/298)：pnpm 注册表 0 条公告不代表 GitHub 私有 Dependabot 告警已清零。
- [架构 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[品牌 #202](https://github.com/kunlong-luo/pagevela/issues/202)：大型 Editor/Store/导出拆分、商标与外站资料单独验收。工程评分沿用 [84/100](./ASSESSMENT_20261123.md) 的有日期报告，不因版本号提高。

[文档索引](./README.md) · [发行说明](../RELEASE_NOTES.md) · [变更日志](../CHANGELOG.md)
