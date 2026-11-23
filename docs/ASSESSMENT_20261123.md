# Pagevela 工程复评与优化路线 / 2026-11-23

> **综合评分：84 / 100（良好，仍有工程与真机验收风险）。**
> 这是一份可追溯的、**定性的工程评分**，不是用户满意度、第三方 ATS 认证、商标核验、渗透测试或 Android 实测报告。
> **原评分基线：** [`12a08ec`](https://github.com/kunlong-luo/pagevela/commit/12a08ec08695e093b280c602dd11f11c8ac429df)，截至本报告编写时完整 CI、Pages、Release 均已核对。
> **2026-11-23 验收后补充：** [报告 PR #308](https://github.com/kunlong-luo/pagevela/pull/308) 已合并为 [`077e649`](https://github.com/kunlong-luo/pagevela/commit/077e64991801b3f30b4b5cdb2e594ea3c278af36)，其 [完整 CI #45172148513](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513)、[Pages #45174090788](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788)、[Release #45174220771](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771) **同 SHA 成功**。
> **新的架构进度，不追溯加分：** [#307](https://github.com/kunlong-luo/pagevela/pull/307) 已合并为 [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed)，功能 PR 的 [完整 CI #45172316902](https://github.com/kunlong-luo/pagevela/actions/runs/45172316902) 成功，且合并后 [CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889)、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398) 和 [Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214) 均成功。因此 **84/100 是既有七维度已交付工程基线的快照，不是对 #307 或下载包的新完整复评**。正式发行仍为 `v2.8.2`。

## 七维度评分（与 2026-11-22 量表保持同一权重）

| 维度 | 满分 | 11/22 历史基线 | 11/23 本次得分 | 本次依据与主要扣分 |
| --- | ---: | ---: | ---: | --- |
| 产品能力和完成度 | 20 | 18 | **18** | Markdown / 表单双模式、A4 / US Letter、ATS 检查、Auto Fit、PDF 与本地草稿能力完整；真实设备导出、证件照能力仍需验收 |
| 交互与多端适配 | 15 | 13 | **13** | 品牌一致的 UI 及响应式布局已有多浏览器检查；移动端非微信浏览器与系统打印缺独立真机矩阵，不能加分 |
| 架构与可维护性 | 20 | 13 | **14** | 原评分快照已有分栏、定期草稿 Hook 与草稿写入队列改进；其后 #307 已合并新的快捷键 Hook，但尚待同 SHA 生产验收，也未单独重评加分；`Editor.tsx`、`useResumeStore.ts`、`export-utils.ts` 仍较大，[#282](https://github.com/kunlong-luo/pagevela/issues/282) 未完成 |
| 隐私和数据可靠性 | 15 | 12 | **13** | [#293](https://github.com/kunlong-luo/pagevela/pull/293) 协调草稿历史并发，写入串行化且保留旧协议；跨标签页“后编辑覆盖先编辑”风险、未加密 JSON 备份仍存在 |
| 性能 | 10 | 8 | **8** | 生产构建与性能预算门禁通过，PDF 模块按需加载；未得到足够新的真实移动网络 / CPU / 内存实测，CSS 预算裕量与大组件仍需优化 |
| 测试与发布可靠性 | 10 | 5 | **9** | [`12a08ec` 完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620) + [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368) 成功；[Release](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465) 确认同 SHA 门禁并安全跳过已发布 v2.8.2；新版本首次打包及真实手机打印尚未独立验证 |
| 文档和交付治理 | 10 | 7 | **9** | [#305](https://github.com/kunlong-luo/pagevela/pull/305) 整理中英文 README、统一文档索引、历史状态归档和安全/发布记录；[#306](https://github.com/kunlong-luo/pagevela/pull/306) 已合并进一步补证据，外部品牌/发布渠道和长期 issue 仍待独立核验 |
| **合计** | **100** | **76** | **84** | **同比增加 8 分；分数是工程复评，不保证零缺陷** |

**分数变化可追溯：** 架构 +1，隐私/数据 +1，测试与发布 +4，文档治理 +2；产品、交互、性能没有在缺乏新增真实证据时自动加分。

## 已取得的发布闭环证据

1. [#292](https://github.com/kunlong-luo/pagevela/pull/292) 修复分栏复位回归，[#293](https://github.com/kunlong-luo/pagevela/pull/293) 加强草稿历史写入协调，保留原 IndexedDB/跨标签页协议。
2. [#300](https://github.com/kunlong-luo/pagevela/pull/300)、[#301](https://github.com/kunlong-luo/pagevela/pull/301) 修复受影响依赖路径与 Workbox 生产预缓存，Chromium 生产离线导航进入回归。
3. [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入 Security Inventory 和严格发布前 PWA/类型/性能门禁。最新已核对 [#305 安全审计](https://github.com/kunlong-luo/pagevela/actions/runs/45159967313) 及 [#306 安全审计](https://github.com/kunlong-luo/pagevela/actions/runs/45163891326) 的 npm 注册表公告为 0；**不等于私有 Dependabot 告警为 0**。
4. [#304](https://github.com/kunlong-luo/pagevela/pull/304) 把自动发版改为 `CI → 同 SHA Pages → Release`。同一个 `84ae706` 上的 [完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45161614275)、[Pages build+deploy](https://github.com/kunlong-luo/pagevela/actions/runs/45163532567) 和 [Release no-op](https://github.com/kunlong-luo/pagevela/actions/runs/45163664593) 均成功，历史 v2.8.2 标签和附件未覆盖。
5. [#305](https://github.com/kunlong-luo/pagevela/pull/305) 和 [#306](https://github.com/kunlong-luo/pagevela/pull/306) 统一发布日期、SHA、操作指南、安全边界及历史证据。[#306 合并后的 `12a08ec` CI](https://github.com/kunlong-luo/pagevela/actions/runs/45166477620)、[Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45168214368)、[Release 安全跳过](https://github.com/kunlong-luo/pagevela/actions/runs/45168339465) 已完成独立闭环，解决先前仅有 PR 通过而未部署的状态。
6. [#308](https://github.com/kunlong-luo/pagevela/pull/308) 评分文档在 [合并后 main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513)、[Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788) 与 [Release](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771) 均完成后才确认为上线；[#307](https://github.com/kunlong-luo/pagevela/pull/307) 的快捷键 Hook 代码已经合并，且合并后的独立生产 CI/Pages 已通过；未进行新七维度复评，不能追溯加分。

## 扣分事项及下一阶段完成标准

| 优先级 | 事项 | 可验证的完成标准 | 对应 Issue / PR |
| --- | --- | --- | --- |
| P0 | 新增 PR 的同 SHA 交付闭环 | **已完成：** `12a08ec` 与 `077e649` 均通过完整 main CI → 同 SHA Pages → Release 安全跳过。**随后完成：** `ac2932c` [CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889)、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398)、[Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214)。**待完成：** v2.8.3 新包与新 main SHA 独立验收，不追溯加分 | [#308](https://github.com/kunlong-luo/pagevela/pull/308) · [#307](https://github.com/kunlong-luo/pagevela/pull/307) · [状态](./PROJECT_STATUS.md) |
| P1 | 模块拆分与测试隔离 | #307 的快捷键 Hook + 单元/E2E 已合并；下一步抽离标签页存在检测、存储健康监听，再渐进整理 Editor/Store/导出管道；每步保持存储协议、PDF、响应式 UI 不变，比较性能并通过同 SHA Pages | [#282](https://github.com/kunlong-luo/pagevela/issues/282) · [#307](https://github.com/kunlong-luo/pagevela/pull/307) |
| P1 | Android 真实设备矩阵 | 保留负责人报告的微信 PASS；补实际 Android Chrome/OEM、系统 Save-as-PDF、微信下载、安装后的离线恢复，按设备/系统/浏览器/SHA 逐项记录 | [#262](https://github.com/kunlong-luo/pagevela/issues/262) |
| P1 | 供应链与私有告警 | 有权限的 GitHub Security 界面/接口核对 Dependabot 私有告警，确认 Workbox legacy `minimatch@5.1.9` 的上游替代，不进行盲目 major override | [#298](https://github.com/kunlong-luo/pagevela/issues/298) · [SECURITY](../SECURITY.md) |
| P2 | 性能深度评估 | 真实手机中/低端 CPU、弱网和首次访问测量；保留 PWA 预缓存和性能预算，在对比数据下优化首屏 CSS、编辑器更新及 PDF 懒加载 | [#282](https://github.com/kunlong-luo/pagevela/issues/282) |
| P2 | 产品与外部治理 | 中文照片功能按隐私与移动端 UX 验收；旧健康指标补数据；品牌/商标和第三方平台由实际权限持有人逐项核对 | [#200](https://github.com/kunlong-luo/pagevela/issues/200) · [#115](https://github.com/kunlong-luo/pagevela/issues/115) · [#202](https://github.com/kunlong-luo/pagevela/issues/202) |

## 评分使用规则

- 评分是**已部署工程基线**的评估，不是当前所有未合并 PR 的预期分，也不是版本 `v2.8.2` 下载包的独立复测分。
- 不以通过 Chromium/WebKit 模拟测试替代 Android 真机；不以 `pnpm audit` 0 条取代私有 GitHub Dependabot 审计或渗透测试；不以 GitHub 的 Pages success 证明第三方平台已更新。
- 当 `main`、CI、Pages、Release 发生变化时，在 [状态快照](./PROJECT_STATUS.md) 和 [发布验收台账](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) 记录新 SHA，再开展下一次复评。保留 [2026-11-22 的 76 分历史报告](./ASSESSMENT_20261122.md)，不可覆盖历史评分事实。
- **迈向 90 分的建议**：先完成 #282 的高风险模块可测试性、#262 真机核心路径、#298 私有安全告警核对及真实移动性能测量。分数只在验收证据补齐后提高。

[文档索引](./README.md) · [当前状态](./PROJECT_STATUS.md) · [发布规则](../RELEASING.md) · [架构路线](https://github.com/kunlong-luo/pagevela/issues/282)
