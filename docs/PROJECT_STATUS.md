# Pagevela 项目状态 / Project status

> **2026-11-23 继续核对：** [评分与文档 PR #308](https://github.com/kunlong-luo/pagevela/pull/308) 已合并为 [`077e649`](https://github.com/kunlong-luo/pagevela/commit/077e64991801b3f30b4b5cdb2e594ea3c278af36)；它的 [完整 CI #45172148513](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513)、[同 SHA Pages #45174090788](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788)（build/deploy）和 [Release #45174220771](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771)（成功检验并跳过已有 v2.8.2）**均成功**。随后 [编辑器快捷键 Hook #307](https://github.com/kunlong-luo/pagevela/pull/307) 已合并为 [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed)，合并前 [最新头 CI #45172316902](https://github.com/kunlong-luo/pagevela/actions/runs/45172316902) 全成功，**但合并后主分支 CI #45185347889 仍在执行，本次核对时未确认同 SHA Pages/Release**，不得把 PR CI 当成新部署。正式下载包仍是 `v2.8.2`。最近正式 [工程复评 84/100](./ASSESSMENT_20261123.md) 的评分是已验证工程基线的定性快照，**不因 #307 合并而未经复评提高分数**。

> **核对日期：2026-11-23。** 这是人工复核的时间点，不是自动更新面板。核对现在的发布情况时，应重新打开 [main](https://github.com/kunlong-luo/pagevela/tree/main)、[Actions](https://github.com/kunlong-luo/pagevela/actions)、[Pages 部署](https://github.com/kunlong-luo/pagevela/actions/workflows/deploy.yml) 及 [Releases](https://github.com/kunlong-luo/pagevela/releases)。**源代码已合并、CI 通过、Pages 已部署和 Release 已打包是四件不同的事。**

## 本次已核对的版本、分支和交付

| 对象 | 本次核对结论 | 证据与状态边界 |
| --- | --- | --- |
| 最新 `main` 代码 | [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed)，[#307](https://github.com/kunlong-luo/pagevela/pull/307) 已安全合并 | [PR 最新头 CI #45172316902](https://github.com/kunlong-luo/pagevela/actions/runs/45172316902) quality、Chromium 生产离线、Firefox/WebKit 关键回归和最终 `build-and-test` 全成功；**合并后 [main CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889) 进行中，尚不能称同 SHA 部署成功** |
| 最新完成同 SHA CI/Pages/Release 闭环的源码 | [`077e649`](https://github.com/kunlong-luo/pagevela/commit/077e64991801b3f30b4b5cdb2e594ea3c278af36)，[#308](https://github.com/kunlong-luo/pagevela/pull/308) 已合并 | [完整 main CI #45172148513](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513) quality + Chromium（含生产 PWA 离线）+ Firefox/WebKit 四个全量分片 + 最终汇总均成功；[Pages #45174090788](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788) build/deploy 均成功；[Release #45174220771](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771) 验证上游后成功跳过已有发行版本 |
| 上一份完整闭环 | [`12a08ec`](https://github.com/kunlong-luo/pagevela/commit/12a08ec08695e093b280c602dd11f11c8ac429df) | [CI #45166477620](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620) → [Pages #45168214368](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368) → [Release #45168339465](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465) 同 SHA 全成功；更早 `84ae706` 的 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275) / [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567) / [Release](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593) 历史亦保留 |
| GitHub 安全清单和 CodeQL | [#307 Security Inventory #45172316926](https://github.com/kunlong-luo/pagevela/actions/runs/45172316926) 及最新头 CodeQL | PR 级检查 success；Registry audit 与 GitHub 私有 Dependabot 告警属于不同覆盖范围，[#298](https://github.com/kunlong-luo/pagevela/issues/298) 仍待权限核查 |
| 正式已打包 GitHub Release | [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，2026-10-25 | **不是**后续 `main` 源码快照；没有新 v2.8.3 标签、附件或 checksum；旧 ZIP/TAR 保持不变 |
| 待处理后续文档 | 本次状态同步拟通过独立文档 PR | 必须核对其最新头提交 CI，合并后在其新 SHA 上再验收；文档分支不是生产部署 |

## 已落实的工程修复

- **最新架构与文档：** [#308](https://github.com/kunlong-luo/pagevela/pull/308) 已正式合并并完成同 SHA CI/Pages/Release 闭环；[84/100 七维度复评](./ASSESSMENT_20261123.md) 已收录中英文文档索引。[#307](https://github.com/kunlong-luo/pagevela/pull/307) 的编辑器快捷键逻辑现已迁入独立 Hook，新增 Ctrl+S 真实浏览器回归与纯路由单元测试；**合并后的生产验收尚待完成**，详见 [快捷键架构说明](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)。
- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**已有标签时的首次自动成功链已在 `84ae706` 与 `12a08ec` 独立复验；真正首次创建新稳定版本标签及归档的路径尚未验证。**

## 尚未完成，不得写成通过

1. **#307 合并后的生产闭环：** [主分支 `ac2932c` CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889) 正在执行；需逐项核对质量、Chromium 生产离线、Firefox/WebKit 四分片和最终 `build-and-test`，随后同 SHA Pages build/deploy 和 Release 的安全跳过。不能以 PR #307 的成功代替部署通过。
2. **本次项目状态文档自身的验收：** 文档 PR 需通过自己的最新头 CI、CodeQL、安全清单，合并后仍要核查新 main SHA 是否被 Pages 部署，不提前写为已上线。
3. **发版版本首次创建：** 目前仅验收“已有 v2.8.2 时正常安全跳过”；未单独验收真正新稳定版首次标签、ZIP/TAR、SHA256SUMS 的创建与验证。
4. **安全告警与依赖现代化 [#298](https://github.com/kunlong-luo/pagevela/issues/298)：** npm 注册表扫描不能证明私有 GitHub Dependabot 告警为零；Workbox `filelist → minimatch@5.1.9` 仍须研究稳定上游方案，不盲目跨 major 覆盖。
5. **Android 真机 [#262](https://github.com/kunlong-luo/pagevela/issues/262)：** 负责人已报告 Android 微信整体 PASS，尚缺独立系统 Save-as-PDF、Chrome/Samsung/OEM、PWA 离线和逐设备证据。
6. **其他长期工作：** [架构 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[照片 #200](https://github.com/kunlong-luo/pagevela/issues/200)、[健康数据 #115](https://github.com/kunlong-luo/pagevela/issues/115)、[品牌外部事项 #202](https://github.com/kunlong-luo/pagevela/issues/202) 继续按证据处理；本轮 84 分不自动提高。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-23 84/100 工程复评](./ASSESSMENT_20261123.md) — 七维度评分、CI/Pages 证据、优先级和扣分。\n- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
