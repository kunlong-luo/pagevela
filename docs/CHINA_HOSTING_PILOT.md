# Pagevela China-access hosting pilot (not a live site)

Status: **build preparation only**. This does **not** create a Tencent Cloud account, purchase a domain, complete an ICP filing, change DNS, or deploy a live mirror.

## Recommendation

Keep [GitHub Pages](https://kunlong-luo.github.io/pagevela/) as the existing international entry point and the GitHub `main` branch as the **single source of truth**. Do not restore or redirect the retired `/resume-craft/` path. Do **not** assume that every user in mainland China is blocked; test by carrier and region.

- **Gitee Pages is not a viable target**: Gitee support says the Pages feature is no longer available. Gitee code mirroring is distinct from Gitee Pages hosting.
- **First pilot: EdgeOne Makers / Pages**, with GitHub import and a provider-managed static build. Using a China-mainland acceleration region requires an ICP-filed domain. For an unfiled domain, an overseas-only region may be used, but it does **not** guarantee mainland reachability.
- **Important:** EdgeOne's platform-generated project/preview domain in the "global excluding mainland" region returns HTTP 401 when accessed from mainland networks, according to its published domain documentation. A **custom domain and real mainland probes** are prerequisites for a meaningful external pilot. Do not publish the temporary preview domain as the China entry point.
- **Alternative:** Alibaba Cloud ESA Pages with the same required domain/filing decisions, or a Hong Kong-based static host plus custom domain for a no-mainland-node proof of concept. Neither alternative guarantees reachability without testing.

Reference documentation:
- Gitee Pages unavailable: https://gitee.com/oschina/git-osc/issues/ID1EVM
- EdgeOne Git import: https://edgeone.ai/zh/document/70404
- EdgeOne regions and preview-domain rules: https://edgeone.cloud.tencent.com/pages/document/162936836982489088
- EdgeOne build settings: https://pages.edgeone.ai/zh/document/build-guide
- EdgeOne edgeone.json: https://pages.edgeone.ai/zh/document/edgeone-json
- Alibaba ESA: https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/what-is-functions-and-pages/

## Prepared build settings

The repository-root `edgeone.json` is a **provider-specific optional configuration**. It does not alter GitHub Pages deployment:

| Setting | Value |
|---|---|
| Source | `kunlong-luo/pagevela`, main |
| Build root | repository root |
| Framework | Vite / React static site |
| Node.js | `24.18.0` |
| Package manager | `pnpm@12.6.0` (explicit install, since EdgeOne's default supported pnpm list currently stops at 11) |
| Install | `npm install -g pnpm@12.6.0 && pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Output | `dist` |
| SPA routing | fallback to `/index.html` on missing routes |

The app uses relative Vite base `./` and PWA `start_url`/`scope` `./`; **recheck the generated asset URLs and offline scope on the actual mirror origin**. Changing the host alone does not ensure functional parity.

## Human-authorized onboarding (not executed)

1. A project owner signs into an EdgeOne account, reviews terms, pricing, regional availability and data handling, and explicitly authorizes access to **this GitHub repository only**.
2. Create a Pages/Makers project via **Import Git Repo**, select `kunlong-luo/pagevela`, and verify the root build settings match `edgeone.json`. Do not paste cloud API tokens into GitHub comments or public build logs.
3. Select the region **based on the domain's actual ICP status**. Use a correctly filed domain before enabling mainland nodes. For an overseas-only deployment, bind a user-controlled custom domain and do not rely on platform preview domains to serve mainland visitors.
4. Keep the test domain unpublished while validating. No redirect, DNS cutover of the international site, domain purchase or public announcement is included here.
5. Run the checks below before opening the pilot to users.

## Acceptance: real Chinese mainland network coverage

Record time, tested **real URL/domain**, province/city, provider, device/browser and actual observed results:

- China Telecom, China Mobile and China Unicom; preferably at least three regions, including evening peak and normal working hours.
- HTTPS TLS handshake and HTTP status; no DNS/network blocks, 401/403, unexpected regional redirects, broken JS/CSS/assets, or broken PDF-worker chunks.
- Fresh mobile load of the welcome page; enter editor; switch Form/Markdown; ATS analysis; switch templates; live A4/Letter preview; generate/export both PDF paths; check phone keyboard/menu overlays.
- Upload an explicitly fictional portrait, switch profiles, reload, confirm local privacy and photo isolation; do not upload any real resume to external monitoring services.
- Inspect Service Worker / PWA installation, updates and offline behavior after deployment.

### Critical: origin-scoped resume data

`https://kunlong-luo.github.io/pagevela/` and a new domestic domain have **different browser origins**. IndexedDB, localStorage, PWA caches, uploaded photo blobs and service workers **do not migrate automatically**. Before any user switches domains:

1. On the original site, export a **complete workspace JSON backup** (not only Markdown/PDF); keep it safely.
2. On the new site, explicitly import that workspace backup.
3. Confirm the expected profiles, contents, user-entered drafts, settings and local portrait state before deleting or changing anything on the old origin.
4. Repeat with two profiles and a photo in a clean browser context; do not embed actual user data in CI artifacts.

## Launch and rollback gates

- Only mark the mirror as **available in mainland China** after direct on-carrier measurements and a working custom domain are documented.
- Measure load times and failures for at least seven days; record errors and links to evidence.
- Keep GitHub Pages unchanged during the pilot; roll back by removing the optional mirror announcement or its DNS, without touching users' data at the original origin.
- If EdgeOne cannot handle the required Node/pnpm build or network quality is weak, try the alternative host using the same static `dist` artifact and validation matrix rather than downgrading dependencies blindly.
