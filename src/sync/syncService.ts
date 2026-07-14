import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  limit as fsLimit,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { Competition, FirestoreCompetitionDoc, ID } from '../domain/types';
import { ensureAnonymousAuth, getFirebaseServices, isFirebaseConfigured } from './firebase';
import { getCompetition, listPendingSync, markSyncFailed, markSynced } from '../storage/competitionsRepo';
import { backoffDelayFor } from './retry';

const SYNC_TIMEOUT_MS = 8000;
const HISTORY_LIMIT = 100;

function toFirestoreDoc(competition: Competition): FirestoreCompetitionDoc {
  if (!competition.finishedAt || !competition.ranking || !competition.settingsSnapshot) {
    throw new Error('Cannot sync a competition that has not been finished');
  }
  return {
    id: competition.id,
    name: competition.name,
    competitors: competition.competitors,
    disciplines: competition.disciplines,
    scores: competition.scores.map(({ competitorId, disciplineId, value }) => ({
      competitorId,
      disciplineId,
      value,
    })),
    ranking: competition.ranking,
    winDirection: competition.settingsSnapshot.winDirection,
    createdAt: competition.createdAt,
    finishedAt: competition.finishedAt,
    schemaVersion: 1,
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('Sync timed out')), ms);
    }),
  ]);
}

export async function pushCompetition(competition: Competition): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase is not configured');
  await ensureAnonymousAuth();
  const payload = toFirestoreDoc(competition);
  await setDoc(doc(services.firestore, 'competitions', competition.id), {
    ...payload,
    syncedAt: serverTimestamp(),
  });
}

export async function trySync(competition: Competition): Promise<'synced' | 'failed'> {
  const services = getFirebaseServices();
  if (!isFirebaseConfigured() || !services) return 'failed';
  try {
    await ensureAnonymousAuth();
    // A previous attempt may have already written the document even though
    // this client never received the ack (e.g. a timeout on a flaky venue
    // connection). Firestore rules are append-only (create allowed, update
    // denied), so blindly re-pushing would permanently fail with
    // "permission denied" — check for an existing doc first.
    const existing = await withTimeout(
      getDoc(doc(services.firestore, 'competitions', competition.id)),
      SYNC_TIMEOUT_MS,
    );
    if (!existing.exists()) {
      await withTimeout(pushCompetition(competition), SYNC_TIMEOUT_MS);
    }
    await markSynced(competition.id);
    return 'synced';
  } catch (error) {
    await markSyncFailed(competition.id, error instanceof Error ? error.message : String(error));
    scheduleAutoRetry(competition.id);
    return 'failed';
  }
}

let syncInFlight = false;
const scheduledRetries = new Set<ID>();

function scheduleAutoRetry(competitionId: ID): void {
  if (scheduledRetries.has(competitionId)) return;
  void (async () => {
    const competition = await getCompetition(competitionId);
    if (!competition) return;
    const delay = backoffDelayFor(competition.syncAttempts - 1);
    if (delay === null) return; // automatic attempts exhausted; wait for manual retry or 'online' event
    scheduledRetries.add(competitionId);
    setTimeout(() => {
      scheduledRetries.delete(competitionId);
      void (async () => {
        const latest = await getCompetition(competitionId);
        if (latest && latest.status !== 'synced') await trySync(latest);
      })();
    }, delay);
  })();
}

export async function syncAllPending(): Promise<void> {
  if (!isFirebaseConfigured() || syncInFlight) return;
  syncInFlight = true;
  try {
    const pending = await listPendingSync();
    for (const competition of pending) {
      await trySync(competition);
    }
  } finally {
    syncInFlight = false;
  }
}

export function initSyncListeners(): void {
  if (!isFirebaseConfigured()) return;
  window.addEventListener('online', () => {
    void syncAllPending();
  });
  if (navigator.onLine) void syncAllPending();
}

export async function fetchCompetitionDoc(id: ID): Promise<FirestoreCompetitionDoc | null> {
  const services = getFirebaseServices();
  if (!services) return null;
  const snapshot = await getDoc(doc(services.firestore, 'competitions', id));
  return snapshot.exists() ? (snapshot.data() as FirestoreCompetitionDoc) : null;
}

export function subscribeToHistory(
  onUpdate: (docs: FirestoreCompetitionDoc[]) => void,
): () => void {
  const services = getFirebaseServices();
  if (!services) {
    onUpdate([]);
    return () => {};
  }
  const q = query(
    collection(services.firestore, 'competitions'),
    orderBy('finishedAt', 'desc'),
    fsLimit(HISTORY_LIMIT),
  );
  return onSnapshot(q, (snapshot) => {
    onUpdate(snapshot.docs.map((d) => d.data() as FirestoreCompetitionDoc));
  });
}
