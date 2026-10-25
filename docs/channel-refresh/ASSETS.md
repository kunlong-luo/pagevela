# 图片、视频与各平台规格（只做必要替换）

现有可直接复用的**Pagevela 品牌素材**：
- `../../public/og-card.svg` / `../../public/og-card.png`：1200×630 社交分享封面；SVG 的文字已经是 Pagevela，PNG 已作为网页 OG 图在新网站提供。
- `../../.github/assets/readme-banner.svg`：已是 Pagevela 字样，用于 README、文章页首，注意平台自身的图片裁剪。
- `../../public/icon.svg` 和 PWA PNG 图标：无需仅因仓库旧文件名重新生成。
- **真实产品截图/视频**：并不是仓库中现成的已审核产品图。需要打开 [Capture Real Promotion Media](https://github.com/kunlong-luo/pagevela/actions/workflows/capture-promotion-media.yml) → `Run workflow` → 选择 `main`，通过后下载 `pagevela-promotion-media` Artifacts 并**人工审查**。文件包名字是历史兼容名，不是图片上的展示品牌。

| 用途 | 建议比例/尺寸 | 图片内容（只用当前真实界面） |
|---|---|---|
| DEV / 掘金 / CSDN 技术文章 | 保持原图宽高或 16:9 | Markdown/表单双编辑＋实时预览；含旧名字/旧链接时才换 |
| PWAs.app | 依目录要求 | 新 PWA manifest 和当前页面真实桌面/移动截图，可能需要平台重新抓取 |
| Product Hunt 产品图库 | 优先依官方上传要求 | 欢迎页、编辑器、模板/预览、导出选项；用虚构简历 |
| 小红书/Instagram 竖图 | 4:5 或平台最新要求 | Pagevela 品牌封面＋3 张真实功能截图 |
| 抖音/视频号/TikTok/Shorts | 9:16 | 真实录屏，开头 Pagevela，更名说明、可读字幕、链接位置 |
| B站/YouTube/HN/Reddit | 16:9 或依原帖 | 新封面＋实际录屏，旧录像可说明“更名前录制” |
| 其他图文动态 | 根据平台 | 首选 Pagevela OG 封面；旧图没有问题就保留 |

统一图片说明（可复制）：
> 图示为 Pagevela 真实浏览器界面，使用虚构的示例简历，不包含任何用户个人数据。功能演示不保证第三方 ATS 系统的评分结果。

核对：可见文字/链接是否已经是 Pagevela + `/pagevela/`；手机裁切与清晰度；非授权照片和邮箱是否被替换；动图字幕是否对齐；不同语言界面是否与文案匹配。**不要把旧 URL 加在新封面里当官网。**
