# Pagevela 项目状态 / Project status

> **核验于 2026-11-25。** [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 仍为正式 Release；最新已完整 CI + 同 SHA Pages 验收的 `main` 为 `349d94f`。发行包独立下载、哈希复算和归档检查工作流成功，但工程修复分支仍须单独通过 PR 及合并后的同 SHA 验收。本页是带 SHA 的状态快照，实时状态请核对 [Actions](https://github.com/kunlong-luo/pagevela/actions)。

## 最新正式交付

| 范围 | 版本 / 完整提交及证据 | 状态 |
| --- | --- | --- |
| **最新已独立验收 main** | `349d94f05749fcfa52b29ebd9ab2a9e19a44caaf`：[完整 CI #45559458566](https://github.com/kunlong-luo/pagevela/actions/runs/45559458566) · [同 SHA Pages #45560942223](https://github.com/kunlong-luo/pagevela/actions/runs/45560942223) | **success**；质量、跨浏览器及生产构建与部署已验证。此 SHA 仍不含本次未合并的修复 PR |
| **正式 Release v2.8.4** | annotated tag `905af3c2` 指向 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`：[CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) · [Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) · [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) | **三项成功**；发布于 2026-11-24 |
| **发行附件** | `pagevela-2.8.4.zip`、`pagevela-2.8.4.tar.gz`、`SHA256SUMS.txt`；[独立验证 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) | **success**：已按工作流完成真实下载、ZIP/TAR.GZ 读取及 SHA256 复算；[#333](https://github.com/kunlong-luo/pagevela/pull/333) 独立验收文档 PR 尚为 draft，不能视为已合并 |
| **功能改进基线** | `a8ec3ae`：[完整 CI #45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) · [同 SHA Pages #45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) | #323/#325 已合并并包含在 v2.8.4 |
| **工程评分** | [88/100](./ASSESSMENT.md) | 数据可靠性从 13 升到 14/15；不因发版或文档工作重复加分 |

## 已交付内容

- [#323](https://github.com/kunlong-luo/pagevela/pull/323)：事务级防过期标签页覆盖，冲突文本/排版进入可恢复手动草稿，持续提醒不遮挡布局工具；[#325](https://github.com/kunlong-luo/pagevela/pull/325)：同毫秒创建/复制档案防主键冲突。
- [#321](https://github.com/kunlong-luo/pagevela/pull/321)：Auto Fit A4/Letter/语言/页数回归；[#322](https://github.com/kunlong-luo/pagevela/pull/322)：持久化设置清洗独立模块。
- 中英文 README 精简、[文档统一索引](./README.md)、历史版本归档以及 `pnpm run docs:check`，已随 v2.8.4 对应的主分支门禁验收；未部署的旧站跳转试验已从代码删除。

## 当前修复候选（2026-11-25，未合并 / 未上线）

- [引导与启动恢复 PR #332](https://github.com/kunlong-luo/pagevela/pull/332)：修复窄屏回归测试路径与标记丢失下的覆盖保护；仅最新完整 CI 成功才可合并。
- [简历内容完整性候选](./RESUME_CONTENT_INTEGRITY_20261125.md)：模板直链一次性消耗、Markdown/表单章节内容保留、普通导入前自定义确认与恢复草稿、旧证件照隔离。单元/E2E 及合并后的 Pages 证据仍待 CI 验收。
- [发布档案校验 PR #333](https://github.com/kunlong-luo/pagevela/pull/333) 仍为 draft 文档记录，但 main 的 [Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) 已成功；不得把文档未合并写成归档验证失败。

## 尚待独立验收

- [#282](https://github.com/kunlong-luo/pagevela/issues/282) 已关闭，仍保留后续架构风险追踪：旧版已打开标签页、照片/全部档案元数据恢复、Store/导出架构；[#312](https://github.com/kunlong-luo/pagevela/issues/312)：Auto Fit 完整组合与系统打印；[#262](https://github.com/kunlong-luo/pagevela/issues/262)：Android 系统打印/OEM 浏览器/已安装 PWA 分项。负责人确认过 Android 微信整体验收，但不能替代这些独立证据。
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：GitHub 私有安全告警；站外媒体、商标。备份 JSON 为明文。v2.8.4 附件的独立哈希校验见上方成功工作流。
- 原有 IndexedDB、Web Lock、BroadcastChannel、分享加密兼容标识不更名；旧 `/resume-craft/` Pages 不提供重定向。

[文档目录](./README.md) · [CI/Pages 详细台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [v2.8.4 发布验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)
