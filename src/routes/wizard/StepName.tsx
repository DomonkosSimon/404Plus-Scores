import { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { isValidName } from '../../domain/validation';
import { wizardPaths } from './paths';

export function StepName() {
  const { t } = useTranslation();
  const { name } = useWizardState();
  const dispatch = useWizardDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState(name);

  const canProceed = isValidName(value);

  function handleNext() {
    dispatch({ type: 'SET_NAME', name: value.trim() });
    dispatch({ type: 'NEXT' });
    navigate(wizardPaths[1]);
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('wizard.name.title')}</Typography>
      <TextField
        label={t('wizard.name.label')}
        placeholder={t('wizard.name.placeholder')}
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && canProceed) handleNext();
        }}
      />
      <Button variant="contained" size="large" disabled={!canProceed} onClick={handleNext}>
        {t('wizard.next')}
      </Button>
    </Stack>
  );
}
