import { useState } from 'react';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { WizardProvider, useWizardState } from '../../state/wizard/wizardContext';
import { WizardStepper } from '../../components/wizard/WizardStepper';
import { ScoringPanel } from '../../components/scoring/ScoringPanel';
import { glassDialogPaperSx } from '../../theme/glass';
import { StepName } from './StepName';
import { StepCompetitorCount } from './StepCompetitorCount';
import { StepCompetitorNames } from './StepCompetitorNames';
import { StepDisciplineCount } from './StepDisciplineCount';
import { StepDisciplineNames } from './StepDisciplineNames';

interface WizardModalProps {
  open: boolean;
  onClose: () => void;
  onFinished: (competitionId: string) => void;
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

export function WizardModal({ open, onClose, onFinished }: WizardModalProps) {
  const { t } = useTranslation();
  const [createdCompetitionId, setCreatedCompetitionId] = useState<string | null>(null);

  function handleClose() {
    setCreatedCompetitionId(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: glassDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {open &&
          (createdCompetitionId ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton aria-label={t('common.cancel')} onClick={handleClose}>
                  <Close />
                </IconButton>
              </Box>
              <ScoringPanel
                competitionId={createdCompetitionId}
                onFinished={(id) => {
                  setCreatedCompetitionId(null);
                  onFinished(id);
                }}
              />
            </>
          ) : (
            <WizardProvider>
              <WizardModalInner onClose={handleClose} onCreated={setCreatedCompetitionId} />
            </WizardProvider>
          ))}
      </DialogContent>
    </Dialog>
  );
}
