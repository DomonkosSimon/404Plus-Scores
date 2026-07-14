import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { NumberStepperField } from '../../components/wizard/NumberStepperField';
import { MAX_DISCIPLINES, MIN_DISCIPLINES } from '../../domain/validation';

export function StepDisciplineCount() {
  const { t } = useTranslation();
  const { disciplineCount } = useWizardState();
  const dispatch = useWizardDispatch();

  function handleNext() {
    if (disciplineCount === null) {
      dispatch({ type: 'SET_DISCIPLINE_COUNT', count: MIN_DISCIPLINES });
    }
    dispatch({ type: 'NEXT' });
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('wizard.disciplineCount.title')}</Typography>
      <Typography color="text.secondary">{t('wizard.disciplineCount.label')}</Typography>
      <NumberStepperField
        value={disciplineCount}
        min={MIN_DISCIPLINES}
        max={MAX_DISCIPLINES}
        label={t('common.discipline')}
        onChange={(count) => dispatch({ type: 'SET_DISCIPLINE_COUNT', count })}
      />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" size="large" onClick={handleBack}>
          {t('wizard.back')}
        </Button>
        <Button variant="contained" size="large" onClick={handleNext} sx={{ flex: 1 }}>
          {t('wizard.next')}
        </Button>
      </Stack>
    </Stack>
  );
}
