# Resume Craft v2.6.0 Promotion Playbook

**Historical planning document:** v2.6.0 was published as Resume Craft on 2026-10-14. **Do not post the original campaign copy as-is.** New/edited posts must use **Pagevela**, [the current demo](https://kunlong-luo.github.io/pagevela/) and [new repo](https://github.com/kunlong-luo/pagevela), with real Pagevela screenshots from the current site. Do not replace existing historical release archives or claim historical posts had the new branding.

**Published on 2026-10-14.** For ready-to-review Xiaohongshu, Douyin and Reddit launch copy, filming notes and accurate privacy disclosures, see the [v2.6.0 social launch kit](./docs/V2_6_0_SOCIAL_LAUNCH_KIT.md). These are drafts; all external posts require human review and platform-specific publication.

This document keeps promotion practical, measurable, and non-spammy. Automation prepares material and previews posts; a human reviews and publishes anything that reaches an external community.

## Goal

Validate whether Pagevela solves a real problem for:

1. Developers and technical job seekers who prefer Markdown.
2. International applicants who need A4 / US Letter and market-aware resume defaults.
3. Privacy-conscious users who want a local-first resume workflow without an account.

The first promotion cycle is for learning, not maximizing raw impressions.

## Core positioning

**English**

> A local-first Markdown resume builder with live A4 / US Letter preview, ATS-oriented checks, PDF export, international market presets, and optional encrypted sharing.

**中文**

> 一个本地优先的 Markdown 简历编辑器，支持 A4 / US Letter、ATS 检查、国际求职市场适配、PDF 导出和可选加密分享，无需注册即可使用。

## Primary proof points

- No account required for normal editing.
- Core resume data is stored locally in browser IndexedDB; lightweight UI preferences remain in localStorage.
- Markdown and structured form editing stay in sync.
- A4 / US Letter support with target-market defaults.
- ATS-oriented readability and JD matching guidance without claiming guaranteed ATS outcomes.
- Browser-print ATS PDF path with selectable text where supported, plus Quick PDF raster fallback.
- **v2.6.0:** optional locally cropped 3:4 portrait for China-market résumés, at the top right of supported layouts; international résumés normally omit photos.
- **v2.6.0:** full workspace JSON backup/restore of profiles, drafts, JD text and stored photos; the backup file is **not encrypted**, and transferring to a different domain is an explicit user action.
- **v2.6.0:** per-profile market and layout settings survive an interrupted autosave on rapid reload.
- Public share links are readable by link holders; password-protected links are encrypted locally before link creation.
- Open-source repository and reproducible release assets.

## Two-week v2.6 validation sequence

### Days 1-2 — Release verification

- Verify the live demo, [v2.6.0 release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0), social preview card, README, local profile upgrades, complete-workspace backup, and mobile layout.
- Confirm existing v2.5.0 users still find their local profiles, drafts and preferences after the v2.6.0 same-origin update; do not clear the original browser's site data.
- Capture one clean desktop screenshot and one mobile screenshot.
- Prepare one short demo GIF/video showing: edit -> preview -> Target Market -> ATS check -> PDF.
- Record the baseline analytics counts before promotion.

### Days 3-5 — Developer-first soft launch

Use channels where the product itself is directly relevant.

**GitHub**
- Keep README and social preview current.
- Pin a concise v2.6.0 update focused on China-market optional 3:4 portrait support, complete local workspace backup/restore, interrupted-save recovery, and zero-account workflow.
- Ask for bug reports and workflow feedback, not stars.

**Show HN**
- Use only when the maker is prepared to stay in the thread and answer questions.
- Lead with the technical/product story: local-first architecture, Markdown/form synchronization, ATS-oriented export, privacy boundaries.
- Link directly to the working demo so there is no signup barrier.
- Do not ask anyone to upvote or manufacture comments.

Suggested title:

> Show HN: Pagevela – a local-first Markdown resume builder with ATS checks

**Developer communities**
- Share a technical breakdown rather than a generic advertisement.
- Useful topics: migrating a local-first editor from synchronous localStorage blobs to IndexedDB, browser-only encrypted sharing, keeping PDF output ATS-readable, and A4 vs US Letter internationalization.

### Days 6-9 — Job-seeker content

Publish problem-solving content around specific user needs:

- How to switch a resume between China / US / UK conventions.
- Why an ATS-friendly PDF should preserve selectable text.
- A4 vs US Letter: when each matters.
- Public share link vs encrypted share link.
- Turning an existing PDF or raw text resume into editable Markdown.

For Chinese channels, rewrite examples for local job seekers instead of translating English copy word-for-word.

### Days 10-14 — Product launch and review

**Product Hunt**
- Launch only after the demo, screenshots, tagline, maker comment, and FAQ are ready.
- Use a personal maker account.
- Ask people for feedback or comments, never for upvotes.
- Stay available to respond throughout the launch window.

Suggested tagline:

> Build ATS-friendly resumes locally with Markdown, live preview, and market-aware formatting.

After the first cycle:
- Compare visit -> editing_started -> ATS check -> PDF export -> share_created.
- Watch for migration, reload, multi-profile, draft/backup, and local-clear feedback; storage regressions take priority over new feature requests.
- Review GitHub issues/discussions and community replies.
- Pick the next engineering work from observed friction rather than speculative feature ideas.

## Channel-specific copy framework

Every post should answer four things:

1. **Problem** — what is annoying today?
2. **Difference** — what does Pagevela do differently?
3. **Proof** — what can a user try immediately?
4. **Ask** — request feedback on a specific workflow.

Avoid generic phrases such as "revolutionary", "best resume builder", or guaranteed ATS success.

## Automation boundary

Agency-style agents are useful for:

- audience research;
- topic and keyword discovery;
- turning one source brief into channel-specific drafts;
- preparing launch checklists;
- summarizing feedback;
- comparing analytics between promotion cycles;
- proposing the next experiment.

They should **not** autonomously:

- mass-post the same message to communities;
- create fake engagement;
- ask for upvotes;
- impersonate users;
- reply to community members without review;
- publish private resume or analytics data.

Recommended workflow:

```
Product brief
    ↓
Research / positioning agent
    ↓
Channel adapter agents
    ├─ English developer copy
    ├─ Chinese developer copy
    ├─ Job-seeker copy
    └─ launch-page copy
    ↓
Human review
    ↓
Publish
    ↓
Analytics + feedback
    ↓
Feedback synthesis agent
    ↓
Next experiment
```

## GitHub Action

`.github/workflows/promote.yml` intentionally remains in `dry-run` mode.

Current behavior:

- reads the public sitemap;
- includes the current `/pagevela/` page;
- previews at most one cross-post;
- does not publish to any social account;
- has no social credentials enabled.

Do not switch `dry-run` to `false` until a specific network, credentials, message format, and review process have been explicitly approved.

## Metrics

Do not optimize for impressions alone.

Primary funnel:

```
visit
→ editing_started
→ ats_check_completed
→ pdf_export_success / browser_print_started
→ share_created
```

Useful qualitative signals:

- "I understood what this product is within 10 seconds."
- "I could import or begin a resume without instructions."
- "The exported PDF looked like the preview."
- "The market presets matched my expectations."
- "I trusted the privacy explanation."

## Decision rules after two weeks

Continue product work when feedback repeatedly identifies the same friction.

Examples:

- High visits, low editing -> positioning / onboarding.
- Editing but few exports -> editor, preview, or export friction.
- Many exports but few return visits -> may simply be a successful one-shot utility.
- International users confused by paper/date defaults -> improve market UX.
- Performance complaints -> prioritize bundle/PWA work.
- Security/privacy questions -> strengthen runtime-script and CSP boundaries.

Do not add large features solely because they are easy to build.
