# Pagevela v2.8.3 发布验收 / 2026-11-23（11-24 补充核对）

> **状态：已发布，CI/Pages/Release 闭环通过；二进制包解压及 SHA256 独立比对待验。** 历史候选清单已由 2026-11-24 的 GitHub 实际运行结果更新。此记录不代表 Android 系统打印或私有安全告警通过。

## 发布对象和来源

- npm 唯一版本源 `package.json`：`2.8.3`，应用版本通过 Vite 注入。
- [#309](https://github.com/kunlong-luo/pagevela/pull/309) **已合并**；最终 main SHA：[`501ca26`](https://github.com/kunlong-luo/pagevela/commit/501ca26a10a023f1a05ce3ce227b288a2a6565d4)。
- GitHub [v2.8.3 Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3) 于 **2026-11-23 14:44:49 UTC** 发布。
- Annotated tag `v2.8.3` 的 tag object 解析到 `501ca26a10a023f1a05ce3ce227b288a2a6565d4`，与以下三个工作流的 head SHA 一致。

## 验收矩阵

| 验收项 | 状态与证据 |
| --- | --- |
| [x] main 完整 CI | [#45194841125](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125) success：quality、Chromium、Firefox 1/2 与 2/2、WebKit 1/2 与 2/2，以及 `build-and-test` 成功 |
| [x] 同 SHA Pages | [#45197119172](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) success：`build` 与 `deploy` 均成功 |
| [x] Release 触发链 | [#45197385098](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) success：`Build & Release` job 成功，新版本并非既有标签的 no-op |
| [x] 首次创建 tag | `refs/tags/v2.8.3` 解析至 `501ca26a10a023f1a05ce3ce227b288a2a6565d4` |
| [x] 文件上架 | Release 包含 `pagevela-2.8.3.zip`（1,499,730 字节）、`pagevela-2.8.3.tar.gz`（1,473,157 字节）、`SHA256SUMS.txt`（173 字节） |
| [ ] 独立校验资产二进制 | 本轮没有实际解压包/运行 `sha256sum -c SHA256SUMS.txt`；不能以文件名、尺寸或工作流成功替代校验 |
| [ ] Android 真机完整矩阵 | 微信负责人报告 PASS；原生系统 PDF、Chrome/OEM、安装后 PWA 离线分别由 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 跟踪 |
| [ ] GitHub 私有 Dependabot 安全告警 | Registry Security Inventory 通过不意味着安全后台告警为零，见 [#298](https://github.com/kunlong-luo/pagevela/issues/298) |

## 内容和兼容范围

本版本交付串行 IndexedDB 草稿写入、周期历史协调、分栏回归修复、快捷键 Hook、Workbox 生产预缓存、Chromium 离线导航及 PDF 解析/草稿保留浏览器回归。保留旧 IndexedDB/跨标签页标识、历史 JSON 备份与 v2/v3 加密分享读取；不引入原生弹窗，不恢复 `/resume-craft/` 旧站重定向，不声明商标法律核准。

**2026-11-24 后续架构工作不属于 v2.8.3：** 工作区多标签页提醒和存储健康监听拆分见 [架构记录](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md) 与 [#282](https://github.com/kunlong-luo/pagevela/issues/282)，必须在新的 PR/main/Pages 完整链路中分别验收。

[状态快照](./PROJECT_STATUS.md) · [发布台账](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) · [发布流程](../RELEASING.md)
