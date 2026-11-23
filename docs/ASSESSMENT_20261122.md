# Pagevela 项目评估与评分 / 2026-11-22

> **最新复评：** [2026-11-23 工程评分 84/100](./ASSESSMENT_20261123.md)。本页的 76/100 仍按 11 月 22 日原始测试事实保留。

> **历史评分说明（2026-11-23）：** 76/100 专指 2026-11-22 当时 `992374a` 的 CI 失败基线，不是当前评分。后续 #292/#293 修复、#300/#301 PWA 补丁、#303 安全审计以及 #304 CI → Pages → Release 门禁均已合并。请查看 [当日最新状态](./PROJECT_STATUS.md) 和 [发布验收台账](./RELEASE_SECURITY_ACCEPTANCE_20261123.md)；未完成新的七维度正式复评前，不给旧 76 分悄悄改名为今日得分。

> **后续更新（2026-11-22）：** 本文 76/100 为当日修复前的可追溯基线。此后 [PR #292](https://github.com/kunlong-luo/pagevela/pull/292) 已修复分栏复位并通过完整 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45021860745) 和 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45022812621) 同 SHA 验收。此处保留当时的扣分依据，下一次完整复评再更新总分；草稿并发安全、Android 实测与架构工作仍独立跟踪。

**评估对象：** GitHub `kunlong-luo/pagevela`，截至 2026-11-22 的 `main` 提交 `992374a`、工作流、版本文档与开放 Issues。**这是基于仓库证据的工程评估，不是独立 Android 真机测试、第三方 ATS 认证、渗透测试或流量实测。**

## 总体评分

**76 / 100（当前基线，产品可用度较高，但主分支发布门禁处于失败状态）**。分值是为追踪改进而设的定性工程量表，不代表用户满意度统计。

| 维度 | 满分 | 得分 | 证据与扣分原因 |
| --- | ---: | ---: | --- |
| 产品能力和完成度 | 20 | **18** | Markdown/表单双编辑、A4/Letter 预览、ATS 引导、模板、PDF、离线优先草稿及分享齐备；部分设备能力尚待真实验收 |
| 交互与多端适配 | 15 | **13** | 中英 UI、设计系统、自定义弹窗、移动导航与自动化回归覆盖较完整；分栏复位有确定回归，Android 多浏览器矩阵不全 |
| 架构与可维护性 | 20 | **13** | Zustand/Dexie/Hook 分层初步形成；`Editor.tsx` 与 `export-utils.ts` 各约 50 KB，Store 约 38 KB，自动草稿与手动草稿仍有独立写入路径 |
| 隐私和数据可靠性 | 15 | **12** | 核心内容 IndexedDB 本地保存、兼容旧备份/加密分享、新版写入串行化；JSON 工作区备份不加密、跨标签页仍存在最后写入覆盖风险 |
| 性能 | 10 | **8** | `perf:budget` PASS、首屏 JS 160.8 KiB gzip 低于 260 KiB；CSS 29.1 / 32 KiB gzip 裕量有限，PDF 工具 725.8 KiB gzip 按需加载 |
| 测试与发布可靠性 | 10 | **5** | 47 个单元测试文件通过且多浏览器 E2E 完整；11-20、21、22 主分支因分栏复位测试失败，Pages 被跳过，发布门禁不能认定正常 |
| 文档及交付治理 | 10 | **7** | README 中英、隐私、数据迁移、版本日志、26 个以上推广平台资料完整；此前缺统一索引，历史和现行验收混排，尚有开放旧事项 |
| **合计** | **100** | **76** | **重点在恢复发布门禁与降低维护成本，而非立刻增加新功能** |

## 主要依据

- [2026-11-22 主分支 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45017892041)：质量 job success；Chromium、Firefox/WebKit 的 `workspace-split-pane.e2e.ts` 双击重置断言未通过。已记录的失败值预期 `50`、实际 `60.9375`。
- [Pages 未部署工作流](https://github.com/kunlong-luo/pagevela/actions/runs/45018795903)：skipped。此前成功的 Pages 是 [#40295215435](https://github.com/kunlong-luo/pagevela/actions/runs/40295215435)，对应 `712dee2`；当前 `main` 是 `992374a`。
- [v2.8.2 Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)：仍是最新发布包；未因后续重构更新版本。
- 质量日志显示 47 个 Vitest 文件通过，性能预算 PASS；初始 JS 160.8 KiB、CSS 29.1 KiB（gzip）。
- [架构路线 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[Android #262](https://github.com/kunlong-luo/pagevela/issues/262)、[品牌 #202](https://github.com/kunlong-luo/pagevela/issues/202) 的未关闭验收项。

## 优先级与预期收益

| 优先级 | 建议改进 | 完成判据 |
| --- | --- | --- |
| **P0** | 修复 Tooltip/分栏双击复位的跨浏览器回归 | 新 PR 完整 CI 全绿，合并后 main CI 全绿并有同 SHA Pages 部署；同时保留拖拽持久化 E2E |
| **P1** | 统一自动历史草稿与手动草稿的 IndexedDB 写入策略 | 模拟并发、重命名、导出、恢复；没有丢稿和旧写入覆盖；恢复测试和浏览器 E2E 通过 |
| **P1** | 补 Android Chrome/微信、系统保存 PDF、实际下载、PWA 离线的逐项结果 | #262 有设备、版本、SHA、测试范围与结果，真实设备缺项仍明确未验证 |
| **P1** | Dependabot 与旧 Issue / 分支治理 | #288 / #290 / #291 逐项通过兼容和 CI 审核；#115/#200 核对关闭条件，历史 EdgeOne 分支不误合并 |
| **P2** | 模块化 Editor、Store、导出/解析及 CSS | 接口、数据格式、UI 行为不变；可测、bundle / render 指标对比；不引入原生浏览器弹窗 |
| **P2** | 品牌及站外资料验收 | #202 商标证据和站外平台更新按所有者权限逐项记录，不误称已执行 |

## 评分解释与复评

- **76 分并非“项目不可用”。** 它表示功能成熟且已有质量体系，但当前源代码存在一个跨浏览器稳定复现的门禁问题，同时存在长期维护和人工验收缺口。
- **修复后不是自动满分。** 必须看到最新 `main` 的同 SHA 全绿 CI 与 Pages，才可提高“测试与发布可靠性”；否则保持现有扣分。
- 真实设备和页面体验需独立记录；CI 模拟不能替代实体 Android 打印/下载验收。
- 本次整理优先**补入口、标注历史、保留旧链接**，不删除原始版本日志与推广档案；文档变动本身不改变源代码安全等级。

[文档索引](./README.md) · [状态快照](./PROJECT_STATUS.md) · [架构路线](https://github.com/kunlong-luo/pagevela/issues/282)
