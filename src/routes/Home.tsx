import { useEffect, useState } from 'react';
import { AddCircle, ContentCopy, DeleteOutlined, PlayArrow } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  createCompetition,
  deleteCompetition,
  listInProgress,
  listPendingSync,
} from '../storage/competitionsRepo';
import { deleteSyncedCompetition, subscribeToHistory, trySync } from '../sync/syncService';
import { useOnlineStatus } from '../sync/connectivity';
import type { Competition, FirestoreCompetitionDoc } from '../domain/types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { DuplicateCompetitionDialog } from '../components/history/DuplicateCompetitionDialog';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';
import { ScoringModal } from '../components/scoring/ScoringModal';
import { WizardModal } from './wizard/WizardModal';

type DuplicateSource = { name: string; competitorNames: string[]; disciplineNames: string[] };
type DeleteTarget = { kind: 'pending' | 'synced'; id: string };

export function Home() {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const [inProgress, setInProgress] = useState<Competition[]>([]);
  const [pending, setPending] = useState<Competition[]>([]);
  const [synced, setSynced] = useState<FirestoreCompetitionDoc[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [duplicateSource, setDuplicateSource] = useState<DuplicateSource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedHistoryDoc, setSelectedHistoryDoc] = useState<FirestoreCompetitionDoc | null>(
    null,
  );
  const [scoringCompetitionId, setScoringCompetitionId] = useState<string | null>(null);

  useEffect(() => {
    void listInProgress().then(setInProgress);
  }, []);

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

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      if (deleteTarget.kind === 'pending') {
        await deleteCompetition(deleteTarget.id);
        setPending(await listPendingSync());
      } else {
        await deleteSyncedCompetition(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : String(error));
    } finally {
      setDeleting(false);
    }
  }

  async function handleDuplicateSubmit(result: {
    name: string;
    competitorNames: string[];
    disciplineNames: string[];
  }) {
    const competition = await createCompetition(result);
    setDuplicateSource(null);
    setScoringCompetitionId(competition.id);
  }

  const hasHistory = pending.length > 0 || synced.length > 0;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddCircle />}
          onClick={() => setWizardOpen(true)}
        >
          {t('home.newCompetition')}
        </Button>

        {inProgress.length > 0 && (
          <Stack spacing={1.5}>
            {inProgress.map((competition) => (
              <Card key={competition.id} variant="outlined">
                <CardActionArea
                  sx={{ p: 2 }}
                  onClick={() => setScoringCompetitionId(competition.id)}
                >
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <PlayArrow color="primary" />
                    <Stack>
                      <Typography variant="subtitle1">{competition.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('home.resumeSubtitle')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        )}

        <Divider />

        <Stack spacing={1.5}>
          <Typography variant="h6">{t('history.title')}</Typography>

          {!hasHistory && <Typography color="text.secondary">{t('history.empty')}</Typography>}

          {pending.length > 0 && (
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                {t('history.pendingSync')}
              </Typography>
              {pending.map((competition) => (
                <Card key={competition.id} variant="outlined">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}
                  >
                    <Typography noWrap sx={{ flex: 1 }}>
                      {competition.name}
                    </Typography>
                    <Button
                      size="small"
                      disabled={!online || retryingId === competition.id}
                      onClick={() => void handleRetry(competition)}
                    >
                      {retryingId === competition.id ? t('history.retrying') : t('history.retry')}
                    </Button>
                    <IconButton
                      size="small"
                      aria-label={t('history.duplicate')}
                      onClick={() =>
                        setDuplicateSource({
                          name: competition.name,
                          competitorNames: [...competition.competitors]
                            .sort((a, b) => a.order - b.order)
                            .map((c) => c.name),
                          disciplineNames: [...competition.disciplines]
                            .sort((a, b) => a.order - b.order)
                            .map((d) => d.name),
                        })
                      }
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={t('history.delete')}
                      onClick={() => setDeleteTarget({ kind: 'pending', id: competition.id })}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Stack>
                </Card>
              ))}
              {!online && <Alert severity="info">{t('results.offlineDialog.body')}</Alert>}
            </Stack>
          )}

          {synced.length > 0 && (
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                {t('history.synced')}
              </Typography>
              {synced.map((doc) => (
                <Card key={doc.id} variant="outlined">
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <CardActionArea
                      sx={{ p: 2, flex: 1, minWidth: 0 }}
                      onClick={() => setSelectedHistoryDoc(doc)}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <Typography noWrap sx={{ flex: 1, minWidth: 0 }}>
                          {doc.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ flexShrink: 0 }}
                        >
                          {new Date(doc.finishedAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </CardActionArea>
                    <IconButton
                      size="small"
                      sx={{ mr: 0.5 }}
                      aria-label={t('history.duplicate')}
                      onClick={() =>
                        setDuplicateSource({
                          name: doc.name,
                          competitorNames: [...doc.competitors]
                            .sort((a, b) => a.order - b.order)
                            .map((c) => c.name),
                          disciplineNames: [...doc.disciplines]
                            .sort((a, b) => a.order - b.order)
                            .map((d) => d.name),
                        })
                      }
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ mr: 1 }}
                      aria-label={t('history.delete')}
                      onClick={() => setDeleteTarget({ kind: 'synced', id: doc.id })}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <DuplicateCompetitionDialog
        open={duplicateSource !== null}
        source={duplicateSource}
        onCancel={() => setDuplicateSource(null)}
        onSubmit={(result) => void handleDuplicateSubmit(result)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={t('history.deleteConfirmTitle')}
        body={deleteError ? `${t('history.deleteConfirmBody')} (${deleteError})` : t('history.deleteConfirmBody')}
        confirmLabel={deleting ? t('common.loading') : t('history.delete')}
        destructive
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
      />

      <WizardModal
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          // The competition may now be in_progress (closed before finishing),
          // pending_sync, or synced (finished within the modal) — refresh
          // both lists so it shows up in the right place.
          void listInProgress().then(setInProgress);
          void listPendingSync().then(setPending);
        }}
      />

      <ScoringModal
        competitionId={scoringCompetitionId}
        onClose={() => {
          setScoringCompetitionId(null);
          void listInProgress().then(setInProgress);
          void listPendingSync().then(setPending);
        }}
      />

      <HistoryDetailModal
        doc={selectedHistoryDoc}
        onClose={() => setSelectedHistoryDoc(null)}
        onDuplicate={(doc) => {
          setSelectedHistoryDoc(null);
          setDuplicateSource({
            name: doc.name,
            competitorNames: [...doc.competitors]
              .sort((a, b) => a.order - b.order)
              .map((c) => c.name),
            disciplineNames: [...doc.disciplines]
              .sort((a, b) => a.order - b.order)
              .map((d) => d.name),
          });
        }}
        onDeleteRequest={(doc) => {
          setSelectedHistoryDoc(null);
          setDeleteTarget({ kind: 'synced', id: doc.id });
        }}
      />
    </Container>
  );
}
