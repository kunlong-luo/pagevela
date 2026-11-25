import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test.describe('first-run onboarding', () => {

  test('missing onboarding marker cannot bypass the saved-resume confirmation', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('resume-onboarding-v1-complete');
      localStorage.setItem('resume-markdown', '# Keep This Resume\n\nUnique work history.');
    });
    await page.goto('/?page=editor');
    // Existing IndexedDB-backed user content must NOT trigger the first-run
    // tour automatically. Explicitly replay it to test replacement safety.
    await expect(page.locator('#editor-pane')).toBeVisible();
    const tour = page.getByRole('dialog', { name: /Getting started tour|新手引导/ });
    await expect(tour).toHaveCount(0);
    await page.getByRole('button', { name: /More actions|更多操作/ }).click();
    await page.getByRole('button', { name: /^(Help|帮助)$/ }).click();
    await page.getByRole('button', { name: /Replay the interface tour|重新观看新手教程/ }).click();
    await expect(tour).toBeVisible();
    // Recovering saved content takes the returning-user path, even without the marker.
    await expect(tour.getByTestId('onboarding-quick-start')).toBeVisible();
    await tour.getByTestId('onboarding-quick-start').click();
    await tour.getByRole('button', { name: /Start completely blank|从完全空白简历开始/ }).click();
    await expect(tour.getByText(/Replace your current resume\?|要替换当前简历吗？/)).toBeVisible();
    await tour.getByRole('button', { name: /Keep current resume|保留当前简历/ }).click();
    await expect.poll(() => readActiveMarkdown(page)).toContain('Keep This Resume');
  });

  for (const language of ['zh', 'en'] as const) {
    for (const width of [320, 390, 1280]) {
      test(`skip chooser enters editing without losing resume: ${language} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 320 ? 568 : 700 });
        await page.addInitScript(lang => localStorage.setItem('resume_ui_language', lang), language);
        await page.goto('/?page=editor');
        const tour = page.getByRole('dialog', { name: language === 'en' ? 'Getting started tour' : '新手引导' });
        await expect(tour).toBeVisible();
        const before = await readActiveMarkdown(page);
        const skip = tour.getByTestId('onboarding-skip');
        await expect(skip).toBeVisible();
        await expect(skip).toHaveText(language === 'en' ? 'Start without choosing' : '暂不选择，直接编辑');
        // A real click must hit the button, not the fixed fullscreen panel.
        await skip.click();
        await expect(tour).toHaveCount(0);
        await expect(page.locator('#editor-pane')).toBeVisible();
        await expect.poll(() => page.evaluate(() =>
          localStorage.getItem('resume-onboarding-v1-complete'))).toBe('1');
        await expect.poll(() => readActiveMarkdown(page)).toBe(before);
        await page.reload();
        await expect(page.getByRole('dialog', { name: /Getting started tour|新手引导/ })).toHaveCount(0);
      });
    }
  }

  test('lets a first-time user select an example immediately', async ({
    page,
  }) => {
    await page.goto('/?page=editor');

    const tour = page.getByRole('dialog', {
      name: /Getting started tour|新手引导/,
    });
    await expect(tour).toBeVisible();

    await expect(tour.getByRole('heading', {
      name: /How would you like to start|你想从哪里开始/,
    })).toBeVisible();
    await expect(tour.getByRole('button', { name: /Next|下一步/ })).toHaveCount(0);

    await page
      .getByRole('button', {
        name: /Use the full example resume|使用完整示例简历/,
      })
      .click();

    await expect(tour).toBeHidden();

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.localStorage.getItem('resume-onboarding-v1-complete'),
        ),
      )
      .toBe('1');

    await expect.poll(() => readActiveMarkdown(page)).toMatch(/钟晨杰|Alex Chen/);

    await page.reload();

    await expect(
      page.getByRole('dialog', {
        name: /Getting started tour|新手引导/,
      }),
    ).toHaveCount(0);
  });

  test('offers quick-start choices immediately without forcing the tour', async ({ page }) => {
    await page.goto('/?page=editor');

    const tour = page.getByRole('dialog', {
      name: /Getting started tour|新手引导/,
    });
    await expect(tour).toBeVisible();
    await expect(tour.getByText(/No sign-up|无需注册/)).toBeVisible();
    await expect(tour.getByText(/Saved in your browser|保存在当前浏览器/)).toBeVisible();

    await expect(tour.getByRole('heading', {
      name: /How would you like to start|你想从哪里开始/,
    })).toBeVisible();
    await expect(tour.getByTestId('onboarding-fast-choice')).toBeFocused();

    await tour.getByRole('button', {
      name: /Start completely blank|从完全空白简历开始/,
    }).click();

    await expect(tour).toBeHidden();
    await expect.poll(() => readActiveMarkdown(page)).toBe('');
    await page.reload();
    await expect.poll(() => readActiveMarkdown(page)).toBe('');
    await expect(tour).toHaveCount(0);
  });

  test('starts a guided resume in two clicks from the welcome page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('landing-hero-cta').click();
    const chooser = page.getByRole('dialog', { name: /Getting started tour|新手引导/ });
    await expect(chooser).toBeVisible();
    await chooser.getByTestId('onboarding-fast-choice').click();
    await expect(chooser).toBeHidden();
    await expect(page.locator('#editor-pane')).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      window.localStorage.getItem('resume-onboarding-v1-complete'),
    )).toBe('1');
  });

  test('choosing a template on the welcome page skips the start chooser', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Use Template|使用该模板/ }).first().click();
    await expect(page.locator('#editor-pane')).toBeVisible();
    await expect(page.getByRole('dialog', { name: /Getting started tour|新手引导/ })).toHaveCount(0);
    await expect.poll(() => page.evaluate(() =>
      window.localStorage.getItem('resume-onboarding-v1-complete'),
    )).toBe('1');
  });

  test('can replay the onboarding from the help center', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });
    await page.goto('/?page=editor');

    await page.getByRole('button', { name: /More actions|更多操作/ }).click();
    await page
      .getByRole('button', { name: /^(Help|帮助)$/ })
      .click();

    await expect(
      page.getByRole('heading', { name: /Help & Privacy|帮助与隐私/ }),
    ).toBeVisible();

    await page
      .getByRole('button', {
        name: /Replay the interface tour|重新观看新手教程/,
      })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: /Getting started tour|新手引导/,
      }),
    ).toBeVisible();
  });

  test('can open the existing import flow from the final onboarding step', async ({
    page,
  }) => {
    await page.goto('/?page=editor');

    await page
      .getByRole('button', {
        name: /Import an existing resume|导入已有简历/,
      })
      .click();

    await expect(
      page.getByRole('heading', { name: /Import Resume|导入简历/ }),
    ).toBeVisible();
  });

  test('supports keyboard escape and mobile onboarding layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?page=editor');

    const tour = page.getByRole('dialog', {
      name: /Getting started tour|新手引导/,
    });
    await expect(tour).toBeVisible();

    await expect(tour.getByTestId('onboarding-fast-choice')).toBeFocused();

    await tour.getByRole('button', {
      name: /View optional walkthrough|查看可选操作教程/,
    }).click();

    await expect(
      page.getByRole('heading', {
        name: /Step 2.*Adjust layout and tools here|第二步.*调整排版与工具/,
      }),
    ).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(tour).toBeHidden();

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.localStorage.getItem('resume-onboarding-v1-complete'),
        ),
      )
      .toBe('1');
  });
  test('does not overwrite an existing resume when replaying without confirmation', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
      window.localStorage.setItem('resume-markdown', '# Existing Resume\n\nKeep this content.');
    });
    await page.goto('/?page=editor');

    await page.getByRole('button', { name: /More actions|更多操作/ }).click();
    await page
      .getByRole('button', { name: /^(Help|帮助)$/ })
      .click();
    await page
      .getByRole('button', {
        name: /Replay the interface tour|重新观看新手教程/,
      })
      .click();

    await page.getByRole('button', { name: /Next|下一步/ }).click();
    await page.getByRole('button', { name: /Next|下一步/ }).click();

    await page
      .getByRole('button', {
        name: /Use the full example resume|使用完整示例简历/,
      })
      .click();

    await expect(
      page.getByText(/Replace your current resume\?|要替换当前简历吗？/),
    ).toBeVisible();

    await expect.poll(() => readActiveMarkdown(page)).toBe('# Existing Resume\n\nKeep this content.');

    await page
      .getByRole('button', {
        name: /Keep current resume|保留当前简历/,
      })
      .click();

    await expect(
      page.getByRole('button', {
        name: /Use the full example resume|使用完整示例简历/,
      }),
    ).toBeVisible();

    await expect.poll(() => readActiveMarkdown(page)).toBe('# Existing Resume\n\nKeep this content.');
  });

  test('can start completely blank and preserve the blank resume across reload', async ({
    page,
  }) => {
    await page.goto('/?page=editor');

    await page
      .getByRole('button', {
        name: /Start completely blank|从完全空白简历开始/,
      })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: /Getting started tour|新手引导/,
      }),
    ).toBeHidden();

    await expect.poll(() => readActiveMarkdown(page)).toBe('');

    await page.reload();

    await expect.poll(() => readActiveMarkdown(page)).toBe('');

    await expect(
      page.getByRole('dialog', {
        name: /Getting started tour|新手引导/,
      }),
    ).toHaveCount(0);
  });

  for (const language of ['zh', 'en'] as const) {
    for (const width of [320, 390, 1280]) {
      test(`replayed tour keeps navigation labels readable: ${language} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 320 ? 568 : 800 });
        await page.addInitScript((lang) => {
          localStorage.setItem('resume_ui_language', lang);
          localStorage.setItem('resume-onboarding-v1-complete', '1');
        }, language);

        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        await page.goto('/?page=editor');
        if (width < 768) {
          // The desktop More actions button is intentionally hidden on mobile.
          // Exercise the visible quick actions sheet instead.
          await page.getByRole('button', { name: /Open quick actions menu|打开快捷功能菜单/ }).click();
          await page.getByTestId('mobile-quick-action-help').click();
        } else {
          await page.getByRole('button', { name: /More actions|更多操作/ }).click();
          await page.getByRole('button', { name: /^(Help|帮助)$/ }).click();
        }
        await page.getByRole('button', { name: /Replay the interface tour|重新观看新手教程/ }).click();

        const tour = page.getByRole('dialog', { name: /Getting started tour|新手引导/ });
        const next = tour.getByTestId('onboarding-next');
        await expect(next).toHaveText(language === 'en' ? 'Next' : '下一步');
        await expect(next).toHaveCSS('white-space', 'nowrap');
        await expect(next).toBeVisible();
        await expect(next).toBeInViewport();

        const quickStart = tour.getByTestId('onboarding-quick-start');
        await expect(quickStart).toBeVisible();
        const nextBox = await next.boundingBox();
        const quickBox = await quickStart.boundingBox();
        expect(nextBox).not.toBeNull();
        expect(quickBox).not.toBeNull();
        expect(quickBox!.y).toBeGreaterThanOrEqual(nextBox!.y + nextBox!.height);

        await next.click();
        await expect(tour.getByRole('heading', {
          name: /Step 2.*Adjust layout and tools here|第二步.*调整排版与工具/,
        })).toBeVisible();
        await expect(next).toHaveText(language === 'en' ? 'Next' : '下一步');
        await next.click();
        await expect(tour.getByRole('heading', {
          name: /Step 3.*How would you like to start|第三步.*你想从哪里开始/,
        })).toBeVisible();
        expect(pageErrors).toEqual([]);
      });
    }
  }

  test('shows a recovery screen rather than an empty page if an initial module fails', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('resume_ui_language', 'zh'));
    await page.route('**/src/App.tsx*', (route) => route.abort('failed'));
    await page.goto('/?page=editor');
    const recovery = page.getByRole('alert');
    await expect(recovery.getByRole('heading', { name: 'Pagevela 启动失败' })).toBeVisible();
    await expect(recovery.getByRole('button', { name: '重新加载 Pagevela' })).toBeVisible();
    await expect(recovery).toContainText('已保存的简历数据没有被清除');
  });

});
