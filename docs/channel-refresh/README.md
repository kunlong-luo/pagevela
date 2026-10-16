# Pagevela 中外媒体内容逐个平台修改包（2026-10-16）

**这是一套“修改已经发布的内容”的草稿库，不是批量自动发帖工具。** 先找回你在各平台的旧内容，在原文章/帖子的可编辑位置修改，尽量保留原来的文章链接、评论与发布时间。不能确认是你的文章/帖子时，先核实账号所有权。

## 已发现的公开内容（不等于证实发布账号归你所有）

1. [DEV Community 技术文章](./platforms/01-dev-community.md)：https://dev.to/spark-prairie/building-a-local-first-markdown-cv-editor-what-i-learned-a98 ，文末仍指向旧 Pages URL。
2. [PWAs.app 的旧 PWA 收录](./platforms/02-pwas-app.md)：https://pwas.app/apps/resume-craft ，仍使用旧应用名、旧 start URL 和旧预览。这是独立目录的扫描记录，不保证你有修改权限。
3. [GitHub v2.6.0 Release](./platforms/03-github-release.md)：https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0 ，真实的历史 Release，是否修改正文由你决定。

**尚未确认发布记录的其余平台**：下面的文件全部只是可复制的备选稿。旧 `?ref=producthunt` 链接**不是** Product Hunt 已发布条目的证据。没有实际旧帖时，不必发布新帖。

## 按渠道打开对应草稿

- [ ] [DEV Community 技术文章](./platforms/01-dev-community.md) — 已发现公开页面；作者账号归属待确认
- [ ] [PWAs.app 应用目录](./platforms/02-pwas-app.md) — 已发现第三方收录；账号/编辑权限未确认
- [ ] [GitHub 最新 Release v2.6.0](./platforms/03-github-release.md) — 已确认在当前项目中正式发布；可通过 GitHub 页面手动编辑
- [ ] [Product Hunt](./platforms/04-product-hunt.md) — 未查到可确认的本项目正式产品页；仅有旧 ref=producthunt 来源参数
- [ ] [Reddit / r/SideProject 等](./platforms/05-reddit.md) — 未核实发布过的帖子或关联 Reddit 账号
- [ ] [Hacker News / Show HN](./platforms/06-hacker-news.md) — 未核实具体 HN 投稿
- [ ] [X / Twitter](./platforms/07-x.md) — 未核实帖子或账户
- [ ] [LinkedIn](./platforms/08-linkedin.md) — 未核实个人/公司页面或已发内容
- [ ] [Medium / 其他英文技术博客](./platforms/09-medium.md) — 未核实账号或文章
- [ ] [YouTube](./platforms/10-youtube.md) — 未核实具体视频或频道
- [ ] [Indie Hackers / 英文独立开发社区](./platforms/11-indie-hackers.md) — 未核实帖子或项目档案
- [ ] [小红书](./platforms/12-xiaohongshu.md) — 未核实具体笔记或账号
- [ ] [抖音](./platforms/13-douyin.md) — 未核实视频或账号
- [ ] [哔哩哔哩 / B站](./platforms/14-bilibili.md) — 未核实视频或动态
- [ ] [知乎](./platforms/15-zhihu.md) — 未核实回答或文章
- [ ] [掘金](./platforms/16-juejin.md) — 未核实掘金文章或沸点
- [ ] [CSDN](./platforms/17-csdn.md) — 未核实博文或资源页面
- [ ] [微信公众号](./platforms/18-wechat-official.md) — 未核实已发推文或公众号
- [ ] [微博](./platforms/19-weibo.md) — 未核实已发微博或账号
- [ ] [即刻](./platforms/20-jike.md) — 未核实即刻动态或账号
- [ ] [微信视频号](./platforms/21-wechat-channels.md) — 未核实视频号或已发视频
- [ ] [Threads](./platforms/22-threads.md) — 未核实发布或账号
- [ ] [Bluesky](./platforms/23-bluesky.md) — 未核实发布或账号
- [ ] [Instagram](./platforms/24-instagram.md) — 未核实账号、帖子或 Reels
- [ ] [TikTok](./platforms/25-tiktok.md) — 未核实海外短视频或账号
- [ ] [GitHub 个人主页 / Profile README](./platforms/26-github-profile.md) — 仓库属于 kunlong-luo，但尚未核实是否存在个人主页 README 或置顶帖

另有 [通用公告模板](./platforms/99-other-platforms.md) 用于没有列出的中外论坛和应用目录。

## 统一信息（必须保持一致）

| 字段 | 现行值 |
|---|---|
| 产品名称 | **Pagevela** |
| 历史名称 | Resume Craft / 简匠 |
| 官方网站 | https://kunlong-luo.github.io/pagevela/ |
| GitHub 仓库 | https://github.com/kunlong-luo/pagevela |
| 旧项目站点 | `https://kunlong-luo.github.io/resume-craft/`（不维护，也不做跳转；不要再作为 CTA） |
| 最新历史正式 Release | [v2.6.0](https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0)，**原名发布的历史版本** |
| 功能 | Markdown/表单双模式编辑、A4/US Letter 实时预览、ATS 导向排版提示、PDF 导出 |
| 隐私 | 普通编辑不需要账号；简历草稿主要在浏览器本地，跨浏览器没有自动同步；完整工作区 JSON 备份**未经加密** |

**不做的事：** 不批量替换历史下载包/校验值；不承诺一定能通过 ATS、不宣称所有功能完全离线、不说已有数据会自动跨设备同步、不虚构播放量/用户数、不把生成示意图说成真产品截图、不自动向第三方平台发帖。

## 修改顺序

1. 打开 [TRACKER.csv](./TRACKER.csv)，先把自己确实发布过的条目填上实际帖子 URL 和账号归属。
2. 优先改 DEV 文末失效 Demo、PWAs.app 官方安装链接、个人主页/置顶贴/简介；最新 Release 只需附加更名通知。
3. 一个一个打开 `platforms/` 中的对应文件，复制正文到原平台的编辑界面；依其字符、链接和审核规则精简。
4. 看 [ASSETS.md](./ASSETS.md) 挑选或重新抓取必要的**真实 UI**截图，避免为了文件名里有 resume-craft 就全量重做。
5. 保存后在浏览器打开公开页验证 URL，再把 `TRACKER.csv` 的状态改成 `done` 并填 `last_checked`（此包不会自动读取你的第三方账号）。

可参考 [回复和纠错话术](./FAQ_AND_REPLIES.md) 与旧版 [public publication checklist](../PUBLICATION_UPDATE_CHECKLIST.md)。

如你还有没列出的站点，在 [99 通用模板](./platforms/99-other-platforms.md) 的基础上新增对应平台文件，**不要猜测发布历史或账号归属**。
