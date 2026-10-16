# Legacy GitHub Pages redirects: /resume-craft/ → /pagevela/

**Status:** the redirect files are prepared and unit-tested, **not deployed**. The old GitHub Pages URL currently returns 404. The public Pagevela app is already live at https://kunlong-luo.github.io/pagevela/.

## Why this uses a separate user site

GitHub repository renames redirect links from `github.com/kunlong-luo/resume-craft` to the new repository, but **do not redirect** the project's `github.io/resume-craft/` URLs. Re-creating a repository named `resume-craft` to host a Pages redirect would also occupy the old GitHub repository path, disabling GitHub's useful repository redirects.

Instead, publish this `site/` directory at the **root** of a separate **public** GitHub repository named **`kunlong-luo.github.io`** under the same GitHub account. This user Pages website can supply the missing `/resume-craft/` page while the `pagevela` project repository continues serving `/pagevela/`.

## One-time owner action: create and publish the Pages user site

1. In the `kunlong-luo` account, create a **public** repository with the **exact** name `kunlong-luo.github.io` via https://github.com/new. **Do not** create a second `resume-craft` repository.
2. Copy the **contents** of `docs/legacy-pages-redirect/site/` into the **root** of that new repository's `main` branch, preserving the layout below (do **not** put them beneath a top-level `site/` folder):

   ```text
   kunlong-luo.github.io/
   ├── .nojekyll
   ├── index.html
   ├── 404.html
   └── resume-craft/
       └── index.html
   ```

   The repo's GitHub web interface supports **Add file → Upload files**. A ZIP is also available from the companion setup package, but ZIP contents need to be extracted before upload.
3. In that repository's **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save. No DNS, CNAME, new domain, server or third-party hosting is required.
4. Open https://kunlong-luo.github.io/resume-craft/ and verify that it automatically replaces the current tab with https://kunlong-luo.github.io/pagevela/.
5. Confirm that https://github.com/kunlong-luo/resume-craft still redirects to https://github.com/kunlong-luo/pagevela.

## Acceptance tests after the user Pages site is actually published

- [ ] `https://kunlong-luo.github.io/resume-craft/` opens `https://kunlong-luo.github.io/pagevela/` without a 404.
- [ ] `https://kunlong-luo.github.io/resume-craft/?page=editor` opens `https://kunlong-luo.github.io/pagevela/?page=editor`.
- [ ] `https://kunlong-luo.github.io/resume-craft/editor` maps to the new `?page=editor` deep link.
- [ ] A **fictional** encrypted/plain share link containing query and fragment payloads keeps the *exact* share parameters after redirect and displays its content. Never paste real personal resume share payloads in issues or CI logs.
- [ ] Old static `/resume-craft/og-card.png` and `/resume-craft/sitemap.xml` paths resolve to their new equivalents (after the new Pages metadata/sitemap is corrected).
- [ ] The original GitHub repository redirect still works, and no real resumes or browser storage keys are modified.
- [ ] An installed old-scope PWA opens sensibly or receives a visible recovery link; **redirect alone does not prove installed-PWA upgrade**.
- [ ] Phone/desktop and Chrome/Safari/Firefox smoke checks pass.

## Important boundaries

- This is a **client-side `location.replace` redirect**, not an HTTP **301/308**. GitHub Pages is static hosting and does not let this repository install arbitrary server rewrite rules. Browsers running JavaScript preserve `location.search` and `location.hash` on the jump; with JavaScript disabled, the fallback link opens the new home page but cannot carry historical share fragments automatically.
- Both project URLs share the same **HTTPS origin** (scheme + hostname), but their **paths and PWA service-worker scopes differ**. There is no new cross-origin database migration here. The redirect does not erase localStorage/IndexedDB or trigger automatic data imports.
- The `site/404.html` catches legacy subpaths on a user Pages site and leaves unrelated paths alone; it cannot serve other sites that own explicit project paths.
- Do not copy redirect files into the current `pagevela` repo expecting them to answer `/resume-craft/`; only the separate user Pages site or a separately configured redirect host can do that.
- Avoid claiming production success until the old URL, real share behaviors, and Pages deployment have been checked. For SEO, separately update current canonical, Open Graph, sitemap, `robots.txt`, IndexNow and external article/demo URLs to `/pagevela/`.

Official details: [GitHub rename behavior](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository), [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

Tracking: [#202](https://github.com/kunlong-luo/pagevela/issues/202).
