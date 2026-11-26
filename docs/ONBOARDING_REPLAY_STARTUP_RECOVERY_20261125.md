# 2026-11-25 引导重播与启动恢复检查

> 2026-11-26 复核：原 [#332](https://github.com/kunlong-luo/pagevela/pull/332) 引导重播及启动恢复已包含于后续通过完整 CI 与 Pages 的主分支；最新已验收基线 `626729fc`：[CI](https://github.com/kunlong-luo/pagevela/actions/runs/45622118977) · [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45624338741)。正式发行包仍为 v2.8.4。本文新增的连续重播与实际文字边界测试为待验收候选，不改变运行时代码、IndexedDB、存储迁移或发布附件。

## 排查结果和改动

1. **重新观看新手教程的“下一步”文案被挤压**：引导第 1 步的导航与宽度为 `w-full` 的“直接选择开始方式”按钮处于同一 `flex` 行，窄屏上压缩导航按钮，可导致“下一步 / Next”折行。改为导航独立一行、快捷选择另起一行；“下一步”与“上一步”禁用折行，保持足够触控高度，并用 `onboarding-next` 测试标识稳定定位。
2. **引导弹窗的多余更新**：重播组件先前订阅整个 Zustand Store，编辑器状态的无关更新也会触发引导重渲染。现在使用 `useShallow` 只读取真正需要的状态和操作。
3. **启动过程可能白屏的路径**：`main.tsx` 初始化阶段使用 `Promise.all` 动态导入 React 应用及 Providers。若某模块加载失败，原先的 `void bootstrap()` 没有顶层拒绝处理，React ErrorBoundary 尚未挂载，页面没有可操作的恢复入口。现在在此情形展示轻量、双语的启动恢复界面和重新加载按钮；**不执行任何清空本地简历数据的操作**。

4. **运行时异常页无法复制当前简历**：原异常页仅查询已废弃的旧版 `localStorage` 正文键；在已完成 IndexedDB 迁移的浏览器中，该键已删除，备份按钮可能无内容可复制。现在优先复制 Zustand 的活动简历状态；为空时尝试 IndexedDB，最后才回退到旧键。旧数据迁移流程和数据库内容不被修改。

## 自动回归覆盖

- `e2e/onboarding.e2e.ts`：中文 / 英文 × 320 / 390 / 1280 px 重播流程；检查“下一步”按钮文案、禁止折行、可见性和快捷入口另起一行，再前进到步骤 3，并检查没有页面脚本异常。
- 同文件的启动失败用例：拦截初始化动态 `App.tsx` 模块请求，确认不再出现空白页面，而是出现恢复提示和重试按钮。
- `e2e/runtime-recovery.e2e.ts`：用旧键写入模拟简历并在初始化中迁移到 IndexedDB，再阻断编辑器懒加载以触发 React ErrorBoundary；确认旧键已移除、错误界面备份按钮仍能复制完整活动简历。
- PR 门禁要求：TypeScript、Lint、Vitest、Chromium 完整回归、Firefox/WebKit 关键回归、`build-and-test`；合并后核对 main CI 和同 SHA Pages。单独的用例及分支提交并不代表上述门禁已经通过。

## 2026-11-26 下一阶段回归增强（候选）

- 继续使用现有中文 / 英文 × 320 / 390 / 1280 px 六组测试，不新增平行测试文件或重复文档。
- 通过 DOM Range 测量每个非空文本节点的实际布局矩形，并检查按钮 scrollWidth/clientWidth，避免仅凭 nowrap 或可见性误判文字未被裁切。保留 1 CSS px 的取整容差；不是截图或像素级视觉验收。
- 在第 3 步使用 Escape 关闭引导，从桌面帮助或移动快捷菜单再次重播；确认下一步仍可见且文案完整，点击进入第 2 步而非沿用上次步骤，退出后对比原 IndexedDB 正文且无 pageerror。
- 变更仅涉及已有 E2E 和本专项说明。先通过 PR quality、Chromium 全量、Firefox/WebKit 关键回归与 build-and-test；合并后完整 main CI 和同 SHA Pages 独立验收。未运行成功前不增加工程评分。
- [#342](https://github.com/kunlong-luo/pagevela/pull/342) PDF 页间完整性候选保持独立，不因本测试分支而重启其 CI。正式发布仍须完成全部相关门禁；真机系统打印、OEM/PWA 和长简历性能不由本测试证明。

## 仍未证明的事项

- 用户反馈的“经常崩溃”目前没有具体错误堆栈、设备、浏览器和触发动作；不能断言已找出全部崩溃根因。启动白屏属于已从源码确认的**缺少异常兜底的风险路径**，不是现场复现证据。
- 大型简历、高频编辑、浏览器内存不足、旧 Service Worker/离线缓存、IndexedDB 损坏、Android 微信和 OEM 浏览器需要后续有针对性的真机/运行时取证。
- 发生错误时，尽量先使用现有 ErrorBoundary 的文本备份入口；不要因页面异常直接清空浏览器站点数据。

[返回文档索引](./README.md) · [项目状态](./PROJECT_STATUS.md)
