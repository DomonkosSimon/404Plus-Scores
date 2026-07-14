import { Button, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function UpdatePrompt() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      // registerType:'prompt' means a waiting worker never activates on its
      // own — without an explicit periodic check, long-lived sessions would
      // never even notice a new deploy exists.
      setInterval(() => void registration.update(), UPDATE_CHECK_INTERVAL_MS);
    },
  });

  return (
    <Snackbar
      open={needRefresh}
      message={t('app.updateAvailable')}
      action={
        <Button color="inherit" size="small" onClick={() => void updateServiceWorker(true)}>
          {t('app.reload')}
        </Button>
      }
    />
  );
}
