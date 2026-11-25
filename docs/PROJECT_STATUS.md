# Pagevela 项目状态 / Project status

> **核验日期：2026-11-25。** 唯一正式版仍为 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)。这是按提交 SHA 留存的验收记录，非实时 CI 控制台；最新状态请查 [Actions](https://github.com/kunlong-luo/pagevela/actions) 与 [Pull requests](https://github.com/kunlong-luo/pagevela/pulls)。

## 主分支与正式交付

| 事项 | 证据 | 结果 |
| --- | --- | --- |
| **最新已独立验收并部署 main** | `0fea9fc9ac122b7282d6e00302846763783d0f55`（[#338](https://github.com/kunlong-luo/pagevela/pull/338)）：[主分支完整 CI #45584515860](https://github.com/kunlong-luo/pagevela/actions/runs/45584515860) · [同 SHA Pages #45586651728](https://github.com/kunlong-luo/pagevela/actions/runs/45586651728) | **均 success**，包含已合并的 #332 引导恢复、#335 真实保存回执、#336 启动读取保护和 #338 WebKit 回归 |
| **已发布正式版本** | `v2.8.4`，tag 对应 `ea2a65b`：[正式 CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) · [Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) · [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) | **三项 success**；后续 main 代码不自动进入已发布 v2.8.4 压缩包 |
| **v2.8.4 归档独立核验** | [工作流 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) | **success**：独立下载 ZIP/TAR.GZ/SHA256SUMS，完成 SHA-256 与 49 个文件一致性检查；[正式验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md) |
| **工程评分** | [ASSESSMENT.md](./ASSESSMENT.md) | **88/100**（七维度内部评分，不因发布或尚未上线的 PR 加分） |

## 本阶段合并待验收与修复候选

| 优先级 | PR | 已提交内容 | 必须完成的门槛 |
| --- | --- | --- | --- |
| P0 | [#334 简历内容保护](https://github.com/kunlong-luo/pagevela/pull/334) | 模板 URL 一次性消耗、导入覆盖确认及可恢复草稿、表单/Markdown 无损往返、照片恢复 | **PR 全 CI #45587102689 success，已合并为 `07368d64`**；该主分支 [完整 CI #45588914443](https://github.com/kunlong-luo/pagevela/actions/runs/45588914443) 和同 SHA Pages **仍待验收** |
| P1 | [#337 完整本地数据清理](https://github.com/kunlong-luo/pagevela/pull/337) | 异常页和帮助中心使用统一确认清理；停止活跃/草稿写入，按阶段报告部分失败且不擦除其他应用的数据 | [专项验收说明](./FULL_LOCAL_DATA_RESET_20261125.md) · 完整 CI、合并后 main 同 SHA CI/Pages |
| 文档 | [#333 发布归档历史文档](https://github.com/kunlong-luo/pagevela/pull/333) | draft 内容与 #337 中已同步的发行验收资料重叠 | 只有相关文档实际合并、确认链接和证据一致后，才能将重复 draft 标记为已被替代 |

> #334 已合并但尚无新 SHA 完整主分支验收；#335、#336、#338 **已合并**且包含在经完整 main CI/Pages 证明的 `0fea9fc` 中。此前 `d182c91`、`5564c869` 的 WebKit 失败流水保留为历史事实，不冒充成功；新的 `0fea9fc` 检查才是当前已验证基线。详细下一阶段优先级见 [2026-11-25 路线图](./NEXT_PHASE_ROADMAP_20261125.md)。

## 仍需解决与验收的风险

- **数据与浏览器：** 极快关闭标签时 `pagehide` 异步 flush 不能保证落盘；其他已打开旧版本标签页可能阻塞清理；完整工作区 JSON 是明文，建议妥善保管。 [跨标签页事务防护](./CROSS_TAB_CONFLICT_GUARD_20261124.md) 已解决部分竞争，但不能解决所有旧客户端。
- **PDF / 移动端：** [Auto Fit #312](https://github.com/kunlong-luo/pagevela/issues/312) 真实打印分页；[Android 真机 #262](https://github.com/kunlong-luo/pagevela/issues/262) 系统打印/OEM 浏览器/已安装 PWA；低内存设备的长 PDF 全页面 canvas 导出。已确认的 Android 微信整体测试，不等于其他分项成功。
- **其他技术债：** PDF 导出大内存风险、剪贴板权限拒绝时成功提示、编辑器大 Store/大组件模块化、存储健康事件源隔离。
- **外部事项：** [GitHub 私有告警 #298](https://github.com/kunlong-luo/pagevela/issues/298) 仍需授权核查；品牌商标及媒体改名需分别验收。

## 兼容与治理规则

不修改历史 `resume-craft` IndexedDB、Web Lock、BroadcastChannel 等数据协议标识，不使用原生浏览器确认窗，不改写已发布 tag 或发行附件。已验证合并须保存确切 `main` SHA 的完整 CI/Pages 成功证据；单个 PR 通过不替代上线验收。

[文档目录](./README.md) · [工程验收台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [数据完整清理候选](./FULL_LOCAL_DATA_RESET_20261125.md) · [下一阶段路线图](./NEXT_PHASE_ROADMAP_20261125.md) · [v2.8.4 Release 验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)
