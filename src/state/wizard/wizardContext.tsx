import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { wizardReducer } from './wizardReducer';
import { initialWizardState, type WizardAction, type WizardState } from './wizardTypes';

const WizardStateContext = createContext<WizardState | null>(null);
const WizardDispatchContext = createContext<Dispatch<WizardAction> | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  return (
    <WizardStateContext.Provider value={state}>
      <WizardDispatchContext.Provider value={dispatch}>{children}</WizardDispatchContext.Provider>
    </WizardStateContext.Provider>
  );
}

export function useWizardState(): WizardState {
  const context = useContext(WizardStateContext);
  if (!context) throw new Error('useWizardState must be used within a WizardProvider');
  return context;
}

export function useWizardDispatch(): Dispatch<WizardAction> {
  const context = useContext(WizardDispatchContext);
  if (!context) throw new Error('useWizardDispatch must be used within a WizardProvider');
  return context;
}
