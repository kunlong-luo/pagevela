# International rebrand readiness (working document)

> Status: **preparation only, not a production rebrand**. No new brand or domain is approved. The working direction is to introduce a distinctive new international English name while retiring the legacy Chinese-facing product name from all future public branding. Pagevela is the leading candidate for a single international identity, but is not yet approved. Do not substitute candidate names into user-facing pages yet.
>
> Tracking: [International rebrand issue #202](https://github.com/kunlong-luo/resume-craft/issues/202).
>
> Original audit began 2026-10-13 and now reflects **production v2.6.0** plus 2026-10-15 migration-readiness tests. This is **not** trademark or domain approval. Recheck registries, social names, and actual deployment/origin behavior before any rename.

## Naming decision update — 2026-10-15

The owner has **rejected continued use of the legacy Chinese brand**. The previously proposed dual-brand strategy is superseded. Plan one approved new brand for international and Chinese-language experiences, with localized copy rather than a second brand name. **Pagevela remains a preferred candidate, not an approved trademark or live product rename.** Legacy domain, URLs, storage, encrypted-share AAD and backward compatibility must be preserved for existing users until a safe migration is tested; preserving technical constants does not mean using the old name in new UI or marketing.

## 1. Business / product direction

Primary launch market: English-speaking US, UK, Canada and other international markets. Initial target audience: developers, technical job seekers, and candidates who maintain multiple tailored resumes.

Candidate positioning (not a claim of ATS passage):

**Build a professional resume. Keep control of your data.**

- No account required to get started.
- Local-first storage of resume content.
- Editable with structured forms **or** Markdown.
- Live A4 / US Letter preview with layout controls.
- Text-selectable PDF through browser print where supported.
- Optional resume variations and JD keyword checks (guidance, not an ATS guarantee).

Prioritize a reliably completed first resume over adding a large number of weak templates or making unverified AI claims.

## 2. Historical naming research — UNVERIFIED (not a dual-brand proposal)

| English concept | Retired historical Chinese idea (not for use) | Why it may fit | Current status |
| --- | --- | --- | --- |
| Pagevela | 页帆 | Memorable page/journey motif | Search-engine-only preliminary check; **not cleared** |
| Folivanta | 履跃 | Suggests portfolio + progress | Search-engine-only preliminary check; **not cleared** |
| Cverilo | 履序 | CV-oriented, ordered work | Search-engine-only preliminary check; **not cleared** |

The Chinese labels above are historical brainstorm notes only and are **not** proposed product names or a Chinese sub-brand. These English names are provisional ideas, **not available/registrable domain or trademark claims**. Generic web-search queries found no clearly identified exact-name resume company in the inspected results; this is weak negative evidence, not legal clearance.

Before the naming decision, check:
1. Exact, phonetic and visually similar marks across official USPTO / WIPO / EUIPO / China records, including Nice classes 9 and 42 as well as applicable adjacent classes and services.
2. Actual registrar/RDAP results for .com and alternative domains; do not infer availability from search absence.
3. Names and near-matches in GitHub, Product Hunt, Google Play, App Store, search results, and social handles.
4. Ease of pronunciation, spelling on first hearing, cultural connotations, search distinctiveness.
5. Trademark/legal review appropriate for the intended launch jurisdictions.

Useful official resources:
- https://www.wipo.int/en/web/madrid-system/how_to/search/index
- https://www.wipo.int/en/web/global-brand-database/index
- https://www.uspto.gov/trademarks/search

**Stop rule:** Until this clearance is documented and a name is deliberately approved, make **no rename to main, domain redirects, PWA name changes, or new public logo rollout**.

## 2.1 Historical naming research and rollout gates — 2026-10-14

### Provisional preference and evidence

| Candidate | Pronunciation & recognizability | Search evidence | Domain registration | Trademark clearance | Decision |
| --- | --- | --- | --- | --- | --- |
| **Pagevela** / 页帆 | Short, two-element compound: page + vela (sail); easiest to communicate to developers and ordinary job seekers | Quick multi-query web search did not produce a clearly attributable exact-name resume software company; results were noisy, **not exhaustive** | **RDAP 404 on 2026-10-14:** no .com domain record found; registration availability NOT confirmed | **NOT CHECKED** in official trademark records | **Working creative favorite only; not approved** |
| Folivanta / 履跃 | Portfolio/vantage-like coined form, distinctive but longer | Same low-confidence preliminary search only | **REGISTERED** (Verisign RDAP 200; created 2026-06-23) | **NOT CHECKED** | Reserve |
| Cverilo / 履序 | CV motif, but ambiguity in first-syllable pronunciation/spelling | Same low-confidence preliminary search only | **RDAP 404 on 2026-10-14**; registrar availability NOT confirmed | **NOT CHECKED** | Lower priority |

**Do not equate absence in web search results or RDAP 404 with domain availability, legal clearance, or exclusivity.** `folivanta.com` already has a registered .com record; `pagevela.com` and `cverilo.com` returned 404 in the 2026-10-14 authoritative RDAP query, but neither has been confirmed purchasable through a registrar. Before any purchase/branding implementation, run an actual live RDAP and registrar cart check, including price/renewal and domain restrictions; check WIPO/USPTO and relevant China/UK/EU registers for exact and confusingly similar marks and goods/service classes. Record date, evidence, jurisdiction and final decision in issue #202. Official tools: [ICANN RDAP lookup](https://lookup.icann.org/en), [WIPO Global Brand Database](https://www.wipo.int/en/web/global-brand-database), [USPTO Trademark Search](https://www.uspto.gov/trademarks/search).

### Why **not** simply attach a custom domain to the existing GitHub Pages project

GitHub Pages lets maintainers configure a custom domain in repository Pages settings and controls some canonical/redirect behavior. In a **local-first** editor, the migration danger is that a redirect away from the legacy `https://kunlong-luo.github.io/resume-craft/` origin could stop existing browsers reaching the *old origin's* IndexedDB data-export interface. Even if the browser has retained the data, the new origin cannot access it.

- Keep the existing `kunlong-luo/resume-craft` Pages deployment **operating at the original GitHub Pages URL**, including the complete workspace exporter and existing share routes.
- Prefer a **separate hosting/project deployment** for the new hostname during parallel rollout. Do not set a custom domain on the **existing** Pages deployment until browser-tested that it will not strand old-origin data; do not count a redirect as migration.
- Run a real, two-**HTTPS-origin** rehearsal: export a private test backup from the old hostname; import into the new hostname after showing overwrite consent; confirm active profile, other profiles, drafts, JD, JPEG portraits and persistence after reload. Use fictional fixture data; compare Chromium/Firefox/WebKit and installed PWA.
- Keep old origin and share links operational for a prolonged transition. Display clear migration guidance and avoid forced redirects. If the existing Pages project cannot serve both origins without redirects, use a **separate site** rather than break access to the old one.
- Verify HTTPS, DNS and domain ownership before marketing or switching `canonical`, `og:url`, sitemap, robots, app manifest or external links.

This is a change to the **migration plan**, not a request to modify DNS or Pages settings now. Official GitHub Pages reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

### Recommended decision sequence

1. **Completed:** released **v2.6.0** on the existing GitHub Pages URL with portable workspace backups, Chinese photo support and recovery tests. The brand and domain were deliberately not changed.
2. Select one internationally pronounceable name and only approve it after official mark/domain/handle checks, including neighboring spellings.
3. Acquire the domain after explicit approval, enable a **second** production site, and rehearse import with non-sensitive test data.
4. Integrate coherent bilingual brand assets/SEO for the international site, while retiring the legacy Chinese-facing name and retaining the old site's browser-data exporter.
5. Only then announce a gradual international launch. November 2026 is a **target**, not a guaranteed completion date.

## 2.2 Dated evidence log — 2026-10-14 (research, NOT approval)

| Channel | Pagevela | Folivanta | Cverilo | Evidence boundary |
| --- | --- | --- | --- | --- |
| GitHub repository name/description search | One near-name repo: [`palomabeckers/pagevelas`](https://github.com/palomabeckers/pagevelas); **zero exact-name repositories** in the inspected result set | No matching repositories returned by the inspected query | Two unrelated hits due to `CVerilog` substring: [`Caikera/CVerilog`](https://github.com/Caikera/CVerilog), [`agajankush/I2CVerilog`](https://github.com/agajankush/I2CVerilog); no exact-name hit | Repository search is not a brand, username, app marketplace or trademark search. Public results can change. |
| General exact-phrase web search | No verifiable exact-match commercial resume service surfaced in the inspected results | No verifiable exact-match commercial resume service surfaced | No verifiable exact-match commercial resume service surfaced; noisy PDF OCR matches | Search-result absence is **not** proof of non-use. The search index does not cover everything. |
| `.com` domain RDAP | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** | Attempts to request the registry RDAP endpoints failed through the available browser/search interface; no definitive registered/unregistered response. No registrar cart check. |
| Official trademark registers | **NOT VERIFIED** | **NOT VERIFIED** | **NOT VERIFIED** | USPTO official trademark-search instructions were accessible, but an actual live name/similar-mark search was **not completed**. WIPO/UK/EU/China checks also outstanding. |
| Domain/social handle purchase | Not attempted | Not attempted | Not attempted | Never assume availability from an unreturned result. |

Sources/tools to use in the final hands-on clearance: [USPTO Trademark Search](https://www.uspto.gov/trademarks/search) including phonetic/look-alike variants; [WIPO Global Brand Database](https://www.wipo.int/en/web/global-brand-database); [ICANN Lookup](https://lookup.icann.org/en) (RDAP); chosen registrar's **live** checkout availability and renewals; regional official registers; app marketplaces and relevant social usernames.

**Decision status**: Pagevela remains the **working creative preference**, not a cleared brand, domain or public wordmark. Do not make a GitHub repo or register domain on behalf of the project based on this document alone.

### Two-site deployment safety: new observation

The official [GitHub Pages custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) describes custom domains and potential automatic redirects for apex/`www` pairs; setting a custom domain on a user site can also affect its project sites. [Domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) is recommended against takeover, and GitHub discourages wildcard DNS records. These are infrastructure behaviors, **not** confirmation that the original `github.io` URL will remain suitable for recovering its existing IndexedDB.

Launch design therefore keeps `https://kunlong-luo.github.io/resume-craft/` as an independently working **old-origin exporter**; new international hostname gets a **separate deployment**. Verify from a *real existing browser profile* that exporting still works after any DNS/CDN/canonical changes. Do not use an automatic redirect on the old hostname as a substitute for transferring local data.

### Approval sign-off checklist

- [ ] Record trademark searches for each candidate, near-spelling and phonetic variants, in actual jurisdictions and relevant classes, with dates and official evidence links.
- [ ] Confirm exact `.com` registration/availability at **registry RDAP and registrar checkout** (include annual renewal and brand impersonation risks), then check practical alternatives.
- [ ] Search conflicting software, education, career-tool, app-store and social names; inspect handles, not only GitHub repositories.
- [ ] Owner explicitly approves one international English name, written capitalization, single-name Chinese/English localization plan, and purchased domain.
- [ ] Keep old origin functioning; validate migration from old HTTPS origin into a separate production-like new HTTPS origin, including legacy encrypted share links and installed PWA.
- [ ] Only **after** all above, create coherent international logo/SEO/canonical/PWA naming PR, stage side by side, and announce gradually.

## 2.3 Authoritative .com RDAP retry — 2026-10-14

Direct HTTPS queries to **Verisign's authoritative .com RDAP service** returned actual HTTP status codes (previous 2.2 results are a historical snapshot of earlier unsuccessful attempts):

| Candidate domain | Verisign registry response | Interpretation |
| --- | --- | --- |
| [`pagevela.com`](https://rdap.verisign.com/com/v1/domain/pagevela.com) | **HTTP 404** | No registration record returned at check time. Not a confirmed sale/available claim. |
| [`folivanta.com`](https://rdap.verisign.com/com/v1/domain/folivanta.com) | **HTTP 200** with `ldhName: FOLIVANTA.COM`, `registration: 2026-06-23` | **Currently registered**; eliminate as a primary candidate unless the owner deliberately acquires the name through a lawful registrar process after full clearance. |
| [`cverilo.com`](https://rdap.verisign.com/com/v1/domain/cverilo.com) | **HTTP 404** | No registration record returned at check time. Not a confirmed sale/available claim. |

All statuses may change; recheck on the actual purchase date. An HTTP 404 is not sufficient evidence that a registrar will allow registration at an acceptable price or that the name is trademark-safe. **No domains were purchased or reserved.**

**Decision:** Pagevela remains the only favored concept worth continuing to formal trademark and registrar-cart review; Cverilo is a less pronounceable fallback, Folivanta fails the preferred .com registration screen. Continue without any live rename/domain redirect.

## 2.4 Official mark-search observations — 2026-10-15 (preliminary; NOT a clearance opinion)

During a public, unauthenticated **read-only** search through each site’s own UI, the following visible responses were obtained for candidate **PAGEVELA**:

| Search source | Exact public query used | Visible result | Interpretation and limits |
| --- | --- | --- | --- |
| [USPTO Trademark Search](https://tmsearch.uspto.gov/search/) (US federal) | Simple `Wordmark`: `PAGEVELA` | **0 results** | No exact query hits returned in that session. Not a phonetic/look-alike, common-law-use or full legal clearance. |
| USPTO (US federal) | Simple `Wordmark`: `PAGEVELLA` | **0 results** | One extra-spelling variant only. A simple spaced `PAGE VELA` query was **broad/noisy (1,905 hits)** and cannot be interpreted as a precise confusion clearance. |
| [WIPO Global Brand Database](https://branddb.wipo.int/en/) | Brand name **contains the word `PAGEVELA`** | **No results found** | Database coverage, transliterations and similarities must still be assessed; relevant national/regional registers and actual market use remain to be checked. |
| [TMview](https://www.tmdn.org/tmview/) (EUIPO-coordinated public aggregation) | Public name query `PAGEVELA` | **No rows found** | TMview expressly states that it **does not constitute an official register and its data have no legal effect**. Independently search applicable EU/UK/national registers. |
| Verisign `.com` RDAP | `pagevela.com` | **HTTP 404** again on 2026-10-15 | Registry did not return a domain object; **registrar checkout availability and price remain UNVERIFIED**. The fact that the domain is apparently unregistered does not grant trademark rights. |

**Current candidate decision:** Pagevela remains a **working creative preference only**, now with useful **negative exact-wordmark search evidence** in three public trademark interfaces. It is **not approved for public use as a new brand** and is not guaranteed registerable or free of third-party rights. Do not confuse search result counts with a definitive legal analysis, and do not disclose fabricated clearance claims in marketing.

**Outstanding sign-off before implementation:** dated near-name/phonetic queries and goods/service assessment (notably classes 9 and 42 and adjacent categories), WIPO and national registers beyond the one general search, real names in app stores and social networks, domain purchase checkout+renewal, owner approval and actual two-HTTPS-origin migration rehearsal. Save a contemporaneous official screenshot/export of any future clearance search for evidence. The new brand’s launch remains **blocked** until these are completed.

## 2.5 Live registrar result — 2026-10-15 (no checkout or purchase)

A **read-only live Namecheap search** for the exact [`pagevela.com`](https://www.namecheap.com/domains/registration/results/?domain=pagevela.com) displayed **available to register** at the time checked (currency USD).

| Displayed pricing | Amount | Conditions |
| --- | ---: | --- |
| Standard first-year offer | **$10.98/year** | Displayed ordinary new registration price; later checkout total may vary |
| Renewal retail | **$14.98/year** | Displayed retail renewal; not a guarantee of future rates |
| New-customer promotional offer | **$6.79** first year | Advertised with promo code `NEWCOM679`; eligibility and expiry are not verified |

**No checkout, reservation, account, payment, DNS change or domain purchase occurred**; the cart subtotal remained $0.00 during the research session. This is stronger evidence than a registry RDAP 404, but it does not reserve the name and is not a guarantee the name can be registered later.

**Outstanding before buying:** similarity/phonetic and market-use trademark clearance in target countries, final owner approval of Pagevela versus alternatives, then a fresh registrar/checkout check for total price, renewal terms, taxes and registrant conditions. **Do not change public branding now**. (Section 2.4 reflects evidence available before this registrar search; its older unverified-domain wording is superseded by this time-limited availability observation, not by a completed order.)

## 3. Audit map of user-visible brand strings

| Surface / file | Existing coupling | What to change once approved |
| --- | --- | --- |
| `index.html` | Title, keywords, OG, Twitter, JSON-LD, Apple web-app title, startup RC mark, canonical | Swap reviewed product copy, canonical and visual identity; preserve metadata consistency |
| `src/lib/seo.ts` | Both language titles and descriptions | Make English/Chinese names and copy consistent with the new brand |
| `src/tests/seo.test.ts` | Asserts fixed English head metadata and old canonical | Update tests in the same PR as metadata |
| `src/components/landing/LandingNavbar.tsx` | RC monogram and both display names; GitHub star label | Adopt approved wordmark; do not break GitHub URL |
| `src/components/landing/LandingFooter.tsx` | RC monogram and both display names | Adopt approved names |
| `src/components/landing/LandingHero.tsx` | Headline, primary CTA and technical positioning | Outcome-first message; keep accurate feature claims |
| `vite.config.ts` | PWA manifest name, short_name, description and cache-name string | Change displayed manifest branding, validate install and update behavior; cache migration must be deliberate |
| `public/sitemap.xml` and `public/robots.txt` | Old GitHub Pages URL | Update only after new canonical origin is deployed and verified |
| `.github/assets/readme-banner.svg`, `README.md`, `README.zh-CN.md`, `README.en.md` | Old visual and written identity | Update documentation and add "formerly" transition notes |
| `src/components/share/*` and public share routes | Old shared links can already exist | Preserve old link loading; add compatibility E2E |
| Landing, editor, help / legal and social assets | Potential old textual labels, URLs, monograms | Follow-up string audit before rollout |

Also inspect Open Graph card generator (`scripts/generate-og-card.mjs`), deployment workflows, FAQ, icon assets, user-support labels and links, and every translated label. A new brand should never appear on some screens while an old wordmark remains elsewhere.

## 4. **Critical compatibility requirements** (not branding copy)

### A. Browser origin isolation

`src/lib/storage.ts`, `src/lib/storage-migration.ts` and repository storage logic use localStorage / IndexedDB. These browser databases are scoped to origin, not automatically transferable to a new domain. Even if the website content is identical, data on `https://kunlong-luo.github.io` will not appear on a different new hostname.

A safe transition therefore needs an **explicit user-initiated** data export on the old origin and an import/restore flow on the new origin. Prefer a portable file/backup, no server upload, and no silent cross-origin resume transfer. If proposing a transfer link, require a privacy and size review, a consent step and a separate threat model first.

Validation must cover:
- Active Markdown and settings; all profiles (including custom names and active selection).
- Drafts, templates and JD text (where supported by the chosen export format).
- Optional local resume portraits and disclosure that *full JSON backup contains photos*.
- Legacy backups without portrait fields, corrupt/oversized backups, and failed imports that leave current data unchanged.
- Repeated import, cancelled import, and existing destination drafts; never silently overwrite.
- Both installed PWA users and ordinary browser users.

### B. Preserve encryption and URL formats

`src/lib/share-utils.ts` includes `resume-craft-share-v2` and `resume-craft-share-v3` as authenticated encryption associated-data (AAD) strings. **These are cryptographic protocol constants**, not copy. Replacing them with a new brand string would break decryption of existing encrypted shared links. Keep their byte values unchanged unless introducing an explicitly versioned, backward-compatible cryptographic migration with tests.

Other old `resume-*` storage keys and application cache identifiers may likewise require backward compatibility. **Never run a broad search-and-replace across the repository.**

Required share E2E / unit checks:
- v2 encrypted share works with legacy AAD.
- v3 encrypted share works with current AAD.
- Legacy plain and query-style links remain readable.
- New sharing links work and do not unexpectedly include locally stored portraits.
- Copying an old URL still reaches an endpoint that serves the legacy share handler.

### C. Redirecting the old site

Do not automatically redirect old-origin visitors before offering export or retaining full on-site functionality; that could strand their drafts because the new origin cannot read the old storage.

A staged plan:
1. Add a plain-language transition notice to the **old** app (with Export Backup).
2. Launch the new app in parallel (with Import Backup and compatibility tests).
3. Verify restores on each supported browser before any stronger redirect.
4. Keep legacy links and old origin accessible for a documented transition period, subject to operational feasibility.
5. Measure aggregate failures without collecting resume contents.

## 5. Work sequencing — reconciled against production v2.6.0

1. **Already shipped on existing origin:** optional Chinese-market portraits, full-workspace export/import, cancel/overwrite consent, and interrupted-autosave recovery through merged [PR #207](https://github.com/kunlong-luo/resume-craft/pull/207) and [v2.6.0](https://github.com/kunlong-luo/resume-craft/releases/tag/v2.6.0). Standalone drafts #201/#204/#205 were superseded and closed; do not merge them again. Existing local-origin isolation tests in `e2e/portable-workspace.e2e.ts` use `localhost` and `127.0.0.1` and **are not live HTTPS migration tests**.
2. **Pending legal/commercial clearance:** Check exact and confusingly similar marks (USPTO, WIPO and target regions), social/service names, and registrar cart availability/renewal for the shortlisted names. No candidate is approved or domain acquired. The **2026-10-15 Verisign RDAP recheck** still returned 404 for `pagevela.com` and `cverilo.com` and 200 for the registered `folivanta.com`; 404 does not mean guaranteed sale.
3. **Pending independent new hosting:** After domain/name approval, deploy a separate HTTPS site. Keep the old GitHub Pages editor/exporter at `https://kunlong-luo.github.io/resume-craft/` fully accessible without redirecting visitors. Do not change its custom-domain setting, service-worker scope or local data keys during initial parallel operation.
4. **Pending live migration rehearsal:** Run the *opt-in* Playwright test described below against the old and new real HTTPS URLs, plus manually inspect a long multi-page résumé, printed PDF, mobile layout, legacy encrypted share URLs and an **already-installed** PWA. Record screenshots and any exceptions using fictional data only. Test at least Chromium/Firefox/WebKit; the single opt-in test is designed to run in each project.
5. **Pending branded release:** Once approved, centralize display names and artwork, update public metadata/SEO, manifest and screenshots **for the new origin only**, and verify current/legacy links. Publish clear export/import help and operate both sites in parallel before announcing a new canonical identity.

**Release gates:** no backup, sharing or PDF regressions; documented two-HTTPS-hostname transfer and old-origin data export; trademark/domain approval; correct canonical/OG/sitemap on *new* site; old share URLs remain live.

### Opt-in real HTTPS origin migration test (NOT part of ordinary CI acceptance)

The repo includes `e2e/rebrand-live-origins.e2e.ts`. Without **both** URL environment variables, it is skipped, even though the normal E2E suite continues to cover localhost origin isolation. When a separate, actually live new HTTPS deployment exists, run from a trusted local checkout:

```bash
REBRAND_OLD_URL="https://kunlong-luo.github.io/resume-craft/" \
REBRAND_NEW_URL="https://<approved-new-host>/" \
pnpm exec playwright test e2e/rebrand-live-origins.e2e.ts --project=chromium
```

Replace the placeholder with the genuinely deployed hostname/path, not a made-up domain. The test rejects non-HTTPS and same-origin URLs, prevents redirects that strand the original hostname, uses an **isolated new Playwright context containing only invented résumés and a tiny synthetic portrait**, and checks export, explicit overwrite cancellation, confirmed import, reload, multiple profiles, one profile with/one without a portrait, saved draft, JD and old-origin data preservation.

**Important limits:** It does not sign in as a real existing user or migrate their private data; it does not simulate updating an installed PWA, audit actual DNS/HTTPS configuration, check trademark rights or validate old encrypted share URLs. A passing test is a technical signal **not permission to retire/redirect** the original site.

## 6. Initial validation / evidence boundary

- v2.6.0 features and local-hostname migration regressions are shipped and CI tested; the *new HTTPS origin* has not been provisioned and the opt-in test has **not** been executed against two real sites.
- The original GitHub Pages origin and product names remain unchanged; no approved new wordmark, trademark rights, DNS records or domain purchase are claimed.
- WIPO's Global Brand Database covers many international and national records, but WIPO recommends searching applicable national/regional registers. Ordinary web searches, RDAP responses and absence of GitHub repositories are not legal clearance.
- MDN documents IndexedDB same-origin isolation: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Terminology

Owner note: This migration plan and **opt-in, skipped-unless-configured** regression test do not change the runtime brand, origin, share protocol or user storage format.
