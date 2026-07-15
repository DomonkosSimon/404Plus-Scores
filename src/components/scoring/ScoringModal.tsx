import { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { scoringDialogPaperSx } from '../../theme/glass';
import { ResultsPanel } from '../results/ResultsPanel';
import { ScoringPanel } from './ScoringPanel';

interface ScoringModalProps {
  competitionId: string | null;
  onClose: () => void;
}

export function ScoringModal({ competitionId, onClose }: ScoringModalProps) {
  const [finished, setFinished] = useState(false);

  function handleClose() {
    setFinished(false);
    onClose();
  }

  return (
    <Dialog
      open={competitionId !== null}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{ paper: { sx: scoringDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {competitionId &&
          (finished ? (
            <ResultsPanel competitionId={competitionId} onClose={handleClose} />
          ) : (
            <ScoringPanel
              competitionId={competitionId}
              onClose={handleClose}
              onFinished={() => setFinished(true)}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
}
