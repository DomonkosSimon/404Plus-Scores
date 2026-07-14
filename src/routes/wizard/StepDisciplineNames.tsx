import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWizardDispatch, useWizardState } from '../../state/wizard/wizardContext';
import { DynamicNameList } from '../../components/wizard/DynamicNameList';
import { isValidName } from '../../domain/validation';
import { createCompetition } from '../../storage/competitionsRepo';
import { wizardPaths } from './paths';

export function StepDisciplineNames() {
  const { t } = useTranslation();
  const { disciplineCount, disciplineNames, name, competitorNames } = useWizardState();
  const dispatch = useWizardDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (disciplineCount === null) navigate(wizardPaths[3], { replace: true });
  }, [disciplineCount, navigate]);

  if (disciplineCount === null) return null;

  const canProceed = disciplineNames.length > 0 && disciplineNames.every(isValidName);

  async function handleCreate() {
    setSubmitting(true);
    const competition = await createCompetition({
      name,
      competitorNames,
      disciplineNames,
    });
    // Navigating away from /new/* unmounts the WizardProvider, which already
    // discards this state — dispatching RESET here would race with that
    // unmount and could redirect back into the wizard via the guard effects.
    navigate(`/competition/${competition.id}/scoring`, { replace: true });
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
    navigate(wizardPaths[3]);
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('wizard.disciplineNames.title')}</Typography>
      <DynamicNameList
        names={disciplineNames}
        labelFor={(index) => t('wizard.disciplineNames.label', { index: index + 1 })}
        placeholder={t('wizard.disciplineNames.placeholder')}
        onChange={(index, disciplineName) =>
          dispatch({ type: 'SET_DISCIPLINE_NAME', index, name: disciplineName })
        }
      />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" size="large" onClick={handleBack} disabled={submitting}>
          {t('wizard.back')}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canProceed || submitting}
          onClick={handleCreate}
          sx={{ flex: 1 }}
        >
          {t('wizard.create')}
        </Button>
      </Stack>
    </Stack>
  );
}
