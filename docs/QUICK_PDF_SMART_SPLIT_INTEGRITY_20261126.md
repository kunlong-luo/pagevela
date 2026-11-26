# Quick PDF 智能分页边界内容完整性 / 2026-11-26

> **[PR #342](https://github.com/kunlong-luo/pagevela/pull/342) 修复候选：尚未取得最新提交的完整 PR CI / 合并后 main CI 与同 SHA Pages 验收。** 已上线的前置修复包括 [#340 内存预算](./QUICK_PDF_MEMORY_GUARD_20261125.md) 和 [#341 尾页防丢](./PDF_TRAILING_CONTENT_INTEGRITY_20261125.md)。当前 GitHub 正式下载版仍是 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)；浏览器版可包含后续合并改动，不能与该发布包混为一谈。

## 真实风险和影响范围

Quick PDF 的 `src/lib/pdf-export.ts` 在自动分页前会从理想边界向上寻找空白行；历史 `findSmartSplitY` 仅扫描页面宽度中间约 4%–96% 的每行，且每行最多抽样约 80 个横向像素，只把颜色通道低于 240 的位置识别为可见内容。

这意味着细线、淡灰色图标、边缘字形、图片细节等即使位于目标断页位置，也可能被当作空白行，导致分割线穿过实际内容。上一阶段 [#341](https://github.com/kunlong-luo/pagevela/pull/341) 只修复**末尾整页是否被丢弃**，没有覆盖**两页交界的自动分页坐标选择**。

## 变更设计

- 新的纯函数 `findSmartRasterSplitY` 归入现有 `src/lib/pdf-raster-scan.ts`，与尾部空白判定共用 **32,768 RGBA 像素/次**的最大 `getImageData` 块（约 128 KiB）。在原有向上最多 180px、最少保留理想页高 65% 的搜索范围内，覆盖整幅画布宽度、逐像素确认白色间隔。
- 把非透明、任意颜色通道不是 `255` 的像素当作可见内容。为了避免切到浅灰边缘，**宁可使用原始理想分页点，也不能把未经确认的行声称为空白**。
- 保留原来的“最长完整白色间隔”的优先级、至少相当于 5 行连续空白才可调整分页的约束；若页面已经到画布底部，直接返回画布高度。
- 读像素失败、像素数据长度异常时返回原始理想边界；不虚构安全间隔。非法源图尺寸明确抛错，让现有自定义 PDF 错误回退接管。
- `src/lib/pdf-export.ts` 直接调用新 helper，移除原实现约 85 行重复扫描逻辑。**手工分页标记仍具有最高优先级**；A4 / Letter、页面图片品质、超长 Canvas 预算、IndexedDB 草稿和原有文本型打印入口均不变。

## 自动回归和质量门禁

`src/tests/pdf-raster-scan.test.ts` 扩展新用例：

1. 1,600px 宽的画布在理想分页前真实存在两段白色区时选择最长的一段，并核对完整列扫描及 `getImageData` 上限；
2. 在最长间隔处最右一列添加仅差 1 个通道值（254/255）的单像素时不把它当空白，转而选择另一个实际干净间隔（原稀疏采样会漏过）；
3. 仅 4 行的白区不强行修改分页坐标；
4. 读回失败/像素长度异常时回退理想位置；
5. 到达画布末尾时停止，非法尺寸明确失败。

继续运行 Chromium 全量及 `e2e/pdf-download.e2e.ts` 的真实 PDF 下载、pdf.js 各页解析/导出后草稿保留测试，Firefox/WebKit 关键用例、typecheck/lint/单元测试以及最终 `build-and-test`。新 PR 合并后，必须独立核验**确切主分支 SHA**的 CI/Pages，才能称为线上通过。

## 性能与兼容边界

- 向上最多检查 181 行，每次像素读回最多约 128 KiB，但与历史抽样相比，总像素遍历和 CPU 开销增加。尚未测量实际低端 Android 耗时，**不得宣称性能提升**；这是以内容完整性优先的权衡。
- 即使每个搜索行确认不含可见像素，浏览器栅格化、复杂背景、抗锯齿和人工分页也可能使真实打印位置不完美；并非所有简历都能无损压成单页。
- WebKit/Firefox/Chromium 自动化不替代用户未单独确认的 Android 系统打印、OEM 浏览器、微信 PDF 下载、PWA 离线测试；仍按 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 逐项验收。
- Quick PDF 仍然是 JPEG 图像型 PDF；ATS 投递使用保留可选文字的浏览器 Print / Save as PDF。

[项目状态](./PROJECT_STATUS.md) · [质量与部署台账](./ENGINEERING_ACCEPTANCE_20261124.md) · [文档导航](./README.md)
