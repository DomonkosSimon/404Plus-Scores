export type ID = string;

export interface Competitor {
  id: ID;
  name: string;
  order: number;
}

export interface Discipline {
  id: ID;
  name: string;
  order: number;
}

export type ScoreValue = number | null;

export interface ScoreEntry {
  competitorId: ID;
  disciplineId: ID;
  value: ScoreValue;
  updatedAt: string;
}

export type WinDirection = 'highest' | 'lowest';

export type CompetitionStatus =
  | 'in_progress'
  | 'finished_local'
  | 'pending_sync'
  | 'synced';

export interface RankingEntry {
  competitorId: ID;
  total: number;
  place: number;
  scoresByDiscipline: Record<ID, number | null>;
}

export interface CompetitionSettingsSnapshot {
  winDirection: WinDirection;
}

export interface Competition {
  id: ID;
  name: string;
  competitors: Competitor[];
  disciplines: Discipline[];
  scores: ScoreEntry[];
  status: CompetitionStatus;
  createdAt: string;
  finishedAt: string | null;
  settingsSnapshot: CompetitionSettingsSnapshot | null;
  ranking: RankingEntry[] | null;
  syncError: string | null;
  syncAttempts: number;
}

export type Language = 'sk' | 'cs' | 'en' | 'de';

export interface AppSettings {
  winDirection: WinDirection;
  language: Language;
}

export interface FirestoreCompetitionDoc {
  id: string;
  name: string;
  competitors: Competitor[];
  disciplines: Discipline[];
  scores: { competitorId: ID; disciplineId: ID; value: number | null }[];
  ranking: RankingEntry[];
  winDirection: WinDirection;
  createdAt: string;
  finishedAt: string;
  schemaVersion: number;
}
