# Pagevela 工程复评 / Engineering reassessment — 2026-11-24

> **本次独立复评：86/100（由 2026-11-23 的 84/100 基线提升 2 分）。** 这是针对 **已完成主分支 CI + 同 SHA Pages** 的工程成熟度定性评分，不是正式版本号、Android 真机认证、性能基准或第三方安全认证。旧评估 [84/100](./ASSESSMENT_20261123.md) 保留为历史快照，不覆盖原始结果。

## 可核验的评估基线 / Verified baseline

- 最新核验 `main`：[`63edf034b6fd82cca81a30e91eb10b39c59b4aed`](https://github.com/kunlong-luo/pagevela/commit/63edf034b6fd82cca81a30e91eb10b39c59b4aed)（已包含 [#319](https://github.com/kunlong-luo/pagevela/pull/319) Auto Fit 适配前排版一键恢复和 [#320](https://github.com/kunlong-luo/pagevela/pull/320) 文档同步）。
- [完整主分支 CI #45336130078](https://github.com/kunlong-luo/pagevela/actions/runs/45336130078) **success**：quality、完整 Chromium、Firefox 2/2、WebKit 2/2、cross-browser 汇总及**实际执行成功**的 `build-and-test`；[同 SHA Pages #45337438957](https://github.com/kunlong-luo/pagevela/actions/runs/45337438957) 的 build / deploy **success**。后续 [Release 工作流 #45337558274](https://github.com/kunlong-luo/pagevela/actions/runs/45337558274) success，但**未创建新正式版本**。
- 最近一次 GitHub Release 仍为 [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)，于 2026-11-23 发布。原 ZIP/TAR.GZ 和 `SHA256SUMS.txt` 已存在；**未在本次复评执行独立下载/解压/哈希校验**，也不将 post-v2.8.3 代码算入旧包。
- 当前待验收候选分支 `test/auto-fit-paper-language-matrix-20261124` 的新测试和文案优化**不计入 86 分**。该 PR 的最新提交仍须通过 PR 全量 CI，合并后新 main SHA 仍需完整 CI + 同 SHA Pages 才能纳入下一次定性复评。

## 七维度重新评分（相同权重）

| 维度 | 满分 | 历史 11/23 | 本次 11/24 | 增分理由或仍然扣分的事实 |
| --- | ---: | ---: | ---: | --- |
| 产品能力与完成度 | 20 | 18 | **19** | **+1：** [#316](https://github.com/kunlong-luo/pagevela/pull/316) 已把目标 1/2/3 页与实时预览溢出量结合；[#319](https://github.com/kunlong-luo/pagevela/pull/319) 提供单次排版恢复，并覆盖虚构草稿持久化 E2E，两者随 `63edf034` 经线上同 SHA CI/Pages 验收。**不是**任意内容精准适配/实际系统打印保证。 |
| 交互与多端适配 | 15 | 13 | **13** | 桌面多浏览器 E2E 不等于 Android Chrome/OEM/系统打印验收；微信真机为负责人总体反馈，未细分所有操作。 |
| 架构与可维护性 | 20 | 14 | **15** | **+1：** [#307](https://github.com/kunlong-luo/pagevela/pull/307) 快捷键 Hook、[#310](https://github.com/kunlong-luo/pagevela/pull/310) 多标签页/存储健康提示 Hook、[#319](https://github.com/kunlong-luo/pagevela/pull/319) 独立可测试恢复策略，均已包含在独立验证的主分支。大型 Store / Editor / 导出模块及跨标签页冲突模型仍未完成拆分。 |
| 隐私与数据可靠性 | 15 | 13 | **13** | 草稿历史写入协调已有测试，但跨标签页并发内容版本冲突和 JSON 备份明文风险仍存在。 |
| 性能 | 10 | 8 | **8** | 已有构建体积预算，但缺真实低端 Android、弱网、长文档输入延迟及内存对比数据，不凭文件变小或 CI 通过加分。 |
| 测试与发布可靠性 | 10 | 9 | **9** | 主分支完整跨浏览器与 Pages/Release 闭环已验证；新纸型/语言组合、Android 系统 Save-as-PDF、发布资产独立校验仍有缺口。 |
| 文档与交付治理 | 10 | 9 | **9** | #320 双语状态同步已合并；旧发布附件检验、外部商标/媒体信息及历史 tracker 仍未全部验证。 |
| **总分** | **100** | **84** | **86** | **比历史基线提升 2 分；仅使用已部署且通过完整自动验收的功能与模块化证据** |

## 2026-11-24 新回归候选（本次暂不加分）

拟新增 **Chromium synthetic-data Auto Fit smoke matrix**，补足现有 [2-page English A4 用例](../e2e/measured-auto-fit.e2e.ts) 以外的两条路径：

| 用例 | 纸张 | UI/正文 | 目标 | 模板 | 自动检查 |
| --- | --- | --- | --- | --- | --- |
| 简短英文履历 | A4 | English | 1 页 | 默认单栏 | 预览纸型、目标保留、诚实的成功/停止反馈、原始 Markdown、刷新后布局和草稿不丢 |
| 较长中文虚构履历 | US Letter | 中文 | 3 页 | 现代双栏 | 预览纸型、目标保留、模板不被 Auto Fit 覆写、原始 Markdown、刷新后布局和草稿不丢 |
| 现有已合并测试 | A4 | English | 2 页 | 默认 | 已有测量式 Auto Fit 目标保留、草稿持久化和恢复前布局独立 E2E |

- 状态为 **PR 候选 / pending**，不是全量 `A4/Letter × 中文/英文 × 1/2/3 页 × 所有模板` 的笛卡尔积；更不是 Android、实际 PDF 分页或低端机性能验证。
- 同一候选修正文案：`Estimated Fit / 预估契合`，避免“Perfect Fit / 无跨页截断风险”的过度承诺；采用已有品牌组件，不引入浏览器原生弹窗、下拉或 tooltip。
- 证据门禁：**PR 最新头** quality / unit / Chromium / Firefox-WebKit / 实际执行的 `build-and-test` → 合并 → **新 main 同 SHA** 完整 CI / Pages。若测试失败，记录具体失败原因并修复，不拿之前的绿灯替代。
- 未解决的验收继续留在 [#312](https://github.com/kunlong-luo/pagevela/issues/312)（完整纸型语言模板矩阵/隐藏预览）和 [#262](https://github.com/kunlong-luo/pagevela/issues/262)（真机打印/PWA）；[#298](https://github.com/kunlong-luo/pagevela/issues/298) 的私有安全告警也不能被 npm registry audit 绿灯代替。

## 下一轮迈向 88–90 分的有条件路线

优先推进 [#282](https://github.com/kunlong-luo/pagevela/issues/282) 可验证的数据冲突保护/分模块重构，以及 [#312](https://github.com/kunlong-luo/pagevela/issues/312) 设备与打印验证。**不预先把预期分数加到本次 86 分里**。真实移动端性能与独立发布资产哈希确认之后，再考虑性能/发布维度提分。

[项目状态](./PROJECT_STATUS.md) · [测量式 Auto Fit](./MEASURED_AUTO_FIT_20261124.md) · [历史 84 分原始报告](./ASSESSMENT_20261123.md) · [工程验收](./ENGINEERING_ACCEPTANCE_20261124.md)
