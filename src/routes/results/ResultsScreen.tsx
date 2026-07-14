import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActiveCompetitionStore } from '../../state/activeCompetition/useActiveCompetitionStore';
import { useOnlineStatus } from '../../sync/connectivity';
import { RankingTable } from '../../components/results/RankingTable';
import { OfflineSyncDialog } from '../../components/results/OfflineSyncDialog';

export function ResultsScreen() {
  const { t } = useTranslation();
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const competition = useActiveCompetitionStore((s) => s.competition);
  const loadCompetition = useActiveCompetitionStore((s) => s.loadCompetition);
  const retrySyncCurrent = useActiveCompetitionStore((s) => s.retrySyncCurrent);
  const discardCurrent = useActiveCompetitionStore((s) => s.discardCurrent);
  const [dialogDismissed, setDialogDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (competitionId) void loadCompetition(competitionId);
  }, [competitionId, loadCompetition]);

  if (!competition || competition.id !== competitionId) {
    return (
      <Container maxWidth="md" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const showOfflineDialog = competition.status === 'pending_sync' && !online && !dialogDismissed;

  async function handleDiscard() {
    await discardCurrent();
    navigate('/', { replace: true });
  }

  async function handleRetry() {
    setRetrying(true);
    await retrySyncCurrent();
    setRetrying(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5">{competition.name}</Typography>
          <Typography variant="h6" color="text.secondary">
            {t('results.title')}
          </Typography>
        </Box>
        <RankingTable competition={competition} />

        {competition.status === 'pending_sync' && online && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" disabled={retrying} onClick={() => void handleRetry()}>
                {retrying ? t('history.retrying') : t('history.retry')}
              </Button>
            }
          >
            {t('results.pendingNotice')}
          </Alert>
        )}

        <Button variant="contained" size="large" onClick={() => navigate('/', { replace: true })}>
          {t('results.backHome')}
        </Button>
      </Stack>

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
    </Container>
  );
}
