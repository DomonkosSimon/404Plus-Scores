import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { glassDialogPaperSx } from '../../theme/glass';
import { ScoringPanel } from './ScoringPanel';

interface ScoringModalProps {
  competitionId: string | null;
  onClose: () => void;
  onFinished: (competitionId: string) => void;
}

export function ScoringModal({ competitionId, onClose, onFinished }: ScoringModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={competitionId !== null}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: glassDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {competitionId && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton aria-label={t('common.cancel')} onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            <ScoringPanel competitionId={competitionId} onFinished={onFinished} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
