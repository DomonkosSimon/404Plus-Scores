import { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WizardProvider, useWizardState } from '../../state/wizard/wizardContext';
import { WizardStepper } from '../../components/wizard/WizardStepper';
import { ModalHeader } from '../../components/common/ModalHeader';
import { ScoringPanel } from '../../components/scoring/ScoringPanel';
import { ResultsPanel } from '../../components/results/ResultsPanel';
import { glassDialogPaperSx, scoringDialogPaperSx } from '../../theme/glass';
import { StepName } from './StepName';
import { StepCompetitorCount } from './StepCompetitorCount';
import { StepCompetitorNames } from './StepCompetitorNames';
import { StepDisciplineCount } from './StepDisciplineCount';
import { StepDisciplineNames } from './StepDisciplineNames';

interface WizardModalProps {
  open: boolean;
  onClose: () => void;
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

export function WizardModal({ open, onClose }: WizardModalProps) {
  const [createdCompetitionId, setCreatedCompetitionId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  function handleClose() {
    setCreatedCompetitionId(null);
    setFinished(false);
    onClose();
  }

  const isScoring = createdCompetitionId !== null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={!isScoring}
      maxWidth={isScoring ? false : 'sm'}
      slotProps={{ paper: { sx: isScoring ? scoringDialogPaperSx : glassDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {open &&
          (createdCompetitionId ? (
            finished ? (
              <ResultsPanel competitionId={createdCompetitionId} onClose={handleClose} />
            ) : (
              <ScoringPanel
                competitionId={createdCompetitionId}
                onClose={handleClose}
                onFinished={() => setFinished(true)}
              />
            )
          ) : (
            <WizardProvider>
              <WizardModalInner onClose={handleClose} onCreated={setCreatedCompetitionId} />
            </WizardProvider>
          ))}
      </DialogContent>
    </Dialog>
  );
}
