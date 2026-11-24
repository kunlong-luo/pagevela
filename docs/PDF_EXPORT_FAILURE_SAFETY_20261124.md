# Quick PDF raster failure handling / 快速 PDF 空白结果防护

> **2026-11-24 PR 候选，未证明已部署。** 解决 [#313](https://github.com/kunlong-luo/pagevela/issues/313) 审查发现的潜在假成功：若浏览器返回空画布或无法建立 2D 渲染上下文，原流程可能执行 `pdf.save()` 并报告成功。本次不能被追记为已发布 v2.8.3 的功能。

## 保护边界

- `src/lib/pdf-export-validation.ts` 的守卫拒绝非正/非有限画布宽高、空 `CanvasRenderingContext2D` 以及最终没有成功添加任何图像页的 PDF。
- `src/lib/pdf-export.ts` 在创建完整栅格后调用守卫，只有真正 `addImage` 完成才增加 `renderedPages`，零页会在调用 `pdf.save` **之前**抛错。保留 A4/US Letter、既有文本避让算法、手动分页和渲染副本清理。
- `src/hooks/useResumeActions.ts` 检查返回值必须严格为 `true` 才发出已有 `pdf_export_success` 事件，失败时用 **Pagevela 自定义 Toast** 提醒并保留 ATS 浏览器打印回退入口，不新增原生 `alert/confirm/select/tooltip`。
- **语义边界：** `pdf_export_success` 仍代表 PDF 生成并向浏览器发出下载请求，不能证明用户设备已完成下载或实际保存到文件系统；`browser_print_started` 也只代表打印流程被尝试启动。两者不能相加当作实际完成的 PDF 下载数。

## 测试与待验

- `src/tests/pdf-export-validation.test.ts`：A4/US Letter 正常画布尺寸、零/负/NaN/Infinity、上下文为空、零页/非整数页数等边界。
- 现有 `e2e/pdf-download.e2e.ts`：以虚构简历执行真实下载，使用 pdf.js 解析每页并检查导出后原稿未丢。
- 新增 `e2e/pdf-download-failure.e2e.ts`：在 Chromium 强制让 JPEG 编码失败，确认 Pagevela 自定义失败 Toast 可见、不错误显示快速 PDF 成功、回退打印路径仍可执行，并验证 IndexedDB 原稿未丢。**此用例尚待最新 PR 头 CI 真正运行通过，不能把提交测试文件等同测试已通过。**
- 合并前需最新头 PR 的质量、Chrome 全量、Firefox/WebKit 关键回归和最终 `build-and-test`；合并后再次核验**新 main SHA** 的完整 CI → Pages build/deploy。由于这不是一个新版本发布流程，不能声称已有新的 v2.8.4 归档。
- Android 微信/Chrome/OEM 的系统保存和离线 PWA 仍在 [#262](https://github.com/kunlong-luo/pagevela/issues/262) 分别验收；不会用 Chromium 替代真机证据。

[文档索引](./README.md) · [项目状态](./PROJECT_STATUS.md) · [#313](https://github.com/kunlong-luo/pagevela/issues/313)。
