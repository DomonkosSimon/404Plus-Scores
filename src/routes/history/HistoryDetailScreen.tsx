import { useEffect, useState } from 'react';
import { Container, Stack, Typography, CircularProgress } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FirestoreCompetitionDoc } from '../../domain/types';
import { fetchCompetitionDoc } from '../../sync/syncService';
import { RankingTable } from '../../components/results/RankingTable';

export function HistoryDetailScreen() {
  const { t } = useTranslation();
  const { competitionId } = useParams<{ competitionId: string }>();
  const location = useLocation();
  const preloaded = (location.state as { doc?: FirestoreCompetitionDoc } | null)?.doc;
  const [competitionDoc, setCompetitionDoc] = useState<FirestoreCompetitionDoc | null>(
    preloaded ?? null,
  );
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    if (preloaded || !competitionId) return;
    void fetchCompetitionDoc(competitionId).then((result) => {
      setCompetitionDoc(result);
      setLoading(false);
    });
  }, [competitionId, preloaded]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!competitionDoc) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography color="text.secondary">{t('history.empty')}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">{competitionDoc.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('history.detail.finishedAt')}: {new Date(competitionDoc.finishedAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('history.detail.winDirectionUsed')}:{' '}
          {t(`settings.winDirection.${competitionDoc.winDirection}`)}
        </Typography>
        <RankingTable
          competition={{ competitors: competitionDoc.competitors, ranking: competitionDoc.ranking }}
        />
      </Stack>
    </Container>
  );
}
