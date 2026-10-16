# Pagevela — transfer all resumes to a new browser or website

> **Current site:** Pagevela is live at https://kunlong-luo.github.io/pagevela/. The former `/resume-craft/` **Pages path may return 404 and is not redirected** (owner-selected Option A). Both paths are on the same HTTPS origin, so renaming the path alone is not a cross-origin IndexedDB transfer, but installed PWA paths and browser profiles may behave differently. This guide covers optional user-controlled backups when switching browser, device or independently hosted origin.

简体中文提示：正式网站已改为 **https://kunlong-luo.github.io/pagevela/**；旧 `/resume-craft/` 页面不再维护或跳转。新旧路径属于同一浏览器 HTTPS 来源，简历数据通常无需仅因路径改名而导入，但不同浏览器、设备和已安装 PWA 仍需备份并验证。不要清理浏览器数据。

Your resume content is stored primarily in browser-local IndexedDB. Browsers do **not** automatically copy this data to a different website origin (domain, scheme or port), browser profile or device.

## English — export your current workspace

1. Open the **editor** at the current Pagevela site, then open **Resume management → Backup**.
2. Under **Move your complete workspace**, choose **Export workspace .json**.
3. Save the file somewhere private. **Do not clear any browser data or uninstall an existing PWA until the backup and destination restore have been verified.**
4. Treat the file as sensitive personal data: it is **not encrypted** and may include names, contact details, every resume profile, saved drafts, a job description and locally saved portrait photos.

The **Export Current Resume** option above it is an older, *single-resume* format. It cannot move all profiles and drafts.

## English — restore to a different browser or origin

1. Open the new site's editor and navigate to **Resume management → Backup**.
2. Close other tabs editing resumes on the destination site. If existing destination resumes matter, export them as a separate backup first.
3. Choose **Import workspace .json** and select the file from step 2 above.
4. Inspect the confirmation dialog: it explains that **all destination profiles, drafts and saved job description will be replaced**. Use **Cancel** if unsure.
5. Confirm the import. Refresh the editor and check the active resume, other profiles, draft list and any photo before deleting the original file or retiring the original browser.
6. Retain a private backup and the original browser's data until you have independently verified the destination.

**File limits:** currently up to 64 MiB for a full workspace backup and up to 100 profiles. The application refuses invalid or incompatible files. It does not upload the backup to a server.

**Existing shared links:** URLs pointing to `/resume-craft/` may return 404; update any published links to `/pagevela/`. A workspace backup transfers editable content, **not** previously published share URLs or installed PWA scope. Never post real resume share payloads publicly while testing.

**If the import fails:** do not delete or edit the source data. Check the destination browser's free storage, file validity, and whether another editor tab is open. Retry using a fresh copy of the original backup.

## 中文 — 从当前 Pagevela 导出

1. 打开新的 Pagevela 网站编辑器，进入 **简历管理 → 备份**。
2. 在 **迁移完整简历工作区** 区域选择 **导出工作区 .json**。
3. 妥善保存文件。**在需要跨浏览器/设备迁移且核对恢复成功之前，不要清理浏览器数据或卸载旧 PWA。**
4. 文件**未经加密**，可能包含所有档案、草稿、职位描述、个人联系方式及已保存的证件照，请勿公开分享。

请不要误用上方的 **导出当前简历 JSON**：那是只备份单份简历的旧格式，不包含其他档案和草稿。

## 中文 — 在新网站导入

1. 打开新网站的编辑器，进入 **简历管理 → 备份**。
2. 关闭新网站其他正在编辑简历的标签页；如有重要的旧档案，先单独导出备份。
3. 点击 **导入工作区 .json** 并选择旧网站导出的文件。
4. 仔细阅读确认弹窗：确认操作将**替换当前浏览器已有的全部档案、草稿与职位描述**。不确定时请取消。
5. 完成后刷新页面，逐一检查激活简历、其他档案、草稿、职位描述和照片。
6. 核对无误后再考虑停用旧网站。建议保留一份安全存放的原始备份。

当前文件上限为 64 MiB，档案最多 100 份。导入失败时**不要清理浏览器原始数据**。此迁移通过本地文件完成，不需要上传简历到服务器。

## Maintainer acceptance checklist (manual release gate)

- [ ] Export when active Markdown has **unsaved edits**; import into a clean browser profile.
- [ ] Verify two or more profiles in their original order and active selection.
- [ ] Verify drafts (including an empty draft), JD text, template/margin settings and optional JPEG portrait.
- [ ] Verify the old single-resume JSON format is still independently importable.
- [ ] Cancel destination overwrite and confirm no local data changed.
- [ ] Import corrupt JSON, oversized file, duplicate profile ID and invalid photo and confirm no partial overwrite.
- [ ] Verify an actual **new hostname** cannot see old IndexedDB before import, then can read imported data after browser reload.
- [ ] Validate Chromium / Firefox / WebKit and installed PWA flows.
- [ ] Verify the current `/pagevela/` site, and ensure no workflow promises automatic redirects for retired `/resume-craft/` share links.
- [ ] Verify no backup payload appears in analytics or external network requests.
