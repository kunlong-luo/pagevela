# 发布包独立完整性核验 / Published Release archive verification

> **2026-11-25：v2.8.4 发布包已独立验收。** [Verify Release Archives #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) **success**：独立下载 v2.8.4 发布 ZIP/TAR.GZ/SHA256SUMS、重算 SHA-256、验证 ZIP CRC 与 TAR.GZ，核对 **49 个相同文件（4,771,193 未压缩字节）**；保存 JSON 报告 `published-archive-verification`（artifact `14997601035`）。 [PR #331](https://github.com/kunlong-luo/pagevela/pull/331) 合并为源码 `349d94f05749fcfa52b29ebd9ab2a9e19a44caaf`；该 SHA 新主分支 CI/Pages 属于**另一项验收**，不能从归档核验成功推断已经部署。

## 改进目的

发布包已有 `pagevela-X.Y.Z.zip`、`pagevela-X.Y.Z.tar.gz` 与 `SHA256SUMS.txt`；原工作流在打包时写出校验和。此前只确认了平台附件与服务端摘要；2026-11-25 已从发布页实际下载字节、重新计算摘要并比较 ZIP/TAR 文件内容。这一步独立于 CI、Pages 和 GitHub Release 元数据。

本次增加：

1. `scripts/verify_release_assets.py`：不解压到磁盘、不运行归档脚本；逐项重新计算 ZIP、TAR.GZ 的 SHA-256，与发布清单校验；完整读取 ZIP（CRC）及 TAR.GZ；拒绝路径穿越、链接/特殊成员、同一归档内重复文件、过大的解压体积；逐文件比较两个归档的路径、长度和内容 SHA-256。必须包含 `index.html`。
2. `scripts/tests/test_verify_release_assets.py`：使用虚构 HTML/JS 数据，测试合法文件、被改动的下载字节、两个归档内容不一致、无效清单、重复清单项、路径穿越、缺少入口、版本不匹配、预发布标签和 TAR 符号链接。单测进入 `quality`。
3. `release.yml`：**将来创建新版本时**，发布前先本地核验生成的两个包和清单是否自洽，再进行标签与发布；已发布的 v2.8.4 及历史文件不会重写。
4. `.github/workflows/verify-release-archives.yml`：通过 **只读** `contents: read` 从 GitHub Releases 重新下载当前最新版本或指定稳定标签，使用 Python 独立核验，并生成仅包含文件哈希/数量/总字节数的 JSON 验收报告。它在 verifier 相关代码首次进入 main 时运行，此后每周与手动触发也可再次检查。此工作流成功属于**下载归档层**，并不自动意味着 Android、打印或图片功能的真机验收。

## 运行方式 / Commands

已在磁盘上获得三个**真实 Release 附件**时：

```sh
python3 scripts/verify_release_assets.py --version 2.8.4 --dir ./release-verification --report ./release-verification/verification-report.json
```

运行虚构测试样本：

```sh
python3 -m unittest discover -s scripts/tests -p 'test_verify_release_assets.py' -v
```

在 GitHub Actions → **Verify Release Archives** → Run workflow：留空 `tag` 将校验最新正式 Release；填写 `v2.8.4` 可重验该固定标签。每周自动检查默认最新 Release。v2.8.4 的首次核验 Run 为 [#45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817)，报告 artifact ID `14997601035`；可手动重跑其他稳定标签。**每一次新版本或重跑都需独立保留证据**，不能直接复用本次成功。

## 能证明 / 不能证明

- **能证明：** 在该次 Action 运行时，平台对当前 tag 返回的 ZIP/TAR 真实下载字节与随附 SHA256SUMS 声明一致，两个归档均可解析、没有危险的归档路径或额外的文件类型，双方文件内容一致。
- **不能证明：** SHA256SUMS 是否由可信作者独立签名、归档是否经过任何第三方安全审计、真实 Android 打印/PWA 行为、源代码是否与发行二进制完全可复现匹配。这是**完整性**校验，不是供应链证明，也不自动给 [88/100](./ASSESSMENT.md) 加分。
- **失败处理：** 记录 workflow run 链接与失败原因，不覆盖已有标签和附件；针对下一版本修复打包流程。已发布版本不静默替换 ZIP/TAR/清单。

[正式发布说明](../RELEASING.md) · [同 SHA 验收台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [项目状态](./PROJECT_STATUS.md) · [最新评分](./ASSESSMENT.md)
