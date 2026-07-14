import { Box, LinearProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WIZARD_STEP_COUNT } from '../../state/wizard/wizardTypes';

export function WizardStepper({ step }: { step: number }) {
  const { t } = useTranslation();
  const progress = ((step + 1) / WIZARD_STEP_COUNT) * 100;
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {t('wizard.stepOf', { step: step + 1, total: WIZARD_STEP_COUNT })}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
    </Box>
  );
}
