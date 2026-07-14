import { useEffect } from 'react';
import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActiveCompetitionStore } from '../../state/activeCompetition/useActiveCompetitionStore';
import { useSettingsStore } from '../../state/settings/useSettingsStore';
import { ScoreGrid } from '../../components/scoring/ScoreGrid';

export function ScoringScreen() {
  const { t } = useTranslation();
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const competition = useActiveCompetitionStore((s) => s.competition);
  const loadCompetition = useActiveCompetitionStore((s) => s.loadCompetition);
  const updateScore = useActiveCompetitionStore((s) => s.updateScore);
  const reorderCompetitors = useActiveCompetitionStore((s) => s.reorderCompetitors);
  const finishCompetition = useActiveCompetitionStore((s) => s.finishCompetition);
  const winDirection = useSettingsStore((s) => s.winDirection);

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

  async function handleFinish() {
    if (!competitionId) return;
    await finishCompetition(winDirection);
    navigate(`/competition/${competitionId}/results`, { replace: true });
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5">{competition.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('scoring.reorderHint')}
          </Typography>
        </Box>
        <ScoreGrid
          competition={competition}
          onScoreChange={(competitorId, disciplineId, value) =>
            void updateScore(competitorId, disciplineId, value)
          }
          onReorder={(ids) => void reorderCompetitors(ids)}
        />
        <Button variant="contained" size="large" onClick={() => void handleFinish()}>
          {t('scoring.finish')}
        </Button>
      </Stack>
    </Container>
  );
}
