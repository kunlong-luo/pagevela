# Pagevela 项目状态 / Project status

> **核对日期：2026-11-23。** 这是人工复核的时间点，不是自动更新面板。核对现在的发布情况时，应重新打开 [main](https://github.com/kunlong-luo/pagevela/tree/main)、[Actions](https://github.com/kunlong-luo/pagevela/actions)、[Pages 部署](https://github.com/kunlong-luo/pagevela/actions/workflows/deploy.yml) 及 [Releases](https://github.com/kunlong-luo/pagevela/releases)。**源代码已合并、CI 通过、Pages 已部署和 Release 已打包是四件不同的事。**

## 本次已核对的版本、分支和交付

| 对象 | 截至本次核对的事实 | 证据与边界 |
| --- | --- | --- |
| 受保护的 `main` | [`8bc0a0a`](https://github.com/kunlong-luo/pagevela/commit/8bc0a0aaab4d0a885b5a8d3ec25bca19ac58a15d)，[PR #304](https://github.com/kunlong-luo/pagevela/pull/304) 已于 2026-11-23 合并 | PR 最新提交 `fdc689d` 的 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45156899016) 全绿，且 CodeQL / 注册表审计通过；不等同于合并提交部署完成 |
| `main` 最新完整 CI | [#45159218348](https://github.com/kunlong-luo/pagevela/actions/runs/45159218348)，针对 `8bc0a0a` | **进行中**：质量检查成功，Chromium 与 Firefox/WebKit 真实回归尚待完成；不要标记最终 `build-and-test` 通过 |
| 最近一次**完整 CI 与 Pages 都成功**的源码 | [`93a0941`](https://github.com/kunlong-luo/pagevela/commit/93a0941afc6d782c549caa848e0798fc6509c44b) | [主分支完整 CI #45154252875](https://github.com/kunlong-luo/pagevela/actions/runs/45154252875) 和 [同 SHA Pages #45156598771](https://github.com/kunlong-luo/pagevela/actions/runs/45156598771) 的 build、deploy 均成功 |
| 依赖安全审计 | [`93a0941` 的 Security Inventory #45154252948](https://github.com/kunlong-luo/pagevela/actions/runs/45154252948) | `pnpm audit --json --audit-level=low`：**0 条 npm 注册表公告，退出码 0**；不是 GitHub 私有 Dependabot 告警清零证明 |
| 最新**正式打包** GitHub Release | [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，2026-10-25 | 源码与网站在版本之后多次更新；尚无 v2.8.3 标签或新 ZIP/TAR |
| 尚未合并的 PR | **0**（本次核对时） | #303、#304 均已合并；本次文档修订会通过独立 PR 提交 |

## 已落实的工程修复

- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**新流程的首次合并后实际触发与跳过旧标签的行为尚需独立记录。**

## 尚未完成，不得写成通过

1. **`8bc0a0a` 的生产闭环：** 完整 main-push CI、CodeQL、同 SHA Pages build/deploy，然后检查后续 Release 对已有 v2.8.2 的安全跳过。对每一项记录具体运行号。
2. **安全告警与依赖现代化 [#298](https://github.com/kunlong-luo/pagevela/issues/298)：** 已有 npm 注册表审计结果；仍须以有权限的方式核对 GitHub Dependabot 私有告警，评估 Workbox `filelist → minimatch@5.1.9` 的成熟上游替代方案，不能盲目强制覆盖大版本。
3. **Android 真机 [#262](https://github.com/kunlong-luo/pagevela/issues/262)：** 负责人已报告 Android 微信整体 PASS；尚缺系统 Save-as-PDF/下载、非微信 Chrome/Samsung/OEM、离线 PWA 及逐设备可复现结果。
4. **产品与治理：** [架构 #282](https://github.com/kunlong-luo/pagevela/issues/282)、[中文照片 #200](https://github.com/kunlong-luo/pagevela/issues/200)、[旧产品健康数据 #115](https://github.com/kunlong-luo/pagevela/issues/115) 和 [商标/站外平台 #202](https://github.com/kunlong-luo/pagevela/issues/202) 继续跟踪；不得虚构设备、流量、商标清查或第三方平台操作证据。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
