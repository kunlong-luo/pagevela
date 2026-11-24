# Pagevela 工程评分复评 / Engineering reassessment — 2026-11-24 · 第三次验收快照

> **最新已完整上线验收评分：87/100**（此前 [86 分](./ASSESSMENT_20261124.md)，再提升 1 分；11/23 [84 分](./ASSESSMENT_20261123.md)）。这是项目自定的七维度定性工程评分，**不是**第三方认证、Android 机型兼容认证、已发布版本号或性能基准。分数仅按已通过**对应 main SHA 全量 CI 与同 SHA Pages**的成果调整。

## 最新完整验收 / Latest accepted production SHA

| 对象 | 已核实事实 |
| --- | --- |
| 已部署主分支 | `8150287513fccb28de80d409875b0ea04bcd1edf` |
| main 全量 CI | [#45362921101](https://github.com/kunlong-luo/pagevela/actions/runs/45362921101) **success**：quality、Chromium 全量、Firefox 1/2 和 2/2、WebKit 1/2 和 2/2、跨浏览器汇总及实际运行的受保护 `build-and-test` 均 success |
| 同 SHA Pages | [#45364809316](https://github.com/kunlong-luo/pagevela/actions/runs/45364809316) **success**，build 与 deploy 两个 job 均通过 |
| 此前主分支 | `9a634df8a95b8069c2b44ea03577b79d945af227`：[main CI #45360517751](https://github.com/kunlong-luo/pagevela/actions/runs/45360517751) + [同 SHA Pages #45362570879](https://github.com/kunlong-luo/pagevela/actions/runs/45362570879) 均 success |
| 已合并工程改进 | [#322](https://github.com/kunlong-luo/pagevela/pull/322) 拆分独立设置清洗纯函数并新增损坏配置/纸型市场/旧主题字段单测；[#321](https://github.com/kunlong-luo/pagevela/pull/321) Auto Fit 的 1 页英文 A4、3 页中文 Letter/双栏成对冒烟回归，并把“完美契合”更正为“预估契合” |
| 最新正式 Release | [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)（2026-11-23，tag `501ca26`）；**不包含** #321/#322 等 post-v2.8.3 主分支改进。ZIP、TAR.GZ、SHA256SUMS 三项资产可见，**未独立下载、解压并逐一计算 SHA256** |

## 七维度评分 / 7 weighted categories

| 维度 | 权重 | 11/23 历史 | 先前已部署 86 分 | 本次已部署 | 本次判定 |
| --- | ---: | ---: | ---: | ---: | --- |
| 产品能力与完成度 | 20 | 18 | 19 | **19** | 测量式 Auto Fit 和恢复前布局已上线，仍不是系统打印分页精度保证 |
| 交互与多端适配 | 15 | 13 | 13 | **13** | 微信 Android 整体验收曾由负责人确认；OEM、系统打印、安装 PWA 未逐项独立验证 |
| 架构与可维护性 | 20 | 14 | 15 | **16** | **+1：#322** 从大型 Zustand Store 抽离 `src/lib/resume-settings-sanitizer.ts` 纯函数；导入/初始化仍使用同一清洗策略，独立 Vitest 覆盖损坏枚举、数字边界、纸型语言、旧字段和不修改原始数据，且 `9a634df`、`8150287` 均通过完整主分支 CI + 同 SHA Pages。大型 Store/Editor、导出模块仍待拆分 |
| 隐私与数据可靠性 | 15 | 13 | 13 | **13** | **#323 未计分**：旧标签页覆盖风险尚未取得最新 PR-head 浏览器验收，不能声称已上线 |
| 性能 | 10 | 8 | 8 | **8** | 无新增可重复低端 Android、长 Markdown 输入延迟或耗时/内存前后对照 |
| 测试与发布可靠性 | 10 | 9 | 9 | **9** | #321 扩充真实浏览器回归且主分支全部绿，但 Android 系统保存 PDF、更多完整组合、发布资产独立校验仍缺，暂不满分 |
| 文档与交付治理 | 10 | 9 | 9 | **9** | 新快照和源链接可追溯；品牌/媒体外部迁移、私有告警和正式归档独立核验未全部完成 |
| **总计** | **100** | **84** | **86** | **87** | **相比 11/23 +3；本次相较 86 +1，只计已上线可测的架构改进** |

## 当前候选与失败证据 / Still excluded

- [PR #323](https://github.com/kunlong-luo/pagevela/pull/323) 为跨标签页主动保存比较与冲突草稿，拟在同一个 IndexedDB 事务内阻止过期正文覆盖，并保留冲突文本/样式以及用户可操作的提示。其 [旧 PR CI #45362557789](https://github.com/kunlong-luo/pagevela/actions/runs/45362557789) **failure**：Chromium 224 passed、1 skipped、**1 failed**，失败用例为冲突提示没有在断言时保持可见；不得将“恢复草稿成功”替代整体测试成功。
- 后续候选将冲突 Toast 改为用户主动关闭前持续显示，补充设置日志防回放，并以最新主分支重新运行测试。**只有最新 head 全部 PR 检查通过 → 受保护合并 → 新 main SHA 全量 CI 成功 → 同 SHA Pages 成功后，才考虑隐私与数据可靠性 +1**；即使这些门禁通过，仍不能声称旧版页签、未保存的证件照、全部档案元数据、自动合并或多设备同步已解决。
- [#282](https://github.com/kunlong-luo/pagevela/issues/282) 架构与数据安全、[#312](https://github.com/kunlong-luo/pagevela/issues/312) Auto Fit 完整组合、[#262](https://github.com/kunlong-luo/pagevela/issues/262) Android 真机系统打印及 PWA、[#298](https://github.com/kunlong-luo/pagevela/issues/298) GitHub 私有安全告警继续开放。Registry audit report-only 与 CodeQL 成功**不能替代**私有告警验收。

## 下一阶段提升门槛 / Path toward 88–90

首先使 #323 的两个标签页 E2E、故障/恢复通知和实际受保护 `build-and-test` 均绿；继而在新 main SHA 复核 Pages。即使达到 88，也应继续优先完成可恢复照片/档案元信息、多种旧标签页行为、低端设备性能基准以及真实 Android Save-as-PDF/PWA 验收。没有证据就不加分，也不把发版工作流绿色等同于发布了新归档。

[项目状态](./PROJECT_STATUS.md) · [工程验收](./ENGINEERING_ACCEPTANCE_20261124.md) · [设置清洗模块](./PROFILE_SETTINGS_SANITIZER_20261124.md) · [86 分历史报告](./ASSESSMENT_20261124.md) · [v2.8.3 正式归档](./V2_8_3_RELEASE_ACCEPTANCE_20261123.md)
