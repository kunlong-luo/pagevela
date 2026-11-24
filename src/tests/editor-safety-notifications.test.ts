import { describe, expect, it } from 'vitest';
import { classifyResumeTabMessage, describeStorageHealth } from '../hooks/useEditorSafetyNotifications';

describe('workspace safety notification routing', () => {
  it('replies to another tab hello and warns once for presence, ignoring self and invalid messages', () => {
    expect(classifyResumeTabMessage({ type: 'hello', sourceId: 'other' }, 'this')).toBe('hello');
    expect(classifyResumeTabMessage({ type: 'presence', sourceId: 'other' }, 'this')).toBe('presence');
    expect(classifyResumeTabMessage({ type: 'hello', sourceId: 'this' }, 'this')).toBeNull();
    expect(classifyResumeTabMessage({ type: 'unknown', sourceId: 'other' }, 'this')).toBeNull();
    expect(classifyResumeTabMessage(null, 'this')).toBeNull();
    expect(classifyResumeTabMessage('hello', 'this')).toBeNull();
  });

  it('preserves distinct recovery and quota-full feedback in English and Chinese', () => {
    const recovered = describeStorageHealth({ status: 'recovered', operation: 'set' }, 'en');
    expect(recovered.status).toBe('ok');
    expect(recovered.toast.type).toBe('success');
    expect(recovered.toast.duration).toBe(3500);

    const quota = describeStorageHealth(
      { status: 'error', operation: 'set', quotaExceeded: true },
      'en',
    );
    expect(quota.status).toBe('error');
    expect(quota.quotaExceeded).toBe(true);
    expect(quota.toast.message).toContain('Export a JSON backup');
    expect(quota.toast.duration).toBe(8000);

    const otherFailure = describeStorageHealth(
      { status: 'error', operation: 'remove', quotaExceeded: false },
      'zh',
    );
    expect(otherFailure.quotaExceeded).toBe(false);
    expect(otherFailure.toast.title).toBe('本地保存失败');
    expect(otherFailure.toast.message).toContain('导出 JSON 备份');
  });
});
