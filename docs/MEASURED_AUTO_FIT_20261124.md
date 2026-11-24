# Measured Auto Fit / 目标页数智能适配

> **2026-11-24 功能 PR 候选；尚未完成 PR CI、合并或上线。** [#312](https://github.com/kunlong-luo/pagevela/issues/312) 第二阶段先解决入口分裂、目标页数被重置、无界循环和无进度告知。不要把这份文档写成 v2.8.3 已发布功能，也不要保证任何简历都能压成一页。

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
- **当前尚未验收**：新 PR 的 TypeScript、lint、Vitest、完整 Chromium、Firefox/WebKit、最终 `build-and-test`；合并后新 SHA 主分支 CI、同 SHA Pages；A4/US Letter × 中/英文 × 1/2/3 目标页 × 各模板 × Android 真实设备的扩展矩阵。未经过这些实测前不关闭 #312。
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

## 后续待开发

1. 让不显示预览的移动端表单也具备可测量的隐藏布局/等效真实测量，再取消单步回退。
2. 提供一键恢复 Auto Fit 前布局的明确 UX；当前只能通过现有排版工具手动调整，不能称为完整撤销。
3. 为 A4/US Letter × 中文/英文 × 长短简历 × 两种以上模板增加分页差异与性能 E2E；量化低端机逐步调整对响应速度的影响。
4. 根据实测修订可读性底线与分页容差，不应通过无限缩小字体强行贴合页数。

[项目状态](./PROJECT_STATUS.md) · [工程验收](./ENGINEERING_ACCEPTANCE_20261124.md) · [路线图](./PRODUCT_OPTIMIZATION_ROADMAP_20261124.md) · [#312](https://github.com/kunlong-luo/pagevela/issues/312)
