import type { ResumeDraft, ResumeProfile } from '../types';
import { getResumeDatabase, type ResumeDraftRecord, type ResumeProfileRecord } from './resume-db';
import { decideActiveResumeWrite, prepareConflictingResumeDrafts, type ActiveResumeBaseline, type ActiveResumeWrite, type ActiveWriteDecision } from './resume-active-conflict';

const ACTIVE_DOCUMENT_ID = 'active';
const JD_DOCUMENT_ID = 'jd';

export interface ResumeRepositorySnapshot {
  markdown?: string | null;
  profiles?: ResumeProfile[] | null;
  drafts?: ResumeDraft[] | null;
  jdText?: string | null;
}

/** A null transformation keeps the committed records unchanged. */
export type DraftHistoryMutation = (current: ResumeDraft[]) => ResumeDraft[] | null;

export interface ResumeRepository {
  getActiveMarkdown(): Promise<string | null>;
  saveActiveMarkdown(markdown: string): Promise<void>;
  getJdText(): Promise<string | null>;
  saveJdText(text: string): Promise<void>;
  saveSnapshot(snapshot: ResumeRepositorySnapshot): Promise<void>;
  getProfiles(): Promise<ResumeProfile[]>;
  replaceProfiles(profiles: ResumeProfile[]): Promise<void>;
  getDrafts(): Promise<ResumeDraft[]>;
  replaceDrafts(drafts: ResumeDraft[]): Promise<void>;
  mutateDrafts(transform: DraftHistoryMutation): Promise<ResumeDraft[]>;
  getMeta(key: string): Promise<string | null>;
  setMeta(key: string, value: string): Promise<void>;
}

function stripSortIndex<T extends { sortIndex: number }>(record: T): Omit<T, 'sortIndex'> {
  const { sortIndex: _sortIndex, ...value } = record;
  return value;
}

export function toProfileRecords(profiles: ResumeProfile[]): ResumeProfileRecord[] {
  return profiles.map((profile, sortIndex) => ({ ...profile, sortIndex }));
}

export function fromProfileRecords(records: ResumeProfileRecord[]): ResumeProfile[] {
  return [...records]
    .sort((a, b) => a.sortIndex - b.sortIndex)
    .map((record) => stripSortIndex(record) as ResumeProfile);
}

export function toDraftRecords(drafts: ResumeDraft[]): ResumeDraftRecord[] {
  return drafts.map((draft, sortIndex) => ({ ...draft, sortIndex }));
}

export function fromDraftRecords(records: ResumeDraftRecord[]): ResumeDraft[] {
  return [...records]
    .sort((a, b) => a.sortIndex - b.sortIndex)
    .map((record) => stripSortIndex(record) as ResumeDraft);
}

export class IndexedDbResumeRepository implements ResumeRepository {
  async getActiveMarkdown(): Promise<string | null> {
    const record = await getResumeDatabase().documents.get(ACTIVE_DOCUMENT_ID);
    return record?.markdown ?? null;
  }

  async saveActiveMarkdown(markdown: string): Promise<void> {
    await getResumeDatabase().documents.put({
      id: ACTIVE_DOCUMENT_ID,
      markdown,
      updatedAt: new Date().toISOString(),
    });
  }

  async getJdText(): Promise<string | null> {
    const record = await getResumeDatabase().documents.get(JD_DOCUMENT_ID);
    return record?.markdown ?? null;
  }

  async saveJdText(text: string): Promise<void> {
    await getResumeDatabase().documents.put({
      id: JD_DOCUMENT_ID,
      markdown: text,
      updatedAt: new Date().toISOString(),
    });
  }

  async saveSnapshot(snapshot: ResumeRepositorySnapshot): Promise<void> {
    const db = getResumeDatabase();
    const now = new Date().toISOString();
    const profileRecords: ResumeProfileRecord[] | null =
      snapshot.profiles == null
        ? null
        : toProfileRecords(snapshot.profiles);
    const draftRecords: ResumeDraftRecord[] | null =
      snapshot.drafts == null
        ? null
        : toDraftRecords(snapshot.drafts);

    await db.transaction('rw', db.documents, db.profiles, db.drafts, async () => {
      if (snapshot.markdown != null) {
        await db.documents.put({
          id: ACTIVE_DOCUMENT_ID,
          markdown: snapshot.markdown,
          updatedAt: now,
        });
      }
      if (snapshot.jdText != null) {
        await db.documents.put({
          id: JD_DOCUMENT_ID,
          markdown: snapshot.jdText,
          updatedAt: now,
        });
      }
      if (profileRecords) {
        await db.profiles.clear();
        if (profileRecords.length > 0) await db.profiles.bulkPut(profileRecords);
      }
      if (draftRecords) {
        await db.drafts.clear();
        if (draftRecords.length > 0) await db.drafts.bulkPut(draftRecords);
      }
    });
  }

  async getProfiles(): Promise<ResumeProfile[]> {
    const records = await getResumeDatabase().profiles.orderBy('sortIndex').toArray();
    return fromProfileRecords(records);
  }

  async replaceProfiles(profiles: ResumeProfile[]): Promise<void> {
    const db = getResumeDatabase();
    const records = toProfileRecords(profiles);
    await db.transaction('rw', db.profiles, async () => {
      await db.profiles.clear();
      if (records.length > 0) await db.profiles.bulkPut(records);
    });
  }

  async getDrafts(): Promise<ResumeDraft[]> {
    const records = await getResumeDatabase().drafts.orderBy('sortIndex').toArray();
    return fromDraftRecords(records);
  }

  async replaceDrafts(drafts: ResumeDraft[]): Promise<void> {
    const db = getResumeDatabase();
    const records = toDraftRecords(drafts);
    await db.transaction('rw', db.drafts, async () => {
      await db.drafts.clear();
      if (records.length > 0) await db.drafts.bulkPut(records);
    });
  }

  /**
   * Draft history read + change + replacement is one Dexie write transaction.
   * This stays atomic across tabs even when browser Web Locks are unavailable.
   */
  async mutateDrafts(transform: DraftHistoryMutation): Promise<ResumeDraft[]> {
    const db = getResumeDatabase();
    return db.transaction('rw', db.drafts, async () => {
      const current = fromDraftRecords(await db.drafts.orderBy('sortIndex').toArray());
      const updated = transform(current);
      if (updated === null) return current;
      const records = toDraftRecords(updated);
      await db.drafts.clear();
      if (records.length > 0) await db.drafts.bulkPut(records);
      return updated;
    });
  }

  async getMeta(key: string): Promise<string | null> {
    const record = await getResumeDatabase().meta.get(key);
    return record?.value ?? null;
  }

  async setMeta(key: string, value: string): Promise<void> {
    await getResumeDatabase().meta.put({
      key,
      value,
      updatedAt: new Date().toISOString(),
    });
  }
}

/**
 * Compare-and-write the active workspace in one IndexedDB read/write
 * transaction. The shared Web Lock remains an optimization: this transaction
 * itself prevents stale cross-tab writers even without navigator.locks.
 *
 * On conflict, keep the newer committed document/profiles/JD untouched and
 * append local manual drafts for the stale tab's text/layout. Existing drafts
 * are never cleared. A failed recovery write rolls back the entire transaction.
 *
 * The legacy public saveSnapshot method remains available for explicit,
 * confirmed workspace replacement/migration, which is a separate operation.
 */
export async function persistActiveResumeIfUnchanged(
  snapshot: ActiveResumeWrite,
  base: ActiveResumeBaseline,
  recoveryId: string,
): Promise<ActiveWriteDecision> {
  const db = getResumeDatabase();
  return db.transaction('rw', db.documents, db.profiles, db.drafts, async () => {
    const [active, jd, records] = await Promise.all([
      db.documents.get(ACTIVE_DOCUMENT_ID),
      db.documents.get(JD_DOCUMENT_ID),
      db.profiles.orderBy('sortIndex').toArray(),
    ]);
    const committed: ActiveResumeBaseline = {
      markdown: active?.markdown ?? null,
      jdText: jd?.markdown ?? null,
      profiles: fromProfileRecords(records),
    };
    const decision = decideActiveResumeWrite(committed, base, snapshot);
    if (decision === 'already-current') return decision;

    if (decision === 'conflict') {
      const recovery = prepareConflictingResumeDrafts(
        snapshot, recoveryId, new Date(),
      );
      if (recovery.length > 0) {
        const oldest = await db.drafts.orderBy('sortIndex').first();
        const firstIndex = oldest && Number.isFinite(oldest.sortIndex)
          ? Math.min(oldest.sortIndex, 0) - recovery.length
          : -recovery.length;
        await db.drafts.bulkPut(recovery.map((draft, index) => ({
          ...draft, sortIndex: firstIndex + index,
        })));
      }
      return decision;
    }

    const now = new Date().toISOString();
    await db.documents.put({
      id: ACTIVE_DOCUMENT_ID, markdown: snapshot.markdown, updatedAt: now,
    });
    await db.documents.put({
      id: JD_DOCUMENT_ID, markdown: snapshot.jdText, updatedAt: now,
    });
    await db.profiles.clear();
    if (snapshot.profiles.length > 0) {
      await db.profiles.bulkPut(toProfileRecords(snapshot.profiles));
    }
    return decision;
  });
}

export const resumeRepository: ResumeRepository = new IndexedDbResumeRepository();
