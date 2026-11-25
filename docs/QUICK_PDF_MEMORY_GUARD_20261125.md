# Quick PDF 大画布内存保护 / Raster memory guard — 2026-11-25

> **[PR #340](https://github.com/kunlong-luo/pagevela/pull/340) 已通过 [完整 PR CI #45616120212](https://github.com/kunlong-luo/pagevela/actions/runs/45616120212) 并合并为主分支 `0c5c445`；新 main CI/Pages 仍需独立验收。** 当前正式 GitHub Release 仍为 [v2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4)。本次优化直接作用于 Quick PDF 的图像导出，不修改 ATS 浏览器打印。状态和准确 SHA 以 [项目状态](./PROJECT_STATUS.md) 与 GitHub Actions 为准。

## 源代码审查发现的可复现风险

原 `src/lib/pdf-export.ts` 使用 html2canvas 将整个滚动简历一次性转换为高 DPI 的 RGBA 画布；随后循环每个 PDF 页面，**每页重新创建同尺寸 Canvas**，并转换 JPEG 再交给 jsPDF。原实现只在 html2canvas 完成后核验像素维度，因此对极长文件的渲染请求可能在检测前触发浏览器纹理限制、Canvas 分配失败或严重内存压力。

例如典型 A4 CSS 宽约 794px，2 倍像素比生成约 1588px 宽的主画布。RGBA 单画布内存近似 `宽 × 高 × 4` 字节；html2canvas 中间纹理、JPEG 字符串与 jsPDF 还会占用更多内存。**这些数字是静态像素预算，不是移动设备实测峰值。**

## 本阶段策略

1. **在 html2canvas 前进行预算核验：** `src/lib/pdf-export-validation.ts` 的 `assertQuickPdfRasterBudget` 对预计 CSS 宽高和原样分辨率倍数求出渲染尺寸，限制单边不超过 **16,384 像素**、像素数量不超过 **36,000,000**（单个 RGBA 主画布理论上限约 144 MB，约 137 MiB）。实际捕获后再用同一规则核验一次。超限即拒绝创建危险的大画布。
2. **不暗中改变画质：** 保持原有 `1.5–2x` 缩放、JPEG 品质 `0.96`、A4/US Letter 比例和智能避让分页。超限时复用已有 Pagevela Toast 说明“超出图像内存安全预算”，并尝试打开保留真实文字的**浏览器 Print / Save as PDF**，而不是导出低清或空白文档。
3. **复用每页的画布：** 循环前创建唯一的页图像 Canvas，逐页填白、绘制源图像切片并编码 JPEG；不再每页重新分配同大小的 RGBA 页缓存。jsPDF 每页取得的 JPEG 是独立字符串，不复用像素引用。
4. **成功和失败都释放源/页画布：** `finally` 清空像素尺寸并移除临时 DOM 副本；不会删除或重写 IndexedDB 中的 Markdown、档案、照片、草稿。
5. **预算与能力边界：** 36MP 与 16,384 不是所有 Android 手机或浏览器均能可靠分配的保证；只是发生额外高成本分配前的保守上限。浏览器仍可能在更小尺寸下失败，此时原有异常恢复和打印回退负责提示。Quick PDF 本质是光栅 PDF，不保证文字可搜索/ATS 兼容；求职提交优先推荐系统打印。

## 自动化与验收标准

- `src/tests/pdf-export-validation.test.ts`：A4/Letter 预计像素和原样倍率、36MP 边界、16,384 单边边界、非法/非有限缩放、超过安全整数范围时拒绝分配。
- `e2e/pdf-raster-budget.e2e.ts`：只在 Chromium 的**临时渲染副本**上注入虚构超大 `scrollHeight`；验证在真正分配巨型 Canvas 前出现 Pagevela 非原生错误提示及文字型浏览器打印回退，并确认原始 IndexedDB 正文在尝试和重新加载后仍存在。
- 继续执行 `e2e/pdf-download.e2e.ts`：真实 Quick PDF 下载、pdf.js 解析每页、导出后原稿保留；以及 `e2e/pdf-download-failure.e2e.ts`：JPEG 编码失败回退。不得把模拟像素上限用例冒充 Android 真机内存测试。
- PR 质量/typecheck/lint/unit、完整 Chromium、Firefox/WebKit、`build-and-test` 必须全 success。合并后再独立核验**确切 main SHA** 的完整 CI 与 Pages build/deploy。没有这些证据，本阶段只标记为候选。

## 后续需实机量化的部分

记录实际 Android 机型、Android/浏览器版本、可用内存、A4/Letter 和中文/英文各 1/3/5/8 页样本的：前台响应、JS 堆/浏览器内存峰值、Canvas 创建失败率、PDF 文件大小、分页/文字截断、导出后重载能否恢复草稿和是否成功下载。**不编造基线数字，不宣称低端设备已有实测改善。** 若需要更长篇幅导出，应另行设计带真实分页/单页捕获的渲染方案，并保持手动分页、文字避让和视觉一致性。

[当前项目状态](./PROJECT_STATUS.md) · [旧 PDF 失败回退](./PDF_EXPORT_FAILURE_SAFETY_20261124.md) · [下一阶段路线图](./NEXT_PHASE_ROADMAP_20261125.md) · [文档索引](./README.md)
