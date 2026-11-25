# Pagevela 当前工程复评 / Current engineering assessment

> **截至 2026-11-24：88/100**（项目自定的七维度定性工程评分，不是第三方认证）。评分以已完成 **main 完整 CI 和同 SHA Pages build/deploy** 的代码为准；PR 通过但未部署、文档整理、未独立测试的 Android/打印场景不额外加分。

> **后续同日版本交付（评分保持 88）**：v2.8.4 正式 tag `ea2a65b` 通过 [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722)、[Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138)、[Release](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140)；此前纯文档 main `dfad007` 也通过 [完整 CI](https://github.com/kunlong-luo/pagevela/actions/runs/45396241838) 和 [同 SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45398234063)。下文 `a8ec3ae` 是评分所依托的原始**功能验收基线**，不是最新 main。

> **2026-11-25 更新（评分不变）：** [#335](https://github.com/kunlong-luo/pagevela/pull/335) 与 [#338](https://github.com/kunlong-luo/pagevela/pull/338) 均合并后的 main `0fea9fc` 已通过 [完整 CI #45584515860](https://github.com/kunlong-luo/pagevela/actions/runs/45584515860) 和 [同 SHA Pages #45586651728](https://github.com/kunlong-luo/pagevela/actions/runs/45586651728)；[v2.8.4 发布包独立 ZIP/TAR/SHA256 校验 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) 亦成功。本报告的 `a8ec3ae` 仍是 88 分原始功能验收基线，[#334](https://github.com/kunlong-luo/pagevela/pull/334) 虽已合并为 `07368d64`，但其主分支 CI/Pages 尚待独立验收；[#337](https://github.com/kunlong-luo/pagevela/pull/337) 仍为候选，二者不能提前算作线上成果。评分保持 **88/100**。

## 已独立验收的基线 / Proven baseline

| 核验对象 | Git SHA / 可核查证据 | 结果 |
| --- | --- | --- |
| 最新已部署 main | `a8ec3ae15a819c3465a039cf11a659e0ca59afc8`（包含 [#323](https://github.com/kunlong-luo/pagevela/pull/323)、[#325](https://github.com/kunlong-luo/pagevela/pull/325)） | 生产源代码 |
| 完整 main CI | [#45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) | **success**：quality、Chromium 全量、Firefox 2/2、WebKit 2/2、cross-browser、实际执行的受保护 `build-and-test` |
| 同 SHA GitHub Pages | [#45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) | **success**：build 和 deploy 都成功 |
| 上一个数据安全基线 | `da3b68bc6c45db666e9c3ba47ce55e2ab73d7e80` | [完整 CI #45370012956](https://github.com/kunlong-luo/pagevela/actions/runs/45370012956) + [同 SHA Pages #45372036914](https://github.com/kunlong-luo/pagevela/actions/runs/45372036914) **success** |
| 最新正式 GitHub Release | [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)，tag `ea2a65b`；[main CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722)、[Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138)、[Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) 均 success | ZIP/TAR.GZ/SHA256SUMS 已通过 [独立验证 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817)；版本升级不另加分 |

## 七维度评分 / Weighted rubric

| 维度 | 分数 | 主要证据及未覆盖事项 |
| --- | ---: | --- |
| 产品能力与完成度 | **19/20** | #316 测量式 Auto Fit、#319 恢复前布局、#321 纸张/语言组合回归；不保证实际系统打印分页精确 |
| 交互与多端适配 | **13/15** | 品牌 UI、跨浏览器关键回归；没有独立的 Android 系统 Print/Save-as-PDF、OEM/安装 PWA 全矩阵 |
| 架构与可维护性 | **16/20** | Hook 与 #322 settings sanitizer 已独立拆分；大型 Zustand Store、编辑器/导出模块仍待分离 |
| 隐私与数据可靠性 | **14/15** | **较历史 87 分 +1**：[#323](https://github.com/kunlong-luo/pagevela/pull/323) 事务级阻止过期标签页覆盖并保存冲突手动草稿，恢复提醒持续可见且不挡操作；[#325](https://github.com/kunlong-luo/pagevela/pull/325) 防止同毫秒档案主键碰撞。均取得上述完整 main CI/Pages。同分项仍扣分：旧版已打开标签页、照片/全部元数据冲突、多设备同步和备份 JSON 明文 |
| 性能 | **8/10** | 有产物预算，但未提供低端 Android、长简历输入耗时/内存的可重复对照数据 |
| 测试与发布可靠性 | **9/10** | Chromium 全量、Firefox/WebKit 4 分片、required `build-and-test`、同 SHA Pages；真机打印仍未独立验收；v2.8.4 归档已通过独立 SHA256 验收 |
| 文档与交付治理 | **9/10** | 最新文档导航与可追溯 CI 链接；外部媒体、商标及 GitHub 私有安全告警未完成独立审查 |
| **总分** | **88/100** | **87 → 88 仅因已上线且有双标签页 E2E 的数据安全改进；#325 是同维度补强，未重复加分。** |

## 仍须明确标记为未完成的风险

- [#282](https://github.com/kunlong-luo/pagevela/issues/282)：旧版跨标签客户端、未保存照片/完整档案元信息、冲突草稿频繁累积、Store/导出域拆分；
- [#312](https://github.com/kunlong-luo/pagevela/issues/312)：全纸型 × 中文/英文 × 模板/页数的组合、隐藏预览和实际打印分页；
- [#262](https://github.com/kunlong-luo/pagevela/issues/262)：负责人确认过 Android 微信真实设备整体验收，**不等于**每条系统打印、PDF 下载/打开、OEM 浏览器、安装 PWA 单项验收；
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：GitHub 私有安全告警待另行核对；registry audit 成功不能替代；
- 备份 JSON 无加密；Release ZIP/TAR.GZ 附带 `SHA256SUMS.txt`，且已由 [验证工作流 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) 独立下载及复算；商标和站外内容仍需外部确认。

## 历史评分（不覆盖原始时点的判断）

[2026-11-22：76 分](./ASSESSMENT_20261122.md) · [2026-11-23：84 分](./ASSESSMENT_20261123.md) · [2026-11-24：86 分](./ASSESSMENT_20261124.md) · [2026-11-24：87 分](./ASSESSMENT_20261124_R2.md)。以上历史文件可保留失败流水及当时“待合并”的描述，**不是当前状态**。

[项目状态](./PROJECT_STATUS.md) · [同 SHA 工程验收台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [跨标签页冲突设计](./CROSS_TAB_CONFLICT_GUARD_20261124.md) · [档案 ID 唯一性](./PROFILE_ID_UNIQUENESS_20261124.md) · [文档目录](./README.md)
