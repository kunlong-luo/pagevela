# Releasing Pagevela / 版本发布流程

> **现行流程（2026-11-23）**：由 [PR #304](https://github.com/kunlong-luo/pagevela/pull/304) 合并引入的 `CI → Deploy Pages → Release` 门禁。此文是当前操作指南，而不是自动状态面板。发版前请核对 [最新项目状态](docs/PROJECT_STATUS.md) 和 [实际 Actions](https://github.com/kunlong-luo/pagevela/actions)。
>
> **2026-11-23 最近实际验收成功的线上源码：** [`ac2932c`](https://github.com/kunlong-luo/pagevela/commit/ac2932c9fa660febffce1613bbfd8fa9f561a3ed) 的 [CI #45185347889](https://github.com/kunlong-luo/pagevela/actions/runs/45185347889)、[Pages #45188965398](https://github.com/kunlong-luo/pagevela/actions/runs/45188965398)（build/deploy）及 [Release #45189104214](https://github.com/kunlong-luo/pagevela/actions/runs/45189104214)（已有 v2.8.2 安全跳过）全部成功。**正式已发布下载仍是** [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2)。
>
> **v2.8.3 正在准备：** #309 更新唯一版本号 `package.json`、中英文 README、CHANGELOG、RELEASE_NOTES 及 [发行验收清单](docs/V2_8_3_RELEASE_ACCEPTANCE_20261123.md)。在其最新头 PR CI、合并后完整主分支 CI、同 SHA Pages 和**首次** GitHub Release 的三个新资产均真实验收前，不能称已正式发布，也不能改写 v2.8.2 tag 或附件。

## 版本与交付对象

- 版本以 `package.json` 的稳定三段号 `X.Y.Z` 为准。禁止 alpha、beta、rc、canary、next 等预发布标签。
- GitHub Release 附件为 `pagevela-X.Y.Z.zip`、`pagevela-X.Y.Z.tar.gz`、`SHA256SUMS.txt`；原有历史文件的名称、内容和校验和保持不变。
- 官方站点是 <https://kunlong-luo.github.io/pagevela/>。不配置 `/resume-craft/` 自动跳转；保持旧用户 IndexedDB、备份和加密分享兼容。
- **四个独立的验收对象：** PR 测试、main-push 完整 CI、同 SHA Pages `deploy`、GitHub Release 标签与附件。必须分别核对，不以单个绿色徽标替代。

## 自动发布顺序

1. 经 PR 审核，将已验证的修复和文档合并到 `main`，待需发布内容准备完毕后，另建正常 PR 把 `package.json` 从旧版本提高到新的稳定版本（例如 `2.8.3`）。
2. **版本 PR** 通过质量、完整 Chromium（含生产 SW 离线导航）、Firefox/WebKit 关键回归、CodeQL 和最终 `build-and-test`，然后合并。
3. **main-push CI** 在版本合并 SHA 上完成：`quality`、Chromium 全量、Firefox/WebKit 全量分片与最终 `build-and-test` 必须均为 success。
4. 成功的 CI 触发 `Deploy Pages`。它检验 SHA 未被后续 `main` 替代，并实际完成 `build`、预缓存检测和 `deploy`。
5. **只有成功的 CI-gated Pages 工作流** 才自动触发 `Release`。该工作流再次从 GitHub Actions API 核实当前 `main` 的同 SHA 成功 `CI`（且 `build-and-test` 成功）及 `Deploy Pages`（且 `deploy` 成功），不信任默认分支 `GITHUB_SHA` 代替上游 SHA。
6. `Release` 对新版本使用 frozen pnpm 锁文件，运行稳定依赖检查、标准/严格类型检查、双语标签审计、ESLint、Vitest、生产构建、PWA app-shell precache 验证和性能预算。**先生成 ZIP、TAR.GZ 和 SHA256SUMS.txt，再校验最新 main，创建或复用未发布的同 SHA 标签，最后发布 GitHub Release**。
7. 核对 `vX.Y.Z` 标签确实指向被 CI 与 Pages 验证的提交、两个附件能下载且校验和正确，并核对官网线上同 SHA 部署记录。以上均通过才可宣称版本交付完成。

`Release` 的自动触发条件是 `Deploy Pages` 的成功完成事件，不再是简单的 `package.json` push。由于这个流程在 #304 合并时版本未变化，**不能把工作流安装、CodeQL 成功误当成已运行过一次真正的新版本发布**；首次新版本发布时还须检查整个顺序的实际运行证据。

## 手动补发与故障处理

- `Actions → Release → Run workflow` 只能选择当前 `main`，输入必须与 `package.json` 完全相同的稳定版本号。它**同样要求当前 SHA 的完整 main-push CI 与 CI-gated Pages 成功**，不能绕过验收。
- 如果版本标签已指向历史其他提交，普通未修改版本的主分支推送会**跳过**本次发布；对已存在标签号执行新的版本变更则**报错**，不能重用或移动已发布版本号。
- GitHub Release 已存在则不会覆盖其资产，**禁止 `gh release upload --clobber`**。如果标签存在且指向当前提交、但 Release 尚未创建，可在核实状况后补发首次 Release。
- 如果标签缺失但同版本 Release 存在，工作流拒绝盲目补标签。若 CI、Pages 或 main SHA 发生变化，暂停而不是发布旧包。部分失败需要人工核验现有 tag、附件和 checksum，避免覆盖。
- 若 ZIP/TAR 产物验证失败，应修复问题并按正常新 PR 和新稳定版本流程重试；不要静默替换旧附件。

## 相关证据与未结事项

- [发布、安全与部署验收台账](docs/RELEASE_SECURITY_ACCEPTANCE_20261123.md) · [项目状态](docs/PROJECT_STATUS.md) · [Security Inventory](https://github.com/kunlong-luo/pagevela/actions/workflows/security-inventory.yml)
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：完整 GitHub Dependabot 告警与 Workbox 旧依赖链。
- [#262](https://github.com/kunlong-luo/pagevela/issues/262)：Android/微信真机设备矩阵，自动化浏览器通过不构成系统打印及离线真机认证。
- [#202](https://github.com/kunlong-luo/pagevela/issues/202)：商标与站外平台外部手续不因 GitHub 发版自动完成。
