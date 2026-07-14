import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../db';
import {
  createCompetition,
  finishCompetition,
  listInProgress,
  listPendingSync,
  markSyncFailed,
  markSynced,
  reorderCompetitors,
  setScore,
} from '../competitionsRepo';

beforeEach(async () => {
  await db.competitions.clear();
});

describe('competitionsRepo', () => {
  it('creates a competition with ordered competitors and disciplines', async () => {
    const competition = await createCompetition({
      name: 'Spring Cup',
      competitorNames: ['Alice', 'Bob'],
      disciplineNames: ['Dressage', 'Speed'],
    });
    expect(competition.name).toBe('Spring Cup');
    expect(competition.competitors.map((c) => c.name)).toEqual(['Alice', 'Bob']);
    expect(competition.competitors.map((c) => c.order)).toEqual([0, 1]);
    expect(competition.status).toBe('in_progress');
  });

  it('sets and overwrites scores', async () => {
    const competition = await createCompetition({
      name: 'Cup',
      competitorNames: ['Alice'],
      disciplineNames: ['Dressage'],
    });
    const [competitor] = competition.competitors;
    const [discipline] = competition.disciplines;

    await setScore(competition.id, competitor.id, discipline.id, 80);
    let updated = await db.competitions.get(competition.id);
    expect(updated?.scores).toHaveLength(1);
    expect(updated?.scores[0].value).toBe(80);

    await setScore(competition.id, competitor.id, discipline.id, 95);
    updated = await db.competitions.get(competition.id);
    expect(updated?.scores).toHaveLength(1);
    expect(updated?.scores[0].value).toBe(95);
  });

  it('reorders competitors', async () => {
    const competition = await createCompetition({
      name: 'Cup',
      competitorNames: ['Alice', 'Bob', 'Cara'],
      disciplineNames: ['Dressage'],
    });
    const [a, b, c] = competition.competitors;
    await reorderCompetitors(competition.id, [c.id, a.id, b.id]);
    const updated = await db.competitions.get(competition.id);
    expect(updated?.competitors.map((x) => x.name)).toEqual(['Cara', 'Alice', 'Bob']);
    expect(updated?.competitors.map((x) => x.order)).toEqual([0, 1, 2]);
  });

  it('finishes a competition and computes ranking + settings snapshot', async () => {
    const competition = await createCompetition({
      name: 'Cup',
      competitorNames: ['Alice', 'Bob'],
      disciplineNames: ['Dressage'],
    });
    const [alice, bob] = competition.competitors;
    const [dressage] = competition.disciplines;
    await setScore(competition.id, alice.id, dressage.id, 90);
    await setScore(competition.id, bob.id, dressage.id, 70);

    const finished = await finishCompetition(competition.id, 'highest');
    expect(finished.status).toBe('finished_local');
    expect(finished.settingsSnapshot).toEqual({ winDirection: 'highest' });
    expect(finished.ranking?.[0].competitorId).toBe(alice.id);
    expect(finished.ranking?.[0].place).toBe(1);
  });

  it('lists in-progress and pending-sync competitions separately', async () => {
    const inProgress = await createCompetition({
      name: 'A',
      competitorNames: ['X'],
      disciplineNames: ['Y'],
    });
    const finished = await createCompetition({
      name: 'B',
      competitorNames: ['X'],
      disciplineNames: ['Y'],
    });
    await finishCompetition(finished.id, 'highest');

    const inProgressList = await listInProgress();
    const pendingList = await listPendingSync();
    expect(inProgressList.map((c) => c.id)).toEqual([inProgress.id]);
    expect(pendingList.map((c) => c.id)).toEqual([finished.id]);
  });

  it('tracks sync failure and success transitions', async () => {
    const competition = await createCompetition({
      name: 'A',
      competitorNames: ['X'],
      disciplineNames: ['Y'],
    });
    await finishCompetition(competition.id, 'highest');

    await markSyncFailed(competition.id, 'network error');
    let updated = await db.competitions.get(competition.id);
    expect(updated?.status).toBe('pending_sync');
    expect(updated?.syncError).toBe('network error');
    expect(updated?.syncAttempts).toBe(1);

    await markSynced(competition.id);
    updated = await db.competitions.get(competition.id);
    expect(updated?.status).toBe('synced');
    expect(updated?.syncError).toBeNull();
  });
});
