export interface WizardState {
  step: number;
  name: string;
  competitorCount: number | null;
  competitorNames: string[];
  disciplineCount: number | null;
  disciplineNames: string[];
}

export type WizardAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_COMPETITOR_COUNT'; count: number }
  | { type: 'SET_COMPETITOR_NAME'; index: number; name: string }
  | { type: 'SET_DISCIPLINE_COUNT'; count: number }
  | { type: 'SET_DISCIPLINE_NAME'; index: number; name: string }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' };

export const initialWizardState: WizardState = {
  step: 0,
  name: '',
  competitorCount: null,
  competitorNames: [],
  disciplineCount: null,
  disciplineNames: [],
};

export const WIZARD_STEP_COUNT = 5;
