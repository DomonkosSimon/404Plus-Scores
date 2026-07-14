import { describe, expect, it } from 'vitest';
import { wizardReducer } from '../../state/wizard/wizardReducer';
import { initialWizardState } from '../../state/wizard/wizardTypes';

describe('wizardReducer', () => {
  it('sets the competition name', () => {
    const state = wizardReducer(initialWizardState, { type: 'SET_NAME', name: 'Spring Cup' });
    expect(state.name).toBe('Spring Cup');
  });

  it('grows competitorNames when count increases, preserving existing names', () => {
    let state = wizardReducer(initialWizardState, { type: 'SET_COMPETITOR_COUNT', count: 2 });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_NAME', index: 0, name: 'Alice' });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_NAME', index: 1, name: 'Bob' });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_COUNT', count: 3 });
    expect(state.competitorNames).toEqual(['Alice', 'Bob', '']);
  });

  it('shrinks competitorNames when count decreases, truncating from the end', () => {
    let state = wizardReducer(initialWizardState, { type: 'SET_COMPETITOR_COUNT', count: 3 });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_NAME', index: 0, name: 'Alice' });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_NAME', index: 1, name: 'Bob' });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_NAME', index: 2, name: 'Cara' });
    state = wizardReducer(state, { type: 'SET_COMPETITOR_COUNT', count: 1 });
    expect(state.competitorNames).toEqual(['Alice']);
  });

  it('navigates forward and backward, clamped to valid step range', () => {
    let state = initialWizardState;
    state = wizardReducer(state, { type: 'BACK' });
    expect(state.step).toBe(0);
    state = wizardReducer(state, { type: 'NEXT' });
    expect(state.step).toBe(1);
    for (let i = 0; i < 10; i++) state = wizardReducer(state, { type: 'NEXT' });
    expect(state.step).toBe(4); // WIZARD_STEP_COUNT - 1
  });

  it('resets to the initial state', () => {
    let state = wizardReducer(initialWizardState, { type: 'SET_NAME', name: 'X' });
    state = wizardReducer(state, { type: 'RESET' });
    expect(state).toEqual(initialWizardState);
  });

  it('resizes disciplineNames symmetrically to competitorNames', () => {
    let state = wizardReducer(initialWizardState, { type: 'SET_DISCIPLINE_COUNT', count: 2 });
    state = wizardReducer(state, { type: 'SET_DISCIPLINE_NAME', index: 0, name: 'Dressage' });
    state = wizardReducer(state, { type: 'SET_DISCIPLINE_COUNT', count: 1 });
    expect(state.disciplineNames).toEqual(['Dressage']);
  });
});
