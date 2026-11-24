# Resume Craft v2.6.0 — release acceptance checklist

> **Historical release record — 2026-10-14.** This records the original v2.6.0 shipment under Resume Craft. **The current Pagevela product is at https://kunlong-luo.github.io/pagevela/; the old `/resume-craft/` Pages path is retired (no redirect).** Legacy URLs and names inside this checklist are retained only as evidence of the original release, not as current links to share.
>
> **Published release record — 2026-10-14.** v2.6.0 has shipped on the existing GitHub Pages origin with the Resume Craft / 简匠 name unchanged. This file retains the preflight checklist as an audit reference; the future international domain/brand migration is separate.
>
> The maintainer confirmed the final manual release checks before merging PR #207. Automated CI, build, Pages deployment and GitHub Release are independently verified below. Detailed manual checks that cannot be independently rechecked from CI remain unchecked as evidence placeholders; an unchecked historical item is not an assertion that the release has not shipped.

## Publication evidence

- **Version source of truth:** `package.json` = `2.6.0`, exposed as `__APP_VERSION__` by the Vite build; release notes and bilingual README describe v2.6.0.
- **Merged:** [PR #207](https://github.com/kunlong-luo/resume-craft/pull/207) to `main` via squash commit `e96a1af50a83c5f84a0ea465b357ef177e817bb4`.
- **Candidate CI:** [38558712165](https://github.com/kunlong-luo/resume-craft/actions/runs/38558712165) — all four checks green, including 103 Chromium tests and Firefox/WebKit critical tests.
- **Production `main` CI:** [38572328413](https://github.com/kunlong-luo/resume-craft/actions/runs/38572328413) — completed successfully, including the full Firefox/WebKit suite.
- **Deployment:** [Deploy Pages run 38572328802](https://github.com/kunlong-luo/resume-craft/actions/runs/38572328802) succeeded; [the original site](https://kunlong-luo.github.io/resume-craft/) and editor returned HTTP 200.
- **Stable release:** [v2.6.0](https://github.com/kunlong-luo/resume-craft/releases/tag/v2.6.0), published 2026-10-14; release archives and SHA256 sums were attached.
- **Privacy:** Workspace JSON backup is explicitly **unencrypted**; old-origin IndexedDB is not automatically transferred across hostnames; existing share protocol identifiers remain unchanged.


## Automated gates (verified for release candidate and production)

- [x] Quality: TypeScript, strict critical types, lint, unit tests, build, performance budget.
- [x] Full Chromium end-to-end suite, including local portrait crop, PDF download, per-profile photo preservation, workspace export/import, cancel vs. overwrite, and interrupted-save recovery.
- [x] Critical Firefox and WebKit E2E suites.
- [x] Final CI build-and-test gate green.
- [x] The release candidate's `package.json` declares `2.6.0`, and release docs match it. Frozen pnpm lockfile must still install.

## Manual acceptance checklist (maintainer-confirmed before release; retain specific evidence when available)

- [ ] **Same-origin v2.5 → v2.6 upgrade:** Use a separate browser profile with two fictional résumés, saved draft, JD notes, and custom market/layout settings. Verify these survive reload and service-worker update without removing the PWA or clearing site data.
- [ ] **Chinese A4 portrait:** Use a permitted sample portrait, exercise upload, 3:4 crop, header-right placement and each supported header layout. Verify no overlap with long contact details, no clipping or extra trailing pages, and that removing the portrait works after reload.
- [ ] **PDF visual & text:** Print Chinese A4 to *ATS PDF* and inspect the **actual PDF pages** at normal zoom and print preview, confirming 210 × 297 mm, correct portrait placement, selectable/searchable résumé text, readable fonts and no clipped text. Also open the raster *Quick PDF* for visual comparison. The existing Quick PDF smoke test only confirms a valid download.
- [ ] **Existing English profiles:** Check an international résumé still hides photos by default, with Letter/A4 and manual overrides preserved after reload.
- [ ] **Workspace backup:** In a separate test browser, export all fictional profiles/drafts/JD/photo. Inspect file version `resume-craft-workspace-v1`; cancel overwriting existing destination data and verify no changes; then confirm restore, reload, and verify profile order, active selection, JD, draft and photo. Verify older *single-resume* JSON imports still work.
- [ ] **Privacy:** Confirm complete workspace JSON is not uploaded in network requests, is explicitly described as **unencrypted**, and saved portrait images do not unexpectedly appear in share links or Markdown. Do not upload real users' personal files to issue trackers.
- [ ] **Security review:** Check the **live GitHub Code scanning / CodeQL alerts** for the current head. Review any open actionable findings and verify previously resolved PR #201 review thread is not mistaken for a confirmed closed repository alert. Record the status in PR #207. If account permissions block the alert dashboard, leave this unchecked.

## Deployment record and rollback

The originally planned five publication steps were completed on 2026-10-14, following the maintainer's manual acceptance confirmation: merged only the unified #207 PR, built and deployed on the same GitHub Pages hostname, published the v2.6.0 GitHub Release, and checked the public homepage and editor.

For future patches, continue using the normal reviewed PR process. The release tag `v2.6.0` is immutable; a later feature or fix requires a new SemVer release tag. If rollback is needed, use a reviewed revert/new `main` deployment and preserve browser-local drafts; **never erase old-origin IndexedDB/localStorage to roll back**.

## Separate: future international domain/brand migration

- [ ] Choose and clear the new name/domain.
- [ ] Rehearse full workspace transfer with two **actual distinct HTTPS hostnames**, plus installed PWA and legacy shared links.
- [ ] Publish migration instructions with a safe transition period before retiring the old host.
