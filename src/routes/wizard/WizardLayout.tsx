import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { WizardProvider, useWizardState } from '../../state/wizard/wizardContext';
import { WizardStepper } from '../../components/wizard/WizardStepper';

function WizardLayoutInner() {
  const { step } = useWizardState();
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <WizardStepper step={step} />
      <Outlet />
    </Container>
  );
}

export function WizardLayout() {
  return (
    <WizardProvider>
      <WizardLayoutInner />
    </WizardProvider>
  );
}
