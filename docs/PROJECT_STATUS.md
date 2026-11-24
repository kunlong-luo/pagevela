# Pagevela 项目状态 / Project status

> **v2.8.4 发布候选：** 本次版本 PR 将 `package.json` 升为 `2.8.4`；此处下方的已验收 `a8ec3ae` 是**发布前**的稳定主分支源代码基线，不代表 v2.8.4 版本 SHA 已经过完整 CI/Pages/Release。只有实际出现 [v2.8.4 Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 和带新 SHA 的成功日志，才能更新为正式发布。


> **核验日期：2026-11-24。** 本页是最近一次已核验的工程状态快照，不是实时 CI 面板。判断后续代码是否已上线，请分别查看 [main](https://github.com/kunlong-luo/pagevela/commits/main)、[Actions](https://github.com/kunlong-luo/pagevela/actions)、[Releases](https://github.com/kunlong-luo/pagevela/releases)。

## 最新交付 / Latest verified delivery

| 项目 | 状态 | 证据 |
| --- | --- | --- |
| `main` / 最新已部署代码 | **`a8ec3ae15a819c3465a039cf11a659e0ca59afc8`** | [提交](https://github.com/kunlong-luo/pagevela/commit/a8ec3ae15a819c3465a039cf11a659e0ca59afc8) |
| 完整主分支 CI | **success**：quality、Chromium、Firefox 2/2、WebKit 2/2、cross-browser、实际 `build-and-test` | [#45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) |
| 同 SHA Pages | **success**：build + deploy | [#45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) |
| 上一关键安全修复 | `da3b68b`：[#323](https://github.com/kunlong-luo/pagevela/pull/323) 过期标签页防覆盖及恢复草稿 | [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45370012956) · [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45372036914) |
| 最新档案修复 | `a8ec3ae`：[#325](https://github.com/kunlong-luo/pagevela/pull/325) 同毫秒新建/复制档案防主键碰撞 | 同上最新 main CI / Pages |
| 工程成熟度 | **[88/100](./ASSESSMENT.md)**；隐私与数据可靠性 13 → 14/15 | [七维度评分和扣分项](./ASSESSMENT.md) |
| 最新正式可下载 Release | **[v2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3)**，tag `501ca26` | 发布归档不包含 post-v2.8.3 的代码，独立解压/哈希复核仍无记录 |

## 已完成 / Shipped on newer deployed main

- [#321](https://github.com/kunlong-luo/pagevela/pull/321) Auto Fit A4/Letter、中文/英文、目标页数合成测试矩阵，以及 Estimated Fit 文案；[#322](https://github.com/kunlong-luo/pagevela/pull/322) 设置清洗纯函数拆分。
- [#323](https://github.com/kunlong-luo/pagevela/pull/323) IndexedDB 事务级阻止旧标签页活动简历覆盖；被拒绝的内容/排版放入独立手动恢复草稿；品牌警告持续显示但不遮挡操作。
- [#325](https://github.com/kunlong-luo/pagevela/pull/325) 新建与复制档案使用 UUID 或含递增序列的后备主键，保留 `profile_`、旧数据与备份格式。

## 仍然开放 / Do not mark complete

- [#282](https://github.com/kunlong-luo/pagevela/issues/282)：完整档案及照片冲突恢复、旧版多标签页、Store/导出模块化。
- [#312](https://github.com/kunlong-luo/pagevela/issues/312)：Auto Fit 全组合/隐藏预览与真实 PDF 分页；[#262](https://github.com/kunlong-luo/pagevela/issues/262)：Android 系统打印、不同浏览器与已安装 PWA 的分项独立验收。
- [#298](https://github.com/kunlong-luo/pagevela/issues/298)：GitHub 私有安全告警；旧发布压缩包的独立 SHA256 校验、站外媒体更新及商标核验也不能凭 CI 绿灯结项。
- 旧 `/resume-craft/` Pages URL **不维护且不部署跳转**。原 IndexedDB、BroadcastChannel、Web Lock 与加密分享协议标识为向后兼容而保留，禁止为了品牌一致性盲目重命名。

## 文档职责 / Ownership

- 本页只描述**当前已核验状态、未结项**；按 SHA 的详细检查表在 [工程验收台账](./ENGINEERING_ACCEPTANCE_20261124.md)。
- 评分及依据集中在 [ASSESSMENT.md](./ASSESSMENT.md)，历史 76/84/86/87 分报告保留原日期。
- [文档索引](./README.md) 区分现行技术说明、历史版本和独立媒体宣传资料；旧失败的具体过程仍可通过 GitHub PR/Actions/提交历史追溯，不重复贴满本页。
