import { db } from './db';
import { generateId } from '../utils/id';
import { rankCompetitors } from '../domain/scoring';
import type { Competition, ID, ScoreValue, WinDirection } from '../domain/types';

export async function createCompetition(input: {
  name: string;
  competitorNames: string[];
  disciplineNames: string[];
}): Promise<Competition> {
  const now = new Date().toISOString();
  const competition: Competition = {
    id: generateId(),
    name: input.name,
    competitors: input.competitorNames.map((name, order) => ({
      id: generateId(),
      name,
      order,
    })),
    disciplines: input.disciplineNames.map((name, order) => ({
      id: generateId(),
      name,
      order,
    })),
    scores: [],
    status: 'in_progress',
    createdAt: now,
    finishedAt: null,
    settingsSnapshot: null,
    ranking: null,
    syncError: null,
    syncAttempts: 0,
  };
  await db.competitions.add(competition);
  return competition;
}

export async function getCompetition(id: ID): Promise<Competition | undefined> {
  return db.competitions.get(id);
}

export async function updateCompetition(id: ID, patch: Partial<Competition>): Promise<void> {
  await db.competitions.update(id, patch);
}

export async function setScore(
  competitionId: ID,
  competitorId: ID,
  disciplineId: ID,
  value: ScoreValue,
): Promise<Competition> {
  const competition = await db.competitions.get(competitionId);
  if (!competition) throw new Error(`Competition ${competitionId} not found`);

  const now = new Date().toISOString();
  const existingIndex = competition.scores.findIndex(
    (s) => s.competitorId === competitorId && s.disciplineId === disciplineId,
  );
  const scores = [...competition.scores];
  if (existingIndex >= 0) {
    scores[existingIndex] = { competitorId, disciplineId, value, updatedAt: now };
  } else {
    scores.push({ competitorId, disciplineId, value, updatedAt: now });
  }

  await db.competitions.update(competitionId, { scores });
  return { ...competition, scores };
}

export async function reorderCompetitors(competitionId: ID, orderedIds: ID[]): Promise<void> {
  const competition = await db.competitions.get(competitionId);
  if (!competition) throw new Error(`Competition ${competitionId} not found`);

  const byId = new Map(competition.competitors.map((c) => [c.id, c]));
  const competitors = orderedIds.map((id, order) => {
    const competitor = byId.get(id);
    if (!competitor) throw new Error(`Competitor ${id} not found in competition ${competitionId}`);
    return { ...competitor, order };
  });

  await db.competitions.update(competitionId, { competitors });
}

export async function finishCompetition(
  competitionId: ID,
  winDirection: WinDirection,
): Promise<Competition> {
  const competition = await db.competitions.get(competitionId);
  if (!competition) throw new Error(`Competition ${competitionId} not found`);

  const ranking = rankCompetitors(competition, winDirection);
  const patch: Partial<Competition> = {
    status: 'finished_local',
    finishedAt: new Date().toISOString(),
    settingsSnapshot: { winDirection },
    ranking,
  };
  await db.competitions.update(competitionId, patch);
  return { ...competition, ...patch };
}

export async function listInProgress(): Promise<Competition[]> {
  return db.competitions.where('status').equals('in_progress').toArray();
}

export async function listPendingSync(): Promise<Competition[]> {
  return db.competitions
    .where('status')
    .anyOf('finished_local', 'pending_sync')
    .toArray();
}

export async function markSyncFailed(competitionId: ID, error: string): Promise<void> {
  const competition = await db.competitions.get(competitionId);
  if (!competition) return;
  await db.competitions.update(competitionId, {
    status: 'pending_sync',
    syncError: error,
    syncAttempts: competition.syncAttempts + 1,
  });
}

export async function markSynced(competitionId: ID): Promise<void> {
  await db.competitions.update(competitionId, {
    status: 'synced',
    syncError: null,
  });
}

export async function deleteCompetition(competitionId: ID): Promise<void> {
  await db.competitions.delete(competitionId);
}
