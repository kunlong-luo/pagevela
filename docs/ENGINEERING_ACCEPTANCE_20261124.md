# Pagevela 工程验收台账 / Engineering acceptance ledger

> **2026-11-25 更新（历史台账名称保留）。** 本文件只记录按提交 SHA 独立核对过的 CI、Pages 与 Release 证据；[项目状态](./PROJECT_STATUS.md) 负责当前摘要，[评分报告](./ASSESSMENT.md) 负责评估。一次 PR 成功 **不能替代**合并后新 main SHA 的完整 CI、同 SHA Pages。

## 已完成的生产验收 / Verified same-SHA deliveries

| 合并内容 | main SHA | 完整主分支 CI | 同 SHA Pages |
| --- | --- | --- | --- |
| v2.8.3 正式发布基线 | `501ca26` | [#45194841125](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125) success | [#45197119172](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) success |
| #319 Auto Fit 恢复 / #320 文档 | `63edf034` | [#45336130078](https://github.com/kunlong-luo/pagevela/actions/runs/45336130078) success | [#45337438957](https://github.com/kunlong-luo/pagevela/actions/runs/45337438957) success |
| [#322](https://github.com/kunlong-luo/pagevela/pull/322) settings sanitizer | `9a634df` | [#45360517751](https://github.com/kunlong-luo/pagevela/actions/runs/45360517751) success | [#45362570879](https://github.com/kunlong-luo/pagevela/actions/runs/45362570879) success |
| [#321](https://github.com/kunlong-luo/pagevela/pull/321) Auto Fit 矩阵 | `8150287` | [#45362921101](https://github.com/kunlong-luo/pagevela/actions/runs/45362921101) success | [#45364809316](https://github.com/kunlong-luo/pagevela/actions/runs/45364809316) success |
| [#324](https://github.com/kunlong-luo/pagevela/pull/324) 文档、87 分历史复评 | `de81022` | [#45367413632](https://github.com/kunlong-luo/pagevela/actions/runs/45367413632) success | [#45369451198](https://github.com/kunlong-luo/pagevela/actions/runs/45369451198) success |
| [#323](https://github.com/kunlong-luo/pagevela/pull/323) 事务级跨标签页冲突防护 | `da3b68b` | [#45370012956](https://github.com/kunlong-luo/pagevela/actions/runs/45370012956) success | [#45372036914](https://github.com/kunlong-luo/pagevela/actions/runs/45372036914) success |
| [#325](https://github.com/kunlong-luo/pagevela/pull/325) 档案 ID 唯一性 | **`a8ec3ae`** | [#45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) **success** | [#45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) **success** |
| **v2.8.4 发布** | `ea2a65b` | [#45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) **success** | [#45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) **success** |
| **后续文档 main** | `dfad007` | [#45396241838](https://github.com/kunlong-luo/pagevela/actions/runs/45396241838) **success** | [#45398234063](https://github.com/kunlong-luo/pagevela/actions/runs/45398234063) **success** |
| **[#332](https://github.com/kunlong-luo/pagevela/pull/332) 引导/模块启动恢复** | `0140b2a` | [#45568793140](https://github.com/kunlong-luo/pagevela/actions/runs/45568793140) **success** | [#45570418074](https://github.com/kunlong-luo/pagevela/actions/runs/45570418074) **success** |

**额外发行证据：** [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) success，annotated tag `v2.8.4` 解引用为 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`；[独立验证 ZIP/TAR.GZ/SHA256 工作流 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) **success**，已真实下载、读取归档并复算。

**检查含义：** 完整主分支 CI 实际包含 quality、完整 Chromium、Firefox 1/2 和 2/2、WebKit 1/2 和 2/2、cross-browser 汇总以及最终受保护 `build-and-test`。Pages 的 build 与 deploy 必须都为 success；一个绿色的 `Push on main`、`Release workflow` 或 report-only registry audit **不能**替代上述两个门禁。

## 失败及恢复的可追溯记录 / Historical incident pointers

- [#316 的失败 main CI #45320068534](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) / [跳过的 Pages #45321277493](https://github.com/kunlong-luo/pagevela/actions/runs/45321277493)：旧桌面按钮可访问名称断言与新 UI 不一致；[#317](https://github.com/kunlong-luo/pagevela/pull/317) 修复断言并使被依赖检查失败时 `build-and-test` 明确失败，后续完整 CI/Pages 已成功。
- [#323 旧候选 CI #45362557789](https://github.com/kunlong-luo/pagevela/actions/runs/45362557789)：冲突提示消失；[后续红灯 #45365050460](https://github.com/kunlong-luo/pagevela/actions/runs/45365050460)：常驻 Toast 遮挡 Layout 操作；最终受保护合并并经新 main 重新验收的版本已通过。详情见[冲突技术说明](./CROSS_TAB_CONFLICT_GUARD_20261124.md)。
- 未在本轮独立下载解压 v2.8.3 发布 ZIP/TAR.GZ 并逐一计算 SHA256；GitHub Release workflow 成功和附件存在不能写成档案哈希已经验证。

## 未被此台账验证的内容

GitHub 私有安全告警 [#298](https://github.com/kunlong-luo/pagevela/issues/298)、Android 系统打印和安装 PWA [#262](https://github.com/kunlong-luo/pagevela/issues/262)、全纸型/模板/语言 Auto Fit 组合 [#312](https://github.com/kunlong-luo/pagevela/issues/312)、旧版打开标签页与照片/档案元数据冲突恢复 [#282](https://github.com/kunlong-luo/pagevela/issues/282)。负责人已确认过 Android 微信整体验收，但不能扩展为这些分项通过。

[状态](./PROJECT_STATUS.md) · [88 分工程复评](./ASSESSMENT.md) · [版本发布操作](../RELEASING.md) · [历史文档](./history/README.md)
