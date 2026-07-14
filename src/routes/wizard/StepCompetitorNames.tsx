import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { DynamicNameList } from '../../components/wizard/DynamicNameList';
import { isValidName } from '../../domain/validation';

export function StepCompetitorNames() {
  const { t } = useTranslation();
  const { competitorNames } = useWizardState();
  const dispatch = useWizardDispatch();

  const canProceed = competitorNames.length > 0 && competitorNames.every(isValidName);

  function handleNext() {
    dispatch({ type: 'NEXT' });
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('wizard.competitorNames.title')}</Typography>
      <DynamicNameList
        names={competitorNames}
        labelFor={(index) => t('wizard.competitorNames.label', { index: index + 1 })}
        placeholder={t('wizard.competitorNames.placeholder')}
        onChange={(index, name) => dispatch({ type: 'SET_COMPETITOR_NAME', index, name })}
      />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" size="large" onClick={handleBack}>
          {t('wizard.back')}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canProceed}
          onClick={handleNext}
          sx={{ flex: 1 }}
        >
          {t('wizard.next')}
        </Button>
      </Stack>
    </Stack>
  );
}
