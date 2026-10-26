# Releasing Pagevela

Pagevela publishes stable releases only.

> **Live Pagevela release status:** PR #210 was merged and the public project was renamed to `kunlong-luo/pagevela`; the published site is https://kunlong-luo.github.io/pagevela/. Past release archives remain intact. v2.8.2 exports and new encrypted links use Pagevela identifiers while accepting legacy backups/share formats, and the established IndexedDB/cross-tab identifiers remain stable. The old `/resume-craft/` Pages URL is not redirected, by owner choice. Trademark review and optional future custom domains are separate. Pre-release versions such as alpha, beta, rc, canary, next, nightly, dev, and experimental are not published.

## Latest stable release line

v2.8.2 (2026-10-25) is the latest verified stable release: [Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2) · [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/40202793334) · [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/40203720040), commit `59246623fdbf727a0a767c1e67375401995e0299`. A future release still requires its own protected checks and same-commit deployment acceptance.

The GitHub Release title and tag use **Pagevela**, while distributable file names now use `pagevela-X.Y.Z.zip`, `pagevela-X.Y.Z.tar.gz`, and `SHA256SUMS.txt` for all new stable releases. These are the current branded filenames, not a promise that historic archive names were changed. Historical release archives and checksums remain unchanged.

The `Release` workflow on a `package.json` version bump creates the tag and downloadable assets. If a previous run failed before creating a tag, a reviewed fix to `.github/workflows/release.yml` can safely retry the same not-yet-tagged stable version; once a tag exists, unchanged versions are skipped. It is independent of the `Deploy Pages` `workflow_run` gate, which requires completed, successful full main-push CI on the identical latest main SHA. A green Release alone does not prove the website was updated.

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

When GitHub detects that the `package.json` version changed on `main`, the Release workflow runs automatically.

The workflow will:

- ignore `package.json` edits that do not change the version;
- reject non-stable SemVer versions;
- enforce the stable dependency policy;
- install with the frozen pnpm lockfile;
- run type checking, unit tests, and the production build;
- create or reuse the annotated `vX.Y.Z` tag;
- package the complete `dist/` output as `pagevela-X.Y.Z.zip` and `pagevela-X.Y.Z.tar.gz`;
- generate `SHA256SUMS.txt`;
- publish a GitHub Release with automatically generated release notes.

## Manual fallback

If an automatic run needs to be retried, open **Actions -> Release -> Run workflow**, select `main`, and enter the exact stable version already present in `package.json`.

## Failed releases

The workflow is safe to rerun. If the tag already exists on the same commit, it is reused. If a tag with the same version points to a different commit, the workflow fails instead of moving the tag.
