import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../sync/connectivity';

export function OfflineBanner() {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <Alert severity="info" sx={{ borderRadius: 0, justifyContent: 'center' }}>
      {t('results.offlineDialog.title')}
    </Alert>
  );
}
