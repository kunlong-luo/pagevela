# Pagevela 项目状态 / Project status

> **核验日期：2026-11-25。** 此页是按确切 SHA 保存的验收快照，非实时 Actions 面板。正式版本仍是 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，后续 main 的修复**不会追溯进入**已发布 ZIP/TAR。最新实时记录见 [Actions](https://github.com/kunlong-luo/pagevela/actions)。

## 已完成验收 / Verified production

| 合并 | 确切 main SHA | 完整主分支 CI | 同 SHA Pages |
| --- | --- | --- | --- |
| [#334](https://github.com/kunlong-luo/pagevela/pull/334) 简历内容防覆盖/安全导入 | `07368d64b220c9a0f4a058733ce4bf2bd517192e` | [#45588914443](https://github.com/kunlong-luo/pagevela/actions/runs/45588914443) **success** | [#45590609387](https://github.com/kunlong-luo/pagevela/actions/runs/45590609387) **success** |
| [#337](https://github.com/kunlong-luo/pagevela/pull/337) 两层本地数据清理/防并发写入/文档整合 | `bb3474873adef114147b3214905d1e07b5d32f4b` | [#45591475788](https://github.com/kunlong-luo/pagevela/actions/runs/45591475788) **success** | [#45593665011](https://github.com/kunlong-luo/pagevela/actions/runs/45593665011) **success** |
| [#335](https://github.com/kunlong-luo/pagevela/pull/335) 真实 IndexedDB 保存回执 + [#338](https://github.com/kunlong-luo/pagevela/pull/338) WebKit 修复 | `0fea9fc`（历史基线） | [#45584515860](https://github.com/kunlong-luo/pagevela/actions/runs/45584515860) **success** | [#45586651728](https://github.com/kunlong-luo/pagevela/actions/runs/45586651728) **success** |
| **[#339](https://github.com/kunlong-luo/pagevela/pull/339) 后台保存提前 flush** | **`f88407d0b27c8fe23ecda3cb1d3f96ec7aa726cc`** | [#45615761703](https://github.com/kunlong-luo/pagevela/actions/runs/45615761703) **success** | [#45617579641](https://github.com/kunlong-luo/pagevela/actions/runs/45617579641) **success** |
| **最新正式 Release v2.8.4** | tag `ea2a65b` | [正式 CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) **success** | [正式 Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) **success** |

正式 [Release 工作流 #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) 亦成功；ZIP/TAR.GZ/SHA256SUMS 的 [独立下载复算 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) **success**（49 个相同文件），原 tag/发行附件未被修改。

## 下一阶段待验收

- **[#339](https://github.com/kunlong-luo/pagevela/pull/339) 后台保存：** 合并 `f88407d0` 已通过 [完整 main CI #45615761703](https://github.com/kunlong-luo/pagevela/actions/runs/45615761703) 和 [同 SHA Pages #45617579641](https://github.com/kunlong-luo/pagevela/actions/runs/45617579641)，见 [保存生命周期](./BACKGROUND_SAVE_LIFECYCLE_20261125.md)。事件只是**提前发起**异步写入，不保证后台杀进程后事务完成。
- **[#340](https://github.com/kunlong-luo/pagevela/pull/340) Quick PDF 内存：** [完整 PR CI #45616120212](https://github.com/kunlong-luo/pagevela/actions/runs/45616120212) **success**、已合并 `0c5c445be24d600fabb992870bb6d500c48a871b`；[新 main CI #45618268263](https://github.com/kunlong-luo/pagevela/actions/runs/45618268263) 与同 SHA Pages **等待独立验收**，不得提前标成线上部署。[内存设计](./QUICK_PDF_MEMORY_GUARD_20261125.md)。
- **[#341](https://github.com/kunlong-luo/pagevela/pull/341) Quick PDF 尾部完整性：** 用 32,768 像素分块的逐像素检查替换稀疏行列抽样，避免漏掉细薄末尾内容；[专项说明](./PDF_TRAILING_CONTENT_INTEGRITY_20261125.md)。**PR 候选，尚未合并**，无低端 Android CPU/内存实测。
- **低内存 PDF / Auto Fit / Android：** [#312](https://github.com/kunlong-luo/pagevela/issues/312) 真实打印分页/组合、[#262](https://github.com/kunlong-luo/pagevela/issues/262) 系统打印/OEM 浏览器/安装 PWA、长简历 canvas 内存；负责人确认的安卓微信整体成功**不等于**这些单项完成。
- **隐私 / 兼容 / 架构：** 旧版已打开的标签页、跨设备同步、照片/完整档案元数据冲突、明文工作区 JSON、Store/导出域拆分、[#298 私有安全告警](https://github.com/kunlong-luo/pagevela/issues/298)、商标与外部媒体更新。
- **历史重复 PR：** [#333](https://github.com/kunlong-luo/pagevela/pull/333) 是已**关闭、未合并**的旧发布完整性文档草稿；归档验收证据已由 #337 合并至主分支并通过完整 CI/Pages，避免旧文档覆盖更新的状态。

**工程评分仍为 [88/100](./ASSESSMENT.md)**（七维度内部复评）；上述发布与安全补强已通过新主分支门禁，但目前没有 Android 全矩阵/低端设备性能等独立证据足以支持提高评分。保留历史失败 CI 记录，不倒填成成功。

## 项目契约

保留旧 `resume-craft` IndexedDB、Web Lock、BroadcastChannel 及加密分享兼容标识，不增加原生确认/Tooltip、不覆盖旧发行 tag 或资产。**PR 全绿、main 完整 CI、同 SHA Pages** 必须各自验收，缺一不可。

[文档导航](./README.md) · [工程 CI/Pages 台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [下一阶段路线图](./NEXT_PHASE_ROADMAP_20261125.md) · [完整清理说明](./FULL_LOCAL_DATA_RESET_20261125.md)
