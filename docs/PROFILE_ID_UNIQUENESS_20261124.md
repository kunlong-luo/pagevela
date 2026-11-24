# Pagevela 多档案主键唯一性 / Resume profile ID uniqueness

> **2026-11-24 已验收上线：** [#325](https://github.com/kunlong-luo/pagevela/pull/325) 合并为 `a8ec3ae`，[完整 main CI #45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) 和 [Pages #45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) success。当前 [88 分评分](./ASSESSMENT.md) 已在数据可靠性维度考虑本项，不重复加分。正式包仍为 v2.8.3。

## 发现 / Root cause

`src/store/useResumeStore.ts` 的 `createProfile` 和 `duplicateProfile` 原来都生成 `profile_${Date.now()}`。同一个 JavaScript 毫秒内执行两次新建/复制，两个不同的 ResumeProfile 会具有同一主键；存入 IndexedDB 的 profiles 表（主键 `id`）时可能出现互相覆盖，特别是在自动操作或快速连续触发时。

## 修复范围 / Change

- 将新建、复制两条写入路径统一调用 `src/lib/resume-profile-id.ts` 的 `createResumeProfileId()`。
- 浏览器支持 `crypto.randomUUID()` 时使用 UUID；否则采用时间戳、每个 JavaScript 运行上下文的递增序列及随机后缀组合。保持 `profile_` 前缀，既有 UUID、旧 `profile_时间戳`、备份文件内 ID、IndexedDB 表定义和 schema **完全不迁移或改写**。
- `src/tests/resume-profile-id.test.ts` 在同毫秒、无 UUID、确定性随机值下重复生成 100 次并验证不重复，同时测试 UUID 路径。
- `src/tests/resume-store.test.ts` 固定 `Date.now`，在真实 Store 中快速新建两份并复制一份虚构简历，断言全部 ID 唯一、档案数量和正文均完整。

## 验收和剩余风险

**已完成的验收门禁：** PR 最新头质量、TypeScript、Vitest、完整 Chromium、Firefox/WebKit 和实际 `build-and-test` 成功；合并后 main `a8ec3ae` 的完整 CI 与同 SHA Pages 也成功。原文中的跨设备/旧版客户端风险仍须单独验证。

本修复解决**本标签页内同毫秒创建/复制**的主键碰撞。它不是 [#323](https://github.com/kunlong-luo/pagevela/pull/323) 的跨标签页版本冲突修复：旧版本已打开的客户端可能继续生成时间戳 ID；跨浏览器互相写入、完整档案及证件照冲突恢复和真机兼容仍须另验。随机 ID 不构成数据加密或访问权限控制。若浏览器在不安全上下文且 `crypto.randomUUID` 不可用，fallback 在极端跨标签页同时运行时仍是概率性避碰，不能声称数学上跨所有上下文绝对唯一。

[工程路线图 #282](https://github.com/kunlong-luo/pagevela/issues/282) · [当前评分](./ASSESSMENT.md) · [项目状态](./PROJECT_STATUS.md)
