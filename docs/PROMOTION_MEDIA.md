# Pagevela — real promotional media capture

This is a repeatable Playwright browser capture of the **real application UI**, seeded only with fictional sample Markdown. It does not use AI-generated fake screenshots, personal resume files, a paid account, or visitor analytics.

**Current-brand media (2026-10-16):** Pagevela is live at https://kunlong-luo.github.io/pagevela/. Capture real UI and marketing screenshots from current `main` (or an explicitly reviewed experiment), not the retired `/resume-craft/` website. Old `resume-craft-*` artifact filenames are workflow compatibility details, **not visible public branding**. The display wordmark is **页帆** when the interface is Chinese and **Pagevela** when English; the product repository remains `kunlong-luo/pagevela`. Validate URLs, layout and Pagevela wordmark in actual rendered images before posting; no screenshot or video is automatically published.

## Downloadable files

The GitHub Actions workflow **Capture Real Promotion Media** uploads a `resume-craft-promotion-media` ZIP artifact (30-day retention) containing:

- `pagevela-welcome-zh.png` and `pagevela-editor-zh.png`: **real Chinese 页帆** welcome page and editor (fictional sample content).
- `pagevela-welcome-en.png` and `pagevela-editor-en.png`: **real English Pagevela** welcome page and editor, copied without visual alteration from the original Chromium captures.
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

1. In GitHub, open **Actions → Capture Real Promotion Media → Run workflow**. In **Use workflow from**, select `main` for real current-brand captures. A workflow run produces review artifacts; it does **not** publish a social post. The workflow's automatic push trigger is limited to its designated development branch.
2. After the run succeeds, inspect its commit/branch and visually confirm the current Pagevela branding and live URL.
3. Download the `resume-craft-promotion-media` ZIP from **Artifacts**. The `resume-craft-*` ZIP/PNG/MP4 names are compatibility filenames, **not** visible branding and not a reason to rename them.
4. Inspect the actual PNG/MP4 output against the checklist below. Keep all generated assets **private and unpublished** until separately approved for release; CI passing is not visual approval.

### Manual visual acceptance — NOT YET COMPLETED

- [ ] Browser screenshots show **页帆** on the Chinese welcome page and **Pagevela** on the English welcome page; editors are actual Chromium captures with fictional example resumes, not AI-generated controls.
- [ ] Test the language toggle and welcome → editor path after each UI update; do not represent these assets as current if the live product UI has changed.
- [ ] Social cover, landscape thumbnail (1280×720), gallery (1200×900), portrait tile (1080×1350), video intro/outro and MP4 overlay show **Pagevela / P** and readable text without clipping or font fallback artifacts.
- [ ] The screenshot depicts an actual local Chromium browser session with only fictional sample content; no real names, contact details, upload payloads or private URLs are present.
- [ ] Claims match tested features: the video may show the **export menu**, but that alone does not prove a PDF was successfully saved or accepted by an ATS.
- [ ] Every displayed web address and CTA points to `https://kunlong-luo.github.io/pagevela/`; any old `/resume-craft/` screenshot or Product Hunt link must be replaced.
- [ ] The final logo/visual identity and commercial-use clearance are independently approved before public posting. Until then, these are **staging review artifacts**.

**Evidence status:** This document specifies a repeatable capture and quality-review workflow; it does **not** assert that fresh screenshots or videos have been captured, visually approved or posted. The additional bilingual screenshots are produced only when the refreshed workflow is run successfully from an approved branch; this documentation change does not itself produce or publish images.

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
