# Pagevela engineering acceptance / 2026-11-24

> **验收台账，非实时 CI 面板。** 日期 2026-11-24；每条结论均以标明的 SHA 为界。若后续 main 被 PR 合并推进，此页不会自动对新 SHA 产生验收。正式 GitHub Release 版本与已经部署的主分支可以不同，不能相互代替。

## 已完成同 SHA 交付闭环：编辑器安全 Hook #310

| 项目 | 代码/运行证据 | 本次结论 |
| --- | --- | --- |
| PR | [#310](https://github.com/kunlong-luo/pagevela/pull/310)，头提交 `12e919845b98b23559b95e99014deeadc2a76993` | **已合并**，合并 SHA `16b11ff2a6e713ab0567c6548406252c659dd5ff` |
| PR CI | [#45303536765](https://github.com/kunlong-luo/pagevela/actions/runs/45303536765) | **success**；typecheck/lint/Vitest/build、Chromium 全量、Firefox/WebKit 关键回归、最终 `build-and-test` |
| 新 main 完整 CI | [#45305029314](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) | **success**；quality、Chromium、Firefox 2/2、WebKit 2/2、e2e-cross-browser 和 `build-and-test` |
| 新 main Pages | [#45307035196](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196) | **success**；build/deploy，两阶段运行 SHA 均为 `16b11ff` |
| 发布资产 | [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)，tag `501ca26a10a023f1a05ce3ce227b288a2a6565d4` | 正式发行**仍为 v2.8.3**；并不包含 #310 的新提交，历史 ZIP/TAR.GZ 不覆盖。未独立下载并做 SHA256 检查 |

## 尚待完成的独立变更

- [#311](https://github.com/kunlong-luo/pagevela/pull/311)：Auto Fit 单调收紧不再反向放大；同步后的头 `56ecc0e` 已通过 [PR CI #45306184066](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066)，并合并为 `e8fdda0bbbdff0e0b66e7acf1e1b4be9dc059825`。新 main 的 CI/Pages 仍须另行核对，不复用 PR 头结果。
- [#314](https://github.com/kunlong-luo/pagevela/pull/314)：Quick PDF 画布/Context/零有效页面失败保护，自定义错误提示、文本型打印回退；候选头 `0e71c07`，质量/静态扫描 success，但完整 Chromium/Firefox/WebKit 和 merged main/Pages 待验收。对应 [#313](https://github.com/kunlong-luo/pagevela/issues/313)。
- [#312](https://github.com/kunlong-luo/pagevela/issues/312)：结合测量溢出页数的 Auto Fit 闭环尚未实现。即使 #311 合并，也不能宣称“一键一定排成一页”。
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
