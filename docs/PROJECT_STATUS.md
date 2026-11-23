# Pagevela 项目状态 / Project status

> **2026-11-23 当前发版准备：** #307 合并 SHA [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed) 的 [CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889)（Chromium、Firefox/WebKit 全分片、最终 `build-and-test`）、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398)（build/deploy）、[Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214)（已有 v2.8.2 安全跳过）均 **success**。新 [#309](https://github.com/kunlong-luo/pagevela/pull/309) PR 同步将 `package.json`、中英文 README 与发行文档升级到 **v2.8.3 候选**。该 PR 尚未合并；新版本 tag、ZIP/TAR 与校验和**尚未创建/验证**，最新正式下载仍为 [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)。工程复评仍为 [84/100](./ASSESSMENT_20261123.md)。

> **核对日期：2026-11-23。** 这是人工复核的时间点，不是自动更新面板。核对现在的发布情况时，应重新打开 [main](https://github.com/kunlong-luo/pagevela/tree/main)、[Actions](https://github.com/kunlong-luo/pagevela/actions)、[Pages 部署](https://github.com/kunlong-luo/pagevela/actions/workflows/deploy.yml) 及 [Releases](https://github.com/kunlong-luo/pagevela/releases)。**源代码已合并、CI 通过、Pages 已部署和 Release 已打包是四件不同的事。**

## 本次已核对的版本、分支和交付

| 对象 | 状态及证据 |
| --- | --- |
| 目前已通过完整生产验收的 `main` | [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed)：[CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889) 全绿、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398) build+deploy success、[Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214) 安全跳过已发布 v2.8.2 |
| 先前已部署版本 | [`077e649`](https://github.com/kunlong-luo/pagevela/commit/077e64991801b3f30b4b5cdb2e594ea3c278af36)：[CI](https://github.com/kunlong-luo/pagevela/actions/runs/45172148513)、[Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45174090788)、[Release](https://github.com/kunlong-luo/pagevela/actions/runs/45174220771) 同 SHA 全成功 |
| 目标新发行版本 | **v2.8.3 候选**，[#309](https://github.com/kunlong-luo/pagevela/pull/309) 中；须走新 main SHA 的 CI、Pages、Release，验证 `pagevela-2.8.3.zip`、`.tar.gz` 和 `SHA256SUMS.txt` |
| 最新**已发布** GitHub 下载 | [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)；历史 tag/附件不能被新源码覆盖 |
| 依赖安全 | [#309 Security Inventory #45186834417](https://github.com/kunlong-luo/pagevela/actions/runs/45186834417) 为 registry 0 advisory；私有 GitHub Dependabot 告警未核实 |

## 已落实的工程修复

- **最新架构与文档：** [#308](https://github.com/kunlong-luo/pagevela/pull/308) 已正式合并并完成同 SHA CI/Pages/Release 闭环；[84/100 七维度复评](./ASSESSMENT_20261123.md) 已收录中英文文档索引。[#307](https://github.com/kunlong-luo/pagevela/pull/307) 的编辑器快捷键逻辑现已迁入独立 Hook，新增 Ctrl+S 真实浏览器回归与纯路由单元测试；**合并后 CI、Pages 和 Release no-op 均已通过**，详见 [快捷键架构说明](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)。
- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**既有 v2.8.2 的安全跳过已在多个 SHA 核验；v2.8.3 首次创建标签和归档仍待实际运行。**

## 尚未完成，不得写成通过

1. **v2.8.3 首次新包发行：** [#309](https://github.com/kunlong-luo/pagevela/pull/309) 新头提交通过 CI/CodeQL/安全审计后方可合并；合并后必须再次核对新 SHA 的完整 CI → Pages build/deploy → Release 新 tag 与 ZIP/TAR/SHA256SUMS。不能以 v2.8.2 no-op 当成新版本已发布。
2. **Android 真机 #262：** 负责人报告微信真机总体 PASS；系统 Save-as-PDF、Chrome/Samsung/OEM、安装后 PWA 离线尚无完整独立矩阵。
3. **GitHub 私有安全告警 #298：** npm 注册表无公告不能证明私有 Dependabot 告警清零；旧 Workbox 依赖路径仍待研究。
4. **架构和外部治理：** #282、#200、#115、#202 继续跟踪；本轮 84 分不自动提升。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-23 84/100 工程复评](./ASSESSMENT_20261123.md) — 七维度评分、CI/Pages 证据、优先级和扣分。
- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
