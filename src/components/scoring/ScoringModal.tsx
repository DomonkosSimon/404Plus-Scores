import { Dialog, DialogContent } from '@mui/material';
import { scoringDialogPaperSx } from '../../theme/glass';
import { ScoringPanel } from './ScoringPanel';

interface ScoringModalProps {
  competitionId: string | null;
  onClose: () => void;
  onFinished: (competitionId: string) => void;
}

export function ScoringModal({ competitionId, onClose, onFinished }: ScoringModalProps) {
  return (
    <Dialog
      open={competitionId !== null}
      onClose={onClose}
      maxWidth={false}
      slotProps={{ paper: { sx: scoringDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {competitionId && (
          <ScoringPanel competitionId={competitionId} onClose={onClose} onFinished={onFinished} />
        )}
      </DialogContent>
    </Dialog>
  );
}
