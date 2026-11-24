# Pagevela 项目状态 / Project status

> **核验于 2026-11-24。** [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 已正式发布；最新另行验收的 `main` 为纯文档更新 `dfad007`。本页是带 SHA 的状态快照，不是实时 CI 面板。未来提交请核对 [Actions](https://github.com/kunlong-luo/pagevela/actions) 与 [Releases](https://github.com/kunlong-luo/pagevela/releases)。

## 最新正式交付

| 范围 | 版本 / 完整提交及证据 | 状态 |
| --- | --- | --- |
| **最新已独立验收 main** | `dfad007b6fc094598b8718077d30f4c1be8f2a47`：[完整 CI #45396241838](https://github.com/kunlong-luo/pagevela/actions/runs/45396241838) · [同 SHA Pages #45398234063](https://github.com/kunlong-luo/pagevela/actions/runs/45398234063) | quality、Chromium、Firefox/WebKit、`build-and-test`、Pages build/deploy 均 **success**；仅更新发行资料 |
| **正式 Release v2.8.4** | annotated tag `905af3c2` 指向 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`：[CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) · [Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) · [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) | **三项成功**；发布于 2026-11-24 |
| **发行附件** | `pagevela-2.8.4.zip`、`pagevela-2.8.4.tar.gz`、`SHA256SUMS.txt` | GitHub 列出了三个附件和各自 SHA256 digest；**独立下载、解压、复算尚未通过** |
| **功能改进基线** | `a8ec3ae`：[完整 CI #45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) · [同 SHA Pages #45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) | #323/#325 已合并并包含在 v2.8.4 |
| **工程评分** | [88/100](./ASSESSMENT.md) | 数据可靠性从 13 升到 14/15；不因发版或文档工作重复加分 |

## 已交付内容

- [#323](https://github.com/kunlong-luo/pagevela/pull/323)：事务级防过期标签页覆盖，冲突文本/排版进入可恢复手动草稿，持续提醒不遮挡布局工具；[#325](https://github.com/kunlong-luo/pagevela/pull/325)：同毫秒创建/复制档案防主键冲突。
- [#321](https://github.com/kunlong-luo/pagevela/pull/321)：Auto Fit A4/Letter/语言/页数回归；[#322](https://github.com/kunlong-luo/pagevela/pull/322)：持久化设置清洗独立模块。
- 中英文 README 精简、[文档统一索引](./README.md)、历史版本归档以及 `pnpm run docs:check`，已随 v2.8.4 对应的主分支门禁验收；未部署的旧站跳转试验已从代码删除。

## 尚待独立验收

- [#282](https://github.com/kunlong-luo/pagevela/issues/282)：旧版已打开标签页、照片/全部档案元数据恢复、Store/导出架构；[#312](https://github.com/kunlong-luo/pagevela/issues/312)：Auto Fit 完整组合与系统打印；[#262](https://github.com/kunlong-luo/pagevela/issues/262)：Android 系统打印/OEM 浏览器/已安装 PWA 分项。负责人确认过 Android 微信整体验收，但不能替代这些独立证据。
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：GitHub 私有安全告警；独立下载、解压、与 SHA256SUMS 对比 v2.8.4 ZIP/TAR.GZ；站外媒体、商标。备份 JSON 为明文。
- 原有 IndexedDB、Web Lock、BroadcastChannel、分享加密兼容标识不更名；旧 `/resume-craft/` Pages 不提供重定向。

[文档目录](./README.md) · [CI/Pages 详细台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [v2.8.4 发布验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)
