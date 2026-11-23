# Releasing Pagevela

> **2026-11-23 status:** [PR #303](https://github.com/kunlong-luo/pagevela/pull/303) has merged as `93a0941`: the release artifact PWA precache/performance gates and weekly npm security inventory are now on `main`. Its latest [full main CI #45154252875](https://github.com/kunlong-luo/pagevela/actions/runs/45154252875) is still under verification at this snapshot; do not claim same-SHA Pages until its deployment actually succeeds. The newest **confirmed previous** successful full CI and Pages are from `37bb6ae`: [CI](https://github.com/kunlong-luo/pagevela/actions/runs/45142496880) · [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45144232065). Latest **downloadable** stable Release remains [v2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2); it does not contain subsequent `main` changes.

> **2026-11-22 post-fix evidence:** [PR #292](https://github.com/kunlong-luo/pagevela/pull/292) merged as `93d3d8a`; [full main CI #45021860745](https://github.com/kunlong-luo/pagevela/actions/runs/45021860745) and [same-SHA Pages #45022812621](https://github.com/kunlong-luo/pagevela/actions/runs/45022812621) passed. This supersedes the dated main CI failure described later in this document. The latest **packaged** GitHub Release remains v2.8.2 until a separately gated version bump.

Pagevela publishes stable releases only.

> **Live Pagevela release status:** PR #210 was merged and the public project was renamed to `kunlong-luo/pagevela`; the published site is https://kunlong-luo.github.io/pagevela/. Past release archives remain intact. v2.8.2 exports and new encrypted links use Pagevela identifiers while accepting legacy backups/share formats, and the established IndexedDB/cross-tab identifiers remain stable. The old `/resume-craft/` Pages URL is not redirected, by owner choice. Trademark review and optional future custom domains are separate. Pre-release versions such as alpha, beta, rc, canary, next, nightly, dev, and experimental are not published.

## Current-source status and evidence

The v2.8.2 artifact is the latest stable **published release**, but publishing is not the same as deploying the newest source. The **2026-11-22 split-pane failure is historical** and has been superseded by later fixes. As of 2026-11-23, protected `main` `37bb6ae` passed full CI and same-SHA Pages deployment, including a production PWA offline-navigation smoke and build-time precache guard. The latest packaged release is still v2.8.2. See [the dated status snapshot](docs/PROJECT_STATUS.md) and always verify GitHub Actions again for future releases.

## Latest stable release line

v2.8.2 (2026-10-25) is the latest verified stable release: [Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2) · [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/40202793334) · [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/40203720040), commit `59246623fdbf727a0a767c1e67375401995e0299`. A future release still requires its own protected checks and same-commit deployment acceptance.

The GitHub Release title and tag use **Pagevela**, while distributable file names now use `pagevela-X.Y.Z.zip`, `pagevela-X.Y.Z.tar.gz`, and `SHA256SUMS.txt` for all new stable releases. These are the current branded filenames, not a promise that historic archive names were changed. Historical release archives and checksums remain unchanged.

**Release sequencing upgrade in review (not yet on `main`):** the proposed Release workflow listens to successful **`Deploy Pages` completion** instead of independently reacting to `package.json` pushes. Pages itself already requires a successful full push-triggered `CI` on `main` and rejects stale SHAs. Before creating a Release, the new gate independently checks both successful **full CI and Pages on exactly the current `main` SHA** against GitHub Actions. Manual dispatches must pass the same two checks; an operator cannot bypass them. Published ZIP/TAR/SHA256 assets and historic tags are never overwritten. Until this proposal is merged, the current Release workflow retains its old independent push trigger.

## Versioning

Use semantic versioning:

- Patch: `2.0.0 -> 2.0.1` for backward-compatible fixes.
- Minor: `2.0.0 -> 2.1.0` for backward-compatible features.
- Major: `2.0.0 -> 3.0.0` for breaking changes.

The version in `package.json` is the source of truth.

## Recommended release process

1. Merge all changes that should be included in the release.
2. Make sure `main` is green.
3. Update only to a new stable version in `package.json` through a normal pull request.
4. Let the required CI checks pass.
5. Squash-merge the version bump pull request into `main`.

**Once the separate release-sequencing PR is merged**, a successful `main` CI gates Pages deployment, and successful **same-SHA Pages** in turn triggers the Release workflow. The Release independently confirms both CI and Pages checks against the current main commit, skips already published stable tags, and refuses stale code. Before that PR is merged, release still triggers independently on the relevant `main` push.

The workflow will:

- ignore `package.json` edits that do not change the version;
- reject non-stable SemVer versions;
- enforce the stable dependency policy;
- install with the frozen pnpm lockfile;
- run TypeScript and strict critical boundary checks, bilingual-label audit, lint and unit tests;
- build production assets, verify the **Workbox app-shell precache**, and enforce the performance budget;
- package the complete `dist/` output as `pagevela-X.Y.Z.zip` and `pagevela-X.Y.Z.tar.gz`;
- generate `SHA256SUMS.txt` **before creating any tag**;
- recheck current `main`, then create or reuse an annotated `vX.Y.Z` tag only for a not-yet-published version;
- publish the new GitHub Release with automatically generated release notes, never overwriting historical assets.

## Manual fallback

For a first-publish retry **after the sequencing change merges**, open **Actions -> Release -> Run workflow**, select `main`, and enter exactly the stable version in `package.json`. The workflow checks that **the current `main` SHA has already passed full push-triggered CI and CI-gated Pages deployment**. It cannot bypass either gate or republish an existing version.

## Failed releases

A first publication can be retried when a same-commit tag exists but its GitHub Release has not yet been created. **Already published ZIP/TAR/SHA256 assets are immutable**: a retry must never use `gh release upload --clobber`, retag, or replace those files. Existing releases are skipped; if a publication partially fails, inspect the tag, asset integrity, CI and Pages status before repair. The workflow checks that `main` did not move before tagging and again before publishing.
