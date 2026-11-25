# Pagevela v2.8.4 发布验收 / Release acceptance

> **2026-11-24 · 已正式发布并验收 / Published and verified.** 注释标签 `v2.8.4` 解引用为 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`；主分支完整 CI、同 SHA Pages 和 Release 均 success。

## 正式发布验收 / Release checks

- [x] `package.json` = `2.8.4`，双语 README、Changelog、Release Notes、文档索引及历史资料完成整合；`pnpm run docs:check` 已在主分支质量 CI 执行。
- [x] 完整 main CI：[run #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) **success**，包含 quality、Chromium 全量、Firefox 2/2、WebKit 2/2、cross-browser 和实际受保护 `build-and-test`。
- [x] 同 SHA Pages：[run #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) **build + deploy success**。
- [x] 正式 Release：[run #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) **success**；[GitHub v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 于 2026-11-24 发布。
- [x] Annotated tag 对象 `905af3c2` 指向版本提交 `ea2a65b46c8d8211d22489af1e1abe6c4f4be04a`，与三条发布流程一致。
- [x] 发布附件存在：`pagevela-2.8.4.zip`（1,503,102 字节）、`pagevela-2.8.4.tar.gz`（1,475,926 字节）、`SHA256SUMS.txt`（173 字节）；GitHub 提供服务端 digest，**并不等于独立复算**。
- [x] **2026-11-25 发布归档独立下载/完整性验收成功。** [Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) **success**：独立下载 v2.8.4 发布 ZIP/TAR.GZ/SHA256SUMS、重算 SHA-256、验证 ZIP CRC 与 TAR.GZ，核对 **49 个相同文件（4,771,193 未压缩字节）**；保存 JSON 报告 `published-archive-verification`（artifact `14997601035`）。 2026-11-24 其他环境无法下载的历史记录已被此真实成功工作流取代；已发布 tag 和附件未被覆盖。

## 2026-11-25 实际附件验收证据

[Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) **success**：独立下载 v2.8.4 发布 ZIP/TAR.GZ/SHA256SUMS、重算 SHA-256、验证 ZIP CRC 与 TAR.GZ，核对 **49 个相同文件（4,771,193 未压缩字节）**；保存 JSON 报告 `published-archive-verification`（artifact `14997601035`）。 这不等于新 `main` `349d94f` 的完整 CI/同 SHA Pages 已通过；也不等于签名、可复现构建或 Android 系统打印验收。

## 本次交付范围

- [#323](https://github.com/kunlong-luo/pagevela/pull/323) 跨标签页过期写入保护和手动恢复草稿；[#325](https://github.com/kunlong-luo/pagevela/pull/325) 档案 ID 唯一性；Auto Fit / Quick PDF / 编辑器安全通知可靠性提升。
- 历史版本文档归档，README 中英双语导航去重，未部署的旧站跳转试验移除，文档本地链接检查加入 CI；保留原数据库/锁/通道及加密分享协议兼容标识。
- **v2.8.4 是目前正式可下载版本。** 旧 v2.8.3 资产不变，当前工程评估依然为 [88/100](./ASSESSMENT.md)，不为“发布成功”重复加分。

## 不能从 CI 推断的事项

- Android 实际系统打印、保存/打开 PDF、不同 OEM 浏览器和已安装 PWA 的完整真机测试尚未按分项证据独立验收；负责人此前确认的 Android 微信整体通过仍保留。
- 旧版已打开浏览器标签页仍可能绕过新事务保护，照片/全部 Profile 元数据未纳入完整冲突恢复；跨设备同步未实现。
- 备份 JSON 不是加密文件；GitHub 私有安全告警 #298 和商标/外部媒体修改仍需另行确认。
- 本版本是稳定语义版本号，不保证已验证的浏览器产品支持矩阵以外的平台。禁用原生弹窗/Tooltip 的 UI 约束维持。

[RELEASING.md](../RELEASING.md) · [发布说明](../RELEASE_NOTES.md) · [CI/Pages 证据台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [88 分复评](./ASSESSMENT.md)
