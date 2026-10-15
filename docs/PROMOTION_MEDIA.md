# Pagevela — real promotional media capture

This is a repeatable Playwright browser capture of the **real application UI**, seeded only with fictional sample Markdown. It does not use AI-generated fake screenshots, personal resume files, a paid account, or visitor analytics.

**Brand-staging warning (2026-10-15):** Pagevela-branded screenshots or footage must be captured from a build of the Pagevela staging branch, not attributed to the original production v2.6.0 website. No new Pagevela HTTPS site is live yet. Existing artifact filenames retain historical `resume-craft-*` identifiers for workflow compatibility; these filenames are **not public brand names**. Review the actual rendered words before publishing any social content.

## Downloadable files

The GitHub Actions workflow **Capture Real Promotion Media** uploads a `resume-craft-promotion-media` ZIP artifact (30-day retention) containing:

- `resume-craft-product-screenshot.png`: real desktop app in split editing / preview layout.
- `resume-craft-markdown-preview.png`: genuine source editor after typing a new resume bullet.
- `resume-craft-download-options.png`: real app with export options (or the unchanged app if the menu is unavailable).
- `resume-craft-demo.webm`: raw browser screen recording.
- `resume-craft-demo.mp4`: **polished 1280×720 promotional cut** combining a branded intro, real Chromium browser recording with editorial chapter captions, and a short call-to-action outro.
- `resume-craft-social-cover.png`: designed 1200×630 social cover generated from `public/og-card.svg` during the build; **an illustration, not a screenshot**.
- `resume-craft-reddit-cover-1280x720.png`: polished 16:9 thumbnail incorporating the **real** screenshot.
- `resume-craft-product-gallery-1200x900.png`: product-gallery card around the real UI.
- `resume-craft-social-1080x1350.png`: portrait social tile around the real UI.
- `resume-craft-video-outro-1280x720.png`: brand call-to-action slide.

## Regenerate

1. In GitHub, open **Actions → Capture Real Promotion Media → Run workflow**. In the **Use workflow from** branch selector choose `feat/pagevela-brand-staging-20261015`, **not** `main`. This is an opt-in review run; it must not deploy or publish anything. The current workflow's automatic push trigger targets only `feat/promotion-media-v2`; commits to the Pagevela branch do **not** launch promotional capture automatically.
2. After the selected-branch run finishes successfully, open that run's summary. Verify that the checked-out branch/commit is the intended Pagevela PR head, not the old deployed version.
3. Download the `resume-craft-promotion-media` ZIP from **Artifacts**. The `resume-craft-*` ZIP/PNG/MP4 names are compatibility filenames, **not** visible branding and not a reason to rename them.
4. Inspect the actual PNG/MP4 output against the checklist below. Keep all generated assets **private and unpublished** until separately approved for release; CI passing is not visual approval.

### Manual visual acceptance — NOT YET COMPLETED

- [ ] Browser screenshot shows **Pagevela** (same capitalization) in English and Chinese UI; no former public wordmark, old initials, cut-off text, or invented UI.
- [ ] Social cover, landscape thumbnail (1280×720), gallery (1200×900), portrait tile (1080×1350), video intro/outro and MP4 overlay show **Pagevela / P** and readable text without clipping or font fallback artifacts.
- [ ] The screenshot depicts an actual local Chromium browser session with only fictional sample content; no real names, contact details, upload payloads or private URLs are present.
- [ ] Claims match tested features: the video may show the **export menu**, but that alone does not prove a PDF was successfully saved or accepted by an ATS.
- [ ] Any displayed `kunlong-luo.github.io/resume-craft` address is explicitly understood as the **current working old-origin URL**; no new Pagevela hostname is claimed, linked or silently redirected.
- [ ] The final logo/visual identity and commercial-use clearance are independently approved before public posting. Until then, these are **staging review artifacts**.

**Evidence status (2026-10-15):** This document provides instructions and acceptance criteria only. No Pagevela-branch promotional capture, image inspection, publication or new-domain deployment is asserted here.

The workflow runs a temporary local Vite server inside GitHub Actions. It does not save or read personal resumes and does not contact the public analytics origin.

## Community use

- Reddit: upload `resume-craft-demo.mp4` natively if allowed; put the live demo link and feedback question in the post.
- GitHub README / technical articles: use `resume-craft-product-screenshot.png` and an annotated caption identifying it as a screenshot.
- Product Hunt: review the current launch requirements and use the real screenshot plus a video.
- Social link previews: the application already publishes an OG cover; use `resume-craft-social-cover.png` as a matching standalone graphic when useful.

## Honest claims

This recording demonstrates real form/Markdown editing, live preview, one-click page fitting, and the **export menu**; it does **not** prove that an actual PDF was created. Do not title it “PDF successfully exported” unless an actual export step is captured and verified. The fictional resume belongs to an example user only.

If the workflow fails, inspect its logs and fix the named selector or capture step rather than substituting a fabricated UI.

## V2 design decisions

- The real height guard is collapsed using the application's existing local preference (not removed from the UI image).
- The scene edits the summary at the top of the resume so the change is visible within the frame. No synthetic transitions are applied inside the application screenshot.
- Editorial captions are superimposed during browser capture and clearly distinguish the product demo chapters from the product UI. Clean PNGs do not contain the added captions.
- Promotional frames are generated with `scripts/render-promotion-assets.mjs` and include an unaltered, aspect-fitted Chromium screenshot, rather than AI-generated form controls or invented UI.
- The final MP4 adds a concise intro and outro in post-production. Chapter overlay and screen recording show actual application interactions.
- The export-menu action is verified before the frame is captured. Showing the export menu is **not** a claim that a PDF was successfully saved.
