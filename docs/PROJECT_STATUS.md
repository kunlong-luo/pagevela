# Pagevela 项目状态 / Project status

> **更新日期：2026-11-24。** 最新正式发布版本是 [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)；其 tag 解析到 `501ca26a10a023f1a05ce3ce227b288a2a6565d4`（短 SHA `501ca26`）。该 SHA 的 [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125)、[Pages build/deploy](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) 与 [Release](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) 均为 **success**；Release 于 **2026-11-23 14:44 UTC** 发布。三个资产 `pagevela-2.8.3.zip`、`pagevela-2.8.3.tar.gz`、`SHA256SUMS.txt` 均出现在 GitHub Release 中。**本次核对未独立下载解压二进制包并逐项比对 SHA256**；不可将“资产存在”写成“校验通过”。

> 此次继续推进 [#282](https://github.com/kunlong-luo/pagevela/issues/282) 的工作区安全通知 Hook 拆分及测试：**变更仍在 PR 分支，不属于 v2.8.3 线上版本**。合并前需完成 PR CI；合并后需另行核对新 SHA 的 main CI 和同 SHA Pages 部署。工程评分沿用 [2026-11-23 的 84/100](./ASSESSMENT_20261123.md)，不因版本发布或文档修订自动加分。

## 本次已核对的版本、分支和交付

| 对象 | 核验结论 |
| --- | --- |
| 最新正式 GitHub Release | [v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)；发布于 2026-11-23；ZIP/TAR.GZ/SHA256SUMS 三项资产存在 |
| 已发布版本的 tag | Annotated tag `v2.8.3` 指向 `501ca26a10a023f1a05ce3ce227b288a2a6565d4` |
| 该 SHA 的 main CI | [#45194841125](https://github.com/kunlong-luo/pagevela/actions/runs/45194841125) **success**：quality、Chromium、Firefox 2/2、WebKit 2/2、最终 `build-and-test` |
| 该 SHA 的 Pages | [#45197119172](https://github.com/kunlong-luo/pagevela/actions/runs/45197119172) **success**：build 与 deploy 均通过 |
| 该 SHA 的自动 Release | [#45197385098](https://github.com/kunlong-luo/pagevela/actions/runs/45197385098) **success**；实际新标签/资产已创建，区别于先前 v2.8.2 的 no-op |
| 产物完整性边界 | GitHub 展示三项资产；**本轮未独立完成解压和 `sha256sum -c`** |
| 待处理历史分支 | `docs/china-hosting-edgeone-pilot-20261020` 和 `fix/pr-aggregate-check-after-skipped-shard-20261022` 仍存在；未经补丁对比核验不删除 |
| 依赖/设备边界 | Registry Security Inventory 成功不等于私有 Dependabot 告警清零；Android 微信真机负责人报告 PASS，其余手机系统打印/离线矩阵未完整验收 |

本页是**日期快照**。后续合并会改变 `main`，不能直接沿用上述 SHA 的 CI/部署作为新提交证据。[Actions](https://github.com/kunlong-luo/pagevela/actions) · [Releases](https://github.com/kunlong-luo/pagevela/releases)。

## 已落实的工程修复

- **最新架构与文档：** [#308](https://github.com/kunlong-luo/pagevela/pull/308) 已正式合并并完成同 SHA CI/Pages/Release 闭环；[84/100 七维度复评](./ASSESSMENT_20261123.md) 已收录中英文文档索引。[#307](https://github.com/kunlong-luo/pagevela/pull/307) 的编辑器快捷键逻辑现已迁入独立 Hook，新增 Ctrl+S 真实浏览器回归与纯路由单元测试；**合并后 CI、Pages 和 Release no-op 均已通过**，详见 [快捷键架构说明](./EDITOR_KEYBOARD_SHORTCUTS_20261123.md)。
- **分栏和草稿可靠性：** [#292](https://github.com/kunlong-luo/pagevela/pull/292) 的分栏双击回归及 [#293](https://github.com/kunlong-luo/pagevela/pull/293) 的草稿历史并发保护均已合并；11 月 22 日失败的 CI 记录属于历史，不再是当前阻断。
- **PWA 离线构建：** [#300](https://github.com/kunlong-luo/pagevela/pull/300) 修复受影响的 minimatch 版本，[#301](https://github.com/kunlong-luo/pagevela/pull/301) 采用 Workbox 专属 `glob@14.0.3` 并引入真正的生产 Service Worker 预缓存及 Chromium 离线导航检查；[#302](https://github.com/kunlong-luo/pagevela/issues/302) 已关闭。**不能把桌面 Chromium 离线测试写成 Android/微信离线真机通过。**
- **安全治理：** [#303](https://github.com/kunlong-luo/pagevela/pull/303) 引入每周及可手动执行的 [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)（报告保留原始 JSON）并强化下载包的 PWA、类型、国际化及性能检查。
- **发布顺序：** [#304](https://github.com/kunlong-luo/pagevela/pull/304) 已将 `Release` 改为成功 `CI → Deploy Pages → Release` 的自动触发链；手动补发也要检查当前 `main` 同 SHA 的成功 CI 最终 `build-and-test` 和 Pages `deploy`。既有发布的 tag 和附件不覆盖。**既有 v2.8.2 的安全跳过已在多个 SHA 核验；v2.8.3 首次创建标签和归档仍待实际运行。**

## 尚未完成，不得写成通过

1. **v2.8.3 发布资产二进制完整性：** Release 文件和校验和清单均存在，但本轮尚未独立下载解压、执行逐项 SHA256 比对；本项不应勾选。
2. **本轮 Hook 代码变更：** 新安全通知拆分需要通过 PR CI、review、main 合并后 CI 与 Pages 的**新 SHA** 验收；不得写成已发布在 v2.8.3。
3. **Android 真机 #262：** 负责人报告微信真机总体 PASS；系统 Save-as-PDF、Chrome/Samsung/OEM、安装后 PWA 离线尚无完整独立矩阵。
4. **GitHub 私有安全告警 #298：** npm 注册表无公告不能证明私有 Dependabot 告警清零；旧 Workbox 依赖路径仍待研究。
5. **架构和外部治理：** #282、#200、#115、#202 继续跟踪；本轮 84 分不自动提升。

## 当前操作文档与历史

- [发布流程 / Release](../RELEASING.md) — 版本、SHA 验证、标签不可覆盖、失败恢复。
- [安全策略 / Security](../SECURITY.md) — 私密报告与审计覆盖范围。
- [发布与安全验收台账（2026-11-23）](./RELEASE_SECURITY_ACCEPTANCE_20261123.md) — 运行证据、检查边界、持续待办。
- [2026-11-23 84/100 工程复评](./ASSESSMENT_20261123.md) — 七维度评分、CI/Pages 证据、优先级和扣分。
- [2026-11-22 原始状态记录](./history/PROJECT_STATUS_20261122.md) 和 [当日 76/100 历史评估](./ASSESSMENT_20261122.md) — 保留原始时间点，不作为当日实时结论。

**品牌/数据兼容底线：** Pagevela 官网只使用 `/pagevela/`，不主动恢复 `/resume-craft/` 旧站跳转；保留既有 IndexedDB、跨标签页协调标识及旧备份/加密分享的可读性，不修改历史发布附件。
