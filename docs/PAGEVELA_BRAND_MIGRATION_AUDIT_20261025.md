# Pagevela — 品牌及迁移结项审计 / 2026-10-25

**Scope:** This is the current *engineering* status for [issue #202](https://github.com/kunlong-luo/pagevela/issues/202), which contains a long pre-launch chronology. Historic pre-launch "do not launch" statements were superseded by the owner's **Option A** decision and the actual v2.8.0 GitHub Pages launch. Preserve the historical record, but do not read it as the current deploy instruction.

## Engineering / 已核实项目

| Gate | Evidence and outcome | State |
| --- | --- | --- |
| Global brand identity | Active site uses **Pagevela** in English and **页帆** in Chinese, with Pagevela PWA metadata; the same source branding is guarded by `src/tests/pagevela-brand.test.ts`. | PASS — code/CI |
| Canonical and social metadata | `index.html`, public sitemap/robots and landing links use `https://kunlong-luo.github.io/pagevela/`; v2.8.0's deployed welcome page is reachable. | PASS — code + live URL |
| Repository and release | `kunlong-luo/pagevela` and annotated stable v2.8.0 tag; SHA-matched main CI #40051654058 and Pages #40052552558 succeeded. | PASS — GitHub |
| Owner-hosting decision | Former `/resume-craft/` route is intentionally **not** redirected. China/EdgeOne pilot PR #240 was closed **unmerged**. No custom-domain DNS or hosting migration was authorized. | DECIDED |
| Data and share compatibility | `src/tests/pagevela-brand.test.ts` guards `resume-craft-share-v2/v3`, IndexedDB/cache identifiers, existing export naming; portable workspace and storage migration E2E exist. `docs/WORKSPACE_TRANSFER.md` says backup JSON is unencrypted. | PASS — automated source tests, real-device scenarios still OPEN |
| Historic materials | Old release names and inactive redirect sources may remain for backwards compatibility and historical context; do not mass-replace `resume-craft` identifiers. | DECIDED |

## External evidence still missing / 无法由 CI 代替

1. **Trademark clearance / 商标**: the owner-approved name is **not legal clearance**. For relevant markets, check exact/near phonetic/visual marks in the official USPTO, WIPO, EUIPO/UKIPO and China systems; compare classes 9, 42 plus adjacent career/education/publishing services and actual market use; obtain qualified counsel's jurisdiction-specific advice before claiming an exclusive right to the mark. Do not infer clearance from zero exact-match results.
2. **Near-mark triage / 近似标识**: official [USPTO wordmark search](https://tmsearch.uspto.gov/search/search-results/99084408) exposes **OPENVELA** serial **99084408** with classes **9/35/38/42**; historical files additionally identify serial **98766400**. These are research leads **only**, not evidence of infringement or guaranteed current legal status. Official TSDR status histories and the rest of the international searches remain to be documented.
3. **Commercial assets and accounts / 外部平台**: domain/registrar purchase status, owned social/app marketplace handles, and edits to historic DEV/PWAs.app/Product Hunt/YouTube listings need owner/account evidence. No domain booking, trademark registration or external campaign publication is claimed here.
4. **Real migrations / 真机和 PWA**: On 2026-10-25, the owner confirmed **actual Android + WeChat real-device testing passed** ([#262 owner report](https://github.com/kunlong-luo/pagevela/issues/262)); do not overwrite this with the earlier 'not tested' status. This attestation is not an independent report of individual flows, native Android print, downloaded/opened PDF, installed-PWA scope or Android Chrome/Samsung/OEM browser results. Additional release-critical evidence is still tracked in [#262](https://github.com/kunlong-luo/pagevela/issues/262) and [v2.8.1 device matrix](./V2_8_1_ANDROID_RELEASE_ACCEPTANCE.md).

## Issue #202 closure decision

- **Engineering rename + live domain-path transition:** complete, record as such.
- **Legal/right-to-use review, offsite listing ownership and real-device acceptance:** **open** until objective evidence arrives.
- Do **not** close #202 on the strength of GitHub Actions or web search alone; alternatively split external clearance into a separate tracked issue after independently documenting exact outcomes and owner approval.
- No further redirect, domain/DNS switch, or automatic personal-data transfer is authorized.

**Documentation precision:** Same `https://kunlong-luo.github.io` HTTPS origin with a different path is *not* a different IndexedDB origin; a different domain/browser/profile/device **is**. Existing installed PWA scope and cache state can nonetheless differ after the path change.
