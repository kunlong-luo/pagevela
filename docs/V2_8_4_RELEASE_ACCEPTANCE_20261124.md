# Pagevela v2.8.4 正式发布验收 / Release acceptance

> **2026-11-24 — 已正式发布 / Published.** [GitHub Release v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，稳定 tag 指向 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`（与发布时 `main`、完整 CI、Pages 相同）。该项目的 **88/100** 是工程维度定性评分，不是 Android 真机认证或第三方安全评分。

## 同 SHA 交付证据 / Independent release gates

| 门禁 / Gate | 证据 | 结果 |
| --- | --- | --- |
| 文档整理 [#327](https://github.com/kunlong-luo/pagevela/pull/327) | 合并 `62ab43d`，[PR 完整 CI #45383283580](https://github.com/kunlong-luo/pagevela/actions/runs/45383283580)、[新 main CI #45384908747](https://github.com/kunlong-luo/pagevela/actions/runs/45384908747)、[同 SHA Pages #45386763610](https://github.com/kunlong-luo/pagevela/actions/runs/45386763610) | **SUCCESS** |
| 版本 PR [#328](https://github.com/kunlong-luo/pagevela/pull/328) | 更新 `package.json` 到 `2.8.4`，PR 最新头 `ec76f57`，[完整 PR CI #45385479696](https://github.com/kunlong-luo/pagevela/actions/runs/45385479696)，并合并为 `ea2a65b` | **SUCCESS** |
| `main` 完整 CI | [#45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722)，提交 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`，包含 quality、完整 Chromium、Firefox 2/2、WebKit 2/2、cross-browser 与实际执行的 `build-and-test` | **SUCCESS** |
| 同 SHA Pages | [#45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138)：`build`、`deploy` 均通过 | **SUCCESS** |
| 自动 Release 工作流 | [#45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140)：校验当前 main SHA / CI / Pages，打包、生成 manifest、发布 | **SUCCESS** |
| 注释 tag | `v2.8.4` tag 对象 `905af3c2c7b15b74fee164c4401fe5a32d7346c1` 解引用到 **`ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`** | **MATCH** |
| GitHub Release | [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，发布于 2026-11-24，`draft=false`、`prerelease=false`、latest | **PUBLISHED** |

## 发布附件 / Assets

| 附件 | GitHub 显示字节数 | GitHub 提供的 SHA256 digest |
| --- | ---: | --- |
| [pagevela-2.8.4.zip](https://github.com/kunlong-luo/pagevela/releases/download/v2.8.4/pagevela-2.8.4.zip) | 1,503,102 | `0334cfc7d9652d4f19ac146d9bd8a8450ab4e4b7e1fb097f40979a07fb1939f3` |
| [pagevela-2.8.4.tar.gz](https://github.com/kunlong-luo/pagevela/releases/download/v2.8.4/pagevela-2.8.4.tar.gz) | 1,475,926 | `3c04142088b2858b90fb81e0236ccb245c8f0ccbd83dd6aae89c19660096411f` |
| [SHA256SUMS.txt](https://github.com/kunlong-luo/pagevela/releases/download/v2.8.4/SHA256SUMS.txt) | 173 | `361a2f05233bb426346689e626503924a0839a00c1bf6d33bc304eeeee093b42` |

> 这三个 digest 来自 GitHub Release Assets API，并非本轮独立下载后在本地复算。**尚未独立下载、解压两个归档并将重新计算的 SHA256 与清单逐项核对**，因此不能将其标为独立哈希验收完成。

## 发布后检查清单 / Final checklist

- [x] v2.8.4 PR 最新头：quality、docs:check、类型检查、lint、单测、Chromium、Firefox/WebKit、实际 `build-and-test` 全成功。
- [x] 版本 PR 经过受保护合并，获取新 main SHA。
- [x] 新 main SHA 完整 CI（含 Firefox/WebKit 全分片及汇总任务）成功。
- [x] **同一 SHA** Pages build 和 deploy 成功。
- [x] 自动 Release 工作流成功，创建不可变 `v2.8.4` tag。
- [x] GitHub Releases 中包含 ZIP、TAR.GZ、SHA256SUMS.txt 三项附件，tag 解引用 SHA 与发布 main 一致。
- [ ] 独立下载、解压并逐一重新计算 ZIP/TAR.GZ 的 SHA256，与 manifest 比较，记录取证方式。

## 兼容与剩余风险 / Scope limits

- 原 `resume-craft` IndexedDB、Web Lock、BroadcastChannel、加密分享协议及旧备份标识是**历史兼容协议**，不能为了品牌文字统一而重命名。原有 v2.8.3 与更早版本的标签、归档和清单保持不变。
- 旧版已打开的标签页可能绕过新事务冲突检查；照片/完整 Profile 元信息的无损恢复、跨设备同步及反复冲突的存储上限仍未完整验收，见 [#282](https://github.com/kunlong-luo/pagevela/issues/282)。
- 负责人确认过 Android 微信真机整体通过；Android 系统 Print/Save as PDF、更多 OEM 浏览器及已安装 PWA 离线模式仍需单项独立记录，见 [#262](https://github.com/kunlong-luo/pagevela/issues/262)。GitHub 私有安全告警 [#298](https://github.com/kunlong-luo/pagevela/issues/298) 亦不得由 report-only 扫描绿灯代替。
- 旧 `/resume-craft/` Pages 地址仍不提供跳转。官网 [Pagevela](https://kunlong-luo.github.io/pagevela/) 采用新路径。

[项目状态](./PROJECT_STATUS.md) · [当前 88 分复评](./ASSESSMENT.md) · [RELEASING.md](../RELEASING.md) · [新版本发布说明](../RELEASE_NOTES.md)
