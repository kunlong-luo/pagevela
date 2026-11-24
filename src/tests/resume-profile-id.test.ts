import { describe, expect, it } from 'vitest';
import { createResumeProfileId } from '../lib/resume-profile-id';

describe('resume profile primary key generation', () => {
  it('keeps the existing profile_ protocol prefix for secure UUID IDs', () => {
    const generated = createResumeProfileId(() => '89b5b839-a349-460a-9b4a-df1207323e52');
    expect(generated).toBe('profile_89b5b839-a349-460a-9b4a-df1207323e52');
  });

  it('prevents same-millisecond collisions even when UUID and randomness are unavailable', () => {
    const generate = () => createResumeProfileId(() => undefined, () => 123456789, () => 0);
    const ids = Array.from({ length: 100 }, generate);
    expect(ids.every((id) => id.startsWith('profile_123456789_'))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('produces unique opaque IDs in normal usage', () => {
    const ids = Array.from({ length: 40 }, () => createResumeProfileId());
    expect(new Set(ids).size).toBe(ids.length);
  });
});
