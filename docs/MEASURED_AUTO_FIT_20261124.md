# Measured Auto Fit / 目标页数智能适配

> **2026-11-24 最新部署验收：** #316 的测量式 1/2/3 页适配以及 #317 的 CI 防跳过修复已在 `main` `202bcea` 取得 [完整 main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) 与 [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) **success**。[#319](https://github.com/kunlong-luo/pagevela/pull/319) 的一键恢复已合并至 `main` `db8919f`，但新主分支同 SHA CI/Pages 仍待独立验收；[#312](https://github.com/kunlong-luo/pagevela/issues/312) 仍开放。**v2.8.3 正式压缩包不包含这些后续变更**；浏览器测量结果不等同实际系统打印分页保证。

### 2026-11-24 已验证主分支交付 / Verified main delivery

- `main` `202bcead397ef9c3ef77d6f83f7ee715a6dfd4ee`：[完整 CI #45324490754](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) **success**，覆盖 quality、Chromium 全量、Firefox 2/2、WebKit 2/2、跨浏览器汇总以及实际执行的 protected `build-and-test`；[同 SHA Pages #45326859873](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) 的 **build/deploy 均 success**。
- [Release 工作流 #45326978990](https://github.com/kunlong-luo/pagevela/actions/runs/45326978990) **success**，但复用发布门禁并没有创建新包：最新正式 Release 仍为 **v2.8.3**，tag `501ca26`，ZIP/TAR.GZ 不追溯包含 `202bcea` 之后的功能。
- [#317](https://github.com/kunlong-luo/pagevela/pull/317) 的 CI 防跳过保护和 [#318](https://github.com/kunlong-luo/pagevela/pull/318) 的九份文档已随 `202bcea` 取得线上同 SHA 验收。此前 `6532c57` 的 CI **failure** 与 Pages **skipped** 是另一个提交的历史记录，不能覆盖。
- [#319](https://github.com/kunlong-luo/pagevela/pull/319) Auto Fit 一键恢复：最新 PR 头 `f0e94a9` 的[完整 CI #45327296976](https://github.com/kunlong-luo/pagevela/actions/runs/45327296976) **success**（quality、Chromium、Firefox/WebKit、实际执行的 `build-and-test`），且已通过 squash 合并为 `main` **`db8919f49d4866796809bda5f2e3fe3cc4a2cdc8`**。但 [新 main CI #45334379703](https://github.com/kunlong-luo/pagevela/actions/runs/45334379703) 于 2026-11-24 05:35 UTC 触发；记录本快照时仍在执行，**该 SHA 的同 SHA Pages 尚未验收**，不可写成已上线。正式归档仍是 v2.8.3，[#312](https://github.com/kunlong-luo/pagevela/issues/312) 继续开放；评分维持 **84/100**。

## 2026-11-24 代码/门禁交付更新（#317，历史快照）

- [#316](https://github.com/kunlong-luo/pagevela/pull/316) 的测量式 Auto Fit 先在 `6532c57` 合并，但该 SHA 的 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) **failure**、[Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45321277493) **skipped**。原始失败日志和时间点记录在下方，不改写历史。
- [#317](https://github.com/kunlong-luo/pagevela/pull/317) 已修复过期的**桌面** Auto Fit 按钮断言及 `build-and-test` 被 skipped 仍放行的规则缺陷，合并 SHA `e00bcbd8fda9a7f1b59d3ef926d9df9f2b7a43e2`。其 [最新 PR CI](https://github.com/kunlong-luo/pagevela/actions/runs/45320641952) **success**，包含完整 Chromium、Firefox/WebKit 关键回归及真正执行的 `build-and-test`。
- [最新 main CI #45322638640](https://github.com/kunlong-luo/pagevela/actions/runs/45322638640) 在此时仍执行中；取得该 SHA 的 CI + Pages 双成功之前**不能标为正式线上验收通过**。v2.8.3 归档保持原样；[#312](https://github.com/kunlong-luo/pagevela/issues/312) 继续跟踪一键恢复布局、隐藏预览、纸型/中英文模板/Android 真机验收。自动适配是浏览器估算，不保证任意长度的简历都符合目标页数。

## 问题与本次边界

- 旧实现有三种行为：预览 `Preview.tsx` 自己的定时压缩循环；工具栏 `Toolbar.tsx` 每次只改一项；快捷键 `useEditorKeyboardShortcuts.ts` 也是单步。它们甚至使用不同阈值，用户对“Auto Fit”缺乏一致预期。
- 预览页数面板已经提供目标 **1 / 2 / 3 页**，但点击“自动适配”会执行 `setTargetPageLimit(1)`，忽略用户刚刚选择的 2/3 页。本次移除强制重置。
- 统一新 Hook `src/hooks/useMeasuredAutoFit.ts`：**预览可见且完成高度测量时**，工具栏按钮、Cmd/Ctrl+Shift+F 和预览页数面板都进入同一套 `usePaperMeasurement` 溢出反馈循环。预览隐藏（例如移动端表单）时，工具栏/快捷键保留 #311 的安全单步收紧，不虚称已经满足目标。
- `usePaperMeasurement` 提供单调增加的 `measurementRevision`：每次更新排版设置后先等待**新一轮 DOM 真实测量**，不能把旧 `overflowPixels` 直接当成“未改善”；若新测量超过 2.5 秒仍未发生，则安全停止并提示。
- `src/lib/measured-auto-fit-policy.ts` 使用 `metrics.isOver`、`overflowPixels` 作为停止判据：最多 **24 次**单调调整，连续 **4 次**未改善时提前停止；先沿用 #311 已通过测试的 `smartAutoFit` 的最小字号/页边距/段距/行高底线，不进一步收缩 letterSpacing。
- 简历正文、当前 profile、用户目标页数、外部设置或可见性发生变化时终止循环；共享只读预览不能改变用户的本地 resume 设置。运行结果用 Pagevela 品牌 Toast 区分符合目标、停止点或取消，状态不记录个人简历内容。
- 高度判断属于**浏览器预览估计**；实际 ATS 打印、跨浏览器分页和 Quick PDF 仍需要独立检查。较长简历可能仍超过目标页数，应该继续显示溢出而不是虚假的“完美一页”。

## 验收覆盖

- 新单元测试 `src/tests/measured-auto-fit-policy.test.ts` 覆盖目标已满足、真实减少、无变化提前停止、最大调整次数、起始状态及“等待新测量后再决定是否继续”。
- 新 `e2e/measured-auto-fit.e2e.ts` 用虚构多段经历检验：选 2 页、顶部统一入口、结束结果、不跳回 1 页、IndexedDB 草稿重载后不丢。
- 原有 `src/tests/preview-auto-fit.test.ts` 覆盖不逆向变松、下限和收敛；`e2e/pdf-download.e2e.ts` 与 `e2e/pdf-download-failure.e2e.ts` 继续保护 PDF 有效性、失败反馈、草稿安全。
- **当前验收边界**：PR quality/typecheck/lint/Vitest/build 与 Firefox/WebKit critical 已通过；**最后 PR Chromium 全量仍失败**，最终 `build-and-test` 未通过；合并后新 SHA 主分支 CI、同 SHA Pages 仍待单独成功；A4/US Letter × 中/英文 × 1/2/3 目标页 × 各模板 × Android 真实设备的扩展矩阵。未经过这些实测前不关闭 #312。
- 保留旧 IndexedDB 名称、Web Lock、BroadcastChannel、加密分享 AAD、旧备份与历史归档；未添加原生 `alert/confirm/select/tooltip`。

## 验收矩阵与测试证据边界

| 验收维度 | 已包含在当前 PR 的自动测试 | 尚需单独核实 |
| --- | --- | --- |
| 目标 1/2/3 页 | Chromium 以**2 页目标**驱动模拟长简历，验证不重置目标及结束反馈 | 1 页、3 页的完整浏览器级行为 |
| 收敛性 | 单元测试覆盖不反向放松、24 步上限、4 次停滞停止与测量版本号新旧判断 | 实测不同浏览器下每步重排是否稳定、2.5 秒 watchdog 触发路径 |
| 文件数据保护 | Chromium 用虚构 Markdown 检查 IndexedDB 原稿重载后保留 | 切换简历/同时编辑/旧备份兼容及独立真实设备运行 |
| 排版尺寸/语言 | 保留已有的 PDF 打印/导出回归，不修改 PDF 生成器 | A4 + US Letter × 中文 + 英文 × 各布局模板/照片 |
| 手机兼容 | 保留隐藏预览时的安全单步回退，无原生弹框/选择控件 | Android 微信、Chrome/OEM、低端机性能和安装 PWA 离线 |
| 交付证据 | 历史 main `12c7044` 的 [完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947) 与[同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) 已验证，**只覆盖早期改动** | PR #316 最新头完成全部 PR 检查、合并后新 main SHA 完整 CI 与同 SHA Pages |

**现阶段不关闭 #312。** 本文是候选功能开发记录，不把状态栏显示“估计符合目标”理解成真实 PDF 已保存或系统打印分页完全一致。每次后续提交都会刷新最新 PR SHA，对新提交不复用旧 CI 成功结论。

## PR #316 首轮 CI 失败分析（2026-11-24，按提交保留证据）

- 候选提交 `71ef57172789002c6c47c63394ebe2fba18ea2cc` 的 [PR CI #45317407230](https://github.com/kunlong-luo/pagevela/actions/runs/45317407230) 中 quality **success**，Firefox/WebKit critical `e2e-cross-browser` **failure**。通过 [job #138188602846](https://github.com/kunlong-luo/pagevela/actions/runs/45317407230/job/138188602846) 原始日志核验：`96 passed`、`2 failed`，失败均来自 `e2e/simplified-layout.e2e.ts:25`，旧测试查找 `Auto fit to single page|单页自动适配`，而新版按钮的可访问名称已变成 `Fit to selected page target|按目标页数自动适配`。
- 本轮仅更新该 E2E 按钮定位，使其反映实际的新行为。**不回滚新的用户可见含义**，也没有将浏览器失败归因为平台波动。该次 Chromium 全量结果另行核对，不能用 Firefox/WebKit 失败解释/豁免其他测试。
- 新提交必须重新通过 quality、Chromium、Firefox/WebKit、cross-browser 汇总及 `build-and-test`；合并后继续验证新 main CI 和同 SHA Pages。在通过前，#316 不视为已上线。

## 2026-11-24 复验补充：#316 自动合并后发现 Chromium 漏检

- **合并时间和 SHA：** [PR #316](https://github.com/kunlong-luo/pagevela/pull/316) 于 03:31 UTC 已自动合并至 `main` `6532c570b852b0284359d73e7c00632571ef04fb`，但这不是 CI 通过的证据。
- **最后 PR 头 `5485b15`：** [CI #45318654364](https://github.com/kunlong-luo/pagevela/actions/runs/45318654364) 中 quality 和 Firefox/WebKit critical 通过，Chromium 全量 **222 passed、1 failed、1 skipped**。失败在 `e2e/mobile-four-primary-actions.e2e.ts:98`，测试仍检查桌面 `Auto fit to single page`；新版桌面工具栏的真实 aria-label 是 `Fit to selected page target`。此处属于测试维护遗漏，不能据此认定测量循环已通过全部浏览器。
- **修正策略：** 热修复只将**桌面**期望改为目标页数语义，保留移动表单单步回退的 `Auto fit to single page` 名称和对应测试，不牺牲准确的操作说明。**同时修复保护门禁漏洞**：当前规则集仅强制 `build-and-test`，当 Chromium 失败导致该 job 被 skipped 时，GitHub 仍可能完成 auto-merge；现改成该 job `if: always()` 且在 step 内明确验证每个依赖结果，不通过则 exit 1。重新测试且确认**新 main SHA 的 CI 与同 SHA Pages**之前，不将功能标记为已部署验收完成。
- **持续跟踪：** [#312](https://github.com/kunlong-luo/pagevela/issues/312) 已恢复为开放状态，一键恢复布局、移动端隐藏预览和 Android 真机验收仍在范围内；发布包仍是旧 v2.8.3。

## 后续待开发

1. 让不显示预览的移动端表单也具备可测量的隐藏布局/等效真实测量，再取消单步回退。
2. #319 已实现可见预览下的 Auto Fit 前布局一键恢复并通过最新 PR CI；仍需新 main 同 SHA CI/Pages、移动端隐藏预览回退及更广泛兼容矩阵验收。
3. 为 A4/US Letter × 中文/英文 × 长短简历 × 两种以上模板增加分页差异与性能 E2E；量化低端机逐步调整对响应速度的影响。
4. 根据实测修订可读性底线与分页容差，不应通过无限缩小字体强行贴合页数。

[项目状态](./PROJECT_STATUS.md) · [工程验收](./ENGINEERING_ACCEPTANCE_20261124.md) · [路线图](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md) · [#312](https://github.com/kunlong-luo/pagevela/issues/312)
