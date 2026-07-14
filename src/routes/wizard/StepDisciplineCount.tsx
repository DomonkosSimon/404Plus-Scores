import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { NumberStepperField } from '../../components/wizard/NumberStepperField';
import { MAX_DISCIPLINES, MIN_DISCIPLINES } from '../../domain/validation';
import { wizardPaths } from './paths';

export function StepDisciplineCount() {
  const { t } = useTranslation();
  const { disciplineCount } = useWizardState();
  const dispatch = useWizardDispatch();
  const navigate = useNavigate();

  function handleNext() {
    if (disciplineCount === null) {
      dispatch({ type: 'SET_DISCIPLINE_COUNT', count: MIN_DISCIPLINES });
    }
    dispatch({ type: 'NEXT' });
    navigate(wizardPaths[4]);
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
    navigate(wizardPaths[2]);
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
