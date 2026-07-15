import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useActiveCompetitionStore } from '../../state/activeCompetition/useActiveCompetitionStore';
import { useSettingsStore } from '../../state/settings/useSettingsStore';
import { ScoreGrid } from './ScoreGrid';

interface ScoringPanelProps {
  competitionId: string;
  onFinished: (competitionId: string) => void;
}

export function ScoringPanel({ competitionId, onFinished }: ScoringPanelProps) {
  const { t } = useTranslation();
  const competition = useActiveCompetitionStore((s) => s.competition);
  const loadCompetition = useActiveCompetitionStore((s) => s.loadCompetition);
  const updateScore = useActiveCompetitionStore((s) => s.updateScore);
  const reorderCompetitors = useActiveCompetitionStore((s) => s.reorderCompetitors);
  const finishCompetition = useActiveCompetitionStore((s) => s.finishCompetition);
  const winDirection = useSettingsStore((s) => s.winDirection);
  const [reorderEnabled, setReorderEnabled] = useState(false);

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

  async function handleFinish() {
    await finishCompetition(winDirection);
    onFinished(competitionId);
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">{competition.name}</Typography>
      </Box>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={reorderEnabled}
              onChange={(event) => setReorderEnabled(event.target.checked)}
            />
          }
          label={t('scoring.allowReorder')}
        />
        <Typography variant="body2" color="text.secondary">
          {reorderEnabled ? t('scoring.reorderHint') : t('scoring.reorderLockedHint')}
        </Typography>
      </Box>
      <ScoreGrid
        competition={competition}
        onScoreChange={(competitorId, disciplineId, value) =>
          void updateScore(competitorId, disciplineId, value)
        }
        onReorder={(ids) => void reorderCompetitors(ids)}
        reorderEnabled={reorderEnabled}
      />
      <Button variant="contained" size="large" onClick={() => void handleFinish()}>
        {t('scoring.finish')}
      </Button>
    </Stack>
  );
}
