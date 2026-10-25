import { describe, expect, it } from 'vitest';
import {
  ANALYTICS_EVENTS,
  getSafeAnalyticsPath,
  isAllowedAnalyticsEvent,
  isDoNotTrackEnabled,
  isOfficialAnalyticsContext,
} from '../lib/analytics';

describe('privacy-friendly analytics', () => {
  it('only enables analytics on the official hosted app', () => {
    expect(isOfficialAnalyticsContext('kunlong-luo.github.io', '/pagevela/')).toBe(true);
    expect(isOfficialAnalyticsContext('kunlong-luo.github.io', '/pagevela/shared')).toBe(true);
    expect(isOfficialAnalyticsContext('localhost', '/pagevela/')).toBe(false);
    expect(isOfficialAnalyticsContext('example.com', '/pagevela/')).toBe(false);
  });

  it('normalizes share URLs without exposing the share payload', () => {
    const payload = 'private-resume-payload';
    const path = getSafeAnalyticsPath(
      '/pagevela/',
      `?share=${encodeURIComponent(payload)}&utm_source=test`,
    );

    expect(path).toBe('/pagevela/shared');
    expect(path).not.toContain(payload);
    expect(path).not.toContain('share=');

    const fragmentPath = getSafeAnalyticsPath(
      '/pagevela/',
      '',
      `#share=${encodeURIComponent(payload)}`,
    );
    expect(fragmentPath).toBe('/pagevela/shared');
    expect(fragmentPath).not.toContain(payload);
  });

  it('keeps normal app paths and ignores ordinary query data', () => {
    expect(getSafeAnalyticsPath('/pagevela/', '?utm_source=github')).toBe('/pagevela/');
  });

  it('respects Do Not Track values', () => {
    expect(isDoNotTrackEnabled({ doNotTrack: '1' })).toBe(true);
    expect(isDoNotTrackEnabled({ doNotTrack: 'yes' })).toBe(true);
    expect(isDoNotTrackEnabled({ doNotTrack: '0' })).toBe(false);
    expect(isDoNotTrackEnabled({ doNotTrack: null })).toBe(false);
  });

  it('uses a fixed event allowlist with no user-derived event names', () => {
    expect(ANALYTICS_EVENTS).toEqual([
      'site_opened',
      'start_building_clicked',
      'editor_opened',
      'editing_started',
      'pdf_export_success',
      'browser_print_started',
      'ats_check_completed',
      'auto_fit_used',
      'share_created',
      'pwa_install',
      'feedback_opened',
      'local_data_cleared',
      'runtime_error',
    ]);

    expect(isAllowedAnalyticsEvent('site_opened')).toBe(true);
    expect(isAllowedAnalyticsEvent('start_building_clicked')).toBe(true);
    expect(isAllowedAnalyticsEvent('editor_opened')).toBe(true);
    expect(isAllowedAnalyticsEvent('share_created')).toBe(true);
    expect(isAllowedAnalyticsEvent('local_data_cleared')).toBe(true);
    expect(isAllowedAnalyticsEvent('runtime_error')).toBe(true);
    expect(isAllowedAnalyticsEvent('resume:Jane Doe')).toBe(false);
    expect(isAllowedAnalyticsEvent('jd:senior frontend engineer')).toBe(false);
    expect(isAllowedAnalyticsEvent('file:private-resume.pdf')).toBe(false);
  });
});
