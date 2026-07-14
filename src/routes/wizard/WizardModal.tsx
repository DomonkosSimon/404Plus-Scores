import { Box, Dialog, DialogContent, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { WizardProvider, useWizardState } from '../../state/wizard/wizardContext';
import { WizardStepper } from '../../components/wizard/WizardStepper';
import { glassDialogPaperSx } from '../../theme/glass';
import { StepName } from './StepName';
import { StepCompetitorCount } from './StepCompetitorCount';
import { StepCompetitorNames } from './StepCompetitorNames';
import { StepDisciplineCount } from './StepDisciplineCount';
import { StepDisciplineNames } from './StepDisciplineNames';

interface WizardModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (competitionId: string) => void;
}

function WizardModalInner({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (competitionId: string) => void;
}) {
  const { t } = useTranslation();
  const { step } = useWizardState();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton aria-label={t('common.cancel')} onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <WizardStepper step={step} />
      {step === 0 && <StepName />}
      {step === 1 && <StepCompetitorCount />}
      {step === 2 && <StepCompetitorNames />}
      {step === 3 && <StepDisciplineCount />}
      {step === 4 && <StepDisciplineNames onCreated={onCreated} />}
    </>
  );
}

export function WizardModal({ open, onClose, onCreated }: WizardModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      slotProps={{ paper: { sx: glassDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {open && (
          <WizardProvider>
            <WizardModalInner onClose={onClose} onCreated={onCreated} />
          </WizardProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
