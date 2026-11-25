# Pagevela 项目状态 / Project status

> **核验日期：2026-11-25。** 唯一正式版仍为 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)。这是按提交 SHA 留存的验收记录，非实时 CI 控制台；最新状态请查 [Actions](https://github.com/kunlong-luo/pagevela/actions) 与 [Pull requests](https://github.com/kunlong-luo/pagevela/pulls)。

## 主分支与正式交付

| 事项 | 证据 | 结果 |
| --- | --- | --- |
| **最新已独立验收并部署 main** | `0140b2a1d4c3d9b6a8240d2ed4721a5ce973270d`（[#332](https://github.com/kunlong-luo/pagevela/pull/332)）：[主分支完整 CI #45568793140](https://github.com/kunlong-luo/pagevela/actions/runs/45568793140) · [同 SHA Pages #45570418074](https://github.com/kunlong-luo/pagevela/actions/runs/45570418074) | **两项 success**，已包括引导重播、窄屏菜单测试及启动模块恢复 |
| **已发布正式版本** | `v2.8.4`，tag 对应 `ea2a65b`：[正式 CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722) · [Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) · [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) | **success**；后来合并到 main 的代码不自动加入已发布 v2.8.4 下载包 |
| **发行包独立核验** | `pagevela-2.8.4.zip`、`pagevela-2.8.4.tar.gz`、`SHA256SUMS.txt`：[独立验证 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) | **success**：真实附件下载/解压/哈希复算验证通过；[#333](https://github.com/kunlong-luo/pagevela/pull/333) 的文档 PR 仍为 draft，需分开记录 |
| **工程评分** | [ASSESSMENT.md](./ASSESSMENT.md) | **88/100**（自定七维度评分；未上线候选不加分） |

## 修复候选与已合并待独立验收项

| 优先级 | PR | 已提交内容 | 完成标准 |
| --- | --- | --- | --- |
| P0 | [#334 简历内容保护](https://github.com/kunlong-luo/pagevela/pull/334) | 模板 URL 一次性消耗、导入确认与导入前恢复草稿、Markdown/表单往返保留、照片恢复；修复旧欢迎页测试输入 | 完整 PR CI（包括 Chromium/Firefox/WebKit）成功，再合并并验证新 main 同 SHA Pages |
| P1 | [#335 保存成功真实回执](https://github.com/kunlong-luo/pagevela/pull/335) | 只有最新 IndexedDB 修订真正落盘才显示“已保存”，旧手动快照不能误报成功 | 同上；[技术说明](./PERSISTENCE_ARCHITECTURE_20261026.md) |
| P1 | [#336 IndexedDB 启动保护](https://github.com/kunlong-luo/pagevela/pull/336) | 迁移/读取失败时不呈现虚假空白简历，提供安全恢复页面 | **已合并**为 `d182c91`，合并后的 [主分支 CI #45570785806](https://github.com/kunlong-luo/pagevela/actions/runs/45570785806) 与同 SHA Pages 尚待独立验收，不等于已证实上线 |
| P1 | [#337 完整本地数据清理](https://github.com/kunlong-luo/pagevela/pull/337) | 异常页与帮助中心共用完整清理；暂停写入队列，失败分阶段提示，防止删库后草稿复活 | [专项验收说明](./FULL_LOCAL_DATA_RESET_20261125.md) · **质量检查通过，完整 E2E / 合并后 CI+Pages 尚待验收** |

> #334/#335/#337 为尚未合并候选；#336 已合并但其合并 SHA 的完整生产 CI/Pages 仍需单独核查。不同时间的 CI 失败不能以质量检查绿灯代替最终 `build-and-test`。

## 仍需解决与验收的风险

- **数据与浏览器：** 极快关闭标签时 `pagehide` 异步 flush 不能保证落盘；其他已打开旧版本标签页可能阻塞清理；完整工作区 JSON 是明文，建议妥善保管。 [跨标签页事务防护](./CROSS_TAB_CONFLICT_GUARD_20261124.md) 已解决部分竞争，但不能解决所有旧客户端。
- **PDF / 移动端：** [Auto Fit #312](https://github.com/kunlong-luo/pagevela/issues/312) 真实打印分页；[Android 真机 #262](https://github.com/kunlong-luo/pagevela/issues/262) 系统打印/OEM 浏览器/已安装 PWA；低内存设备的长 PDF 全页面 canvas 导出。已确认的 Android 微信整体测试，不等于其他分项成功。
- **其他技术债：** PDF 导出大内存风险、剪贴板权限拒绝时成功提示、编辑器大 Store/大组件模块化、存储健康事件源隔离。
- **外部事项：** [GitHub 私有告警 #298](https://github.com/kunlong-luo/pagevela/issues/298) 仍需授权核查；品牌商标及媒体改名需分别验收。

## 兼容与治理规则

不修改历史 `resume-craft` IndexedDB、Web Lock、BroadcastChannel 等数据协议标识，不使用原生浏览器确认窗，不改写已发布 tag 或发行附件。已验证合并须保存确切 `main` SHA 的完整 CI/Pages 成功证据；单个 PR 通过不替代上线验收。

[文档目录](./README.md) · [工程验收台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [数据完整清理候选](./FULL_LOCAL_DATA_RESET_20261125.md) · [v2.8.4 Release 验收](./V2_8_4_RELEASE_ACCEPTANCE_20261124.md)
