# Pagevela 项目状态 / Project status

### 2026-11-24 已验证主分支交付 / Verified main delivery

- `main` `202bcead397ef9c3ef77d6f83f7ee715a6dfd4ee`：[完整 CI #45324490754](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) **success**，覆盖 quality、Chromium 全量、Firefox 2/2、WebKit 2/2、跨浏览器汇总以及实际执行的 protected `build-and-test`；[同 SHA Pages #45326859873](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) 的 **build/deploy 均 success**。
- [Release 工作流 #45326978990](https://github.com/kunlong-luo/pagevela/actions/runs/45326978990) **success**，但复用发布门禁并没有创建新包：最新正式 Release 仍为 **v2.8.3**，tag `501ca26`，ZIP/TAR.GZ 不追溯包含 `202bcea` 之后的功能。
- [#317](https://github.com/kunlong-luo/pagevela/pull/317) 的 CI 防跳过保护和 [#318](https://github.com/kunlong-luo/pagevela/pull/318) 的九份文档已随 `202bcea` 取得线上同 SHA 验收。此前 `6532c57` 的 CI **failure** 与 Pages **skipped** 是另一个提交的历史记录，不能覆盖。
- [#319](https://github.com/kunlong-luo/pagevela/pull/319) Auto Fit 一键恢复：最新 PR 头 `f0e94a9` 的[完整 CI #45327296976](https://github.com/kunlong-luo/pagevela/actions/runs/45327296976) **success**（quality、Chromium、Firefox/WebKit、实际执行的 `build-and-test`），且已通过 squash 合并为 `main` **`db8919f49d4866796809bda5f2e3fe3cc4a2cdc8`**。但 [新 main CI #45334379703](https://github.com/kunlong-luo/pagevela/actions/runs/45334379703) 于 2026-11-24 05:35 UTC 触发；记录本快照时仍在执行，**该 SHA 的同 SHA Pages 尚未验收**，不可写成已上线。正式归档仍是 v2.8.3，[#312](https://github.com/kunlong-luo/pagevela/issues/312) 继续开放；评分维持 **84/100**。

> **更新日期：2026-11-24。** 最新正式发布版本是 [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)；其 tag 解析到 `501ca26a10a023f1a05ce3ce227b288a2a6565d4`（短 SHA `501ca26`）。该 SHA 的 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125)、[Pages build/deploy](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) 与 [Release](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) 均为 **success**；Release 于 **2026-11-23 14:44 UTC** 发布。三个资产 `pagevela-2.8.3.zip`、`pagevela-2.8.3.tar.gz`、`SHA256SUMS.txt` 均出现在 GitHub Release 中。**本次核对未独立下载解压二进制包并逐项比对 SHA256**；不可将“资产存在”写成“校验通过”。

> **2026-11-24 最近一次已验证部署的 main：** `202bcead397ef9c3ef77d6f83f7ee715a6dfd4ee`，[完整 CI #45324490754](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) 与 [同 SHA Pages #45326859873](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) **success**。其后 #319 已合并为 `db8919f`，仍需新 main CI/Pages 验收；正式下载版本保持 **v2.8.3**，工程评分 **84/100**。下文 #316/#317 的 pending 和失败描述保留为当时的历史快照。

## 历史验收快照：#317 合并时的主分支状态（已由上方最新验收更新）

| 检查对象 | 当前确认状态 |
| --- | --- |
| 本轮代码和文档 | [PR #317](https://github.com/kunlong-luo/pagevela/pull/317) 在 2026-11-24 03:53:59 UTC 合并；新 `main` 为 `e00bcbd8fda9a7f1b59d3ef926d9df9f2b7a43e2` |
| #317 最新头 `6605324` | [完整 PR CI #45320641952](https://github.com/kunlong-luo/pagevela/actions/runs/45320641952) **success**：quality、Chromium（含生产 PWA 离线导航）、Firefox/WebKit 关键测试和实际执行的 `build-and-test`；CodeQL 成功 |
| #316 上一主分支 `6532c57` | [完整 main CI #45320068534](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) **failure**：Chromium、Firefox 1/2、WebKit 1/2 的旧桌面 Auto Fit aria-label 断言失败；[同 SHA Pages #45321277493](https://github.com/kunlong-luo/pagevela/actions/runs/45321277493) **skipped**，不能写为已部署 |
| 新主分支 `e00bcbd` | [完整 main CI #45322638640](https://github.com/kunlong-luo/pagevela/actions/runs/45322638640) **执行中（本次记录时）**；尚未获得新 SHA 的最终汇总及同 SHA Pages 成功记录 |
| 保护规则修复 | 旧 `build-and-test` 因前置失败而 skipped，误满足仅要求汇总任务的 main 规则；#317 将其改为 `if: always()` 且在 job step 明确检查 quality、Chromium、cross-browser，任何一项非 success 必须失败。**已通过 PR CI，合并后主分支行为仍待最终 CI 验证** |
| 正式 Release | [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3) 保持在 `501ca26`；此后功能未包含在该版本压缩包 |
| 剩余任务 | [#312](https://github.com/kunlong-luo/pagevela/issues/312) 仍开放：Auto Fit 适配前布局恢复、隐藏预览移动端、A4/Letter 与中英文模板、实际 Android 系统打印/PWA；定性评分仍 **84/100** |

> 上面记录的成功与失败严格按 SHA 区分。发布流水线只有在**新 main 的完整 CI 和相同 SHA Pages 都 success**后才可列为线上交付；不以 PR CI success 或旧 Pages success 替代。

## 2026-11-24 #316 合并后验收阻断（历史失败快照）

- **此前受阻的 main：** [PR #316](https://github.com/kunlong-luo/pagevela/pull/316) 已于 **2026-11-24 03:31 UTC** 自动合并为 `6532c570b852b0284359d73e7c00632571ef04fb`，与最近一次确认同 SHA Pages 的 `12c7044` 不同。GitHub 的合并事实不代表浏览器 CI 门禁全部通过。
- **PR 头 `5485b15`：** [CI #45318654364](https://github.com/kunlong-luo/pagevela/actions/runs/45318654364) **failure**：quality、Firefox/WebKit critical 成功，Chromium 全量 **222 passed / 1 failed / 1 skipped**，失败为 `e2e/mobile-four-primary-actions.e2e.ts:98` 使用旧 `Auto fit to single page` 断言，与新版桌面 `Fit to selected page target` 按钮可访问名称不符。最终 `build-and-test` 未形成完整通过的验收链。
- **历史失败主分支：** [CI #45320068534](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) 最终 **failure**，相同 SHA 的 [Pages #45321277493](https://github.com/kunlong-luo/pagevela/actions/runs/45321277493) 为 **skipped**。PR #317 修复旧桌面 E2E 断言和汇总门禁，已合并为新 main `e00bcbd`；新 SHA 的验收以本文上方表格为准。
- **CI 保护根因：** [规则集 Protect main](https://github.com/kunlong-luo/pagevela/rules/23971861) 只要求 `build-and-test`；旧工作流在 Chromium 失败时将该汇总 job 跳过，被保护规则视为满足。热修复将该 job 改为 `always()` 真正运行，并对任意前置 job 非 success 明确报错，避免红测时再次自动合并。
- **发布与未结项：** 正式 GitHub Release 仍是 v2.8.3 `501ca26`；[#312](https://github.com/kunlong-luo/pagevela/issues/312) 已重新开放，继续跟踪撤销 UX、隐藏预览/移动端真实测量及扩展设备矩阵；工程评分 **84/100** 不提高。

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
2. **历史交付基线：** #310/#311/#315/#314 已合并；此前已验收主分支 `12c7044` [完整 CI #45312509947](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947) 和 [同 SHA Pages #45313889157](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) 全部 success。#313 已关闭。#316 已合并但其最初主分支 CI 失败；#317 已修复并合并为新 main `e00bcbd`，新 main CI/Pages 仍须独立成功，详见最新验收表。
3. **Android 真机 #262：** 负责人报告微信真机总体 PASS；系统 Save-as-PDF、Chrome/Samsung/OEM、安装后 PWA 离线尚无完整独立矩阵。
4. **GitHub 私有安全告警 #298：** npm 注册表无公告不能证明私有 Dependabot 告警清零；旧 Workbox 依赖路径仍待研究。
5. **功能优化：** [#312](https://github.com/kunlong-luo/pagevela/issues/312) 的 1/2/3 页测量式 Auto Fit 已合并 [PR #316](https://github.com/kunlong-luo/pagevela/pull/316)；仍需修复旧 E2E 断言、取得新 main 同 SHA CI/Pages 及补完撤销 UX 和 A4/Letter 中英文手机验收。#282、#200、#115、#202 继续跟踪；84/100 暂不调整。

## 本轮工程验收状态（2026-11-24）

| 范围 | 验收结果 |
| --- | --- |
| PR #310，合并 SHA `16b11ff` | **已完成**：main [CI #45305029314](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 和同 SHA [Pages #45307035196](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196) success |
| PR #311，合并 SHA `e8fdda0` | PR 最新头 [CI #45306184066](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066) success；含该修复的最新 main `d0d5486` [CI #45309378710](https://github.com/kunlong-luo/pagevela/actions/runs/45309378710) 与 [Pages #45310525156](https://github.com/kunlong-luo/pagevela/actions/runs/45310525156) same-SHA success |
| PR #314，合并 SHA `12c7044` | **已验收**：最新头 [PR CI #45311296133](https://github.com/kunlong-luo/pagevela/actions/runs/45311296133)、新 main [CI #45312509947](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947)、同 SHA [Pages #45313889157](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) success；#313 已关闭 |
| PR #315，合并 SHA `d0d5486` | 双语文档与工程验收已合并；其 [PR CI #45307976280](https://github.com/kunlong-luo/pagevela/actions/runs/45307976280)、新 main [CI #45309378710](https://github.com/kunlong-luo/pagevela/actions/runs/45309378710) 和 [同 SHA Pages #45310525156](https://github.com/kunlong-luo/pagevela/actions/runs/45310525156) success |

## 2026-11-24 最新 CI/Pages 快照

- 历史最近一次已验证同 SHA Pages 的 main `12c7044c2584d25d0d2c94b3a74fb78330dbd407`：[完整 CI #45312509947](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947)（quality、Chromium、Firefox/WebKit 全部分片、最终 `build-and-test`）及同 SHA [Pages #45313889157](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) 均成功。该提交包括 #310、#311、#315 与 #314。
- [Release workflow #45313984785](https://github.com/kunlong-luo/pagevela/actions/runs/45313984785) 成功只是工作流结果，**最新正式 GitHub Release 仍是 v2.8.3**，没有新的 v2.8.4 发布附件；历史包不包含新 main。
- [PR #316](https://github.com/kunlong-luo/pagevela/pull/316) 已合并为 `6532c57`，统一预览/工具栏/快捷键并按实际溢出量适配 1/2/3 页（最多 24 次）；最后 PR Chromium 测试失败、同 SHA Pages 未验收，故**不能称作已完成线上发布验收**。扩展中英文/真机矩阵和可撤销性仍需继续。
- [PDF #313](https://github.com/kunlong-luo/pagevela/issues/313) scoped fix 已完成；操作系统下载完成、Android 实机系统打印仍不属于此项证明范围。

## 历史 main `d0d5486` 验收（由后续 `12c7044` supersede）

- 合并后主分支 `d0d5486da14459d5b4c1df886afea08f38a71827` 的 [CI #45309378710](https://github.com/kunlong-luo/pagevela/actions/runs/45309378710)：quality、完整 Chromium、Firefox 2/2、WebKit 2/2、跨浏览器汇总与最终 `build-and-test` **全部通过**。
- 同 SHA [Pages #45310525156](https://github.com/kunlong-luo/pagevela/actions/runs/45310525156)：build 和 deploy **成功**；[Release workflow #45310641741](https://github.com/kunlong-luo/pagevela/actions/runs/45310641741) success 为新提交执行了流程，但**未产生新版本 tag，最新正式发行仍为 v2.8.3**。
- 此历史 main `d0d5486` 包含 #310、#311、#315，但**不含** #314；最新已部署的 main `12c7044` 已包含 #314，参见上方最新 CI/Pages 快照。

## 本轮功能优化与下一步

- [2026-11-24 功能优化路线图](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md) — 随已合并的 #311 纳入 main；单调收紧已修复，真实页数反馈闭环仍在 #312。
- [Quick PDF 空白生成防护开发说明](./PDF_EXPORT_FAILURE_SAFETY_20261124.md) — 空画布/2D Context/零页防护、失败自定义提示与剩余验收门禁。
- [#312](https://github.com/kunlong-luo/pagevela/issues/312) / [#313](https://github.com/kunlong-luo/pagevela/issues/313) — 后续真实溢出闭环与 PDF 错误反馈验收。

- [测量式 Auto Fit 阶段开发说明](./MEASURED_AUTO_FIT_20261124.md) — #316 的实现范围、测试及剩余风险。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-23 84/100 工程复评](./ASSESSMENT_20261123.md) — 七维度评分、CI/Pages 证据、优先级和扣分。
- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
