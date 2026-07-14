import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NumberStepperField } from '../wizard/NumberStepperField';
import { DynamicNameList } from '../wizard/DynamicNameList';
import { isValidName, MAX_COMPETITORS, MAX_DISCIPLINES, MIN_COMPETITORS, MIN_DISCIPLINES } from '../../domain/validation';

interface DuplicateSource {
  name: string;
  competitorNames: string[];
  disciplineNames: string[];
}

interface DuplicateCompetitionDialogProps {
  open: boolean;
  source: DuplicateSource | null;
  onCancel: () => void;
  onSubmit: (result: { name: string; competitorNames: string[]; disciplineNames: string[] }) => void;
}

function resizeNames(names: string[], count: number): string[] {
  const resized = names.slice(0, count);
  while (resized.length < count) resized.push('');
  return resized;
}

export function DuplicateCompetitionDialog({
  open,
  source,
  onCancel,
  onSubmit,
}: DuplicateCompetitionDialogProps) {
  const { t } = useTranslation();
  const [reuseName, setReuseName] = useState(true);
  const [newName, setNewName] = useState('');
  const [reuseCompetitors, setReuseCompetitors] = useState(true);
  const [competitorCount, setCompetitorCount] = useState(MIN_COMPETITORS);
  const [competitorNames, setCompetitorNames] = useState<string[]>([]);
  const [reuseDisciplines, setReuseDisciplines] = useState(true);
  const [disciplineCount, setDisciplineCount] = useState(MIN_DISCIPLINES);
  const [disciplineNames, setDisciplineNames] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !source) return;
    setReuseName(true);
    setNewName('');
    setReuseCompetitors(true);
    setCompetitorCount(source.competitorNames.length);
    setCompetitorNames(resizeNames([], source.competitorNames.length));
    setReuseDisciplines(true);
    setDisciplineCount(source.disciplineNames.length);
    setDisciplineNames(resizeNames([], source.disciplineNames.length));
  }, [open, source]);

  if (!source) return null;

  const finalName = reuseName ? source.name : newName.trim();
  const finalCompetitorNames = reuseCompetitors ? source.competitorNames : competitorNames;
  const finalDisciplineNames = reuseDisciplines ? source.disciplineNames : disciplineNames;

  const canSubmit =
    isValidName(finalName) &&
    finalCompetitorNames.length > 0 &&
    finalCompetitorNames.every(isValidName) &&
    finalDisciplineNames.length > 0 &&
    finalDisciplineNames.every(isValidName);

  function handleSubmit() {
    onSubmit({
      name: finalName,
      competitorNames: finalCompetitorNames,
      disciplineNames: finalDisciplineNames,
    });
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{t('history.duplicateDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch checked={reuseName} onChange={(e) => setReuseName(e.target.checked)} />
              }
              label={t('history.duplicateDialog.name')}
            />
            {reuseName ? (
              <Typography color="text.secondary">{source.name}</Typography>
            ) : (
              <TextField
                autoFocus
                placeholder={t('history.duplicateDialog.newNamePlaceholder')}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            )}
          </Stack>

          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={reuseCompetitors}
                  onChange={(e) => setReuseCompetitors(e.target.checked)}
                />
              }
              label={t('history.duplicateDialog.competitors')}
            />
            {reuseCompetitors ? (
              <Typography color="text.secondary">{source.competitorNames.join(', ')}</Typography>
            ) : (
              <Stack spacing={1.5}>
                <NumberStepperField
                  value={competitorCount}
                  min={MIN_COMPETITORS}
                  max={MAX_COMPETITORS}
                  label={t('common.competitor')}
                  onChange={(count) => {
                    setCompetitorCount(count);
                    setCompetitorNames((prev) => resizeNames(prev, count));
                  }}
                />
                <DynamicNameList
                  names={competitorNames}
                  labelFor={(index) => t('wizard.competitorNames.label', { index: index + 1 })}
                  placeholder={t('wizard.competitorNames.placeholder')}
                  onChange={(index, name) =>
                    setCompetitorNames((prev) => {
                      const next = [...prev];
                      next[index] = name;
                      return next;
                    })
                  }
                />
              </Stack>
            )}
          </Stack>

          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={reuseDisciplines}
                  onChange={(e) => setReuseDisciplines(e.target.checked)}
                />
              }
              label={t('history.duplicateDialog.disciplines')}
            />
            {reuseDisciplines ? (
              <Typography color="text.secondary">{source.disciplineNames.join(', ')}</Typography>
            ) : (
              <Stack spacing={1.5}>
                <NumberStepperField
                  value={disciplineCount}
                  min={MIN_DISCIPLINES}
                  max={MAX_DISCIPLINES}
                  label={t('common.discipline')}
                  onChange={(count) => {
                    setDisciplineCount(count);
                    setDisciplineNames((prev) => resizeNames(prev, count));
                  }}
                />
                <DynamicNameList
                  names={disciplineNames}
                  labelFor={(index) => t('wizard.disciplineNames.label', { index: index + 1 })}
                  placeholder={t('wizard.disciplineNames.placeholder')}
                  onChange={(index, name) =>
                    setDisciplineNames((prev) => {
                      const next = [...prev];
                      next[index] = name;
                      return next;
                    })
                  }
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button variant="contained" disabled={!canSubmit} onClick={handleSubmit}>
          {t('history.duplicateDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
