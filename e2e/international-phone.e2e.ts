import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem(
      'resume-settings',
      JSON.stringify({ lang: 'en' }),
    );
  });
});

test.describe('international contact phone', () => {
  test('does not guess a country from language or target market', async ({ page }) => {
    await page.goto('/?page=editor');

    const country = page.getByLabel('Country or region');
    await expect(country).toBeVisible();
    await expect(country).toContainText('Country / region');

    await page.evaluate(() => {
      const settings = JSON.parse(window.localStorage.getItem('resume-settings') || '{}');
      window.localStorage.setItem(
        'resume-settings',
        JSON.stringify({ ...settings, marketRegion: 'us', lang: 'en' }),
      );
    });
    await page.reload();

    await expect(page.getByLabel('Country or region')).toContainText('Country / region');
  });

  test('normalizes a local UK number and resume check recognizes it', async ({
    page,
  }) => {
    await page.goto('/?page=editor');

    const country = page.getByLabel('Country or region');
    const phone = page.getByLabel('Phone Number');

    await expect(country).toBeVisible();
    await expect(phone).toBeVisible();

    await country.click();
    await page.getByRole('listbox').getByRole('option', { name: /United Kingdom.*\+44/ }).click();
    await expect(country).toContainText('United Kingdom +44');
    await phone.fill('020 7946 0958');
    await phone.blur();

    await expect(phone).toHaveValue('+44 20 7946 0958');

    await expect.poll(() => readActiveMarkdown(page)).toContain('+44 20 7946 0958');

    await page.getByRole('button', { name: /^(Check|检查)$/ }).click();

    const checker = page.getByRole('dialog', {
      name: /Resume Check|简历检查/,
    });
    await expect(checker).toBeVisible();
    await expect(
      checker.getByText(/Contact Info: Phone number found|联系方式：已识别电话号码/),
    ).toBeVisible();
  });

  test('remembers the selected region before a phone number is complete', async ({
    page,
  }) => {
    await page.goto('/?page=editor');

    const country = page.getByLabel('Country or region');
    await country.click();
    await page.getByRole('listbox').getByRole('option', { name: /Australia.*\+61/ }).click();
    await expect(country).toContainText('Australia +61');

    await page.reload();

    await expect(page.getByLabel('Country or region')).toContainText('Australia +61');
    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('resume-phone-regions') || ''),
      )
      .toContain('AU');
  });

  test('detects the region when a full international number is pasted', async ({
    page,
  }) => {
    await page.goto('/?page=editor');

    const country = page.getByLabel('Country or region');
    const phone = page.getByLabel('Phone Number');

    await phone.fill('+852 91234567');
    await phone.blur();

    await expect(country).toContainText('+852');
    await expect(phone).toHaveValue('+852 9123 4567');
  });
});
