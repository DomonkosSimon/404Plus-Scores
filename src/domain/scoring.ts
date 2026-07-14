import type { Competition, ID, RankingEntry, ScoreEntry, WinDirection } from './types';

/** Missing scores are treated as 0 so an unscored discipline never blocks a total. */
export function computeTotal(
  scores: ScoreEntry[],
  competitorId: ID,
  disciplineIds: ID[],
): number {
  return disciplineIds.reduce((sum, disciplineId) => {
    const entry = scores.find(
      (s) => s.competitorId === competitorId && s.disciplineId === disciplineId,
    );
    return sum + (entry?.value ?? 0);
  }, 0);
}

export function scoresByDisciplineFor(
  scores: ScoreEntry[],
  competitorId: ID,
  disciplineIds: ID[],
): Record<ID, number | null> {
  const result: Record<ID, number | null> = {};
  for (const disciplineId of disciplineIds) {
    const entry = scores.find(
      (s) => s.competitorId === competitorId && s.disciplineId === disciplineId,
    );
    result[disciplineId] = entry?.value ?? null;
  }
  return result;
}

/**
 * Ranks competitors by total score. Ties share a place; the next distinct
 * place skips ahead by the number of tied competitors (dense-with-gaps,
 * e.g. 1, 2, 2, 4).
 */
export function rankCompetitors(
  competition: Pick<Competition, 'competitors' | 'disciplines' | 'scores'>,
  direction: WinDirection,
): RankingEntry[] {
  const disciplineIds = competition.disciplines.map((d) => d.id);

  const totals = competition.competitors.map((competitor) => ({
    competitorId: competitor.id,
    total: computeTotal(competition.scores, competitor.id, disciplineIds),
    scoresByDiscipline: scoresByDisciplineFor(competition.scores, competitor.id, disciplineIds),
  }));

  const sorted = [...totals].sort((a, b) =>
    direction === 'highest' ? b.total - a.total : a.total - b.total,
  );

  const ranking: RankingEntry[] = [];
  let place = 0;
  let previousTotal: number | null = null;

  sorted.forEach((entry, index) => {
    if (previousTotal === null || entry.total !== previousTotal) {
      place = index + 1;
      previousTotal = entry.total;
    }
    ranking.push({
      competitorId: entry.competitorId,
      total: entry.total,
      place,
      scoresByDiscipline: entry.scoresByDiscipline,
    });
  });

  return ranking;
}
