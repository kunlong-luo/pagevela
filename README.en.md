# Pagevela — English documentation entry

Pagevela is live as a local-first Markdown/form resume builder. The primary **English** handbook is [README.md](./README.md); the **简体中文** edition is [README.zh-CN.md](./README.zh-CN.md).

- [Live app](https://kunlong-luo.github.io/pagevela/) · [Source](https://github.com/kunlong-luo/pagevela) · [Latest stable Release](https://github.com/kunlong-luo/pagevela/releases/latest)
- [Documentation index](./docs/README.md) · [Dated project / CI status](./docs/PROJECT_STATUS.md) · [84/100 engineering assessment](./docs/ASSESSMENT_20261123.md) · [2026-11-24 acceptance log](./docs/ENGINEERING_ACCEPTANCE_20261124.md)
- [Contributing](./CONTRIBUTING.md) · [Release policy](./RELEASING.md) · [Workspace transfer](./docs/WORKSPACE_TRANSFER.md)

**Current stable archive:** v2.8.3 (published 2026-11-23). Its main CI, same-SHA Pages and Release succeeded; the ZIP/TAR.GZ and checksum manifest are listed, while independent extraction/hash checks remain unrecorded. Current `main` may change independently; check the dated status and GitHub Actions before interpreting later commits as deployed.

**Post-v2.8.3 development:** #310 is merged and verified with same-SHA CI/Pages at `16b11ff`; #311's Auto Fit safety fix and #314's Quick PDF failure protection are deployed together on main `12c7044` with [full CI](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947) and [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157). Measured 1/2/3-page fitting has merged as [PR #316](https://github.com/kunlong-luo/pagevela/pull/316) into `main` `6532c57`, but its [PR-head Chromium suite failed](https://github.com/kunlong-luo/pagevela/actions/runs/45318654364) an outdated desktop-label expectation (222 passed, 1 failed, 1 skipped). The [merged-main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) and same-SHA Pages are **not yet accepted**; a separate test/doc fix is in progress. None of these changes are retroactively included in v2.8.3 archives. See the [optimization roadmap](./docs/PRODUCT_OPTIMIZATION_ROADMAP_20261124.md).

The former `/resume-craft/` Pages path is not supported or redirected by owner decision. Historical file names, encryption AAD and IndexedDB compatibility contracts are intentionally preserved when required to read existing user data.
