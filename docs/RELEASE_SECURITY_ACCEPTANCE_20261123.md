# Pagevela 发布与安全验收台账 / 2026-11-23

> **2026-11-24 补充：** 本文下方 11 月 23 日候选版判断属**历史时间点**，已由 [v2.8.3 正式发布验收](./V2_8_3_RELEASE_ACCEPTANCE_20261123.md) 更新：main `501ca26` 的 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125)、[同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172)、[Release](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) success；v2.8.3 annotated tag 指向该 SHA，ZIP/TAR/SHA256SUMS 三项资产存在。**解压与独立 SHA256 比对未做**；不擅自修改下方历史验收流水。

> **证据驱动快照。** 本页记录已观察到的 GitHub Actions 与提交，日期后的新提交必须重新验收。**CI success ≠ Pages deploy success ≠ GitHub Release published**，下文三者分开记录。

## 工程里程碑

| PR / SHA | 已交付变更 | 直接证据 |
| --- | --- | --- |
| [#292](https://github.com/kunlong-luo/pagevela/pull/292)、[#293](https://github.com/kunlong-luo/pagevela/pull/293) | 分栏双击复位修复、草稿历史写入协调 | [#292 主分支 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45021860745) 与 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45022812621)，后续回归也已通过 |
| [#300](https://github.com/kunlong-luo/pagevela/pull/300)、[#301](https://github.com/kunlong-luo/pagevela/pull/301) | 修补 minimatch v10 与 Workbox glob；恢复生产 PWA 预缓存及离线导航测试 | [main `37bb6ae` CI](https://github.com/kunlong-luo/pagevela/actions/runs/45142496880) + [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45144232065) |
| [#303](https://github.com/kunlong-luo/pagevela/pull/303) → [`93a0941`](https://github.com/kunlong-luo/pagevela/commit/93a0941afc6d782c549caa848e0798fc6509c44b) | 发布包 PWA 预缓存/性能/类型门禁；每周、手动、PR 的 npm 只读依赖清单 | [full main CI #45154252875](https://github.com/kunlong-luo/pagevela/actions/runs/45154252875)、[Pages #45156598771](https://github.com/kunlong-luo/pagevela/actions/runs/45156598771)、[audit #45154252948](https://github.com/kunlong-luo/pagevela/actions/runs/45154252948) 全成功 |
| [#304](https://github.com/kunlong-luo/pagevela/pull/304) → [`8bc0a0a`](https://github.com/kunlong-luo/pagevela/commit/8bc0a0aaab4d0a885b5a8d3ec25bca19ac58a15d) | 新 Release 必须等待成功 CI + 同 SHA Pages；禁止覆盖旧标签与发布资产 | [PR CI #45156899016](https://github.com/kunlong-luo/pagevela/actions/runs/45156899016) 及 [main CI #45159218348](https://github.com/kunlong-luo/pagevela/actions/runs/45159218348) **全部成功**；[Pages #45161571611](https://github.com/kunlong-luo/pagevela/actions/runs/45161571611) 因 `main` 先进到 `84ae706` 被防过期门禁阻止，原 SHA 未上线；关联 Release 未发布资产 |
| [#305](https://github.com/kunlong-luo/pagevela/pull/305) → [`84ae706`](https://github.com/kunlong-luo/pagevela/commit/84ae706823ee2f7175f11da2e07de5343ae7c430) | 发布指南与中英文 README 更新、历史状态归档、证据台账及安全策略同步 | [PR CI #45159967258](https://github.com/kunlong-luo/pagevela/actions/runs/45159967258)、[安全审计 #45159967313](https://github.com/kunlong-luo/pagevela/actions/runs/45159967313)、CodeQL 均成功；[main CI #45161614275](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275) success、[同 SHA Pages #45163532567](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567) build / deploy success；[Release #45163664593](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593) success 且明确跳过已发布 `v2.8.2` 的新标签、压缩包与附件上传；先前失败 Pages 触发的 [#45161668213](https://github.com/kunlong-luo/pagevela/actions/runs/45161668213) 也正确 skipped |
| [#306](https://github.com/kunlong-luo/pagevela/pull/306) → [`12a08ec`](https://github.com/kunlong-luo/pagevela/commit/12a08ec08695e093b280c602dd11f11c8ac429df) | 项目状态、发布指南、上一轮验收台账同步；在完整 PR 测试通过后合并 | [PR CI #45163891273](https://github.com/kunlong-luo/pagevela/actions/runs/45163891273) 全成功；[main CI #45166477620](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620) quality、Chromium 生产 PWA 离线、Firefox/WebKit 全分片及最终 `build-and-test` 成功；[同 SHA Pages #45168214368](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368) 的 build/deploy 成功；[Release #45168339465](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465) 校验上游成功并安全跳过 `v2.8.2` 已发布资产 |
| [#308](https://github.com/kunlong-luo/pagevela/pull/308) → [`077e649`](https://github.com/kunlong-luo/pagevela/commit/077e64991801b3f30b4b5cdb2e594ea3c278af36) | 七维度 84 分工程复评、项目状态、发布台账和中英文文档入口一致化 | [PR CI #45169454879](https://github.com/kunlong-luo/pagevela/actions/runs/45169454879) success；[完整 main CI #45172148513](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513) 全量浏览器分片及生产 PWA 离线 success；[同 SHA Pages #45174090788](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788) build/deploy success；[Release #45174220771](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771) 校验门禁成功并跳过 v2.8.2 历史资产 |
| [#307](https://github.com/kunlong-luo/pagevela/pull/307) → [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed) | 快捷键全局监听抽成独立 Hook，保留手动草稿存储 / ATS 打印 / Auto Fit 行为并补单元及 Ctrl+S 端到端测试 | [最新头 PR CI #45172316902](https://github.com/kunlong-luo/pagevela/actions/runs/45172316902) 全通过、CodeQL 和 Security Inventory 成功；**合并后 [CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889)、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398) build/deploy、[Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214) 均 success，旧 v2.8.2 资产保留** |

## 验收边界

### PWA / PDF / 设备

- `dist/sw.js` 的预缓存保护要求有 `index.html` 与编译 JS/CSS；生产 Chromium 测试验证安装 SW 后的离线编辑路由导航。#301 对应 PWA 缺失预缓存的真实回归已经被 CI 检出并修复。
- 原有 PDF 文件解析、文本有效性及导出后草稿保存测试随全量 CI 验证；但桌面浏览器自动化不能替代真实 Android 系统 Print / Save as PDF、微信内置浏览器下载或首次安装后的离线 PDF 导出。
- 用户明确报告 Android 微信**总体真机通过**，这是负责人的测试结果而非本次独立采集的设备矩阵。其余项仍记录在 [#262](https://github.com/kunlong-luo/pagevela/issues/262)。

### 依赖与安全

- 现行 pnpm override 为受影响的 `minimatch >=7 <11.0.1 → 11.0.9`，以及 `workbox-build@7.4.1>glob → 14.0.3`；为 `filelist` 旧 API 暂保留构建期 `minimatch@5.1.9`。该 v5 **不在当初 v10 GHSA 的受影响区间**。
- [#302](https://github.com/kunlong-luo/pagevela/issues/302) 的 glob 漏洞修复已完成并关闭。有关 deepmerge 的 GHSA 后来被撤销，未把撤销公告算作开放安全漏洞。
- [Security Inventory #45154252948](https://github.com/kunlong-luo/pagevela/actions/runs/45154252948)：在 `93a0941` 锁文件上，`pnpm audit --json --audit-level=low` **0 条公告 / exit 0**，有 JSON artifact。这只证明那次 npm 注册表审计结果；它不会列出权限受限的 GitHub Dependabot 私有告警，也不保证未来不会出现漏洞。
- **待办 [#298](https://github.com/kunlong-luo/pagevela/issues/298)：** 获得权限后实际核对 GitHub Alerts；研究稳定上游 PWA/Workbox 替代，不使用不兼容的全局 major override。

### 发行标签与归档

- 最新实际正式 Release 仍是 [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，对应历史 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/40202793334) 和 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/40203720040)。其 ZIP/TAR/校验和不受本次源码合并影响。
- [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将未来发布顺序改为 `CI (main push) → Deploy Pages (CI successful) → Release (Pages successful)`，`Release` 会额外校验两个工作流最终任务的结果、当前 SHA、冻结依赖图、预缓存和性能，并拒绝 `--clobber`。**`84ae706`、`12a08ec`、`077e649`、`ac2932c` 均已验证成功链路会安全跳过已发布的 `v2.8.2` 标签/归档；真正首次创建新版本的路径仍无实际新标签运行证据，不能把“安全跳过”误记成“已成功打包新版本”。**

## 后续完成条件

- [x] `8bc0a0a` [main-push CI #45159218348](https://github.com/kunlong-luo/pagevela/actions/runs/45159218348) 全部 job 成功（含最终 `build-and-test`）；其 Pages 因 main 已更新到 `84ae706` 而正确拒绝过期构建，不将此记录为部署成功。
- [x] [Release #45161668213](https://github.com/kunlong-luo/pagevela/actions/runs/45161668213) 在上游 Pages 失败后被跳过；未提前打标签或覆盖历史附件。
- [x] `84ae706` 的 [main CI #45161614275](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275) 全部通过（包含最终 `build-and-test`）；[Pages #45163532567](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567) 同 SHA build 和 deploy 成功；[Release #45163664593](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593) 验证上游后正确跳过已有 `v2.8.2` 的打包、标签和上传。
- [x] 文档 PR #306 [PR CI #45163891273](https://github.com/kunlong-luo/pagevela/actions/runs/45163891273)、合并后的 `12a08ec` [完整 main CI #45166477620](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620)、[Pages build/deploy #45168214368](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368) 与 [Release 成功安全跳过 #45168339465](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465) 全部核对。
- [x] [评分 PR #308](https://github.com/kunlong-luo/pagevela/pull/308) 合并后的 `077e649` [完整 main CI #45172148513](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513)、[同 SHA Pages #45174090788](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788)、[Release #45174220771](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771) 全成功，已有 v2.8.2 安全跳过。
- [x] [#307](https://github.com/kunlong-luo/pagevela/pull/307) 合并后 `ac2932c` 的 [CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889)、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398) 和 [Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214) 均完成，已发布 v2.8.2 安全跳过。
- [x] v2.8.3 [版本更新 #309](https://github.com/kunlong-luo/pagevela/pull/309) 已合并，main `501ca26` 的 CI、Pages、Release success，首次 tag 和 ZIP/TAR/SHA256SUMS 均已存在（11/24 补充核对）。
- [ ] v2.8.3 产物的实际下载解压与独立 SHA256 比对未在本轮执行；见 [验收清单](./V2_8_3_RELEASE_ACCEPTANCE_20261123.md)。
- [ ] 后续有实际版本升级时，核验成功 CI → Pages → Release 的完整证据及 ZIP/TAR/SHA256SUMS 校验结果。
- [ ] [#298](https://github.com/kunlong-luo/pagevela/issues/298) 私有 Dependabot 告警核查；[#262](https://github.com/kunlong-luo/pagevela/issues/262) Android 专项；[#202](https://github.com/kunlong-luo/pagevela/issues/202) 商标与站外平台审核；[#282](https://github.com/kunlong-luo/pagevela/issues/282) 编辑器/Store/导出模块渐进拆分。

[项目状态](./PROJECT_STATUS.md) · [发布操作](../RELEASING.md) · [安全策略](../SECURITY.md) · [最新 84/100 工程复评](./ASSESSMENT_20261123.md) · [历史 76/100 评估](./ASSESSMENT_20261122.md)
