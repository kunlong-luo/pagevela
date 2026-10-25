# v2.8.1 — Android 真机与导出可靠性验收 / Release Acceptance

> **2026-10-25 scoped decision:** For the **v2.8.1 documentation + automated-regression patch**, automated release acceptance is sufficient **once the exact release PR and main CI gates pass**, because this patch does not alter PDF runtime logic, device-specific UI, persistence behavior or browser-print integration. The owner separately confirmed a PASS on an **actual Android phone in WeChat**. This does **not** establish that Android Chrome/Samsung/OEM, system Save-as-PDF, Downloads, offline PWA or individual A–H flows all passed. Those remain open in #262 as **future coverage gates for changes affecting those paths**, not blockers to this test/documentation-only release. #202 legal trademark and offsite listing work also remains open.

## Baseline / 基线

- Website: https://kunlong-luo.github.io/pagevela/
- Last verified packaged release before this work: v2.8.0.
- Parent issues: [#262 — Android hardware QA](https://github.com/kunlong-luo/pagevela/issues/262), [#202 — brand/migration](https://github.com/kunlong-luo/pagevela/issues/202).
- Automated coverage already exists for multi-page A4 selectable print output (`e2e/pdf-print-quality.e2e.ts`), real Quick PDF downloads (`e2e/pdf-download.e2e.ts`), workspace export/import (`e2e/portable-workspace.e2e.ts`) and responsive/keyboard/QR flows. From this PR forward, Quick PDF **must be parsed by pdfjs-dist**, every page must contain drawing operations, and the unchanged draft must survive reload following download.
- Treat Quick PDF as **raster**. Use ATS/browser print for selectable text. Never claim that automation has operated Android's Save as PDF dialog.

## 2026-10-25 owner verification / 负责人确认记录

- **Source:** project owner statement in the current ChatGPT conversation: “安卓微信真机已经验收，实际测试已经通过了。”
- **What may now be marked as passed:** real Android + actual WeChat in-app browser **overall acceptance**, as reported by the owner.
- **Not captured in this project evidence record:** model, Android/WeChat versions, exact tested build SHA and individual A–H flows, files produced by Android printing/downloading, offline and installed PWA outcomes, LCP/INP/CLS and screenshots. Do **not** backfill these fields with assumptions or claim that all real-device browser classes passed.
- **Scope of remaining checks:** independent Android Chrome, Samsung Internet or OEM results; real print/Downloads/opened-PDF and workspace restore evidence to support the v2.8.1 release gate. These can be appended to #262 without publishing any personal resume content.

## Physical device evidence / 真机矩阵（必须填写）

Copy this table into a comment on #262, with a sanitized screenshot or short screen recording of any failure. Do not record or upload genuine resumes, contact information, job descriptions, analytics identifiers or share payloads.

| Required class | Example model / Android / browser | Required flows | Result | Evidence |
| --- | --- | --- | --- | --- |
| Stock Android Chrome | Pixel or equivalent; note exact model, Android and Chrome versions | A–H | NOT RUN | — |
| Samsung browser | Galaxy; note exact device and Samsung Internet version | A–H | NOT RUN | — |
| Chinese OEM browser | Mainstream Xiaomi/Honor/OPPO/Vivo; note exact OEM browser/version | A–H | NOT RUN | — |
| WeChat Android WebView | **Actual Android + WeChat**, device and app versions not supplied | Overall owner-reported real-device acceptance; A/B/D/F/H not individually itemized | **OWNER-REPORTED PASS** | [Owner confirmation on #262](https://github.com/kunlong-luo/pagevela/issues/262) (no attachment) |

If a device/browser combination is unavailable, mark **BLOCKED** with reason, owner and follow-up—never mark PASS or silently drop it. Browser/device coverage may be narrowed only by an explicit, documented supported-platform decision.

### A–H hands-on flows / 逐项操作

A. **Startup and scan / 欢迎页** — cold start and warm start; QR links to exact `/pagevela/`; Start and language/theme work; no clipped controls, browser-default widgets or unintended scroll.
B. **Editing and keyboard / 输入法** — create a **fictional** Chinese + English resume, use Chinese IME composition, cut/paste, autosave; open/close keyboard repeatedly and use Form/Code/Preview; verify focused input and fixed bottom actions never overlap.
C. **Layout / 排版** — switch A4 and US Letter, run Auto Fit, scroll a 3-page fictional resume to its last line, open/close tool sheets, rotate screen; verify 320px-equivalent narrow widths.
D. **PDF / 导出** — real Android print UI → **Save as PDF**, open saved PDF in another viewer, check selectable Chinese/English text and A4/Letter page geometry; separately Quick PDF direct download → verify Downloads file exists, opens, all pages render and last line is preserved. Treat PDF dialog / file access failure as **P0/P1** until triaged.
E. **Non-PDF export / 其他下载** — Markdown, JSON Resume and **full workspace JSON**; inspect files on device (not only a success toast), import from Files picker, verify metadata, multiple profiles, drafts and optional portrait; cancel overwrite and verify original workspace unaffected. The full backup is **unencrypted** and must not be posted.
F. **Offline/PWA / 离线与 PWA** — test first-ever visit online then offline; install PWA on a supported browser; edit/restart fully offline, restore data, repeat export. Do **not** claim first-time offline PDF works when PDF chunks have never been cached.
G. **Persistence and failure / 存储可靠性** — close/reopen browser, switch tabs, reload during editing and after a successful download; verify no lost draft; test storage-full or blocked-download error only in a controlled disposable test profile, never by clearing the user's real storage.
H. **WeChat / 微信** — scan the welcome QR with the actual WeChat scanner, verify landing/edit/navigation/share and browser hand-off. If WeChat blocks print/download, display or document **branded, accessible guidance** without claiming success; validate the suggested external browser workflow.

## Recording template / 复制到 #262 的结果格式

```text
Device / 设备型号:
Android OS / 系统版本:
Browser or WeChat / 浏览器与版本:
Build SHA / 测试版本:
Local date and network / 日期与网络:
Flows A / B / C / D / E / F / G / H: PASS | FAIL | BLOCKED | N/A (with reason)
PDF: Android Save-as-PDF [result, page count, searchable text] / Quick PDF [result, size, page count]
Workspace: [export filename only, sanitized; import/cancel/reload result]
Timing: cold LCP / INP / CLS / quick-PDF wall time (if actually measured; specify measurement tool)
Evidence: redacted screenshot or recording URL (optional for PASS, required for FAIL)
Severity (if failed): P0 data loss | P1 unusable edit/export | P2 layout | P3 cosmetic
Reproduction, expected/actual, rollback or workaround:
Tester and sign-off:
```

## Release gates / 发布阻断条件

- [x] Define the exact live-site manual testing matrix and privacy-safe recording format.
- [ ] **All required real-device rows**: Android WeChat real device owner-reported PASS on 2026-10-25; remaining Chrome/Samsung/OEM rows, version metadata, individual A–H and failure triage not separately documented. Do not infer from simulated viewports.
- [ ] **PDF**: independently open downloaded Quick PDFs and native Android Save-as-PDF output, inspect all pages, text selectability on the ATS print path, and last-line safety.
- [ ] **Data integrity**: export, cancel import, full restore, browser restart and offline restart from real devices; zero reproducible data loss.
- [ ] **Stability**: no unresolved P0/P1 (failed export, draft loss, hidden keyboard/action controls).
- [ ] **Automated**: merge QA/code improvements after quality, Chromium, Firefox/WebKit E2E, final build-and-test success; preserve no-native-component contract.
- [x] **v2.8.1 release scope decision (2026-10-25):** Documentation/test/version-only patch, no change to Android runtime, PDF implementation or local storage; use successful full CI and the owner's actual Android WeChat PASS. Unrecorded hardware flows remain unverified in #262 and are not asserted as passed.
- [ ] **v2.8.1 production acceptance:** latest-head PR required checks all succeed, manually reviewed squash merge, GitHub stable Release ZIP/TAR.GZ/checksums, then successful full main-push CI followed by same-SHA Pages **build and deploy**.

## Safety and scope

No real resume uploads, account creation, telemetry containing PII, native HTML modal/tooltip/select components, forced migration, silent auto-recovery deleting user state, or unapproved changes to login/domain/DNS. Existing GitHub Pages is the only authorized official origin.
