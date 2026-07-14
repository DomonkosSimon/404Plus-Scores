import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { NumberStepperField } from '../../components/wizard/NumberStepperField';
import { MAX_COMPETITORS, MIN_COMPETITORS } from '../../domain/validation';

export function StepCompetitorCount() {
  const { t } = useTranslation();
  const { competitorCount } = useWizardState();
  const dispatch = useWizardDispatch();

  function handleNext() {
    if (competitorCount === null) {
      dispatch({ type: 'SET_COMPETITOR_COUNT', count: MIN_COMPETITORS });
    }
    dispatch({ type: 'NEXT' });
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('wizard.competitorCount.title')}</Typography>
      <Typography color="text.secondary">{t('wizard.competitorCount.label')}</Typography>
      <NumberStepperField
        value={competitorCount}
        min={MIN_COMPETITORS}
        max={MAX_COMPETITORS}
        label={t('common.competitor')}
        onChange={(count) => dispatch({ type: 'SET_COMPETITOR_COUNT', count })}
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
