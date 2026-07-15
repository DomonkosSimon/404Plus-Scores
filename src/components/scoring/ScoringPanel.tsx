import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useActiveCompetitionStore } from '../../state/activeCompetition/useActiveCompetitionStore';
import { useSettingsStore } from '../../state/settings/useSettingsStore';
import { ModalHeader } from '../common/ModalHeader';
import { ScoreGrid } from './ScoreGrid';

interface ScoringPanelProps {
  competitionId: string;
  onClose: () => void;
  onFinished: (competitionId: string) => void;
}

export function ScoringPanel({ competitionId, onClose, onFinished }: ScoringPanelProps) {
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
      <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton aria-label={t('common.cancel')} onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  async function handleFinish() {
    await finishCompetition(winDirection);
    onFinished(competitionId);
  }

  return (
    <Stack spacing={2}>
      <ModalHeader title={competition.name} onClose={onClose} closeLabel={t('common.cancel')} />
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
