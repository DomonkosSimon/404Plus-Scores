import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface OfflineSyncDialogProps {
  open: boolean;
  onTryAgain: () => void;
  onSaveForLater: () => void;
  onDiscard: () => void;
}

export function OfflineSyncDialog({
  open,
  onTryAgain,
  onSaveForLater,
  onDiscard,
}: OfflineSyncDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{t('results.offlineDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('results.offlineDialog.body')}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
        <Button variant="contained" onClick={onSaveForLater}>
          {t('results.offlineDialog.saveForLater')}
        </Button>
        <Button variant="outlined" onClick={onTryAgain}>
          {t('results.offlineDialog.tryAgain')}
        </Button>
        <Button color="error" onClick={onDiscard}>
          {t('results.offlineDialog.discard')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
