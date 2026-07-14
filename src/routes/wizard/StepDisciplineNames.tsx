import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { DynamicNameList } from '../../components/wizard/DynamicNameList';
import { isValidName } from '../../domain/validation';
import { createCompetition } from '../../storage/competitionsRepo';

interface StepDisciplineNamesProps {
  onCreated: (competitionId: string) => void;
}

export function StepDisciplineNames({ onCreated }: StepDisciplineNamesProps) {
  const { t } = useTranslation();
  const { disciplineNames, name, competitorNames } = useWizardState();
  const dispatch = useWizardDispatch();
  const [submitting, setSubmitting] = useState(false);

  const canProceed = disciplineNames.length > 0 && disciplineNames.every(isValidName);

  async function handleCreate() {
    setSubmitting(true);
    const competition = await createCompetition({
      name,
      competitorNames,
      disciplineNames,
    });
    onCreated(competition.id);
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('wizard.disciplineNames.title')}</Typography>
      <DynamicNameList
        names={disciplineNames}
        labelFor={(index) => t('wizard.disciplineNames.label', { index: index + 1 })}
        placeholder={t('wizard.disciplineNames.placeholder')}
        onChange={(index, disciplineName) =>
          dispatch({ type: 'SET_DISCIPLINE_NAME', index, name: disciplineName })
        }
      />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" size="large" onClick={handleBack} disabled={submitting}>
          {t('wizard.back')}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canProceed || submitting}
          onClick={() => void handleCreate()}
          sx={{ flex: 1 }}
        >
          {t('wizard.create')}
        </Button>
      </Stack>
    </Stack>
  );
}
