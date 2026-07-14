import { Box, Container, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WizardProvider, useWizardState } from '../../state/wizard/wizardContext';
import { WizardStepper } from '../../components/wizard/WizardStepper';

function WizardLayoutInner() {
  const { t } = useTranslation();
  const { step } = useWizardState();
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton
          aria-label={t('common.cancel')}
          onClick={() => navigate('/', { replace: true })}
        >
          <Close />
        </IconButton>
      </Box>
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
