import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { NumberStepperField } from '../../components/wizard/NumberStepperField';
import { MAX_COMPETITORS, MIN_COMPETITORS } from '../../domain/validation';
import { wizardPaths } from './paths';

export function StepCompetitorCount() {
  const { t } = useTranslation();
  const { competitorCount } = useWizardState();
  const dispatch = useWizardDispatch();
  const navigate = useNavigate();

  function handleNext() {
    if (competitorCount === null) {
      dispatch({ type: 'SET_COMPETITOR_COUNT', count: MIN_COMPETITORS });
    }
    dispatch({ type: 'NEXT' });
    navigate(wizardPaths[2]);
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
    navigate(wizardPaths[0]);
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
