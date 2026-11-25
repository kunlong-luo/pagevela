# Pagevela 项目状态 / Project status

> **核验于 2026-11-25。** [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 仍为正式 Release；最新已完整 CI + 同 SHA Pages 验收的 `main` 是文档合并 `89dbce9`。本页是带 SHA 的状态快照，不是实时 CI 面板。未来提交请核对 [Actions](https://github.com/kunlong-luo/pagevela/actions) 与 [Releases](https://github.com/kunlong-luo/pagevela/releases)。

## 最新正式交付

| 范围 | 版本 / 完整提交及证据 | 状态 |
| --- | --- | --- |
| **最新已独立验收 main** | `89dbce95e61bc4b309441ec9689977c40866edb7`（[#330](https://github.com/kunlong-luo/pagevela/pull/330)）：[完整 CI #45400998819](https://github.com/kunlong-luo/pagevela/actions/runs/45400998819) · [同 SHA Pages #45402787924](https://github.com/kunlong-luo/pagevela/actions/runs/45402787924) | quality、Chromium、Firefox/WebKit 四分片、实际 `build-and-test` 及 Pages build/deploy **success**；同 SHA 再次 [CI #45407652247](https://github.com/kunlong-luo/pagevela/actions/runs/45407652247) success，后续重复 Pages skipped 不推翻首次已成功部署 |
| **正式 Release v2.8.4** | annotated tag `905af3c2` 指向 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`：[CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) · [Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) · [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) | **三项成功**；发布于 2026-11-24 |
| **发行附件** | `pagevela-2.8.4.zip`、`pagevela-2.8.4.tar.gz`、`SHA256SUMS.txt` | GitHub 列出了三个附件和各自 SHA256 digest；**已独立验证成功**：[Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817)；49 个文件相同，JSON 附件 `14997601035` |
| **功能改进基线** | `a8ec3ae`：[完整 CI #45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) · [同 SHA Pages #45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) | #323/#325 已合并并包含在 v2.8.4 |
| **工程评分** | [88/100](./ASSESSMENT.md) | 数据可靠性从 13 升到 14/15；不因发版或文档工作重复加分 |

## 已交付内容

- [#323](https://github.com/kunlong-luo/pagevela/pull/323)：事务级防过期标签页覆盖，冲突文本/排版进入可恢复手动草稿，持续提醒不遮挡布局工具；[#325](https://github.com/kunlong-luo/pagevela/pull/325)：同毫秒创建/复制档案防主键冲突。
- [#321](https://github.com/kunlong-luo/pagevela/pull/321)：Auto Fit A4/Letter/语言/页数回归；[#322](https://github.com/kunlong-luo/pagevela/pull/322)：持久化设置清洗独立模块。
- 中英文 README 精简、[文档统一索引](./README.md)、历史版本归档以及 `pnpm run docs:check`，已随 v2.8.4 对应的主分支门禁验收；未部署的旧站跳转试验已从代码删除。

## 2026-11-25 新交付（源码与部署分开）

- [PR #331](https://github.com/kunlong-luo/pagevela/pull/331) 的 [PR-head 全量 CI #45558156328](https://github.com/kunlong-luo/pagevela/actions/runs/45558156328) success，合并为新 main `349d94f`；[Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) **success**：独立下载 v2.8.4 发布 ZIP/TAR.GZ/SHA256SUMS、重算 SHA-256、验证 ZIP CRC 与 TAR.GZ，核对 **49 个相同文件（4,771,193 未压缩字节）**；保存 JSON 报告 `published-archive-verification`（artifact `14997601035`）。
- 记录本快照时，新 main [完整 CI #45559458566](https://github.com/kunlong-luo/pagevela/actions/runs/45559458566) **仍在进行**，该 SHA 的同 SHA Pages 尚未成功核实，不能把本项归档校验的成功当作已上线的证据。最新完整已部署基线仍为上方 `89dbce9`。

## 尚待独立验收

- [#282](https://github.com/kunlong-luo/pagevela/issues/282)：旧版已打开标签页、照片/全部档案元数据恢复、Store/导出架构；[#312](https://github.com/kunlong-luo/pagevela/issues/312)：Auto Fit 完整组合与系统打印；[#262](https://github.com/kunlong-luo/pagevela/issues/262)：Android 系统打印/OEM 浏览器/已安装 PWA 分项。负责人确认过 Android 微信整体验收，但不能替代这些独立证据。
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：GitHub 私有安全告警；独立下载、解压、与 SHA256SUMS 对比 v2.8.4 ZIP/TAR.GZ；站外媒体、商标。备份 JSON 为明文。
- 原有 IndexedDB、Web Lock、BroadcastChannel、分享加密兼容标识不更名；旧 `/resume-craft/` Pages 不提供重定向。

[文档目录](./README.md) · [CI/Pages 详细台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [v2.8.4 发布验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)
