# Pagevela 发布与安全验收台账 / 2026-11-23

> **证据驱动快照。** 本页记录已观察到的 GitHub Actions 与提交，日期后的新提交必须重新验收。**CI success ≠ Pages deploy success ≠ GitHub Release published**，下文三者分开记录。

## 工程里程碑

| PR / SHA | 已交付变更 | 直接证据 |
| --- | --- | --- |
| [#292](https://github.com/kunlong-luo/pagevela/pull/292)、[#293](https://github.com/kunlong-luo/pagevela/pull/293) | 分栏双击复位修复、草稿历史写入协调 | [#292 主分支 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45021860745) 与 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45022812621)，后续回归也已通过 |
| [#300](https://github.com/kunlong-luo/pagevela/pull/300)、[#301](https://github.com/kunlong-luo/pagevela/pull/301) | 修补 minimatch v10 与 Workbox glob；恢复生产 PWA 预缓存及离线导航测试 | [main `37bb6ae` CI](https://github.com/kunlong-luo/pagevela/actions/runs/45142496880) + [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45144232065) |
| [#303](https://github.com/kunlong-luo/pagevela/pull/303) → [`93a0941`](https://github.com/kunlong-luo/pagevela/commit/93a0941afc6d782c549caa848e0798fc6509c44b) | 发布包 PWA 预缓存/性能/类型门禁；每周、手动、PR 的 npm 只读依赖清单 | [full main CI #45154252875](https://github.com/kunlong-luo/pagevela/actions/runs/45154252875)、[Pages #45156598771](https://github.com/kunlong-luo/pagevela/actions/runs/45156598771)、[audit #45154252948](https://github.com/kunlong-luo/pagevela/actions/runs/45154252948) 全成功 |
| [#304](https://github.com/kunlong-luo/pagevela/pull/304) → [`8bc0a0a`](https://github.com/kunlong-luo/pagevela/commit/8bc0a0aaab4d0a885b5a8d3ec25bca19ac58a15d) | 新 Release 必须等待成功 CI + 同 SHA Pages；禁止覆盖旧标签与发布资产 | [最后 PR head `fdc689d` 的 CI #45156899016](https://github.com/kunlong-luo/pagevela/actions/runs/45156899016) 全成功（包含 Chromium 离线及 Firefox/WebKit 关键回归）；[当前 main-push CI #45159218348](https://github.com/kunlong-luo/pagevela/actions/runs/45159218348) **本次快照仍在进行**，同 SHA Pages 和 Release 未单独确认为通过 |

## 验收边界

### PWA / PDF / 设备

- `dist/sw.js` 的预缓存保护要求有 `index.html` 与编译 JS/CSS；生产 Chromium 测试验证安装 SW 后的离线编辑路由导航。#301 对应 PWA 缺失预缓存的真实回归已经被 CI 检出并修复。
- 原有 PDF 文件解析、文本有效性及导出后草稿保存测试随全量 CI 验证；但桌面浏览器自动化不能替代真实 Android 系统 Print / Save as PDF、微信内置浏览器下载或首次安装后的离线 PDF 导出。
- 用户明确报告 Android 微信**总体真机通过**，这是负责人的测试结果而非本次独立采集的设备矩阵。其余项仍记录在 [#262](https://github.com/kunlong-luo/pagevela/issues/262)。

### 依赖与安全

- 现行 pnpm override 为受影响的 `minimatch >=7 <11.0.1 → 11.0.9`，以及 `workbox-build@7.4.1>glob → 14.0.3`；为 `filelist` 旧 API 暂保留构建期 `minimatch@5.1.9`。该 v5 **不在当初 v10 GHSA 的受影响区间**。
- [#302](https://github.com/kunlong-luo/pagevela/issues/302) 的 glob 漏洞修复已完成并关闭。有关 deepmerge 的 GHSA 后来被撤销，未把撤销公告算作开放安全漏洞。
- [Security Inventory #45154252948](https://github.com/kunlong-luo/pagevela/actions/runs/45154252948)：在 `93a0941` 锁文件上，`pnpm audit --json --audit-level=low` **0 条公告 / exit 0**，有 JSON artifact。这只证明那次 npm 注册表审计结果；它不会列出权限受限的 GitHub Dependabot 私有告警，也不保证未来不会出现漏洞。
- **待办 [#298](https://github.com/kunlong-luo/pagevela/issues/298)：** 获得权限后实际核对 GitHub Alerts；研究稳定上游 PWA/Workbox 替代，不使用不兼容的全局 major override。

### 发行标签与归档

- 最新实际正式 Release 仍是 [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)，对应历史 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/40202793334) 和 [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/40203720040)。其 ZIP/TAR/校验和不受本次源码合并影响。
- [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将未来发布顺序改为 `CI (main push) → Deploy Pages (CI successful) → Release (Pages successful)`，`Release` 会额外校验两个工作流最终任务的结果、当前 SHA、冻结依赖图、预缓存和性能，并拒绝 `--clobber`。**新规则的实际首次发布仍需运行证据，不能把“规则写入”误记成“已打包新版本”。**

## 后续完成条件

- [ ] `8bc0a0a` main-push [CI #45159218348](https://github.com/kunlong-luo/pagevela/actions/runs/45159218348) 全部 job 成功（包括最终 `build-and-test`）。
- [ ] 检查同 SHA Pages 的 build / deploy 结果，并核对自动 Release 在 `v2.8.2` 已存在时不会覆盖归档。
- [ ] 后续有实际版本升级时，核验成功 CI → Pages → Release 的完整证据及 ZIP/TAR/SHA256SUMS 校验结果。
- [ ] [#298](https://github.com/kunlong-luo/pagevela/issues/298) 私有 Dependabot 告警核查；[#262](https://github.com/kunlong-luo/pagevela/issues/262) Android 专项；[#202](https://github.com/kunlong-luo/pagevela/issues/202) 商标与站外平台审核；[#282](https://github.com/kunlong-luo/pagevela/issues/282) 编辑器/Store/导出模块渐进拆分。

[项目状态](./PROJECT_STATUS.md) · [发布操作](../RELEASING.md) · [安全策略](../SECURITY.md) · [历史项目评估](./ASSESSMENT_20261122.md)
