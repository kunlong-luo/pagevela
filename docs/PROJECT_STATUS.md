# Pagevela 项目状态 / Project status

> **核验日期：2026-11-26。** 此处是精确 Git SHA 的验收快照，不是实时 Actions 控制台。最新版正式发布包仍为 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，随后合并到 main 的代码**不会自动进入历史 ZIP/TAR**。

## 已完成的同 SHA 生产验收

| 功能 | main SHA | 完整主分支 CI | 同 SHA Pages |
| --- | --- | --- | --- |
| [#339](https://github.com/kunlong-luo/pagevela/pull/339) 切后台提前保存 | `f88407d0b27c8fe23ecda3cb1d3f96ec7aa726cc` | [#45615761703](https://github.com/kunlong-luo/pagevela/actions/runs/45615761703) **success** | [#45617579641](https://github.com/kunlong-luo/pagevela/actions/runs/45617579641) **success** |
| [#340](https://github.com/kunlong-luo/pagevela/pull/340) Quick PDF 大画布预算/分页缓冲复用 | `0c5c445be24d600fabb992870bb6d500c48a871b` | [CI #45619738725](https://github.com/kunlong-luo/pagevela/actions/runs/45619738725) **success** | [Pages #45620379121](https://github.com/kunlong-luo/pagevela/actions/runs/45620379121) **success** |
| **[#341](https://github.com/kunlong-luo/pagevela/pull/341) Quick PDF 尾页内容完整性** | **`626729fc6cd1a4d9cc7a9083b6f81ddc287108ae`** | [CI #45622118977](https://github.com/kunlong-luo/pagevela/actions/runs/45622118977) **success** | [Pages #45624338741](https://github.com/kunlong-luo/pagevela/actions/runs/45624338741) **success** |

前序已验收的 [#334 简历防覆盖](https://github.com/kunlong-luo/pagevela/pull/334)、[#337 完整数据清理](https://github.com/kunlong-luo/pagevela/pull/337)、[#335/#338 真实写入回执与启动保护](https://github.com/kunlong-luo/pagevela/pull/335) 及历史 CI/Pages 证据保存在 [工程验收台账](./ENGINEERING_ACCEPTANCE_20261124.md)。当前**最新已独立验证主分支**是 `626729fc`。

## 正式发行与未完门槛

- **正式 Release：** [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，tag `ea2a65b`；[CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722)、[同 SHA Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138)、[Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) 均 success；[ZIP/TAR.GZ/SHA256 独立校验 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) success。后续 success 的 Release 工作流不代表产生了新的正式 tag。
- **[#342](https://github.com/kunlong-luo/pagevela/pull/342) Quick PDF 智能分页间隔完整性：** 正在验收的 PR。用 **32,768 像素**分块、全宽逐像素扫描替代分页边界的稀疏抽样，避免淡色字形被误判为可截断空白。详见 [专项说明](./QUICK_PDF_SMART_SPLIT_INTEGRITY_20261126.md)；完整 PR CI、合并及新 main 的同 SHA CI/Pages **尚未完成**，不计作上线。
- **仍未覆盖的风险：** 大画布内存保护和尾页/页间完整性修复尚无低端 Android CPU/内存实测；极快后台强杀仍不保证异步 IndexedDB 落盘；[#262](https://github.com/kunlong-luo/pagevela/issues/262) 的 Android 系统打印、OEM 浏览器、安装 PWA、真实下载单项未各自确认；[#312](https://github.com/kunlong-luo/pagevela/issues/312) 真实打印分页、[#282](https://github.com/kunlong-luo/pagevela/issues/282) 架构/旧客户端冲突与 [#298](https://github.com/kunlong-luo/pagevela/issues/298) 私有安全告警仍待独立审查。
- **治理清理：** 重复发布归档草稿 [#333](https://github.com/kunlong-luo/pagevela/pull/333) 已关闭、未合并；主分支已包含其可核实的发布证据。旧版已打开的标签页需另行保障兼容。

## 工程评分与交付规则

**当前工程评分仍为 [88/100](./ASSESSMENT.md)**（项目七维度内部复评，非第三方认证）。已通过的 PDF 内容保护提高了可靠性，但没有实机性能/打印矩阵的可重复数据，不据此把性能 8/10 或总分抬高。

保留历史 `resume-craft` IndexedDB、Web Lock、BroadcastChannel 及加密分享兼容标识；不新增原生弹窗/tooltip，不重写发布 tag 与下载附件。所有新代码必须通过 **PR 全量 CI → main 完整 CI → 同 SHA Pages 部署**，原有失败或取消的 Run 不冒充成功。

[文档索引](./README.md) · [工程验收台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [下一阶段路线图](./NEXT_PHASE_ROADMAP_20261125.md) · [正式版验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)
