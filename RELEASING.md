# Releasing Pagevela

Pagevela publishes stable releases only.

> **Live Pagevela release status:** PR #210 was merged and the public project was renamed to `kunlong-luo/pagevela`; the published site is https://kunlong-luo.github.io/pagevela/. Historical v2.6.0 archives and internal data/share keys stay unchanged. The old `/resume-craft/` Pages URL is not redirected, by owner choice. Trademark review and optional future custom domains are separate. Pre-release versions such as alpha, beta, rc, canary, next, nightly, dev, and experimental are not published.

## Latest stable release line

v2.8.0 (2026-10-24) follows v2.7.0 with mobile, welcome, bilingual UI, and strict browser CI improvements. Release only after the version bump PR passes protected checks.

New v2.8.0+ release assets are `pagevela-X.Y.Z.zip`, `pagevela-X.Y.Z.tar.gz`, and `SHA256SUMS.txt`. Preserve original historical `resume-craft-*` archives and checksums.

The `Release` workflow on a `package.json` version bump creates the tag and downloadable assets. It is independent of the `Deploy Pages` `workflow_run` gate, which requires completed, successful full main-push CI on the identical latest main SHA. A green Release alone does not prove the website was updated.

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
- package the complete `dist/` output as Pagevela-branded ZIP and TAR.GZ archives;
- generate `SHA256SUMS.txt`;
- publish a GitHub Release with automatically generated release notes.

## Manual fallback

If an automatic run needs to be retried, open **Actions -> Release -> Run workflow**, select `main`, and enter the exact stable version already present in `package.json`.

## Failed releases

The workflow is safe to rerun. If the tag already exists on the same commit, it is reused. If a tag with the same version points to a different commit, the workflow fails instead of moving the tag.
