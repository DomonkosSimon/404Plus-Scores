import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Competition, FirestoreCompetitionDoc } from '../../domain/types';
import { listPendingSync } from '../../storage/competitionsRepo';
import { subscribeToHistory, trySync } from '../../sync/syncService';
import { useOnlineStatus } from '../../sync/connectivity';

export function HistoryListScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [pending, setPending] = useState<Competition[]>([]);
  const [synced, setSynced] = useState<FirestoreCompetitionDoc[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    void listPendingSync().then(setPending);
  }, []);

  useEffect(() => {
    return subscribeToHistory((docs) => {
      setSynced(docs);
      // A synced doc arriving means a background retry likely just completed;
      // refresh the pending list so an item doesn't linger in both sections.
      void listPendingSync().then(setPending);
    });
  }, []);

  async function handleRetry(competition: Competition) {
    setRetryingId(competition.id);
    await trySync(competition);
    setPending(await listPendingSync());
    setRetryingId(null);
  }

  const isEmpty = pending.length === 0 && synced.length === 0;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('history.title')}
      </Typography>

      {isEmpty && <Typography color="text.secondary">{t('history.empty')}</Typography>}

      {pending.length > 0 && (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">
            {t('history.pendingSync')}
          </Typography>
          {pending.map((competition) => (
            <Card key={competition.id} variant="outlined">
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}
              >
                <Typography>{competition.name}</Typography>
                <Button
                  size="small"
                  disabled={!online || retryingId === competition.id}
                  onClick={() => void handleRetry(competition)}
                >
                  {retryingId === competition.id ? t('history.retrying') : t('history.retry')}
                </Button>
              </Stack>
            </Card>
          ))}
          {!online && <Alert severity="info">{t('results.offlineDialog.body')}</Alert>}
        </Stack>
      )}

      {pending.length > 0 && synced.length > 0 && <Divider sx={{ mb: 3 }} />}

      {synced.length > 0 && (
        <Stack spacing={1.5}>
          <Typography variant="overline" color="text.secondary">
            {t('history.synced')}
          </Typography>
          {synced.map((doc) => (
            <Card key={doc.id} variant="outlined">
              <CardActionArea sx={{ p: 2 }} onClick={() => navigate(`/history/${doc.id}`, { state: { doc } })}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>{doc.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(doc.finishedAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
