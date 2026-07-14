import { WIZARD_STEP_COUNT, type WizardAction, type WizardState } from './wizardTypes';

function resizeNames(names: string[], count: number): string[] {
  const resized = names.slice(0, count);
  while (resized.length < count) resized.push('');
  return resized;
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name };
    case 'SET_COMPETITOR_COUNT':
      return {
        ...state,
        competitorCount: action.count,
        competitorNames: resizeNames(state.competitorNames, action.count),
      };
    case 'SET_COMPETITOR_NAME': {
      const competitorNames = [...state.competitorNames];
      competitorNames[action.index] = action.name;
      return { ...state, competitorNames };
    }
    case 'SET_DISCIPLINE_COUNT':
      return {
        ...state,
        disciplineCount: action.count,
        disciplineNames: resizeNames(state.disciplineNames, action.count),
      };
    case 'SET_DISCIPLINE_NAME': {
      const disciplineNames = [...state.disciplineNames];
      disciplineNames[action.index] = action.name;
      return { ...state, disciplineNames };
    }
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, WIZARD_STEP_COUNT - 1) };
    case 'BACK':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'RESET':
      return {
        step: 0,
        name: '',
        competitorCount: null,
        competitorNames: [],
        disciplineCount: null,
        disciplineNames: [],
      };
    default:
      return state;
  }
}
