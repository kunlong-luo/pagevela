# Quick PDF raster failure handling / 快速 PDF 空白结果防护

> **2026-11-24 已完成合并与同 SHA 验收。** [PR #314](https://github.com/kunlong-luo/pagevela/pull/314) 合并为 `12c7044c2584d25d0d2c94b3a74fb78330dbd407`；其 [PR CI #45311296133](https://github.com/kunlong-luo/pagevela/actions/runs/45311296133)、[完整 main CI #45312509947](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947)、[同 SHA Pages #45313889157](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) 均 **success**。线上 main 已包含修复，但历史 v2.8.3 ZIP/TAR 包不包含它。

## 保护边界

- `src/lib/pdf-export-validation.ts` 的守卫拒绝非正/非有限画布宽高、空 `CanvasRenderingContext2D` 以及最终没有成功添加任何图像页的 PDF。
- `src/lib/pdf-export.ts` 在创建完整栅格后调用守卫，只有真正 `addImage` 完成才增加 `renderedPages`，零页会在调用 `pdf.save` **之前**抛错。保留 A4/US Letter、既有文本避让算法、手动分页和渲染副本清理。
- `src/hooks/useResumeActions.ts` 检查返回值必须严格为 `true` 才发出已有 `pdf_export_success` 事件，失败时用 **Pagevela 自定义 Toast** 提醒并保留 ATS 浏览器打印回退入口，不新增原生 `alert/confirm/select/tooltip`。
- **语义边界：** `pdf_export_success` 仍代表 PDF 生成并向浏览器发出下载请求，不能证明用户设备已完成下载或实际保存到文件系统；`browser_print_started` 也只代表打印流程被尝试启动。两者不能相加当作实际完成的 PDF 下载数。

## 测试与待验

- `src/tests/pdf-export-validation.test.ts`：A4/US Letter 正常画布尺寸、零/负/NaN/Infinity、上下文为空、零页/非整数页数等边界。
- 现有 `e2e/pdf-download.e2e.ts`：以虚构简历执行真实下载，使用 pdf.js 解析每页并检查导出后原稿未丢。
- 新增 `e2e/pdf-download-failure.e2e.ts`：在 Chromium 注入 JPEG 编码失败，核对 Pagevela 自定义提示、打印回退路径及 IndexedDB 原稿保留；已随 #314 的完整 PR/main CI 验收通过。此测试不代表 OS 下载最终成功或白色有效图像像素检查。
- #314 已通过质量、完整 Chromium、Firefox/WebKit、最终 `build-and-test`、合并后 CI/Pages；[Release workflow #45313984785](https://github.com/kunlong-luo/pagevela/actions/runs/45313984785) 成功没有新建 v2.8.4 标签或附件，历史 v2.8.3 不覆盖。
- Android 微信/Chrome/OEM 的系统保存和离线 PWA 仍在 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 分别验收；不会用 Chromium 替代真机证据。

[文档索引](./README.md) · [项目状态](./PROJECT_STATUS.md) · [#313](https://github.com/kunlong-luo/pagevela/issues/313)。
