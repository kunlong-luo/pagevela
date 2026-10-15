# Pagevela clearance and launch gates — 2026-10-15

> **Owner-approved name selection (2026-10-15), NOT trademark-cleared or approved for public launch.** This record supplements [INTERNATIONAL_REBRAND_READINESS.md](./INTERNATIONAL_REBRAND_READINESS.md) and issue #202. The owner explicitly rejected continued use of the legacy Chinese brand on 2026-10-15. Retire it in the eventual approved rollout. The owner now selected **Pagevela** as the single English/Chinese name; this is not legal clearance or consent to purchase a domain. Do not change production name, DNS, canonical URLs, manifest names, local storage keys, or the original GitHub Pages origin based on this record.

Implementation decisions: [Pagevela brand implementation contract](./PAGEVELA_BRAND_IMPLEMENTATION_CONTRACT.md).

## Evidence and limits

| Check | Evidence seen | What it establishes | Still required |
| --- | --- | --- | --- |
| USPTO PAGEVELA exact wordmark | Prior 2026-10-15 official-site UI query reportedly showed 0 exact hits, recorded in the parent plan | A single exact-query negative search | Relevant live/dead, sound-alike, spelling, spaced/hyphenated searches; status, owner, goods/services; legal review |
| WIPO PAGEVELA | Parent plan records 0 exact-name results | A limited global database search | National/regional register coverage and variants |
| TMview PAGEVELA | Parent plan records 0 rows | Limited aggregation search, not official national legal clearance | EUIPO/UKIPO and other target national registers |
| Namecheap pagevela.com | Prior read-only registrar page displayed $10.98 first-year, $14.98 renewal retail and conditional $6.79 promotion | A quoted snapshot, NOT reservation | Recheck registrar cart, taxes, renewal, and registry before any approved purchase |
| Exact PAGEVELA public web search (2026-10-15) | Search did not surface an attributable exact-name resume SaaS in the inspected results | Weak negative result only | Product Hunt, Google Play, App Store, social handles, unindexed businesses and common-law use |
| Nearby “VELA” names (2026-10-15) | VELA is visibly used by unrelated products and services, including a Next.js CRM landing template (hairlineui.com/template/vela) and AIVELA wearables (aivela.com/pages/story); older USPTO opposition document shows VELA in travel services | The suffix is not exclusive; **no finding of a confusingly similar mark** without jurisdiction/classes/overall impression analysis | Assess PAGEVELA as a whole against relevant nearby marks in software, employment, templates, publishing, career and education |

Do not treat an exact search yielding zero results as authorization to use or register the wordmark. Keep dated search screenshots/exports, query syntax, jurisdiction, Nice classes and examiner/legal outcome in issue #202.

## Clearance work queue

- [ ] Search exact **PAGEVELA**, **PAGE VELA**, **PAGE-VELA**, **PAGEVELLA** and pronounceable near matches in USPTO and WIPO, recording why each hit does or does not matter.
- [ ] Review relevant Nice classes **9 and 42**, and evaluate whether **35, 41 and other adjacent categories** are relevant to actual planned services; classes alone do not decide confusion.
- [ ] Inspect EUIPO, UKIPO, Canada (CIPO) and China (CNIPA) depending on actual launch/registration plan, including unregistered commercial use.
- [ ] Inspect software/career products, app marketplaces, Product Hunt and social handles. Do not assume handle ownership from a search result.
- [ ] Confirm English naming, capitalization, pronunciation and Chinese-market localization without continuing the legacy Chinese brand; get explicit owner sign-off.
- [ ] **Only with separate owner authorization** purchase a domain following fresh price and rights review. Naming approval alone does not authorize a purchase. No automatic DNS, redirect or existing GitHub Pages custom-domain modification.

## Separate HTTPS-origin rehearsal — remaining matrix

The opt-in Playwright scenario `e2e/rebrand-live-origins.e2e.ts` checks opt-in import, cancel, overwrite, portrait, profile, draft, JD, persistence and no legacy-origin redirect. **No second live hostname yet exists, so it has not executed against two real HTTPS sites.** It also does not itself prove the following:

| Area | Required gate | Method |
| --- | --- | --- |
| Legacy share links | Existing encrypted v2/v3 fragments still open from legacy hostname; old AAD values remain unchanged | E2E fixture URLs and manual smoke checks |
| Newly generated sharing | New hostname URLs work; no photograph or private resume content accidentally shipped | E2E and review |
| Installed PWA | Old installed PWA retains storage and remains usable; new PWA installs separately; service worker/cache update safe | Chrome/Edge, Safari where available; manual evidence |
| Search index | Old site remains usable for export, correct canonical and sitemap only after new host is validated; no accidental noindex or redirect | Inspect both rendered heads, robots, sitemap, Search Console |
| Print/PDF | A4 and US Letter exports retain page integrity, text selection where supported, photos and font rendering | Manual browser comparison and automated smoke |
| Multi-browser | Chromium, Firefox and WebKit; desktop and mobile layouts | CI matrix plus manual |
| Privacy | Migration requires explicit export/import; files containing resumes and photos never leave browser except user-selected file | Source review plus browser network inspection |
| Recovery | Import failure/cancel leaves destination unchanged, and the complete editor/exporter remains reachable at legacy origin | Negative tests and manual |

## Go / no-go decision

**NO-GO** until: (1) mark similarity and market-use review recorded and cleared for intended rollout (the *name choice* is already approved), (2) domain acquisition explicitly authorized, (3) a separate live HTTPS site is deployed without replacing old-origin access, (4) the above matrix passes with evidence, and (5) rollback and documentation are approved. Keep v2.6.0 and the existing origin unchanged until those gates pass.
