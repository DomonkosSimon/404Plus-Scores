import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ContentCopy, DeleteOutlined } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FirestoreCompetitionDoc } from '../../domain/types';
import { deleteSyncedCompetition, fetchCompetitionDoc } from '../../sync/syncService';
import { createCompetition } from '../../storage/competitionsRepo';
import { RankingTable } from '../../components/results/RankingTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DuplicateCompetitionDialog } from '../../components/history/DuplicateCompetitionDialog';

export function HistoryDetailScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { competitionId } = useParams<{ competitionId: string }>();
  const location = useLocation();
  const preloaded = (location.state as { doc?: FirestoreCompetitionDoc } | null)?.doc;
  const [competitionDoc, setCompetitionDoc] = useState<FirestoreCompetitionDoc | null>(
    preloaded ?? null,
  );
  const [loading, setLoading] = useState(!preloaded);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (preloaded || !competitionId) return;
    void fetchCompetitionDoc(competitionId).then((result) => {
      setCompetitionDoc(result);
      setLoading(false);
    });
  }, [competitionId, preloaded]);

  async function handleDelete() {
    if (!competitionDoc) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteSyncedCompetition(competitionDoc.id);
      navigate('/', { replace: true });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : String(error));
      setDeleting(false);
    }
  }

  async function handleDuplicateSubmit(result: {
    name: string;
    competitorNames: string[];
    disciplineNames: string[];
  }) {
    const competition = await createCompetition(result);
    setShowDuplicate(false);
    navigate(`/competition/${competition.id}/scoring`);
  }

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
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ContentCopy />}
            sx={{ flex: 1 }}
            onClick={() => setShowDuplicate(true)}
          >
            {t('history.duplicate')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlined />}
            sx={{ flex: 1 }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t('history.delete')}
          </Button>
        </Stack>
      </Stack>

      <DuplicateCompetitionDialog
        open={showDuplicate}
        source={{
          name: competitionDoc.name,
          competitorNames: [...competitionDoc.competitors]
            .sort((a, b) => a.order - b.order)
            .map((c) => c.name),
          disciplineNames: [...competitionDoc.disciplines]
            .sort((a, b) => a.order - b.order)
            .map((d) => d.name),
        }}
        onCancel={() => setShowDuplicate(false)}
        onSubmit={(result) => void handleDuplicateSubmit(result)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title={t('history.deleteConfirmTitle')}
        body={
          deleteError
            ? `${t('history.deleteConfirmBody')} (${deleteError})`
            : t('history.deleteConfirmBody')
        }
        confirmLabel={deleting ? t('common.loading') : t('history.delete')}
        destructive
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteError(null);
        }}
      />
    </Container>
  );
}
