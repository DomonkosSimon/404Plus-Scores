import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <Stack
      spacing={0.25}
      sx={{ alignItems: 'center', px: 2, py: 1.5, textAlign: 'center' }}
    >
      <Typography variant="caption" color="text.secondary">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('footer.vibeCoded')}
      </Typography>
    </Stack>
  );
}
