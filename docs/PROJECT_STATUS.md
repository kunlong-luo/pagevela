# Pagevela 项目状态 / Project status

> **更新日期：2026-11-24。** 最新正式发布版本是 [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)；其 tag 解析到 `501ca26a10a023f1a05ce3ce227b288a2a6565d4`（短 SHA `501ca26`）。该 SHA 的 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125)、[Pages build/deploy](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) 与 [Release](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) 均为 **success**；Release 于 **2026-11-23 14:44 UTC** 发布。三个资产 `pagevela-2.8.3.zip`、`pagevela-2.8.3.tar.gz`、`SHA256SUMS.txt` 均出现在 GitHub Release 中。**本次核对未独立下载解压二进制包并逐项比对 SHA256**；不可将“资产存在”写成“校验通过”。

> 此次继续推进 [#282](https://github.com/kunlong-luo/pagevela/issues/282) 的工作区安全通知 Hook 拆分及测试：**PR #310 已合并为 [`16b11ff`](https://github.com/kunlong-luo/pagevela/commit/16b11ff2a6e713ab0567c6548406252c659dd5ff)**，其 PR 最新头 CI、CodeQL 与安全清单通过；其 [同 SHA main 完整 CI #45305029314](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 和 [Pages 部署 #45307035196](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196) **均 success**（main SHA `16b11ff`）。该代码不属于已发布的 v2.8.3 Release。工程评分沿用 [2026-11-23 的 84/100](./ASSESSMENT_20261123.md)，不因版本发布或文档修订自动加分。

## 本次已核对的版本、分支和交付

| 对象 | 核验结论 |
| --- | --- |
| 最新正式 GitHub Release | [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)；发布于 2026-11-23；ZIP/TAR.GZ/SHA256SUMS 三项资产存在 |
| 已发布版本的 tag | Annotated tag `v2.8.3` 指向 `501ca26a10a023f1a05ce3ce227b288a2a6565d4` |
| 该 SHA 的 main CI | [#45194841125](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125) **success**：quality、Chromium、Firefox 2/2、WebKit 2/2、最终 `build-and-test` |
| 该 SHA 的 Pages | [#45197119172](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) **success**：build 与 deploy 均通过 |
| 该 SHA 的自动 Release | [#45197385098](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) **success**；实际新标签/资产已创建，区别于先前 v2.8.2 的 no-op |
| 产物完整性边界 | GitHub 展示三项资产；**本轮未独立完成解压和 `sha256sum -c`** |
| 待处理历史分支 | `docs/china-hosting-edgeone-pilot-20261020` 和 `fix/pr-aggregate-check-after-skipped-shard-20261022` 仍存在；未经补丁对比核验不删除 |
| 依赖/设备边界 | Registry Security Inventory 成功不等于私有 Dependabot 告警清零；Android 微信真机负责人报告 PASS，其余手机系统打印/离线矩阵未完整验收 |

本页是**日期快照**。后续合并会改变 `main`，不能直接沿用上述 SHA 的 CI/部署作为新提交证据。[Actions](https://github.com/kunlong-luo/pagevela/actions) · [Releases](https://github.com/kunlong-luo/pagevela/releases)。

## 已落实的工程修复

- **最新架构与文档：** [#308](https://github.com/kunlong-luo/pagevela/pull/308) 已正式合并并完成同 SHA CI/Pages/Release 闭环；[84/100 七维度复评](./ASSESSMENT_20261123.md) 已收录中英文文档索引。[#307](https://github.com/kunlong-luo/pagevela/pull/307) 的编辑器快捷键逻辑现已迁入独立 Hook，新增 Ctrl+S 真实浏览器回归与纯路由单元测试；**合并后 CI、Pages 和 Release no-op 均已通过**，详见 [快捷键架构说明](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)。
- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**v2.8.3 已于 2026-11-23 从 `501ca26` 首次创建标签和三项发布资产；后续 main 新 SHA 必须独立验收。**

## 尚未完成，不得写成通过

1. **v2.8.3 发布资产二进制完整性：** Release 文件和校验和清单均存在，但本轮尚未独立下载解压、执行逐项 SHA256 比对；本项不应勾选。
2. **本轮 PR 验收：** #310 已合并为 `16b11ff` 并完成同 SHA [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 和 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196)。[#311](https://github.com/kunlong-luo/pagevela/pull/311) 的单调 Auto Fit 已从同步后的 PR 头 `56ecc0e` 完整 CI [#45306184066](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066) success 后合并为 `e8fdda0`；**该新 main SHA 的独立 CI/Pages 尚待核对**。[#314](https://github.com/kunlong-luo/pagevela/pull/314) 的 Quick PDF 空白输出防护仍在 PR CI 验收，未合并；[#315](https://github.com/kunlong-luo/pagevela/pull/315) 是 #310 架构验收文档 PR，不能当作已合并。上述 #311/#314 不属于已发布的 v2.8.3 Release。
3. **Android 真机 #262：** 负责人报告微信真机总体 PASS；系统 Save-as-PDF、Chrome/Samsung/OEM、安装后 PWA 离线尚无完整独立矩阵。
4. **GitHub 私有安全告警 #298：** npm 注册表无公告不能证明私有 Dependabot 告警清零；旧 Workbox 依赖路径仍待研究。
5. **功能优化：** [#312](https://github.com/kunlong-luo/pagevela/issues/312) 的 Auto Fit 真正根据预览溢出闭环仍未实现；[#313](https://github.com/kunlong-luo/pagevela/issues/313) 的空白 PDF 防护必须完成 PR CI/上线验证后才能关闭。#282、#200、#115、#202 继续跟踪；工程评分保持 84/100。

## 本轮工程验收状态（2026-11-24）

| 范围 | 验收结果 |
| --- | --- |
| PR #310，合并 SHA `16b11ff` | **已完成**：main [CI #45305029314](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 和同 SHA [Pages #45307035196](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196) success |
| PR #311，合并 SHA `e8fdda0` | PR 最终头 [CI #45306184066](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066) success，**合并后新 main CI/Pages 待核对** |
| PR #314，Quick PDF 可靠性 | 新分支合并最新 main 后需要新头完整 PR CI、CodeQL/Security Inventory 和随后独立 main CI/Pages；**未发布** |
| PR #315，#310 架构文档验收 | [独立文档 PR](https://github.com/kunlong-luo/pagevela/pull/315) 开放中，需其自身检查/合并后另行核对 |

## 本轮功能优化与下一步

- [2026-11-24 功能优化路线图](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md) — 随已合并的 #311 纳入 main；单调收紧已修复，真实页数反馈闭环仍在 #312。
- [Quick PDF 空白生成防护开发说明](./PDF_EXPORT_FAILURE_SAFETY_20261124.md) — 空画布/2D Context/零页防护、失败自定义提示与剩余验收门禁。
- [#312](https://github.com/kunlong-luo/pagevela/issues/312) / [#313](https://github.com/kunlong-luo/pagevela/issues/313) — 后续真实溢出闭环与 PDF 错误反馈验收。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-23 84/100 工程复评](./ASSESSMENT_20261123.md) — 七维度评分、CI/Pages 证据、优先级和扣分。
- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
