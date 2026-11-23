# Pagevela 项目状态 / Project status

> **2026-11-23 追加核对：** [文档 PR #306](https://github.com/kunlong-luo/pagevela/pull/306) 已自动合并为 [`12a08ec`](https://github.com/kunlong-luo/pagevela/commit/12a08ec08695e093b280c602dd11f11c8ac429df)，最新头提交 [PR CI #45163891273](https://github.com/kunlong-luo/pagevela/actions/runs/45163891273) 成功，CodeQL 和注册表安全审计也通过；**同 SHA `main` CI #45166477620 尚在执行，Pages 与 Release 未在本次核对时确认**。最新已完成 **同 SHA CI→Pages→Release** 闭环的部署仍为 `84ae706`（详见下表），正式打包 v2.8.2 未改变。新增 [2026-11-23 复评 84/100](./ASSESSMENT_20261123.md) 以 `84ae706` 已部署基线评分，#307 尚未合并不计分。

> **核对日期：2026-11-23。** 这是人工复核的时间点，不是自动更新面板。核对现在的发布情况时，应重新打开 [main](https://github.com/kunlong-luo/pagevela/tree/main)、[Actions](https://github.com/kunlong-luo/pagevela/actions)、[Pages 部署](https://github.com/kunlong-luo/pagevela/actions/workflows/deploy.yml) 及 [Releases](https://github.com/kunlong-luo/pagevela/releases)。**源代码已合并、CI 通过、Pages 已部署和 Release 已打包是四件不同的事。**

## 本次已核对的版本、分支和交付

| 对象 | 截至本次核对的事实 | 证据与边界 |
| --- | --- | --- |
| 受保护的 `main` | [`84ae706`](https://github.com/kunlong-luo/pagevela/commit/84ae706823ee2f7175f11da2e07de5343ae7c430)；[文档 PR #305](https://github.com/kunlong-luo/pagevela/pull/305) 已于 2026-11-23 自动合并 | #305 最新头提交 `e4951c3` 的 [CI #45159967258](https://github.com/kunlong-luo/pagevela/actions/runs/45159967258) 全绿，包括 Chromium 离线测试、Firefox/WebKit 关键回归和最终 `build-and-test`；**不代表合并后的 main 已部署** |
| 最新已核对 `main` CI | [#45161614275](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275)，`84ae706` | **success**：quality、Chromium 全量（含生产 PWA 离线导航）、Firefox/WebKit 四个全量分片和最终 `build-and-test` 均成功 |
| 上一份 `main` 完整 CI | [#45159218348](https://github.com/kunlong-luo/pagevela/actions/runs/45159218348)，`8bc0a0a` | **success**（包含最终 `build-and-test`）；其触发的 [Pages #45161571611](https://github.com/kunlong-luo/pagevela/actions/runs/45161571611) 因 main 已推进到 `84ae706`，在 `Refuse superseded production upload` 处明确拒绝过期构建，**不是浏览器测试失败** |
| 最近一次**完整 CI 与 Pages 均成功**的已部署提交 | [`84ae706`](https://github.com/kunlong-luo/pagevela/commit/84ae706823ee2f7175f11da2e07de5343ae7c430) | [完整 CI #45161614275](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275) 成功，随后 [同 SHA Pages #45163532567](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567) 的 build 和 deploy 均成功；此前 `93a0941` 的 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45154252875) / [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45156598771) 历史记录保留 |
| 安全审计 | [#305 的 Security Inventory #45159967313](https://github.com/kunlong-luo/pagevela/actions/runs/45159967313) | 最新文档 PR 锁文件的 `pnpm audit --json --audit-level=low` 返回 **0 条 npm 注册表公告，退出码 0**；这不等于私有 GitHub Dependabot 告警已清零 |
| GitHub Release 工作流 | [#45163664593](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593)，`84ae706` | **success**：先确认完整 CI 与实际 Pages deploy 均为同 SHA success；检测到 `v2.8.2` 已发布，打包、打标签、上传附件步骤全部 **skipped**。此前失败的旧 Pages 触发的 [#45161668213](https://github.com/kunlong-luo/pagevela/actions/runs/45161668213) 也正确跳过 |
| 最新**正式打包** GitHub Release | [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，2026-10-25 | 尚无 v2.8.3 标签或新 ZIP/TAR；保持旧资产原样 |
| 尚未合并的 PR | **0**（截至本轮建文档草稿 PR 前） | #303、#304、#305 均已合并；本次状态补记单独建草稿 PR，未经完整验证不合并 |

## 已落实的工程修复

- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**新流程的首次合并后实际触发与跳过旧标签的行为尚需独立记录。**

## 尚未完成，不得写成通过

1. **发版门禁验收已完成（`84ae706`）：** [完整 CI #45161614275](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275)、[同 SHA Pages #45163532567](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567)、[Release #45163664593](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593) 均成功。已有 `v2.8.2` 的 tag / ZIP / TAR 不被重复生成或覆盖。**尚未验收**首次新稳定版本的实际打包及 checksum；本次文档补记还需走自己的 PR CI 和同 SHA Pages。
2. **安全告警与依赖现代化 [#298](https://github.com/kunlong-luo/pagevela/issues/298)：** 已有 npm 注册表审计结果；仍须以有权限的方式核对 GitHub Dependabot 私有告警，评估 Workbox `filelist → minimatch@5.1.9` 的成熟上游替代方案，不能盲目强制覆盖大版本。
3. **Android 真机 [#262](https://github.com/kunlong-luo/pagevela/issues/262)：** 负责人已报告 Android 微信整体 PASS；尚缺系统 Save-as-PDF/下载、非微信 Chrome/Samsung/OEM、离线 PWA 及逐设备可复现结果。
4. **产品与治理：** [架构 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[中文照片 #200](https://github.com/kunlong-luo/pagevela/issues/200)、[旧产品健康数据 #115](https://github.com/kunlong-luo/pagevela/issues/115) 和 [商标/站外平台 #202](https://github.com/kunlong-luo/pagevela/issues/202) 继续跟踪；不得虚构设备、流量、商标清查或第三方平台操作证据。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
