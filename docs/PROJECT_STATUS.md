# Pagevela 项目状态 / Project status

> **2026-11-23 再核对：** [文档 PR #306](https://github.com/kunlong-luo/pagevela/pull/306) 已合并为 [`12a08ec`](https://github.com/kunlong-luo/pagevela/commit/12a08ec08695e093b280c602dd11f11c8ac429df)。对应 [完整主分支 CI #45166477620](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620)（质量、Chromium 生产 PWA 离线、Firefox/WebKit 全分片、最终 `build-and-test`）、[同 SHA Pages #45168214368](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368)（build/deploy）和 [Release #45168339465](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465)（验证上游后安全跳过已有 `v2.8.2`）**均成功**。正式下载包仍为 v2.8.2；新的 [2026-11-23 工程复评 84/100](./ASSESSMENT_20261123.md) 使用此完整上线基线。#307 快捷键拆分和 #308 本次评分 PR 均尚未合并，不计入上线成果。

> **核对日期：2026-11-23。** 这是人工复核的时间点，不是自动更新面板。核对现在的发布情况时，应重新打开 [main](https://github.com/kunlong-luo/pagevela/tree/main)、[Actions](https://github.com/kunlong-luo/pagevela/actions)、[Pages 部署](https://github.com/kunlong-luo/pagevela/actions/workflows/deploy.yml) 及 [Releases](https://github.com/kunlong-luo/pagevela/releases)。**源代码已合并、CI 通过、Pages 已部署和 Release 已打包是四件不同的事。**

## 本次已核对的版本、分支和交付

| 对象 | 2026-11-23 核对结论 | 证据与边界 |
| --- | --- | --- |
| 本轮 `main` 源码 | [`12a08ec`](https://github.com/kunlong-luo/pagevela/commit/12a08ec08695e093b280c602dd11f11c8ac429df)，[#306](https://github.com/kunlong-luo/pagevela/pull/306) 已于 2026-11-23 合并 | [#306 最新头提交 PR CI #45163891273](https://github.com/kunlong-luo/pagevela/actions/runs/45163891273) 全成功，且新主分支的完整验收已独立执行 |
| 同 SHA 主分支 CI | [#45166477620](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620)，`12a08ec` | **success**：quality、Chromium 全量及生产 PWA 离线导航、Firefox/WebKit 四个分片、最终 `build-and-test` 全通过 |
| 同 SHA 线上 Pages | [#45168214368](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368)，`12a08ec` | **success**：实际 `build` 和 `deploy` 均成功；这是当前已验证部署基线，不等于仍在 PR 阶段的文档/功能已上线 |
| 同 SHA GitHub Release 门禁 | [#45168339465](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465)，`12a08ec` | **success**：先核实当前 SHA 的 CI 和 Pages，随后检测到 `v2.8.2` 已发布；新 ZIP/TAR 打包、标签与上传均 **skipped**，旧包未覆盖 |
| 依赖安全审计 | [#306 Security Inventory #45163891326](https://github.com/kunlong-luo/pagevela/actions/runs/45163891326) 及 [#308 最新头提交审计](https://github.com/kunlong-luo/pagevela/actions/runs/45167548805) | 工作流成功；已核验的 npm 注册表审计为 0 条公告，**不代表私有 Dependabot 告警清零**；此项仍在 [#298](https://github.com/kunlong-luo/pagevela/issues/298) |
| 历史成功 CI/Pages/Release | [`84ae706` 完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275) → [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567) → [Release](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593) | 上一份同 SHA 完整闭环成功的记录；[更早 `8bc0a0a` Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45161571611) 因 main 已更新而正确拒绝过期构建，非 E2E 失败 |
| 正式已打包 Release | [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，2026-10-25 | **没有**新的 v2.8.3 标签、ZIP/TAR 或校验和；下载包不包括后续 `main` 文档更新 |
| 未合并 PR | [#307 快捷键架构拆分](https://github.com/kunlong-luo/pagevela/pull/307) 和 [#308 评分文档](https://github.com/kunlong-luo/pagevela/pull/308) | #307 完整 PR CI [#45165504001](https://github.com/kunlong-luo/pagevela/actions/runs/45165504001) 已成功但仍是草稿；#308 为本次文档 PR，尚须自己完成验收与部署 |

## 已落实的工程修复

- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**已有标签时的首次自动成功链已在 `84ae706` 与 `12a08ec` 独立复验；真正首次创建新稳定版本标签及归档的路径尚未验证。**

## 尚未完成，不得写成通过

1. **后续 PR 的独立生产闭环：** `12a08ec` 的 CI、Pages、Release 已完成。若 #308 报告或 #307 模块拆分合并，则都必须在其**新合并 SHA** 上重新执行完整 main CI、Pages deploy 和 Release no-op；旧提交的成功不代替新提交的验证。
2. **发行首次新版本流程：** 仅验证了发布标签已存在时的自动安全跳过；尚未独立证明新 `X.Y.Z` 标签的首次打包、ZIP/TAR 和 SHA256SUMS 提交成功。不能提前记为通过。
3. **安全告警与依赖现代化 [#298](https://github.com/kunlong-luo/pagevela/issues/298)：** npm 注册表审计为 0 条公告，但没有获准读取 GitHub 私有 Dependabot 告警清单；Workbox `filelist → minimatch@5.1.9` 仍须寻找稳定上游替代，不盲目强制跨 major 版本覆盖。
4. **Android 真机 [#262](https://github.com/kunlong-luo/pagevela/issues/262)：** 负责人报告 Android 微信整体 PASS；实际系统 Save-as-PDF、非微信 Chrome/Samsung/OEM、PWA 离线与具体设备矩阵尚未全面独立采集。
5. **产品与治理：** [架构 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[照片 #200](https://github.com/kunlong-luo/pagevela/issues/200)、[健康数据 #115](https://github.com/kunlong-luo/pagevela/issues/115)、[站外品牌 #202](https://github.com/kunlong-luo/pagevela/issues/202) 持续跟踪。当前工程评分 [84/100](./ASSESSMENT_20261123.md)，不代表所有用户/设备/依赖风险已关闭。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-23 84/100 工程复评](./ASSESSMENT_20261123.md) — 七维度评分、CI/Pages 证据、优先级和扣分。\n- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
