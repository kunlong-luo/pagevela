# Quick PDF 末尾内容完整性 / Tail-content preservation — 2026-11-25

> **下一阶段 PR 候选，尚未经过新提交的完整 CI / 主分支同 SHA Pages 验收。** 本文描述 Quick PDF **尾部内容**防静默丢失；不代表 Android 真机打印已通过，不改变正式 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) 压缩包。准确结果见 [项目状态](./PROJECT_STATUS.md)。

## 代码审查发现的风险

Quick PDF 将完整简历捕获为一张长画布后按纸型分页。在每页开始时，原 `isCanvasSliceBlank` 只在剩余画布抽取最多约 80 行，且每行只检查 3%–97% 宽度中的部分像素；若抽取结果均近白色，就认为**整个剩余部分均为空白**并直接停止分页。

- 长文件后面最后一行细文字、浅色标签、分割线、图标，可能正好位于两次抽样之间，造成实际内容未被加入导出的 PDF。
- 旧实现对仅高 1–2px 的剩余区域直接判定为空白；同样可能丢失细线或字形底部。
- 这属于**完整性风险**，不应为了减少所谓空白页牺牲用户内容。未取得真实丢字复现文件前，不宣称已经遇到实际用户数据损坏。

## 修复思路

新增纯函数 `src/lib/pdf-raster-scan.ts`：`isRasterSliceBlank(context, width, startY, endY)`。

1. 每次通过 `getImageData` 仅读取不超过 **32,768 个 RGBA 像素**（约 128 KiB）的一段图像，**覆盖 100% 的宽度和剩余高度**，而不是对行/列稀疏抽样。
2. 任何透明度非零、颜色不完全白的像素，都作为「可能存在内容」处理，不提前删除页面；完全透明像素允许视为空白。宁可保留多余的有色背景或淡色元素，也不静默裁掉末尾内容。
3. 无法读取像素、返回长度不足、非法坐标时 **fail-open to content**：不能证明空白就继续生成 PDF，不让读回失败误判为空白。
4. 不改变每页智能文字避让 `findSmartSplitY`、人工分页位置、JPEG 品质、页画布复用逻辑或导出像素预算；与 [#340 大画布内存预算](./QUICK_PDF_MEMORY_GUARD_20261125.md) 为不同且兼容的保护。
5. **性能权衡：** 全像素检查在确实很长的尾部白区会增加 CPU 读取与循环次数，但避免单次分配整幅图像；不能提前声称提速。后续可通过 1/3/5/8 页 A4/Letter 真实导出测量耗时，验证安全与性能的平衡。

## 自动回归

`src/tests/pdf-raster-scan.test.ts` 检验：

- 1,800px 高全白尾区必须扫描所有行，且每个 `getImageData` 块不超过 32,768 像素；
- 位于第 1,997 行、最左侧、红色通道仅低于白色 1 个单位的单像素仍能被检测为内容（旧 80 行抽样/左右裁剪可能漏检）；
- 仅高 1px 的剩余切片有文字边缘时不能视为空白；
- 完全透明像素仍可视为空白；Canvas 读取异常、空像素结果及非法尺寸不误判为可丢弃。

现有 `e2e/pdf-download.e2e.ts` 继续验证真实浏览器导出与 pdf.js 解析每页、重载后原稿还在；`e2e/pdf-download-failure.e2e.ts` 保留异常回退；[#340](https://github.com/kunlong-luo/pagevela/pull/340) 的大画布回归在其门禁通过后继续保留。新 PR 必须通过质量/typecheck/lint、全部 Chromium、Firefox/WebKit 和 `build-and-test`；合并后另行记录同 SHA main CI 与 Pages 部署。

## 仍待验证的边界

- 该修复只针对**画布尾部空白判定**；智能分割本身仍以有限行采样寻找空白间隙，极端图文混排可能在分页处截断字形。
- 浅色非白背景将被保守地计为有效像素，可能增加尾页，因此应在浏览器截图与 PDF page count 的实测中对照观察。
- Chrome/WebKit/Firefox 全部自动化通过不等于 Android 微信、OEM/已安装 PWA 设备的真实系统打印与 PDF 下载已经成功；实机矩阵仍由 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 追踪。
- Quick PDF 是栅格 PDF，不保证文本可搜索；ATS 求职投递优先使用浏览器 Print / Save as PDF。

[Quick PDF 内存预算](./QUICK_PDF_MEMORY_GUARD_20261125.md) · [PDF 失败保护](./PDF_EXPORT_FAILURE_SAFETY_20261124.md) · [项目状态](./PROJECT_STATUS.md) · [文档索引](./README.md)
