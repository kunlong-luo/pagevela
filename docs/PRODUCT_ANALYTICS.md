# Privacy-friendly product analytics & feedback plan

> Status: **validation implementation — Simple Analytics is loaded only after privacy checks and uses a fixed, metadata-free event allowlist**

Pagevela is local-first. Product measurement should answer a small number of product questions without collecting resume content, job descriptions, contact details, share payloads, or persistent user identifiers.

## 1. Product questions

For the first validation cycle, measure only:

1. Do visitors start editing?
2. Do they reach a successful PDF export or browser print flow?
3. Which core tools are actually used: Import, ATS Check, Auto Fit, Profiles, Share?
4. Where should qualitative feedback be collected?
5. Which acquisition channels bring users who actually export a resume? (Source attribution needs separate validation; the app intentionally strips query/hash from analytics pageviews.)

Do **not** optimize for detailed behavioral surveillance, session replay, heatmaps, keystrokes, or per-user profiles.

## 2. Privacy invariants

These are non-negotiable:

- Never send resume Markdown, rendered resume text, JD text, names, email addresses, phone numbers, profile names, filenames, or free-form user input.
- Never send share payloads, access codes, or any URL query/hash values.
- Analytics paths must use `location.pathname` only. New Pagevela share links keep payloads in `location.hash`, while legacy links may use `location.search`; neither query nor fragment content may be sent.
- No cookies, advertising identifiers, cross-site identifiers, fingerprinting, or persistent analytics user IDs.
- No session replay or DOM/text capture.
- Event names must come from a fixed allowlist in source code; never construct analytics event names from user content.
- The application must continue to function normally if analytics is blocked, unavailable, or disabled.
- Privacy documentation must be updated before analytics is enabled in production.

## 3. Recommended phase-1 stack

### Anonymous product signals: Simple Analytics

Phase 1 uses Simple Analytics because it provides aggregate pageviews and explicit custom events without cookies, localStorage-based visitor IDs, IP storage, or browser fingerprinting.

The app adds stricter application-side rules on top:

- analytics events are hard-coded in `src/lib/analytics.ts`
- Do Not Track is respected; when DNT is enabled, the analytics script is not loaded at all
- the Simple Analytics script is injected at runtime only on the official GitHub Pages app after privacy checks pass
- automatic pageview collection is disabled so the app can normalize shared-resume visits to `/resume-craft/shared`
- URL query/hash values are never passed to analytics, and the analytics script request uses `referrerPolicy="no-referrer"`
- browser/device metrics that are not needed for product validation are disabled
- product events are deduplicated in memory per page load; no persistent analytics identifier is stored
- events carry only a fixed event name and never include metadata, scores, filenames, resume/JD content, or other free-form values

### Pageview troubleshooting before external launches

If the dashboard shows events but **0 pageviews / visitors**, do not treat the figures as a user conversion funnel.

1. Confirm the Simple Analytics site hostname is `kunlong-luo.github.io`, the 30-day range is correct, and no page/path/source filters are active.
2. On an official-domain browser where Do Not Track is off and analytics is not blocked, check that `latest.js` loads and exposes `window.sa_pageview`. In manual mode (`data-auto-collect="false"`), one initial sanitized pageview should be sent.
3. Inspect the browser Network panel for the analytics script and pageview request. Blocking can be intentional; **do not bypass browser privacy settings or silently switch to another tracking endpoint**.
4. If the script and request work, inspect dashboard site settings and aggregation before changing implementation. Script-level `ignore-metrics=session` removes ephemeral page-load identifiers; it does not by itself disable pageview counts.
5. Repeat one non-sensitive smoke check after deployment. Existing events without pageviews do not establish a reliable historical conversion rate.

The app starts the pageview request before asynchronous IndexedDB migration/bootstrap to reduce missing visits from short-lived page loads. It still honors the official-host and Do Not Track gates and strips share payloads from reported paths.

GitHub Discussions remains the qualitative feedback channel. A richer tool such as Umami can be reconsidered later only if aggregate evidence shows a genuine need for deeper funnels.

### Qualitative feedback: GitHub Discussions

Use repository Discussions for open-ended feedback, questions, ideas, and polls. Keep Issues for concrete bugs and scoped feature work.

Recommended feedback categories:

- **Feedback / 使用反馈** — what worked, what was confusing
- **Ideas / 功能建议** — product ideas
- **Q&A / 使用问题** — help and questions
- **Show and tell / 作品展示** — optional examples with users reminded to remove personal data

## 4. Minimal event contract

Pageviews are enough for visits. Track only these product events:

| Event | Meaning | Allowed data |
| --- | --- | --- |
| `start_building_clicked` | New visitor clicks the landing page's Start Building CTA (not Continue Editing) | none |
| `editor_opened` | Editor route is mounted, including direct visits and reloads | none |
| `editing_started` | User makes the first meaningful edit in a visit | none |
| `pdf_export_success` | Direct PDF generation finishes successfully | none |
| `browser_print_started` | Browser print / Save as PDF workflow is opened | none |
| `ats_check_completed` | A non-empty JD is analyzed locally | none |
| `auto_fit_used` | User explicitly triggers A4 Auto Fit | none |
| `share_created` | User generates a resume share link | none |
| `pwa_install` | Browser reports an accepted PWA installation | none |
| `feedback_opened` | User opens the GitHub Discussions feedback channel | none |

Do not add click-by-click telemetry, profile creation events, template names, ATS score buckets, content lengths, or acquisition metadata unless a concrete product decision cannot be made without them.

Do not track every click, every edit, editor focus, character counts, ATS score, resume length, job title, template text, or search terms.

## 5. Core funnel

Primary activation funnel:

```text
Visit (pathname-only pageview)
  ↓
start_building_clicked (new-visitor Hero CTA only)
  ↓
editor_opened (also counts direct editor links and reloads)
  ↓
editing_started
  ↓
pdf_export_success (confirmed generation)

browser_print_started is reported separately; opening a print dialog is not proof of export.
```

Primary activation metric:

```text
Export event ratio (aggregate approximation) =
pdf_export_success event count
÷
editing_started event count

Events are deduplicated in memory per loaded page, not linked across visits; this is not a user-level or session-level conversion rate.
```

Secondary signals:

- Landing CTA intent = `start_building_clicked` (only new visitors; not all editor entries)
- Editor arrival = `editor_opened` (includes direct links and reloads)
- ATS adoption = `ats_check_completed / editing_started`
- Auto Fit adoption = `auto_fit_used / editing_started`
- Share adoption = `share_created / successful export`
- Feedback intent = `feedback_opened / successful export`

Phase 1 does not require cross-device identity or long-term individual retention tracking.

## 6. Feedback UX

Do not block the first export.

Recommended flow:

1. First successful export: no prompt.
2. Keep a permanent, low-friction **Feedback** link in README/Help.
3. After a user has already completed at least two exports, an optional non-blocking toast may say:
   - 中文：`有建议？欢迎告诉我们哪里最好用、哪里最难用。`
   - English: `Have feedback? Tell us what worked and what was confusing.`
4. Rate-limit this locally (for example, once every 30 days).
5. Clicking it opens GitHub Discussions; no resume data is attached automatically.

## 7. First 30-day validation dashboard

Review only a compact scorecard:

| Metric | Why it matters |
| --- | --- |
| Visits | acquisition baseline |
| `start_building_clicked` | first-time Hero CTA intent |
| `editor_opened` | editor arrivals, including direct visits and reloads |
| `editing_started` | users understood the product enough to begin |
| `pdf_export_success` | strongest activation signal |
| `browser_print_started` | alternate export path usage |
| `ats_check_completed` | differentiation usage |
| `auto_fit_used` | A4 pain-point usage |
| `share_created` | sharing demand |
| `pwa_install` | install intent / offline-app demand |
| `feedback_opened` | feedback intent |
| New Discussions / actionable Issues | qualitative learning |
| GitHub Stars | open-source interest, not product activation |

A useful first experiment target (not an industry benchmark) is to get enough traffic to evaluate roughly 100 real visits, then inspect the export funnel and read every piece of feedback before adding major features.

## 8. Implementation guardrails

When implementation starts:

- Add a tiny `src/lib/analytics.ts` wrapper so the app never calls a vendor API directly from feature components.
- Analytics must be disabled when the configured analytics site/code is absent.
- Hard-code an event allowlist.
- Normalize pageviews to pathname only.
- Add tests proving URLs like `?share=...`, query parameters, hashes, resume text, and JD text are never included in analytics payloads.
- Keep analytics failures silent and non-blocking.
- Update the in-app privacy section and README before deployment.
- Local development and forks are analytics-disabled by hostname gating; no developer identifier or local switch is required.

## 9. Decision after the validation cycle

Use the evidence to decide what comes next:

- Many exports, many questions → invest in documentation/VitePress.
- Strong ATS usage → deepen job-specific resume tailoring.
- Strong demand to capture JDs from job sites → evaluate a browser extension.
- Visits but weak editing/export conversion → fix onboarding before marketing harder.
- Healthy activation but low traffic → invest in distribution/marketing.
- Little repeat interest and little feedback → reconsider positioning before adding features.
