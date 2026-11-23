# Pagevela 状态快照 / Project status

> **最新复核：2026-11-23（本段取代下方 11-22 的历史状态，不代表持续实时监控）**  
> 受保护的 `main` 为 [`37bb6ae`](https://github.com/kunlong-luo/pagevela/commit/37bb6aec3b1b90d47ecd9cdc294ab7331802b68c)。[同 SHA 完整 CI #45142496880](https://github.com/kunlong-luo/pagevela/actions/runs/45142496880) 已通过：质量、Chromium 全量、Firefox/WebKit 全量分片、PWA 生产离线导航及最终 `build-and-test`；[CodeQL #45142496687](https://github.com/kunlong-luo/pagevela/actions/runs/45142496687) 与 [Pages #45144232065](https://github.com/kunlong-luo/pagevela/actions/runs/45144232065) 均成功。  
> 本次复核时的**最新正式下载包仍为 [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)**（2026-10-25），不是 `37bb6ae` 的重新打包版本。  
> 安全状态：[#300](https://github.com/kunlong-luo/pagevela/pull/300) 的 minimatch 修复与 [#301](https://github.com/kunlong-luo/pagevela/pull/301) 的 glob/PWA 修复已部署，[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭；[#298](https://github.com/kunlong-luo/pagevela/issues/298) 仍跟踪 Workbox 旧依赖与 GitHub 私有告警核对。  
> [PR #303](https://github.com/kunlong-luo/pagevela/pull/303) 正在独立验收 Release 预缓存门禁与 npm 注册表审计。PR 内的 [Security Inventory #45151226793](https://github.com/kunlong-luo/pagevela/actions/runs/45151226793) 对当前锁文件返回 **0 条注册表公告**；这不等于完整 GitHub Dependabot 告警数为 0。**PR 尚未合并，不能把其代码归于 `main`。**  
> 剩余产品问题：[架构 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[Android 真机 #262](https://github.com/kunlong-luo/pagevela/issues/262)、[品牌 #202](https://github.com/kunlong-luo/pagevela/issues/202)、[中文照片 #200](https://github.com/kunlong-luo/pagevela/issues/200)、[旧版本验收 #115](https://github.com/kunlong-luo/pagevela/issues/115)。Android 微信人工通过记录不等于 Android 系统离线/PDF 打印也已测试。  

---

> **2026-11-22 补充核验（以下失败记录已被后续修复所取代）：** [PR #292](https://github.com/kunlong-luo/pagevela/pull/292) 已合并到 `main`，提交 `93d3d8a5a11e9c7bc072a326c2f0b53eabc075c7`。该 SHA 的 [完整主分支 CI #45021860745](https://github.com/kunlong-luo/pagevela/actions/runs/45021860745) 成功（quality / Chromium / Firefox / WebKit / `build-and-test`），[同 SHA Pages #45022812621](https://github.com/kunlong-luo/pagevela/actions/runs/45022812621) 成功。原 `992374a` 的分栏双击复位回归已经完成修复与部署闭环。后续草稿并发修复 [PR #293](https://github.com/kunlong-luo/pagevela/pull/293) **仍待独立 CI/合并/部署验收**。正式 GitHub Release 仍为 v2.8.2，不能把新版源码称为已重新打包的发布资产。

**核验日期：2026-11-22（基于当日 GitHub Actions 和 `main`）**。这是一份可追溯的**定时快照**，并非实时监控。新 PR 可能改变下面的结果；查看 [最新 Actions](https://github.com/kunlong-luo/pagevela/actions) 和 [分支](https://github.com/kunlong-luo/pagevela/branches) 后再作当前发布判断。

## 已核对的版本和提交

| 检查项目 | 2026-11-22 证据 | 结论 |
| --- | --- | --- |
| 当前 `main` | `992374a247a312912d8bab9d327cf7c5a3883523`（[PR #283](https://github.com/kunlong-luo/pagevela/pull/283) 合并） | **源代码领先于最后一次验证通过的部署** |
| 最新稳定 GitHub Release | [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，2026-10-25 发布，包含 `pagevela-2.8.2.zip` / `.tar.gz` / `SHA256SUMS.txt` | 保持已发布资产，不重新打包或改历史校验和 |
| 最近一次核验成功的 Pages 部署 | [#40295215435](https://github.com/kunlong-luo/pagevela/actions/runs/40295215435)，提交 `712dee2a461906c46b9140ffcbc7c75e22d546fd`，2026-10-26 | **不能证明后续 `992374a` 已部署** |
| 最新主分支 CI | [#45017892041](https://github.com/kunlong-luo/pagevela/actions/runs/45017892041)，2026-11-22 | **FAILED**；质量/单元测试通过，但多个浏览器 E2E 失败 |
| 最近一次 Pages workflow | [#45018795903](https://github.com/kunlong-luo/pagevela/actions/runs/45018795903)，2026-11-22 | **SKIPPED**；与主分支 CI 失败有关 |
| 依赖更新 PR | [#288](https://github.com/kunlong-luo/pagevela/pull/288)、[#290](https://github.com/kunlong-luo/pagevela/pull/290)、[#291](https://github.com/kunlong-luo/pagevela/pull/291) | 均为开放 PR；不能声称已合并 |

## 当前 CI 阻塞原因（有日志证据）

浏览器 E2E `e2e/workspace-split-pane.e2e.ts` 的“双击分栏复位”断言失败：预期 `localStorage['resume-split-ratio'] === '50'`，实际是 `'60.9375'`。2026-11-22 的 Chromium、Firefox、WebKit 日志都包含此失败；11-20、11-21 同 SHA 主分支 CI 同样未通过。

技术审查定位到 `Tooltip`：其 `disabled` 状态在拖拽开始时可以从带包装 DOM 切换成 fragment，打断连续鼠标双击的事件目标。修复策略是**只在分栏手柄上保持 Tooltip DOM 包装稳定**、忽略双击的第二次拖拽起点，并在明确复位时结束拖拽；依然由现有浏览器 E2E 判定修复是否成立。**这是修复假设，不是已经通过验收的结果。**

**发布门禁：** 修复 PR 最新提交质量、Chromium、Firefox/WebKit 与最终 build-and-test 全绿 → 合并到 `main` → `main` 完整 CI 全绿 → GitHub Pages 同一 SHA 完成 build/deploy → 必要时网页独立 smoke check。缺任何环节都不宣称最新版已上线。

## 可复核的工程指标

2026-11-22 CI [quality job](https://github.com/kunlong-luo/pagevela/actions/runs/45017892041) 中：**47 个 Vitest 文件通过**；TypeScript/ESLint/构建及性能预算通过（质量 job 结论 success）。构建 gzip 指标：

| 性能指标 | 结果 | 预算 / 备注 |
| --- | ---: | --- |
| 初始 JS | 160.8 KiB | 260 KiB |
| 欢迎页应用 JS | 21.1 KiB | 45 KiB |
| 编辑器路由 | 76.6 KiB | 按需载入 |
| 全站 CSS | 29.1 KiB | 32 KiB；接近上限 |
| PDF 工具 | 725.8 KiB | gzip；按需加载，**不是首屏 JS** |

这些是**打包体积指标，不是 Android 或用户网络条件下的加载耗时**。

## 开放事项及边界

- [#282 — 架构优化](https://github.com/kunlong-luo/pagevela/issues/282)：活跃快照写入协调已合并（[#281](https://github.com/kunlong-luo/pagevela/pull/281)）；分栏/自动草稿 Hook 已合并（[#283](https://github.com/kunlong-luo/pagevela/pull/283)），但其浏览器复位回归仍待修复验收。草稿历史还有独立写入竞争风险。
- [#262 — Android 真实设备](https://github.com/kunlong-luo/pagevela/issues/262)：负责人此前报告 Android 微信真机整体 PASS；Android Chrome、其他 OEM、真实 Save as PDF、下载、安装 PWA 离线与逐项 A–H 的证据未完整记录，**不可视为已通过**。
- [#202 — 品牌和迁移](https://github.com/kunlong-luo/pagevela/issues/202)：品牌已经用于仓库和官网，但商标核验、站外列表更新需要独立确认。
- [#200 — 中文简历照片](https://github.com/kunlong-luo/pagevela/issues/200)、[#115 — v2.4.x 旧验收](https://github.com/kunlong-luo/pagevela/issues/115)：目前仍开放，建议核对功能实现/验收条件后关单或拆分，不能因代码有相关功能就直接关闭。
- [历史 EdgeOne PR #240](https://github.com/kunlong-luo/pagevela/pull/240) 及 [旧 CI PR #271](https://github.com/kunlong-luo/pagevela/pull/271) 对应的旧远程分支仍存在；均已关闭未合并。**不要重新合并或未经核对激活旧托管配置**。

## 行动顺序

1. **P0 恢复主分支 CI 和同 SHA Pages 部署**，严格以修复后的实际结果验收。
2. **P1 处理历史草稿写入竞争、完善 Android PDF/离线真机矩阵**，补可核验证据。
3. **P1 整理 Dependabot PR 与过期 Issue**，按通过测试/兼容性风险合并或关闭，清理已确认无用的分支。
4. **P2 继续拆分大型编辑器与导出模块，降低 CSS 压力**；谨慎处理既有 IndexedDB 名称，不做破坏性改名。

网站：[Pagevela](https://kunlong-luo.github.io/pagevela/) · [源代码](https://github.com/kunlong-luo/pagevela) · [文档索引](./README.md)
