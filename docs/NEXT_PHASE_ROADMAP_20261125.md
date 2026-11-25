# Pagevela 下一阶段工程路线图 / 2026-11-25

> **以证据为准的候选计划，不表示所有事项已交付。** 当前正式版仍为 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，工程评分 [88/100](./ASSESSMENT.md)。历史决策见 [2026-11-24 原始路线图](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md)；当前仓库 SHA/流水以 [PROJECT_STATUS](./PROJECT_STATUS.md) 为准。

## 本阶段 P0：先完成真实数据安全闭环

| 任务 | 进度和边界 | 可核验的完成标准 |
| --- | --- | --- |
| [#334 内容不被替换](https://github.com/kunlong-luo/pagevela/pull/334) | **PR 完整 CI #45587102689 已成功，合并为 `07368d64`**；内容覆盖保护已入 main，但尚未确认新 SHA 的生产部署 | [主分支 CI #45588914443](https://github.com/kunlong-luo/pagevela/actions/runs/45588914443) 和同 SHA Pages；重载/导入/切表单后现有正文与照片不丢 |
| [#335 真实已保存回执](https://github.com/kunlong-luo/pagevela/pull/335) | **已合并**，只有已提交的最新 IndexedDB 快照可显示已保存 | 合并后的 main SHA 全 CI/Pages；失败、竞争修订、晚订阅及真实储存延迟测试持续通过 |
| [#336 启动读取失败保护](https://github.com/kunlong-luo/pagevela/pull/336) · [#338 WebKit 测试修复](https://github.com/kunlong-luo/pagevela/pull/338) | **均已合并**，WebKit 的 IndexedDB 拒绝访问测试用真实失败操作注入；旧失败 Run 不涂绿 | 最新 main `0fea9fc`：[CI #45584515860](https://github.com/kunlong-luo/pagevela/actions/runs/45584515860) + [同 SHA Pages #45586651728](https://github.com/kunlong-luo/pagevela/actions/runs/45586651728) success |
| [#337 清理全量本地数据](https://github.com/kunlong-luo/pagevela/pull/337) | 两处确认 UI 共用完整清理、停止自动保存/草稿队列并等待在途写入、分阶段显示失败；候选尚未合并 | [清理专项测试](./FULL_LOCAL_DATA_RESET_20261125.md)；全部 CI、合并后 main 同 SHA Pages，跨来源数据不删；旧版其他标签页仍需先关闭 |
| v2.8.4 归档完整性 | 真实归档独立校验已成功，而一些原始文档尚遗留「待校验」字样 | [归档工作流 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) success；统一 [发布验收报告](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)、[发布手册](../RELEASING.md) 和 [Release Notes](../RELEASE_NOTES.md)；不改动已发布附件 |

## 下阶段 P1：性能与移动端真实体验

1. **页签生命周期与保存耐久性。** 检查 `pagehide`、`visibilitychange`、手机杀进程及离线断电：异步 IndexedDB 写入不能在页面终止后得到完成保证。先记录等待写入、失败/恢复与重载回读 E2E，考虑更早的写入触发和离开页面前的状态提示；不伪称「关闭即保证保存」。
2. **长简历/弱设备 Quick PDF。** 量化 A4/Letter、1/2/3+ 页图片导出的 Canvas/内存峰值、耗时、取消和失败时草稿保留，优先限制峰值，之后再比较方案。必须包含 PDF 文本/可读性要求，不能用降低分辨率掩盖问题。
3. **Android 验收矩阵。** 按 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 分别记录微信内置浏览器、Chrome、OEM、安装后 PWA 的 PDF 下载/打印、应用回前台和离线。负责人确认的微信整体成功继续保留，但不扩展到尚未测试的每个分项。
4. **Auto Fit 收敛与打印。** 按 [#312](https://github.com/kunlong-luo/pagevela/issues/312) 在完整纸型/语言/内容组合中收集实际页面测量和打印结果，保留撤销与字号底线，不承诺任意文档可强制一页。

## 下阶段 P2：架构与治理

- **拆分 Store、Editor 和 PDF 导出域：** 以真实输入延迟、预览更新时间和 chunk 体积数据先建基线，然后拆分，禁止一次性全局迁移触发数据损坏。
- **旧版/多标签页数据协议：** 沿用 `resume-craft` IndexedDB、Web Lock 和 BroadcastChannel 兼容标识；处理仍存活的旧代码标签页、照片和完整档案元数据竞争，并能恢复冲突副本。
- **安全与文档：** [GitHub 私有告警 #298](https://github.com/kunlong-luo/pagevela/issues/298) 另行授权审查；历史评分、版本 release、站外推广材料不与当前工程验收混淆。原生浏览器 `alert/confirm/prompt/tooltip` 继续不进入产品 UI。

## 每一项必须一致的交付标准

先确定故障复现或性能基线，再提交最小变更和自动回归。PR 的 quality、完整 Chromium、Firefox/WebKit 检查和 `build-and-test` 必须成功；合并到 main 后按**准确 SHA**重新独立核对完整 CI 与 Pages build/deploy。只读 Release 归档验收、正式版本更新、Android 真机单项验收分别记录，互相不能替代。评分只对通过门禁、实际在线且具备证据的改善重新评估。

[文档目录](./README.md) · [项目状态](./PROJECT_STATUS.md) · [工程评分](./ASSESSMENT.md) · [历史路线图](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md)
