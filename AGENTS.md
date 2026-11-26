# AGENTS.md — Pagevela repository-first development

Applies to the whole repository. Start here in every new development session. Chat history is optional, never the sole source of project requirements or task state.

## 1. Start a session

1. Read this file, [README](README.md), [documentation index](docs/README.md), [project status](docs/PROJECT_STATUS.md), [assessment](docs/ASSESSMENT.md) and [roadmap](docs/NEXT_PHASE_ROADMAP_20261125.md).
2. Query live [Issues](https://github.com/kunlong-luo/pagevela/issues), [PRs](https://github.com/kunlong-luo/pagevela/pulls), [Actions](https://github.com/kunlong-luo/pagevela/actions), [Releases](https://github.com/kunlong-luo/pagevela/releases) and exact main SHA. Inspect open work before creating a branch. Live GitHub evidence supersedes stale status snapshots; source code is authoritative for implementation.
3. Resume an existing unfinished task before starting unrelated work. Otherwise choose one scoped Issue, define acceptance criteria, and branch from current main. Prefer one task / Issue / branch / PR / session; a long-running CI or external blocker may be handed off without marking the task done.
4. Read the relevant implementation, tests and technical contract. Do not infer unverified facts from old chat or a green aggregate badge.

## 2. Product and architecture

Pagevela is a local-first, bilingual Markdown resume builder, with React, TypeScript, Vite, Tailwind CSS, Zustand, Dexie/IndexedDB and Playwright/Vitest. Inspect package.json for current versions; use Node/pnpm versions pinned by the repository.

- src/components and src/hooks: UI, editor and reusable behavior. Reuse existing components and narrowly select state instead of subscribing to an entire store.
- src/store and src/lib: domain state, persistence, import/export and shared logic. Preserve data contracts and prefer focused, testable modules over large unrelated refactors.
- src/i18n: keep Chinese/English labels and types aligned; do not hardcode a one-language replacement.
- src/tests and e2e: unit/integration and browser regressions. Use fictional resume fixtures only.
- docs: technical contracts, canonical status, engineering evidence and historical records.

## 3. Non-negotiable constraints

- Follow [Branded UI Contract](docs/BRANDED_UI_CONTRACT.md). No visible browser-native dialogs, tooltips, default selects or similar widgets. Use branded controls, consistent styling, accessible semantics, focus and touch targets. Platform file pickers and print dialogs are permitted only as necessary services triggered by branded UI. Check desktop/mobile, both languages and themes.
- Preserve local-first behavior and existing resume data. Never silently discard drafts or show a false saved state. Keep historical resume-craft IndexedDB, Web Lock, BroadcastChannel and encrypted-share identifiers compatible; public branding is Pagevela. Do not restore the retired Pages redirect.
- No real resume data, tokens or credentials in commits, issues, logs or screenshots. Do not add telemetry carrying resume content. Follow [security policy](SECURITY.md).
- Stable dependencies only. Avoid unnecessary dependencies and unrelated architectural changes. No weakened tests, branch protection bypass, force-push of main, or overwriting released tags/assets.

## 4. Implement and validate

Follow [CONTRIBUTING](CONTRIBUTING.md). Start with a reproduced defect or explicit acceptance criteria; change the minimum necessary and add targeted tests. Run when available:

```sh
pnpm install --frozen-lockfile
pnpm check:stable-deps
pnpm i18n:audit
pnpm docs:check
pnpm typecheck
pnpm typecheck:critical
pnpm lint
pnpm test
pnpm build
pnpm perf:budget
```

Run affected Playwright tests; the protected CI remains required even if local tests passed. If no local runner is available, explicitly say so and cite the actual CI result. Do not invent measurements or hardware tests.

## 5. Definition of done

- Task acceptance criteria are satisfied; relevant behavior/tests and documentation are committed.
- PR targets current main; exact current HEAD passes quality, full Chromium, critical Firefox/WebKit and build-and-test. Revalidate after head/base integration changes. Do not bypass branch rules.
- Merge when eligible; independently verify the merged exact SHA's full main-push CI (including four browser shards) and Pages build/deploy. Avoid superseding a pending production SHA just to update a status sentence.
- A formal release additionally requires a version PR, exact-SHA release tag/assets and independent downloaded ZIP/TAR/SHA256 validation, per [RELEASING](RELEASING.md). The published website and downloadable release can differ.
- Only close a task as complete after its applicable gates. If tests or external validation remain, keep its issue/PR traceable; close the chat if desired, not the unfinished task. Never equate automated browser coverage with real Android/OEM/system print results.
- Update [ASSESSMENT](docs/ASSESSMENT.md) only when deployed evidence warrants it; no automatic points for documentation or passing a PR. State limitations.

## 6. Session handoff and documentation

Use [PROJECT_STATUS](docs/PROJECT_STATUS.md) as the single mutable snapshot and [engineering ledger](docs/ENGINEERING_ACCEPTANCE_20261124.md) for immutable verified evidence. READMEs and docs index link to those sources rather than duplicating live SHAs/statuses. Preserve historical reports and existing relevant technical notes; do not create a new report for every session.

Before ending, commit useful changes or identify explicitly what was not saved. Record a handoff in the existing Issue/PR and, when needed, the project status: goal and acceptance criteria; changed files; branch/PR/exact HEAD and base SHA; completed and pending test links; merged and deployed SHA if verified; known blockers/limitations; next single action and any owner-only step. Never put credentials or personal data there. Do not push a redundant commit solely to restart an active CI; use PR/Issue comments or description to record a fresh checkpoint.

A fresh session must be able to read repository evidence, reconstruct the state, select the next action, and avoid duplicate PRs without old chat. Verify this independently before claiming complete chat independence.

中文简要：每次先读本文件及状态文档，再查 GitHub 实时 PR/CI/Release；一次聚焦一个任务，未验收不得写成完成。关闭会话不等于关闭 Issue。长期规则写入仓库，动态进度写入 Issue/PR 与 PROJECT_STATUS；不要依赖聊天记录。
