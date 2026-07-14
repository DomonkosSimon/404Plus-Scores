import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color={destructive ? 'error' : 'primary'} variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
