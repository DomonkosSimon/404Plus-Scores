import { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WizardProvider, useWizardState } from '../../state/wizard/wizardContext';
import { WizardStepper } from '../../components/wizard/WizardStepper';
import { ModalHeader } from '../../components/common/ModalHeader';
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

const STEP_TITLE_KEYS = [
  'wizard.name.title',
  'wizard.competitorCount.title',
  'wizard.competitorNames.title',
  'wizard.disciplineCount.title',
  'wizard.disciplineNames.title',
] as const;

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
      <ModalHeader
        title={t(STEP_TITLE_KEYS[step])}
        onClose={onClose}
        closeLabel={t('common.cancel')}
      />
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
            <ScoringPanel
              competitionId={createdCompetitionId}
              onClose={handleClose}
              onFinished={(id) => {
                setCreatedCompetitionId(null);
                onFinished(id);
              }}
            />
          ) : (
            <WizardProvider>
              <WizardModalInner onClose={handleClose} onCreated={setCreatedCompetitionId} />
            </WizardProvider>
          ))}
      </DialogContent>
    </Dialog>
  );
}
