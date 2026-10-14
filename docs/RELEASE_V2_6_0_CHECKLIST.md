# Resume Craft v2.6.0 — release acceptance checklist

> Draft release plan only. Do not merge the release candidate until manual gates are checked.
> This feature release **keeps the existing GitHub Pages origin and Resume Craft / 简匠 name**. A future new-domain/brand cutover is a separate release.

## Automated gates (verify against the **current PR head**, not a previous green commit)

- [ ] Quality: TypeScript, strict critical types, lint, unit tests, build, performance budget.
- [ ] Full Chromium end-to-end suite, including local portrait crop, PDF download, per-profile photo preservation, workspace export/import, cancel vs. overwrite, and interrupted-save recovery.
- [ ] Critical Firefox and WebKit E2E suites.
- [ ] Final CI build-and-test gate green.
- [ ] The release candidate's `package.json` declares `2.6.0`, and release docs match it. Frozen pnpm lockfile must still install.

## Manual gates with fictional data only

- [ ] **Same-origin v2.5 → v2.6 upgrade:** Use a separate browser profile with two fictional résumés, saved draft, JD notes, and custom market/layout settings. Verify these survive reload and service-worker update without removing the PWA or clearing site data.
- [ ] **Chinese A4 portrait:** Use a permitted sample portrait, exercise upload, 3:4 crop, header-right placement and each supported header layout. Verify no overlap with long contact details, no clipping or extra trailing pages, and that removing the portrait works after reload.
- [ ] **PDF visual & text:** Print Chinese A4 to *ATS PDF* and inspect the **actual PDF pages** at normal zoom and print preview, confirming 210 × 297 mm, correct portrait placement, selectable/searchable résumé text, readable fonts and no clipped text. Also open the raster *Quick PDF* for visual comparison. The existing Quick PDF smoke test only confirms a valid download.
- [ ] **Existing English profiles:** Check an international résumé still hides photos by default, with Letter/A4 and manual overrides preserved after reload.
- [ ] **Workspace backup:** In a separate test browser, export all fictional profiles/drafts/JD/photo. Inspect file version `resume-craft-workspace-v1`; cancel overwriting existing destination data and verify no changes; then confirm restore, reload, and verify profile order, active selection, JD, draft and photo. Verify older *single-resume* JSON imports still work.
- [ ] **Privacy:** Confirm complete workspace JSON is not uploaded in network requests, is explicitly described as **unencrypted**, and saved portrait images do not unexpectedly appear in share links or Markdown. Do not upload real users' personal files to issue trackers.
- [ ] **Security review:** Check the **live GitHub Code scanning / CodeQL alerts** for the current head. Review any open actionable findings and verify previously resolved PR #201 review thread is not mistaken for a confirmed closed repository alert. Record the status in PR #207. If account permissions block the alert dashboard, leave this unchecked.

## Publish after all gates

1. Confirm PR #207's latest head is green, manual PDF/data checks and security review are recorded, and the release candidate remains on the current GitHub Pages hostname.
2. Merge **only the unified PR #207** to `main`; do **not** merge separate feature PRs #201, #204 or #205 again (duplicate changes). Keep the old origin and share-link compatibility.
3. `main` push triggers both **Deploy Pages** and, because `package.json` changes, the **Release** workflow. Check that GitHub Pages updates, the new `v2.6.0` tag/release is created and both workflows succeed.
4. Open the live URL in a clean browser and confirm the displayed app version, navigation, Chinese photo editor and download controls. Then check a separate **existing-data browser** without clearing IndexedDB/localStorage.
5. Keep the original backup safe and collect user feedback. If a rollback is needed, revert and redeploy via `main`; do not delete the live browser's local data or re-use an existing release tag for a different commit.

## Separate: future international domain/brand migration

- [ ] Choose and clear the new name/domain.
- [ ] Rehearse full workspace transfer with two **actual distinct HTTPS hostnames**, plus installed PWA and legacy shared links.
- [ ] Publish migration instructions with a safe transition period before retiring the old host.
