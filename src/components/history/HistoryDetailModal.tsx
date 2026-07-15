import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { ContentCopy, DeleteOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { FirestoreCompetitionDoc } from '../../domain/types';
import { RankingTable } from '../results/RankingTable';
import { glassDialogPaperSx } from '../../theme/glass';
import { ModalHeader } from '../common/ModalHeader';

interface HistoryDetailModalProps {
  doc: FirestoreCompetitionDoc | null;
  onClose: () => void;
  onDuplicate: (doc: FirestoreCompetitionDoc) => void;
  onDeleteRequest: (doc: FirestoreCompetitionDoc) => void;
}

export function HistoryDetailModal({
  doc,
  onClose,
  onDuplicate,
  onDeleteRequest,
}: HistoryDetailModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={doc !== null}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: glassDialogPaperSx } }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {doc && (
          <Stack spacing={2}>
            <ModalHeader title={doc.name} onClose={onClose} closeLabel={t('common.cancel')} />
            <Typography variant="body2" color="text.secondary">
              {t('history.detail.finishedAt')}: {new Date(doc.finishedAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('history.detail.winDirectionUsed')}:{' '}
              {t(`settings.winDirection.${doc.winDirection}`)}
            </Typography>
            <RankingTable competition={{ competitors: doc.competitors, ranking: doc.ranking }} />
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                sx={{ flex: 1 }}
                onClick={() => onDuplicate(doc)}
              >
                {t('history.duplicate')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlined />}
                sx={{ flex: 1 }}
                onClick={() => onDeleteRequest(doc)}
              >
                {t('history.delete')}
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
