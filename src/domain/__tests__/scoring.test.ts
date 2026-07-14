import { describe, expect, it } from 'vitest';
import { computeTotal, rankCompetitors } from '../scoring';
import type { Competitor, Discipline, ScoreEntry } from '../types';

function makeCompetitors(names: string[]): Competitor[] {
  return names.map((name, i) => ({ id: `c${i}`, name, order: i }));
}

function makeDisciplines(names: string[]): Discipline[] {
  return names.map((name, i) => ({ id: `d${i}`, name, order: i }));
}

function score(competitorId: string, disciplineId: string, value: number | null): ScoreEntry {
  return { competitorId, disciplineId, value, updatedAt: new Date().toISOString() };
}

describe('computeTotal', () => {
  it('sums scores across disciplines', () => {
    const scores = [score('c0', 'd0', 10), score('c0', 'd1', 5)];
    expect(computeTotal(scores, 'c0', ['d0', 'd1'])).toBe(15);
  });

  it('treats missing scores as 0', () => {
    const scores = [score('c0', 'd0', 10)];
    expect(computeTotal(scores, 'c0', ['d0', 'd1'])).toBe(10);
  });

  it('treats null scores as 0', () => {
    const scores = [score('c0', 'd0', null)];
    expect(computeTotal(scores, 'c0', ['d0'])).toBe(0);
  });

  it('sums floating point values without drift beyond precision', () => {
    const scores = [score('c0', 'd0', 0.1), score('c0', 'd1', 0.2)];
    expect(computeTotal(scores, 'c0', ['d0', 'd1'])).toBeCloseTo(0.3, 10);
  });

  it('returns 0 for a competitor with no disciplines', () => {
    expect(computeTotal([], 'c0', [])).toBe(0);
  });
});

describe('rankCompetitors', () => {
  it('ranks a single competitor as place 1', () => {
    const competitors = makeCompetitors(['A']);
    const disciplines = makeDisciplines(['D1']);
    const scores = [score('c0', 'd0', 42)];
    const ranking = rankCompetitors({ competitors, disciplines, scores }, 'highest');
    expect(ranking).toEqual([
      { competitorId: 'c0', total: 42, place: 1, scoresByDiscipline: { d0: 42 } },
    ]);
  });

  it('sorts descending for highest-wins', () => {
    const competitors = makeCompetitors(['A', 'B', 'C']);
    const disciplines = makeDisciplines(['D1']);
    const scores = [score('c0', 'd0', 10), score('c1', 'd0', 30), score('c2', 'd0', 20)];
    const ranking = rankCompetitors({ competitors, disciplines, scores }, 'highest');
    expect(ranking.map((r) => r.competitorId)).toEqual(['c1', 'c2', 'c0']);
    expect(ranking.map((r) => r.place)).toEqual([1, 2, 3]);
  });

  it('sorts ascending for lowest-wins', () => {
    const competitors = makeCompetitors(['A', 'B', 'C']);
    const disciplines = makeDisciplines(['D1']);
    const scores = [score('c0', 'd0', 10), score('c1', 'd0', 30), score('c2', 'd0', 20)];
    const ranking = rankCompetitors({ competitors, disciplines, scores }, 'lowest');
    expect(ranking.map((r) => r.competitorId)).toEqual(['c0', 'c2', 'c1']);
    expect(ranking.map((r) => r.place)).toEqual([1, 2, 3]);
  });

  it('gives tied competitors the same place and skips the next place (1,2,2,4)', () => {
    const competitors = makeCompetitors(['A', 'B', 'C', 'D']);
    const disciplines = makeDisciplines(['D1']);
    const scores = [
      score('c0', 'd0', 30),
      score('c1', 'd0', 20),
      score('c2', 'd0', 20),
      score('c3', 'd0', 10),
    ];
    const ranking = rankCompetitors({ competitors, disciplines, scores }, 'highest');
    const places = ranking.map((r) => r.place);
    expect(places).toEqual([1, 2, 2, 4]);
  });

  it('handles all-equal totals as a full tie', () => {
    const competitors = makeCompetitors(['A', 'B', 'C']);
    const disciplines = makeDisciplines(['D1']);
    const scores = [score('c0', 'd0', 5), score('c1', 'd0', 5), score('c2', 'd0', 5)];
    const ranking = rankCompetitors({ competitors, disciplines, scores }, 'highest');
    expect(ranking.every((r) => r.place === 1)).toBe(true);
  });

  it('treats unset scores as 0 when ranking', () => {
    const competitors = makeCompetitors(['A', 'B']);
    const disciplines = makeDisciplines(['D1', 'D2']);
    const scores = [score('c0', 'd0', 5)]; // c0 missing d1, c1 has nothing
    const ranking = rankCompetitors({ competitors, disciplines, scores }, 'highest');
    const byId = Object.fromEntries(ranking.map((r) => [r.competitorId, r]));
    expect(byId.c0.total).toBe(5);
    expect(byId.c1.total).toBe(0);
    expect(byId.c0.place).toBe(1);
    expect(byId.c1.place).toBe(2);
  });

  it('returns an empty ranking for zero competitors', () => {
    expect(rankCompetitors({ competitors: [], disciplines: [], scores: [] }, 'highest')).toEqual(
      [],
    );
  });
});
