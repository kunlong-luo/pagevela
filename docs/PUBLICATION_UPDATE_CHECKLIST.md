# Pagevela public listings and media update checklist

> **Current v2.8.0 release materials (2026-10-24):** [Release notes](../RELEASE_NOTES.md) · [bilingual publication kit](./V2_8_0_RELEASE_KIT.md) · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.0). External social/listing edits and media uploads require manual review. Updating repository text does **not** update Product Hunt, YouTube, DEV, PWAs.app or other sites.

> **Platform-by-platform ready-to-copy pack:** [中外媒体逐个平台修改包](./channel-refresh/README.md) · [进度表 CSV](./channel-refresh/TRACKER.csv) · [截图与封面要求](./channel-refresh/ASSETS.md). This is a source repository preparation, not external publication.

Current public identity (verified 2026-10-16):
- **Brand:** Pagevela (formerly Resume Craft / 简匠).
- **App:** https://kunlong-luo.github.io/pagevela/
- **Repository:** https://github.com/kunlong-luo/pagevela
- **Retired Pages URL:** `https://kunlong-luo.github.io/resume-craft/` (not redirected; the owner chose Option A).

This checklist distinguishes code we can maintain in the project from third-party posts that require their publisher or a directory editor. **Do not delete old releases, replace historical release archives, or falsely rewrite when a previous product name was in use.**

## Updated in the source repository

- [x] README in Chinese/English, canonical, OG links, sitemap and robots refer to the current app.
- [x] Brand launch docs, active promotion playbook and the v2.6.0 social draft provide current Pagevela URLs.
- [x] Historical `RELEASE_NOTES.md` retains the original `Resume Craft v2.6.0` label but prominently links to current Pagevela.
- [x] Future GitHub Release **display titles and annotated tag messages** use Pagevela. New v2.8.0+ downloads use `pagevela-VERSION.zip`/`.tar.gz` with SHA256SUMS. **Existing historical** `resume-craft-*` archives, names and checksums remain unchanged for compatibility.
- [x] Public SVG cover source (`public/og-card.svg`) and README banner (`.github/assets/readme-banner.svg`) already show **Pagevela**, so a blanket regenerate/recreate is unnecessary. Production builds generate the OG PNG from the SVG.
- [ ] Capture and visually review **new real product screenshots** from the deployed Pagevela UI. Open GitHub Actions → [Capture Real Promotion Media](https://github.com/kunlong-luo/pagevela/actions/workflows/capture-promotion-media.yml) → **Run workflow**, branch `main`; review/download `resume-craft-promotion-media` artifacts (the name is historical and internal). The connected GitHub tool cannot dispatch this workflow. This action creates review files and does not publish external content.

## Third-party edits — author/account required

1. **DEV Community article:** [Building a Local-First Markdown CV Editor: What I Learned](https://dev.to/spark-prairie/building-a-local-first-markdown-cv-editor-what-i-learned-a98) (published 2026-10-11). Its body still identifies the historical product as Resume Craft and ends with the inactive old live-demo URL. If you own this author account, edit the **same article** (do not delete/repost). Add this concise notice after the introduction:

   > **Update — October 2026:** Resume Craft is now **Pagevela**. The code and features discussed below document the same open-source project under its earlier name. The current website is https://kunlong-luo.github.io/pagevela/ and the repository is https://github.com/kunlong-luo/pagevela.

   Replace the **Live app** link at the end with the current Pagevela URL. The historical design discussion and original article permalink can stay as written. Update screenshots only if they contain the old brand, inactive demo URL or materially outdated interface.
2. **PWAs.app listing:** [Resume Craft — Markdown Resume Builder](https://pwas.app/apps/resume-craft) still refers to the old name, old start URL and old previews based on a September 2026 scan. Contact the listing owner/request a re-scan or correction for **https://kunlong-luo.github.io/pagevela/**. The current project's PWA manifest already says Pagevela; renaming GitHub alone cannot change an archived third-party listing. Do not claim that old installed PWAs automatically migrate.
3. **Product Hunt:** A user-supplied old campaign URL with `?ref=producthunt` shows that a referral link existed; it does **not** verify a public Product Hunt product listing. In your Product Hunt maker dashboard, **if** a Pagevela/Resume Craft listing exists, change display name, website, tagline, maker comment links, image gallery, and any retired screenshots. Do not create a duplicate listing without checking platform rules.
4. **Other posts / accounts:** Check your own pinned GitHub profile README, bios, social posts, Chinese blogs, YouTube description, release announcement posts and issue templates for a visibly outdated brand or obsolete `/resume-craft/` page URL. Preserve dates, reactions and legitimate historical context.
5. **GitHub Releases:** [v2.6.0](https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0) (and 7 earlier releases) were genuinely published under the historical Resume Craft label. Leave old archives and SHA256 sums unchanged. If desired, use **Edit release** on **v2.6.0** to add the notice below to the top of its description; the available GitHub connection cannot update existing Release metadata:

   > **Brand update (October 2026):** Resume Craft is now called **Pagevela**. Website: https://kunlong-luo.github.io/pagevela/ · Repository: https://github.com/kunlong-luo/pagevela. This v2.6.0 release and its downloadable archives were originally published under the former name and are preserved unchanged.

## Screenshot and image policy

- Keep existing Pagevela-branded vector assets if the content and crop remain accurate; do not regenerate merely because their **internal filenames** still contain `resume-craft-`.
- Replace **third-party gallery imagery, article screenshots and promotional video frames** that visibly show Resume Craft/简匠 or a broken URL.
- Only capture real UI with fictional examples; review desktop, mobile, video subtitles, legibility, link targets and privacy claims before external publication.
- Do not use AI-generated interfaces as evidence of actual product behavior.

Tracking: [Issue #202](https://github.com/kunlong-luo/pagevela/issues/202).
