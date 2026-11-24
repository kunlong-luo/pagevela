# Pagevela engineering acceptance / 2026-11-24

## New merged feature gate — cross-tab conflict recovery (#323)

- [#323](https://github.com/kunlong-luo/pagevela/pull/323) latest head `14520f0` [PR CI #45367991566](https://github.com/kunlong-luo/pagevela/actions/runs/45367991566) **success** (quality, full Chromium including two-tab rescue test, Firefox/WebKit critical, protected `build-and-test` actually executed). Auto-merged as **main `da3b68bc6c45db666e9c3ba47ce55e2ab73d7e80`**.
- **Required new-main gates remain separate:** [main CI #45370012956](https://github.com/kunlong-luo/pagevela/actions/runs/45370012956) is running at this checkpoint, and same-SHA Pages still requires explicit success. Do not increase privacy/reliability or claim online protection based on successful PR CI alone. **Verified score remains 87/100**.
- #324 documentation-only main `de81022` already passed [full CI](https://github.com/kunlong-luo/pagevela/actions/runs/45367413632) plus [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45369451198); it did not change the score. #325 same-ms primary-key defense is a separate open candidate. Older #323 candidate statuses below are historical records.

## Latest same-SHA acceptance — 2026-11-24 · main `8150287`

- **[PR #322](https://github.com/kunlong-luo/pagevela/pull/322)** settings sanitizer pure module and corruption/market tests merged as `9a634df8a95b8069c2b44ea03577b79d945af227`; [main CI #45360517751](https://github.com/kunlong-luo/pagevela/actions/runs/45360517751) **success** (all browser shards + executed `build-and-test`) and [same-SHA Pages #45362570879](https://github.com/kunlong-luo/pagevela/actions/runs/45362570879) **build/deploy success**.
- **[PR #321](https://github.com/kunlong-luo/pagevela/pull/321)** pairwise Auto Fit A4/Letter, 1/3-page, Chinese/English and two-column E2E plus honest Estimated Fit copy merged as `8150287513fccb28de80d409875b0ea04bcd1edf`; [main CI #45362921101](https://github.com/kunlong-luo/pagevela/actions/runs/45362921101) **success** (quality, full Chromium, Firefox/WebKit 4/4, cross-browser summary and executed protected `build-and-test`); [same-SHA Pages #45364809316](https://github.com/kunlong-luo/pagevela/actions/runs/45364809316) build/deploy **success**.
- **[Latest engineering reassessment 87/100](./ASSESSMENT_20261124_R2.md)** counts **+1 architecture** only for the independently deployed #322 extraction relative to historical [86/100](./ASSESSMENT_20261124.md). #321 strengthens coverage but does not substitute real Android/OS-print/release-archive checks.
- **[PR #323](https://github.com/kunlong-luo/pagevela/pull/323)** cross-tab active resume conflict guard is **candidate only**; [older head CI #45362557789](https://github.com/kunlong-luo/pagevela/actions/runs/45362557789) **failure** on user-visible recovery Toast despite persisted conflict drafts. Candidate fixes must pass latest PR-head CI and post-merge same-SHA CI/Pages before any safety claim or added points. Stable downloadable release remains **v2.8.3** (tag `501ca26`); do not backport post-tag changes into old assets.

# Pagevela engineering acceptance / 2026-11-24

## Acceptance follow-up: merged documentation release `de81022b` (2026-11-24)

- [#324](https://github.com/kunlong-luo/pagevela/pull/324) was **merged** as `de81022b8ec4e1a9a041ae1c684266dd326b257b`; [full independent main CI #45367413632](https://github.com/kunlong-luo/pagevela/actions/runs/45367413632) **success** (quality, full Chromium, Firefox 2/2, WebKit 2/2, cross-browser summary and protected `build-and-test` **actually executed**); [identical-SHA Pages #45369451198](https://github.com/kunlong-luo/pagevela/actions/runs/45369451198) **build and deploy success**. No new tagged Release or ZIP/TAR has been created.
- The [87/100 score](./ASSESSMENT_20261124_R2.md) remains evidence-based on deployed #321/#322 features. A documentation-only merge is *not* another point. [Earlier 86/100 report](./ASSESSMENT_20261124.md) remains historical.
- [#323](https://github.com/kunlong-luo/pagevela/pull/323): stale-tab transaction/conflict-draft recovery candidate remains **OPEN and unscored**. Its previous [CI #45365050460](https://github.com/kunlong-luo/pagevela/actions/runs/45365050460) failed the Chromium two-tab E2E because the persistent Toast blocked layout clicks; the newer candidate moves that persistent warning to bottom-left with a nonblocking card and interactive close button, requiring latest-head Chromium + Firefox/WebKit + actual `build-and-test`, then new main SHA CI/Pages. Do not credit the previous failing run.
- [#325](https://github.com/kunlong-luo/pagevela/pull/325): same-millisecond `profile_${Date.now()}` collision prevention for create/duplicate, preserving stored IDs and schema. [Latest CI #45368197300](https://github.com/kunlong-luo/pagevela/actions/runs/45368197300) was **still in progress** at the time of this snapshot; no merge/production acceptance or additional scoring yet.
- Real Android OS Print/Save-as-PDF and installed PWA, legacy already-open tabs, photo/profile metadata recovery, private alert #298, and v2.8.3 archive independent SHA verification remain outstanding. This is a dated verification ledger, **not a live CI dashboard**.


## Latest verified delivery / 最新同 SHA 验收

- **`main` `63edf034b6fd82cca81a30e91eb10b39c59b4aed`**：[CI #45336130078](https://github.com/kunlong-luo/pagevela/actions/runs/45336130078) success（quality、Chromium 全量、Firefox 2/2、WebKit 2/2、cross-browser、实际执行并成功的 `build-and-test`）；[same-SHA Pages #45337438957](https://github.com/kunlong-luo/pagevela/actions/runs/45337438957) build/deploy success；[Release workflow #45337558274](https://github.com/kunlong-luo/pagevela/actions/runs/45337558274) success，**没有生成新稳定版本**，正式发行保持 v2.8.3。
- [新独立工程复评 86/100](./ASSESSMENT_20261124.md) 仅给已验证交付的产品功能与 Hook 模块化各增加 1 分；新 E2E 组合矩阵和更准确的预计分页文案尚为 PR 候选，未纳入本次分数。
- 下方 #319 合并时“main CI pending”及 84 分为当时快照，不是本节的最新状态。新代码 PR 仍须**重新**验证，不复用 `63edf034` 的成功记录。



### 2026-11-24 已验证主分支交付 / Verified main delivery

- `main` `202bcead397ef9c3ef77d6f83f7ee715a6dfd4ee`：[完整 CI #45324490754](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) **success**，覆盖 quality、Chromium 全量、Firefox 2/2、WebKit 2/2、跨浏览器汇总以及实际执行的 protected `build-and-test`；[同 SHA Pages #45326859873](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) 的 **build/deploy 均 success**。
- [Release 工作流 #45326978990](https://github.com/kunlong-luo/pagevela/actions/runs/45326978990) **success**，但复用发布门禁并没有创建新包：最新正式 Release 仍为 **v2.8.3**，tag `501ca26`，ZIP/TAR.GZ 不追溯包含 `202bcea` 之后的功能。
- [#317](https://github.com/kunlong-luo/pagevela/pull/317) 的 CI 防跳过保护和 [#318](https://github.com/kunlong-luo/pagevela/pull/318) 的九份文档已随 `202bcea` 取得线上同 SHA 验收。此前 `6532c57` 的 CI **failure** 与 Pages **skipped** 是另一个提交的历史记录，不能覆盖。
- [#319](https://github.com/kunlong-luo/pagevela/pull/319) Auto Fit 一键恢复：最新 PR 头 `f0e94a9` 的[完整 CI #45327296976](https://github.com/kunlong-luo/pagevela/actions/runs/45327296976) **success**（quality、Chromium、Firefox/WebKit、实际执行的 `build-and-test`），且已通过 squash 合并为 `main` **`db8919f49d4866796809bda5f2e3fe3cc4a2cdc8`**。但 [新 main CI #45334379703](https://github.com/kunlong-luo/pagevela/actions/runs/45334379703) 于 2026-11-24 05:35 UTC 触发；记录本快照时仍在执行，**该 SHA 的同 SHA Pages 尚未验收**，不可写成已上线。正式归档仍是 v2.8.3，[#312](https://github.com/kunlong-luo/pagevela/issues/312) 继续开放；评分维持 **84/100**。

> **验收台账，非实时 CI 面板。** 日期 2026-11-24；每条结论均以标明的 SHA 为界。若后续 main 被 PR 合并推进，此页不会自动对新 SHA 产生验收。正式 GitHub Release 版本与已经部署的主分支可以不同，不能相互代替。

## 历史快照：#317 刚合并时的新 main 尚待验收（已由上方最新结论取代）

- [PR #317](https://github.com/kunlong-luo/pagevela/pull/317) 已合并为 `e00bcbd8fda9a7f1b59d3ef926d9df9f2b7a43e2`，此前 PR 头为 `6605324fb9b824a72c20854f8f452624778e1359`。其 [最新头 CI #45320641952](https://github.com/kunlong-luo/pagevela/actions/runs/45320641952) **success**：quality、Chromium 全量（含 PWA offline）、Firefox/WebKit critical、**实际运行的 `build-and-test`** 均成功。
- 修复内容分离：`e2e/mobile-four-primary-actions.e2e.ts` 只更正**桌面**工具栏无障碍按钮名称断言，移动端隐藏预览仍保留单步 Auto Fit；`.github/workflows/ci.yml` 将受保护的 `build-and-test` 设为 `if: always()`，实际 job step 中任一 `needs.quality / needs.e2e-chromium / needs.e2e-cross-browser` 非成功时明确退出失败，避免旧版 skipped 误放行。
- 历史对照：#316 合并得到的前一主分支 `6532c57` [完整 CI #45320068534](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) 最终 **failure**；Firefox/WebKit 与 Chromium 均命中旧桌面断言。同 SHA [Pages #45321277493](https://github.com/kunlong-luo/pagevela/actions/runs/45321277493) **skipped**，不是部署成功。
- **最新主分支验收边界：** `e00bcbd8fda9a7f1b59d3ef926d9df9f2b7a43e2` 的 [main CI #45322638640](https://github.com/kunlong-luo/pagevela/actions/runs/45322638640) 本次核验仍执行中。必须取得 quality + Chromium + Firefox 2/2 + WebKit 2/2 + cross-browser 汇总 + `build-and-test` 全部 success，再确认**相同 SHA** 的 Pages build/deploy success；目前不宣称新功能已经完成线上交付。
- 正式发行仍为 v2.8.3（tag `501ca26`），其归档不包含本次合并。[#312](https://github.com/kunlong-luo/pagevela/issues/312) 继续开放：一键恢复自动排版前设置、移动端隐藏预览及纸型/语言/模板/Android 扩展矩阵。工程评分保持 84/100。

## P0 CI 门禁修复：required job 被跳过却允许自动合并（历史分析）

- 已读 GitHub [规则集 Protect main](https://github.com/kunlong-luo/pagevela/rules/23971861)：`main` 的 `required_status_checks` 目前只指定 **`build-and-test`**（integration ID `15368`），并非独立要求 `e2e-chromium`。原 [ci.yml](https://github.com/kunlong-luo/pagevela/blob/6532c570b852b0284359d73e7c00632571ef04fb/.github/workflows/ci.yml) 为 `build-and-test` 添加了依赖全成功的 **job-level if**；当 Chromium 失败时，`build-and-test` 变成 **skipped**，而跳过的必需检查可能被 GitHub 当作已满足，导致 PR #316 自动合并。
- **热修复方案（PR #317 已通过 PR CI 并合并，main 同 SHA 仍待验收）**：`build-and-test` 改为**无条件 `if: always()`**，在真正执行的 job step 中核对 `quality / e2e-chromium / e2e-cross-browser` 三个 `needs.*.result` 都是 `success`；出现 `failure`、`cancelled` 或 `skipped` 时明确 `exit 1`。这避免仅依靠 job 的 skipped 状态完成保护门禁。保留 PR 对完整 Firefox/WebKit 分片的有意跳过（跨浏览器关键套件由 `e2e-cross-browser` 执行）。
- **重要边界**：仅修改 Workflow 不能追溯撤销 #316 的合并；旧 Chromium PR CI 故障必须保持在验收档案中，当前新的功能仍需要完整 main CI 和同 SHA Pages 验证。没有调整分支保护规则集，也没有降低要求。若此热修复 PR 仍未全绿，禁止抢先合并。

## 2026-11-24 #316 已合并，但 PR 及部署门禁尚未闭环

- **GitHub 合并事实：** [PR #316](https://github.com/kunlong-luo/pagevela/pull/316) 已自动合并，新的 `main` SHA 为 `6532c570b852b0284359d73e7c00632571ef04fb`。原任务 #312 因合并自动关闭，但范围内仍存在撤销与设备验收工作，已**重新开放**。
- **最后 PR head `5485b15`：** [CI #45318654364](https://github.com/kunlong-luo/pagevela/actions/runs/45318654364) **failure**。quality **success**；Firefox/WebKit critical **success**；Chromium 全量 [job #138191856152](https://github.com/kunlong-luo/pagevela/actions/runs/45318654364/job/138191856152) **222 passed / 1 failed / 1 skipped**。失败断言 `e2e/mobile-four-primary-actions.e2e.ts:98` 仍查询旧桌面按钮 `Auto fit to single page`，产品已经改为 `Fit to selected page target`。该失败不是随机波动，且不能当作所有 Chromium 检查通过。
- **修正范围：** 单独的热修复 PR 将桌面工具栏 E2E 定位更新为新目标页数含义；移动端单步回退仍沿用旧名称，确保不把两个产品入口混淆。只修复测试，不修改应用逻辑或持久化协议。
- **旧主分支部署结果：** [main CI #45320068534](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) 最终 **failure**，同 SHA Pages **skipped**；新合并 `e00bcbd` 的独立验收见本文最上方。此前 `12c7044` 的 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947) 和 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) success 不可移用到 `6532c57`。
- **发布边界：** 正式 v2.8.3 包仍在 `501ca26`。评分 84/100 不提升。#312 保持开放。

## 已完成同 SHA 交付闭环：编辑器安全 Hook #310

| 项目 | 代码/运行证据 | 本次结论 |
| --- | --- | --- |
| PR | [#310](https://github.com/kunlong-luo/pagevela/pull/310)，头提交 `12e919845b98b23559b95e99014deeadc2a76993` | **已合并**，合并 SHA `16b11ff2a6e713ab0567c6548406252c659dd5ff` |
| PR CI | [#45303536765](https://github.com/kunlong-luo/pagevela/actions/runs/45303536765) | **success**；typecheck/lint/Vitest/build、Chromium 全量、Firefox/WebKit 关键回归、最终 `build-and-test` |
| 新 main 完整 CI | [#45305029314](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) | **success**；quality、Chromium、Firefox 2/2、WebKit 2/2、e2e-cross-browser 和 `build-and-test` |
| 新 main Pages | [#45307035196](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196) | **success**；build/deploy，两阶段运行 SHA 均为 `16b11ff` |
| 发布资产 | [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)，tag `501ca26a10a023f1a05ce3ce227b288a2a6565d4` | 正式发行**仍为 v2.8.3**；并不包含 #310 的新提交，历史 ZIP/TAR.GZ 不覆盖。未独立下载并做 SHA256 检查 |

## 2026-11-24 后续 main 验收：Auto Fit #311 与文档 #315

- [PR #311](https://github.com/kunlong-luo/pagevela/pull/311) 合并为 `e8fdda0bbbdff0e0b66e7acf1e1b4be9dc059825`，其 [PR 头 CI #45306184066](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066) success；该 SHA 单独的 main CI 后来因新 push 被取消，**不能单独称为成功**。
- [PR #315](https://github.com/kunlong-luo/pagevela/pull/315) 双语 README、CHANGELOG、验收台账合并为 `d0d5486da14459d5b4c1df886afea08f38a71827`；[PR CI #45307976280](https://github.com/kunlong-luo/pagevela/actions/runs/45307976280) success。
- 含 #311 + #315 的 `d0d5486` [完整 main CI #45309378710](https://github.com/kunlong-luo/pagevela/actions/runs/45309378710) success，包含 quality、Chromium、Firefox 两片、WebKit 两片、cross-browser、`build-and-test`；[同 SHA Pages #45310525156](https://github.com/kunlong-luo/pagevela/actions/runs/45310525156) build/deploy success。
- 同 SHA [Release workflow #45310641741](https://github.com/kunlong-luo/pagevela/actions/runs/45310641741) success，**不等同新版本归档已发布**。GitHub 最新 Release 仍为 `v2.8.3`（tag `501ca26`），原压缩包未覆盖。

## 2026-11-24 #314 Quick PDF 安全修复闭环

- [PR #314](https://github.com/kunlong-luo/pagevela/pull/314) 最新头 `de36a9e` 的 [PR CI #45311296133](https://github.com/kunlong-luo/pagevela/actions/runs/45311296133) **success**，合并为 `12c7044c2584d25d0d2c94b3a74fb78330dbd407`。
- 该 SHA 的 [完整 main CI #45312509947](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947)（quality、Chromium 全量、Firefox 2/2、WebKit 2/2、cross-browser 汇总、`build-and-test`）和 [同 SHA Pages #45313889157](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) build/deploy 均成功。[#313](https://github.com/kunlong-luo/pagevela/issues/313) 已关闭。
- 同 SHA [Release workflow #45313984785](https://github.com/kunlong-luo/pagevela/actions/runs/45313984785) 成功未产生新正式发行版本。发布 ZIP/TAR 仍是 v2.8.3 的旧 SHA `501ca26`，独立归档解压/哈希验证未完成。
- 后续测量式 Auto Fit 的 [PR #316](https://github.com/kunlong-luo/pagevela/pull/316) 正在最新提交的 CI 验收，当时仍未合并；现在已合并为 `6532c57`，但仍未通过新 main 同 SHA Pages 验收。该 PR 已增加测量修订号，防止把布局更新前的旧像素高度当作本次压缩反馈；撤销 UX、隐藏预览测量和低端移动设备矩阵继续在 #312。

## 最新 #316 浏览器门禁：旧断言与新按钮语义失配

- 2026-11-24 [PR CI #45317407230](https://github.com/kunlong-luo/pagevela/actions/runs/45317407230) 在候选头 `71ef571` 的 quality **success**，Firefox/WebKit critical **failure**；[失败 job #138188602846](https://github.com/kunlong-luo/pagevela/actions/runs/45317407230/job/138188602846) 日志为 `96 passed / 2 failed`，两项同一 `e2e/simplified-layout.e2e.ts:25` 旧按钮 aria-label 定位失败，并非已证明排版算法的跨浏览器失败。
- 已调整现行测试使用新的目标页数按钮可访问名称；须重新检查该修复新头 CI，不能用原先 quality 成功替代新提交结果。原始失败保留为日期证据，不冒充已通过。
- **历史时点补注：** 上述旧提交发生时 #316 确实**未合并**；2026-11-24 03:31 UTC 已合并到 `6532c57`，但新的 PR Chromium 失败和合并后 CI/Pages 验收边界见本文开头。v2.8.3 仍未打包这部分代码。

## 尚待完成的独立变更

- [#311](https://github.com/kunlong-luo/pagevela/pull/311)：Auto Fit 单调收紧修复已通过 PR CI 并合并，包含该改动的后续 main `d0d5486` CI/Pages 已独立验收通过。**真实测量溢出自动贴合**仍在 #312。
- [#314](https://github.com/kunlong-luo/pagevela/pull/314)：**已合并并通过 CI/Pages 同 SHA 验收**；实际 Android 系统打印/OS 下载完成不属于这次验证。
- [#312](https://github.com/kunlong-luo/pagevela/issues/312)：[PR #316](https://github.com/kunlong-luo/pagevela/pull/316) 已合并统一 1/2/3 页预览测量与有界收紧；**PR Chromium 门禁失败，尚未完成新 main 同 SHA CI/Pages、撤销与设备扩展矩阵**，不宣称任意简历可以一页。
- [#262](https://github.com/kunlong-luo/pagevela/issues/262)：Android 微信负责人反馈通过，但系统 Save-as-PDF、Chrome/OEM 和安装 PWA 离线矩阵未完整验收。
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：私有 Dependabot 告警不能用 Registry Security Inventory 的绿色状态替代；[#202](https://github.com/kunlong-luo/pagevela/issues/202) 法务/外部品牌事项仍未核实。

## 架构与用户体验后续优先级

1. **P0 数据保护**：跨标签页同时编辑须具备冲突检测、版本号和可恢复副本。#310 的“已开启多个标签页”提醒只是预防提示，不是自动冲突合并。
2. **P0/P1 导出**：#314 避免内部零页伪成功；`pdf_export_success` 仍仅代表生成成功及浏览器保存请求，非操作系统下载完成。打印窗口启动也不能计作 PDF 已保存。
3. **P1 真正智能排版**：#311 确保单步压缩不反弹；#312 才是基于真实 `overflowPixels` 迭代、可读性底线及用户设定目标页数的功能。
4. **P1 模块拆分与性能采样**：优先按 Zustand domain、编辑器模式、导出格式拆分，但无真实指标前不得声称性能改善。
5. **P2 设备与治理**：真实 Android、微信、离线 PWA、私有 Dependabot 和商标状态继续单独跟踪。

## 维护原则

- 保留 Pagevela 公共品牌；旧 IndexedDB、Web Locks、BroadcastChannel 与加密分享 AAD 是兼容标识，不能直接全局重命名。
- 不引入浏览器原生选择框、提示框和 tooltip；使用现有 Pagevela UI 设计系统。
- 文档中的“PR CI 通过”“main 同 SHA CI+Pages 通过”“正式 Release 已包含”是三个不同的事实；每次后续合并必须重新验收。
- 当前 [2026-11-23 定性工程评分 84/100](./ASSESSMENT_20261123.md) 保持原始基线，不因文档/PR 数量自动加分。

[项目总状态](./PROJECT_STATUS.md) · [Hook 行为契约](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md) · [架构路线 #282](https://github.com/kunlong-luo/pagevela/issues/282) · [文档索引](./README.md)
