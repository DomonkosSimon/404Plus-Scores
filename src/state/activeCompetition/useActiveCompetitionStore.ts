import { create } from 'zustand';
import type { Competition, ID, ScoreValue, WinDirection } from '../../domain/types';
import * as repo from '../../storage/competitionsRepo';
import { trySync } from '../../sync/syncService';

export type FinishOutcome = 'synced' | 'pending_sync' | 'offline_prompt';

interface ActiveCompetitionState {
  competition: Competition | null;
  loadCompetition: (id: ID) => Promise<void>;
  updateScore: (competitorId: ID, disciplineId: ID, value: ScoreValue) => Promise<void>;
  reorderCompetitors: (newOrderIds: ID[]) => Promise<void>;
  finishCompetition: (
    winDirection: WinDirection,
  ) => Promise<{ outcome: FinishOutcome; competition: Competition }>;
  retrySyncCurrent: () => Promise<'synced' | 'failed'>;
  discardCurrent: () => Promise<void>;
}

export const useActiveCompetitionStore = create<ActiveCompetitionState>((set, get) => ({
  competition: null,

  async loadCompetition(id) {
    const competition = (await repo.getCompetition(id)) ?? null;
    set({ competition });
  },

  async updateScore(competitorId, disciplineId, value) {
    const current = get().competition;
    if (!current) return;
    const updated = await repo.setScore(current.id, competitorId, disciplineId, value);
    set({ competition: updated });
  },

  async reorderCompetitors(newOrderIds) {
    const current = get().competition;
    if (!current) return;
    await repo.reorderCompetitors(current.id, newOrderIds);
    const updated = await repo.getCompetition(current.id);
    if (updated) set({ competition: updated });
  },

  async finishCompetition(winDirection) {
    const current = get().competition;
    if (!current) throw new Error('No active competition to finish');

    const finished = await repo.finishCompetition(current.id, winDirection);
    set({ competition: finished });

    if (!navigator.onLine) {
      return { outcome: 'offline_prompt', competition: finished };
    }

    const result = await trySync(finished);
    const updated = (await repo.getCompetition(finished.id)) ?? finished;
    set({ competition: updated });
    return { outcome: result === 'synced' ? 'synced' : 'pending_sync', competition: updated };
  },

  async retrySyncCurrent() {
    const current = get().competition;
    if (!current) return 'failed';
    const result = await trySync(current);
    const updated = await repo.getCompetition(current.id);
    if (updated) set({ competition: updated });
    return result;
  },

  async discardCurrent() {
    const current = get().competition;
    if (!current) return;
    await repo.deleteCompetition(current.id);
    set({ competition: null });
  },
}));
