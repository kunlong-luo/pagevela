# Pagevela 功能优化路线图 / Product optimization review — 2026-11-24

> **状态：源代码审查形成的工作优先级，不等同线上缺陷全部复现或新版本验收。** 正式发行基线为 [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)，main `501ca26` 的 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125)、[同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172)、[Release](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) 成功。工程定性分数仍沿用 [84/100（2026-11-23）](./ASSESSMENT_20261123.md)，不因本次修复草案自动提高。已发布档案不覆盖；任何新代码必须重新验收。

## 2026-11-24 后续状态（原始审查结论仍保留）

- [#311](https://github.com/kunlong-luo/pagevela/pull/311) 已合并为 `e8fdda0`，同步后的头 `56ecc0e` [完整 PR CI](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066) 通过；新 main 的部署验收仍须独立核对。**只修复“越按越松”，不保证实际一页排版。**
- [#310](https://github.com/kunlong-luo/pagevela/pull/310) Hook 拆分已在 `16b11ff` 完成 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) 和 [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196)。
- [#314](https://github.com/kunlong-luo/pagevela/pull/314) Quick PDF 零页防护仍在独立 PR 验收；[#312](https://github.com/kunlong-luo/pagevela/issues/312) 的溢出量闭环未实现。工程评分沿用 **84/100**。

## 审查范围和可核对证据

- 智能单页：`src/lib/preview-utils.ts:smartAutoFit` 原实现是**单步规则压缩**；在所有条件未命中时回填固定的 `blockGap=0.4`、`lineHeight=1.3`，可能把已更紧凑的 `0.3/1.2` 放大。快捷键 `useEditorKeyboardShortcuts` 无论是否调整，都会显示成功文案。这是代码可直接复现的确定性问题。
- 预览测量：`src/hooks/usePaperMeasurement.ts` 已使用 MutationObserver/ResizeObserver + RAF，计算 `actualPages` 和 `overflowPixels`；但 `smartAutoFit` 没有读取页面测量结果，不是“自动找到最合适的一页”。**需要进一步评估**分段收敛、可读性底线及用户选择页数，不应宣称已实现。
- PDF：`src/hooks/useResumeActions.ts` 区分 ATS 浏览器打印与 Quick PDF 光栅导出；`pdf_export_success` 对 Quick PDF 有实际执行点，对浏览器打印仅有 `browser_print_started`，不能把打印窗口打开等同下载成功。`src/lib/pdf-export.ts` 用 html2canvas + jsPDF 分页；真机系统 Save-as-PDF 仍在 [#262](https://github.com/kunlong-luo/pagevela/issues/262)。
- 本地数据：`src/lib/resume-persistence.ts` 已串行化同标签页写入；`BroadcastChannel` 目前只警示另一个编辑标签页，不提供冲突合并/恢复，跨标签页“最后写入可能覆盖较旧状态”仍然是风险；见 [#282](https://github.com/kunlong-luo/pagevela/issues/282)。
- 架构/性能：`src/components/Editor.tsx` 约 **921 行**、`src/store/useResumeStore.ts` 约 **1043 行**、`src/lib/export-utils.ts` 约 **1583 行 / 50KB**。这里只能推断可维护性负担，**不能据文件大小声称已经测得性能退化**；应先获取长文档输入延迟、页面更新耗时、JS chunk 和低端机内存数据。
- 移动端：已有 44px 触控、底部操作栏/预览避让及跨浏览器 E2E；真实 Android Chrome/OEM、微信导出和安装后离线 PWA 证据仍缺完整矩阵。
- 用户决策数据：[产品健康 #115](https://github.com/kunlong-luo/pagevela/issues/115) 的真实访客→开始编辑→成功导出数据尚未形成可复核漏斗；不凭空填 0 或推断转化率。

## 分阶段优先级与完成门槛

| 顺序 | 价值与实现范围 | 可以宣称完成的证据 |
| --- | --- | --- |
| **P0 — Auto Fit 不逆向变松** | 移除已到下限时的反向重置；只修改一项且严格非扩张；提供是否有效调整的返回值；修正快捷键空操作提示 | 纯函数单元测试：重复点击不放大、单调性、收敛、临界值；完整 PR CI/浏览器 E2E 及合并后 same-SHA Pages |
| **P0 — 多标签页数据保护** | 在现有警告/写锁基础上，先设计 revisions/version 冲突检测、保留副本/用户选择，不自动覆盖或静默合并 | 模拟两个真实标签页同时改同份简历，证明冲突前数据可恢复；不更改旧 IndexedDB/分享协议 |
| **P1 — Auto Fit 真正闭环** | 结合已有 `overflowPixels`/页数测量设计可读性优先的多步压缩，设置可撤销、允许一/二/三页目标 | A4/US Letter、长短中英文、不同模板 E2E；压缩前后页面数量/最低字号/文本可读性比较，不保证任意文本可塞入一页 |
| **P1 — PDF 成功/失败体验** | 区分“浏览器打印已打开”和“实际 PDF 生成成功”，增强 Quick PDF 取消/失败恢复提示及真实手机测试 | PDF parser、文本保留、分页、防截断、原始草稿不丢；Android 真机记录机型、浏览器、步骤和 SHA；不伪造浏览器下载成功埋点 |
| **P1 — 编辑/预览性能** | 渐进拆分 Editor/Store/导出管线，减少非必要重绘，保持懒加载和原生 UI 禁用策略 | 大文档输入延迟、预览渲染、弱网首屏/资源体积基线与对比；Chromium/Firefox/WebKit CI；不破坏数据 |
| **P2 — 表单/Markdown 双向编辑** | 覆盖复杂列表、超链接、日期、不同市场简历段落、撤销/重做和 IME 光标 | 中英文真实输入、切模式/重载后内容不漂移、无多余字段回写；完整 E2E |
| **P2 — PWA/外部治理** | 依 [#262](https://github.com/kunlong-luo/pagevela/issues/262)、[#298](https://github.com/kunlong-luo/pagevela/issues/298)、[#202](https://github.com/kunlong-luo/pagevela/issues/202) 分别完成设备验收、私有告警核对和商标/站外链接证据 | 不以 Chromium 离线自动化代替安装后 PWA 真机，不以 registry 0 advisory 代替私有 Dependabot 审核 |

## 本轮实施范围及保留的边界

原始审查提出的**Auto Fit 单调性修复**：在 `smartAutoFit` 中移除达到下限后反向调松的兜底；让返回值表示是否修改；重复操作收敛为 no-op；更新 Ctrl/Cmd+Shift+F 的提示，避免虚假的“一键完成一页”暗示。运行时不会修改 IndexedDB/旧备份/加密分享/打印实现；相关代码现在已通过 PR CI 并合并为 `e8fdda0`，新主分支 CI/Pages 仍需独立核验；**该修复不包含在 v2.8.3 正式压缩包中**。

后续完整 Auto Fit 闭环、多标签页版本冲突保护、Store 和导出拆分应各自独立 PR，不应一次性重构。保持 **Pagevela 唯一品牌、非原生对话框/下拉/tooltip、移动端可触及按钮及隐私优先** 的现有工程约束。

[项目状态](./PROJECT_STATUS.md) · [文档索引](./README.md) · [架构 issue #282](https://github.com/kunlong-luo/pagevela/issues/282)
