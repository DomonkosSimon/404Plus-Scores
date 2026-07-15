import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useActiveCompetitionStore } from '../../state/activeCompetition/useActiveCompetitionStore';
import { useOnlineStatus } from '../../sync/connectivity';
import { ModalHeader } from '../common/ModalHeader';
import { RankingTable } from './RankingTable';
import { OfflineSyncDialog } from './OfflineSyncDialog';

interface ResultsPanelProps {
  competitionId: string;
  onClose: () => void;
}

export function ResultsPanel({ competitionId, onClose }: ResultsPanelProps) {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const competition = useActiveCompetitionStore((s) => s.competition);
  const loadCompetition = useActiveCompetitionStore((s) => s.loadCompetition);
  const retrySyncCurrent = useActiveCompetitionStore((s) => s.retrySyncCurrent);
  const discardCurrent = useActiveCompetitionStore((s) => s.discardCurrent);
  const [dialogDismissed, setDialogDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    void loadCompetition(competitionId);
  }, [competitionId, loadCompetition]);

  if (!competition || competition.id !== competitionId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const showOfflineDialog = competition.status === 'pending_sync' && !online && !dialogDismissed;

  async function handleDiscard() {
    await discardCurrent();
    onClose();
  }

  async function handleRetry() {
    setRetrying(true);
    await retrySyncCurrent();
    setRetrying(false);
  }

  return (
    <Stack spacing={2}>
      <ModalHeader title={competition.name} onClose={onClose} closeLabel={t('common.cancel')} />
      <Typography variant="h6" color="text.secondary">
        {t('results.title')}
      </Typography>
      <RankingTable competition={competition} />

      {competition.status === 'pending_sync' && online && (
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              disabled={retrying}
              onClick={() => void handleRetry()}
            >
              {retrying ? t('history.retrying') : t('history.retry')}
            </Button>
          }
        >
          {t('results.pendingNotice')}
        </Alert>
      )}

      <Button variant="contained" size="large" onClick={onClose}>
        {t('results.backHome')}
      </Button>

      <OfflineSyncDialog
        open={showOfflineDialog}
        onTryAgain={() => void handleRetry()}
        onSaveForLater={() => setDialogDismissed(true)}
        onDiscard={() => void handleDiscard()}
      />

      <Snackbar
        open={competition.status === 'synced'}
        autoHideDuration={4000}
        message={t('results.syncedNotice')}
      />
    </Stack>
  );
}
